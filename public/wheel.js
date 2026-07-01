// ====== SPIN THE WHEEL ======
// Ads for this feature come EXCLUSIVELY from RichAds (kept separate from the
// Monetag-based "ADS" section). The server is the sole authority on the daily
// ad-watch count and the spin outcome — this file only renders state it gets
// back from /api/wheel/*.

// Must match WHEEL_VISUAL_WEDGES on the server EXACTLY (order + length).
var WHEEL_VISUAL_WEDGES = [
  'extra_spin','3mrd','20rec','01ton','50rec','10mrd',
  '05ton','200rec','500rec','1ton','5000rec','10ton',
  '1trillion','50000rec','no_luck'
];
var WHEEL_WEDGE_INFO = {
  no_luck:    { amount: 0,             currency: null,     color: '#2a2a35' },
  extra_spin: { amount: 0,             currency: null,     color: '#00ACC1' },
  '3mrd':     { amount: 3000000000,    currency: 'record', color: '#1565C0' },
  '20rec':    { amount: 20,            currency: 'rec',    color: '#2E7D32' },
  '50rec':    { amount: 50,            currency: 'rec',    color: '#388E3C' },
  '10mrd':    { amount: 10000000000,   currency: 'record', color: '#6A1B9A' },
  '200rec':   { amount: 200,           currency: 'rec',    color: '#00838F' },
  '500rec':   { amount: 500,           currency: 'rec',    color: '#EF6C00' },
  '1trillion':{ amount: 1000000000000, currency: 'record', color: '#B71C1C' },
  '5000rec':  { amount: 5000,          currency: 'rec',    color: '#AD1457' },
  '50000rec': { amount: 50000,         currency: 'rec',    color: '#F9A825', jackpot: true },
  '01ton':    { amount: 0.1,           currency: 'ton',    color: '#42A5F5' },
  '05ton':    { amount: 0.5,           currency: 'ton',    color: '#1E88E5' },
  '1ton':     { amount: 1,             currency: 'ton',    color: '#0D47A1' },
  '10ton':    { amount: 10,            currency: 'ton',    color: '#00E5FF', jackpot: true }
};
var WHEEL_SLICE_DEG = 360 / WHEEL_VISUAL_WEDGES.length;

var _wheelRotation = 0;
var _wheelSpinning = false;
var _wheelAutoSpinning = false;
var _wheelLongPressTimer = null;
var _wheelState = { adsWatched: 0, dailyLimit: 20, bonusSpins: 0, tonBalance: 0, attemptsAvailable: 0, locked: false };

