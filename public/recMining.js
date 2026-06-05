// ============================================================
// REC & RECORD MINING — نظام موحد نظيف
// popup وحدة فقط — السيرفر هو المرجع
// ============================================================

var _miningStarted = false;

// ============================================================
// حفظ عند الإغلاق
// ============================================================
function _saveMiningClose() {
  try {
    localStorage.setItem('miningClose', JSON.stringify({
      time: Date.now(),
      recPerSec:    typeof recPerSec    !== 'undefined' ? recPerSec    : 0,
      recordPerSec: typeof recordPerSec !== 'undefined' ? recordPerSec : 0
    }));
  } catch(e){}
}
document.addEventListener('visibilitychange', function() {
  if(document.visibilityState === 'hidden') _saveMiningClose();
});
window.addEventListener('pagehide', _saveMiningClose);

// ============================================================
// HEARTBEAT — كل 30 ثانية
// ============================================================
function startMiningHeartbeat() {
  _saveMiningClose(); // حفظ فوري

  // ✅ كل 10 ثواني يحفظ الوقت محلياً — ضمان لو pagehide ما اشتغل
  setInterval(function() {
    _saveMiningClose();
  }, 10000);

  // كل 30 ثانية يرسل للسيرفر
  setInterval(function() {
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
  }, 30000);
}

// ============================================================
// OFFLINE CHECK — مرة وحدة عند الفتح
// ============================================================
var _offlineShown = false;

function checkOfflineMining() {
  if(_offlineShown) return;

  // 1. حساب محلي فوري من localStorage
  var localRec = 0, localRecord = 0, localSeconds = 0;
  try {
    var closeData = JSON.parse(localStorage.getItem('miningClose'));
    if(closeData && closeData.time) {
      var elapsed = (Date.now() - closeData.time) / 1000;
      // حد أقصى 7 أيام
      var seconds = Math.min(elapsed, 7 * 86400);
      if(seconds > 30) {
        localRec    = (closeData.recPerSec    || 0) * seconds;
        localRecord = Math.floor((closeData.recordPerSec || 0) * seconds);
        localSeconds = Math.floor(seconds);
      }
    }
    localStorage.removeItem('miningClose');
  } catch(e){}

  // لو في أرباح محلية — أظهر فوراً
  if(localRec > 0.000001 || localRecord > 0) {
    if(typeof rec    !== 'undefined') rec    += localRec;
    if(typeof record !== 'undefined') record += localRecord;
    if(typeof updateUI  === 'function') updateUI();
    if(typeof saveData  === 'function') saveData(true);
    _showOfflinePopup(localRec, localRecord, localSeconds);
    _offlineShown = true;
  }

  // 2. تأكيد من السيرفر (بدون popup إضافية)
  if(!window.tgUser) return;
  setTimeout(function() {
    _syncFromServer();
  }, 5000);
}

function _syncFromServer() {
  if(!window.tgUser) return;

  // REC
  fetch('/api/mining/offline/rec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: tgUser.id })
  })
  .then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.earnedRec > 0.000001) {
      if(typeof rec !== 'undefined') rec += d.earnedRec;
      if(typeof updateUI === 'function') updateUI();
      if(typeof saveData === 'function') saveData(true);
      // لو ما كان في حساب محلي — أظهر popup
      if(!_offlineShown) {
        _showOfflinePopup(d.earnedRec, 0, d.seconds || 0);
        _offlineShown = true;
      }
    }
  }).catch(function(){});

  // RECORD
  fetch('/api/mining/offline/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: tgUser.id })
  })
  .then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.earnedRecord > 0) {
      if(typeof record !== 'undefined') record += d.earnedRecord;
      if(typeof updateUI === 'function') updateUI();
      if(typeof saveData === 'function') saveData(true);
    }
  }).catch(function(){});
}

// ============================================================
// POPUP — مرة وحدة فقط
// ============================================================
function _showOfflinePopup(earnedRec, earnedRecord, seconds) {
  var old = document.getElementById('offlinePopup');
  if(old) old.remove();

  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var d = Math.floor(h / 24);
  var timeStr = d > 0 ? d + 'd ' + (h%24) + 'h' : h > 0 ? h + 'h ' + m + 'm' : m + 'm';

  var overlay = document.createElement('div');
  overlay.id = 'offlinePopup';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });

  var box = document.createElement('div');
  box.style.cssText = 'background:linear-gradient(180deg,#0d0d14,#111118);border:1px solid rgba(255,140,0,0.4);border-radius:20px;padding:24px 20px;width:84vw;max-width:320px;text-align:center;';
  box.addEventListener('click', function(e){ e.stopPropagation(); });

  var recRow = earnedRec > 0.000001
    ? '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:12px;padding:12px;margin-bottom:8px;">' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">🟢 REC</div>' +
      '<div style="font-size:26px;font-family:Orbitron,sans-serif;font-weight:900;color:#00FF88;">+' + earnedRec.toFixed(6) + '</div>' +
      '</div>' : '';

  var recordRow = earnedRecord > 0
    ? '<div style="background:rgba(255,68,0,0.06);border:1px solid rgba(255,68,0,0.2);border-radius:12px;padding:12px;margin-bottom:14px;">' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">⚡ RECORD</div>' +
      '<div style="font-size:26px;font-family:Orbitron,sans-serif;font-weight:900;color:#FF6644;">+' + Math.floor(earnedRecord).toLocaleString() + '</div>' +
      '</div>' : '<div style="margin-bottom:14px;"></div>';

  box.innerHTML =
    '<div style="font-size:44px;margin-bottom:8px;">⛏️</div>' +
    '<div style="font-family:Orbitron,sans-serif;font-size:14px;color:#FF8800;margin-bottom:4px;">Offline Earnings</div>' +
    '<div style="font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:16px;">You were away for <span style="color:rgba(255,255,255,0.6);">' + timeStr + '</span></div>' +
    recRow + recordRow +
    '<div style="font-size:11px;color:#00FF88;margin-bottom:12px;">✅ Added to your balance automatically</div>' +
    '<button onclick="document.getElementById(\'offlinePopup\').remove()" style="width:100%;background:#1a1a1a;border:1px solid #333;color:#888;padding:11px;border-radius:12px;cursor:pointer;font-size:13px;">Close ✕</button>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if(_miningStarted) return;
    _miningStarted = true;
    checkOfflineMining();
    startMiningHeartbeat();
  }, 2000);
});
