// ====== LEVELS SYSTEM — levels.js ======

var playerXP = 0;
var claimedLevels = {};
var xpRetroCalculated = false;

// ====== XP FORMULAS ======
function xpNeededForLevel(lvl) {
  if(lvl <= 0) return 0;
  return Math.floor(200 * lvl * Math.sqrt(lvl));
}

function calcPlayerLevel(xp) {
  var lvl = 0, cum = 0;
  while(lvl < 99) {
    var need = xpNeededForLevel(lvl + 1);
    if(cum + need > xp) break;
    cum += need; lvl++;
  }
  return lvl;
}

function xpInCurrentLevel(xp) {
  var lvl = calcPlayerLevel(xp), cum = 0;
  for(var i = 1; i <= lvl; i++) cum += xpNeededForLevel(i);
  return xp - cum;
}

function xpForNextLevel(xp) {
  var lvl = calcPlayerLevel(xp);
  return lvl >= 99 ? 0 : xpNeededForLevel(lvl + 1);
}

// ====== XP PER ACTION ======
function xpForCardUpgrade(fromLevel) {
  if(fromLevel < 10) return 50;
  if(fromLevel < 25) return 100;
  if(fromLevel < 50) return 200;
  if(fromLevel < 75) return 400;
  return 800;
}

// ====== LEVEL REWARDS ======
var LEVEL_REWARDS = {
  5:  { record:500000000,      rec:1   },
  10: { record:1000000000,     rec:5   },
  15: { record:2000000000,     rec:8   },
  20: { record:5000000000,     rec:10,  vipDays:3  },
  25: { record:8000000000,     rec:15  },
  30: { record:10000000000,    rec:20  },
  35: { record:20000000000,    rec:25  },
  40: { record:30000000000,    rec:30,  recordBoost2h:true },
  45: { record:50000000000,    rec:40  },
  50: { record:80000000000,    rec:50,  vipDays:10 },
  55: { record:100000000000,   rec:70  },
  60: { record:150000000000,   rec:100 },
  65: { record:200000000000,   rec:150 },
  70: { record:300000000000,   rec:200, recBoost24h:true },
  75: { record:500000000000,   rec:300, vipDays:15 },
  80: { record:700000000000,   rec:400 },
  85: { record:1000000000000,  rec:500 },
  90: { record:1000000000000,  rec:700 },
  95: { record:1000000000000,  rec:900 },
  99: { record:1000000000000,  rec:1000 }
};

// ====== ADD XP ======
function addXP(amount) {
  if(!amount || amount <= 0) return;
  var oldLvl = calcPlayerLevel(playerXP);
  playerXP += Math.floor(amount);
  var newLvl = calcPlayerLevel(playerXP);
  updateLevelDisplay();
  if(newLvl > oldLvl) {
    for(var lvl = oldLvl + 1; lvl <= newLvl; lvl++) {
      setTimeout((function(l){ return function(){ applyLevelReward(l); }; })(lvl), 500);
    }
  }
}

// ====== APPLY LEVEL REWARD ======
function applyLevelReward(lvl) {
  if(claimedLevels[lvl]) return;
  claimedLevels[lvl] = true;
  var reward = LEVEL_REWARDS[lvl];
  if(reward) {
    if(reward.record) record += reward.record;
    if(reward.rec) rec += reward.rec;
    if(reward.vipDays) {
      var now = Date.now();
      if(!vipData) vipData = { tier:0, expiry:0, boxes:{} };
      if(parseInt(vipData.tier||0) < 1 || parseInt(vipData.expiry||0) <= now) {
        vipData.tier = 1;
        vipData.expiry = now + reward.vipDays * 86400000;
        vipData.boxes = {};
      } else {
        vipData.expiry = parseInt(vipData.expiry) + reward.vipDays * 86400000;
      }
    }
  }
  saveData(true);
  updateUI();
  showLevelUpPopup(lvl, reward);
}

