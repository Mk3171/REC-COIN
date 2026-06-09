const mongoose = require('mongoose');
const crypto   = require('crypto');

const BLOCK_SECRET      = process.env.BLOCK_SECRET || 'rec-block-2024';
const BLOCK_REWARD      = 1522;
const BLOCK_DIFFICULTY  = 0.5;  // Calibrated for real miningSpeed values
const GROUP_CHAT_ID     = -1003957241357;
const BLOCKS_CHANNEL_ID = -1004293036864;
const APP_URL           = process.env.APP_URL || 'https://rec-coin.onrender.com';

const BlockSchema = new mongoose.Schema({
  blockNumber: { type: Number, unique: true, required: true },
  telegramId:  { type: Number, required: true },
  username:    { type: String, default: '' },
  firstName:   { type: String, default: '' },
  reward:      { type: Number, default: 1522 },
  foundAt:     { type: Date, default: Date.now },
  collectedAt: { type: Date, default: null },
  collected:   { type: Boolean, default: false },
  token:       { type: String, required: true }
});
const Block = mongoose.model('BlockV2', BlockSchema);

const BlockCounterSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: { type: Number, default: 0 }
});
const BlockCounter = mongoose.model('BlockCounterV2', BlockCounterSchema);

async function getNextBlockNumber() {
  const doc = await BlockCounter.findOneAndUpdate(
    { key: 'total' },
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );
  return doc.value;
}

function generateToken(telegramId, blockNumber) {
  return crypto.createHmac('sha256', BLOCK_SECRET)
    .update(telegramId + ':' + blockNumber + ':' + Date.now())
    .digest('hex').substring(0, 32);
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}


function cardRECSpeed(lvl) {
  if(!lvl || lvl <= 0) return 0;
  return 0.0000001 * Math.pow(1000, (lvl - 1) / 99);
}
function calcMiningSpeedLocal(cardLevels) {
  if(!cardLevels) return 0;
  var speed = 0;
  Object.keys(cardLevels).forEach(function(key) {
    var lvl = cardLevels[key] || 0;
    var m = parseInt(key.split('_')[0]) === 4 ? 3 : 1;
    speed += cardRECSpeed(lvl) * m;
  });
  return parseFloat(speed.toFixed(8));
}

async function awardBlock(user, bot) {
  const blockNumber = await getNextBlockNumber();
  const token = generateToken(user.telegramId, blockNumber);
  const name = user.username ? '@' + user.username : (user.firstName || 'Miner');

  await Block.create({
    blockNumber,
    telegramId: parseInt(user.telegramId),
    username:   user.username  || '',
    firstName:  user.firstName || '',
    reward:     BLOCK_REWARD,
    token,
    collected:  false
  });

  console.log('[Block] #' + blockNumber + ' found by ' + name + ' (speed: ' + user.miningSpeed + ')');

  // Personal notification
  bot.sendMessage(user.telegramId,
    '*Block Found!*\n\nBlock #' + blockNumber + '\nReward: ' + BLOCK_REWARD.toLocaleString() + ' REC\n\nOpen the bot and press Collect!',
    { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: 'Open Bot', web_app: { url: APP_URL } }]] } }
  ).catch(function(){});

  return { blockNumber, reward: BLOCK_REWARD, token };
}

// Cloud block check - runs every minute on server
async function runCloudBlockCheck(bot, User) {
  try {
    const today = getTodayStr();
    const todayStart = new Date(today);

    // Get active users - include those with cardLevels even if miningSpeed not saved yet
    const users = await User.find({
      banned: false,
      lastSeen: { $gte: new Date(Date.now() - 7 * 86400000) }
    }).select('telegramId username firstName miningSpeed cardLevels').lean();

    if(users.length === 0) return;

    // All active users get a daily luck roll
    const users_filtered = users;
    if(!users_filtered.length) return;
    console.log('[Block Cloud] Daily luck roll for ' + users_filtered.length + ' users...');

    for(const user of users_filtered) {
      try {
        // Already won today?
        const alreadyWon = await Block.findOne({ telegramId: user.telegramId, foundAt: { $gte: todayStart } });
        if(alreadyWon) continue;

        // Already rolled today?
        const alreadyRolled = await DailyRoll.findOne({ telegramId: user.telegramId, date: today });
        if(alreadyRolled) continue;

        // Record roll
        try { await DailyRoll.create({ telegramId: user.telegramId, date: today }); } catch(e) {}

        // 40% daily luck chance
        if(Math.random() < BLOCK_LUCK_CHANCE) {
          await awardBlock(user, bot);
        }
      } catch(e) {}
    }
  } catch(e) {
    console.log('[Block Cloud] Error:', e.message);
  }
}

