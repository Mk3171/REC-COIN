// ====== AIRDROP SYSTEM V2 — Daily Tasks ======
var AIRDROP_TOTAL = 1000000000;

// ====== Session Tracking ======
function getAirdropData() {
  try { return JSON.parse(localStorage.getItem('airdropData_v2') || '{}'); } catch(e) { return {}; }
}
function saveAirdropData(d) {
  try { localStorage.setItem('airdropData_v2', JSON.stringify(d)); } catch(e) {}
}

function getTodayStr() { return new Date().toISOString().split('T')[0]; }

function trackDailySession() {
  var d = getAirdropData();
  var today = getTodayStr();
  if(!d.sessions) d.sessions = {};
  if(!d.sessions[today]) d.sessions[today] = 0;
  d.sessions[today]++;
  saveAirdropData(d);
}
function getTotalActiveDays() {
  var d = getAirdropData(); return d.sessions ? Object.keys(d.sessions).length : 0;
}
function getAvgSessionsPerDay() {
  var d = getAirdropData();
  if(!d.sessions) return 0;
  var days = Object.keys(d.sessions);
  if(!days.length) return 0;
  var total = days.reduce(function(s,k){ return s+d.sessions[k]; },0);
  return Math.min(10, total/days.length);
}

// ====== Daily REC Tracking ======
function getDailyRecStart() {
  var d = getAirdropData();
  var today = getTodayStr();
  if(d.recDay !== today) {
    d.recDay = today;
    d.recStart = typeof rec !== 'undefined' ? rec : 0;
    saveAirdropData(d);
  }
  return d.recStart || 0;
}
function getDailyRecEarned() {
  var start = getDailyRecStart();
  var current = typeof rec !== 'undefined' ? rec : 0;
  return Math.max(0, current - start);
}

// ====== Random Card Selection (changes every 3 days) ======
function getDailyCards() {
  var allCards = [];
  if(typeof categories !== 'undefined') {
    categories.forEach(function(cat, ci) {
      cat.cards.forEach(function(card, idx) {
        allCards.push({ key: ci+'_'+idx, name: card.en || card.n, emoji: card.e||'🃏' });
      });
    });
  }
  if(!allCards.length) return [
    { key:'0_0', name:'Naruto', emoji:'🍥' },
    { key:'0_4', name:'Itachi', emoji:'🌸' },
    { key:'1_0', name:'Ferrari SF90', emoji:'🔴' }
  ];

  // Seed based on day period (changes every 3 days)
  var dayNum = Math.floor(Date.now() / (86400000 * 3));
  var seed = dayNum * 16807 + 1;
  function seededRand(s) { return ((s * 16807) % 2147483647); }

  seed = seededRand(seed);
  var i1 = seed % allCards.length;
  seed = seededRand(seed);
  var i2 = seed % (allCards.length - 1);
  if(i2 >= i1) i2++;
  seed = seededRand(seed);
  var i3 = seed % (allCards.length - 2);
  if(i3 >= Math.min(i1,i2)) i3++;
  if(i3 >= Math.max(i1,i2)) i3++;

  return [allCards[i1], allCards[i2], allCards[i3]];
}

function getCardLevel(key) {
  if(typeof cardLevels === 'undefined') return 0;
  return cardLevels[key] || 0;
}

// ====== Score Calculation ======
function calcAirdropScore() {
  var score = 0;
  var loginDays = typeof dailyLogin !== 'undefined' ? (dailyLogin.day||0) : 0;
  score += Math.min(500, loginDays * 10);
  score += Math.min(300, getTotalActiveDays() * 10);
  score += Math.min(100, Math.floor(getAvgSessionsPerDay() * 20));
  var recBal = typeof rec !== 'undefined' ? rec : 0;
  if(recBal > 0) score += Math.min(2000, Math.floor(Math.log10(recBal+1)*400));
  var lvl = (typeof calcPlayerLevel==='function' && typeof playerXP!=='undefined') ? calcPlayerLevel(playerXP) : 0;
  score += lvl * 10;
  if(typeof cardLevels !== 'undefined') {
    var cardSum = Object.values(cardLevels).reduce(function(s,v){return s+(v||0);},0);
    score += Math.min(1500, cardSum * 2);
  }
  if(typeof completedTasks !== 'undefined') score += Math.min(300, completedTasks.length * 15);
  if(typeof refCount !== 'undefined') score += Math.min(500, refCount * 50);
  if(typeof vipData !== 'undefined' && parseInt(vipData.tier||0)>=1 && parseInt(vipData.expiry||0)>Date.now()) score += 200;
  score += calcDailyTasksScore();
  score += calcAdsTaskScore();
  return Math.floor(score);
}