// ====== LEVEL UP POPUP ======
function showLevelUpPopup(lvl, reward) {
  var old = document.getElementById('lvlUpOverlay');
  if(old) old.remove();

  var rewardHtml = '';
  if(reward) {
    if(reward.record) rewardHtml +=
      '<div style="background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.25);border-radius:10px;padding:9px;margin-bottom:7px;">🔴 +'+formatCost(reward.record)+' RECORD</div>';
    if(reward.rec) rewardHtml +=
      '<div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);border-radius:10px;padding:9px;margin-bottom:7px;">⚡ +'+reward.rec+' REC</div>';
    if(reward.vipDays) rewardHtml +=
      '<div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:10px;padding:9px;margin-bottom:7px;">👑 VIP I — '+reward.vipDays+' '+(currentLang==='ar'?'أيام':'days')+'!</div>';
    if(reward.recordBoost2h) rewardHtml +=
      '<div style="background:rgba(255,150,0,0.1);border:1px solid rgba(255,150,0,0.3);border-radius:10px;padding:9px;margin-bottom:7px;">⚡ ×2 RECORD '+(currentLang==='ar'?'لمدة ساعتين':'for 2 hours')+'</div>';
    if(reward.recBoost24h) rewardHtml +=
      '<div style="background:rgba(0,200,255,0.08);border:1px solid rgba(0,200,255,0.25);border-radius:10px;padding:9px;margin-bottom:7px;">🚀 ×2 REC '+(currentLang==='ar'?'ليوم كامل':'for 24 hours')+'</div>';
  }

  var ol = document.createElement('div');
  ol.id = 'lvlUpOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:99999;display:flex;align-items:center;justify-content:center;';
  ol.onclick = function(e){ if(e.target===ol) ol.remove(); };

  ol.innerHTML =
    '<div style="background:linear-gradient(180deg,#0a0a18,#14141f);border:2px solid #FFD700;border-radius:24px;padding:28px 22px;width:82vw;max-width:300px;text-align:center;box-shadow:0 0 60px rgba(255,215,0,0.4);" onclick="event.stopPropagation()">'+
      '<div style="font-size:50px;margin-bottom:6px;">🏆</div>'+
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:3px;margin-bottom:4px;">'+(currentLang==='ar'?'ترقية مستوى!':'LEVEL UP!')+'</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:52px;font-weight:900;color:#FFD700;text-shadow:0 0 30px rgba(255,215,0,0.7);margin-bottom:16px;">'+lvl+'</div>'+
      (rewardHtml?'<div style="text-align:left;margin-bottom:14px;">'+rewardHtml+'</div>':'')+
      '<button onclick="document.getElementById(\'lvlUpOverlay\').remove()" style="background:linear-gradient(135deg,#886600,#FFD700);border:none;color:#000;padding:12px 28px;border-radius:12px;font-size:15px;font-weight:900;cursor:pointer;width:100%;">'+
        (currentLang==='ar'?'🎉 رائع!':'🎉 Awesome!')+
      '</button>'+
    '</div>';

  document.body.appendChild(ol);
}

// ====== UPDATE LEVEL DISPLAY ======
function updateLevelDisplay() {
  var lvl = calcPlayerLevel(playerXP);
  var inLvl = xpInCurrentLevel(playerXP);
  var needed = xpForNextLevel(playerXP);
  var pct = needed > 0 ? Math.min(100, Math.floor(inLvl / needed * 100)) : 100;

  var lvlEl = document.getElementById('playerLevelNum');
  if(lvlEl) lvlEl.textContent = lvl;

  var bar = document.getElementById('xpProgressBar');
  if(bar) bar.style.width = pct + '%';

  var txt = document.getElementById('xpProgressText');
  if(txt) txt.textContent = inLvl.toLocaleString() + ' / ' + needed.toLocaleString() + ' XP';
}

