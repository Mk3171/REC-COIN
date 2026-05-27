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
function isRealisticIncrease(oldRec, newRec, oldRecord, newRecord, timeDiff) {
  // Max possible: all 130 cards at level 100 * 3 seconds
  var maxRecPerSec = 130 * 0.05;       // 6.5 REC/s max
  var maxRecordPerSec = 130 * 10000;   // 1,300,000 RECORD/s max
  var seconds = Math.max(timeDiff / 1000, 1);
  if (newRec - oldRec > maxRecPerSec * seconds * 1.5) return false;      // 50% tolerance
  if (newRecord - oldRecord > maxRecordPerSec * seconds * 1.5) return false;
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
  totalTaps:       { type: Number, default: 0 }
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
    var allUsers = await User.find({ banned: false, $or: [{ record: { $gt: 0 } }, { rec: { $gt: 0 } }] })
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

    // 3. Check if banned
    const existingUser = await User.findOne({ telegramId: parseInt(telegramId) });
    if (existingUser && existingUser.banned) {
      return res.status(403).json({ error: 'banned', reason: existingUser.banReason });
    }

    // 4. Anti-cheat: validate balance increases
    if (existingUser && existingUser.lastSaveTime > 0) {
      var timeDiff = Date.now() - existingUser.lastSaveTime;
      if (data.rec !== undefined && data.record !== undefined) {
        if (!isRealisticIncrease(existingUser.rec, data.rec, existingUser.record, data.record, timeDiff)) {
          // Suspicious - increment score
          var newScore = (existingUser.suspiciousScore || 0) + 1;
          await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, {
            suspiciousScore: newScore,
            ...(newScore >= 5 ? { banned: true, banReason: 'cheat_detected' } : {})
          });
          if (newScore >= 5) {
            console.log('AUTO-BANNED (cheat):', telegramId);
            return res.status(403).json({ error: 'banned', reason: 'cheat_detected' });
          }
          // Reject the suspicious save
          return res.status(400).json({ error: 'invalid_balance' });
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

app.post('/webhook', (req, res) => { bot.processUpdate(req.body); res.sendStatus(200); });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
setInterval(() => { fetch('https://rec-coin.onrender.com/').catch(() => {}); }, 840000);
module.exports = app;
