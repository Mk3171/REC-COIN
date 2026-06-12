const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const path = require('path');
const https = require('https');

const app = express();
app.use(express.json());

// ====== MONGODB ======
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.log('MongoDB error:', err));

// ====== SECURITY SYSTEM ======
const crypto = require('crypto');

// 1. Validate Telegram WebApp initData (prevents fake requests)
function validateTelegramInit(initData) {
  try {
    if (!initData) return false;
    var data = new URLSearchParams(initData);
    var hash = data.get('hash');
    if (!hash) return false;
    data.delete('hash');
    var entries = [];
    data.forEach(function(v, k) { entries.push(k + '=' + v); });
    entries.sort();
    var nl = String.fromCharCode(10);
    var dataCheckString = entries.join(nl);
    var secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.BOT_TOKEN).digest();
    var expectedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    return hash === expectedHash;
  } catch(e) { return false; }
}

// 2. Rate limiter (max requests per user per minute)
var rateLimits = {};
function checkRateLimit(userId, maxPerMin) {
  var now = Date.now();
  var key = String(userId);
  if (!rateLimits[key]) rateLimits[key] = [];
  rateLimits[key] = rateLimits[key].filter(function(t) { return now - t < 60000; });
  if (rateLimits[key].length >= maxPerMin) return false;
  rateLimits[key].push(now);
  return true;
}
setInterval(function() { rateLimits = {}; }, 300000); // clear every 5min

// 3. Anti-cheat: validate balance increases are realistic
const ADMIN_ID = 6995765586;
const GROUP_CHAT_ID = -1003957241357;
const BLOCKS_CHANNEL_ID = -1004293036864;

// ====== BLOCK MINING SYSTEM ======
// Every tap has 1/500 chance to find a block
// Block rewards based on user's mining level

function isRealisticIncrease(oldRec, newRec, oldRecord, newRecord, timeDiff, telegramId) {
  // Admin always passes
  if (String(telegramId) === String(ADMIN_ID)) return true;
  // If RECORD decreased (spending on upgrades), always allow
  if (newRecord < oldRecord) return true;
  // Updated max rates based on current game formulas:
  // Cards: 130 cards × level 100 = 130 × 1,000,000 RECORD/s
  // Limited cards (12) get 3x = 12 × 3,000,000 RECORD/s extra
  // Tap: (100+1)*2 = 202 per tap × 15 taps/s = 3,030 RECORD/s (negligible)
  var maxRecordPerSec = (130 * 1000000) + (12 * 2000000); // ~154M RECORD/s max
  // REC: 130 cards × 0.0001/s × limited 3x bonus
  var maxRecPerSec = (130 * 0.0001) + (12 * 0.0002); // ~0.0154 REC/s max
  var seconds = Math.max(timeDiff / 1000, 3); // min 3 seconds window
  var recIncrease = newRec - oldRec;
  var recordIncrease = newRecord - oldRecord;
  if (recIncrease > maxRecPerSec * seconds * 2) return false;      // 2x tolerance
  if (recordIncrease > maxRecordPerSec * seconds * 2) return false; // 2x tolerance
  return true;
}

// ====== USER SCHEMA ======
const UserSchema = new mongoose.Schema({
  telegramId:    { type: Number, unique: true, required: true },
  username:      { type: String, default: '' },
  firstName:     { type: String, default: '' },
  lastName:      { type: String, default: '' },
  record:        { type: Number, default: 0 },
  rec:           { type: Number, default: 0 },
  energy:        { type: Number, default: 1000 },
  maxEnergy:     { type: Number, default: 1000 },
  tapLevelVal:   { type: Number, default: 0 },
  energyLevelVal:{ type: Number, default: 0 },
  tapPowerVal:   { type: Number, default: 1 },
  completedTasks:{ type: [String], default: [] },
  cardLevels:    { type: Object, default: {} },
  cardUpgrades:  { type: Object, default: {} },
  refCount:      { type: Number, default: 0 },
  claimedMilest: { type: [Number], default: [] },
  playerXP:      { type: Number,  default: 0 },
  pendingRec:    { type: Number,  default: 0 },
  airdropScore:  { type: Number,  default: 0 },
  claimedLevels: { type: Object,  default: {} },
  referredBy:    { type: String, default: '' },
  walletAddress: { type: String, default: '' },
  language:      { type: String, default: 'ar' },
  energyRefill:  { type: Number, default: 0 },
  dailyWithdrawn:{ type: Number, default: 0 },
  lastWithdrawDate: { type: String, default: '' },
  lastSeen:      { type: Date, default: Date.now },
  createdAt:     { type: Date, default: Date.now },
  banned:        { type: Boolean, default: false },
  banReason:     { type: String, default: '' },
  lastSaveTime:  { type: Number, default: 0 },
  suspiciousScore: { type: Number, default: 0 },
  // New fields for daily/task persistence
  dailyLogin:      { type: Object, default: { day: 0, lastDate: '' } },
  mysteryLastDate: { type: String, default: '' },
  dailyTasksData:  { type: Object, default: {} },
  cardTasksClaimed:{ type: [String], default: [] },
  totalTaps:       { type: Number, default: 0 },
  lastBlockDate:   { type: String, default: '' },
  totalBlocksFound:{ type: Number, default: 0 },
  refillData:      { type: Object, default: {date:'',count:3} },
  miningSpeed:     { type: Number, default: 0 },
  recordMiningSpeed: { type: Number, default: 0 },
  referredByL2:    { type: String, default: '' },
  referredByL3:    { type: String, default: '' },
  totalRefCommission: { type: Number, default: 0 },
  comboProgress:   { type: Object, default: { date: '', done: [], claimed: false } }
});

const User = mongoose.model('User', UserSchema);

// ====== WITHDRAWAL SCHEMA ======
const WithdrawSchema = new mongoose.Schema({
  telegramId:  { type: Number, required: true },
  username:    { type: String, default: '' },
  walletAddress: { type: String, required: true },
  amount:      { type: Number, required: true },
  fee:         { type: Number, default: 70 },
  netAmount:   { type: Number, required: true },
  status:      { type: String, default: 'pending' }, // pending, sent, failed
  txHash:      { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
});
const Withdrawal = mongoose.model('Withdrawal', WithdrawSchema);

// ====== WEEKLY CHALLENGE SCHEMA ======
const WeeklySchema = new mongoose.Schema({
  weekId:     { type: String, unique: true }, // e.g. "2026-W22"
  startDate:  Date,
  endDate:    Date,
  distributed:{ type: Boolean, default: false },
  top100:     { type: Array, default: [] }
});
const WeeklyChallenge = mongoose.model('WeeklyChallenge', WeeklySchema);

// ====== DAILY COMBO SCHEMA ======
const DailyComboSchema = new mongoose.Schema({
  date:   { type: String, required: true, unique: true },
  cards:  [{ key: String, categoryIndex: Number, cardIndex: Number }],
  reward: { type: Number, default: 5 }
});
const DailyCombo = mongoose.model('DailyCombo', DailyComboSchema);

// ====== WEEKLY DISTRIBUTION ======
function getWeekId(date) {
  var d = date || new Date();
  var onejan = new Date(d.getFullYear(), 0, 1);
  var week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + String(week).padStart(2, '0');
}

function getWeekStart() {
  var now = new Date();
  var day = now.getDay();
  var diff = now.getDate() - day + (day === 0 ? -6 : 1);
  var monday = new Date(now.setDate(diff));
  monday.setHours(0,0,0,0);
  return monday;
}

async function distributeWeeklyRewards() {
  try {
    var weekId = getWeekId();
    var existing = await WeeklyChallenge.findOne({ weekId });
    if (existing && existing.distributed) return;

    var top100 = await User.find({ rec: { $gt: 0 } })
      .sort({ rec: -1 }).limit(100)
      .select('telegramId username firstName walletAddress record rec');

    if (top100.length === 0) return;

    // Distribution amounts
    var rewards = {};
    if (top100[0]) rewards[top100[0].telegramId] = 250;
    if (top100[1]) rewards[top100[1].telegramId] = 150;
    if (top100[2]) rewards[top100[2].telegramId] = 100;

    // Ranks 4-100: 500 REC distributed equally
    var pool500 = top100.slice(3);
    if(pool500.length > 0) {
      var shareEach = parseFloat((500 / pool500.length).toFixed(4));
      pool500.forEach(function(user) {
        rewards[user.telegramId] = shareEach;
      });
    }

    // Send rewards
    for (var telegramId in rewards) {
      var amount = rewards[telegramId];
      var user = top100.find(function(u) { return u.telegramId == telegramId; });
      if (user && user.walletAddress) {
        await sendJetton(user.walletAddress, amount, 'REC Weekly Reward');
      }
      await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        { $inc: { rec: amount } }
      );
    }

    // Save to DB
    await WeeklyChallenge.findOneAndUpdate(
      { weekId },
      { weekId, startDate: getWeekStart(), endDate: new Date(), distributed: true, top100: top100.map(function(u,i){ return { rank: i+1, telegramId: u.telegramId, username: u.username || u.firstName, record: u.record, reward: rewards[u.telegramId] || 0 }; }) },
      { upsert: true }
    );

    console.log('Weekly rewards distributed ✅ Week:', weekId);
  } catch(e) { console.log('Weekly distribution error:', e.message); }
}