function calcDailyTasksScore() {
  var bonus = 0;
  var cards = getDailyCards();
  cards.forEach(function(card) {
    var lvl = getCardLevel(card.key);
    if(lvl >= 70) bonus += 1000;
    else if(lvl >= 40) bonus += 100;
    else if(lvl >= 20) bonus += 50;
  });
  var dailyRec = getDailyRecEarned();
  if(dailyRec >= 10000) bonus += 5000;
  else if(dailyRec >= 5000) bonus += 1500;
  else if(dailyRec >= 2500) bonus += 500;
  else if(dailyRec >= 1500) bonus += 200;
  else if(dailyRec >= 500)  bonus += 50;
  var refs = typeof refCount !== 'undefined' ? refCount : 0;
  if(refs >= 50)  bonus += 5000;
  else if(refs >= 20) bonus += 2000;
  else if(refs >= 10) bonus += 500;
  return bonus;
}

// Ads task score — separate from daily tasks
function calcAdsTaskScore() {
  var adsState = (typeof getAdsTaskState === 'function') ? getAdsTaskState() : {claimedTiers:[]};
  var bonus = 0;
  var tiers = [{req:50,pts:500},{req:100,pts:1000},{req:200,pts:2500}];
  adsState.claimedTiers.forEach(function(idx) {
    if(tiers[idx]) bonus += tiers[idx].pts;
  });
  return bonus;
}

// ====== Ads Task State System ======
var ADS_TASK_PERIOD_MS = 2 * 24 * 60 * 60 * 1000; // 2 days
var ADS_TASK_TIERS = [
  {req: 50,  pts: 500},
  {req: 100, pts: 1000},
  {req: 200, pts: 2500}
];

function getAdsTaskState() {
  var d;
  try { d = JSON.parse(localStorage.getItem('adsTaskState') || 'null'); } catch(e) {}
  if(!d) d = {claimedTiers: [], currentTierIdx: 0, periodStart: Date.now(), periodAds: 0};
  if(!d.claimedTiers) d.claimedTiers = [];
  if(typeof d.currentTierIdx !== 'number') d.currentTierIdx = 0;
  if(typeof d.periodAds !== 'number') d.periodAds = 0;
  if(!d.periodStart) d.periodStart = Date.now();
  var now = Date.now();
  if(d.currentTierIdx < ADS_TASK_TIERS.length && (now - d.periodStart) >= ADS_TASK_PERIOD_MS) {
    d.periodAds = 0;
    d.periodStart = now;
    saveAdsTaskState(d);
  }
  return d;
}

function saveAdsTaskState(d) {
  try { localStorage.setItem('adsTaskState', JSON.stringify(d)); } catch(e) {}
}

function incrementAdsTaskProgress() {
  var d = getAdsTaskState();
  if(d.currentTierIdx >= ADS_TASK_TIERS.length) return;
  d.periodAds = (d.periodAds || 0) + 1;
  var tier = ADS_TASK_TIERS[d.currentTierIdx];
  if(d.periodAds >= tier.req) {
    if(d.claimedTiers.indexOf(d.currentTierIdx) === -1) d.claimedTiers.push(d.currentTierIdx);
    d.currentTierIdx++;
    d.periodAds = 0;
    d.periodStart = Date.now();
    if(typeof showToast === 'function') {
      showToast('🎉 +' + tier.pts.toLocaleString() + ' pts! ' + (typeof t === 'function' ? t('adsTierBonus','Ads task tier complete!') : 'Ads task tier complete!'));
    }
  }
  saveAdsTaskState(d);
}