function formatWheelAmount(n) {
  if(n >= 1e12) return (n % 1e12 === 0 ? (n/1e12) : (n/1e12).toFixed(1)) + 'T';
  if(n >= 1e9)  return (n % 1e9  === 0 ? (n/1e9)  : (n/1e9).toFixed(1))  + 'B';
  if(n >= 1e6)  return (n/1e6).toFixed(1) + 'M';
  if(n >= 1e3)  return (n/1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}
function wheelWedgeLabel(key) {
  if(key === 'no_luck') return '✖';
  if(key === 'extra_spin') return '🔄<br>' + t('wheelExtraSpinLabel','1 Spin');
  var info = WHEEL_WEDGE_INFO[key];
  if(!info || info.amount <= 0) return '✖';
  if(info.currency === 'ton') {
    var line1ton = info.amount + ' TON';
    if(info.jackpot) return line1ton + '<br><span style="color:#FFEB3B;font-size:8px;">' + t('wheelJackpotLabel','Jackpot') + '</span>';
    return line1ton;
  }
  var line1 = formatWheelAmount(info.amount) + ' ' + (info.currency === 'record' ? 'RECORD' : 'REC');
  if(info.jackpot) return line1 + '<br><span style="color:#FFEB3B;font-size:8px;">' + t('wheelJackpotLabel','Jackpot') + '</span>';
  return line1;
}

function openWheel() {
  var old = document.getElementById('wheelModal');
  if(old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'wheelModal';
  modal.style.cssText = 'position:fixed;inset:0;background:linear-gradient(rgba(5,5,15,0.55),rgba(5,5,15,0.75)),url(wheel-bg.jpeg);background-size:cover;background-position:center;z-index:99999;display:flex;flex-direction:column;align-items:center;overflow-y:auto;padding:16px 0 32px;';

  modal.innerHTML =
    '<div style="width:100%;max-width:420px;padding:0 16px;box-sizing:border-box;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
        '<div style="font-family:Orbitron,sans-serif;font-weight:900;font-size:20px;color:#FFB400;text-shadow:0 0 12px rgba(255,180,0,0.6);" data-i18n="wheelPageTitle">Spin the Wheel</div>' +
        '<button onclick="document.getElementById(\'wheelModal\').remove()" style="background:rgba(255,255,255,0.08);border:none;color:#fff;width:34px;height:34px;border-radius:50%;font-size:18px;">✕</button>' +
      '</div>' +

      '<div style="position:relative;width:300px;height:300px;margin:10px auto 6px;">' +
        '<div id="wheelPointer" style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-top:22px solid #FFD700;z-index:5;filter:drop-shadow(0 0 6px rgba(255,215,0,0.8));"></div>' +
        '<div id="wheelDisc" style="width:300px;height:300px;border-radius:50%;position:relative;border:6px solid #FFD700;box-shadow:0 0 30px rgba(255,180,0,0.4);transition:transform 4s cubic-bezier(0.12,0.67,0.1,0.99);">' +
          _wheelBuildWedges() +
        '</div>' +
        '<button id="wheelSpinBtn" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:74px;height:74px;border-radius:50%;background:radial-gradient(circle,#FFD700,#FF8C00);border:3px solid #fff;color:#1a1a1a;font-family:Orbitron,sans-serif;font-weight:900;font-size:13px;z-index:4;box-shadow:0 0 18px rgba(255,180,0,0.8);cursor:pointer;" data-i18n="wheelSpinBtn">SPIN</button>' +
      '</div>' +

      '<div id="wheelAdBox" style="background:rgba(0,0,0,0.45);border:1px solid rgba(255,180,0,0.3);border-radius:14px;padding:14px;backdrop-filter:blur(4px);margin-top:14px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<span style="font-size:12px;color:rgba(255,255,255,0.7);" data-i18n="wheelAdsLabel">Today\'s Ads</span>' +
          '<span id="wheelAdsCount" style="font-size:12px;font-weight:700;color:#FFD700;">0/10</span>' +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.1);border-radius:8px;height:14px;overflow:hidden;margin-bottom:10px;">' +
          '<div id="wheelAdsBar" style="background:linear-gradient(90deg,#00FF88,#00CC66);height:100%;width:0%;transition:width 0.4s;"></div>' +
        '</div>' +
        '<button id="wheelWatchAdBtn" onclick="wheelWatchAd()" style="width:100%;background:linear-gradient(135deg,#0066FF,#0044CC);border:none;border-radius:10px;padding:12px;color:#fff;font-weight:700;font-size:14px;" data-i18n="wheelWatchAdBtn">📺 Watch Ad</button>' +
      '</div>' +

      '<div id="wheelBuySpinsBox" style="background:rgba(0,0,0,0.45);border:1px solid rgba(0,200,255,0.3);border-radius:14px;padding:14px;backdrop-filter:blur(4px);margin-top:12px;">' +
        '<button onclick="openBuySpins()" style="width:100%;background:linear-gradient(135deg,#0099CC,#00C6FF);border:none;border-radius:10px;padding:12px;color:#fff;font-weight:700;font-size:14px;" data-i18n="wheelBuySpinsBtn">💎 Buy Spins</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);
  if(typeof applyTranslations === 'function') applyTranslations();
  wheelRefreshStatus();
  _wheelSetupSpinButton();
}

function _wheelSetupSpinButton() {
  var btn = document.getElementById('wheelSpinBtn');
  if(!btn) return;

  var pressTimer = null;
  var longPressFired = false;

  function startPress(e) {
    longPressFired = false;
    pressTimer = setTimeout(function() {
      longPressFired = true;
      _wheelStartAutoSpin();
    }, 500);
  }
  function endPress(e) {
    if(pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
    if(longPressFired) return; // long-press already started auto-spin, don't also single-tap
    if(_wheelAutoSpinning) {
      _wheelStopAutoSpin();
    } else {
      spinWheel();
    }
  }
  function cancelPress() {
    if(pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
  }

  btn.addEventListener('touchstart', startPress, {passive:true});
  btn.addEventListener('touchend', endPress);
  btn.addEventListener('touchcancel', cancelPress);
  btn.addEventListener('mousedown', startPress);
  btn.addEventListener('mouseup', endPress);
  btn.addEventListener('mouseleave', cancelPress);
}

function _wheelStartAutoSpin() {
  if(_wheelAutoSpinning) return;
  _wheelAutoSpinning = true;
  var btn = document.getElementById('wheelSpinBtn');
  if(btn) btn.style.boxShadow = '0 0 28px rgba(0,255,255,0.9)';
  _wheelAutoSpinLoop();
}

function _wheelStopAutoSpin() {
  _wheelAutoSpinning = false;
  var btn = document.getElementById('wheelSpinBtn');
  if(btn) btn.style.boxShadow = '0 0 18px rgba(255,180,0,0.8)';
}

function _wheelAutoSpinLoop() {
  if(!_wheelAutoSpinning) return;
  if(_wheelState.attemptsAvailable <= 0) { _wheelStopAutoSpin(); return; }
  spinWheel(true, function() {
    if(_wheelAutoSpinning) setTimeout(_wheelAutoSpinLoop, 500); // ~2 spins/sec
  });
}

// ====== BUY SPINS (TON) ======
var SPIN_PACKAGES_CLIENT = [
  { id:1, spins:20,   ton:0.05 },
  { id:2, spins:50,   ton:0.1  },
  { id:3, spins:100,  ton:0.5  },
  { id:4, spins:200,  ton:0.75 },
  { id:5, spins:500,  ton:2    },
  { id:6, spins:1500, ton:5    }
];

function openBuySpins() {
  var old = document.getElementById('buySpinsModal');
  if(old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'buySpinsModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(5,5,15,0.95);z-index:999999;display:flex;flex-direction:column;align-items:center;overflow-y:auto;padding:16px;box-sizing:border-box;';

  var rows = '';
  SPIN_PACKAGES_CLIENT.forEach(function(p) {
    rows +=
      '<div style="background:rgba(0,200,255,0.08);border:1px solid rgba(0,200,255,0.3);border-radius:14px;padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">' +
        '<div>' +
          '<div style="font-weight:800;color:#fff;font-size:15px;">🎡 ' + p.spins + ' ' + t('wheelSpinsWord','Spins') + '</div>' +
          '<div style="color:rgba(255,255,255,0.6);font-size:12px;">' + p.ton + ' TON</div>' +
        '</div>' +
        '<button onclick="buySpinPackage(' + p.id + ')" id="buySpinBtn' + p.id + '" style="background:linear-gradient(135deg,#0099CC,#00C6FF);border:none;border-radius:10px;padding:10px 18px;color:#fff;font-weight:700;font-size:13px;">' + t('wheelBuyBtn','Buy') + '</button>' +
      '</div>';
  });

  modal.innerHTML =
    '<div style="width:100%;max-width:420px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
        '<div style="font-family:Orbitron,sans-serif;font-weight:900;font-size:18px;color:#00C6FF;" data-i18n="wheelBuySpinsBtn">💎 Buy Spins</div>' +
        '<button onclick="document.getElementById(\'buySpinsModal\').remove()" style="background:rgba(255,255,255,0.08);border:none;color:#fff;width:34px;height:34px;border-radius:50%;font-size:18px;">✕</button>' +
      '</div>' +
      rows +
    '</div>';

  document.body.appendChild(modal);
  if(typeof applyTranslations === 'function') applyTranslations();
}

function buySpinPackage(packageId) {
  var pkg = SPIN_PACKAGES_CLIENT.find(function(p){ return p.id === packageId; });
  if(!pkg) return;

  if (!tonConnect || !tonConnect.connected) {
    if(typeof showToast === 'function') showToast(t('vipErrWallet','⚠️ Connect your TON wallet first'));
    return;
  }

  var nanoAmount = Math.round(pkg.ton * 1e9).toString();
  var BOT_WALLET = 'UQD-FoGlRG5pBxZpkf3H9ZOsNTL5basBbTEZE8zvMgHLB99o'; // same wallet used for VIP/withdrawals

  var btn = document.getElementById('buySpinBtn' + packageId);
  if(btn) { btn.disabled = true; btn.textContent = t('wheelLoadingAd','⏳ Loading...'); }

  tonConnect.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{ address: BOT_WALLET, amount: nanoAmount }]
  }).then(function() {
    if(typeof showToast === 'function') showToast(t('vipVerifying','⏳ Verifying payment...'));

    function tryVerify(attempt) {
      fetch('/api/wheel/buy-spins/verify', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ telegramId: tgUser.id, packageId: packageId })
      }).then(function(r){ return r.json(); })
      .then(function(d){
        if(d.success) {
          _wheelState.bonusSpins = (_wheelState.bonusSpins || 0) + d.spinsAdded;
          _wheelState.attemptsAvailable = (_wheelState.attemptsAvailable || 0) + d.spinsAdded;
          _wheelUpdateUI();
          if(typeof showToast === 'function') showToast('🎉 +' + d.spinsAdded + ' ' + t('wheelSpinsWord','Spins') + '!');
          var m = document.getElementById('buySpinsModal'); if(m) m.remove();
        } else if (attempt < 3) {
          var delays = [0, 25000, 55000];
          if(typeof showToast === 'function') showToast('⏳ ' + (attempt+1) + '/3 ' + t('vipVerifying','Verifying...'));
          setTimeout(function(){ tryVerify(attempt+1); }, delays[attempt]);
        } else {
          if(btn) { btn.disabled = false; btn.textContent = t('wheelBuyBtn','Buy'); }
          if(typeof showToast === 'function') showToast('❌ ' + (d.error || t('vipVerifyFail','Verification failed')));
        }
      }).catch(function(){
        if (attempt < 3) setTimeout(function(){ tryVerify(attempt+1); }, 20000);
        else if(btn) { btn.disabled = false; btn.textContent = t('wheelBuyBtn','Buy'); }
      });
    }
    setTimeout(function(){ tryVerify(1); }, 8000);

  }).catch(function(e) {
    if(btn) { btn.disabled = false; btn.textContent = t('wheelBuyBtn','Buy'); }
    if(typeof showToast === 'function') showToast(t('vipCancelled','Payment cancelled'));
  });
}

