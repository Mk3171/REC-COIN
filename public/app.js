// ====== CORE: Formulas + Data + UI + Intervals + Init ======
// ====== CARD MINING FORMULAS ======
// RECORD/s per card level (level 1=100, level 100=1,000,000)
function cardRecordSpeed(lvl){
  if(lvl<=0)return 0;
  return 100*Math.pow(10000,(lvl-1)/99);
}
// REC/s per card level (level 1=0.0000001, level 100=0.0001) — sustainable 40+ years
function cardRECSpeed(lvl){
  if(lvl<=0)return 0;
  return 0.0000001*Math.pow(1000,(lvl-1)/99);
}
// RECORD cost to upgrade from current level
// Level 0→1: 10K | Level 50: 110M | Level 75: 11.5B | Level 99→100: 1T
function cardCost(lvl, isLimited, isVip2){
  if(isVip2) return Math.floor(500000*Math.pow(9e9,lvl/99));
  if(isLimited) return Math.floor(100000*Math.pow(9e9,lvl/99));
  return Math.floor(10000*Math.pow(1e10,lvl/99));
}
// Wait time to upgrade — Level 0: 1min | Level 50: 3h | Level 75: 2d | Level 99: 30d
function cardWait(lvl){
  return Math.floor(60*Math.pow(43200,lvl/99));
}
function formatWait(sec){
  if(sec<60)return sec+'s';
  if(sec<3600)return Math.floor(sec/60)+'m '+Math.floor(sec%60)+'s';
  if(sec<86400)return Math.floor(sec/3600)+'h '+Math.floor((sec%3600)/60)+'m';
  return Math.floor(sec/86400)+'d '+Math.floor((sec%86400)/3600)+'h';
}

var recordPerSec=0, recPerSec=0;
var weeklyEndMs = 0;
function getLimitedMulti(key){ return parseInt(key.split('_')[0])===4 ? 3 : 1; }
// VIP2 cards (cat 5): REC only, 5 REC/s at level 100, no RECORD
function vipCardRECSpeed(lvl){
  if(lvl<=0) return 0;
  return 0.0005 * Math.pow(10000,(lvl-1)/99); // lvl1=0.0005, lvl100=5
}
// VIP2 card cost (expensive: 5x Limited)
function vipCardCost(lvl){
  return Math.floor(500000*Math.pow(9e9,lvl/99));
}
function calcTotalSpeeds(){
  recordPerSec=0; recPerSec=0;
  Object.keys(cardLevels).forEach(function(key){
    var lvl=cardLevels[key]||0;
    var ci=parseInt(key.split('_')[0]);
    if(ci===5){
      // VIP2: REC only, no RECORD
      recPerSec+=vipCardRECSpeed(lvl);
    } else {
      var m=getLimitedMulti(key);
      recordPerSec+=cardRecordSpeed(lvl)*m;
      recPerSec+=cardRECSpeed(lvl)*m;
    }
  });
}

// ====== DATA ======
var tgUser = null;
try { var _tgWA = window.Telegram && window.Telegram.WebApp; tgUser = _tgWA && _tgWA.initDataUnsafe && _tgWA.initDataUnsafe.user ? _tgWA.initDataUnsafe.user : null; } catch(e){}
// Show admin button only for admin
if(tgUser && String(tgUser.id) === '6995765586') {
  document.addEventListener('DOMContentLoaded', function() {
    var ab = document.getElementById('adminBtn');
    if(ab) ab.style.display = '';
  });
}
// Read referral from deep link start_param
var _startRef = '';
try {
  var _sp = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.start_param;
  if (_sp && _sp.startsWith('ref')) _startRef = _sp.replace('ref','');
} catch(e){}
var saveKey = 'recmining_' + (tgUser ? tgUser.id : 'guest');

// Migration: if no data under correct key, check old keys
(function(){
  try {
    if(!localStorage.getItem(saveKey)) {
      var oldKeys = ['recmining_undefined', 'recmining_guest', 'recmining_null'];
      for(var i=0; i<oldKeys.length; i++){
        var old = localStorage.getItem(oldKeys[i]);
        if(old) {
          localStorage.setItem(saveKey, old);
          localStorage.removeItem(oldKeys[i]);
          break;
        }
      }
    }
  } catch(e){}
})();

var defaultData={record:0,rec:0,energy:1000,maxEnergy:1000,
  tapLevelVal:0,energyLevelVal:0,tapPowerVal:1,
  completedTasks:[],cardLevels:{},cardUpgrades:{},refCount:0,claimedMilest:[],
  dailyLogin:{day:0,lastDate:''},mysteryLastDate:'',
  dailyTasksData:{date:'',done:[],taps:0,upgrades:0,spent:0,sideDaily:'每日',sideRank:'排名',sideGames:'游戏',sideCombo:'组合',sideUpgrade:'升级',sideShop:'商店',navGames:'游戏',navWallet:'钱包',qbTasks:'任务',qbExchange:'兑换',qbSwap:'交换',recordLabel:'记录',recLabel:'REC',energyFull:'满能量',walletTitle:'钱包',walletId:'ID',comboTitle:'每日组合',comboSubtitle:'升级3张每日卡片并获得奖励！',comboReward:'每日奖励',comboClaim:'领取 +5 REC 🎉',comboClaimed:'✅ 今天已领取奖励！'},
  cardTasksClaimed:[],totalTaps:0};
var G=Object.assign({},defaultData);
try{var ls=JSON.parse(localStorage.getItem(saveKey));if(ls)G=Object.assign({},defaultData,ls);}catch(e){}

var record,rec,energy,maxEnergy,tapLevelVal,energyLevelVal,tapPowerVal,
    completedTasks,cardLevels,cardUpgrades,refCount,claimedMilest,
    dailyLogin,mysteryLastDate,dailyTasksData,cardTasksClaimed,totalTaps;
var vipData = {tier:0, expiry:0, boxes:{}, boost:null, hasEpicCard:false, epicExpiry:0};
var nftBoost = 1;
var nftType = '';

function applyData(d){
  record=d.record||0; rec=d.rec||0;
  energy=d.energy!==undefined?d.energy:1000; maxEnergy=d.maxEnergy||1000;
  tapLevelVal=d.tapLevelVal||0; energyLevelVal=d.energyLevelVal||0;
  tapPowerVal=tapLevelVal===0?1:Math.floor(Math.pow(25100000,tapLevelVal/100));
  maxEnergy=energyLevelVal>0?Math.floor(1000*Math.pow(10000,energyLevelVal/99)):d.maxEnergy||1000;
  completedTasks=d.completedTasks||[]; cardLevels=d.cardLevels||{};
  cardUpgrades=d.cardUpgrades||{}; refCount=d.refCount||0;
  claimedMilest=d.claimedMilest||[];
  dailyLogin=d.dailyLogin||{day:0,lastDate:''};
  mysteryLastDate=d.mysteryLastDate||'';
  dailyTasksData=d.dailyTasksData||{date:'',done:[],taps:0,upgrades:0,spent:0};
  cardTasksClaimed=d.cardTasksClaimed||[];
  totalTaps=d.totalTaps||0;
  // vipData
  if(d.vip && d.vip.tier > 0) {
    vipData = d.vip;
    vipData.boxes = vipData.boxes || {};
  } else if(d.vipData && d.vipData.tier > 0) {
    vipData = d.vipData;
    vipData.boxes = vipData.boxes || {};
  }
  // refillData — 3 فرص يومية لتعبئة الطاقة
  var _today=getTodayStr();
  if(d.refillData && d.refillData.date===_today){
    window.refillData=d.refillData;
  } else {
    var initMax = (vipData && parseInt(vipData.tier||0) >= 1 && parseInt(vipData.expiry||0) > Date.now()) ? 6 : 3;
    window.refillData={date:_today,count:initMax};
  }
  calcTotalSpeeds();
  // Load XP data
  if(d.playerXP !== undefined && typeof playerXP !== 'undefined') {
    playerXP = d.playerXP || 0;
    xpRetroCalculated = playerXP > 0;
  }
  // Only load claimedLevels if levelsVersion matches (v2 = manual claim system)
  if(d.claimedLevels && d.levelsVersion === 2 && typeof claimedLevels !== 'undefined') {
    claimedLevels = d.claimedLevels;
  }
}
try { applyData(G); } catch(e) { console.log('applyData error:', e); applyData(defaultData); }

// CloudStorage loaded in loadAndInit()

function saveData(immediate){
  var d=JSON.stringify({record,rec,energy,maxEnergy,tapLevelVal,energyLevelVal,tapPowerVal,
    completedTasks,cardLevels,cardUpgrades,refCount,claimedMilest,
    dailyLogin,mysteryLastDate,dailyTasksData,cardTasksClaimed,totalTaps,
    refillData:window.refillData,vip:vipData,
    miningSpeed: recPerSec,
    recordMiningSpeed: recordPerSec,
    lastSaveTime:Date.now(),
    playerXP:(typeof playerXP!=='undefined'?playerXP:0),
    claimedLevels:(typeof claimedLevels!=='undefined'?claimedLevels:{}),
    levelsVersion:2});
  try{localStorage.setItem(saveKey,d);}catch(e){}
  if(CS){try{CS.setItem('gameData',d);}catch(e){}}
  if(immediate){
    // Save to server immediately (for upgrades/purchases)
    saveToServer();
  } else {
    // Debounced save for routine updates (mining)
    clearTimeout(window._saveTimer);
    window._saveTimer = setTimeout(function(){ saveToServer(); }, 15000);
  }
}

