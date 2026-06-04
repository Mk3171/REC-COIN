// ============================================================
// REC MINING SYSTEM
// ============================================================

// ====== حفظ وقت الإغلاق فوراً ======
function saveMiningCloseTime() {
  try {
    var closeData = {
      time: Date.now(),
      recPerSec:    typeof recPerSec    !== 'undefined' ? recPerSec    : 0,
      recordPerSec: typeof recordPerSec !== 'undefined' ? recordPerSec : 0
    };
    localStorage.setItem('miningCloseData', JSON.stringify(closeData));
  } catch(e){}
}

document.addEventListener('visibilitychange', function() {
  if(document.visibilityState === 'hidden') saveMiningCloseTime();
});
window.addEventListener('pagehide', saveMiningCloseTime);

// ====== حساب فوري من localStorage عند الفتح ======
function instantOfflineCalc() {
  try {
    var data = JSON.parse(localStorage.getItem('miningCloseData'));
    if(!data || !data.time) return;

    var elapsed = Math.min((Date.now() - data.time) / 1000, 86400);
    if(elapsed < 30) return;

    var earnedRec    = (data.recPerSec    || 0) * elapsed;
    var earnedRecord = Math.floor((data.recordPerSec || 0) * elapsed);

    if(earnedRec < 0.000001 && earnedRecord < 1) return;

    // أضف فوراً
    if(typeof rec    !== 'undefined' && earnedRec    > 0) rec    += earnedRec;
    if(typeof record !== 'undefined' && earnedRecord > 0) record += earnedRecord;
    if(typeof updateUI  === 'function') updateUI();
    if(typeof saveData  === 'function') saveData(true);

    // أظهر الشاشة فوراً
    _offlineResults.rec        = earnedRec;
    _offlineResults.record     = earnedRecord;
    _offlineResults.seconds    = Math.floor(elapsed);
    _offlineResults.recDone    = true;
    _offlineResults.recordDone = true;
    _tryShowOfflinePopup();

    // امسح البيانات عشان ما تتحسب مرتين
    localStorage.removeItem('miningCloseData');
  } catch(e){}
}


var _recHeartbeatStarted = false;

// ============================================================
// HEARTBEAT — كل 30 ثانية (مشترك بين REC و RECORD)
// ============================================================
function startMiningHeartbeat() {
  if(_recHeartbeatStarted) return;
  _recHeartbeatStarted = true;
  _sendHeartbeat();
  setInterval(_sendHeartbeat, 30000);
}

function _sendHeartbeat() {
  if(!window.tgUser) return;
  fetch('/api/mining/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telegramId:   tgUser.id,
      recPerSec:    typeof recPerSec    !== 'undefined' ? recPerSec    : 0,
      recordPerSec: typeof recordPerSec !== 'undefined' ? recordPerSec : 0
    })
  }).catch(function(){});
}

// ============================================================
// REC OFFLINE — يطلب من السيرفر أرباح REC
// ============================================================
var _recOfflineResult = { earned: 0, seconds: 0 };

function checkRecOffline(callback) {
  if(!window.tgUser) { callback && callback(0, 0); return; }

  fetch('/api/mining/offline/rec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: tgUser.id })
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    _recOfflineResult.earned  = data.earnedRec  || 0;
    _recOfflineResult.seconds = data.seconds    || 0;

    if(data.earnedRec > 0.000001) {
      if(typeof rec !== 'undefined') rec += data.earnedRec;
      if(typeof updateUI  === 'function') updateUI();
      if(typeof saveData  === 'function') saveData(true);
    }
    callback && callback(data.earnedRec || 0, data.seconds || 0);
  })
  .catch(function(){ callback && callback(0, 0); });
}

// ============================================================
// POPUP — يظهر بعد ما يكتمل كلا الطلبين
// ============================================================
var _offlineResults = { rec: 0, record: 0, seconds: 0, recDone: false, recordDone: false };