function renderAdsTaskCard() {
  var d = getAdsTaskState();
  var now = Date.now();
  var timeLeft = Math.max(0, ADS_TASK_PERIOD_MS - (now - d.periodStart));
  var hoursLeft = Math.floor(timeLeft / 3600000);
  var minsLeft  = Math.floor((timeLeft % 3600000) / 60000);
  var timerColor = hoursLeft < 6 ? '#FF4444' : hoursLeft < 24 ? '#FF8800' : '#FFD700';

  var html = '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,107,53,0.25);border-radius:14px;padding:14px;margin-bottom:12px;">';

  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">' +
    '<div style="display:flex;align-items:center;gap:8px;">' +
      '<span style="font-size:26px;">📺</span>' +
      '<div>' +
        '<div style="font-size:13px;font-weight:700;color:white;">' + (typeof t==="function"?t("airdropWatchAdsTask","Watch Ads"):"Watch Ads") + "</div>" +
        (d.currentTierIdx < ADS_TASK_TIERS.length
          ? '<div style="font-size:10px;color:' + timerColor + ';margin-top:2px;">⏱ ' + hoursLeft + 'h ' + minsLeft + 'm left</div>'
          : '<div style="font-size:10px;color:#00FF88;margin-top:2px;">🏆 All tiers complete!</div>'
        ) +
      "</div>" +
    "</div>" +
  "</div>";

  ADS_TASK_TIERS.forEach(function(tier, i) {
    var isClaimed = d.claimedTiers.indexOf(i) !== -1;
    var isActive  = !isClaimed && d.currentTierIdx === i;
    var isLocked  = !isClaimed && d.currentTierIdx < i;
    var progress  = isClaimed ? tier.req : (isActive ? Math.min(d.periodAds, tier.req) : 0);
    var pct = Math.floor(progress / tier.req * 100);
    var bg     = isClaimed ? "rgba(0,255,136,0.05)"  : isActive ? "rgba(255,107,53,0.07)" : "rgba(255,255,255,0.02)";
    var border = isClaimed ? "rgba(0,255,136,0.25)"  : isActive ? "rgba(255,107,53,0.35)" : "rgba(255,255,255,0.05)";
    var barBg  = isClaimed ? "#00FF88" : "linear-gradient(90deg,#FF6B35,#FF8800)";

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:' + bg + ';border:1px solid ' + border + ';border-radius:10px;margin-bottom:6px;opacity:' + (isLocked?"0.35":"1") + ';">' +
      '<div style="flex:1;">' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.65);">Watch ' + tier.req + ' ads</div>' +
        '<div style="background:rgba(255,255,255,0.07);border-radius:6px;height:6px;margin-top:8px;">' +
          '<div style="background:' + barBg + ';width:' + pct + '%;height:6px;border-radius:6px;transition:width 0.3s;"></div>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:4px;">' + progress.toLocaleString() + " / " + tier.req.toLocaleString() + " ads</div>" +
      "</div>" +
      '<div style="margin-left:12px;text-align:right;flex-shrink:0;">' +
        '<div style="font-size:13px;font-weight:900;color:#FFD700;">+' + tier.pts.toLocaleString() + "</div>" +
        '<div style="font-size:10px;color:rgba(255,255,255,0.3);">pts</div>' +
        (isClaimed ? '<div style="font-size:13px;color:#00FF88;margin-top:2px;">✅</div>' : "") +
      "</div>" +
    "</div>";
  });

  html += "</div>";
  return html;
}

// ====== Open AirDrop ======
var _airdropTab = 'main';

// ====== AIRDROP LOCK & COUNTDOWN ======
var AIRDROP_LOCKED = false; // غيّرها لـ false عند الإطلاق
var AIRDROP_DATE = new Date('2027-06-06T10:00:00Z'); // 12:00 ظهراً بتوقيت ألمانيا

function openAirdrop() {
  tryShowPassiveAd();
  if(AIRDROP_LOCKED) {
    _showAirdropCountdown();
    return;
  }
  var old = document.getElementById('airdropOverlay');
  if(old) old.remove();
  trackDailySession();
  getDailyRecStart();
  var score = calcAirdropScore();
  if(tgUser) {
    fetch('/api/user/airdrop-score',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({telegramId:tgUser.id,airdropScore:score})}).catch(function(){});
  }
  _renderAirdrop(score);
}

