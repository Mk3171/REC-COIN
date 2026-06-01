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
  1: { record:100000000 },
  2: { record:282842712 },
  3: { record:519615242 },
  4: { record:800000000 },
  5: { record:1118033988, rec:4.1 },
  6: { record:1469693845, rec:5.1 },
  7: { record:1852025917, rec:6.3 },
  8: { record:2262741699, rec:7.5 },
  9: { record:2700000000, rec:8.7 },
  10: { record:3162277660, rec:10.0 },
  11: { record:3648287269, rec:11.3 },
  12: { record:4156921938, rec:12.6 },
  13: { record:4687216658, rec:14.0 },
  14: { record:5238320341, rec:15.5 },
  15: { record:5809475019, rec:16.9 },
  16: { record:6400000000, rec:18.4 },
  17: { record:7009279563, rec:19.9 },
  18: { record:7636753236, rec:21.4 },
  19: { record:8281907992, rec:23.0 },
  20: { record:8944271909, rec:24.6, vipDays:3 },
  21: { record:9623408959, rec:26.2 },
  22: { record:10318914671, rec:27.8 },
  23: { record:11030412503, rec:29.5 },
  24: { record:11757550765, rec:31.1 },
  25: { record:12500000000, rec:32.8 },
  26: { record:13257450735, rec:34.5 },
  27: { record:14029611541, rec:36.3 },
  28: { record:14816207341, rec:38.0 },
  29: { record:15616977940, rec:39.8 },
  30: { record:16431676725, rec:41.6 },
  31: { record:17260069524, rec:43.4 },
  32: { record:18101933598, rec:45.3 },
  33: { record:18957056733, rec:47.1 },
  34: { record:19825236442, rec:49.0 },
  35: { record:20706279240, rec:50.8 },
  36: { record:21600000000, rec:52.7 },
  37: { record:22506221362, rec:54.7 },
  38: { record:23424773211, rec:56.6 },
  39: { record:24355492193, rec:58.5 },
  40: { record:25298221281, rec:60.5, recordBoost2h:true },
  41: { record:26252809373, rec:62.5 },
  42: { record:27219110933, rec:64.4 },
  43: { record:28196985654, rec:66.4 },
  44: { record:29186298155, rec:68.5 },
  45: { record:30186917696, rec:70.5 },
  46: { record:31198717922, rec:72.5 },
  47: { record:32221576621, rec:74.6 },
  48: { record:33255375505, rec:76.7 },
  49: { record:34300000000, rec:78.7 },
  50: { record:35355339059, rec:80.8, vipDays:10 },
  51: { record:36421284985, rec:82.9 },
  52: { record:37497733264, rec:85.1 },
  53: { record:38584582413, rec:87.2 },
  54: { record:39681733833, rec:89.3 },
  55: { record:40789091679, rec:91.5 },
  56: { record:41906562731, rec:93.7 },
  57: { record:43034056281, rec:95.9 },
  58: { record:44171484014, rec:98.0 },
  59: { record:45318759912, rec:100.2 },
  60: { record:46475800154, rec:102.5 },
  61: { record:47642523023, rec:104.7 },
  62: { record:48818848818, rec:106.9 },
  63: { record:50004699779, rec:109.2 },
  64: { record:51200000000, rec:111.4 },
  65: { record:52404675363, rec:113.7 },
  66: { record:53618653470, rec:116.0 },
  67: { record:54841863571, rec:118.3 },
  68: { record:56074236508, rec:120.6 },
  69: { record:57315704654, rec:122.9 },
  70: { record:58566201857, rec:125.2, recBoost24h:true },
  71: { record:59825663389, rec:127.5 },
  72: { record:61094025894, rec:129.9 },
  73: { record:62371227340, rec:132.2 },
  74: { record:63657206976, rec:134.6 },
  75: { record:64951905283, rec:136.9, vipDays:15 },
  76: { record:66255263941, rec:139.3 },
  77: { record:67567225782, rec:141.7 },
  78: { record:68887734757, rec:144.1 },
  79: { record:70216735896, rec:146.5 },
  80: { record:71554175279, rec:148.9 },
  81: { record:72900000000, rec:151.4 },
  82: { record:74254158132, rec:153.8 },
  83: { record:75616598706, rec:156.2 },
  84: { record:76987271675, rec:158.7 },
  85: { record:78366127886, rec:161.1 },
  86: { record:79753119061, rec:163.6 },
  87: { record:81148197761, rec:166.1 },
  88: { record:82551317372, rec:168.6 },
  89: { record:83962432075, rec:171.1 },
  90: { record:85381496824, rec:173.6 },
  91: { record:86808467328, rec:176.1 },
  92: { record:88243300028, rec:178.6 },
  93: { record:89685952077, rec:181.1 },
  94: { record:91136381319, rec:183.7 },
  95: { record:92594546275, rec:186.2 },
  96: { record:94060406122, rec:188.8 },
  97: { record:95533920677, rec:191.3 },
  98: { record:97015050378, rec:193.9 },
  99: { record:98503756273, rec:196.5 }
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
  if(bar) {
    var oldPct = parseFloat(bar.style.width)||0;
    bar.style.width = pct+'%';

    // Animate glow dot
    var dot = document.getElementById('xpGlowDot');
    if(dot) {
      dot.style.display = 'block';
      dot.style.left = pct+'%';
      // Hide dot at 0% or 100%
      if(pct <= 0 || pct >= 100) dot.style.display = 'none';
    }

    // Pulse hearts on XP gain
    if(pct > oldPct || pct < oldPct) {
      pulseHearts();
    }
  }
}