function _tryShowOfflinePopup() {
  if(!_offlineResults.recDone || !_offlineResults.recordDone) return;
  if(_offlineResults.rec < 0.000001 && _offlineResults.record < 1) return;

  var seconds = _offlineResults.seconds;
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var timeStr = h > 0 ? h + 'h ' + m + 'm' : m + 'm';

  var old = document.getElementById('offlineMiningPopup');
  if(old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'offlineMiningPopup';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

  var box = document.createElement('div');
  box.style.cssText = 'background:linear-gradient(180deg,#0d0d14,#111118);border:1px solid rgba(255,140,0,0.4);border-radius:20px;padding:24px 20px;width:84vw;max-width:320px;text-align:center;';
  box.addEventListener('click', function(e){ e.stopPropagation(); });

  var recRow = _offlineResults.rec > 0.000001
    ? '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:12px;padding:12px;margin-bottom:8px;">' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">🟢 REC</div>' +
        '<div style="font-size:26px;font-family:Orbitron,sans-serif;font-weight:900;color:#00FF88;">+' + _offlineResults.rec.toFixed(6) + '</div>' +
      '</div>' : '';

  var recordRow = _offlineResults.record > 0
    ? '<div style="background:rgba(255,68,0,0.06);border:1px solid rgba(255,68,0,0.2);border-radius:12px;padding:12px;margin-bottom:14px;">' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">⚡ RECORD</div>' +
        '<div style="font-size:26px;font-family:Orbitron,sans-serif;font-weight:900;color:#FF6644;">+' + Math.floor(_offlineResults.record).toLocaleString() + '</div>' +
      '</div>' : '<div style="margin-bottom:14px;"></div>';

  box.innerHTML =
    '<div style="font-size:44px;margin-bottom:8px;">⛏️</div>' +
    '<div style="font-family:Orbitron,sans-serif;font-size:14px;color:#FF8800;margin-bottom:4px;">' +
      (typeof t==='function' ? t('offlineTitle','Offline Earnings') : 'Offline Earnings') +
    '</div>' +
    '<div style="font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:16px;">' +
      (typeof t==='function' ? t('offlineAway','You were away for') : 'You were away for') +
      ' <span style="color:rgba(255,255,255,0.6);">' + timeStr + '</span>' +
    '</div>' +
    recRow + recordRow +
    '<div style="font-size:11px;color:#00FF88;margin-bottom:12px;">✅ ' +
      (typeof t==='function' ? t('offlineAdded','Added to your balance automatically') : 'Added to your balance automatically') +
    '</div>' +
    '<button onclick="document.getElementById(\'offlineMiningPopup\').remove()" style="width:100%;background:#1a1a1a;border:1px solid #333;color:#888;padding:11px;border-radius:12px;cursor:pointer;font-size:13px;">' +
      (typeof t==='function' ? t('blockClose','Close ✕') : 'Close ✕') +
    '</button>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// ============================================================
// INIT
// ============================================================
function initRecMining() {
  setTimeout(function() {
    if(!window.tgUser) return;

    // REC offline
    checkRecOffline(function(earned, seconds) {
      _offlineResults.rec     = earned;
      _offlineResults.seconds = Math.max(_offlineResults.seconds, seconds);
      _offlineResults.recDone = true;
      _tryShowOfflinePopup();
    });

    // RECORD offline (من ملف recordMining.js)
    if(typeof checkRecordOffline === 'function') {
      checkRecordOffline(function(earned, seconds) {
        _offlineResults.record     = earned;
        _offlineResults.seconds    = Math.max(_offlineResults.seconds, seconds);
        _offlineResults.recordDone = true;
        _tryShowOfflinePopup();
      });
    } else {
      _offlineResults.recordDone = true;
      _tryShowOfflinePopup();
    }

    startMiningHeartbeat();
  }, 4000);
}

document.addEventListener('DOMContentLoaded', function() {
  // ✅ حساب فوري من localStorage (ثانية 0)
  setTimeout(function() { instantOfflineCalc(); }, 500);
  // ✅ تحقق من السيرفر بعد 4 ثواني (للتأكد والدقة)
  setTimeout(function() {
    if(window.tgUser) initRecMining();
  }, 4000);
});