function _wheelBuildWedges() {
  // Colored background: one conic-gradient segment per wedge
  var stops = [];
  var acc = 0;
  for(var j=0; j<WHEEL_VISUAL_WEDGES.length; j++) {
    var k = WHEEL_VISUAL_WEDGES[j];
    var c = WHEEL_WEDGE_INFO[k].color;
    stops.push(c + ' ' + acc + 'deg ' + (acc+WHEEL_SLICE_DEG) + 'deg');
    acc += WHEEL_SLICE_DEG;
  }
  var bg = '<div style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(' + stops.join(',') + ');"></div>';

  // Labels, each rotated to its wedge's center angle and pushed outward
  var labels = '';
  for(var i2=0; i2<WHEEL_VISUAL_WEDGES.length; i2++) {
    var key2 = WHEEL_VISUAL_WEDGES[i2];
    var centerDeg = i2 * WHEEL_SLICE_DEG + WHEEL_SLICE_DEG/2;
    labels +=
      '<div style="position:absolute;inset:0;display:flex;justify-content:center;transform:rotate('+centerDeg+'deg);pointer-events:none;">' +
        '<div style="margin-top:14px;font-size:9px;font-weight:800;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);white-space:nowrap;transform:translateY(0);">' +
          wheelWedgeLabel(key2) +
        '</div>' +
      '</div>';
  }

  return bg + labels;
}