function saveToServer(){
  if(!tgUser) return;
  try {
    var initData = '';
    try { initData = window.Telegram.WebApp.initData || ''; } catch(e){}
    fetch('/api/user/save', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        telegramId: tgUser.id,
        initData: initData,
        startRef: _startRef || '',
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        record, rec, energy, maxEnergy,
        tapLevelVal, energyLevelVal, tapPowerVal,
        completedTasks, cardLevels, cardUpgrades,
        refCount, claimedMilest,
        dailyLogin, mysteryLastDate, dailyTasksData, cardTasksClaimed, totalTaps,
        miningSpeed: recPerSec,
        recordMiningSpeed: recordPerSec,
        refillData: window.refillData,
        vip: vipData,
        language: (typeof currentLang !== 'undefined' ? currentLang : 'en'),
        playerXP: (typeof playerXP!=='undefined'?playerXP:0),
        claimedLevels: (typeof claimedLevels!=='undefined'?claimedLevels:{})
      })
    }).then(function(r){ return r.json(); })
    .then(function(data){
      if(data.error === 'banned') {
        // Auto-unban if admin
        if(tgUser && String(tgUser.id) === '6995765586'){
          fetch('/api/admin/self-unban',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId:tgUser.id})})
          .then(function(){
            // Also unban all wrongly banned users
            fetch('/api/admin/unban-all',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({adminId:tgUser.id})})
            .then(function(r){return r.json();})
            .then(function(d){ console.log('Mass unban:', d.unbanned, 'users'); });
            setTimeout(function(){ window.location.reload(); },1500);
          });
          return;
        }
        // Show ban message
        document.body.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:white;text-align:center;padding:20px;">' +
          '<div style="font-size:60px;margin-bottom:20px;">🚫</div>' +
          '<div style="font-size:22px;font-weight:bold;color:#FF0000;margin-bottom:10px;">تم حظر حسابك</div>' +
          '<div style="color:#aaa;font-size:14px;">Account Banned</div>' +
          '<div style="color:#555;font-size:12px;margin-top:10px;">' + (data.reason||'violation') + '</div>' +
        '</div>';
      }
    }).catch(function(){});
  } catch(e){}
}

function loadFromServer(callback){
  if(!tgUser){ callback(null); return; }
  fetch('/api/user/' + tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(res){
      if(res.exists && res.data){
        // Check if server has more REC than local (block reward received while offline)
        var localRec = rec || 0;
        var serverRec = res.data.rec || 0;
        var recDiff = serverRec - localRec;

        // Merge new fields from localStorage
        try{
          var ls=JSON.parse(localStorage.getItem(saveKey));
          if(ls){
            if(!res.data.dailyLogin && ls.dailyLogin) res.data.dailyLogin=ls.dailyLogin;
            if(!res.data.mysteryLastDate && ls.mysteryLastDate) res.data.mysteryLastDate=ls.mysteryLastDate;
            if(!res.data.dailyTasksData && ls.dailyTasksData) res.data.dailyTasksData=ls.dailyTasksData;
            if(!res.data.cardTasksClaimed && ls.cardTasksClaimed) res.data.cardTasksClaimed=ls.cardTasksClaimed;
            if(!res.data.totalTaps && ls.totalTaps) res.data.totalTaps=ls.totalTaps;
            if(ls.vipData && ls.vipData.tier > 0) res.data.vip=ls.vipData;
          }
        }catch(e){}

        callback(res.data);
      } else { callback(null); }
    })
    .catch(function(){ callback(null); });
}

// ====== TOAST ======
function showToast(msg){
  var toast=document.getElementById('toast-msg');
  if(!toast){toast=document.createElement('div');toast.id='toast-msg';
    toast.style.cssText='position:fixed;bottom:75px;left:50%;transform:translateX(-50%);background:rgba(20,20,20,0.97);color:white;padding:10px 22px;border-radius:20px;font-size:14px;z-index:9999;border:1px solid #444;pointer-events:none;opacity:0;transition:opacity 0.25s;white-space:nowrap;max-width:90vw;text-align:center;';
    document.body.appendChild(toast);}
  toast.textContent=msg; toast.style.opacity='1';
  clearTimeout(toast._t);
  toast._t=setTimeout(function(){toast.style.opacity='0';},2500);
}

// ====== NAV ======
function openGames(){
  var old=document.getElementById('gamesHubOverlay');if(old)old.remove();
  var ov=document.createElement('div');ov.id='gamesHubOverlay';
  ov.style.cssText='position:fixed;inset:0;z-index:99999;background:#000 url(games-bg.jpeg) center/cover no-repeat;overflow-y:auto;';
  var hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;gap:12px;padding:14px 16px 10px;background:rgba(0,0,0,0.7);position:sticky;top:0;z-index:10;border-bottom:1px solid rgba(255,255,255,0.07);';
  var bk=document.createElement('button');bk.textContent='← Back';
  bk.style.cssText='background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:white;padding:7px 14px;border-radius:10px;font-size:13px;cursor:pointer;';
  bk.onclick=function(){ov.remove();};
  var ttl=document.createElement('div');ttl.textContent='🎮 GAMES';
  ttl.style.cssText='flex:1;text-align:center;font-family:Orbitron,sans-serif;font-size:16px;font-weight:900;color:#FF6644;';
  hdr.appendChild(bk);hdr.appendChild(ttl);hdr.appendChild(document.createElement('div'));
  ov.appendChild(hdr);
  var cnt=document.createElement('div');cnt.style.cssText='padding:16px;';
  var cat=document.createElement('div');cat.className='games-cat-header';
  cat.innerHTML='<span class="games-cat-dot"></span><span class="games-cat-title">🕹️ Classic Game</span>';
  cnt.appendChild(cat);
  var grid=document.createElement('div');grid.className='games-grid';
  var c1=document.createElement('div');c1.className='game-card';c1.onclick=function(){openGameFromHub('rec-catch');};
  c1.innerHTML='<div class="game-card-thumb" style="overflow:hidden;padding:0;"><img src="rec-catch-thumb.jpeg" style="width:100%;height:100%;object-fit:cover;"></div><div class="game-card-name">REC Catch</div>';
  var c2=document.createElement('div');c2.className='game-card';c2.onclick=function(){openGameFromHub('super-rec');};
  c2.innerHTML='<div class="game-card-thumb" style="overflow:hidden;padding:0;"><img src="super-rec-thumb.jpeg" style="width:100%;height:100%;object-fit:cover;"></div><div class="game-card-name">Super REC</div>';
  grid.appendChild(c1);grid.appendChild(c2);
  for(var i=0;i<2;i++){var cs=document.createElement('div');cs.className='game-card coming-soon';cs.innerHTML='<div class="game-card-thumb"><span style="font-size:36px;opacity:0.3;">🔒</span></div><div class="game-card-name" style="color:rgba(255,255,255,0.2);">Coming Soon</div>';grid.appendChild(cs);}
  cnt.appendChild(grid);ov.appendChild(cnt);document.body.appendChild(ov);
}

function openGameFromHub(gameId){
  var games={'rec-catch':'/games.html','super-rec':'/game2.html'};
  var url=games[gameId];if(!url)return;
  var ov=document.createElement('div');ov.id='gameplayOverlay';
  ov.style.cssText='position:fixed;inset:0;z-index:999999;background:#000;';
  var cb=document.createElement('button');cb.textContent='✕ Back';
  cb.style.cssText='position:absolute;top:10px;right:10px;z-index:100000;background:rgba(0,0,0,0.8);color:white;border:1px solid #333;padding:8px 14px;border-radius:8px;font-size:13px;cursor:pointer;';
  cb.onclick=function(){
    try{var iw=iframe.contentWindow;if(iw&&iw.saveRec)iw.saveRec();if(iw&&iw.saveDailyData)iw.saveDailyData();}catch(e){}
    ov.remove();
  };
  var iframe=document.createElement('iframe');iframe.src=url;
  iframe.style.cssText='width:100%;height:100%;border:none;';
  ov.appendChild(cb);ov.appendChild(iframe);document.body.appendChild(ov);
}

function openNFTPage(){
  window.location.href = '/nft.html';
}

function showPage(id,btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById(id).classList.add('active');
  if(btn) btn.classList.add('active'); closeLangMenu();
  if(id==='rank') loadLeaderboard('global');
  if(id==='profile') loadProfilePhoto();
  if(id==='cards') loadComboInCards();
}
function openUpgrade(){updateUpgradeUI();document.getElementById('upgradePage').classList.add('open');}

// إشعار البلوك عند فتح البوت (لما البلوك جاء من السيرفر وهو أوفلاين)


// ====== BLOCK MINING (Passive - based on REC mining speed) ======
// كل 3 ثواني فيه فرصة 1/2000 إن البطاقات تضرب بلوك
// يعني بالمعدل كل ~100 دقيقة لو البطاقات شغالة



// ====== HOME - TAP ======

function tap(){
  var tapCost = Math.max(1, Math.floor(maxEnergy / 1000));
  if(energy < tapCost) return; // طاقة غير كافية — توقف
  record += tapPowerVal;
  energy = Math.max(0, energy - tapCost);
  totalTaps++;
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  dailyTasksData.taps++;
  checkDailyTaskProgress();
  saveData(); updateUI();
}

