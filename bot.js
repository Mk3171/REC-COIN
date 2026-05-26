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
  createdAt:     { type: Date, default: Date.now }
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

// ====== API: SAVE USER ======
app.post('/api/user/save', async (req, res) => {
  try {
    const { telegramId, ...data } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'No telegramId' });
    const updated = await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { ...data, lastSeen: new Date() }, { new: true, upsert: true });
    res.json({ success: true, data: updated });
  } catch(e) { res.status(500).json({ error: e.message }); }
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
