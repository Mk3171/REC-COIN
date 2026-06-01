// ====== LEVELS SYSTEM — levels.js ======

var playerXP = 0;
var claimedLevels = {};
var xpRetroCalculated = false;

// ====== XP FORMULAS ======
function xpNeededForLevel(lvl) {
  if(lvl <= 0) return 0;
  return Math.floor(200 * lvl * Math.sqrt(lvl));
}

function cumXPForLevel(lvl) {
  // Total XP needed to REACH level lvl (cumulative)
  var total = 0;
  for(var i = 1; i < lvl; i++) total += xpNeededForLevel(i);
  return total;
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
  var lvl = calcPlayerLevel(xp);
  return xp - cumXPForLevel(lvl);
}

function xpForNextLevel(xp) {
  var lvl = calcPlayerLevel(xp);
  return lvl >= 99 ? 0 : xpNeededForLevel(lvl + 1);
}

// ====== XP PER CARD UPGRADE ======
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

function getRewardText(lvl) {
  if(lvl === 100) return '🔒 ' + (currentLang==='ar'?'قريباً':'Coming Soon');
  var r = LEVEL_REWARDS[lvl];
  if(!r) return '—';
  var parts = [];
  if(r.record) parts.push('🔴 +'+formatCost(r.record));
  if(r.rec) parts.push('⚡ +'+r.rec+' REC');
  if(r.vipDays) parts.push('👑 VIP '+r.vipDays+(currentLang==='ar'?' أيام':'d'));
  if(r.recordBoost2h) parts.push('×2 RECORD 2h');
  if(r.recBoost24h) parts.push('×2 REC 24h');
  return parts.join('  ');
}

// ====== ADD XP (no auto-claim) ======
function addXP(amount) {
  if(!amount || amount <= 0) return;
  playerXP += Math.floor(amount);
  updateLevelDisplay();
  // Refresh level list if profile popup is open
  var grid = document.getElementById('ppLevelsGrid');
  if(grid) renderLevelsList(grid);
}

// ====== CLAIM LEVEL REWARD ======
function claimLevelReward(lvl) {
  if(claimedLevels[lvl]) return;
  if(playerXP < cumXPForLevel(lvl) + xpNeededForLevel(lvl)) return;
  claimedLevels[lvl] = true;
  var r = LEVEL_REWARDS[lvl];
  if(r) {
    if(r.record) record += r.record;
    if(r.rec) rec += r.rec;
    if(r.vipDays) {
      var now = Date.now();
      if(!vipData) vipData = { tier:0, expiry:0, boxes:{} };
      if(parseInt(vipData.tier||0) < 1 || parseInt(vipData.expiry||0) <= now) {
        vipData.tier = 1;
        vipData.expiry = now + r.vipDays * 86400000;
        vipData.boxes = {};
      } else {
        vipData.expiry = parseInt(vipData.expiry) + r.vipDays * 86400000;
      }
    }
  }
  saveData(true);
  updateUI();
  showLevelUpPopup(lvl, r);
  // Refresh list
  var grid = document.getElementById('ppLevelsGrid');
  if(grid) renderLevelsList(grid);
}