// ====== CHECK UPGRADE TIMERS ======
function checkUpgradeTimers(){
  var now=Date.now(), changed=false;
  Object.keys(cardUpgrades).forEach(function(key){
    var upg=cardUpgrades[key];
    if(upg&&upg.endTime<=now){
      cardLevels[key]=upg.toLevel;
      delete cardUpgrades[key];
      changed=true;
      updateCardGridItem(key);
      var kp=key.split('_'),kci=parseInt(kp[0]),kidx=parseInt(kp[1]);
      var kcard=categories[kci]&&categories[kci].cards[kidx];
      showToast(t('toastUpgradeDone')+(kcard?' — '+getCardName(kcard):''));
    }
  });
  if(changed){calcTotalSpeeds();saveData();}
}

// Save when app is hidden/closed
document.addEventListener('visibilitychange', function() {
  if(document.visibilityState === 'hidden') {
    try { saveData(true); } catch(e){}
  }
});
window.addEventListener('pagehide', function() {
  try { saveData(true); } catch(e){}
});

// Heartbeat handled by mining.js

// ====== MAIN INTERVAL (3s) ======
setInterval(function(){
  checkUpgradeTimers();
  // ====== Boost checks ======
  var _isVip2Boost = vipData && parseInt(vipData.tier||0)>=2 && parseInt(vipData.expiry||0)>Date.now() && vipData.boost2Date===getTodayStr();
  var _isVip1Boost = vipData && parseInt(vipData.tier||0)>=1 && parseInt(vipData.expiry||0)>Date.now() && vipData.boostDate===getTodayStr();
  // ====== RECORD Mining ======
  if(recordPerSec > 0) record += recordPerSec * (_isVip2Boost ? 3 : 1) * 3;
  // ====== REC Mining ======
  if(recPerSec > 0){
    var _effectiveRec = recPerSec;
    if(_isVip2Boost) _effectiveRec *= 3;
    if(_isVip1Boost) _effectiveRec *= 1.5;
    if(nftBoost && nftBoost > 1) _effectiveRec *= nftBoost;
    rec += _effectiveRec * 3;
    // ====== Block Check ======
    if(typeof checkForBlock === 'function') checkForBlock();
  }
  // ====== Energy Recharge ======
  if(energy < maxEnergy) energy = Math.min(maxEnergy, energy + (maxEnergy/43200*3));
  saveData(); updateUI(); updateTimerDisplays();
},3000);

// 1s interval for timer countdown display
setInterval(function(){updateTimerDisplays();},1000);

function pad2(n){return n<10?'0'+n:''+n;}

function updateTimerDisplays(){
  var now=Date.now();
  Object.keys(cardUpgrades).forEach(function(key){
    var upg=cardUpgrades[key];
    var el=document.getElementById('timer_'+key);
    if(el&&upg){
      var rem=Math.max(0,Math.ceil((upg.endTime-now)/1000));
      if(rem<=0){el.textContent=t('upgradeReady');}
      else{el.textContent='⏳ '+formatWait(rem);}
    }
  });
  // Weekly countdown
  var wEl=document.getElementById('weeklyCountdown');
  if(wEl&&typeof weeklyEndMs!=='undefined'&&weeklyEndMs>0){
    var diff=Math.max(0,weeklyEndMs-now);
    var dd=Math.floor(diff/86400000);
    var hh=Math.floor((diff%86400000)/3600000);
    var mm=Math.floor((diff%3600000)/60000);
    var ss=Math.floor((diff%60000)/1000);
    wEl.textContent=pad2(dd)+'d '+pad2(hh)+'h '+pad2(mm)+'m '+pad2(ss)+'s';
  }
  // Combo timer countdown
  var cEl=document.getElementById('comboTimerCount');
  var cLbl=document.getElementById('comboTimerLabel');
  if(cEl && window._comboExpiresAt){
    var rem=Math.max(0, window._comboExpiresAt - now);
    if(rem<=0){
      cEl.style.color='#FF4444';
      cEl.textContent='00:00:00';
      if(cLbl) cLbl.textContent= window._comboIsAdmin ? t('comboAdminTimerLabel') : t('comboTimerLabel');
      // لو انتهى وفي بيانات — أعد تحميل لإخفاء الكومبو
      if(comboData && comboData.exists && !window._comboExpiredReloaded){
        window._comboExpiredReloaded = true;
        comboData.exists = false;
        renderComboSlots(comboData);
      }
    } else {
      window._comboExpiredReloaded = false;
      cEl.style.color='#FFD700';
      var h=Math.floor(rem/3600000);
      var m=Math.floor((rem%3600000)/60000);
      var s=Math.floor((rem%60000)/1000);
      cEl.textContent=pad2(h)+':'+pad2(m)+':'+pad2(s);
      if(cLbl) cLbl.textContent= window._comboIsAdmin ? t('comboAdminTimerLabel') : t('comboTimerLabel');
    }
  }
}

function updateUI(){
  var s=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  s('recordCount',Math.floor(record).toLocaleString());
  s('recordCountHome',Math.floor(record).toLocaleString());
  s('recordCardsPage',Math.floor(record).toLocaleString());
  s('recCountHome',rec.toFixed(6));
  s('recHomeBig',rec.toFixed(6));
  s('recMini',rec.toFixed(6));
  s('energyText',Math.floor(energy)+' / '+maxEnergy);
  s('profileRecord',Math.floor(record).toLocaleString());
  s('recPoolBalance',rec.toFixed(6));
  var eb=document.getElementById('energyBar');if(eb)eb.style.width=(energy/maxEnergy*100)+'%';
  // Mining speeds on home
  var recs=document.getElementById('recSpeedShow');
  var recs2=document.getElementById('recordSpeedShow');
  var _isV2B = vipData && parseInt(vipData.tier||0)>=2 && parseInt(vipData.expiry||0)>Date.now() && vipData.boost2Date===getTodayStr();
  var _isV1B = vipData && parseInt(vipData.tier||0)>=1 && parseInt(vipData.expiry||0)>Date.now() && vipData.boostDate===getTodayStr();
  var _displayRec = recPerSec * (_isV2B?3:1) * (_isV1B?1.5:1) * (nftBoost||1);
  var _displayRecord = recordPerSec * (_isV2B?3:1);
  if(recs)recs.textContent=_displayRec>0?_displayRec.toFixed(8):'0.00000000';
  if(recs2)recs2.textContent=_displayRecord>0?Math.floor(_displayRecord).toLocaleString():'0';
  // Rank
  var m=getMyMedal();
  var mrn=document.getElementById('myRankName');if(mrn){mrn.textContent=m.name;mrn.style.color=m.color;}
  s('myRankRecord',Math.floor(record).toLocaleString());
  s('refCountDisplay',refCount);
  updateInviteLinkDisplay();
  updateWalletPage();
  var commEl = document.getElementById('totalCommissionDisplay');
  if(commEl) commEl.textContent = rec.toFixed(2);
}

// ====== UPGRADE OVERLAY (tap power + energy) ======
// Tap upgrade cost: Level 1=30K, Level 100=1B
function getTapCost(l){return Math.floor(30000*Math.pow(33333,l/99));}
// Energy upgrade cost: Level 1=30K, Level 100=1B
function getEnergyCost(l){return Math.floor(30000*Math.pow(33333,l/99));}

function closeVIP() {
  showPage('home', document.getElementById('navHomeBtn'));
}

// ====== TASK TABS ======


// ====== ENERGY REFILL ======
function useEnergyRefill(){
  var today=getTodayStr();
  var maxRefillsToday = (vipData && parseInt(vipData.tier||0) >= 1 && parseInt(vipData.expiry||0) > Date.now()) ? 6 : 3;
  if(!window.refillData || window.refillData.date!==today){
    window.refillData={date:today,count:maxRefillsToday};
  }
  if(window.refillData.count<=0){
    showToast('❌ انتهت فرصك اليوم! انتظر الغد');
    return;
  }
  energy=maxEnergy;
  window.refillData.count--;
  saveData(true); updateUI(); updateUpgradeUI();
  showToast('⚡ '+t('vipEnergyUsed','Energy refilled!')+' '+window.refillData.count+' '+t('vipEnergyLeft','remaining'));
}

function loadRefillData(){
  var today=getTodayStr();
  if(!window.refillData || window.refillData.date!==today){
    var maxR=(vipData&&parseInt(vipData.tier||0)>=1&&parseInt(vipData.expiry||0)>Date.now())?6:3;
    window.refillData={date:today,count:maxR};
  }
}

function updateUpgradeUI(){
  var s=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  s('tapLevel',tapLevelVal);s('energyLevel',energyLevelVal);
  s('tapCost',getTapCost(tapLevelVal).toLocaleString());
  s('energyCost',getEnergyCost(energyLevelVal).toLocaleString());
  s('tapPower',tapPowerVal);s('maxEnergyShow',maxEnergy.toLocaleString());
  var tb=document.getElementById('tapUpgradeBtn');if(tb)tb.disabled=record<getTapCost(tapLevelVal)||tapLevelVal>=100;
  var eb=document.getElementById('energyUpgradeBtn');if(eb)eb.disabled=record<getEnergyCost(energyLevelVal)||energyLevelVal>=100;
  // refill button
  loadRefillData();
  var rc=document.getElementById('refillCount');if(rc)rc.textContent=window.refillData.count;
  var rb=document.getElementById('energyRefillBtn');if(rb)rb.disabled=window.refillData.count<=0;
}

