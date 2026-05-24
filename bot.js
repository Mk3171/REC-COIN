const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// الاتصال بـ MongoDB
mongoose.connect(process.env.MONGODB_URI).catch(err => console.log('MongoDB error:', err));

// إنشاء البوت
const bot = new TelegramBot(process.env.BOT_TOKEN);

// رابط الـ Mini App
const MINI_APP_URL = 'https://rec-coin.onrender.com';

// أمر البداية
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;

  await bot.sendMessage(chatId, `مرحباً ${username}! 🎮\n\nابدأ التعدين واجمع عملات REC! 🔴`, {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🚀 Start Mining',
          web_app: { url: MINI_APP_URL }
        }
      ]]
    }
  });
});

// Webhook
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// خدمة الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
