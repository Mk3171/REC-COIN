// ============================================================
// BLOCK SYSTEM - REC Mining
// ملف مستقل عن bot.js - يتم تحميله عبر require('./blockSystem')
// ============================================================
const mongoose = require('mongoose');
const crypto   = require('crypto');

// ============================================================
// CONSTANTS
// ============================================================
const BLOCK_SYSTEM_SECRET = process.env.BLOCK_SECRET || 'rec-block-secret-2024';
const LAUNCH_DATE          = new Date('2024-01-01T00:00:00Z'); // تاريخ إطلاق البوت
const TOTAL_BLOCK_SUPPLY   = 1_900_000_000;
const ACTIVE_REWARD_SUPPLY = 100_000_000;
const ACTIVE_REWARD_REC    = 50;
const ACTIVE_WINNERS_DAY   = 3;
const ACTIVE_MIN_SECONDS   = 3600; // ساعة كاملة
const DECAY_RATE           = 0.99;
const AVG_BLOCKS_PER_MONTH = 60;
const COLLECT_EXPIRE_MS    = 0; // لا وقت محدد - تبقى للأبد حتى يضغط collect

// Group/Channel IDs
const GROUP_CHAT_ID    = -1003957241357;
const BLOCKS_CHANNEL_ID = -1004293036864;
const APP_URL           = process.env.APP_URL || 'https://rec-coin.onrender.com';

// ============================================================
// MONTHLY REWARD CALCULATION
// ============================================================
function getMonthsSinceLaunch() {
  const now   = new Date();
  const diff  = now - LAUNCH_DATE;
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  return Math.max(0, Math.min(months, 359));
}

function calcBlockReward() {
  const R0 = TOTAL_BLOCK_SUPPLY / (() => {
    let s = 0; for(let i=0;i<360;i++) s += Math.pow(DECAY_RATE,i); return s;
  })();
  const month   = getMonthsSinceLaunch();
  const monthly = R0 * Math.pow(DECAY_RATE, month);
  return Math.round(monthly / AVG_BLOCKS_PER_MONTH);
}

// ============================================================
// SCHEMAS
// ============================================================

// سجل كل بلوك
const BlockRecordSchema = new mongoose.Schema({
  blockNumber:   { type: Number, unique: true, required: true },
  telegramId:    { type: Number, required: true },
  username:      { type: String, default: '' },
  firstName:     { type: String, default: '' },
  reward:        { type: Number, required: true },
  month:         { type: Number, required: true }, // رقم الشهر منذ الإطلاق
  foundAt:       { type: Date,   default: Date.now },
  collectedAt:   { type: Date,   default: null },
  collected:     { type: Boolean, default: false },
  token:         { type: String, required: true }, // توكن أمان
  notified:      { type: Boolean, default: false }
});
const BlockRecord = mongoose.model('BlockRecord', BlockRecordSchema);

// عداد البلوكات
const BlockCounterSchema = new mongoose.Schema({
  key:   { type: String, unique: true },
  value: { type: Number, default: 0 }
});
const BlockCounter = mongoose.model('BlockCounter2', BlockCounterSchema);

// تتبع وقت النشاط اليومي
const DailyActivitySchema = new mongoose.Schema({
  telegramId: { type: Number, required: true },
  date:       { type: String, required: true }, // YYYY-MM-DD
  seconds:    { type: Number, default: 0 },
  lastPing:   { type: Date,   default: null },
  rewarded:   { type: Boolean, default: false }
});
DailyActivitySchema.index({ telegramId: 1, date: 1 }, { unique: true });
const DailyActivity = mongoose.model('DailyActivity', DailyActivitySchema);

// ============================================================
// HELPERS
// ============================================================
async function getNextBlockNumber() {
  const doc = await BlockCounter.findOneAndUpdate(
    { key: 'blockNum' },
    { $inc: { value: 1 } },
    { upsert: true, new: true }
  );
  return doc.value;
}