// ====== REC INFO POPUP ======
function openRECInfo() {
  var ol = document.getElementById('recInfoOverlay');
  var pp = document.getElementById('recInfoPopup');
  if(!ol || !pp) return;

  pp.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<div style="font-size:17px;font-weight:900;color:#00FF88;font-family:Orbitron,sans-serif;">' + t('recInfoTitle') + '</div>' +
      '<div onclick="closeRECInfo()" style="width:30px;height:30px;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.4);font-size:13px;">✕</div>' +
    '</div>' +
    '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:20px;">' + t('recInfoSub') + '</div>' +

    _infoCard('#00FF88','⛏️', t('recAutoMining'), t('recAutoMining'),
      t('recAutoMiningDesc') + '<div style="margin-top:6px;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;font-family:Orbitron,sans-serif;font-size:10px;color:#00FF88;">' +
      t('recYourSpeed') + ' ' + (function(){var s=recPerSec;if(vipData&&parseInt(vipData.tier||0)>=1&&parseInt(vipData.expiry||0)>Date.now()&&vipData.boostDate===getTodayStr())s*=1.5;return s.toFixed(8);}()) + ' REC/s</div>') +

    _infoCard('#AA66FF','🃏', t('recCardUpgrade'), t('recCardUpgrade'),
      t('recCardUpgradeDesc') +
      '<div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t('recNormalCard') + '</div><div style="font-size:12px;color:#AA66FF;font-weight:700;">×1</div></div>' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t('recLimitedCard') + '</div><div style="font-size:12px;color:#FFD700;font-weight:700;">×3</div></div>' +
      '</div>') +

    _infoCard('#FF6644','🏆', t('recBlocks'), '', t('recBlocksDesc')) +
    _infoCard('#FFD700','🎯', t('recDailyCombo'), '+5 REC', t('recDailyComboDesc')) +

    _infoCard('#44CCFF','👥', t('recReferrals'), '',
      t('recReferralsDesc') +
      '<div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:9px;color:rgba(255,255,255,0.3);">L1</div><div style="font-size:14px;color:#00FF88;font-weight:700;">8%</div></div>' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:9px;color:rgba(255,255,255,0.3);">L2</div><div style="font-size:14px;color:#44CCFF;font-weight:700;">2%</div></div>' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:9px;color:rgba(255,255,255,0.3);">L3</div><div style="font-size:14px;color:#AA66FF;font-weight:700;">1%</div></div>' +
      '</div>') +

    _infoCard('#FF66AA','✅', t('recTasks'), '', t('recTasksDesc')) +

    '<div style="background:rgba(255,200,0,0.08);border:1px solid rgba(255,200,0,0.25);border-radius:14px;padding:14px;">' +
      '<div style="font-size:12px;font-weight:700;color:#FFD700;margin-bottom:8px;">' + t('recSpeedTip') + '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.7;">١. ' + t('recTip1') + '<br>٢. ' + t('recTip2') + '<br>٣. ' + t('recTip3') + '<br>٤. ' + t('recTip4') + '</div>' +
    '</div>';

  ol.style.display = 'block';
  pp.style.display = 'block';
}

function closeRECInfo() {
  var ol = document.getElementById('recInfoOverlay');
  var pp = document.getElementById('recInfoPopup');
  if(ol) ol.style.display = 'none';
  if(pp) pp.style.display = 'none';
}

function openRECORDInfo() {
  var ol = document.getElementById('recordInfoOverlay');
  var pp = document.getElementById('recordInfoPopup');
  if(!ol || !pp) return;

  pp.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<div style="font-size:17px;font-weight:900;color:#FF6644;font-family:Orbitron,sans-serif;">' + t('recordInfoTitle') + '</div>' +
      '<div onclick="closeRECORDInfo()" style="width:30px;height:30px;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.4);font-size:13px;">✕</div>' +
    '</div>' +
    '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:20px;">' + t('recordInfoSub') + '</div>' +

    _infoCard('#FF6644','🔴', t('recordWhat'), t('recordWhatSub'),
      t('recordWhatDesc') +
      '<div style="margin-top:6px;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;font-family:Orbitron,sans-serif;font-size:10px;color:#FF6644;">' +
      Math.floor(record).toLocaleString() + ' RECORD</div>') +

    _infoCard('#FF9933','👆', t('recordTapping'), t('recordTappingSub'),
      t('recordTappingDesc') +
      '<div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t('recordTapPower') + '</div><div style="font-size:12px;color:#FF9933;font-weight:700;">' + t('recordMorePerTap') + '</div></div>' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t('recordEnergyUp') + '</div><div style="font-size:12px;color:#FF9933;font-weight:700;">' + t('recordMoreTaps') + '</div></div>' +
      '</div>') +

    _infoCard('#FFD700','⚙️', t('recordAutoMining'), t('recordAutoSub'),
      t('recordAutoDesc') +
      '<div style="margin-top:6px;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;font-family:Orbitron,sans-serif;font-size:10px;color:#FFD700;">' +
      t('recordYourSpeed') + ' ' + recordPerSec.toFixed(8) + ' REC/s</div>') +

    _infoCard('#AA66FF','📦', t('recordMystery'), t('recordMysterySub'), t('recordMysteryDesc')) +
    _infoCard('#00CC66','⚡', t('recordEnergyRefill'), t('recordEnergyRefillSub'), t('recordEnergyRefillDesc')) +

    '<div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.2);border-radius:14px;padding:14px;">' +
      '<div style="font-size:12px;font-weight:700;color:#FFD700;margin-bottom:8px;">' + t('recordHowSpend') + '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.7;">' +
        t('recordSpend1') + '<br>' + t('recordSpend2') + '<br>' + t('recordSpend3') + '<br>' + t('recordSpend4') +
      '</div>' +
    '</div>';

  ol.style.display = 'block';
  pp.style.display = 'block';
}

function closeRECORDInfo() {
  var ol = document.getElementById('recordInfoOverlay');
  var pp = document.getElementById('recordInfoPopup');
  if(ol) ol.style.display = 'none';
  if(pp) pp.style.display = 'none';
}

// Helper: build info card
function _infoCard(color, icon, title, sub, body) {
  return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px;margin-bottom:10px;">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
      '<div style="font-size:26px;">' + icon + '</div>' +
      '<div><div style="font-size:14px;font-weight:700;color:' + color + ';">' + title + '</div>' +
      (sub ? '<div style="font-size:10px;color:rgba(255,255,255,0.4);">' + sub + '</div>' : '') +
      '</div></div>' +
    '<div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">' + body + '</div>' +
  '</div>';
}
// ====== END INFO POPUPS ======

// ====== DAILY COMBO ======
var comboData = null;
var ADMIN_TG_ID = 6995765586;

function openCombo() {
  document.getElementById('comboOverlay').style.display = 'block';
  document.getElementById('comboPopup').style.display = 'block';
  loadComboData();

}

function closeCombo() {
  document.getElementById('comboOverlay').style.display = 'none';
  document.getElementById('comboPopup').style.display = 'none';
}

function loadComboData() {
  if(!tgUser) return;
  var slots = document.getElementById('comboCardSlots');
  if(slots) slots.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.3);padding:20px;">⏳ Loading...</div>';

  fetch('/api/combo/today/' + tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      comboData = d;
      renderComboSlots(d);
    })
    .catch(function(){
      var slots = document.getElementById('comboCardSlots');
      if(slots) slots.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.3);padding:20px;">ما في كومبو اليوم بعد</div>';
    });
}

function renderComboSlots(d) {
  var slots = document.getElementById('comboCardSlots');
  if(!slots) return;

  var isAdmin = tgUser && String(tgUser.id) === '6995765586';
  var now = Date.now();
  var expired = d && d.expiresAt && now > d.expiresAt;

  // Admin: show timer always
  var timerEl = document.getElementById('comboTimerRow');
  if(timerEl) {
    if(d && d.expiresAt) {
      timerEl.style.display = 'block';
      window._comboExpiresAt = d.expiresAt;
      window._comboIsAdmin = isAdmin;
    } else {
      timerEl.style.display = 'none';
    }
  }

  if(!d || !d.exists || expired) {
    if(isAdmin && expired) {
      slots.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;"><div style="font-size:32px;margin-bottom:8px;">⏰</div><div style="color:#FFD700;font-size:13px;font-weight:700;">' + t('comboExpiredAdmin') + '</div></div>';
    } else {
      slots.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;"><div style="font-size:32px;margin-bottom:8px;">🔒</div></div>';
    }
    var claimArea = document.getElementById('comboClaimArea');
    var claimed = document.getElementById('comboClaimed');
    if(claimArea) claimArea.style.display = 'none';
    if(claimed) claimed.style.display = 'none';
    return;
  }

  slots.innerHTML = d.cards.map(function(c, i) {
    var cardInfo = getCardInfo(c.categoryIndex, c.cardIndex);
    var done = c.done;
    return '<div style="background:' + (done ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.04)') + ';border:1px solid ' + (done ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.08)') + ';border-radius:14px;padding:14px 8px;text-align:center;">' +
      '<div style="font-size:28px;margin-bottom:6px;">' + (done ? (cardInfo ? cardInfo.e : '✅') : '?') + '</div>' +
      '<div style="font-size:10px;color:' + (done ? '#00FF88' : 'rgba(255,255,255,0.3)') + ';font-weight:700;">' + (done ? (cardInfo ? cardInfo.name : 'Done') : '???') + '</div>' +
      '<div style="font-size:18px;margin-top:6px;">' + (done ? '✅' : '🔒') + '</div>' +
      '</div>';
  }).join('');

  var claimArea = document.getElementById('comboClaimArea');
  var claimed = document.getElementById('comboClaimed');
  if(claimArea) claimArea.style.display = (d.allDone && !d.rewardClaimed) ? 'block' : 'none';
  if(claimed) claimed.style.display = d.rewardClaimed ? 'block' : 'none';

  var badge = document.getElementById('comboDotBadge');
  if(badge) badge.style.display = (d.exists && !d.allDone && !expired) ? 'block' : 'none';
}