function wheelRefreshStatus() {
  if(!tgUser) return;
  fetch('/api/wheel/status/' + tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      _wheelState = d;
      _wheelUpdateUI();
    }).catch(function(){});
}

function _wheelUpdateUI() {
  var countEl = document.getElementById('wheelAdsCount');
  var barEl = document.getElementById('wheelAdsBar');
  var btnEl = document.getElementById('wheelWatchAdBtn');
  // Show TOTAL attempts available (free bonus spins + ad-earned ones) in the
  // same 0/10 counter, instead of a separate badge for the bonus spins.
  var displayCount = Math.min(_wheelState.dailyLimit, _wheelState.attemptsAvailable);
  if(countEl) countEl.textContent = displayCount + '/' + _wheelState.dailyLimit;
  if(barEl) barEl.style.width = Math.min(100, (_wheelState.attemptsAvailable/_wheelState.dailyLimit)*100) + '%';
  if(btnEl) {
    if(_wheelState.locked) {
      btnEl.disabled = true;
      btnEl.style.opacity = '0.5';
      btnEl.textContent = t('wheelQuotaDone','✅ Quota used — come back tomorrow');
    } else {
      btnEl.disabled = false;
      btnEl.style.opacity = '1';
      btnEl.textContent = t('wheelWatchAdBtn','📺 Watch Ad');
    }
  }
}

