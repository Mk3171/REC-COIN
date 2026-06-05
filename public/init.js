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
    var maxSeconds = 7 * 24 * 3600; // حد أقصى 7 أيام
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
    if(earnedRec > 0) rec += earnedRec;

    saveData(true);




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
    // Offline earnings: local handled above, server handled by recMining.js
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