function getCardInfo(catIdx, cardIdx) {
  try {
    var cats = typeof categories !== 'undefined' ? categories : [];
    if(cats[catIdx] && cats[catIdx].cards[cardIdx]) {
      var card = cats[catIdx].cards[cardIdx];
      return { e: card.e || '🃏', name: card.en || card.n || 'Card' };
    }
  } catch(e) {}
  return null;
}

function claimCombo() {
  if(!tgUser || !comboData) return;
  // Reward is given server-side automatically when all cards done
  document.getElementById('comboClaimArea').style.display = 'none';
  document.getElementById('comboClaimed').style.display = 'block';
  showToast('🎉 حصلت على +5 REC!');
  rec += 5;
  if(typeof addXP==='function') addXP(100);
  saveData(true); updateUI();
}

// Called when a card is upgraded — checks against combo
function checkComboOnUpgrade(cardKey) {
  if(!tgUser) return;
  fetch('/api/combo/check', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ telegramId: tgUser.id, cardKey: cardKey })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(d.matched) {
      showToast('🎯 بطاقة كومبو! ' + d.done + '/3');
      if(d.allDone && d.reward > 0) {
        rec += d.reward;
        saveData(true); updateUI();
        showToast('🎉 أكملت الكومبو! +' + d.reward + ' REC');
      }
      if(comboData) loadComboData(); // refresh popup combo display if it was open
      loadComboInCards(); // refresh the combo slots shown on the Cards page
    }
  }).catch(function(){});
}


// ====== ADMIN PANEL TABS ======
function adminTab(tab) {
  ['combo','gift','weekly'].forEach(function(t) {
    var sec = document.getElementById('adminSection_'+t);
    var btn = document.getElementById('adminTab_'+t);
    if(sec) sec.style.display = t===tab ? 'block' : 'none';
    if(btn) {
      btn.style.background = t===tab ? 'rgba(255,100,50,0.3)' : 'rgba(0,0,0,0.2)';
      btn.style.color = t===tab ? '#FF6644' : 'rgba(255,255,255,0.5)';
      btn.style.border = t===tab ? '1px solid rgba(255,100,50,0.5)' : '1px solid rgba(255,255,255,0.1)';
    }
  });
}

// ====== ADMIN SEND GIFT ======
function sendAdminGift() {
  if(!tgUser || tgUser.id !== 6995765586) return;
  var userId  = document.getElementById('giftUserId')  ? document.getElementById('giftUserId').value.trim()  : '';
  var amount  = document.getElementById('giftAmount')  ? document.getElementById('giftAmount').value.trim()  : '';
  var message = document.getElementById('giftMessage') ? document.getElementById('giftMessage').value.trim() : '';
  var result  = document.getElementById('giftResult');

  if(!userId || !amount) {
    if(result) { result.style.color='#FF4444'; result.textContent='❌ أدخل ID المستخدم والكمية'; }
    return;
  }

  if(result) { result.style.color='#FFD700'; result.textContent='⏳ جاري الإرسال...'; }

  fetch('/api/admin/gift', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminId: tgUser.id, telegramId: parseInt(userId), amount: parseFloat(amount), message: message })
  })
  .then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.success) {
      if(result) { result.style.color='#00FF88'; result.textContent='✅ تم إرسال ' + amount + ' REC بنجاح!'; }
      document.getElementById('giftUserId').value = '';
      document.getElementById('giftAmount').value = '';
      document.getElementById('giftMessage').value = '';
    } else {
      if(result) { result.style.color='#FF4444'; result.textContent='❌ ' + (d.error || 'خطأ'); }
    }
  })
  .catch(function() {
    if(result) { result.style.color='#FF4444'; result.textContent='❌ فشل الاتصال'; }
  });
}

// ====== ADMIN COMBO SETTER ======

// ====== END DAILY COMBO ======

// ====== WALLET PAGE ======
function updateWalletPage() {
  var name = tgUser ? (tgUser.first_name || 'Miner') : 'Miner';
  var id   = tgUser ? tgUser.id : '—';
  var el;

  el = document.getElementById('walletName'); if(el) el.textContent = name;
  el = document.getElementById('walletId');   if(el) el.textContent = id;
  el = document.getElementById('walletAvatar'); if(el) el.textContent = name[0].toUpperCase();
  el = document.getElementById('walletAssets'); if(el) el.textContent = rec.toFixed(6) + ' REC';
  el = document.getElementById('walletPool');   if(el) el.textContent = rec.toFixed(6) + ' REC';
  el = document.getElementById('profileId');    if(el) el.textContent = id;
  el = document.getElementById('recPoolBalance'); if(el) el.textContent = rec.toFixed(6);
}


// ====== WITHDRAW MODAL (All Users: 10,000 - 50,000 REC) ======
var WITHDRAW_MIN = 10000;
var WITHDRAW_MAX = 50000;
var WITHDRAW_FEE = 150;

function openWithdrawModal() {
  if(document.getElementById('withdrawModal')) return;
  var modal = document.createElement('div');
  modal.id = 'withdrawModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:flex-end;';
  var balance = (typeof rec !== 'undefined') ? rec : 0;
  var hasWallet = (typeof tonConnect !== 'undefined' && tonConnect.connected);
  // Get wallet address in UQ... friendly format from walletBtn
  var walletAddr = '';
  if(hasWallet) {
    var wBtn = document.getElementById('walletBtn');
    if(wBtn && wBtn.getAttribute('data-raw')) {
      walletAddr = wBtn.getAttribute('data-raw');
    } else if(tonConnect.account && tonConnect.account.address) {
      walletAddr = tonConnect.account.address;
    }
  }
  var shortAddr = walletAddr ? (walletAddr.substring(0,6)+'...'+walletAddr.substring(walletAddr.length-4)) : '';
  modal.innerHTML =
    '<div style="background:linear-gradient(180deg,#0a160e,#050d08);border-radius:24px 24px 0 0;border-top:2px solid rgba(0,255,136,0.4);padding:20px 18px 36px;width:100%;max-height:90vh;overflow-y:auto;">'
  + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">'
  + '<div style="font-size:18px;font-weight:900;color:#00FF88;font-family:Orbitron,sans-serif;">🏦 '+t('withdrawPool','Withdraw')+'</div>'
  + '<div onclick="document.getElementById(\'withdrawModal\').remove()" style="width:32px;height:32px;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;color:rgba(255,255,255,0.5);">✕</div>'
  + '</div>'
  + '<div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.15);border-radius:14px;padding:14px;margin-bottom:14px;">'
  + '<div style="font-size:11px;color:rgba(255,255,255,0.4);">'+t('walletAssets','Balance')+'</div>'
  + '<div style="font-size:22px;font-weight:900;color:#00FF88;font-family:Orbitron,sans-serif;">'+balance.toFixed(2)+' REC</div>'
  + '</div>'
  + '<div style="background:rgba(255,200,0,0.05);border:1px solid rgba(255,200,0,0.15);border-radius:12px;padding:12px;margin-bottom:14px;font-size:12px;color:rgba(255,255,255,0.6);">'
  + '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Min</span><span style="color:#FFD700;font-weight:700;">'+WITHDRAW_MIN.toLocaleString()+' REC</span></div>'
  + '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Max</span><span style="color:#FFD700;font-weight:700;">'+WITHDRAW_MAX.toLocaleString()+' REC</span></div>'
  + '<div style="display:flex;justify-content:space-between;"><span>'+t('withdrawFeeLabel','Fee')+'</span><span style="color:#FF8800;font-weight:700;">-'+WITHDRAW_FEE+' REC</span></div>'
  + '</div>'
  + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px;margin-bottom:14px;display:flex;align-items:center;gap:10px;">'
  + '<span style="font-size:20px;">💳</span>'
  + '<div style="flex:1;"><div style="font-size:11px;color:rgba(255,255,255,0.4);">'+t('connectWallet','Wallet')+'</div>'
  + (hasWallet ? '<div style="font-size:12px;color:#00FF88;font-weight:700;">'+shortAddr+'</div>' : '<div style="font-size:12px;color:#FF4444;cursor:pointer;" onclick="connectWallet()">'+t('withdrawErrorWallet','Connect wallet first')+'</div>')
  + '</div>'+(hasWallet?'<span style="color:#00FF88;">✅</span>':'<span style="color:#FF4444;">❌</span>')+'</div>'
  + '<div style="margin-bottom:14px;">'
  + '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;">'+t('withdrawAmountLabel','Amount (REC)')+'</div>'
  + '<div style="display:flex;gap:8px;">'
  + '<input id="withdrawAmountInput" type="number" min="'+WITHDRAW_MIN+'" max="'+WITHDRAW_MAX+'" step="1" placeholder="'+WITHDRAW_MIN.toLocaleString()+' - '+WITHDRAW_MAX.toLocaleString()+'" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:12px;color:white;font-size:14px;outline:none;" />'
  + '<button onclick="setWithdrawMax()" style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:0 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">MAX</button>'
  + '</div>'
  + '<div id="withdrawCalc" style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:6px;"></div>'
  + '</div>'
  + '<button id="withdrawSubmitBtn" onclick="submitWithdraw()" style="width:100%;background:linear-gradient(135deg,#006633,#00CC66);border:none;color:white;padding:15px;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;">💸 '+t('withdrawSubmit','Confirm Withdrawal')+'</button>'
  + '</div>';
  document.body.appendChild(modal);
  var inp = document.getElementById('withdrawAmountInput');
  if(inp) inp.addEventListener('input', function(){
    var val=parseFloat(inp.value)||0, calc=document.getElementById('withdrawCalc');
    if(!calc) return;
    if(val>=WITHDRAW_MIN&&val<=WITHDRAW_MAX){ calc.style.color='#00FF88'; calc.textContent='✅ '+t('withdrawYouReceive','You receive')+': '+(val-WITHDRAW_FEE).toLocaleString()+' REC'; }
    else if(val>WITHDRAW_MAX){ calc.style.color='#FF4444'; calc.textContent='❌ Max: '+WITHDRAW_MAX.toLocaleString()+' REC'; }
    else if(val>0){ calc.style.color='#FF4444'; calc.textContent='❌ Min: '+WITHDRAW_MIN.toLocaleString()+' REC'; }
    else calc.textContent='';
  });
}
function setWithdrawMax(){ var inp=document.getElementById('withdrawAmountInput'),b=(typeof rec!=='undefined')?rec:0; if(inp){inp.value=Math.min(Math.floor(b),WITHDRAW_MAX);inp.dispatchEvent(new Event('input'));} }
function submitWithdraw(){
  var inp=document.getElementById('withdrawAmountInput'); if(!inp) return;
  var amount=parseFloat(inp.value)||0, balance=(typeof rec!=='undefined')?rec:0;
  if(!tgUser){showToast('❌ '+t('withdrawErrorUser','User error'));return;}
  if(!(typeof tonConnect!=='undefined'&&tonConnect.connected)){showToast('❌ '+t('withdrawErrorWallet','Connect wallet first'));connectWallet();return;}
  if(amount<WITHDRAW_MIN){showToast('❌ Min: '+WITHDRAW_MIN.toLocaleString()+' REC');return;}
  if(amount>WITHDRAW_MAX){showToast('❌ Max: '+WITHDRAW_MAX.toLocaleString()+' REC');return;}
  if(amount>balance){showToast('❌ '+t('withdrawErrorBalance','Insufficient balance'));return;}
  var btn=document.getElementById('withdrawSubmitBtn');
  if(btn){btn.disabled=true;btn.textContent='⏳...';}
  fetch('/api/withdraw',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId:tgUser.id,amount:amount})})
  .then(function(r){return r.json();})
  .then(function(d){
    if(d.success){rec-=amount;if(typeof updateUI==='function')updateUI();if(typeof saveData==='function')saveData(true);var m=document.getElementById('withdrawModal');if(m)m.remove();showToast('✅ '+d.netAmount.toLocaleString()+' REC '+t('withdrawSuccess','sent!'));}
    else{showToast('❌ '+(d.error||'Error'));if(btn){btn.disabled=false;btn.textContent='💸 '+t('withdrawSubmit','Confirm Withdrawal');}}
  }).catch(function(){showToast('❌ Network error');if(btn){btn.disabled=false;btn.textContent='💸 '+t('withdrawSubmit','Confirm Withdrawal');}});
}