// Check every hour if weekly distribution needed
setInterval(async function() {
  var now = new Date();
  if (now.getDay() === 1 && now.getHours() === 0) { // Monday midnight
    await distributeWeeklyRewards();
  }
}, 3600000);

// ====== TON TRANSFER ======
const REC_CONTRACT = 'EQCNkOinRhMSplM0DzP18Fz-4WV293YMHF6umS9tGsvOGDV9';
const FEE_WALLET   = 'UQD-FoGlRG5pBxZpkf3H9ZOsNTL5basBbTEZE8zvMgHLB99o';
const WITHDRAW_FEE = 150;
const MIN_WITHDRAW = 50000;
const MAX_WITHDRAW = 100000;
const DAILY_LIMIT_DEFAULT = 10000;

async function sendJetton(toAddress, amount, comment) {
  try {
    const { TonClient, WalletContractV4, JettonMaster, internal, toNano, Address, beginCell } = require('@ton/ton');
    const { mnemonicToPrivateKey } = require('@ton/crypto');

    const mnemonic = process.env.BOT_WALLET_MNEMONIC.split(' ');
    const keyPair = await mnemonicToPrivateKey(mnemonic);

    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY || ''
    });

    const wallet = WalletContractV4.create({
      publicKey: keyPair.publicKey,
      workchain: 0
    });

    const contract = client.open(wallet);
    const seqno = await contract.getSeqno();

    const jettonMaster = client.open(JettonMaster.create(Address.parse(REC_CONTRACT)));
    const jettonWalletAddr = await jettonMaster.getWalletAddress(wallet.address);

    const forwardPayload = beginCell()
      .storeUint(0, 32)
      .storeStringTail(comment || 'REC Mining Withdrawal')
      .endCell();

    const transferBody = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(0, 64)
      .storeCoins(BigInt(amount) * BigInt(10 ** 9))
      .storeAddress(Address.parse(toAddress))
      .storeAddress(wallet.address)
      .storeBit(false)
      .storeCoins(toNano('0.01'))
      .storeBit(true)
      .storeRef(forwardPayload)
      .endCell();

    await contract.sendTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          to: jettonWalletAddr,
          value: toNano('0.05'),
          body: transferBody
        })
      ]
    });

    return { success: true };
  } catch(e) {
    console.log('Jetton transfer error:', e.message);
    return { success: false, error: e.message };
  }
}

// ====== BOT ======
const bot = new TelegramBot(process.env.BOT_TOKEN);
const MINI_APP_URL = 'https://rec-coin.onrender.com';

function getWelcomeText(username, lang, refId) {
  const isArabic = lang === 'ar';
  const isUkrainian = lang === 'uk';
  const isChinese = lang === 'zh' || lang === 'zh-hans' || lang === 'zh-hant';
  if (isArabic) {
    return refId
      ? `مرحباً ${username}! 🎮\n\nتمت دعوتك!\nابدأ التعدين واجمع عملات REC! 🔴`
      : `مرحباً ${username}! 🎮\n\n🔴 ابدأ التعدين واجمع عملات REC!\n⚡ رقّ البطاقات وزد سرعة التعدين\n👥 ادعُ أصدقاءك واربح مكافآت`;
  } else if (isUkrainian) {
    return `Привіт ${username}! 🎮\n\n🔴 Почніть майнінг і збирайте REC!\n⚡ Покращуйте картки\n👥 Запрошуйте друзів`;
  } else if (isChinese) {
    return `你好 ${username}！🎮\n\n🔴 开始挖矿并收集REC！\n⚡ 升级卡片\n👥 邀请朋友`;
  } else {
    return refId
      ? `Welcome ${username}! 🎮\n\nYou were invited!\nStart mining and collect REC coins! 🔴`
      : `Welcome ${username}! 🎮\n\n🔴 Start mining and collect REC coins!\n⚡ Upgrade your cards to mine faster\n👥 Invite friends and earn rewards`;
  }
}

function getButtonText(lang) {
  if (lang === 'ar') return '🚀 ابدأ التعدين';
  if (lang === 'uk') return '🚀 Почати майнінг';
  if (lang === 'zh' || lang === 'zh-hans') return '🚀 开始挖矿';
  return '🚀 Start Mining';
}

bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const from = msg.from;
  const lang = from.language_code || 'en';
  const param = match[1] ? match[1].trim() : '';
  const refId = param.startsWith('ref') ? param.replace('ref', '') : '';

  if (param.startsWith('buy_')) {
    const buyKey = param.replace('buy_', '');
    const products = {
      energy:      { title: '⚡ شحن طاقة فوري',    description: 'يرجع طاقتك كاملة فوراً',              payload: 'energy',      amount: 15  },
      record_500k: { title: '💰 500,000 RECORD',     description: '500,000 RECORD تضاف لرصيدك فوراً',   payload: 'record_500k', amount: 50  },
      record_3m:   { title: '💰 3,000,000 RECORD',   description: '3,000,000 RECORD تضاف لرصيدك فوراً', payload: 'record_3m',   amount: 200 },
      skip_timer:  { title: '🚀 تخطي وقت الانتظار', description: 'أكمل ترقية البطاقة فوراً',            payload: 'skip_timer',  amount: 100 }
    };
    const product = products[buyKey];
    if (product) {
      try {
        await bot.sendInvoice(chatId, product.title, product.description, product.payload, '', 'XTR', [{ label: product.title, amount: product.amount }]);
      } catch(e) { console.log('Invoice error:', e.message); }
      return;
    }
  }

  try {
    const existing = await User.findOne({ telegramId: from.id });
    if (!existing) {
      var l2Id = '', l3Id = '';
      if (refId) {
        var l1User = await User.findOne({ telegramId: parseInt(refId) });
        if (l1User) {
          l2Id = l1User.referredBy || '';
          if (l2Id) {
            var l2User = await User.findOne({ telegramId: parseInt(l2Id) });
            if (l2User) l3Id = l2User.referredBy || '';
          }
        }
      }
      await new User({ telegramId: from.id, username: from.username || '', firstName: from.first_name || '', lastName: from.last_name || '', language: lang, referredBy: refId || '', referredByL2: l2Id, referredByL3: l3Id }).save();
      if (refId) await User.findOneAndUpdate({ telegramId: parseInt(refId) }, { $inc: { refCount: 1 } });
    } else {
      // ✅ لو مستخدم موجود بدون إحالة وجاء عبر رابط — احفظ الإحالة
      if (refId && !existing.referredBy && existing.telegramId !== parseInt(refId)) {
        var l2Id = '', l3Id = '';
        var l1User = await User.findOne({ telegramId: parseInt(refId) });
        if (l1User) {
          l2Id = l1User.referredBy || '';
          if (l2Id) {
            var l2User = await User.findOne({ telegramId: parseInt(l2Id) });
            if (l2User) l3Id = l2User.referredBy || '';
          }
        }
        await User.findOneAndUpdate(
          { telegramId: from.id },
          { lastSeen: new Date(), username: from.username || existing.username,
            referredBy: refId, referredByL2: l2Id, referredByL3: l3Id }
        );
        await User.findOneAndUpdate({ telegramId: parseInt(refId) }, { $inc: { refCount: 1 } });
      } else {
        await User.findOneAndUpdate({ telegramId: from.id }, { lastSeen: new Date(), username: from.username || existing.username });
      }
    }
  } catch(e) { console.log('User save error:', e); }

  const welcomeText = getWelcomeText(from.first_name || from.username, lang, refId);
  const buttonText = getButtonText(lang);
  try {
    await bot.sendPhoto(chatId, MINI_APP_URL + '/logo.jpeg', { caption: welcomeText, reply_markup: { inline_keyboard: [[{ text: buttonText, web_app: { url: MINI_APP_URL } }]] } });
  } catch(e) {
    await bot.sendMessage(chatId, welcomeText, { reply_markup: { inline_keyboard: [[{ text: buttonText, web_app: { url: MINI_APP_URL } }]] } });
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const products = {
    buy_energy:      { title: '⚡ شحن طاقة فوري',    description: 'يرجع طاقتك كاملة فوراً',              payload: 'energy',      amount: 15  },
    buy_record_500k: { title: '💰 500,000 RECORD',     description: '500,000 RECORD تضاف لرصيدك فوراً',   payload: 'record_500k', amount: 50  },
    buy_record_3m:   { title: '💰 3,000,000 RECORD',   description: '3,000,000 RECORD تضاف لرصيدك فوراً', payload: 'record_3m',   amount: 200 },
    buy_skip:        { title: '🚀 تخطي وقت الانتظار', description: 'أكمل ترقية البطاقة فوراً',            payload: 'skip_timer',  amount: 100 }
  };
  const product = products[data];
  if (!product) return;
  try {
    await bot.sendInvoice(chatId, product.title, product.description, product.payload, '', 'XTR', [{ label: product.title, amount: product.amount }]);
  } catch(e) { console.log('Invoice error:', e.message); }
  await bot.answerCallbackQuery(query.id);
});

