const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const path = require('path');

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
const BLOCK_CHANCE = 1 / 500;
var totalBlocksMined = 0; // track globally

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
  refillData:      { type: Object, default: {date:'',count:3} }
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
      .sort({ record: -1 }).limit(100)
      .select('telegramId username firstName walletAddress record rec');

    if (top100.length === 0) return;

    // Distribution amounts
    var rewards = {};
    if (top100[0]) rewards[top100[0].telegramId] = 250;
    if (top100[1]) rewards[top100[1].telegramId] = 150;
    if (top100[2]) rewards[top100[2].telegramId] = 100;

    // Ranks 4-100: 500 REC distributed by inverse weight
    var pool500 = top100.slice(3);
    var totalWeight = pool500.reduce(function(sum, _, i) { return sum + (pool500.length - i); }, 0);
    pool500.forEach(function(user, i) {
      var weight = pool500.length - i;
      rewards[user.telegramId] = parseFloat((weight / totalWeight * 500).toFixed(4));
    });

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
const WITHDRAW_FEE = 70;
const MIN_WITHDRAW = 500;
const DAILY_LIMIT  = 10000;

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
      await new User({ telegramId: from.id, username: from.username || '', firstName: from.first_name || '', lastName: from.last_name || '', language: lang, referredBy: refId || '' }).save();
      if (refId) await User.findOneAndUpdate({ telegramId: parseInt(refId) }, { $inc: { refCount: 1 } });
    } else {
      await User.findOneAndUpdate({ telegramId: from.id }, { lastSeen: new Date(), username: from.username || existing.username });
    }
  } catch(e) { console.log('User save error:', e); }

  const welcomeText = getWelcomeText(from.first_name || from.username, lang, refId);
  const buttonText = getButtonText(lang);
  try {
    await bot.sendPhoto(chatId, path.join(__dirname, 'public', 'logo.jpeg'), { caption: welcomeText, reply_markup: { inline_keyboard: [[{ text: buttonText, web_app: { url: MINI_APP_URL } }]] } });
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
app.get('/api/leaderboard/global', async (req, res) => {
  try {
    var allUsers = await User.find({ banned: false })
      .sort({ record: -1 }).limit(500)
      .select('telegramId username firstName record rec refCount createdAt');
    res.json({ top100: allUsers.map(function(u, i) {
      return { rank: i+1, telegramId: u.telegramId, name: u.username || u.firstName || 'User', record: u.record, rec: u.rec, refCount: u.refCount };
    })});
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/leaderboard/myrank/:telegramId', async (req, res) => {
  try {
    var userId = parseInt(req.params.telegramId);
    var allUsers = await User.find({}).sort({ record: -1 }).select('telegramId username firstName record rec');
    var myIndex = allUsers.findIndex(function(u) { return u.telegramId === userId; });
    var myRank = myIndex + 1;
    var start = Math.max(0, myIndex - 2);
    var end = Math.min(allUsers.length, myIndex + 3);
    var neighbors = allUsers.slice(start, end).map(function(u, i) {
      return { rank: start + i + 1, telegramId: u.telegramId, name: u.username || u.firstName || 'User', record: u.record, rec: u.rec, isMe: u.telegramId === userId };
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
    var daysLeft = 7 - new Date().getDay();
    if (new Date().getDay() === 0) daysLeft = 0;
    res.json({ weekId, daysLeft, distributed: wc ? wc.distributed : false, lastWinner: wc ? wc.top100[0] : null });
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
app.post('/api/withdraw', async (req, res) => {
  const { telegramId, amount } = req.body;
  if (!telegramId || !amount) return res.status(400).json({ error: 'Missing data' });

  try {
    const user = await User.findOne({ telegramId: parseInt(telegramId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.walletAddress) return res.status(400).json({ error: 'no_wallet' });

    // Check minimum
    if (amount < MIN_WITHDRAW) return res.status(400).json({ error: 'below_minimum', min: MIN_WITHDRAW });

    // Check balance
    if (user.rec < amount) return res.status(400).json({ error: 'insufficient_balance' });

    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const dailyWithdrawn = user.lastWithdrawDate === today ? (user.dailyWithdrawn || 0) : 0;
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

    const updated = await User.findOneAndUpdate(
      { telegramId: parseInt(telegramId) },
      { ...data, lastSeen: new Date(), lastSaveTime: Date.now() },
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
const BLOCK_REC_REWARD = 100;
const BLOCK_USERS_RATIO = 10; // بلوك واحد لكل 10 مستخدمين
const BLOCK_PERIOD_DAYS = 14; // كل أسبوعين

async function runBlockDistribution() {
  try {
    var twoWeeksAgo = new Date(Date.now() - BLOCK_PERIOD_DAYS * 86400000);
    
    // المستخدمين النشيطين في آخر أسبوعين
    var activeUsers = await User.find({
      banned: false,
      lastSeen: { $gte: twoWeeksAgo },
      rec: { $gt: 0 } // عندهم بطاقات شغالة
    }).select('telegramId username firstName rec lastBlockDate totalBlocksFound');

    if(activeUsers.length < BLOCK_USERS_RATIO) return;

    // كم بلوك يوزع هاد الوقت
    var blocksToGive = Math.floor(activeUsers.length / BLOCK_USERS_RATIO);
    if(blocksToGive < 1) return;

    // اختر فائزين عشوائيين (ما حصلوا على بلوك مؤخراً)
    var today = new Date().toISOString().split('T')[0];
    var eligible = activeUsers.filter(u => u.lastBlockDate !== today);
    
    // خلط عشوائي
    eligible.sort(() => Math.random() - 0.5);
    var winners = eligible.slice(0, blocksToGive);

    for(var winner of winners) {
      // أضف 100 REC مباشرة على السيرفر
      await User.findOneAndUpdate(
        { telegramId: winner.telegramId },
        { 
          $inc: { rec: BLOCK_REC_REWARD, totalBlocksFound: 1 },
          lastBlockDate: today
        }
      );

      totalBlocksMined++;
      var userName = winner.username ? '@' + winner.username : winner.firstName || 'Miner';

      // إعلان القناة
      var channelMsg =
        `⛏️ *NEW BLOCK MINED* ⛏️\n\n` +
        `🔴 Block #${totalBlocksMined}\n` +
        `👤 Miner: ${userName}\n` +
        `💰 Reward: +${BLOCK_REC_REWARD} REC\n` +
        `👥 Active Miners: ${activeUsers.length}\n` +
        `⏰ ${new Date().toUTCString()}\n\n` +
        `🚀 @RecMiningGame_bot`;

      await bot.sendMessage(BLOCKS_CHANNEL_ID, channelMsg, { parse_mode: 'Markdown' }).catch(()=>{});

      // إعلان الجروع
      var groupMsg =
        `🎉 *تم اكتشاف بلوك جديد!*\n\n` +
        `⛏️ المعدّن: ${userName}\n` +
        `🏆 المكافأة: +${BLOCK_REC_REWARD} REC\n` +
        `👥 عدد المعدنين النشيطين: ${activeUsers.length}\n\n` +
        `💡 @RecMiningGame_bot`;

      await bot.sendMessage(GROUP_CHAT_ID, groupMsg, { parse_mode: 'Markdown' }).catch(()=>{});

      // أبلغ المستخدم شخصياً
      var personalMsg =
        `⛏️ *أصبت بلوكاً!*\n\n` +
        `🎉 مبروك! بطاقاتك اكتشفت بلوك جديد!\n` +
        `💰 تمت إضافة *${BLOCK_REC_REWARD} REC* لرصيدك\n\n` +
        `افتح البوت لترى رصيدك المحدث 👇`;

      await bot.sendMessage(winner.telegramId, personalMsg, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🚀 افتح البوت', web_app: { url: 'https://rec-coin.onrender.com' } }]] }
      }).catch(()=>{});

      console.log(`Block #${totalBlocksMined} awarded to ${userName} (+${BLOCK_REC_REWARD} REC)`);
    }
  } catch(e) {
    console.log('Block distribution error:', e.message);
  }
}

// شغّل توزيع البلوكات كل 6 ساعات
setInterval(runBlockDistribution, 6 * 3600000);
// شغّل مرة عند البدء بعد دقيقة
setTimeout(runBlockDistribution, 60000);

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

app.post('/api/block-found', async (req, res) => {
  try {
    const { telegramId, blockReward, blockNumber } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'Missing data' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/webhook', (req, res) => { bot.processUpdate(req.body); res.sendStatus(200); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
setInterval(() => { fetch('https://rec-coin.onrender.com/').catch(() => {}); }, 840000);
module.exports = app;