// ====== VIP WITHDRAW MODAL (50,000 - 1,000,000 REC) ======
var VIP_WITHDRAW_MIN = 50000;
var VIP_WITHDRAW_MAX = 1000000;
var VIP_WITHDRAW_FEE = 150;

function openVIPWithdrawModal() {
  if(document.getElementById('vipWithdrawModal')) return;
  if(!vipData || !vipData.tier || vipData.tier < 1 || vipData.expiry < Date.now()) {
    showToast('❌ VIP 1 required');
    return;
  }
  var modal = document.createElement('div');
  modal.id = 'vipWithdrawModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:flex-end;';
  var balance = (typeof rec !== 'undefined') ? rec : 0;
  var hasWallet = (typeof tonConnect !== 'undefined' && tonConnect.connected);
  // Get wallet address in UQ... friendly format from walletBtn
  var walletAddr = '';
  if(hasWallet) {
    var wBtn = document.getElementById('walletBtn');
    if(wBtn && wBtn.getAttribute('data-raw')) {
      walletAddr = wBtn.getAttribute('data-raw');
    } else if(tonConnect.account && tonConnect.account.address) {
      walletAddr = tonConnect.account.address;
    }
  }
  var shortAddr = walletAddr ? (walletAddr.substring(0,6)+'...'+walletAddr.substring(walletAddr.length-4)) : '';

  modal.innerHTML =
    '<div style="background:linear-gradient(180deg,#0a1a0e,#050d08);border-radius:24px 24px 0 0;border-top:2px solid rgba(255,200,0,0.4);padding:20px 18px 36px;width:100%;max-height:90vh;overflow-y:auto;">'
  + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">'
  + '<div style="font-size:18px;font-weight:900;color:#FFD700;font-family:Orbitron,sans-serif;">👑 VIP Withdraw</div>'
  + '<div onclick="document.getElementById(\'vipWithdrawModal\').remove()" style="width:32px;height:32px;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;color:rgba(255,255,255,0.5);">✕</div>'
  + '</div>'
  + '<div style="background:rgba(255,200,0,0.06);border:1px solid rgba(255,200,0,0.2);border-radius:14px;padding:14px;margin-bottom:14px;">'
  + '<div style="font-size:11px;color:rgba(255,255,255,0.4);">Balance</div>'
  + '<div style="font-size:22px;font-weight:900;color:#FFD700;font-family:Orbitron,sans-serif;">'+balance.toFixed(2)+' REC</div>'
  + '</div>'
  + '<div style="background:rgba(255,200,0,0.05);border:1px solid rgba(255,200,0,0.15);border-radius:12px;padding:12px;margin-bottom:14px;font-size:12px;color:rgba(255,255,255,0.6);">'
  + '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Min</span><span style="color:#FFD700;font-weight:700;">'+VIP_WITHDRAW_MIN.toLocaleString()+' REC</span></div>'
  + '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Max</span><span style="color:#FFD700;font-weight:700;">'+VIP_WITHDRAW_MAX.toLocaleString()+' REC</span></div>'
  + '<div style="display:flex;justify-content:space-between;"><span>Fee</span><span style="color:#FF8800;font-weight:700;">-'+VIP_WITHDRAW_FEE+' REC</span></div>'
  + '</div>'
  + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px;margin-bottom:14px;display:flex;align-items:center;gap:10px;">'
  + '<span style="font-size:20px;">💳</span>'
  + '<div style="flex:1;"><div style="font-size:11px;color:rgba(255,255,255,0.4);">Wallet</div>'
  + (hasWallet ? '<div style="font-size:12px;color:#00FF88;font-weight:700;">'+shortAddr+'</div>' : '<div style="font-size:12px;color:#FF4444;cursor:pointer;" onclick="connectWallet()">Connect wallet first</div>')
  + '</div>'+(hasWallet?'<span style="color:#00FF88;">✅</span>':'<span style="color:#FF4444;">❌</span>')+'</div>'
  + '<div style="margin-bottom:14px;">'
  + '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;">Amount (REC)</div>'
  + '<div style="display:flex;gap:8px;">'
  + '<input id="vipWithdrawInput" type="number" min="'+VIP_WITHDRAW_MIN+'" max="'+VIP_WITHDRAW_MAX+'" step="1" placeholder="'+VIP_WITHDRAW_MIN.toLocaleString()+' - '+VIP_WITHDRAW_MAX.toLocaleString()+'" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:12px;color:white;font-size:14px;outline:none;" />'
  + '<button onclick="setVIPWithdrawMax()" style="background:rgba(255,200,0,0.15);border:1px solid rgba(255,200,0,0.4);color:#FFD700;padding:0 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">MAX</button>'
  + '</div>'
  + '<div id="vipWithdrawCalc" style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:6px;"></div>'
  + '</div>'
  + '<button id="vipWithdrawBtn" onclick="submitVIPWithdraw()" style="width:100%;background:linear-gradient(135deg,#886600,#FFD700);border:none;color:#000;padding:15px;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;">👑 VIP Withdraw</button>'
  + '</div>';

  document.body.appendChild(modal);
  var inp = document.getElementById('vipWithdrawInput');
  if(inp) inp.addEventListener('input', function(){
    var val = parseFloat(inp.value)||0, calc = document.getElementById('vipWithdrawCalc');
    if(!calc) return;
    if(val>=VIP_WITHDRAW_MIN && val<=VIP_WITHDRAW_MAX){ calc.style.color='#FFD700'; calc.textContent='✅ You receive: '+(val-VIP_WITHDRAW_FEE).toLocaleString()+' REC'; }
    else if(val>VIP_WITHDRAW_MAX){ calc.style.color='#FF4444'; calc.textContent='❌ Max: '+VIP_WITHDRAW_MAX.toLocaleString()+' REC'; }
    else if(val>0){ calc.style.color='#FF4444'; calc.textContent='❌ Min: '+VIP_WITHDRAW_MIN.toLocaleString()+' REC'; }
    else calc.textContent='';
  });
}

function setVIPWithdrawMax() {
  var inp=document.getElementById('vipWithdrawInput'), b=(typeof rec!=='undefined')?rec:0;
  if(inp){ inp.value=Math.min(Math.floor(b),VIP_WITHDRAW_MAX); inp.dispatchEvent(new Event('input')); }
}