function _showAirdropCountdown() {
  var old = document.getElementById('airdropOverlay');
  if(old) old.remove();

  var ol = document.createElement('div');
  ol.id = 'airdropOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:#0a0a12;z-index:9000;display:flex;flex-direction:column;overflow:hidden;';

  ol.innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;">' +
      '<button onclick="document.getElementById(\'airdropOverlay\').remove()" style="background:rgba(255,255,255,0.08);border:none;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px;">←</button>' +
      '<span style="font-family:Orbitron,sans-serif;font-size:16px;font-weight:900;color:#FFD700;">🪂 AirDrop</span>' +
    '</div>' +
    '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;">' +
      '<div style="font-size:64px;margin-bottom:16px;">🪂</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:13px;color:rgba(255,255,255,0.4);letter-spacing:2px;margin-bottom:8px;">' + t('airdropPrizePool','TOTAL PRIZE POOL') + '</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:38px;font-weight:900;color:#FFD700;margin-bottom:4px;">1,000,000,000</div>' +
      '<div style="font-size:14px;color:rgba(255,215,0,0.5);margin-bottom:28px;">REC</div>' +
      '<div style="font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:16px;">' + t('airdropCountdownLabel','Distribution starts in') + '</div>' +
      '<div id="airdropCountdownBox" style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;width:100%;max-width:340px;margin-bottom:24px;"></div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,0.25);">06 يونيو 2027 — 12:00 ظهراً بتوقيت ألمانيا</div>' +
    '</div>';

  document.body.appendChild(ol);
  _startCountdown();
}

function _startCountdown() {
  function update() {
    var box = document.getElementById('airdropCountdownBox');
    if(!box) return;
    var now = new Date();
    var diff = AIRDROP_DATE - now;
    if(diff <= 0) {
      box.innerHTML = '<div style="grid-column:1/-1;color:#00FF88;font-size:16px;font-weight:900;">🎉 AirDrop Started!</div>';
      return;
    }
    var totalSec = Math.floor(diff / 1000);
    var months  = Math.floor(totalSec / (30.44 * 86400));
    var weeks   = Math.floor((totalSec % (30.44 * 86400)) / (7 * 86400));
    var days    = Math.floor((totalSec % (7 * 86400)) / 86400);
    var hours   = Math.floor((totalSec % 86400) / 3600);
    var mins    = Math.floor((totalSec % 3600) / 60);
    var secs    = totalSec % 60;

    function unit(val, label) {
      return '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:10px;padding:10px 4px;">' +
        '<div style="font-family:Orbitron,monospace;font-size:18px;font-weight:900;color:#FFD700;">' + String(val).padStart(2,'0') + '</div>' +
        '<div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:3px;">' + label + '</div>' +
      '</div>';
    }

    box.innerHTML =
      unit(months,'MON') + unit(weeks,'WKS') + unit(days,'DAYS') +
      unit(hours,'HRS') + unit(mins,'MIN') + unit(secs,'SEC');
  }
  update();
  if(window._countdownTimer) clearInterval(window._countdownTimer);
  window._countdownTimer = setInterval(update, 1000);
}



function _renderAirdrop(score) {
  var ol = document.createElement('div');
  ol.id = 'airdropOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:#0a0a12;z-index:9000;display:flex;flex-direction:column;overflow:hidden;';

  ol.innerHTML =
    // Header
    '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;">' +
      '<button onclick="document.getElementById(\'airdropOverlay\').remove()" style="background:rgba(255,255,255,0.08);border:none;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px;flex-shrink:0;">←</button>' +
      '<span style="font-family:Orbitron,sans-serif;font-size:16px;font-weight:900;color:#FFD700;">🪂 AirDrop</span>' +
    '</div>' +
    // Tabs
    '<div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;">' +
      '<button onclick="switchAirdropTab(\'main\')" id="adTab_main" style="flex:1;padding:12px 4px;background:transparent;border:none;border-bottom:2px solid #FFD700;color:#FFD700;font-size:12px;font-weight:700;cursor:pointer;">🪂 AirDrop</button>' +
      '<button onclick="switchAirdropTab(\'tasks\')" id="adTab_tasks" style="flex:1;padding:12px 4px;background:transparent;border:none;border-bottom:2px solid transparent;color:rgba(255,255,255,0.4);font-size:12px;font-weight:700;cursor:pointer;">📋 Tasks</button>' +
      '<button onclick="switchAirdropTab(\'faq\')" id="adTab_faq" style="flex:1;padding:12px 4px;background:transparent;border:none;border-bottom:2px solid transparent;color:rgba(255,255,255,0.4);font-size:12px;font-weight:700;cursor:pointer;">❓ FAQ</button>' +
    '</div>' +
    '<div id="airdropContent" style="flex:1;overflow-y:auto;padding:16px;">' +
      _tabMain() + _tabTasks() + _tabFaq(score) +
    '</div>';

  document.body.appendChild(ol);
  // Start inner countdown
  _startInnerCountdown();
  // Load leaderboard
  setTimeout(_loadAirdropLeaderboard, 300);
}

