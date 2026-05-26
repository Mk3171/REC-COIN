const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// ====== MONGODB CONNECTION ======
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
  lastSeen:      { type: Date, default: Date.now },
  createdAt:     { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// ====== BOT SETUP ======
const bot = new TelegramBot(process.env.BOT_TOKEN);
const MINI_APP_URL = 'https://rec-coin.onrender.com';

// ====== WELCOME MESSAGES ======
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

// ====== /start HANDLER ======
bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const from = msg.from;
  const lang = from.language_code || 'en';
  const param = match[1] ? match[1].trim() : '';
  const refId = param.startsWith('ref') ? param.replace('ref', '') : '';

  // Handle buy_ from Stars shop
  if (param.startsWith('buy_')) {
    const buyKey = param.replace('buy_', '');
    const products = {
      energy:       { title: '⚡ شحن طاقة فوري',      description: 'يرجع طاقتك كاملة فوراً',              payload: 'energy',       amount: 15  },
      record_500k:  { title: '💰 500,000 RECORD',       description: '500,000 RECORD تضاف لرصيدك فوراً',   payload: 'record_500k',  amount: 50  },
      record_3m:    { title: '💰 3,000,000 RECORD',     description: '3,000,000 RECORD تضاف لرصيدك فوراً', payload: 'record_3m',    amount: 200 },
      skip_timer:   { title: '🚀 تخطي وقت الانتظار',   description: 'أكمل ترقية البطاقة فوراً',            payload: 'skip_timer',   amount: 100 }
    };
    const product = products[buyKey];
    if (product) {
      try {
        await bot.sendInvoice(
          chatId,
          product.title,
          product.description,
          product.payload,
          '',
          'XTR',
          [{ label: product.title, amount: product.amount }]
        );
      } catch(e) { console.log('Invoice error:', e.message); }
      return;
    }
  }

  // Save/update user in MongoDB
  try {
    const existing = await User.findOne({ telegramId: from.id });
    if (!existing) {
      const newUser = new User({
        telegramId: from.id,
        username: from.username || '',
        firstName: from.first_name || '',
        lastName: from.last_name || '',
        language: lang,
        referredBy: refId || ''
      });
      await newUser.save();

      // Give referrer +1 refCount
      if (refId) {
        await User.findOneAndUpdate(
          { telegramId: parseInt(refId) },
          { $inc: { refCount: 1 } }
        );
      }
    } else {
      await User.findOneAndUpdate(
        { telegramId: from.id },
        { lastSeen: new Date(), username: from.username || existing.username }
      );
    }
  } catch(e) { console.log('User save error:', e); }

  const welcomeText = getWelcomeText(from.first_name || from.username, lang, refId);
  const buttonText = getButtonText(lang);

  try {
    await bot.sendPhoto(chatId, path.join(__dirname, 'public', 'logo.jpeg'), {
      caption: welcomeText,
      reply_markup: { inline_keyboard: [[{ text: buttonText, web_app: { url: MINI_APP_URL } }]] }
    });
  } catch(e) {
    await bot.sendMessage(chatId, welcomeText, {
      reply_markup: { inline_keyboard: [[{ text: buttonText, web_app: { url: MINI_APP_URL } }]] }
    });
  }
});

// ====== TELEGRAM STARS - SEND INVOICE ======
bot.onText(/\/buy/, async (msg) => {
  await bot.sendMessage(msg.chat.id, '⭐ اختر الحزمة:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '⚡ شحن طاقة - 15 ⭐', callback_data: 'buy_energy' }],
        [{ text: '💰 500K RECORD - 50 ⭐', callback_data: 'buy_record_small' }],
        [{ text: '💰 3M RECORD - 200 ⭐', callback_data: 'buy_record_big' }],
        [{ text: '🚀 تخطي انتظار البطاقة - 100 ⭐', callback_data: 'buy_skip' }]
      ]
    }
  });
});

