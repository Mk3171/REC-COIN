// ====== OFFLINE EARNINGS + INIT — init.js ======
function calcOfflineEarnings() {
  try {
    // Get last save time - try multiple sources
    var lastTime = 0;
    try {
      // 1. Try correct saveKey
      var ls = JSON.parse(localStorage.getItem(saveKey));
      if(ls && ls.lastSaveTime) lastTime = ls.lastSaveTime;
    } catch(e){}
    // 2. Try old keys as fallback
    if(!lastTime) {
      try {
        ['recmining_undefined','recmining_guest','recmining_null'].forEach(function(k){
          if(lastTime) return;
          var old = JSON.parse(localStorage.getItem(k)||'{}');
          if(old && old.lastSaveTime) lastTime = old.lastSaveTime;
        });
      } catch(e){}
    }

    if(!lastTime || lastTime <= 0) return;

    var now = Date.now();
    var elapsed = (now - lastTime) / 1000; // seconds

    // Only apply if offline for more than 30 seconds
    if(elapsed < 30) return;

    // Cap at 24 hours
    var maxSeconds = 24 * 3600;
    var seconds = Math.min(elapsed, maxSeconds);

    // Calculate earnings based on current card speeds
    calcTotalSpeeds();
    var earnedRecord = Math.floor(recordPerSec * seconds);
    // Apply VIP boost if active today
    var _offRec = recPerSec;
    if(vipData && parseInt(vipData.tier||0)>=1 && parseInt(vipData.expiry||0)>Date.now() && vipData.boostDate===getTodayStr()){
      _offRec *= 1.5;
    }
    var earnedRec = _offRec * seconds;

    // Energy recharge offline: 12h full recharge
    var regenPerSec = maxEnergy / 43200;
    var energyGained = Math.floor(regenPerSec * seconds);
    var newEnergy = Math.min(maxEnergy, energy + energyGained);
    energy = newEnergy;

    if(earnedRecord <= 0 && earnedRec < 0.000001) return;

    // Apply earnings
    record += earnedRecord;
    if(earnedRec > 0) {
      if(typeof pendingRec !== 'undefined') pendingRec += earnedRec;
      else rec += earnedRec;
    }

    // Show offline earnings popup
    setTimeout(function(){
      var h = Math.floor(elapsed/3600);
      var m = Math.floor((elapsed%3600)/60);
      var timeStr = (h > 0 ? h+'h ' : '') + m+'m';
      if(typeof showToast === 'function') showToast('⚡ +'+earnedRec.toFixed(4)+' REC');
    }, 2000);

    saveData(true);

    // Show notification popup
    var hours = Math.floor(seconds / 3600);
    var mins = Math.floor((seconds % 3600) / 60);
    var timeStr = hours > 0 ? hours+'h '+ mins+'m' : mins+'m';

    var ol = document.createElement('div');
    ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
    ol.addEventListener('click', function(e){ if(e.target===ol) ol.remove(); });

    var pp = document.createElement('div');
    pp.style.cssText = 'background:linear-gradient(180deg,#0d0d14,#111118);border:1px solid rgba(255,140,0,0.4);border-radius:20px;padding:22px;width:82vw;max-width:300px;text-align:center;';
    pp.addEventListener('click', function(e){ e.stopPropagation(); });

    pp.innerHTML =
      '<div style="font-size:36px;margin-bottom:8px;">⛏️</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:14px;color:#FF8800;margin-bottom:4px;">Offline Earnings</div>'+
      '<div style="color:#666;font-size:12px;margin-bottom:14px;">You were away for <span style="color:#aaa;">'+timeStr+'</span></div>'+
      (earnedRecord > 0 ?
        '<div style="background:rgba(255,0,0,0.08);border:1px solid rgba(255,0,0,0.2);border-radius:10px;padding:10px;margin-bottom:8px;">'+
          '<div style="font-size:11px;color:#aaa;margin-bottom:3px;">⚡ RECORD Earned</div>'+
          '<div style="font-size:18px;color:#FF6644;font-family:Orbitron,sans-serif;font-weight:bold;">+'+formatCost(earnedRecord)+'</div>'+
        '</div>' : '')+
      (earnedRec > 0.000001 ?
        '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:10px;padding:10px;margin-bottom:14px;">'+
          '<div style="font-size:11px;color:#aaa;margin-bottom:3px;">🟢 REC Earned</div>'+
          '<div style="font-size:18px;color:#00FF88;font-family:Orbitron,sans-serif;font-weight:bold;">+'+earnedRec.toFixed(6)+'</div>'+
        '</div>' : '<div style="margin-bottom:14px;"></div>')+
      '<button onclick="this.closest(\'div\').parentElement.remove()" style="background:linear-gradient(135deg,#FF6600,#FF8800);border:none;color:white;padding:10px 28px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;width:100%;">Collect 🎉</button>';

    ol.appendChild(pp);
    document.body.appendChild(ol);
  } catch(e) {
    console.log('Offline earnings error:', e);
  }
}

function initApp() {
  try {
    if(tgUser){
      var name=tgUser.first_name+(tgUser.last_name?' '+tgUser.last_name:'');
      var el=document.getElementById('profileName');if(el)el.textContent=name;
      var idEl=document.getElementById('profileId');if(idEl)idEl.textContent=tgUser.id;
    }
    fixViewport();
    calcTotalSpeeds();
    checkUpgradeTimers();
    applyLang(currentLang);
  loadVIPData();
    buildCards();
    buildMilestones();
    restoreTasksUI();
    // Calculate offline earnings before updating UI
    calcOfflineEarnings();
    updateUI();
    setTimeout(initTonConnect, 800);
    setTimeout(function(){ initNewFeatures(); checkCardMissions(); }, 300);
    setTimeout(function(){ if(typeof calcRetroactiveXP==='function') calcRetroactiveXP(); }, 1000);
    // Server-side offline earnings (with retry)
    if(tgUser) {
      function fetchOfflineEarnings(attempt) {
        fetch('/api/user/offline-earnings', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body:JSON.stringify({telegramId:tgUser.id})
        }).then(function(r){return r.json();}).then(function(d){
          if(d.earned > 0.000001) {
            if(typeof pendingRec!=='undefined') pendingRec += d.earned;
            if(d.earnedRecord > 0) record += d.earnedRecord;
            updateUI();
            if(typeof showToast==='function'){
              var h=Math.floor((d.seconds||0)/3600), m=Math.floor(((d.seconds||0)%3600)/60);
              showToast('⚡ +'+(d.earned).toFixed(4)+' REC ('+(h>0?h+'h ':'')+m+'m offline)');
            }
            if(typeof saveData==='function') saveData(true);
          }
        }).catch(function(){
          // Retry up to 3 times
          if(attempt < 3) setTimeout(function(){ fetchOfflineEarnings(attempt+1); }, 3000);
        });
      }
      setTimeout(function(){ fetchOfflineEarnings(1); }, 2000);
    }
    // حمّل بيانات الكومبو عند البداية
    if(tgUser) setTimeout(function(){
      fetch('/api/combo/today/' + tgUser.id)
        .then(function(r){ return r.json(); })
        .then(function(d){ comboData = d; })
        .catch(function(){});
    }, 500);
  } catch(e) {
    console.log('Init error:', e);
    try { buildCards(); updateUI(); } catch(e2) {}
  }
}

// Load data: Server > CloudStorage > localStorage
