// ====== withdraw.js — REC Mining Withdrawal Module ======
const mongoose = require('mongoose');

const REC_CONTRACT  = 'EQCNkOinRhMSplM0DzP18Fz-4WV293YMHF6umS9tGsvOGDV9';
const FEE_WALLET    = 'UQD-FoGlRG5pBxZpkf3H9ZOsNTL5basBbTEZE8zvMgHLB99o';
const WITHDRAW_FEE  = 150;
const MIN_WITHDRAW  = 10000;
const MAX_WITHDRAW  = 50000;
const VIP_MAX_WITHDRAW = 1000000;
const MIN_WITHDRAW_TON = 0.1;
const MAX_WITHDRAW_TON_DAILY = 5;

// ── sendJetton ────────────────────────────────────────────
async function sendJetton(toAddress, amount, comment) {
  console.log('[sendJetton] START → to:', toAddress, '| amount:', amount, '| comment:', comment);

  const mnemonic_raw = process.env.BOT_WALLET_MNEMONIC;
  if (!mnemonic_raw) {
    console.log('[sendJetton] ❌ BOT_WALLET_MNEMONIC is not set!');
    return { success: false, error: 'BOT_WALLET_MNEMONIC missing' };
  }

  const mnemonic = mnemonic_raw.trim().split(/\s+/);
  console.log('[sendJetton] Mnemonic word count:', mnemonic.length);
  if (mnemonic.length !== 24) {
    console.log('[sendJetton] ❌ Expected 24 words, got:', mnemonic.length);
    return { success: false, error: 'Invalid mnemonic word count: ' + mnemonic.length };
  }

  try {
    const tonModule = require('@ton/ton');
    const { TonClient, JettonMaster, internal, toNano, Address, beginCell } = tonModule;
    const { mnemonicToPrivateKey } = require('@ton/crypto');

    const keyPair = await mnemonicToPrivateKey(mnemonic);
    console.log('[sendJetton] Key pair derived ✅');

    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY || ''
    });

    // Auto-detect wallet version
    const expectedAddr = (process.env.BOT_WALLET_ADDRESS || '').trim();
    const versions = ['WalletContractV5R1','WalletContractV5Beta','WalletContractV4','WalletContractV3R2'];
    let wallet = null;
    for (const ver of versions) {
      if (tonModule[ver]) {
        const w = tonModule[ver].create({ publicKey: keyPair.publicKey, workchain: 0 });
        const addr = w.address.toString({ urlSafe: true, bounceable: false });
        console.log('[sendJetton] Trying', ver, '→', addr);
        if (!expectedAddr || addr === expectedAddr) { wallet = w; console.log('[sendJetton] ✅ Matched:', ver); break; }
      }
    }
    if (!wallet) {
      console.log('[sendJetton] ❌ No wallet version matched expected address:', expectedAddr);
      return { success: false, error: 'No matching wallet version found' };
    }

    const contract = client.open(wallet);

    let seqno;
    try {
      seqno = await contract.getSeqno();
      console.log('[sendJetton] seqno:', seqno);
    } catch(e) {
      console.log('[sendJetton] ❌ getSeqno failed:', e.message);
      return { success: false, error: 'getSeqno failed: ' + e.message };
    }

    let jettonWalletAddr;
    try {
      const jettonMaster = client.open(JettonMaster.create(Address.parse(REC_CONTRACT)));
      jettonWalletAddr = await jettonMaster.getWalletAddress(wallet.address);
      console.log('[sendJetton] Jetton wallet addr:', jettonWalletAddr.toString());
    } catch(e) {
      console.log('[sendJetton] ❌ getWalletAddress failed:', e.message);
      return { success: false, error: 'getWalletAddress failed: ' + e.message };
    }

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

    try {
      await contract.sendTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [internal({ to: jettonWalletAddr, value: toNano('0.05'), body: transferBody })]
      });
      console.log('[sendJetton] ✅ Transfer sent successfully');
      return { success: true };
    } catch(e) {
      console.log('[sendJetton] ❌ sendTransfer failed:', e.message);
      return { success: false, error: 'sendTransfer failed: ' + e.message };
    }

  } catch(e) {
    console.log('[sendJetton] ❌ Unexpected error:', e.message);
    return { success: false, error: e.message };
  }
}