// Handle button clicks - send invoice
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  const products = {
    buy_energy: {
      title: '⚡ شحن طاقة فوري',
      description: 'يرجع طاقتك كاملة فوراً',
      payload: 'energy',
      amount: 15
    },
    buy_record_small: {
      title: '💰 حزمة RECORD صغيرة',
      description: '500,000 RECORD تضاف لرصيدك',
      payload: 'record_500k',
      amount: 50
    },
    buy_record_big: {
      title: '💰 حزمة RECORD كبيرة',
      description: '3,000,000 RECORD تضاف لرصيدك',
      payload: 'record_3m',
      amount: 200
    },
    buy_skip: {
      title: '🚀 تخطي وقت الانتظار',
      description: 'أكمل ترقية البطاقة فوراً بدون انتظار',
      payload: 'skip_timer',
      amount: 100
    }
  };

  const product = products[data];
  if (!product) return;

  try {
    await bot.sendInvoice(
      chatId,
      product.title,
      product.description,
      product.payload,
      '',      // providerToken - empty string for Telegram Stars
      'XTR',   // currency = Telegram Stars
      [{ label: product.title, amount: product.amount }]
    );
  } catch(e) {
    console.log('Invoice error:', e.message);
  }

  await bot.answerCallbackQuery(query.id);
});

// Pre-checkout - must approve within 10 seconds
bot.on('pre_checkout_query', async (query) => {
  try {
    await bot.answerPreCheckoutQuery(query.id, true);
  } catch(e) {
    console.log('Pre-checkout error:', e);
  }
});

// Payment successful - give the user their reward
bot.on('message', async (msg) => {
  if (!msg.successful_payment) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const payload = msg.successful_payment.invoice_payload;
  const stars = msg.successful_payment.total_amount;

  try {
    let update = {};
    let rewardText = '';

    if (payload === 'energy') {
      // Mark energy refill - app will detect on next load
      update = { energyRefill: Date.now() };
      rewardText = '⚡ تم شحن طاقتك بالكامل!';
    } else if (payload === 'record_500k') {
      const user = await User.findOne({ telegramId: userId });
      const current = user ? user.record : 0;
      update = { record: current + 500000 };
      rewardText = '💰 تمت إضافة 500,000 RECORD لرصيدك!';
    } else if (payload === 'record_3m') {
      const user = await User.findOne({ telegramId: userId });
      const current = user ? user.record : 0;
      update = { record: current + 3000000 };
      rewardText = '💰 تمت إضافة 3,000,000 RECORD لرصيدك!';
    } else if (payload === 'skip_timer') {
      // Clear all upgrade timers
      update = { cardUpgrades: {} };
      rewardText = '🚀 تم إلغاء جميع أوقات انتظار الترقية!';
    }

    await User.findOneAndUpdate(
      { telegramId: userId },
      update,
      { upsert: true }
    );

    await bot.sendMessage(chatId,
      `✅ شكراً لدعمك! ${rewardText}

⭐ دفعت: ${stars} نجمة

🔄 افتح البوت لترى تغييراتك!`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '🚀 افتح البوت', web_app: { url: MINI_APP_URL } }
          ]]
        }
      }
    );
  } catch(e) {
    console.log('Payment processing error:', e);
  }
});

// ====== API: LOAD USER DATA ======
app.get('/api/user/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: parseInt(req.params.telegramId) });
    if (!user) return res.json({ exists: false });
    res.json({ exists: true, data: user });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ====== API: SAVE USER DATA ======
app.post('/api/user/save', async (req, res) => {
  try {
    const { telegramId, ...data } = req.body;
    if (!telegramId) return res.status(400).json({ error: 'No telegramId' });

    const updated = await User.findOneAndUpdate(
      { telegramId: parseInt(telegramId) },
      { ...data, lastSeen: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: updated });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ====== API: GET ALL USERS (admin) ======
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'telegramId username firstName record rec refCount walletAddress lastSeen createdAt')
      .sort({ record: -1 })
      .limit(100);
    res.json({ count: users.length, users });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ====== WEBHOOK ======
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Keep alive
setInterval(() => { fetch('https://rec-coin.onrender.com/').catch(() => {}); }, 840000);

module.exports = app;
