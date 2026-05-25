const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).catch(err => console.log('MongoDB error:', err));

const bot = new TelegramBot(process.env.BOT_TOKEN);
const MINI_APP_URL = 'https://rec-coin.onrender.com';

// ====== WELCOME MESSAGES ======
function getWelcomeText(username, lang, refId) {
  const isArabic = lang && (lang === 'ar');
  const isUkrainian = lang && (lang === 'uk');
  const isChinese = lang && (lang === 'zh' || lang === 'zh-hans' || lang === 'zh-hant');

  let joinText = '';

  if (isArabic) {
    joinText = refId
      ? `مرحباً ${username}! 🎮\n\nتمت دعوتك للانضمام!\nابدأ التعدين واجمع عملات REC! 🔴`
      : `مرحباً ${username}! 🎮\n\n🔴 ابدأ التعدين واجمع عملات REC!\n⚡ رقّ البطاقات وزد سرعة التعدين\n👥 ادعُ أصدقاءك واربح مكافآت`;

  } else if (isUkrainian) {
    joinText = refId
      ? `Привіт ${username}! 🎮\n\nВас запросили приєднатися!\nПочніть майнінг і збирайте REC! 🔴`
      : `Привіт ${username}! 🎮\n\n🔴 Почніть майнінг і збирайте REC!\n⚡ Покращуйте картки для швидшого майнінгу\n👥 Запрошуйте друзів і заробляйте винагороди`;

  } else if (isChinese) {
    joinText = refId
      ? `你好 ${username}！🎮\n\n您被邀请加入！\n开始挖矿并收集REC！🔴`
      : `你好 ${username}！🎮\n\n🔴 开始挖矿并收集REC！\n⚡ 升级卡片提高挖矿速度\n👥 邀请朋友赚取奖励`;

  } else {
    // Default: English
    joinText = refId
      ? `Welcome ${username}! 🎮\n\nYou were invited to join!\nStart mining and collect REC coins! 🔴`
      : `Welcome ${username}! 🎮\n\n🔴 Start mining and collect REC coins!\n⚡ Upgrade your cards to mine faster\n👥 Invite friends and earn rewards`;
  }

  return joinText;
}

function getButtonText(lang) {
  if (lang === 'ar') return '🚀 ابدأ التعدين';
  if (lang === 'uk') return '🚀 Почати майнінг';
  if (lang === 'zh' || lang === 'zh-hans' || lang === 'zh-hant') return '🚀 开始挖矿';
  return '🚀 Start Mining';
}

// ====== /start HANDLER ======
bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  const lang = msg.from.language_code || 'en';
  const param = match[1] ? match[1].trim() : '';
  const refId = param.startsWith('ref') ? param.replace('ref', '') : '';

  const welcomeText = getWelcomeText(username, lang, refId);
  const buttonText = getButtonText(lang);

  try {
    await bot.sendPhoto(chatId, path.join(__dirname, 'public', 'logo.jpeg'), {
      caption: welcomeText,
      reply_markup: {
        inline_keyboard: [[
          { text: buttonText, web_app: { url: MINI_APP_URL } }
        ]]
      }
    });
  } catch(e) {
    await bot.sendMessage(chatId, welcomeText, {
      reply_markup: {
        inline_keyboard: [[
          { text: buttonText, web_app: { url: MINI_APP_URL } }
        ]]
      }
    });
  }
});

app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep alive (prevent Render sleep)
setInterval(() => {
  fetch('https://rec-coin.onrender.com/').catch(() => {});
}, 840000);

module.exports = app;