function wheelWatchAd() {
  if(!tgUser || _wheelState.locked) return;
  var btn = document.getElementById('wheelWatchAdBtn');
  if(btn) { btn.disabled = true; btn.textContent = t('wheelLoadingAd','⏳ Loading...'); }

  if(window.TelegramAdsController && typeof window.TelegramAdsController.triggerInterstitialBanner === 'function') {
    window.TelegramAdsController.triggerInterstitialBanner().then(function() {
      _wheelRegisterAdWatch();
    }).catch(function(e) {
      console.log('triggerInterstitialBanner failed:', e);
      if(typeof showToast === 'function') showToast(t('wheelAdUnavailable','❌ Ad unavailable — try again'));
      _wheelUpdateUI();
    });
  } else if(window.TelegramAdsController && typeof window.TelegramAdsController.triggerInterstitialVideo === 'function') {
    window.TelegramAdsController.triggerInterstitialVideo().then(function() {
      _wheelRegisterAdWatch();
    }).catch(function(e) {
      console.log('triggerInterstitialVideo failed:', e);
      if(typeof showToast === 'function') showToast(t('wheelAdUnavailable','❌ Ad unavailable — try again'));
      _wheelUpdateUI();
    });
  } else {
    if(typeof showToast === 'function') showToast(t('wheelAdUnavailable','❌ Ad unavailable — try again'));
    _wheelUpdateUI();
  }
}

function _wheelRegisterAdWatch() {
  fetch('/api/wheel/watch-ad', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ telegramId: tgUser.id })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    // Always sync state when the server gives us a usable shape, regardless
    // of success/failure — otherwise the UI silently goes stale (e.g. never
    // shows the "quota used" message when the daily limit is hit).
    if(typeof d.adsWatched === 'number') _wheelState.adsWatched = d.adsWatched;
    if(typeof d.dailyLimit === 'number') _wheelState.dailyLimit = d.dailyLimit;
    if(typeof d.bonusSpins === 'number') _wheelState.bonusSpins = d.bonusSpins;
    if(typeof d.attemptsAvailable === 'number') _wheelState.attemptsAvailable = d.attemptsAvailable;
    if(typeof d.locked === 'boolean') _wheelState.locked = d.locked;

    if(!d.success) {
      if(d.reason === 'daily_limit_reached') {
        if(typeof showToast === 'function') showToast(t('wheelQuotaDone','✅ Quota used — come back tomorrow'));
      } else if(d.reason === 'too_fast') {
        if(typeof showToast === 'function') showToast(t('wheelTooFast','⏳ Please wait a moment before watching another ad'));
      } else {
        if(typeof showToast === 'function') showToast(t('wheelAdUnavailable','❌ Ad unavailable — try again'));
      }
    }
    _wheelUpdateUI();
  }).catch(function(){
    if(typeof showToast === 'function') showToast(t('wheelAdUnavailable','❌ Ad unavailable — try again'));
    _wheelUpdateUI();
  });
}