module.exports = function initBlockSystem(app, bot, User) {

  app.post('/api/blocks/check', async (req, res) => {
    try {
      const { telegramId } = req.body;
      if(!telegramId) return res.json({ found: false });

      const today = getTodayStr();

      // Already won a block today?
      const alreadyWon = await Block.findOne({ telegramId: parseInt(telegramId), foundAt: { $gte: new Date(today) } });
      if(alreadyWon) return res.json({ found: false });

      // Already rolled today (but didn't win)?
      const alreadyRolled = await DailyRoll.findOne({ telegramId: parseInt(telegramId), date: today });
      if(alreadyRolled) return res.json({ found: false });

      // Record this roll attempt (one per day)
      try { await DailyRoll.create({ telegramId: parseInt(telegramId), date: today }); } catch(e) {}

      // Roll luck: 40% daily chance
      console.log('[Block] Luck roll for ' + telegramId + ' — chance: ' + (BLOCK_LUCK_CHANCE * 100) + '%');
      if(Math.random() > BLOCK_LUCK_CHANCE) return res.json({ found: false });

      // Lucky! Award random 100-200 REC block
      const user = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
      if(!user) return res.json({ found: false });

      const result = await awardBlock(user, bot);
      res.json({ found: true, blockNumber: result.blockNumber, reward: result.reward, token: result.token });
    } catch(e) { res.json({ found: false }); }
  });

  app.post('/api/blocks/collect', async (req, res) => {
    try {
      const { telegramId, blockNumber, token } = req.body;
      if(!telegramId || !blockNumber || !token) return res.status(400).json({ error: 'Missing data' });

      const block = await Block.findOne({ blockNumber: parseInt(blockNumber), telegramId: parseInt(telegramId), token, collected: false });
      if(!block) return res.status(404).json({ error: 'Block not found' });

      const user = await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        { $inc: { rec: block.reward } },
        { new: true }
      );

      await Block.updateOne({ blockNumber: parseInt(blockNumber) }, { collected: true, collectedAt: new Date() });

      const name = block.username ? '@' + block.username : (block.firstName || 'Miner');
      const msg = 'NEW BLOCK MINED!\n\nBlock #' + block.blockNumber + '\nMiner: ' + name + '\nReward: +' + block.reward.toLocaleString() + ' REC\n\n@RecMiningGame_bot';

      bot.sendMessage(BLOCKS_CHANNEL_ID, msg).catch(function(){});
      bot.sendMessage(GROUP_CHAT_ID, 'Block #' + block.blockNumber + ' collected by ' + name + ' (+' + block.reward.toLocaleString() + ' REC)').catch(function(){});

      res.json({ success: true, reward: block.reward, newBalance: user ? user.rec : 0 });
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/blocks/pending', async (req, res) => {
    try {
      const { telegramId } = req.body;
      if(!telegramId) return res.json({ pending: null });
      const block = await Block.findOne({ telegramId: parseInt(telegramId), collected: false }).sort({ foundAt: -1 });
      res.json({ pending: block ? { blockNumber: block.blockNumber, reward: block.reward, token: block.token } : null });
    } catch(e) { res.json({ pending: null }); }
  });

  app.get('/api/blocks/history/:telegramId', async (req, res) => {
    try {
      const blocks = await Block.find({ telegramId: parseInt(req.params.telegramId) }).sort({ foundAt: -1 }).limit(50).lean();
      res.json(blocks);
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  app.get('/api/admin/block/:num', async (req, res) => {
    try {
      if(req.headers['x-admin-key'] !== process.env.ADMIN_KEY && req.query.key !== '8933829639')
        return res.status(403).json({ error: 'Forbidden' });
      const block = await Block.findOne({ blockNumber: parseInt(req.params.num) }).lean();
      res.json(block || { error: 'Not found' });
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // Cloud block check every minute
  setInterval(function() { runCloudBlockCheck(bot, User); }, 60000);
  setTimeout(function() { runCloudBlockCheck(bot, User); }, 5000);

  console.log('[BlockSystem V2] Initialized - difficulty: ' + BLOCK_DIFFICULTY + ' reward: ' + BLOCK_REWARD + ' REC');
};