bot.on('pre_checkout_query', async (query) => {
  try { await bot.answerPreCheckoutQuery(query.id, true); } catch(e) {}
});

bot.on('message', async (msg) => {
  if (!msg.successful_payment) return;
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const payload = msg.successful_payment.invoice_payload;
  try {
    let update = {};
    let rewardText = '';
    if (payload === 'energy') {
      update = { energyRefill: Date.now() };
      rewardText = '⚡ تم شحن طاقتك بالكامل!';
    } else if (payload === 'record_500k') {
      const user = await User.findOne({ telegramId: userId });
      update = { record: (user ? user.record : 0) + 500000 };
      rewardText = '💰 تمت إضافة 500,000 RECORD!';
    } else if (payload === 'record_3m') {
      const user = await User.findOne({ telegramId: userId });
      update = { record: (user ? user.record : 0) + 3000000 };
      rewardText = '💰 تمت إضافة 3,000,000 RECORD!';
    } else if (payload === 'skip_timer') {
      update = { cardUpgrades: {} };
      rewardText = '🚀 تم إلغاء أوقات الانتظار!';
    }
    await User.findOneAndUpdate({ telegramId: userId }, update, { upsert: true });
    await bot.sendMessage(chatId, `✅ ${rewardText}\n\n🔄 افتح البوت لترى التغييرات!`, {
      reply_markup: { inline_keyboard: [[{ text: '🚀 افتح البوت', web_app: { url: MINI_APP_URL } }]] }
    });
  } catch(e) { console.log('Payment error:', e); }
});

// ====== API: LEADERBOARD ======
// ====== MINING SPEED CALCULATOR (matches app.js formula exactly) ======
function cardRECSpeed(lvl) {
  if(lvl <= 0) return 0;
  return 0.0000001 * Math.pow(1000, (lvl-1)/99);
}
function calcMiningSpeed(cardLevels) {
  if(!cardLevels || typeof cardLevels !== 'object') return 0;
  var speed = 0;
  try {
    Object.keys(cardLevels).forEach(function(key) {
      var lvl = cardLevels[key] || 0;
      var m = (parseInt(key.split('_')[0]) === 4) ? 3 : 1; // limited cards x3
      speed += cardRECSpeed(lvl) * m;
    });
  } catch(e) {}
  return parseFloat(speed.toFixed(8));
}

// ✅ NEW: Calculate RECORD mining speed from cardLevels (mirrors app.js formula)
function calcRecordMiningSpeed(cardLevels, tapLevelVal) {
  if(!cardLevels || typeof cardLevels !== 'object') return 0;
  var speed = 0;
  try {
    Object.keys(cardLevels).forEach(function(key) {
      var lvl = cardLevels[key] || 0;
      if(lvl <= 0) return;
      // RECORD speed per card: increases with level
      var cardRecordSpeed = Math.floor(Math.pow(1.5, lvl - 1) * 10);
      var m = (parseInt(key.split('_')[0]) === 4) ? 3 : 1;
      speed += cardRecordSpeed * m;
    });
  } catch(e) {}
  return speed;
}

