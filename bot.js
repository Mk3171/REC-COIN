const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// الاتصال بـ MongoDB
mongoose.connect(process.env.MONGODB_URI);

// إنشاء البوت
const bot = new TelegramBot(process.env.BOT_TOKEN);

// رابط الـ Mini App
const MINI_APP_URL = process.env.VERCEL_URL || 'https://rec-mining-app.vercel.app';

// أمر البداية
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || msg.from.first_name;

  await bot.sendMessage(chatId, `مرحباً ${username}! 🎮`, {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🎮 افتح اللعبة',
          web_app: { url: MINI_APP_URL }
        }
      ]]
    }
  });
});

// Webhook
app.post(`/webhook`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

module.exports = app;