function generateToken(telegramId, blockNumber) {
  return crypto
    .createHmac('sha256', BLOCK_SYSTEM_SECRET)
    .update(`${telegramId}:${blockNumber}:${Date.now()}`)
    .digest('hex')
    .substring(0, 32);
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// ============================================================
// CORE: إعطاء بلوك لمستخدم
// ============================================================
async function awardBlock(user, bot) {
  try {
    const reward      = calcBlockReward();
    const blockNumber = await getNextBlockNumber();
    const token       = generateToken(user.telegramId, blockNumber);
    const month       = getMonthsSinceLaunch();
    const userName    = user.username ? '@' + user.username : (user.firstName || 'Miner');

    // احفظ البلوك في DB
    await BlockRecord.create({
      blockNumber,
      telegramId: user.telegramId,
      username:   user.username   || '',
      firstName:  user.firstName  || '',
      reward,
      month,
      token,
      collected: false
    });

    console.log(`[Block] #${blockNumber} → ${userName} (+${reward.toLocaleString()} REC)`);

    // أرسل إشعار شخصي للمستخدم في البوت
    try {
      await bot.sendMessage(user.telegramId,
        `⛏️ *أصبت بلوكاً!*\n\n` +
        `🎉 مبروك! لقيت بلوك جديد!\n` +
        `🔴 Block #${blockNumber}\n` +
        `💰 المكافأة: *${reward.toLocaleString()} REC*\n\n` +
        `📱 افتح البوت واضغط Collect لاستلام مكافأتك!`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [[{
              text: '🚀 افتح البوت واستلم مكافأتك',
              web_app: { url: APP_URL }
            }]]
          }
        }
      );
    } catch(e) { console.log('[Block] Personal notify error:', e.message); }

    return { blockNumber, reward, token };
  } catch(e) {
    console.log('[Block] awardBlock error:', e.message);
    return null;
  }
}

// ============================================================
// CORE: يومياً — اختيار 1-3 مستخدمين نشيطين يحصلوا على بلوك
// ============================================================
async function runDailyBlockDistribution(bot, User) {
  try {
    const today = getTodayStr();

    // المستخدمين النشيطين ساعة كاملة اليوم ولم يحصلوا على بلوك اليوم
    const activeToday = await DailyActivity.find({
      date: today,
      seconds: { $gte: ACTIVE_MIN_SECONDS }
    }).lean();

    if(activeToday.length === 0) {
      console.log('[Block] No active users today for block distribution');
      return;
    }

    // كم بلوك يومياً: 1-3 عشوائي
    const blocksToday = Math.floor(Math.random() * 3) + 1;
    const winners = [];
    const pool = [...activeToday].sort(() => Math.random() - 0.5);

    for(let i = 0; i < Math.min(blocksToday, pool.length); i++) {
      const activity = pool[i];
      // تحقق ما حصل على بلوك اليوم
      const alreadyGot = await BlockRecord.findOne({
        telegramId: activity.telegramId,
        foundAt: { $gte: new Date(today) }
      });
      if(alreadyGot) continue;

      const user = await User.findOne({ telegramId: activity.telegramId })
        .select('telegramId username firstName rec banned').lean();
      if(!user || user.banned) continue;

      const result = await awardBlock(user, bot);
      if(result) winners.push({ user, ...result });
    }

    console.log(`[Block] Daily distribution: ${winners.length} blocks awarded`);
  } catch(e) {
    console.log('[Block] Daily distribution error:', e.message);
  }
}