function submitVIPWithdraw() {
  var inp=document.getElementById('vipWithdrawInput'); if(!inp) return;
  var amount=parseFloat(inp.value)||0, balance=(typeof rec!=='undefined')?rec:0;
  if(!tgUser){ showToast('❌ User error'); return; }
  if(!(typeof tonConnect!=='undefined'&&tonConnect.connected)){ showToast('❌ Connect wallet first'); connectWallet(); return; }
  if(amount<VIP_WITHDRAW_MIN){ showToast('❌ Min: '+VIP_WITHDRAW_MIN.toLocaleString()+' REC'); return; }
  if(amount>VIP_WITHDRAW_MAX){ showToast('❌ Max: '+VIP_WITHDRAW_MAX.toLocaleString()+' REC'); return; }
  if(amount>balance){ showToast('❌ Insufficient balance'); return; }
  var btn=document.getElementById('vipWithdrawBtn');
  if(btn){ btn.disabled=true; btn.textContent='⏳...'; }
  fetch('/api/vip-withdraw',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId:tgUser.id,amount:amount})})
  .then(function(r){ return r.json(); })
  .then(function(d){
    if(d.success){ rec-=amount; if(typeof updateUI==='function')updateUI(); if(typeof saveData==='function')saveData(true); var m=document.getElementById('vipWithdrawModal'); if(m)m.remove(); showToast('✅ '+d.netAmount.toLocaleString()+' REC sent!'); }
    else{ showToast('❌ '+(d.error||'Error')); if(btn){btn.disabled=false;btn.textContent='👑 VIP Withdraw';} }
  }).catch(function(){ showToast('❌ Network error'); if(btn){btn.disabled=false;btn.textContent='👑 VIP Withdraw';} });
}


function openWithdrawHistory() {
  if(!tgUser) return;
  var overlay = document.getElementById('historyOverlay');
  if(overlay) { overlay.classList.add('open'); loadWithdrawHistory(); return; }

  // Create overlay
  var ol = document.createElement('div');
  ol.id = 'historyOverlay';
  ol.className = 'overlay-page open';
  ol.innerHTML =
    '<button class="back-btn" onclick="document.getElementById(\'historyOverlay\').classList.remove(\'open\')">← Back</button>' +
    '<h2 style="margin-bottom:16px;color:#FF6644;font-family:Orbitron,sans-serif;font-size:18px;">📄 History</h2>' +
    '<div id="historyContent" style="color:rgba(255,255,255,0.4);text-align:center;padding:30px;">⏳ Loading...</div>';
  document.body.appendChild(ol);
  loadWithdrawHistory();
}

function loadWithdrawHistory() {
  if(!tgUser) return;
  var el = document.getElementById('historyContent');
  if(!el) return;
  fetch('/api/withdrawals/'+tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!d.withdrawals || d.withdrawals.length === 0) {
        el.innerHTML = '<div style="text-align:center;padding:40px 20px;"><div style="font-size:40px;margin-bottom:12px;">📭</div><div style="color:rgba(255,255,255,0.3);font-size:14px;">No withdrawals yet</div></div>';
        return;
      }
      el.innerHTML = d.withdrawals.map(function(w){
        var date = new Date(w.createdAt).toLocaleDateString();
        var statusColor = w.status==='sent' ? '#00FF88' : w.status==='pending' ? '#FFD700' : '#FF4444';
        return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-bottom:8px;">'+
          '<div style="display:flex;justify-content:space-between;align-items:center;">'+
          '<div><div style="font-size:15px;font-weight:700;color:#00FF88;">'+w.netAmount+' REC</div>'+
          '<div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;">'+date+'</div></div>'+
          '<div style="font-size:11px;font-weight:700;color:'+statusColor+';text-transform:uppercase;">'+w.status+'</div>'+
          '</div></div>';
      }).join('');
    })
    .catch(function(){
      el.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.3);padding:20px;">Could not load history</div>';
    });
}
// ====== END WALLET PAGE ======

// ====== PROFILE POPUP ======
function openProfilePopup() {
  var popup = document.getElementById('profilePopup');
  var overlay = document.getElementById('profilePopupOverlay');
  if(!popup) return;

  var name = tgUser ? (tgUser.first_name || 'Miner') : 'Miner';
  var username = tgUser ? (tgUser.username ? '@'+tgUser.username : 'ID: '+tgUser.id) : '';
  document.getElementById('ppName').textContent = name;
  document.getElementById('ppUsername').textContent = username;

  var avatarEl = document.getElementById('ppAvatar');
  avatarEl.textContent = name[0].toUpperCase();

  // Count cards
  var totalCards = 0, upgradedCards = 0, totalCardLevels = 0;
  var categories_list = typeof categories !== 'undefined' ? categories : [];
  categories_list.forEach(function(cat){ totalCards += cat.cards.length; });
  Object.keys(cardLevels).forEach(function(k){
    var lvl = cardLevels[k] || 0;
    if(lvl > 0) upgradedCards++;
    totalCardLevels += lvl;
  });

  var tasksDone = completedTasks.length;
  var speed = recPerSec > 0 ? recPerSec.toFixed(8) : '0.00000000';

  var stats = [
    { icon:'⛏️', label:t('ppCardsUpgraded'), val: upgradedCards+' / '+totalCards, color:'#AA66FF' },
    { icon:'⚡', label:t('ppRecSpeed'), val: speed+'/s', color:'#00FF88' },
    { icon:'🔴', label:t('ppRecord'), val: Math.floor(record).toLocaleString(), color:'#FF6644' },
    { icon:'💚', label:t('ppRecBalance'), val: rec.toFixed(4), color:'#00FF88' },
    { icon:'👆', label:t('ppTotalTaps'), val: (totalTaps||0).toLocaleString(), color:'#FFD700' },
    { icon:'✅', label:t('ppTasksDone'), val: tasksDone, color:'#44FFAA' },
    { icon:'👥', label:t('friendsLabel'), val: refCount, color:'#44CCFF' },
    { icon:'📈', label:t('ppCardLevels'), val: totalCardLevels, color:'#FF8844' },
    { icon:'⭐', label:'XP', val: (function(){
      if(typeof playerXP==='undefined'||typeof calcPlayerLevel==='undefined') return '0';
      var lvl = calcPlayerLevel(playerXP);
      var startXP = typeof cumXPForLevel==='function' ? cumXPForLevel(lvl) : 0;
      var needed  = typeof xpNeededForLevel==='function' ? xpNeededForLevel(lvl+1) : 0;
      var done    = Math.max(0, playerXP - startXP);
      return Math.min(done,needed).toLocaleString()+' / '+needed.toLocaleString();
    })(), color:'#FFD700' },
  ];

  var grid = document.getElementById('ppStatsGrid');
  if(grid) grid.innerHTML = stats.map(function(s){
    return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:12px 10px;text-align:center;">'+
      '<div style="font-size:22px;margin-bottom:4px;">'+s.icon+'</div>'+
      '<div style="font-size:12px;font-weight:700;color:'+s.color+';font-family:Orbitron,sans-serif;line-height:1.2;word-break:break-all;">'+s.val+'</div>'+
      '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:4px;letter-spacing:1px;">'+s.label+'</div>'+
      '</div>';
  }).join('');

  // Top cards
  var cardsList = [];
  categories_list.forEach(function(cat, ci){
    cat.cards.forEach(function(card, idx){
      var key = ci+'_'+idx;
      var lvl = cardLevels[key] || 0;
      if(lvl > 0) cardsList.push({ e:card.e||'🃏', n:card.en||card.n||'Card', lvl:lvl });
    });
  });
  cardsList.sort(function(a,b){ return b.lvl-a.lvl; });

  var cardsGrid = document.getElementById('ppCardsGrid');
  if(cardsGrid) {
    // Level section only - no cards grid
    var lvlHtml = (typeof buildLevelSection==='function') ? buildLevelSection() : '';
    cardsGrid.innerHTML = lvlHtml;
    var lvlGrid = document.getElementById('ppLevelsGrid');
    if(lvlGrid && typeof renderLevelsList==='function') renderLevelsList(lvlGrid);
  }

  overlay.style.display = 'block';
  popup.style.display = 'block';
  popup.style.animation = 'slideUp 0.3s ease';
}

function closeProfilePopup() {
  var p = document.getElementById('profilePopup');
  var o = document.getElementById('profilePopupOverlay');
  if(p) p.style.display = 'none';
  if(o) o.style.display = 'none';
}
// ====== END PROFILE POPUP ======


// Referral functions moved to referral.js


// ====== CARDS ======

