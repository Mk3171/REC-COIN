// ====== SPIN THE WHEEL ======
// Ads for this feature come EXCLUSIVELY from RichAds (kept separate from the
// Monetag-based "ADS" section). The server is the sole authority on the daily
// ad-watch count and the spin outcome — this file only renders state it gets
// back from /api/wheel/*.

// Must match WHEEL_VISUAL_WEDGES on the server EXACTLY (order + length).
var WHEEL_VISUAL_WEDGES = [
  'extra_spin','3mrd','20rec','no_luck','50rec','10mrd',
  'no_luck','200rec','500rec','no_luck','5000rec','no_luck',
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
  '50000rec': { amount: 50000,         currency: 'rec',    color: '#F9A825', jackpot: true }
};
var WHEEL_SLICE_DEG = 360 / WHEEL_VISUAL_WEDGES.length;

var _wheelRotation = 0;
var _wheelSpinning = false;
var _wheelState = { adsWatched: 0, dailyLimit: 10, bonusSpins: 0, attemptsAvailable: 0, locked: false };

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
  var line1 = formatWheelAmount(info.amount) + ' ' + (info.currency === 'record' ? 'RECORD' : 'REC');
  if(info.jackpot) return line1 + '<br><span style="color:#FFEB3B;font-size:8px;">' + t('wheelJackpotLabel','Jackpot') + '</span>';
  return line1;
}

function openWheel() {
  var old = document.getElementById('wheelModal');
  if(old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'wheelModal';
  modal.style.cssText = 'position:fixed;inset:0;background:linear-gradient(rgba(5,5,15,0.55),rgba(5,5,15,0.75)),url(wheel-bg.jpg);background-size:cover;background-position:center;z-index:99999;display:flex;flex-direction:column;align-items:center;overflow-y:auto;padding:16px 0 32px;';

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
        '<button id="wheelSpinBtn" onclick="spinWheel()" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:74px;height:74px;border-radius:50%;background:radial-gradient(circle,#FFD700,#FF8C00);border:3px solid #fff;color:#1a1a1a;font-family:Orbitron,sans-serif;font-weight:900;font-size:13px;z-index:4;box-shadow:0 0 18px rgba(255,180,0,0.8);cursor:pointer;" data-i18n="wheelSpinBtn">SPIN</button>' +
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
    '</div>';

  document.body.appendChild(modal);
  if(typeof applyTranslations === 'function') applyTranslations();
  wheelRefreshStatus();
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

  if(window.TelegramAdsController && typeof window.TelegramAdsController.triggerInterstitialVideo === 'function') {
    window.TelegramAdsController.triggerInterstitialVideo().then(function() {
      fetch('/api/wheel/watch-ad', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ telegramId: tgUser.id })
      }).then(function(r){ return r.json(); })
      .then(function(d){
        if(d.success) {
          _wheelState.adsWatched = d.adsWatched;
          _wheelState.locked = d.locked;
          _wheelState.bonusSpins = d.bonusSpins;
          _wheelState.attemptsAvailable = d.attemptsAvailable;
        }
        _wheelUpdateUI();
      }).catch(function(){ _wheelUpdateUI(); });
    }).catch(function(e) {
      console.log('Wheel ad error:', e);
      if(typeof showToast === 'function') showToast(t('wheelAdUnavailable','❌ Ad unavailable — try again'));
      _wheelUpdateUI();
    });
  } else {
    if(typeof showToast === 'function') showToast(t('wheelAdUnavailable','❌ Ad unavailable — try again'));
    _wheelUpdateUI();
  }
}

function spinWheel() {
  if(!tgUser || _wheelSpinning) return;
  if(_wheelState.attemptsAvailable <= 0) {
    if(typeof showToast === 'function') showToast(t('wheelNoAttempts','⚠️ Watch an ad first to get a spin!'));
    return;
  }
  _wheelSpinning = true;
  var spinBtn = document.getElementById('wheelSpinBtn');
  if(spinBtn) spinBtn.style.opacity = '0.6';

  fetch('/api/wheel/spin', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ telegramId: tgUser.id })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(!d.success) {
      _wheelSpinning = false;
      if(spinBtn) spinBtn.style.opacity = '1';
      if(typeof showToast === 'function') showToast(t('wheelNoAttempts','⚠️ Watch an ad first to get a spin!'));
      return;
    }
    _animateWheelTo(d.wedgeIndex, function() {
      _wheelSpinning = false;
      if(spinBtn) spinBtn.style.opacity = '1';
      _wheelState.attemptsAvailable = d.attemptsAvailable;
      _wheelState.bonusSpins = d.bonusSpins;
      _wheelUpdateUI();

      if(d.outcome === 'extra_spin') {
        if(typeof showToast === 'function') showToast(t('wheelResultExtraSpin','🔄 Free spin! Spin again!'));
      } else if(d.amount > 0 && d.currency) {
        if(d.currency === 'rec') rec += d.amount;
        else if(d.currency === 'record') record += d.amount;
        saveData(true); updateUI();
        if(typeof showToast === 'function') showToast(t('wheelResultWin','🎉 You won {n} {c}!').replace('{n}', formatWheelAmount(d.amount)).replace('{c}', d.currency === 'record' ? 'RECORD' : 'REC'));
      } else {
        if(typeof showToast === 'function') showToast(t('wheelResultNoLuck','😢 No luck this time — try again!'));
      }
    });
  }).catch(function(){
    _wheelSpinning = false;
    if(spinBtn) spinBtn.style.opacity = '1';
  });
}

function _animateWheelTo(wedgeIndex, callback) {
  var disc = document.getElementById('wheelDisc');
  if(!disc) { if(callback) callback(); return; }
  var centerDeg = wedgeIndex * WHEEL_SLICE_DEG + WHEEL_SLICE_DEG/2;
  var jitter = (Math.random() * (WHEEL_SLICE_DEG*0.6)) - (WHEEL_SLICE_DEG*0.3);
  var extraSpins = 5 * 360;
  var currentMod = _wheelRotation % 360;
  var delta = (360 - ((centerDeg + currentMod) % 360)) + extraSpins + jitter;
  _wheelRotation += delta;
  disc.style.transform = 'rotate(' + _wheelRotation + 'deg)';
  setTimeout(function(){ if(callback) callback(); }, 4100);
}