// ── sendNativeTon ─────────────────────────────────────────
// Sends raw/native TON (not a jetton) — used for the Spin the Wheel TON jackpot
// withdrawals. Reuses the exact same wallet-detection logic as sendJetton.
async function sendNativeTon(toAddress, amount, comment) {
  console.log('[sendNativeTon] START → to:', toAddress, '| amount:', amount, '| comment:', comment);

  const mnemonic_raw = process.env.BOT_WALLET_MNEMONIC;
  if (!mnemonic_raw) {
    console.log('[sendNativeTon] ❌ BOT_WALLET_MNEMONIC is not set!');
    return { success: false, error: 'BOT_WALLET_MNEMONIC missing' };
  }

  const mnemonic = mnemonic_raw.trim().split(/\s+/);
  if (mnemonic.length !== 24) {
    console.log('[sendNativeTon] ❌ Expected 24 words, got:', mnemonic.length);
    return { success: false, error: 'Invalid mnemonic word count: ' + mnemonic.length };
  }

  try {
    const tonModule = require('@ton/ton');
    const { TonClient, internal, toNano, Address } = tonModule;
    const { mnemonicToPrivateKey } = require('@ton/crypto');

    const keyPair = await mnemonicToPrivateKey(mnemonic);

    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY || ''
    });

    const expectedAddr = (process.env.BOT_WALLET_ADDRESS || '').trim();
    const versions = ['WalletContractV5R1','WalletContractV5Beta','WalletContractV4','WalletContractV3R2'];
    let wallet = null;
    for (const ver of versions) {
      if (tonModule[ver]) {
        const w = tonModule[ver].create({ publicKey: keyPair.publicKey, workchain: 0 });
        const addr = w.address.toString({ urlSafe: true, bounceable: false });
        if (!expectedAddr || addr === expectedAddr) { wallet = w; break; }
      }
    }
    if (!wallet) {
      console.log('[sendNativeTon] ❌ No matching wallet version found');
      return { success: false, error: 'No matching wallet version found' };
    }

    const contract = client.open(wallet);

    let seqno;
    try {
      seqno = await contract.getSeqno();
    } catch(e) {
      console.log('[sendNativeTon] ❌ getSeqno failed:', e.message);
      return { success: false, error: 'getSeqno failed: ' + e.message };
    }

    try {
      await contract.sendTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [internal({ to: Address.parse(toAddress), value: toNano(amount.toString()), body: comment || 'REC Mining Wheel Prize' })]
      });
      console.log('[sendNativeTon] ✅ Transfer sent successfully');
      return { success: true };
    } catch(e) {
      console.log('[sendNativeTon] ❌ sendTransfer failed:', e.message);
      return { success: false, error: 'sendTransfer failed: ' + e.message };
    }

  } catch(e) {
    console.log('[sendNativeTon] ❌ Unexpected error:', e.message);
    return { success: false, error: e.message };
  }
}