function _startInnerCountdown() {
  function update() {
    var box = document.getElementById('airdropInnerCountdown');
    if(!box) return;
    var diff = AIRDROP_DATE - new Date();
    if(diff <= 0) { box.innerHTML = '<div style="grid-column:1/-1;color:#00FF88;font-size:14px;font-weight:900;text-align:center;">' + t('airdropLive','🎉 AirDrop Live!') + '</div>'; return; }
    var s = Math.floor(diff/1000);
    var mo=Math.floor(s/(30.44*86400)), wk=Math.floor((s%(30.44*86400))/(7*86400));
    var dd=Math.floor((s%(7*86400))/86400), hh=Math.floor((s%86400)/3600);
    var mm=Math.floor((s%3600)/60), ss=s%60;
    function u(v,l){ return '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);border-radius:8px;padding:8px 4px;text-align:center;"><div style="font-family:Orbitron,monospace;font-size:16px;font-weight:900;color:#FFD700;">'+String(v).padStart(2,'0')+'</div><div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:3px;">'+l+'</div></div>'; }
    box.innerHTML = u(mo,'MO')+u(wk,'WK')+u(dd,'DD')+u(hh,'HR')+u(mm,'MN')+u(ss,'SC');
  }
  update();
  if(window._innerTimer) clearInterval(window._innerTimer);
  window._innerTimer = setInterval(update, 1000);
}

function _tabMain() {
  return '<div id="adSection_main">' +
    '<div style="text-align:center;padding:24px 0 16px;">' +
      '<div style="font-size:48px;margin-bottom:10px;">🪂</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:2px;margin-bottom:6px;">' + t('airdropPrizePool','TOTAL PRIZE POOL') + '</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:36px;font-weight:900;color:#FFD700;">1,000,000,000</div>' +
      '<div style="font-size:14px;color:rgba(255,215,0,0.5);margin-bottom:16px;">REC</div>' +
      '<div id="airdropInnerCountdown" style="display:grid;grid-template-columns:repeat(6,1fr);gap:5px;max-width:340px;margin:0 auto 8px;"></div>' +
    '</div>' +
    '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);margin-bottom:10px;letter-spacing:1px;">' + t('airdropTopMinersLabel','🏆 TOP MINERS') + '</div>' +
    '<div id="airdropLeaderboard"><div style="text-align:center;padding:20px;color:rgba(255,255,255,0.2);font-size:12px;">⏳ Loading...</div></div>' +
  '</div>';
}