// ============================================================
// CORE: جائزة النشاط اليومي (50 REC × 3 أشخاص)
// ============================================================
async function runDailyActiveReward(bot, User) {
  try {
    const today = getTodayStr();

    const eligible = await DailyActivity.find({
      date: today,
      seconds: { $gte: ACTIVE_MIN_SECONDS },
      rewarded: false
    }).lean();

    if(eligible.length === 0) return;

    const winners = eligible
      .sort(() => Math.random() - 0.5)
      .slice(0, ACTIVE_WINNERS_DAY);

    for(const w of winners) {
      await User.findOneAndUpdate(
        { telegramId: w.telegramId },
        { $inc: { rec: ACTIVE_REWARD_REC } }
      );
      await DailyActivity.updateOne(
        { telegramId: w.telegramId, date: today },
        { rewarded: true }
      );

      const user = await User.findOne({ telegramId: w.telegramId }).lean();
      const name = user?.username ? '@' + user.username : (user?.firstName || 'مستخدم');

      try {
        await bot.sendMessage(w.telegramId,
          `🎁 *مكافأة النشاط اليومي!*\n\n` +
          `✅ كنت نشيطاً اليوم أكثر من ساعة\n` +
          `💰 حصلت على *${ACTIVE_REWARD_REC} REC* مجاناً!\n\n` +
          `استمر في التعدين! 🚀`,
          { parse_mode: 'Markdown' }
        );
      } catch(e) {}

      console.log(`[Activity] ${name} got ${ACTIVE_REWARD_REC} REC activity reward`);
    }
  } catch(e) {
    console.log('[Activity] Daily reward error:', e.message);
  }
}