// ── Withdrawal handler ────────────────────────────────────
function registerWithdrawRoutes(app, User, Withdrawal) {

  // Normal withdraw (10k–50k)
  app.post('/api/withdraw', async (req, res) => {
    const { telegramId, amount } = req.body;
    if (!telegramId || !amount) return res.status(400).json({ error: 'Missing data' });

    try {
      const user = await User.findOne({ telegramId: parseInt(telegramId) });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (!user.walletAddress) return res.status(400).json({ error: 'no_wallet' });
      if (amount < MIN_WITHDRAW) return res.status(400).json({ error: 'below_minimum', min: MIN_WITHDRAW });
      if (user.rec < amount) return res.status(400).json({ error: 'insufficient_balance' });

      // Daily limit — only count confirmed sent withdrawals
      const today = new Date().toISOString().split('T')[0];
      const todayStart = new Date(today + 'T00:00:00.000Z');
      const todaySent = await Withdrawal.aggregate([
        { $match: { telegramId: parseInt(telegramId), status: 'sent', createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const dailyWithdrawn = todaySent[0] ? todaySent[0].total : 0;
      const DAILY_LIMIT = (user.vip && user.vip.tier >= 1 && user.vip.expiry > Date.now()) ? VIP_MAX_WITHDRAW : MAX_WITHDRAW;
      if (dailyWithdrawn + amount > DAILY_LIMIT) {
        return res.status(400).json({ error: 'daily_limit', remaining: Math.max(0, DAILY_LIMIT - dailyWithdrawn) });
      }

      const netAmount = amount - WITHDRAW_FEE;
      if (netAmount <= 0) return res.status(400).json({ error: 'amount_too_small' });

      // Deduct balance
      await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        { $inc: { rec: -amount }, dailyWithdrawn: dailyWithdrawn + amount, lastWithdrawDate: today }
      );

      // Save record
      const withdrawal = new Withdrawal({
        telegramId: parseInt(telegramId), username: user.username,
        walletAddress: user.walletAddress,
        amount, fee: WITHDRAW_FEE, netAmount, status: 'pending'
      });
      await withdrawal.save();

      res.json({ success: true, netAmount, fee: WITHDRAW_FEE, status: 'pending' });
      console.log('[Withdraw] Request saved → ID:', withdrawal._id, '| user:', telegramId, '| amount:', amount);

      // Background send
      setImmediate(async function() {
        try {
          const r = await sendJetton(user.walletAddress, netAmount, 'REC Mining Withdrawal');
          if (r && r.success) {
            await sendJetton(FEE_WALLET, WITHDRAW_FEE, 'REC Mining Fee');
            await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'sent' });
            console.log('[Withdraw] ✅ SENT:', netAmount, 'REC →', user.walletAddress);
          } else {
            await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { $inc: { rec: amount } });
            await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'failed' });
            console.log('[Withdraw] ❌ FAILED & REFUNDED:', amount, 'REC → user', telegramId, '| Reason:', r && r.error);
          }
        } catch(e) {
          await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { $inc: { rec: amount } }).catch(()=>{});
          await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'failed' }).catch(()=>{});
          console.log('[Withdraw] ❌ EXCEPTION & REFUNDED:', e.message);
        }
      });

    } catch(e) {
      console.log('[Withdraw] Server error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // TON withdraw (from Spin the Wheel TON jackpot winnings) — min 0.1, max 5/day
  app.post('/api/withdraw-ton', async (req, res) => {
    const { telegramId, amount } = req.body;
    if (!telegramId || !amount) return res.status(400).json({ error: 'Missing data' });

    try {
      const user = await User.findOne({ telegramId: parseInt(telegramId) });
      if (!user) return res.status(404).json({ error: 'User not found' });
      if (!user.walletAddress) return res.status(400).json({ error: 'no_wallet' });
      if (amount < MIN_WITHDRAW_TON) return res.status(400).json({ error: 'below_minimum', min: MIN_WITHDRAW_TON });
      if ((user.tonBalance || 0) < amount) return res.status(400).json({ error: 'insufficient_balance' });

      // Daily limit — only count confirmed sent TON withdrawals
      const today = new Date().toISOString().split('T')[0];
      const todayStart = new Date(today + 'T00:00:00.000Z');
      const todaySent = await Withdrawal.aggregate([
        { $match: { telegramId: parseInt(telegramId), status: 'sent', currency: 'TON', createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const dailyWithdrawn = todaySent[0] ? todaySent[0].total : 0;
      if (dailyWithdrawn + amount > MAX_WITHDRAW_TON_DAILY) {
        return res.status(400).json({ error: 'daily_limit', remaining: Math.max(0, MAX_WITHDRAW_TON_DAILY - dailyWithdrawn) });
      }

      // Deduct balance
      await User.findOneAndUpdate(
        { telegramId: parseInt(telegramId) },
        { $inc: { tonBalance: -amount } }
      );

      // Save record
      const withdrawal = new Withdrawal({
        telegramId: parseInt(telegramId), username: user.username,
        walletAddress: user.walletAddress,
        amount, fee: 0, netAmount: amount, status: 'pending', currency: 'TON'
      });
      await withdrawal.save();

      res.json({ success: true, netAmount: amount, fee: 0, status: 'pending' });
      console.log('[Withdraw TON] Request saved → ID:', withdrawal._id, '| user:', telegramId, '| amount:', amount);

      // Background send
      setImmediate(async function() {
        try {
          const r = await sendNativeTon(user.walletAddress, amount, 'REC Mining Wheel Jackpot Withdrawal');
          if (r && r.success) {
            await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'sent' });
            console.log('[Withdraw TON] ✅ SENT:', amount, 'TON →', user.walletAddress);
          } else {
            await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { $inc: { tonBalance: amount } });
            await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'failed' });
            console.log('[Withdraw TON] ❌ FAILED & REFUNDED:', amount, 'TON → user', telegramId, '| Reason:', r && r.error);
          }
        } catch(e) {
          await User.findOneAndUpdate({ telegramId: parseInt(telegramId) }, { $inc: { tonBalance: amount } }).catch(()=>{});
          await Withdrawal.findByIdAndUpdate(withdrawal._id, { status: 'failed' }).catch(()=>{});
          console.log('[Withdraw TON] ❌ EXCEPTION & REFUNDED:', e.message);
        }
      });

    } catch(e) {
      console.log('[Withdraw TON] Server error:', e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Per-user history
  app.get('/api/withdrawals/:telegramId', async (req, res) => {
    try {
      const list = await Withdrawal.find({ telegramId: parseInt(req.params.telegramId) })
        .sort({ createdAt: -1 }).limit(50);
      res.json({ count: list.length, withdrawals: list });
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  // All withdrawals (admin)
  app.get('/api/withdrawals', async (req, res) => {
    try {
      const list = await Withdrawal.find().sort({ createdAt: -1 }).limit(50);
      res.json({ count: list.length, withdrawals: list });
    } catch(e) { res.status(500).json({ error: e.message }); }
  });

  console.log('[Withdraw Module] ✅ Routes registered');
}

module.exports = { sendJetton, sendNativeTon, registerWithdrawRoutes };


// ── Diagnostic endpoint ───────────────────────────────────
function registerDiagnosticRoute(app) {
  app.get('/api/test-wallet', async (req, res) => {
    const log = [];
    const out = (msg) => { log.push(msg); console.log('[TEST-WALLET]', msg); };

    out('=== Wallet Diagnostic ===');

    // 1. Check env vars
    const mnemonic_raw = process.env.BOT_WALLET_MNEMONIC;
    const expectedAddr = process.env.BOT_WALLET_ADDRESS;
    out('BOT_WALLET_MNEMONIC: ' + (mnemonic_raw ? 'SET (' + mnemonic_raw.trim().split(/\s+/).length + ' words)' : 'MISSING ❌'));
    out('BOT_WALLET_ADDRESS: ' + (expectedAddr || 'MISSING ❌'));

    if (!mnemonic_raw) return res.json({ ok: false, log });

    const mnemonic = mnemonic_raw.trim().split(/\s+/);
    if (mnemonic.length !== 24) {
      out('❌ Expected 24 words, got: ' + mnemonic.length);
      return res.json({ ok: false, log });
    }

    try {
      const tonModule = require('@ton/ton');
      const { TonClient, Address } = tonModule;
      const { mnemonicToPrivateKey } = require('@ton/crypto');

      const keyPair = await mnemonicToPrivateKey(mnemonic);
      const versions = ['WalletContractV5R1','WalletContractV5Beta','WalletContractV4','WalletContractV3R2'];
      let matchedWallet = null, matchedVer = null;
      for (const ver of versions) {
        if (tonModule[ver]) {
          const w = tonModule[ver].create({ publicKey: keyPair.publicKey, workchain: 0 });
          const addr = w.address.toString({ urlSafe: true, bounceable: false });
          out(ver + ' → ' + addr + (addr === expectedAddr ? ' ✅ MATCH' : ''));
          if (addr === expectedAddr) { matchedWallet = w; matchedVer = ver; }
        } else { out(ver + ' → not available in this @ton/ton version'); }
      }
      const wallet = matchedWallet;
      const derivedAddr = wallet ? wallet.address.toString({ urlSafe: true, bounceable: false }) : null;
      out('Best match: ' + (matchedVer || 'NONE ❌'));
      out('Expected address:   ' + (expectedAddr || '(not set)'));
      out('Address match: ' + (derivedAddr === expectedAddr ? '✅ YES' : '❌ NO — mismatch!'));

      const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: process.env.TONCENTER_API_KEY || ''
      });
      const contract = client.open(wallet);

      try {
        const seqno = await contract.getSeqno();
        out('getSeqno(): ' + seqno + ' ✅');
        const balance = await contract.getBalance();
        out('TON balance: ' + (Number(balance) / 1e9).toFixed(4) + ' TON');
        res.json({ ok: true, log });
      } catch(e) {
        out('getSeqno() FAILED ❌: ' + e.message);
        out('→ Wallet not deployed or wrong address derived from mnemonic');
        res.json({ ok: false, log });
      }

    } catch(e) {
      out('Unexpected error ❌: ' + e.message);
      res.json({ ok: false, log });
    }
  });
  console.log('[Diagnostic] ✅ /api/test-wallet registered');
}

module.exports = { sendJetton, sendNativeTon, registerWithdrawRoutes, registerDiagnosticRoute };