// ====== PROFILE LEVEL SECTION ======
function buildLevelSection() {
  var lvl = calcPlayerLevel(playerXP);
  var inLvl = xpInCurrentLevel(playerXP);
  var needed = xpForNextLevel(playerXP);
  var pct = needed > 0 ? Math.min(100, Math.floor(inLvl / needed * 100)) : 100;
  var reward = LEVEL_REWARDS[lvl + 1];

  var nextReward = '';
  if(reward) {
    var parts = [];
    if(reward.record) parts.push('🔴 '+formatCost(reward.record));
    if(reward.rec) parts.push('⚡ '+reward.rec+' REC');
    if(reward.vipDays) parts.push('👑 VIP '+reward.vipDays+'d');
    if(reward.recordBoost2h) parts.push('×2 RECORD');
    if(reward.recBoost24h) parts.push('×2 REC');
    if(parts.length) nextReward = parts.join(' + ');
  }

  return '<div style="grid-column:1/-1;background:linear-gradient(135deg,rgba(255,215,0,0.07),rgba(255,215,0,0.02));border:1px solid rgba(255,215,0,0.3);border-radius:16px;padding:16px;margin-bottom:4px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
      '<div style="font-family:Orbitron,sans-serif;font-size:26px;font-weight:900;color:#FFD700;letter-spacing:2px;">' +
        (currentLang==='ar'?'المستوى ':'LVL ') + lvl +
      '</div>' +
      '<div style="font-size:10px;color:rgba(255,255,255,0.3);">' + playerXP.toLocaleString() + ' XP</div>' +
    '</div>' +
    '<div style="background:rgba(255,255,255,0.07);border-radius:10px;height:16px;overflow:hidden;margin-bottom:6px;position:relative;">' +
      '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#00AA44,#00FF88);border-radius:10px;transition:width 0.6s;"></div>' +
      '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:white;text-shadow:0 1px 3px rgba(0,0,0,0.8);">' +
        inLvl.toLocaleString() + ' / ' + needed.toLocaleString() + ' XP' +
      '</div>' +
    '</div>' +
    (lvl < 99 ?
      '<div style="font-size:10px;color:rgba(255,255,255,0.3);text-align:center;">' +
        (currentLang==='ar'?'مكافأة المستوى '+(lvl+1)+':':'LVL '+(lvl+1)+' reward: ') +
        (nextReward || '—') +
      '</div>' :
      '<div style="font-size:12px;color:#FFD700;text-align:center;font-weight:700;">⭐ '+(currentLang==='ar'?'المستوى الأعلى!':'MAX LEVEL!')+'</div>'
    ) +
  '</div>';
}

// ====== RETROACTIVE XP CALCULATION ======
function calcRetroactiveXP() {
  if(xpRetroCalculated || playerXP > 0) { updateLevelDisplay(); return; }

  var xp = 0;

  // From card levels
  if(typeof cardLevels !== 'undefined') {
    Object.keys(cardLevels).forEach(function(key) {
      var lvl = cardLevels[key] || 0;
      for(var i = 0; i < lvl; i++) xp += xpForCardUpgrade(i);
    });
  }

  // From completed tasks
  if(typeof completedTasks !== 'undefined') {
    xp += completedTasks.length * 50;
  }

  // From invites
  if(typeof refCount !== 'undefined') {
    xp += refCount * 100;
  }

  // From VIP subscription
  if(typeof vipData !== 'undefined' && parseInt(vipData.tier||0) >= 1) {
    xp += 500;
  }

  // From daily login days
  if(typeof dailyLogin !== 'undefined' && dailyLogin.day > 0) {
    xp += dailyLogin.day * 30;
  }

  // From total taps
  if(typeof totalTaps !== 'undefined') {
    xp += Math.floor((totalTaps || 0) * 0.5);
  }

  if(xp > 0) {
    playerXP = xp;
    var lvl = calcPlayerLevel(playerXP);
    for(var i = 1; i <= lvl; i++) claimedLevels[i] = true;
  }

  xpRetroCalculated = true;
  updateLevelDisplay();
  saveData(true);
}
