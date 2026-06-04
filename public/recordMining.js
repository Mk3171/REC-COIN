// ============================================================
// RECORD MINING SYSTEM
// ============================================================

// ============================================================
// RECORD OFFLINE — يطلب من السيرفر أرباح RECORD
// ============================================================
function checkRecordOffline(callback) {
  if(!window.tgUser) { callback && callback(0, 0); return; }

  fetch('/api/mining/offline/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: tgUser.id })
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    if(data.earnedRecord > 0) {
      if(typeof record !== 'undefined') record += data.earnedRecord;
      if(typeof updateUI === 'function') updateUI();
      if(typeof saveData === 'function') saveData(true);
    }
    callback && callback(data.earnedRecord || 0, data.seconds || 0);
  })
  .catch(function(){ callback && callback(0, 0); });
}