// ====== LEVEL UP POPUP ======
function showLevelUpPopup(lvl, r) {
  var old = document.getElementById('lvlUpOverlay');
  if(old) old.remove();
  var rewardHtml = '';
  if(r) {
    if(r.record) rewardHtml += '<div style="background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.25);border-radius:10px;padding:9px;margin-bottom:7px;">🔴 +'+formatCost(r.record)+' RECORD</div>';
    if(r.rec) rewardHtml += '<div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);border-radius:10px;padding:9px;margin-bottom:7px;">⚡ +'+r.rec+' REC</div>';
    if(r.vipDays) rewardHtml += '<div style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);border-radius:10px;padding:9px;margin-bottom:7px;">👑 VIP I — '+r.vipDays+' '+(currentLang==='ar'?'أيام':'days')+'!</div>';
    if(r.recordBoost2h) rewardHtml += '<div style="background:rgba(255,150,0,0.1);border:1px solid rgba(255,150,0,0.3);border-radius:10px;padding:9px;margin-bottom:7px;">⚡ ×2 RECORD 2h</div>';
    if(r.recBoost24h) rewardHtml += '<div style="background:rgba(0,200,255,0.08);border:1px solid rgba(0,200,255,0.25);border-radius:10px;padding:9px;margin-bottom:7px;">🚀 ×2 REC 24h</div>';
  }
  var ol = document.createElement('div');
  ol.id = 'lvlUpOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:99999;display:flex;align-items:center;justify-content:center;';
  ol.onclick = function(e){ if(e.target===ol) ol.remove(); };
  ol.innerHTML =
    '<div style="background:linear-gradient(180deg,#0a0a18,#14141f);border:2px solid #FFD700;border-radius:24px;padding:28px 22px;width:82vw;max-width:300px;text-align:center;box-shadow:0 0 60px rgba(255,215,0,0.4);" onclick="event.stopPropagation()">'+
      '<div style="font-size:50px;margin-bottom:6px;">🏆</div>'+
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:3px;margin-bottom:4px;">'+(currentLang==='ar'?'تم تحصيل المكافأة!':'REWARD CLAIMED!')+'</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:52px;font-weight:900;color:#FFD700;text-shadow:0 0 30px rgba(255,215,0,0.7);margin-bottom:16px;">'+lvl+'</div>'+
      (rewardHtml?'<div style="text-align:left;margin-bottom:14px;">'+rewardHtml+'</div>':'')+
      '<button onclick="document.getElementById(\'lvlUpOverlay\').remove()" style="background:linear-gradient(135deg,#886600,#FFD700);border:none;color:#000;padding:12px 28px;border-radius:12px;font-size:15px;font-weight:900;cursor:pointer;width:100%;">'+
        (currentLang==='ar'?'🎉 رائع!':'🎉 Awesome!')+
      '</button>'+
    '</div>';
  document.body.appendChild(ol);
}

// ====== UPDATE HEADER DISPLAY ======
function updateLevelDisplay() {
  var lvl = calcPlayerLevel(playerXP);
  var inLvl = xpInCurrentLevel(playerXP);
  var needed = xpForNextLevel(playerXP);
  var pct = needed > 0 ? Math.min(100, Math.floor(inLvl/needed*100)) : 100;
  var lvlEl = document.getElementById('playerLevelNum');
  if(lvlEl) lvlEl.textContent = lvl;
  var bar = document.getElementById('xpProgressBar');
  if(bar) bar.style.width = pct+'%';
}

// ====== RENDER LEVELS LIST ======
function renderLevelsList(container) {
  var currentLvl = calcPlayerLevel(playerXP);
  var html = '';
  for(var lvl = 1; lvl <= 100; lvl++) {
    var isClaimed  = !!claimedLevels[lvl];
    var xpRequired = cumXPForLevel(lvl) + xpNeededForLevel(lvl);
    var canClaim   = !isClaimed && playerXP >= xpRequired && lvl < 100;
    var isLocked   = !isClaimed && !canClaim;
    var rwdText    = getRewardText(lvl);
    var rowBg      = isClaimed  ? 'rgba(0,150,60,0.15)'  :
                     canClaim   ? 'rgba(255,215,0,0.12)'  :
                     'rgba(255,255,255,0.03)';
    var rowBorder  = isClaimed  ? 'rgba(0,200,80,0.3)'   :
                     canClaim   ? 'rgba(255,215,0,0.4)'   :
                     'rgba(255,255,255,0.07)';
    var lvlColor   = isClaimed  ? '#00CC66' :
                     canClaim   ? '#FFD700' :
                     'rgba(255,255,255,0.4)';

    html += '<div style="display:flex;align-items:center;gap:10px;background:'+rowBg+';border:1px solid '+rowBorder+';border-radius:12px;padding:10px 12px;margin-bottom:6px;">'+
      '<div style="font-family:Orbitron,sans-serif;font-size:12px;font-weight:900;color:'+lvlColor+';min-width:52px;">LVL '+lvl+'</div>';

    if(isClaimed) {
      html += '<div style="flex:1;font-size:11px;color:rgba(255,255,255,0.4);">'+rwdText+'</div>'+
              '<div style="font-size:14px;">✅</div>';
    } else if(canClaim) {
      html += '<div style="flex:1;font-size:11px;color:#FFD700;">'+rwdText+'</div>'+
              '<div onclick="claimLevelReward('+lvl+')" style="background:linear-gradient(135deg,#886600,#FFD700);border:none;border-radius:8px;padding:6px 14px;font-size:11px;font-weight:900;color:#000;cursor:pointer;white-space:nowrap;">'+
                (currentLang==='ar'?'تحصيل':'CLAIM')+
              '</div>';
    } else if(lvl === 100) {
      html += '<div style="flex:1;font-size:11px;color:rgba(255,255,255,0.25);">🔒 '+(currentLang==='ar'?'قريباً':'Coming Soon')+'</div>';
    } else {
      html += '<div style="flex:1;text-align:right;font-size:11px;color:rgba(255,255,255,0.2);">'+(currentLang==='ar'?'مقفول':'LOCKED')+'</div>';
    }
    html += '</div>';
  }
  container.innerHTML = html;
}

