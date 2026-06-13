// ====== withdraw.js — REC Mining Withdrawal Module ======
const mongoose = require('mongoose');

const REC_CONTRACT  = 'EQCNkOinRhMSplM0DzP18Fz-4WV293YMHF6umS9tGsvOGDV9';
const FEE_WALLET    = 'UQD-FoGlRG5pBxZpkf3H9ZOsNTL5basBbTEZE8zvMgHLB99o';
const WITHDRAW_FEE  = 150;
const MIN_WITHDRAW  = 10000;
const MAX_WITHDRAW  = 50000;
const VIP_MAX_WITHDRAW = 1000000;

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
    const { TonClient, WalletContractV4, JettonMaster, internal, toNano, Address, beginCell } = require('@ton/ton');
    const { mnemonicToPrivateKey } = require('@ton/crypto');

    const keyPair = await mnemonicToPrivateKey(mnemonic);
    console.log('[sendJetton] Key pair derived ✅');

    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY || ''
    });

    const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
    console.log('[sendJetton] Derived wallet address (V4):', wallet.address.toString());
    console.log('[sendJetton] Expected bot address:', process.env.BOT_WALLET_ADDRESS);

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

module.exports = { sendJetton, registerWithdrawRoutes };


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
      const { TonClient, WalletContractV4, Address } = require('@ton/ton');
      const { mnemonicToPrivateKey } = require('@ton/crypto');

      const keyPair = await mnemonicToPrivateKey(mnemonic);
      const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
      const derivedAddr = wallet.address.toString({ urlSafe: true, bounceable: true });
      out('Derived V4 address: ' + derivedAddr);
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

module.exports = { sendJetton, registerWithdrawRoutes, registerDiagnosticRoute };