function loadAndInit() {
  // If local data exists, use it first (prevents overwrite after upgrade)
  var hasLocalData = false;
  try {
    var lsRaw = localStorage.getItem(saveKey);
    if(lsRaw) {
      var lsParsed = JSON.parse(lsRaw);
      if(lsParsed && lsParsed.record >= 0) hasLocalData = true;
    }
  } catch(e) {}

  if(hasLocalData) {
    // Local data exists - use it immediately
    initApp();
    // Always sync VIP from server (critical for membership status)
    loadFromServer(function(serverData) {
      if(!serverData) return;
      // Sync VIP tier/expiry — always trust server
      if(serverData.vip && parseInt(serverData.vip.tier||0) > 0) {
        var prevTier = vipData.tier || 0;
        vipData.tier = serverData.vip.tier;
        vipData.expiry = serverData.vip.expiry;
        // Merge boxes only if local doesn't have today's entry
        if(serverData.vip.boxes) {
          var _today = getTodayStr();
          Object.keys(serverData.vip.boxes).forEach(function(k){
            if(!vipData.boxes[k] || vipData.boxes[k] !== _today) {
              vipData.boxes[k] = serverData.vip.boxes[k];
            }
          });
        }
        // Resume discount timer if still active after reload
        if(typeof resumeDiscountTimer === 'function') setTimeout(resumeDiscountTimer, 200);
        // Check for unclaimed weekly prize
        if(typeof checkWeeklyPrize === 'function') setTimeout(checkWeeklyPrize, 1500);
        // If VIP page is open and tier changed, refresh it
        if(prevTier !== vipData.tier && typeof renderVIPPage === 'function') {
          var vipPageEl = document.getElementById('vipPageContent');
          if(vipPageEl && vipPageEl.offsetParent !== null) {
            renderVIPPage();
            if(vipData.tier === 2 && typeof switchVIPTab === 'function') switchVIPTab(2);
            else if(typeof switchVIPTab === 'function') switchVIPTab(1);
          }
        }
      }
      // Sync NFT boost from server
      if(serverData.nftBoost && serverData.nftBoost > 1) {
        nftBoost = serverData.nftBoost;
        nftType = serverData.nftType || '';
      }
      // ✅ Sync rec from server if server has more (block rewards added server-side)
      if(serverData.rec && serverData.rec > (typeof rec !== 'undefined' ? rec : 0)) {
        if(typeof rec !== 'undefined') rec = serverData.rec;
        if(typeof updateUI === 'function') updateUI();
      }
      // Sync record if server has significantly more
      if(serverData.record > record * 1.5) {
        var _savedRec = rec || 0;
        applyData(serverData);
        if(rec < _savedRec) rec = _savedRec;
        updateUI();
      }
      // Sync XP from server (higher value wins)
      if(serverData.playerXP && serverData.playerXP > (typeof playerXP!=='undefined'?playerXP:0)) {
        if(typeof playerXP!=='undefined') playerXP = serverData.playerXP;
        if(typeof xpRetroCalculated!=='undefined') xpRetroCalculated = true;
        if(typeof claimedLevels!=='undefined' && serverData.claimedLevels) {
          Object.assign(claimedLevels, serverData.claimedLevels);
        }
        if(typeof updateLevelDisplay==='function') updateLevelDisplay();
      }
    });
    return;
  }

  // No local data - load from server
  loadFromServer(function(serverData) {
    if(serverData && (serverData.record > 0 || serverData.rec > 0 ||
       Object.keys(serverData.cardLevels||{}).length > 0)) {
      applyData(serverData);
      if(serverData.language && T[serverData.language]) currentLang = serverData.language;
      initApp();
      return;
    }
    // Fallback: CloudStorage
    if(CS) {
      try {
        CS.getItems(['gameData','userLang'], function(err, vals) {
          try {
            if(!err && vals && vals.gameData) {
              var cd = JSON.parse(vals.gameData);
              if(cd && (cd.record > 0 || cd.rec > 0)) applyData(cd);
            }
            if(!err && vals && vals.userLang && T[vals.userLang]) currentLang = vals.userLang;
          } catch(e) {}
          initApp();
        });
      } catch(e) { initApp(); }
    } else { initApp(); }
  });
}

document.addEventListener('DOMContentLoaded', loadAndInit);


// ====== ADMIN PANEL FUNCTIONS ======
function openAdminPanel() {
  showPage('adminPanel', null);
}

function adminBroadcast(target) {
  var msg = (document.getElementById('broadcastMsg')||{}).value || '';
  if(!msg.trim()) { showToast('❌ Enter message first'); return; }
  if(!tgUser) return;
  showToast('⏳ Sending...');
  fetch('/api/admin/broadcast', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ adminId: tgUser.id, message: msg, target: target })
  }).then(function(r){ return r.json(); }).then(function(d){
    showToast(d.success ? '✅ Sent to ' + (d.count||0) + ' users' : '❌ ' + d.error);
  });
}

function adminSetCombo() {
  if(!tgUser) return;
  fetch('/api/admin/set-combo', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ adminId: tgUser.id })
  }).then(function(r){ return r.json(); }).then(function(d){
    var el = document.getElementById('adminComboStatus');
    if(el) el.textContent = d.success ? '✅ ' + d.cards : '❌ ' + d.error;
  });
}

function adminLookupUser() {
  var uid = (document.getElementById('adminUserId')||{}).value;
  if(!uid || !tgUser) return;
  fetch('/api/admin/user-info?adminId=' + tgUser.id + '&userId=' + uid)
    .then(function(r){ return r.json(); }).then(function(d){
      var el = document.getElementById('adminUserResult');
      if(!el) return;
      if(d.error) { el.textContent = '❌ ' + d.error; return; }
      el.innerHTML = '👤 ' + (d.username||d.firstName||'Unknown') + '<br>' +
        '💰 REC: ' + (d.rec||0).toFixed(2) + '<br>' +
        '🏆 RECORD: ' + Math.floor(d.record||0).toLocaleString() + '<br>' +
        '👑 VIP: ' + (d.vipTier||0) + (d.vipExpiry ? ' (exp: '+new Date(d.vipExpiry).toLocaleDateString()+')' : '') + '<br>' +
        '👥 Refs: ' + (d.refCount||0) + ' | Lang: ' + (d.language||'en');
    });
}

function adminFixRef() {
  var uid = (document.getElementById('adminRefUserId')||{}).value;
  var rid = (document.getElementById('adminRefRefId')||{}).value;
  if(!uid || !rid || !tgUser) return;
  fetch('/api/admin/fix-referral', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ adminId: tgUser.id, userId: uid, refId: rid })
  }).then(function(r){ return r.json(); }).then(function(d){
    var el = document.getElementById('adminRefResult');
    if(el) el.textContent = d.success ? '✅ ' + d.msg : '❌ ' + (d.error||'Failed');
  });
}

function adminResetDiscountPanel() {
  var uid = (document.getElementById('adminDiscUserId')||{}).value || (tgUser ? tgUser.id : '');
  if(!uid || !tgUser) return;
  fetch('/api/admin/reset-discount', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ adminId: tgUser.id, telegramId: uid })
  }).then(function(r){ return r.json(); }).then(function(d){
    var el = document.getElementById('adminDiscResult');
    if(el) el.textContent = d.success ? '✅ Done' : '❌ ' + d.error;
    if(d.success && String(uid) === String(tgUser.id)) {
      vipData.discountDate = ''; vipData.discountExpiry = 0;
    }
  });
}


// ====== WEEKLY PRIZE SYSTEM ======
var _pendingPrize = null;

function checkWeeklyPrize() {
  if(!tgUser) return;
  fetch('/api/prizes/pending/' + tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(d.hasPrize) {
        _pendingPrize = d;
        var rankEl = document.getElementById('prizeRankText');
        var amtEl = document.getElementById('prizeAmountText');
        if(rankEl) rankEl.textContent = '🥇 Rank #' + d.rank + ' this week';
        if(amtEl) amtEl.textContent = '+' + d.amount;
        var popup = document.getElementById('weeklyPrizePopup');
        if(popup) popup.style.display = 'flex';
      }
    }).catch(function(){});
}

function claimWeeklyPrize() {
  if(!tgUser || !_pendingPrize) return;
  fetch('/api/prizes/claim', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ telegramId: tgUser.id })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(d.success) {
      rec += d.prize;
      showToast('🏆 +' + d.prize + ' REC claimed!');
      if(typeof saveData === 'function') saveData(true);
    }
    var popup = document.getElementById('weeklyPrizePopup');
    if(popup) popup.style.display = 'none';
    _pendingPrize = null;
  });
}

// ====== ADMIN PRIZE FUNCTIONS ======
function adminLoadPrizes() {
  if(!tgUser) return;
  var listEl = document.getElementById('adminPrizesList');
  if(listEl) listEl.innerHTML = '⏳ Loading...';
  fetch('/api/admin/leaderboard-prizes?adminId=' + tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!d.success || !listEl) return;
      var html = '<div style="color:rgba(255,215,0,0.6);margin-bottom:6px;">Week: ' + d.week + '</div>';
      html += '<table style="width:100%;border-collapse:collapse;">';
      html += '<tr style="color:rgba(255,255,255,0.4);font-size:10px;"><td>#</td><td>Name</td><td>REC</td><td style="color:#FFD700;">Prize</td></tr>';
      d.users.forEach(function(u) {
        var rankIcon = u.rank===1?'🥇':u.rank===2?'🥈':u.rank===3?'🥉':'';
        var paid = u.alreadyPaid ? ' ✅' : '';
        html += '<tr style="border-top:1px solid rgba(255,255,255,0.05);padding:2px 0;">' +
          '<td style="color:rgba(255,255,255,0.5);padding:3px 2px;">' + rankIcon + u.rank + '</td>' +
          '<td style="color:white;padding:3px 2px;max-width:100px;overflow:hidden;text-overflow:ellipsis;">' + u.name + '</td>' +
          '<td style="color:rgba(255,255,255,0.5);padding:3px 2px;font-size:10px;">' + Math.floor(u.rec).toLocaleString() + '</td>' +
          '<td style="color:#FFD700;font-weight:700;padding:3px 2px;">+' + u.prize + paid + '</td>' +
          '</tr>';
      });
      html += '</table>';
      listEl.innerHTML = html;
    }).catch(function(){ if(listEl) listEl.innerHTML = '❌ Error'; });
}

function adminDistributePrizes() {
  if(!tgUser) return;
  if(!confirm('Distribute prizes to top 100 users?')) return;
  var statusEl = document.getElementById('adminPrizeStatus');
  if(statusEl) statusEl.textContent = '⏳ Distributing...';
  fetch('/api/admin/distribute-prizes', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ adminId: tgUser.id })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(statusEl) statusEl.textContent = d.success
      ? '✅ Sent to ' + d.distributed + ' users (' + d.week + ')'
      : '❌ ' + d.error;
    if(d.success) adminLoadPrizes();
  });
}