function pulseHearts() {
  var h1 = document.getElementById('xpHeart1');
  var h2 = document.getElementById('xpHeart2');
  if(!h1||!h2) return;
  // Animate heart 1
  h1.style.transition = 'transform 0.2s, opacity 0.2s';
  h1.style.transform = 'scale(1.6)';
  h1.style.opacity = '1';
  setTimeout(function(){ h1.style.transform='scale(1)'; h1.style.opacity='0.7'; }, 200);
  // Animate heart 2 slightly delayed
  setTimeout(function(){
    h2.style.transition = 'transform 0.2s, opacity 0.2s';
    h2.style.transform = 'scale(1.6)';
    h2.style.opacity = '1';
    setTimeout(function(){ h2.style.transform='scale(1)'; h2.style.opacity='0.7'; }, 200);
  }, 120);
}

// ====== RENDER LEVELS LIST ======
function renderLevelsList(container) {
  var html = '';
  for(var lvl = 1; lvl <= 100; lvl++) {
    var lvlStartXP  = cumXPForLevel(lvl);
    var lvlNeeded   = xpNeededForLevel(lvl);
    var lvlEndXP    = lvlStartXP + lvlNeeded;
    var isClaimed   = !!claimedLevels[lvl];
    var isReached   = playerXP >= lvlEndXP;
    var canClaim    = isReached && !isClaimed && lvl < 100;
    var inProgress  = !isReached && playerXP > lvlStartXP;
    var isLocked    = !isReached && !inProgress;

    // XP in this level
    var earnedInLvl = Math.max(0, Math.min(playerXP - lvlStartXP, lvlNeeded));
    var pct = lvlNeeded > 0 ? Math.min(100, Math.floor(earnedInLvl / lvlNeeded * 100)) : 100;
    var xpLabel = earnedInLvl.toLocaleString() + ' / ' + lvlNeeded.toLocaleString() + ' XP';

    var rwdText = getRewardText(lvl);
    var lvlColor = isClaimed ? '#00CC66' : (canClaim || inProgress) ? '#FFD700' : 'rgba(255,255,255,0.35)';
    var rowBg    = isClaimed ? 'rgba(0,150,60,0.1)' : canClaim ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.03)';
    var rowBrd   = isClaimed ? 'rgba(0,200,80,0.25)' : canClaim ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.06)';
    var barColor = isClaimed ? '#00CC66' : '#00FF88';

    html += '<div style="background:'+rowBg+';border:1px solid '+rowBrd+';border-radius:10px;padding:10px 12px;margin-bottom:5px;">';

    // Row top: level number + reward text + button
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:'+(isLocked&&lvl!==100?'0':'6px')+'">';
    html += '<div style="font-weight:900;font-size:12px;color:'+lvlColor+';min-width:46px;">LVL '+lvl+'</div>';

    if(lvl === 100) {
      html += '<div style="flex:1;font-size:11px;color:rgba(255,255,255,0.25);">🔒 '+(currentLang==='ar'?'قريباً':'Coming Soon')+'</div>';
    } else if(isLocked) {
      html += '<div style="flex:1;text-align:right;font-size:10px;color:rgba(255,255,255,0.2);">'+(currentLang==='ar'?'مقفول':'LOCKED')+'</div>';
    } else if(isClaimed) {
      html += '<div style="flex:1;font-size:10px;color:rgba(255,255,255,0.4);">'+rwdText+'</div>';
      html += '<div style="font-size:13px;">✅</div>';
    } else {
      html += '<div style="flex:1;font-size:10px;color:#FFD700;">'+rwdText+'</div>';
      html += '<div onclick="claimLevelReward('+lvl+')" style="background:linear-gradient(135deg,#886600,#FFD700);border-radius:8px;padding:5px 12px;font-size:11px;font-weight:900;color:#000;cursor:pointer;white-space:nowrap;">'+(currentLang==='ar'?'تحصيل':'CLAIM')+'</div>';
    }
    html += '</div>';

    // Progress bar (always show except locked and level 100)
    if(lvl !== 100 && !isLocked) {
      html += '<div style="display:flex;align-items:center;gap:6px;">';
      html += '<div style="flex:1;background:rgba(255,255,255,0.07);border-radius:4px;height:5px;overflow:hidden;">';
      html += '<div style="width:'+pct+'%;height:100%;background:'+barColor+';border-radius:4px;"></div>';
      html += '</div>';
      html += '<div style="font-size:9px;color:rgba(255,255,255,0.3);white-space:nowrap;">'+xpLabel+'</div>';
      html += '</div>';
    }

    html += '</div>';
  }
  container.innerHTML = html;
}

// ====== BUILD SECTION FOR PROFILE POPUP ======
function buildLevelSection() {
  return '<div style="grid-column:1/-1;">'+
    '<div style="font-size:14px;font-weight:700;color:#FFD700;margin-bottom:10px;">'+(currentLang==='ar'?'مكافآت المستويات':'Level rewards')+'</div>'+
    '<div id="ppLevelsGrid" style="max-height:360px;overflow-y:auto;"></div>'+
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
    // Don't auto-claim — user claims manually
  }
  xpRetroCalculated = true;
  updateLevelDisplay();
  saveData(true);
}