function _tabTasks() {
  var cards = getDailyCards();
  var dailyRec = getDailyRecEarned();
  var refs = typeof refCount !== 'undefined' ? refCount : 0;

  // Next reset time
  var now = new Date();
  var nextReset = new Date(now);
  nextReset.setDate(nextReset.getDate() + (3 - (Math.floor(Date.now()/86400000) % 3)));
  nextReset.setHours(0,0,0,0);
  var diffH = Math.ceil((nextReset - now) / 3600000);

  function progressBar(val, max, color) {
    var pct = Math.min(100, Math.floor(val/max*100));
    return '<div style="background:rgba(255,255,255,0.06);border-radius:6px;height:6px;margin-top:8px;">' +
      '<div style="background:'+color+';width:'+pct+'%;height:6px;border-radius:6px;transition:width 0.3s;"></div></div>';
  }

  function taskCard(icon, title, milestones, currentVal, unit, color, durationLabel) {
    var html = '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-bottom:12px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span style="font-size:26px;">' + icon + '</span>' +
          '<div><div style="font-size:13px;font-weight:700;color:white;">' + title + '</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:2px;">' + durationLabel + '</div></div>' +
        '</div>' +
      '</div>';

    milestones.forEach(function(m) {
      var done = currentVal >= m.req;
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba('+(done?'0,255,136':'255,255,255')+',0.04);border:1px solid rgba('+(done?'0,255,136':'255,255,255')+',' + (done?'0.2':'0.06') + ');border-radius:10px;margin-bottom:6px;">' +
        '<div style="flex:1;">' +
          '<div style="font-size:12px;color:rgba(255,255,255,0.6);">' + m.label + '</div>' +
          progressBar(currentVal, m.req, done ? '#00FF88' : color) +
          '<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:4px;">' + Math.min(currentVal,m.req).toLocaleString() + ' / ' + m.req.toLocaleString() + ' ' + unit + '</div>' +
        '</div>' +
        '<div style="margin-left:12px;text-align:right;flex-shrink:0;">' +
          '<div style="font-size:13px;font-weight:900;color:#FFD700;">+' + m.pts.toLocaleString() + '</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,0.3);">pts</div>' +
          (done ? '<div style="font-size:12px;color:#00FF88;margin-top:2px;">✅</div>' : '') +
        '</div>' +
      '</div>';
    });

    html += '</div>';
    return html;
  }

  var html = '<div id="adSection_tasks" style="display:none;">';

  // Timer
  html += '<div style="text-align:center;background:rgba(255,68,0,0.08);border:1px solid rgba(255,68,0,0.2);border-radius:10px;padding:8px;margin-bottom:14px;font-size:12px;color:rgba(255,255,255,0.5);">🔄 ' + t('airdropDayTimer','New cards in') + ' <span style="color:#FF8800;font-weight:700;">' + diffH + 'h</span></div>';

  // 3 Card tasks
  cards.forEach(function(card) {
    var lvl = getCardLevel(card.key);
    html += taskCard(card.emoji, 'Upgrade ' + card.name,
      [{req:20,label:t('airdropReachLvl','Reach Level')+' 20',pts:50},{req:40,label:t('airdropReachLvl','Reach Level')+' 40',pts:100},{req:70,label:t('airdropReachLvl','Reach Level')+' 70',pts:1000}],
      lvl, 'LVL', '#00AAFF', t('airdropDayChallenge','3-day challenge'));
  });

  // REC task
  html += taskCard('🟢', t('airdropCollectRecToday','Collect REC Today'),
    [{req:500,label:t('airdropCollectLabel','Collect {n} REC').replace('{n}','500'),pts:50},{req:1500,label:t('airdropCollectLabel','Collect {n} REC').replace('{n}','1,500'),pts:200},{req:2500,label:t('airdropCollectLabel','Collect {n} REC').replace('{n}','2,500'),pts:500},{req:5000,label:t('airdropCollectLabel','Collect {n} REC').replace('{n}','5,000'),pts:1500},{req:10000,label:t('airdropCollectLabel','Collect {n} REC').replace('{n}','10,000'),pts:5000}],
    Math.floor(dailyRec), 'REC', '#00FF88', t('airdropDailyReset','Resets daily at midnight'));

  // Referral tasks
  html += taskCard('👥', t('airdropInviteFriends','Invite Friends'),
    [{req:10,label:t('airdropInviteLabel','Invite {n} friends').replace('{n}','10'),pts:500},{req:20,label:t('airdropInviteLabel','Invite {n} friends').replace('{n}','20'),pts:2000},{req:50,label:t('airdropInviteLabel','Invite {n} friends').replace('{n}','50'),pts:5000}],
    refs, 'friends', '#FF8800', t('airdropTotalReferrals','Total referrals'));

  // Ads Watching Task — 2-day period system
  html += renderAdsTaskCard();

  // 4 Coming Soon (was 5)
  ['🏆','💎','🌍','🔥'].forEach(function(icon) {
    html += '<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:14px;padding:14px;margin-bottom:10px;display:flex;align-items:center;gap:12px;opacity:0.5;">' +
      '<span style="font-size:28px;">' + icon + '</span>' +
      '<div><div style="font-size:13px;color:rgba(255,255,255,0.5);">' + t('airdropComingSoon','Coming Soon') + '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:2px;">🔒 Stay tuned</div></div>' +
    '</div>';
  });

  html += '</div>';
  return html;
}

