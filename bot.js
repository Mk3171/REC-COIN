const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const bot = new TelegramBot(process.env.BOT_TOKEN);

const MINI_APP_URL = 'https://rec-mining-app.vercel.app';

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;

  await bot.sendMessage(chatId, `مرحباً ${username}! 🎮`, {
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

app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

module.exports = app;