// ============================================================
// API ENDPOINTS
// ============================================================
module.exports = function initBlockSystem(app, bot, User) {

  // ---- تتبع النشاط (ping كل دقيقة من الواجهة) ----
  app.post('/api/blocks/ping', async (req, res) => {
    try {
      const { telegramId } = req.body;
      if(!telegramId) return res.json({ ok: false });

      const today = getTodayStr();
      const now   = new Date();

      const activity = await DailyActivity.findOne({ telegramId: parseInt(telegramId), date: today });

      if(!activity) {
        await DailyActivity.create({
          telegramId: parseInt(telegramId),
          date: today,
          seconds: 60,
          lastPing: now
        });
      } else {
        // احسب الثواني من آخر ping
        const lastPing = activity.lastPing ? new Date(activity.lastPing) : now;
        const diff     = Math.min((now - lastPing) / 1000, 120); // max 2 min per ping
        await DailyActivity.updateOne(
          { telegramId: parseInt(telegramId), date: today },
          { $inc: { seconds: diff }, lastPing: now }
        );
      }

      // تحقق هل عنده بلوك غير مستلم
      const pending = await BlockRecord.findOne({
        telegramId: parseInt(telegramId),
        collected: false
      }).sort({ foundAt: -1 });

      const todayActivity = await DailyActivity.findOne({ telegramId: parseInt(telegramId), date: today });
      const activeSeconds = todayActivity?.seconds || 0;

      res.json({
        ok: true,
        pendingBlock: pending ? {
          blockNumber: pending.blockNumber,
          reward:      pending.reward,
          token:       pending.token,
          foundAt:     pending.foundAt
        } : null,
        activeSeconds: Math.floor(activeSeconds),
        activeMinutes: Math.floor(activeSeconds / 60)
      });
    } catch(e) { res.json({ ok: false }); }
  });

  // ---- استلام البلوك (Collect) ----
  app.post('/api/blocks/collect', async (req, res) => {
    try {
      const { telegramId, blockNumber, token } = req.body;
      if(!telegramId || !blockNumber || !token) return res.status(400).json({ error: 'Missing data' });

      // تحقق من البلوك
      const block = await BlockRecord.findOne({
        blockNumber: parseInt(blockNumber),
        telegramId:  parseInt(telegramId),
        token,
        collected:   false
      });

      if(!block) return res.status(404).json({ error: 'Block not found or already collected' });

      // أضف المكافأة للمستخدم
      const user = await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        { $inc: { rec: block.reward } },
        { new: true }
      );

      // سجل الاستلام
      await BlockRecord.updateOne(
        { blockNumber: parseInt(blockNumber) },
        { collected: true, collectedAt: new Date() }
      );

      const userName = block.username ? '@' + block.username : (block.firstName || 'Miner');

      // إشعار القناة والجروع بعد الضغط على Collect
      if(!block.notified) {
        const channelMsg =
          `⛏️ *NEW BLOCK COLLECTED!* ⛏️\n\n` +
          `🔴 Block #${block.blockNumber}\n` +
          `👤 Miner: ${userName}\n` +
          `💰 Reward: +${block.reward.toLocaleString()} REC\n` +
          `⏰ ${new Date().toUTCString()}\n\n` +
          `🚀 @RecMiningGame_bot`;

        const groupMsg =
          `🎉 *تم استلام بلوك جديد!*\n\n` +
          `⛏️ المعدّن: ${userName}\n` +
          `🔴 Block #${block.blockNumber}\n` +
          `💰 المكافأة: +${block.reward.toLocaleString()} REC\n\n` +
          `💡 @RecMiningGame_bot`;

        await bot.sendMessage(BLOCKS_CHANNEL_ID, channelMsg, { parse_mode: 'Markdown' }).catch(()=>{});
        await bot.sendMessage(GROUP_CHAT_ID,      groupMsg,  { parse_mode: 'Markdown' }).catch(()=>{});

        await BlockRecord.updateOne({ blockNumber: parseInt(blockNumber) }, { notified: true });
      }

      console.log(`[Block] #${blockNumber} collected by ${userName} (+${block.reward.toLocaleString()} REC)`);

      res.json({
        success: true,
        reward:  block.reward,
        newBalance: user?.rec || 0
      });
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // ---- سجل البلوكات للمستخدم ----
  app.get('/api/blocks/history/:telegramId', async (req, res) => {
    try {
      const blocks = await BlockRecord.find({ telegramId: parseInt(req.params.telegramId) })
        .sort({ foundAt: -1 })
        .limit(50)
        .lean();
      res.json(blocks);
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // ---- بحث أدمن عن بلوك برقمه ----
  app.get('/api/admin/block/:blockNumber', async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'];
      if(adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const block = await BlockRecord.findOne({ blockNumber: parseInt(req.params.blockNumber) }).lean();
      if(!block) return res.status(404).json({ error: 'Block not found' });
      res.json(block);
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // ---- كل البلوكات للأدمن ----
  app.get('/api/admin/blocks', async (req, res) => {
    try {
      const adminKey = req.headers['x-admin-key'];
      if(adminKey !== process.env.ADMIN_KEY) return res.status(403).json({ error: 'Forbidden' });

      const blocks = await BlockRecord.find()
        .sort({ blockNumber: -1 })
        .limit(200)
        .lean();
      res.json(blocks);
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // ---- معلومات النظام الحالية ----
  app.get('/api/blocks/info', async (req, res) => {
    try {
      const totalBlocks = await BlockRecord.countDocuments();
      const reward = calcBlockReward();
      const month  = getMonthsSinceLaunch();
      res.json({ totalBlocks, currentReward: reward, month, decay: DECAY_RATE });
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // ============================================================
  // SCHEDULED JOBS
  // ============================================================

  // كل يوم الساعة 20:00 UTC — توزيع البلوكات
  function scheduleDailyBlock() {
    const now     = new Date();
    const target  = new Date();
    target.setUTCHours(20, 0, 0, 0);
    if(target <= now) target.setUTCDate(target.getUTCDate() + 1);
    const delay = target - now;

    setTimeout(async () => {
      console.log('[Block] Running daily block distribution...');
      await runDailyBlockDistribution(bot, User);
      await runDailyActiveReward(bot, User);
      scheduleDailyBlock(); // جدول اليوم التالي
    }, delay);

    console.log(`[Block] Next distribution in ${Math.round(delay/3600000)}h`);
  }

  scheduleDailyBlock();

  console.log('[BlockSystem] ✅ Initialized');
  console.log(`[BlockSystem] Current block reward: ${calcBlockReward().toLocaleString()} REC`);
};