function _tabFaq(score) {
  var loginDays = typeof dailyLogin !== 'undefined' ? (dailyLogin.day||0) : 0;
  var activeDays = getTotalActiveDays();
  var recBal = typeof rec !== 'undefined' ? rec : 0;
  var lvl = (typeof calcPlayerLevel==='function' && typeof playerXP!=='undefined') ? calcPlayerLevel(playerXP) : 0;
  var cardSum = typeof cardLevels !== 'undefined' ? Object.values(cardLevels).reduce(function(s,v){return s+(v||0);},0) : 0;
  var tasks = typeof completedTasks !== 'undefined' ? completedTasks.length : 0;
  var refs = typeof refCount !== 'undefined' ? refCount : 0;
  var tasksBonus = calcDailyTasksScore();
  var adsTaskPts = calcAdsTaskScore();
  var adsState2 = (typeof getAdsTaskState === 'function') ? getAdsTaskState() : {claimedTiers:[]};
  var adsClaimedCount = adsState2.claimedTiers.length;

  function row(icon, label, val, pts) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span style="font-size:18px;">' + icon + '</span>' +
        '<div><div style="font-size:12px;color:rgba(255,255,255,0.8);">' + label + '</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.35);">' + val + '</div></div>' +
      '</div>' +
      '<div style="font-size:13px;font-weight:900;color:#FFD700;">+' + pts.toLocaleString() + '</div>' +
    '</div>';
  }

  return '<div id="adSection_faq" style="display:none;">' +
    '<div style="background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,165,0,0.05));border:1px solid rgba(255,215,0,0.3);border-radius:14px;padding:18px;margin-bottom:16px;text-align:center;">' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:6px;">' + t('airdropTotalScore','YOUR TOTAL SCORE') + '</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:42px;font-weight:900;color:#FFD700;">' + score.toLocaleString() + '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;">' + t('airdropPointsUnit','pts') + '</div>' +
    '</div>' +
    '<div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:12px 14px;margin-bottom:16px;">' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:6px;">' + t('airdropScoreBreakdown','SCORE BREAKDOWN') + '</div>' +
      row('📅',t('airdropDailyLoginDays','Daily Login Days'), loginDays+' '+t('airdropDays','days'), Math.min(500, loginDays*10)) +
      row('📱',t('airdropActiveDaysLabel','Active Days'), activeDays+' '+t('airdropDays','days'), Math.min(300, activeDays*10)) +
      row('🟢',t('airdropRecBalanceLabel','REC Balance'), recBal.toFixed(2)+' REC', Math.min(2000,Math.floor(Math.log10(recBal+1)*400))) +
      row('🏆',t('airdropLevelLabel','Level'),'LVL '+lvl, lvl*10) +
      row('🃏',t('airdropCardLevelsLabel','Card Levels Sum'), cardSum.toLocaleString(), Math.min(1500, cardSum*2)) +
      row('✅',t('airdropTasksDoneLabel','Tasks Done'), tasks+' '+t('airdropTasksUnit','tasks'), Math.min(300, tasks*15)) +
      row('👥',t('airdropReferralsLabel','Referrals'), refs+' '+t('airdropFriendsUnit','friends'), Math.min(500, refs*50)) +
      row('🎯',t('airdropDailyBonusLabel','Daily Tasks Bonus'),t('airdropCompletedTasks','Completed tasks'), tasksBonus) +
      row('📺',t('airdropWatchAdsFaqLabel','Watch Ads Task'), adsClaimedCount + '/3 ' + t('airdropWatchAdsFaqSub','tiers'), adsTaskPts) +
    '</div>' +
    '<div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:14px;">' +
      '<div style="font-size:13px;font-weight:700;color:#FFD700;margin-bottom:10px;">' + t('airdropRules','📜 AirDrop Terms & Conditions') + '</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:2.2;">' +
        t('airdropTerm1','• Min 5 tasks daily') + '<br>' +
        t('airdropTerm2','• Active 7+ days') + '<br>' +
        t('airdropTerm3','• No fake accounts or bots') + '<br>' +
        t('airdropTerm4','• Distribution by relative points') + '<br>' +
        t('airdropTerm5','• Admin may exclude suspicious accounts') + '<br>' +
        t('airdropTerm6','• Results announced at launch') + '<br>' +
        t('airdropTerm7','• TON network only') + '<br>' +
        t('airdropTerm8','• No point transfers') + '<br>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function switchAirdropTab(tab) {
  _airdropTab = tab;
  ['main','tasks','faq'].forEach(function(t) {
    var sec = document.getElementById('adSection_'+t);
    var btn = document.getElementById('adTab_'+t);
    if(sec) sec.style.display = t===tab ? 'block' : 'none';
    if(btn) {
      btn.style.color = t===tab ? '#FFD700' : 'rgba(255,255,255,0.4)';
      btn.style.borderBottom = t===tab ? '2px solid #FFD700' : '2px solid transparent';
    }
  });
}