// ====== BUILD SECTION FOR PROFILE POPUP ======
function buildLevelSection() {
  var lvl = calcPlayerLevel(playerXP);
  var inLvl = xpInCurrentLevel(playerXP);
  var needed = xpForNextLevel(playerXP);
  var pct = needed > 0 ? Math.min(100, Math.floor(inLvl/needed*100)) : 100;

  return '<div style="grid-column:1/-1;">'+
    // Header with level + XP bar
    '<div style="background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02));border:1px solid rgba(255,215,0,0.3);border-radius:14px;padding:14px;margin-bottom:12px;">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">'+
        '<div style="font-family:Orbitron,sans-serif;font-size:24px;font-weight:900;color:#FFD700;">LVL '+lvl+'</div>'+
        '<div style="font-size:11px;color:rgba(255,255,255,0.35);">'+inLvl.toLocaleString()+' / '+needed.toLocaleString()+' XP</div>'+
      '</div>'+
      '<div style="background:rgba(255,255,255,0.07);border-radius:8px;height:12px;overflow:hidden;">'+
        '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#00AA44,#00FF88);border-radius:8px;transition:width 0.5s;"></div>'+
      '</div>'+
    '</div>'+
    // Level rewards title
    '<div style="font-size:14px;font-weight:700;color:#FFD700;margin-bottom:8px;">'+(currentLang==='ar'?'مكافآت المستويات':'Level rewards')+'</div>'+
    // List container
    '<div id="ppLevelsGrid" style="max-height:320px;overflow-y:auto;padding-right:2px;"></div>'+
  '</div>';
}

// ====== RETROACTIVE XP ======
function calcRetroactiveXP() {
  if(xpRetroCalculated || playerXP > 0) { updateLevelDisplay(); return; }
  var xp = 0;
  if(typeof cardLevels !== 'undefined') {
    Object.keys(cardLevels).forEach(function(key) {
      var lvl = cardLevels[key]||0;
      for(var i=0;i<lvl;i++) xp += xpForCardUpgrade(i);
    });
  }
  if(typeof completedTasks !== 'undefined') xp += completedTasks.length * 50;
  if(typeof refCount !== 'undefined') xp += refCount * 100;
  if(typeof vipData !== 'undefined' && parseInt(vipData.tier||0)>=1) xp += 500;
  if(typeof dailyLogin !== 'undefined' && dailyLogin.day > 0) xp += dailyLogin.day * 30;
  if(typeof totalTaps !== 'undefined') xp += Math.floor((totalTaps||0)*0.5);
  if(xp > 0) {
    playerXP = xp;
    // Mark all reachable levels as claimed (retroactive — no popup)
    var lvl = calcPlayerLevel(playerXP);
    for(var i=1;i<=lvl;i++) claimedLevels[i]=true;
  }
  xpRetroCalculated = true;
  updateLevelDisplay();
  saveData(true);
}
