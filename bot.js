const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).catch(err => console.log('MongoDB error:', err));

const bot = new TelegramBot(process.env.BOT_TOKEN);
const MINI_APP_URL = 'https://rec-coin.onrender.com';

bot.onText(/\/start(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  const param = match[1] ? match[1].trim() : '';

  let welcomeText = `مرحباً ${username}! 🎮\n\nابدأ التعدين واجمع عملات REC! 🔴`;

  if (param.startsWith('ref')) {
    const refId = param.replace('ref', '');
    welcomeText = `مرحباً ${username}! 🎮\n\nتمت دعوتك للانضمام!\nابدأ التعدين واجمع عملات REC! 🔴`;
  }

  try {
    await bot.sendPhoto(chatId, path.join(__dirname, 'public', 'logo.jpeg'), {
      caption: welcomeText,
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Start Mining',
            web_app: { url: MINI_APP_URL }
          }
        ]]
      }
    });
  } catch(e) {
    await bot.sendMessage(chatId, welcomeText, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🚀 Start Mining',
            web_app: { url: MINI_APP_URL }
          }
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

// منع النوم
setInterval(() => {
  fetch('https://rec-coin.onrender.com/').catch(() => {});
}, 840000);

module.exports = app;