function spinWheel(isAuto, doneCallback) {
  if(!tgUser || _wheelSpinning) { if(doneCallback) doneCallback(); return; }
  if(_wheelState.attemptsAvailable <= 0) {
    if(!isAuto && typeof showToast === 'function') showToast(t('wheelNoAttempts','⚠️ Watch an ad first to get a spin!'));
    if(isAuto) _wheelStopAutoSpin();
    if(doneCallback) doneCallback();
    return;
  }
  _wheelSpinning = true;
  var spinBtn = document.getElementById('wheelSpinBtn');
  if(spinBtn && !isAuto) spinBtn.style.opacity = '0.6';

  fetch('/api/wheel/spin', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ telegramId: tgUser.id })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(!d.success) {
      _wheelSpinning = false;
      if(spinBtn) spinBtn.style.opacity = '1';
      if(!isAuto && typeof showToast === 'function') showToast(t('wheelNoAttempts','⚠️ Watch an ad first to get a spin!'));
      if(isAuto) _wheelStopAutoSpin();
      if(doneCallback) doneCallback();
      return;
    }
    _animateWheelTo(d.wedgeIndex, isAuto, function() {
      _wheelSpinning = false;
      if(spinBtn) spinBtn.style.opacity = '1';
      _wheelState.attemptsAvailable = d.attemptsAvailable;
      _wheelState.bonusSpins = d.bonusSpins;
      _wheelUpdateUI();

      if(d.outcome === 'extra_spin') {
        if(typeof showToast === 'function') showToast(t('wheelResultExtraSpin','🔄 Free spin! Spin again!'));
      } else if(d.currency === 'ton' && d.amount > 0) {
        _wheelState.tonBalance = (_wheelState.tonBalance || 0) + d.amount;
        if(typeof showToast === 'function') showToast(t('wheelResultWinTon','🎉 You won {n} TON! Check your Wallet.').replace('{n}', d.amount));
      } else if(d.amount > 0 && d.currency) {
        if(d.currency === 'rec') rec += d.amount;
        else if(d.currency === 'record') record += d.amount;
        saveData(true); updateUI();
        if(typeof showToast === 'function') showToast(t('wheelResultWin','🎉 You won {n} {c}!').replace('{n}', formatWheelAmount(d.amount)).replace('{c}', d.currency === 'record' ? 'RECORD' : 'REC'));
      } else {
        if(typeof showToast === 'function') showToast(t('wheelResultNoLuck','😢 No luck this time — try again!'));
      }
      if(doneCallback) doneCallback();
    });
  }).catch(function(){
    _wheelSpinning = false;
    if(spinBtn) spinBtn.style.opacity = '1';
    if(isAuto) _wheelStopAutoSpin();
    if(doneCallback) doneCallback();
  });
}

function _animateWheelTo(wedgeIndex, isFast, callback) {
  var disc = document.getElementById('wheelDisc');
  if(!disc) { if(callback) callback(); return; }
  var centerDeg = wedgeIndex * WHEEL_SLICE_DEG + WHEEL_SLICE_DEG/2;
  var jitter = (Math.random() * (WHEEL_SLICE_DEG*0.6)) - (WHEEL_SLICE_DEG*0.3);
  var extraSpins = (isFast ? 1 : 5) * 360;
  var currentMod = _wheelRotation % 360;
  var delta = (360 - ((centerDeg + currentMod) % 360)) + extraSpins + jitter;
  _wheelRotation += delta;
  disc.style.transition = isFast ? 'transform 0.45s linear' : 'transform 4s cubic-bezier(0.12,0.67,0.1,0.99)';
  disc.style.transform = 'rotate(' + _wheelRotation + 'deg)';
  setTimeout(function(){ if(callback) callback(); }, isFast ? 460 : 4100);
}
