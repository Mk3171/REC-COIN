// ============================================================
// BLOCK SYSTEM V2 — Bitcoin-style Mining
// 500M REC / 30 years / ~30 blocks per day
// Difficulty based on recPerSec — max 1 block per user per day
// ============================================================
const mongoose = require('mongoose');
const crypto   = require('crypto');

// ============================================================
// CONSTANTS
// ============================================================
const BLOCK_SECRET      = process.env.BLOCK_SECRET || 'rec-block-2024';
const BLOCK_REWARD      = 1522;        // REC per block (fixed)
const BLOCK_DIFFICULTY  = 96.0;        // harder = less blocks
const MAX_BLOCK_PER_DAY = 1;           // max 1 block per user per day
const GROUP_CHAT_ID     = -1003957241357;
const BLOCKS_CHANNEL_ID = -1004293036864;
const APP_URL           = process.env.APP_URL || 'https://rec-coin.onrender.com';

// ============================================================
// SCHEMAS
// ============================================================
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

// ============================================================
// HELPERS
// ============================================================
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
    .update(`${telegramId}:${blockNumber}:${Date.now()}`)
    .digest('hex').substring(0, 32);
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// ============================================================
// CHECK IF USER FOUND A BLOCK (called from /api/blocks/check)
// ============================================================
async function checkBlockFound(telegramId, recPerSec, User) {
  try {
    if(!recPerSec || recPerSec <= 0) return null;

    // تحقق ما حصل على بلوك اليوم
    const today = getTodayStr();
    const todayStart = new Date(today);
    const alreadyFound = await Block.findOne({
      telegramId: parseInt(telegramId),
      foundAt: { $gte: todayStart }
    });
    if(alreadyFound) return null;

    // حساب الاحتمال — مثل Bitcoin
    const chance = recPerSec / BLOCK_DIFFICULTY;
    const roll   = Math.random();

    if(roll > chance) return null; // ما لاقى

    // 🎉 لاقى بلوك!
    const user       = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
    if(!user) return null;

    const blockNumber = await getNextBlockNumber();
    const token       = generateToken(telegramId, blockNumber);

    await Block.create({
      blockNumber,
      telegramId: parseInt(telegramId),
      username:   user.username   || '',
      firstName:  user.firstName  || '',
      reward:     BLOCK_REWARD,
      token,
      collected:  false
    });

    console.log(`[Block] #${blockNumber} found by ${user.username || user.firstName} (speed: ${recPerSec})`);
    return { blockNumber, reward: BLOCK_REWARD, token };
  } catch(e) {
    console.log('[Block] checkBlockFound error:', e.message);
    return null;
  }
}

// ============================================================
// MODULE INIT
// ============================================================
module.exports = function initBlockSystem(app, bot, User) {

  // ---- فحص بلوك (يُستدعى كل 3 ثواني من الواجهة) ----
  app.post('/api/blocks/check', async (req, res) => {
    try {
      const { telegramId, recPerSec } = req.body;
      if(!telegramId || !recPerSec) return res.json({ found: false });

      const result = await checkBlockFound(telegramId, parseFloat(recPerSec), User);
      if(!result) return res.json({ found: false });

      // أرسل إشعار للمستخدم
      const user = await User.findOne({ telegramId: parseInt(telegramId) }).lean();
      const name = user?.username ? '@' + user.username : (user?.firstName || 'Miner');

      bot.sendMessage(telegramId,
        `⛏️ *لقيت بلوك!*\n\n🔴 Block #${result.blockNumber}\n💰 المكافأة: *${result.reward.toLocaleString()} REC*\n\nافتح البوت واضغط Collect! 🚀`,
        { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: '🚀 افتح البوت', web_app: { url: APP_URL } }]] } }
      ).catch(()=>{});

      res.json({ found: true, blockNumber: result.blockNumber, reward: result.reward, token: result.token });
    } catch(e) { res.json({ found: false }); }
  });

  // ---- Collect البلوك ----
  app.post('/api/blocks/collect', async (req, res) => {
    try {
      const { telegramId, blockNumber, token } = req.body;
      if(!telegramId || !blockNumber || !token) return res.status(400).json({ error: 'Missing data' });

      const block = await Block.findOne({
        blockNumber: parseInt(blockNumber),
        telegramId:  parseInt(telegramId),
        token,
        collected:   false
      });
      if(!block) return res.status(404).json({ error: 'Block not found' });

      // أضف للرصيد
      const user = await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        { $inc: { rec: block.reward } },
        { new: true }
      );

      await Block.updateOne({ blockNumber: parseInt(blockNumber) }, { collected: true, collectedAt: new Date() });

      const name = block.username ? '@' + block.username : (block.firstName || 'Miner');

      // إشعار القناة والجروع
      const msg =
        `⛏️ *NEW BLOCK MINED!* ⛏️\n\n` +
        `🔴 Block #${block.blockNumber}\n` +
        `👤 Miner: ${name}\n` +
        `💰 Reward: +${block.reward.toLocaleString()} REC\n` +
        `⏰ ${new Date().toUTCString()}\n\n` +
        `🚀 @RecMiningGame_bot`;

      bot.sendMessage(BLOCKS_CHANNEL_ID, msg, { parse_mode: 'Markdown' }).catch(()=>{});
      bot.sendMessage(GROUP_CHAT_ID,
        `🎉 *${name} لاقى بلوك!*\n🔴 Block #${block.blockNumber}\n💰 +${block.reward.toLocaleString()} REC`,
        { parse_mode: 'Markdown' }
      ).catch(()=>{});

      res.json({ success: true, reward: block.reward, newBalance: user?.rec || 0 });
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // ---- فحص بلوك pending ----
  app.post('/api/blocks/pending', async (req, res) => {
    try {
      const { telegramId } = req.body;
      if(!telegramId) return res.json({ pending: null });

      const block = await Block.findOne({ telegramId: parseInt(telegramId), collected: false })
        .sort({ foundAt: -1 });

      res.json({ pending: block ? { blockNumber: block.blockNumber, reward: block.reward, token: block.token } : null });
    } catch(e) { res.json({ pending: null }); }
  });

  // ---- سجل البلوكات ----
  app.get('/api/blocks/history/:telegramId', async (req, res) => {
    try {
      const blocks = await Block.find({ telegramId: parseInt(req.params.telegramId) })
        .sort({ foundAt: -1 }).limit(50).lean();
      res.json(blocks);
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // ---- بحث أدمن ----
  app.get('/api/admin/block/:num', async (req, res) => {
    try {
      if(req.headers['x-admin-key'] !== process.env.ADMIN_KEY && req.query.key !== '8933829639')
        return res.status(403).json({ error: 'Forbidden' });
      const block = await Block.findOne({ blockNumber: parseInt(req.params.num) }).lean();
      res.json(block || { error: 'Not found' });
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  console.log('[BlockSystem V2] ✅ Initialized');
  console.log(`[BlockSystem V2] Difficulty: ${BLOCK_DIFFICULTY} | Reward: ${BLOCK_REWARD} REC`);
};