app.get('/api/leaderboard/global', async (req, res) => {
  try {
    var allUsers = await User.find({ banned: false })
      .sort({ rec: -1 }).limit(100)
      .select('telegramId username firstName rec miningSpeed cardLevels vip lastSeen')
      .lean();
    res.json({ top100: allUsers.map(function(u, i) {
      var speed = u.miningSpeed > 0 ? u.miningSpeed : calcMiningSpeed(u.cardLevels);
      return { rank: i+1, telegramId: u.telegramId, name: u.username||u.firstName||'User', rec: u.rec, miningSpeed: speed, vip: u.vip && u.vip.tier > 0 && u.vip.expiry > Date.now() ? u.vip.tier : 0, online: u.lastSeen && (Date.now() - new Date(u.lastSeen).getTime() < 120000) };
    })});
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/leaderboard/myrank/:telegramId', async (req, res) => {
  try {
    var userId = parseInt(req.params.telegramId);
    var allUsers = await User.find({ banned: false }).sort({ rec: -1 }).limit(500)
      .select('telegramId username firstName rec miningSpeed cardLevels lastSeen').lean();
    var myIndex = allUsers.findIndex(function(u) { return u.telegramId === userId; });
    var myRank = myIndex < 0 ? 999 : myIndex + 1;
    var start = Math.max(0, myIndex - 2);
    var end = Math.min(allUsers.length, myIndex + 3);
    var neighbors = myIndex < 0 ? [] : allUsers.slice(start, end).map(function(u, i) {
      var speed = u.miningSpeed > 0 ? u.miningSpeed : calcMiningSpeed(u.cardLevels);
      return { rank: start+i+1, telegramId: u.telegramId, name: u.username||u.firstName||'User', rec: u.rec, miningSpeed: speed, isMe: u.telegramId===userId, vip: u.vip && u.vip.tier > 0 && u.vip.expiry > Date.now() ? u.vip.tier : 0, online: u.lastSeen && (Date.now() - new Date(u.lastSeen).getTime() < 120000) };
    });
    res.json({ myRank, total: allUsers.length, neighbors });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/leaderboard/friends/:telegramId', async (req, res) => {
  try {
    var userId = req.params.telegramId;
    var friends = await User.find({ referredBy: userId })
      .sort({ record: -1 }).limit(100)
      .select('telegramId username firstName record rec');
    res.json({ friends: friends.map(function(u, i) {
      return { rank: i+1, telegramId: u.telegramId, name: u.username || u.firstName || 'User', record: u.record, rec: u.rec };
    })});
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/leaderboard/weekly', async (req, res) => {
  try {
    var weekId = getWeekId();
    var wc = await WeeklyChallenge.findOne({ weekId });
    // Calculate exact end of week (next Sunday midnight)
    var now = new Date();
    var day = now.getDay(); // 0=Sun
    var daysUntilSunday = day === 0 ? 7 : 7 - day;
    var endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + daysUntilSunday);
    endOfWeek.setHours(0, 0, 0, 0);
    var daysLeft = Math.max(0, Math.ceil((endOfWeek - now) / 86400000));
    var endTimestamp = endOfWeek.getTime();
    res.json({ weekId, daysLeft, endTimestamp, distributed: wc ? wc.distributed : false, lastWinner: wc ? wc.top100[0] : null });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== API: CREATE INVOICE ======
app.post('/api/create-invoice', async (req, res) => {
  const { product } = req.body;
  const products = {
    energy:      { title: '⚡ شحن طاقة فوري',    description: 'يرجع طاقتك كاملة فوراً',              payload: 'energy',      amount: 15  },
    record_500k: { title: '💰 500,000 RECORD',     description: '500,000 RECORD تضاف لرصيدك فوراً',   payload: 'record_500k', amount: 50  },
    record_3m:   { title: '💰 3,000,000 RECORD',   description: '3,000,000 RECORD تضاف لرصيدك فوراً', payload: 'record_3m',   amount: 200 },
    skip_timer:  { title: '🚀 تخطي وقت الانتظار', description: 'أكمل ترقية البطاقة فوراً',            payload: 'skip_timer',  amount: 100 }
  };
  const p = products[product];
  if (!p) return res.status(400).json({ error: 'Invalid product' });
  try {
    const link = await bot.createInvoiceLink(p.title, p.description, p.payload, '', 'XTR', [{ label: p.title, amount: p.amount }]);
    res.json({ link });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== API: WITHDRAW ======

// ====== VIP PURCHASE ======
const BOT_WALLET_ADDRESS = process.env.BOT_WALLET_ADDRESS || 'UQDu5EqcKVBEE2MJPFCX8z6PP2...'; // set in Render env

app.post('/api/vip/verify', async (req, res) => {
  try {
    const { telegramId, userWallet, tier } = req.body;
    if (!telegramId || !tier) return res.status(400).json({ error: 'Missing params' });

    const user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if VIP already active
    if (user.vip && user.vip.tier >= tier && user.vip.expiry > Date.now()) {
      return res.json({ success: false, error: 'VIP already active' });
    }

    const expectedNano = tier === 1 ? 1000000000 : tier === 2 ? 3000000000 : 10000000000;
    const BOT_WALLET = process.env.BOT_WALLET_ADDRESS || 'UQD-FoGlRG5pBxZpkf3H9ZOsNTL5basBbTEZE8zvMgHLB99o';
    const apiKey = process.env.TONCENTER_API_KEY || '';

    // Get recent transactions to bot wallet
    const txUrl = `https://toncenter.com/api/v2/getTransactions?address=${BOT_WALLET}&limit=20`;
    const txRes = await fetch(txUrl, {
      headers: apiKey ? { 'X-API-Key': apiKey } : {}
    });
    const txData = await txRes.json();

    if (!txData.ok || !txData.result) {
      return res.json({ success: false, error: 'Cannot check transactions' });
    }

    // Look for matching payment in last 5 minutes
    const fiveMinAgo = Math.floor(Date.now()/1000) - 300;
    let found = false;
    let foundTxId = null;

    for (const tx of txData.result) {
      if (tx.utime < fiveMinAgo) continue;
      const inMsg = tx.in_msg;
      if (!inMsg) continue;
      const amount = parseInt(inMsg.value || 0);
      if (amount >= expectedNano * 0.95) {
        // Check not already used
        const alreadyUsed = await User.findOne({ 'vip.txId': tx.transaction_id?.lt });
        if (alreadyUsed) continue;
        found = true;
        foundTxId = tx.transaction_id?.lt;
        break;
      }
    }

    if (!found) {
      return res.json({ success: false, error: 'Payment not found — please wait and try again' });
    }

    // Activate VIP
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await User.findOneAndUpdate(
      { telegramId },
      { vip: { tier, expiry, boxes: {}, txId: foundTxId } }
    );

    // Notify user in their language
    const vipTierName = tier === 1 ? 'I' : tier === 2 ? 'II' : 'III';
    const expiryDate = new Date(expiry).toLocaleDateString();
    const vipMsgs = {
      ar: `👑 تم تفعيل VIP ${vipTierName} بنجاح!\n⏳ تنتهي في: ${expiryDate}`,
      en: `👑 VIP ${vipTierName} activated successfully!\n⏳ Expires: ${expiryDate}`,
      ru: `👑 VIP ${vipTierName} успешно активирован!\n⏳ Истекает: ${expiryDate}`,
      uk: `👑 VIP ${vipTierName} успішно активовано!\n⏳ Закінчується: ${expiryDate}`,
      pt: `👑 VIP ${vipTierName} ativado com sucesso!\n⏳ Expira: ${expiryDate}`,
      es: `👑 ¡VIP ${vipTierName} activado con éxito!\n⏳ Expira: ${expiryDate}`,
      tr: `👑 VIP ${vipTierName} başarıyla etkinleştirildi!\n⏳ Bitiş: ${expiryDate}`,
      vi: `👑 VIP ${vipTierName} đã được kích hoạt!\n⏳ Hết hạn: ${expiryDate}`,
      zh: `👑 VIP ${vipTierName} 激活成功！\n⏳ 到期：${expiryDate}`
    };
    const userLang = user.lang || 'en';
    const msg = vipMsgs[userLang] || vipMsgs.en;
    try { await bot.sendMessage(telegramId, msg); } catch(e) {}

    res.json({ success: true, expiry, tier });
  } catch(e) {
    console.error('VIP verify error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/vip/boxes/save', async (req, res) => {
  try {
    const { telegramId, boxes } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Missing telegramId' });
    await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { 'vip.boxes': boxes });
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/vip/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ vip: user.vip || { tier:0, expiry:0, boxes:{} } });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
// ====== END VIP ======

app.post('/api/withdraw', async (req, res) => {
  const { telegramId, amount } = req.body;
  if (!telegramId || !amount) return res.status(400).json({ error: 'Missing data' });

  try {
    const user = await User.findOne({ telegramId: parseInt(telegramId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.walletAddress) return res.status(400).json({ error: 'no_wallet' });

    // Check minimum
    if (amount < MIN_WITHDRAW) return res.status(400).json({ error: 'below_minimum', min: MIN_WITHDRAW });
    if (amount > MAX_WITHDRAW) return res.status(400).json({ error: 'above_maximum', max: MAX_WITHDRAW });

    // Check balance
    if (user.rec < amount) return res.status(400).json({ error: 'insufficient_balance' });

    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const dailyWithdrawn = user.lastWithdrawDate === today ? (user.dailyWithdrawn || 0) : 0;
    const DAILY_LIMIT = (user.vip && user.vip.tier >= 1 && user.vip.expiry > Date.now()) ? 20000 : DAILY_LIMIT_DEFAULT;
    if (dailyWithdrawn + amount > DAILY_LIMIT) {
      return res.status(400).json({ error: 'daily_limit', remaining: DAILY_LIMIT - dailyWithdrawn });
    }

    const netAmount = amount - WITHDRAW_FEE;
    if (netAmount <= 0) return res.status(400).json({ error: 'amount_too_small' });

    // Deduct from balance
    await User.findOneAndUpdate(
      { telegramId: parseInt(telegramId) },
      {
        $inc: { rec: -amount },
        dailyWithdrawn: dailyWithdrawn + amount,
        lastWithdrawDate: today
      }
    );

    // Save withdrawal record
    const withdrawal = new Withdrawal({
      telegramId: parseInt(telegramId),
      username: user.username,
      walletAddress: user.walletAddress,
      amount, fee: WITHDRAW_FEE, netAmount,
      status: 'pending'
    });
    await withdrawal.save();

    // Send REC to user (net amount)
    const userResult = await sendJetton(user.walletAddress, netAmount, 'REC Mining Withdrawal');

    // Send fee to admin wallet
    if (userResult.success) {
      await sendJetton(FEE_WALLET, WITHDRAW_FEE, 'REC Mining Fee');
      await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'sent', txHash: 'sent' });
      res.json({ success: true, netAmount, fee: WITHDRAW_FEE });
    } else {
      // Refund user if transfer failed
      await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { $inc: { rec: amount } });
      await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'failed' });
      res.status(500).json({ error: 'transfer_failed', details: userResult.error });
    }
  } catch(e) {
    console.log('Withdraw error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ====== API: LOAD USER ======
app.get('/api/user/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: parseInt(req.params.telegramId) });
    if (!user) return res.json({ exists: false });
    res.json({ exists: true, data: user });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== API: SAVE USER (with security) ======
// ====== REFERRAL COMMISSION ======
async function distributeRefCommission(user, recEarned) {
  if (!user || recEarned <= 0) return;
  try {
    if (user.referredBy) {
      var c1 = parseFloat((recEarned * 0.08).toFixed(6));
      await User.findOneAndUpdate({ telegramId: parseInt(user.referredBy) }, { $inc: { rec: c1, totalRefCommission: c1 } });
    }
    if (user.referredByL2) {
      var c2 = parseFloat((recEarned * 0.02).toFixed(6));
      await User.findOneAndUpdate({ telegramId: parseInt(user.referredByL2) }, { $inc: { rec: c2, totalRefCommission: c2 } });
    }
    if (user.referredByL3) {
      var c3 = parseFloat((recEarned * 0.01).toFixed(6));
      await User.findOneAndUpdate({ telegramId: parseInt(user.referredByL3) }, { $inc: { rec: c3, totalRefCommission: c3 } });
    }
  } catch(e) { console.log('Commission error:', e.message); }
}

app.post('/api/user/save', async (req, res) => {
  try {
    const { telegramId, initData, ...data } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'No telegramId' });

    // 1. Rate limit: max 20 saves per minute per user
    if (!checkRateLimit(telegramId, 20)) {
      return res.status(429).json({ error: 'rate_limit' });
    }

    // 2. Validate Telegram signature (skip in dev)
    if (process.env.NODE_ENV !== 'development' && initData) {
      if (!validateTelegramInit(initData)) {
        console.log('Invalid initData from:', telegramId);
        return res.status(403).json({ error: 'invalid_signature' });
      }
    }

    // 3. Check if banned (only manual bans by admin)
    const existingUser = await User.findOne({ telegramId: parseInt(telegramId) });
    if (existingUser && existingUser.banned && existingUser.banReason === 'manual_ban') {
      return res.status(403).json({ error: 'banned', reason: existingUser.banReason });
    }
    // Auto-unban anyone wrongly banned by old auto-cheat
    if (existingUser && existingUser.banned && existingUser.banReason !== 'manual_ban') {
      await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { banned: false, banReason: '', suspiciousScore: 0 });
    }

    // 4. Anti-cheat: log only — NEVER auto-ban players
    if (existingUser && existingUser.lastSaveTime > 0) {
      var timeDiff = Date.now() - existingUser.lastSaveTime;
      if (data.rec !== undefined && data.record !== undefined) {
        if (!isRealisticIncrease(existingUser.rec, data.rec, existingUser.record, data.record, timeDiff, telegramId)) {
          var newScore = (existingUser.suspiciousScore || 0) + 1;
          await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { suspiciousScore: newScore });
          console.log('[AntiCheat-Log] userId:', telegramId, 'suspiciousScore:', newScore, '(no ban)');
          // Save the data anyway - never block legitimate players
        }
      }
    }

    // 5. Referral commission — async, non-blocking
    if (existingUser && data.rec !== undefined && existingUser.rec !== undefined) {
      var recEarned = parseFloat((data.rec - existingUser.rec).toFixed(6));
      if (recEarned > 0 && recEarned < 10 && (existingUser.referredBy || existingUser.referredByL2 || existingUser.referredByL3)) {
        distributeRefCommission(existingUser, recEarned).catch(function(){});
      }
    }

    // ✅ FIX: خذ MAX(client.rec, server.rec) عشان لا نمسح مكافآت السيرفر (بلوك، اعلانات)
    const currentUser = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
    const saveData = { ...data, lastSeen: new Date(), lastSaveTime: Date.now() };
    if(currentUser && currentUser.rec > (parseFloat(data.rec) || 0)) {
      saveData.rec = currentUser.rec; // السيرفر عنده أكثر، احتفظ بقيمته
    }

    const updated = await User.findOneAndUpdate(
      { telegramId: parseInt(telegramId) },
      saveData,
      { new: true, upsert: true }
    );
    res.json({ success: true, data: updated });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== BOT DETECTION (runs every hour) ======
async function detectAndBanBots() {
  try {
    var oneDayAgo = new Date(Date.now() - 86400000);
    var suspicious = await User.find({
      banned: false,
      createdAt: { $lt: oneDayAgo },
      $or: [
        { record: 0, rec: 0 },               // joined 24h+ ago, zero activity
        { suspiciousScore: { $gte: 3 } }      // multiple suspicious saves
      ]
    });

    for (var user of suspicious) {
      // Extra check: if no username and no activity after 48h
      var twoDaysAgo = new Date(Date.now() - 172800000);
      if (!user.username && user.createdAt < twoDaysAgo && user.record === 0) {
        await User.findOneAndUpdate(
          { telegramId: user.telegramId },
          { banned: true, banReason: 'bot_detected_no_activity' }
        );
        console.log('AUTO-BANNED (bot):', user.telegramId);
      }
    }
  } catch(e) { console.log('Bot detection error:', e); }
}
setInterval(detectAndBanBots, 3600000); // every hour

// ====== API: UNBAN ALL WRONGLY BANNED (admin only) ======
app.post('/api/admin/unban-all', async (req, res) => {
  try {
    const { adminId } = req.body;
    if (String(adminId) !== String(ADMIN_ID)) return res.status(403).json({ error: 'Not admin' });
    const result = await User.updateMany(
      { banned: true, banReason: { $ne: 'manual_ban' } },
      { banned: false, banReason: '', suspiciousScore: 0 }
    );
    res.json({ success: true, unbanned: result.modifiedCount });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== API: SELF UNBAN (admin only) ======
app.post('/api/admin/self-unban', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if (String(telegramId) !== String(ADMIN_ID)) return res.status(403).json({ error: 'Not admin' });
    await User.findOneAndUpdate(
      { telegramId: parseInt(telegramId) },
      { banned: false, banReason: '', suspiciousScore: 0 }
    );
    res.json({ success: true, message: 'Account unbanned' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== API: ADMIN - BAN/UNBAN USER ======
app.post('/api/admin/ban', async (req, res) => {
  try {
    const { telegramId, action, reason, adminId } = req.body;
    if (String(adminId) !== '6995765586') return res.status(403).json({ error: 'Not admin' });
    var update = action === 'ban'
      ? { banned: true, banReason: reason || 'manual_ban' }
      : { banned: false, banReason: '' };
    await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, update);
    res.json({ success: true, action, telegramId });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== API: GET USER PHOTO ======
var photoCache = {};
app.get('/api/photo/:telegramId', async (req, res) => {
  try {
    var userId = req.params.telegramId;

    // Cache photos for 1 hour
    if (photoCache[userId] && photoCache[userId].time > Date.now() - 86400000) {
      if (photoCache[userId].url) {
        return res.redirect(photoCache[userId].url);
      } else {
        return res.status(404).json({ error: 'no_photo' });
      }
    }

    var photos = await bot.getUserProfilePhotos(userId, { limit: 1 });
    if (!photos || !photos.photos || photos.photos.length === 0) {
      photoCache[userId] = { url: null, time: Date.now() };
      return res.status(404).json({ error: 'no_photo' });
    }

    var fileId = photos.photos[0][0].file_id;
    var file = await bot.getFile(fileId);
    var photoUrl = 'https://api.telegram.org/file/bot' + process.env.BOT_TOKEN + '/' + file.file_path;

    photoCache[userId] = { url: photoUrl, time: Date.now() };
    res.redirect(photoUrl);
  } catch(e) {
    res.status(404).json({ error: 'no_photo' });
  }
});

// ====== API: ALL USERS ======
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'telegramId username firstName record rec refCount walletAddress lastSeen createdAt').sort({ record: -1 }).limit(100);
    res.json({ count: users.length, users });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== API: WITHDRAWALS ======
app.get('/api/withdrawals', async (req, res) => {
  try {
    const list = await Withdrawal.find().sort({ createdAt: -1 }).limit(50);
    res.json({ count: list.length, withdrawals: list });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== ADMIN DASHBOARD API ======
app.get('/admin', async (req, res) => {
  const adminId = req.query.id;
  if(String(adminId) !== String(ADMIN_ID)){
    return res.status(403).send('<h2 style="color:red;font-family:monospace;">❌ Access Denied</h2>');
  }

  try {
    const users = await User.find({}).sort({ rec: -1 }).lean();
    const totalUsers = users.length;
    const activeWeek = users.filter(u => u.lastSeen && (Date.now() - new Date(u.lastSeen)) < 7*86400000).length;
    const activeDay = users.filter(u => u.lastSeen && (Date.now() - new Date(u.lastSeen)) < 86400000).length;
    const totalRec = users.reduce((s,u) => s + (u.rec||0), 0);
    const totalRecord = users.reduce((s,u) => s + (u.record||0), 0);

    let rows = users.map((u, i) => {
      const lastSeen = u.lastSeen ? new Date(u.lastSeen).toLocaleString() : 'Never';
      const hoursAgo = u.lastSeen ? Math.floor((Date.now()-new Date(u.lastSeen))/3600000) : 999;
      const activity = hoursAgo < 24 ? '🟢' : hoursAgo < 168 ? '🟡' : '🔴';
      const name = (u.username ? '@'+u.username : u.firstName || 'Unknown').substring(0,20);
      return `<tr style="border-bottom:1px solid #222;">
        <td style="padding:8px;color:#888">#${i+1}</td>
        <td style="padding:8px;">${activity} ${name}</td>
        <td style="padding:8px;color:#00FF88;">${(u.rec||0).toFixed(4)}</td>
        <td style="padding:8px;color:#FF4444;">${Math.floor(u.record||0).toLocaleString()}</td>
        <td style="padding:8px;color:#FFD700;">${u.refCount||0}</td>
        <td style="padding:8px;color:#aaa;font-size:11px;">${lastSeen}</td>
        <td style="padding:8px;color:#555;font-size:11px;">${u.telegramId}</td>
      </tr>`;
    }).join('');

    res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>REC Admin</title>
<style>
  body{background:#000;color:#fff;font-family:monospace;padding:16px;margin:0;}
  h1{color:#FF0000;font-size:20px;margin-bottom:16px;}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;}
  .stat{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:12px;text-align:center;}
  .stat-val{font-size:22px;font-weight:bold;color:#00FF88;}
  .stat-val.red{color:#FF4444;}
  .stat-val.yellow{color:#FFD700;}
  .stat-label{font-size:10px;color:#555;margin-top:4px;}
  table{width:100%;border-collapse:collapse;font-size:12px;}
  th{background:#111;padding:8px;text-align:left;color:#555;border-bottom:1px solid #333;}
  tr:hover{background:#0a0a0a;}
  .legend{font-size:11px;color:#555;margin-bottom:10px;}
</style>
</head>
<body>
<h1>⛏️ REC Mining — Admin Dashboard</h1>
<div class="stats">
  <div class="stat"><div class="stat-val">${totalUsers}</div><div class="stat-label">Total Users</div></div>
  <div class="stat"><div class="stat-val yellow">${activeDay}</div><div class="stat-label">Active Today</div></div>
  <div class="stat"><div class="stat-val">${activeWeek}</div><div class="stat-label">Active Week</div></div>
  <div class="stat"><div class="stat-val">${totalRec.toFixed(2)}</div><div class="stat-label">Total REC</div></div>
  <div class="stat"><div class="stat-val red">${Math.floor(totalRecord).toLocaleString()}</div><div class="stat-label">Total RECORD</div></div>
  <div class="stat"><div class="stat-val yellow">${users.filter(u=>u.refCount>0).length}</div><div class="stat-label">Have Referrals</div></div>
</div>
<div class="legend">🟢 Active today &nbsp; 🟡 Active this week &nbsp; 🔴 Inactive</div>
<table>
  <tr>
    <th>#</th><th>User</th><th>REC</th><th>RECORD</th><th>Refs</th><th>Last Seen</th><th>ID</th>
  </tr>
  ${rows}
</table>
<p style="color:#333;font-size:10px;margin-top:20px;">Updated: ${new Date().toLocaleString()}</p>
</body>
</html>`);
  } catch(e) {
    res.status(500).send('Error: ' + e.message);
  }
});


// كل 10 مستخدمين نشيطين في آخر أسبوعين → واحد يحصل على بلوك

// ====== API: BLOCK-FOUND (للإشعار اليدوي من الواجهة) ======
// ====== API: GAME EARN (REC Catch game) ======
app.post('/api/game-earn', async (req, res) => {
  try {
    const { telegramId, rec, gameType } = req.body;
    if(!telegramId || !rec) return res.status(400).json({ error: 'Missing data' });

    const user = await User.findOne({ telegramId: parseInt(telegramId) });
    if(!user) return res.status(404).json({ error: 'User not found' });

    // تحقق من الحد اليومي على السيرفر
    const today = new Date().toISOString().split('T')[0];
    const gameEarnKey = 'gameEarn_' + today;
    const todayEarned = user.get(gameEarnKey) || 0;
    const remaining = Math.max(0, 10 - todayEarned);

    if(remaining <= 0) return res.json({ success: false, reason: 'daily_limit' });

    const toAdd = Math.min(parseFloat(rec), remaining);

    await User.findOneAndUpdate(
      { telegramId: parseInt(telegramId) },
      { $inc: { rec: toAdd }, $set: { [gameEarnKey]: todayEarned + toAdd } }
    );

    res.json({ success: true, added: toAdd, remaining: remaining - toAdd });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});


app.get('/api/referrals/:telegramId', async (req, res) => {
  try {
    var userId = req.params.telegramId;
    var l1 = await User.find({ referredBy: userId })
      .select('telegramId username firstName rec miningSpeed createdAt')
      .sort({ rec: -1 }).limit(50);
    var l1Ids = l1.map(function(u){ return u.telegramId.toString(); });
    var l2 = await User.find({ referredBy: { $in: l1Ids } })
      .select('telegramId username firstName rec miningSpeed createdAt')
      .sort({ rec: -1 }).limit(50);
    var l2Ids = l2.map(function(u){ return u.telegramId.toString(); });
    var l3 = await User.find({ referredBy: { $in: l2Ids } })
      .select('telegramId username firstName rec miningSpeed createdAt')
      .sort({ rec: -1 }).limit(50);
    res.json({ l1, l2, l3 });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ====== DAILY COMBO API ======

// GET today's combo (admin sees card keys, others see only progress)
app.get('/api/combo/today/:telegramId', async (req, res) => {
  try {
    var today = new Date().toISOString().split('T')[0];
    var combo = await DailyCombo.findOne({ date: today });
    var isAdmin = parseInt(req.params.telegramId) === ADMIN_ID;
    if(!combo) return res.json({ exists: false, cards: [], reward: 5, setAt: null, expiresAt: null });

    var user = await User.findOne({ telegramId: parseInt(req.params.telegramId) })
      .select('cardLevels comboProgress');
    var progress = (user && user.comboProgress && user.comboProgress.date === today)
      ? user.comboProgress.done : [];

    var cards = combo.cards.map(function(c) {
      return {
        key: isAdmin ? c.key : '?',
        categoryIndex: c.categoryIndex,
        cardIndex: c.cardIndex,
        done: progress.indexOf(c.key) !== -1
      };
    });
    var allDone = combo.cards.every(function(c){ return progress.indexOf(c.key) !== -1; });
    var rewardClaimed = user && user.comboProgress && user.comboProgress.date === today && user.comboProgress.claimed;
    var setAt = combo.setAt || null;
    var expiresAt = setAt ? setAt + 24*3600*1000 : null;
    res.json({ exists: true, cards, reward: combo.reward, allDone, rewardClaimed: !!rewardClaimed, setAt, expiresAt, isAdmin });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: manual weekly distribution
app.post('/api/admin/distribute-weekly', async (req, res) => {
  try {
    const { adminId } = req.body;
    if(String(adminId) !== String(ADMIN_ID)) return res.status(403).json({ error: 'Not admin' });
    const weekId = getWeekId();
    await WeeklyChallenge.findOneAndUpdate({ weekId }, { distributed: false });
    await distributeWeeklyRewards();
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Heartbeat - user online status + save mining speed
app.post('/api/user/heartbeat', async (req, res) => {
  try {
    const { telegramId, miningSpeed, recordMiningSpeed } = req.body;
    if(!telegramId) return res.json({ ok: false });
    var update = { lastSeen: new Date() };
    if(miningSpeed !== undefined) update.miningSpeed = miningSpeed;
    if(recordMiningSpeed !== undefined) update.recordMiningSpeed = recordMiningSpeed;
    await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, update);
    res.json({ ok: true });
  } catch(e) { res.json({ ok: false }); }
});

// Server-side offline earnings calculation
app.post('/api/user/offline-earnings', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if(!telegramId) return res.json({ earned: 0 });

    const user = await User.findOne({ telegramId: parseInt(telegramId) });
    if(!user) return res.json({ earned: 0 });

    const now = Date.now();
    const lastSeen = user.lastSeen ? new Date(user.lastSeen).getTime() : 0;
    if(!lastSeen) {
      await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { lastSeen: new Date() });
      return res.json({ earned: 0, earnedRecord: 0 });
    }

    const elapsed = (now - lastSeen) / 1000; // seconds
    if(elapsed < 30) return res.json({ earned: 0, earnedRecord: 0 });

    // Cap at 24 hours
    const seconds = Math.min(elapsed, 86400);

    // ✅ FIX: Use calcMiningSpeed from cardLevels as fallback when miningSpeed = 0
    const speed = user.miningSpeed > 0
      ? user.miningSpeed
      : calcMiningSpeed(user.cardLevels || {});

    const recordSpeed = user.recordMiningSpeed > 0
      ? user.recordMiningSpeed
      : calcRecordMiningSpeed(user.cardLevels || {}, user.tapLevelVal || 0);

    // Calculate earnings
    const earnedRec = parseFloat((speed * seconds).toFixed(6));
    const earnedRecord = Math.floor(recordSpeed * seconds);

    console.log(`[Offline] User ${telegramId}: ${Math.floor(seconds/3600)}h offline, speed=${speed.toFixed(8)}, earned=${earnedRec} REC`);

    // ✅ Add directly to rec (no claim needed)
    if(earnedRec > 0.000001 || earnedRecord > 0) {
      await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        {
          $inc: {
            rec: earnedRec > 0 ? earnedRec : 0,
            record: earnedRecord > 0 ? earnedRecord : 0
          },
          lastSeen: new Date()
        }
      );
    } else {
      await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { lastSeen: new Date() });
    }

    res.json({ earned: earnedRec, earnedRecord, seconds: Math.floor(seconds) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Airdrop score update
app.post('/api/user/airdrop-score', async (req, res) => {
  try {
    const { telegramId, airdropScore } = req.body;
    if(!telegramId || !airdropScore) return res.json({ success: false });
    await User.findOneAndUpdate(
      { telegramId: parseInt(telegramId) },
      { airdropScore: Math.floor(airdropScore) }
    );
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Tax collection - add to admin account
app.post('/api/exchange/tax', async (req, res) => {
  try {
    const { taxAmount } = req.body;
    if(!taxAmount || taxAmount <= 0) return res.json({ success: false });
    await User.findOneAndUpdate(
      { telegramId: ADMIN_ID },
      { $inc: { rec: taxAmount } }
    );
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST set combo (admin only)
app.post('/api/combo/set', async (req, res) => {
  try {
    var { adminId, cards } = req.body;
    if(parseInt(adminId) !== ADMIN_ID) return res.status(403).json({ error: 'Not admin' });
    if(!cards || cards.length !== 3) return res.status(400).json({ error: 'Need 3 cards' });
    var today = new Date().toISOString().split('T')[0];
    await DailyCombo.findOneAndUpdate(
      { date: today },
      { $set: { cards: cards, reward: 5, setAt: Date.now() } },
      { upsert: true, new: true }
    );
    res.json({ success: true, date: today });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST check card upgrade against combo
app.post('/api/combo/check', async (req, res) => {
  try {
    var { telegramId, cardKey } = req.body;
    if(!telegramId || !cardKey) return res.status(400).json({ error: 'Missing data' });
    var today = new Date().toISOString().split('T')[0];
    var combo = await DailyCombo.findOne({ date: today });
    if(!combo) return res.json({ matched: false });

    var isComboCard = combo.cards.some(function(c){ return c.key === cardKey; });
    if(!isComboCard) return res.json({ matched: false });

    var user = await User.findOne({ telegramId: parseInt(telegramId) }).select('comboProgress rec');
    var progress = (user && user.comboProgress && user.comboProgress.date === today)
      ? user.comboProgress.done.slice() : [];
    var claimed = user && user.comboProgress && user.comboProgress.date === today && user.comboProgress.claimed;

    if(progress.indexOf(cardKey) === -1) progress.push(cardKey);

    // Check all 3 specific combo cards are done
    var allDone = combo.cards.every(function(c){ return progress.indexOf(c.key) !== -1; });
    var giveReward = allDone && !claimed;

    var setOp = { 'comboProgress.date': today, 'comboProgress.done': progress };
    if(giveReward) setOp['comboProgress.claimed'] = true;

    if(giveReward) {
      await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        { $set: setOp, $inc: { rec: combo.reward } }
      );
    } else {
      await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        { $set: setOp }
      );
    }

    res.json({ matched: true, done: progress.length, allDone, reward: giveReward ? combo.reward : 0 });
  } catch(e) { res.status(500).json({ error: e.message }); }
});


// ====== ADSGRAM REWARD ENDPOINT ======
app.post('/api/adsgram/reward', async (req, res) => {
  try {
    var telegramId = req.body.telegramId || req.query.userId;
    if(!telegramId) return res.status(400).json({ error: 'Missing userId' });

    var today = new Date().toISOString().split('T')[0];
    var user = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
    if(!user) return res.status(404).json({ error: 'User not found' });

    // Daily limit: 5 ads per day
    var adKey = 'adsWatched_' + today;
    var watched = user[adKey] || 0;
    if(watched >= 100) return res.json({ success: false, reason: 'daily_limit' });

    var reward = 5; // 5 REC per ad (500/100)
    await User.collection.updateOne(
      { telegramId: parseInt(telegramId) },
      { $inc: { rec: reward }, $set: { [adKey]: watched + 1 } }
    );

    var updated = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
    console.log('[Ads] User', telegramId, 'watched ad → +' + reward + ' REC');
    res.json({ success: true, reward, newBalance: updated.rec, remaining: 99 - watched });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Adsgram server-to-server callback (GET)
app.get('/api/adsgram/reward', async (req, res) => {
  try {
    var telegramId = req.query.userId;
    if(!telegramId) return res.status(400).send('Missing userId');

    var today = new Date().toISOString().split('T')[0];
    var user = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
    if(!user) return res.status(404).send('User not found');

    var adKey = 'adsWatched_' + today;
    var watched = user[adKey] || 0;
    if(watched >= 100) return res.send('daily_limit');

    await User.collection.updateOne(
      { telegramId: parseInt(telegramId) },
      { $inc: { rec: 2 }, $set: { [adKey]: watched + 1 } }
    );

    console.log('[Ads-S2S] User', telegramId, '+2 REC from ad');
    res.send('OK');
  } catch(e) {
    res.status(500).send(e.message);
  }
});


// ============================================================
// MINING SYSTEM ENDPOINTS
// ============================================================

// Heartbeat — يحفظ السرعة الحالية وآخر وقت نشاط
app.post('/api/mining/heartbeat', async (req, res) => {
  try {
    const { telegramId, recPerSec, recordPerSec } = req.body;
    if(!telegramId) return res.json({ ok: false });

    const update = { lastSeen: new Date() };
    if(recPerSec    !== undefined) update.miningSpeed       = parseFloat(recPerSec)    || 0;
    if(recordPerSec !== undefined) update.recordMiningSpeed = parseFloat(recordPerSec) || 0;

    await User.findOneAndUpdate(
      { telegramId: parseInt(telegramId) },
      update
    );
    res.json({ ok: true });
  } catch(e) { res.json({ ok: false }); }
});

// REC Offline earnings
app.post('/api/mining/offline/rec', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if(!telegramId) return res.json({ earnedRec: 0 });
    const user = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
    if(!user) return res.json({ earnedRec: 0 });
    const now = Date.now();
    const lastSeen = user.lastSeen ? new Date(user.lastSeen).getTime() : 0;
    if(!lastSeen) {
      await User.updateOne({ telegramId: parseInt(telegramId) }, { lastSeen: new Date() });
      return res.json({ earnedRec: 0 });
    }
    const elapsed = (now - lastSeen) / 1000;
    if(elapsed < 30) return res.json({ earnedRec: 0 });
    const seconds = Math.min(elapsed, 7 * 86400); // 7 أيام
    const recSpeed = user.miningSpeed > 0 ? user.miningSpeed : calcMiningSpeed(user.cardLevels || {});
    const earnedRec = parseFloat((recSpeed * seconds).toFixed(8));
    console.log('[REC] user ' + telegramId + ' offline +' + earnedRec + ' REC');
    if(earnedRec > 0.000001) {
      await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { $inc: { rec: earnedRec }, lastSeen: new Date() });
    } else {
      await User.updateOne({ telegramId: parseInt(telegramId) }, { lastSeen: new Date() });
    }
    res.json({ earnedRec: earnedRec > 0.000001 ? earnedRec : 0, seconds: Math.floor(seconds) });
  } catch(e) { res.json({ earnedRec: 0 }); }
});

// RECORD Offline earnings
app.post('/api/mining/offline/record', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if(!telegramId) return res.json({ earnedRecord: 0 });
    const user = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
    if(!user) return res.json({ earnedRecord: 0 });
    const now = Date.now();
    const lastSeen = user.lastSeen ? new Date(user.lastSeen).getTime() : 0;
    if(!lastSeen) return res.json({ earnedRecord: 0 });
    const elapsed = (now - lastSeen) / 1000;
    if(elapsed < 30) return res.json({ earnedRecord: 0 });
    const seconds = Math.min(elapsed, 7 * 86400); // 7 أيام
    const recordSpeed = user.recordMiningSpeed > 0 ? user.recordMiningSpeed : calcRecordMiningSpeed(user.cardLevels || {}, user.tapLevelVal || 0);
    const earnedRecord = Math.floor(recordSpeed * seconds);
    console.log('[RECORD] user ' + telegramId + ' offline +' + earnedRecord + ' RECORD');
    if(earnedRecord > 0) {
      await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { $inc: { record: earnedRecord } });
    }
    res.json({ earnedRecord: earnedRecord > 0 ? earnedRecord : 0, seconds: Math.floor(seconds) });
  } catch(e) { res.json({ earnedRecord: 0 }); }
});




// ============================================================
// CLOUD MINING — تعدين سحابي 24/7
// يعدن لكل مستخدم كل دقيقة بغض النظر عن البوت
// ============================================================
async function runCloudMining() {
  try {
    const now = Date.now();
    const intervalSeconds = 60; // كل دقيقة

    // جيب كل المستخدمين النشيطين (آخر 30 يوم)
    const thirtyDaysAgo = new Date(now - 30 * 86400 * 1000);
    const users = await User.find({
      banned: false,
      lastSeen: { $gte: thirtyDaysAgo },
      $or: [
        { miningSpeed: { $gt: 0 } },
        { recordMiningSpeed: { $gt: 0 } }
      ]
    }).select('telegramId miningSpeed recordMiningSpeed cardLevels tapLevelVal').lean();

    if(users.length === 0) return;

    let processed = 0;
    for(const user of users) {
      try {
        const recSpeed    = user.miningSpeed       > 0 ? user.miningSpeed       : calcMiningSpeed(user.cardLevels || {});
        const recordSpeed = user.recordMiningSpeed > 0 ? user.recordMiningSpeed : calcRecordMiningSpeed(user.cardLevels || {}, user.tapLevelVal || 0);

        const earnedRec    = parseFloat((recSpeed    * intervalSeconds).toFixed(8));
        const earnedRecord = Math.floor(recordSpeed  * intervalSeconds);

        if(earnedRec < 0.000001 && earnedRecord < 1) continue;

        const inc = {};
        if(earnedRec    > 0.000001) inc.rec    = earnedRec;
        if(earnedRecord > 0)        inc.record = earnedRecord;

        await User.updateOne(
          { telegramId: user.telegramId },
          { $inc: inc }
        );
        processed++;
      } catch(e) {}
    }

    if(processed > 0) {
      console.log('[Cloud Mining] Processed ' + processed + '/' + users.length + ' users');
    }
  } catch(e) {
    console.log('[Cloud Mining] Error:', e.message);
  }
}

// شغّل كل دقيقة
setInterval(runCloudMining, 60 * 1000);
// أول تشغيل بعد دقيقتين من بدء السيرفر
setTimeout(runCloudMining, 2 * 60 * 1000);
console.log('[Cloud Mining] ✅ Started — mining every 60 seconds');


// Sync — يرجع الرصيد الحالي من السيرفر
app.post('/api/user/sync', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if(!telegramId) return res.json({ rec: 0, record: 0 });
    const user = await User.findOne({ telegramId: parseInt(telegramId) })
      .select('rec record').lean();
    if(!user) return res.json({ rec: 0, record: 0 });
    res.json({ rec: user.rec || 0, record: user.record || 0 });
  } catch(e) { res.json({ rec: 0, record: 0 }); }
});


// Admin: تشغيل توزيع البلوكات يدوياً
app.get('/api/admin/run-blocks', async (req, res) => {
  const key = req.query.key;
  if(key !== process.env.ADMIN_KEY && key !== '8933829639') return res.status(403).json({ error: 'Forbidden' });
  try {
    const { runDailyBlockDistribution, runDailyActiveReward } = require('./blockSystem');
    res.json({ message: 'Block distribution triggered — check logs' });
  } catch(e) {
    res.json({ message: 'Triggered via blockSystem interval' });
  }
});


// AirDrop Leaderboard
app.get('/api/leaderboard/airdrop', async (req, res) => {
  try {
    const users = await User.find({ airdropScore: { $gt: 0 } })
      .select('telegramId username firstName airdropScore')
      .sort({ airdropScore: -1 }).limit(50).lean();
    res.json(users);
  } catch(e) { res.json([]); }
});

app.post('/webhook', (req, res) => { bot.processUpdate(req.body); res.sendStatus(200); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // ====== SET WEBHOOK via Telegram API directly ======
  if (process.env.NODE_ENV !== 'development') {
    const webhookUrl = (process.env.APP_URL || 'https://rec-coin.onrender.com') + '/webhook';
    const apiUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
    https.get(apiUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => console.log('Webhook set ✅:', data));
    }).on('error', e => console.log('Webhook error:', e.message));
  } else {
    bot.startPolling();
    console.log('Bot polling started (dev mode) ✅');
  }
});

// ====== BLOCK SYSTEM V2 ======
mongoose.connection.once('open', () => {
  try {
    require('./blockSystem')(app, bot, User);
  } catch(e) { console.log('BlockSystem init error:', e.message); }
});

// ====== KEEP SERVER ALIVE (works on all Node versions) ======
setInterval(() => {
  const url = process.env.APP_URL || 'https://rec-coin.onrender.com';
  https.get(url, (res) => {
    res.resume(); // drain response
  }).on('error', () => {});
}, 840000); // every 14 minutes

module.exports = app;
