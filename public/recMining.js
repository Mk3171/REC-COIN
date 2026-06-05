// ============================================================
// REC MINING — Cloud Mining Mode
// السيرفر يعدن 24/7 — البوت يحدّث الرصيد عند الفتح
// ============================================================

var _miningStarted = false;

// ============================================================
// HEARTBEAT — يحفظ السرعة كل 30 ثانية
// ============================================================
function startMiningHeartbeat() {
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
// SYNC — عند الفتح يجيب الرصيد الحقيقي من السيرفر
// ============================================================
function syncBalanceFromServer() {
  if(!window.tgUser) return;

  fetch('/api/user/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: tgUser.id })
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    if(!data || !data.rec) return;

    var serverRec    = parseFloat(data.rec)    || 0;
    var serverRecord = parseFloat(data.record) || 0;
    var localRec     = typeof rec    !== 'undefined' ? rec    : 0;
    var localRecord  = typeof record !== 'undefined' ? record : 0;

    // خذ القيمة الأعلى دائماً
    var newRec    = Math.max(serverRec,    localRec);
    var newRecord = Math.max(serverRecord, localRecord);

    var recDiff    = newRec    - localRec;
    var recordDiff = newRecord - localRecord;

    if(typeof rec    !== 'undefined') rec    = newRec;
    if(typeof record !== 'undefined') record = newRecord;

    if(typeof updateUI === 'function') updateUI();
    if(typeof saveData === 'function') saveData(true);

    // أظهر popup لو في فرق واضح (يعني عدّن وهو مسكر)
    if(recDiff > 0.000001 || recordDiff > 0) {
      _showMiningPopup(recDiff, recordDiff);
    }
  })
  .catch(function(){});
}

// ============================================================
// POPUP — يظهر الأرباح من التعدين السحابي
// ============================================================
function _showMiningPopup(earnedRec, earnedRecord) {
  var old = document.getElementById('cloudMiningPopup');
  if(old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'cloudMiningPopup';
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
    '<div style="font-family:Orbitron,sans-serif;font-size:14px;color:#FF8800;margin-bottom:4px;">Cloud Mining</div>' +
    '<div style="font-size:12px;color:rgba(255,255,255,0.3);margin-bottom:16px;">تم التعدين أثناء غيابك ☁️</div>' +
    recRow + recordRow +
    '<div style="font-size:11px;color:#00FF88;margin-bottom:12px;">✅ أضيف لرصيدك تلقائياً</div>' +
    '<button onclick="document.getElementById(\'cloudMiningPopup\').remove()" style="width:100%;background:#1a1a1a;border:1px solid #333;color:#888;padding:11px;border-radius:12px;cursor:pointer;font-size:13px;">Close ✕</button>';

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
    // جيب الرصيد المحدّث من السيرفر
    syncBalanceFromServer();
    // ابدأ الهارتبيت
    startMiningHeartbeat();
  }, 2000);
});