setTimeout(function(){ if(typeof trackDailySession==='function') trackDailySession(); }, 2000);

// ====== HOME PAGE COUNTDOWN ======
function startHomeCountdown() {
  if(window._homeTimerRunning) return;
  window._homeTimerRunning = true;
  function update() {
    var box = document.getElementById('homeCountdown');
    if(!box) { window._homeTimerRunning = false; clearInterval(window._homeTimer); return; }
    var diff = AIRDROP_DATE - new Date();
    if(diff <= 0) { box.innerHTML = '<div style="grid-column:1/-1;color:#00FF88;font-size:12px;text-align:center;">' + t('airdropLive','🎉 AirDrop Live!') + '</div>'; return; }
    var s = Math.floor(diff/1000);
    var mo=Math.floor(s/(30.44*86400)), wk=Math.floor((s%(30.44*86400))/(7*86400));
    var dd=Math.floor((s%(7*86400))/86400), hh=Math.floor((s%86400)/3600);
    var mm=Math.floor((s%3600)/60), ss=s%60;
    function u(v,l){ return '<div style="direction:ltr;background:rgba(0,180,255,0.1);border:1px solid rgba(0,180,255,0.2);border-radius:6px;padding:4px 2px;text-align:center;"><div style="font-family:Orbitron,monospace;font-size:13px;font-weight:900;color:#00AAFF;">'+String(v).padStart(2,'0')+'</div><div style="font-size:8px;color:rgba(255,255,255,0.3);margin-top:1px;">'+l+'</div></div>'; }
    box.innerHTML = u(mo,'MO')+u(wk,'WK')+u(dd,'DD')+u(hh,'HR')+u(mm,'MN')+u(ss,'SC');
  }
  update();
  if(window._homeTimer) clearInterval(window._homeTimer);
  window._homeTimer = setInterval(update, 1000);
}
setTimeout(startHomeCountdown, 500);

// ====== AIRDROP LEADERBOARD ======
function _loadAirdropLeaderboard() {
  if(!window.tgUser) return;
  fetch('/api/leaderboard/airdrop')
    .then(function(r){ return r.json(); })
    .then(function(data) {
      var box = document.getElementById('airdropLeaderboard');
      if(!box || !data || !data.length) return;
      var myId = tgUser.id;
      box.innerHTML = data.map(function(u, i) {
        var isMe = u.telegramId === myId;
        var medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':('#'+(i+1));
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:rgba('+(isMe?'0,180,255':'255,255,255')+','+(isMe?'0.08':'0.02')+');border:1px solid rgba('+(isMe?'0,180,255':'255,255,255')+','+(isMe?'0.2':'0.05')+');border-radius:10px;margin-bottom:6px;">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<div style="font-size:'+(i<3?'20':'14')+'px;width:28px;text-align:center;font-weight:900;color:'+(isMe?'#00AAFF':'rgba(255,255,255,0.5)')+';">'+medal+'</div>' +
            '<div>' +
              '<div style="font-size:13px;font-weight:700;color:'+(isMe?'#00AAFF':'white')+';">'+(u.username?'@'+u.username:u.firstName||'Miner')+'</div>' +
            '</div>' +
          '</div>' +
          '<div style="font-size:14px;font-weight:900;color:#FFD700;">'+u.airdropScore.toLocaleString()+' <span style="font-size:10px;color:rgba(255,255,255,0.3);">pts</span></div>' +
        '</div>';
      }).join('');
    }).catch(function(){});
}
