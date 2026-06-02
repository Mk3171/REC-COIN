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
function cardCost(lvl, isLimited){
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
function calcTotalSpeeds(){
  recordPerSec=0; recPerSec=0;
  Object.keys(cardLevels).forEach(function(key){
    var lvl=cardLevels[key]||0;
    var m=getLimitedMulti(key);
    recordPerSec+=cardRecordSpeed(lvl)*m;
    recPerSec+=cardRECSpeed(lvl)*m;
  });
}

// ====== DATA ======
var tgUser = null;
try { var _tgWA = window.Telegram && window.Telegram.WebApp; tgUser = _tgWA && _tgWA.initDataUnsafe && _tgWA.initDataUnsafe.user ? _tgWA.initDataUnsafe.user : null; } catch(e){}
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
var pendingRec = 0;
var vipData = {tier:0, expiry:0, boxes:{}, boost:null, hasEpicCard:false, epicExpiry:0};

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
  if(d.pendingRec !== undefined) pendingRec = d.pendingRec || 0;
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
    lastSaveTime:Date.now(),
    pendingRec:(typeof pendingRec!=='undefined'?pendingRec:0),
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
        playerXP: (typeof playerXP!=='undefined'?playerXP:0),
        pendingRec: (typeof pendingRec!=='undefined'?pendingRec:0),
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

        // If server REC is significantly more → block reward was given while offline
        if(recDiff >= 99) {
          setTimeout(function(){
            showBlockNotification(recDiff, res.data.totalBlocksFound || 1);
          }, 2000);
        }

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
  var old = document.getElementById('gamesHubOverlay');
  if(old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'gamesHubOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000 url(games-bg.jpeg) center/cover no-repeat;overflow-y:auto;';

  // Header
  var header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;gap:12px;padding:14px 16px 10px;background:rgba(0,0,0,0.7);position:sticky;top:0;z-index:10;border-bottom:1px solid rgba(255,255,255,0.07);';

  var backBtn = document.createElement('button');
  backBtn.textContent = '← Back';
  backBtn.style.cssText = 'background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:white;padding:7px 14px;border-radius:10px;font-size:13px;cursor:pointer;';
  backBtn.onclick = function(){ overlay.remove(); };

  var title = document.createElement('div');
  title.textContent = '🎮 GAMES';
  title.style.cssText = 'flex:1;text-align:center;font-family:Orbitron,sans-serif;font-size:16px;font-weight:900;color:#FF6644;';

  header.appendChild(backBtn);
  header.appendChild(title);
  header.appendChild(document.createElement('div'));
  overlay.appendChild(header);

  // Content
  var content = document.createElement('div');
  content.style.cssText = 'padding:16px;';

  // Category title
  var catHeader = document.createElement('div');
  catHeader.className = 'games-cat-header';
  catHeader.innerHTML = '<span class="games-cat-dot"></span><span class="games-cat-title">🕹️ Classic Game</span>';
  content.appendChild(catHeader);

  // Grid
  var grid = document.createElement('div');
  grid.className = 'games-grid';

  // REC Catch card
  var card1 = document.createElement('div');
  card1.className = 'game-card';
  card1.onclick = function(){ openGameFromHub('rec-catch'); };
  card1.innerHTML = '<div class="game-card-thumb" style="overflow:hidden;padding:0;"><img src="rec-catch-thumb.jpeg" style="width:100%;height:100%;object-fit:cover;"><div class="game-card-badge">Daily 10 REC</div></div><div class="game-card-name">REC Catch</div>';
  grid.appendChild(card1);

  // Coming soon cards
  for(var i=0; i<3; i++){
    var cs = document.createElement('div');
    cs.className = 'game-card coming-soon';
    cs.innerHTML = '<div class="game-card-thumb"><span style="font-size:36px;opacity:0.3;">🔒</span></div><div class="game-card-name" style="color:rgba(255,255,255,0.2);">Coming Soon</div>';
    grid.appendChild(cs);
  }

  content.appendChild(grid);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
}

function openGameFromHub(gameId){
  var games = { 'rec-catch': '/games.html' };
  var url = games[gameId];
  if(!url) return;

  var overlay = document.createElement('div');
  overlay.id = 'gameplayOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#000;';

  var closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ Back';
  closeBtn.style.cssText = 'position:absolute;top:10px;right:10px;z-index:100000;background:rgba(0,0,0,0.8);color:white;border:1px solid #333;padding:8px 14px;border-radius:8px;font-size:13px;cursor:pointer;';
  closeBtn.onclick = function(){ overlay.remove(); };

  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.cssText = 'width:100%;height:100%;border:none;';

  overlay.appendChild(closeBtn);
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
}

function showPage(id,btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById(id).classList.add('active');
  if(btn) btn.classList.add('active'); closeLangMenu();
  if(id==='rank') loadLeaderboard('global');
  if(id==='profile') loadProfilePhoto();
}
function openUpgrade(){updateUpgradeUI();document.getElementById('upgradePage').classList.add('open');}

// إشعار البلوك عند فتح البوت (لما البلوك جاء من السيرفر وهو أوفلاين)
function showBlockNotification(recAmount, blockNum) {
  var old = document.getElementById('blockPopupOverlay');
  if(old) return; // ما نظهر مرتين

  var ol = document.createElement('div');
  ol.id = 'blockPopupOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;';

  var pp = document.createElement('div');
  pp.style.cssText = 'background:linear-gradient(180deg,#0a0005,#150008);border:2px solid #FF0000;border-radius:20px;padding:24px;width:85vw;max-width:320px;text-align:center;box-shadow:0 0 80px rgba(255,0,0,0.6);animation:blockAppear 0.5s ease;';
  pp.addEventListener('click', function(e){ e.stopPropagation(); });

  pp.innerHTML =
    '<style>@keyframes blockAppear{from{transform:scale(0.3);opacity:0}to{transform:scale(1);opacity:1}}</style>'+
    '<div style="font-size:52px;margin-bottom:6px;">⛏️</div>'+
    '<div style="font-family:Orbitron,sans-serif;font-size:16px;color:#FF0000;font-weight:bold;letter-spacing:1px;margin-bottom:4px;">BLOCK FOUND!</div>'+
    '<div style="font-size:11px;color:#555;margin-bottom:16px;">Block #'+blockNum+' • بينما كنت غائباً</div>'+
    '<div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.3);border-radius:12px;padding:16px;margin-bottom:14px;">'+
      '<div style="font-size:11px;color:#aaa;margin-bottom:6px;">🟢 REC Reward</div>'+
      '<div style="font-size:32px;color:#00FF88;font-family:Orbitron,sans-serif;font-weight:bold;">+'+Math.floor(recAmount)+' REC</div>'+
      '<div style="font-size:10px;color:#555;margin-top:4px;">تمت الإضافة لرصيدك تلقائياً ✅</div>'+
    '</div>'+
    '<div style="font-size:10px;color:#444;margin-bottom:14px;">📢 تم الإعلان في قناة REC Blocks</div>'+
    '<button onclick="saveData(true);document.getElementById(\'blockPopupOverlay\').remove()" style="background:linear-gradient(135deg,#CC0000,#FF2200);border:none;color:white;padding:13px;border-radius:12px;cursor:pointer;font-size:15px;font-weight:bold;width:100%;">🔴 COLLECT</button>';

  ol.addEventListener('click', function(e){ if(e.target===ol) ol.remove(); });
  ol.appendChild(pp);
  document.body.appendChild(ol);
}

// ====== BLOCK MINING (Passive - based on REC mining speed) ======
// كل 3 ثواني فيه فرصة 1/2000 إن البطاقات تضرب بلوك
// يعني بالمعدل كل ~100 دقيقة لو البطاقات شغالة
var BLOCK_CHANCE = 1/2000;
var blocksMined = 0;

function checkForBlock() {
  // فقط لو في سرعة REC حقيقية
  if(recPerSec <= 0) return;
  if(Math.random() > BLOCK_CHANCE) return;

  blocksMined++;
  var blockNum = blocksMined;

  // المكافأة = ساعة كاملة من التعدين
  var rewardRec = parseFloat((recPerSec * 3600).toFixed(6));
  var rewardRecord = Math.floor(recordPerSec * 3600);

  // حد أدنى للمكافأة
  if(rewardRec < 0.0001) rewardRec = 0.0001;
  if(rewardRecord < 500000) rewardRecord = 500000;

  // أضف المكافأة
  record += rewardRecord;
  if(typeof pendingRec !== 'undefined') pendingRec += rewardRec;
  else rec += rewardRec;
  saveData(true);
  updateUI();

  // أظهر popup
  showBlockPopup(blockNum, rewardRecord, rewardRec);

  // أبلغ السيرفر لنشره على القناة والجروع
  if(tgUser) {
    fetch('/api/block-found', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        telegramId: tgUser.id,
        blockReward: { record: rewardRecord, rec: rewardRec },
        blockNumber: blockNum
      })
    }).catch(function(){});
  }
}

function showBlockPopup(blockNum, rewardRecord, rewardRec) {
  // أزل أي popup قديم
  var old = document.getElementById('blockPopupOverlay');
  if(old) old.remove();

  var ol = document.createElement('div');
  ol.id = 'blockPopupOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;';

  var pp = document.createElement('div');
  pp.style.cssText = 'background:linear-gradient(180deg,#0a0005,#150008);border:2px solid #FF0000;border-radius:20px;padding:24px;width:85vw;max-width:320px;text-align:center;box-shadow:0 0 80px rgba(255,0,0,0.6);animation:blockAppear 0.4s ease;';
  pp.addEventListener('click', function(e){ e.stopPropagation(); });

  pp.innerHTML =
    '<style>@keyframes blockAppear{from{transform:scale(0.3) rotate(-5deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}</style>'+
    '<div style="font-size:52px;margin-bottom:6px;">⛏️</div>'+
    '<div style="font-family:Orbitron,sans-serif;font-size:20px;color:#FF0000;font-weight:bold;letter-spacing:2px;margin-bottom:2px;">BLOCK FOUND!</div>'+
    '<div style="font-size:11px;color:#555;margin-bottom:16px;">Block #'+blockNum+' • REC Mining</div>'+
    '<div style="background:rgba(255,0,0,0.1);border:1px solid rgba(255,0,0,0.3);border-radius:12px;padding:14px;margin-bottom:8px;">'+
      '<div style="font-size:11px;color:#aaa;margin-bottom:4px;">⚡ RECORD Reward</div>'+
      '<div style="font-size:26px;color:#FF4444;font-family:Orbitron,sans-serif;font-weight:bold;">+'+formatCost(rewardRecord)+'</div>'+
    '</div>'+
    '<div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);border-radius:12px;padding:14px;margin-bottom:14px;">'+
      '<div style="font-size:11px;color:#aaa;margin-bottom:4px;">🟢 REC Reward</div>'+
      '<div style="font-size:24px;color:#00FF88;font-family:Orbitron,sans-serif;font-weight:bold;">+'+rewardRec.toFixed(4)+'</div>'+
    '</div>'+
    '<div style="font-size:10px;color:#444;margin-bottom:14px;">📢 تم الإعلان في قناة REC Blocks</div>'+
    '<button onclick="saveData(true);document.getElementById(\'blockPopupOverlay\').remove()" style="background:linear-gradient(135deg,#CC0000,#FF2200);border:none;color:white;padding:13px;border-radius:12px;cursor:pointer;font-size:15px;font-weight:bold;width:100%;letter-spacing:1px;">🔴 COLLECT</button>';

  ol.addEventListener('click', function(e){ if(e.target===ol) ol.remove(); });
  ol.appendChild(pp);
  document.body.appendChild(ol);
}

// ====== HOME - TAP ======
function claimPendingRec(){
  if(pendingRec <= 0) return;
  rec += pendingRec;
  pendingRec = 0;
  saveData(true);
  updateUI();
  showToast('✅ +' + rec.toFixed(6) + ' REC');
}

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

// Heartbeat every 45 seconds - online status
setInterval(function(){
  if(tgUser) fetch('/api/user/heartbeat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId:tgUser.id})}).catch(function(){});
}, 45000);

// Save miningSpeed to server every 60 seconds
var _speedSaveTimer = 0;
setInterval(function(){
  _speedSaveTimer++;
  if(_speedSaveTimer >= 20 && tgUser) { // every 60s (20 × 3s)
    _speedSaveTimer = 0;
    fetch('/api/user/heartbeat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        telegramId: tgUser.id,
        miningSpeed: recPerSec,
        recordMiningSpeed: recordPerSec
      })
    }).catch(function(){});
  }
}, 3000);

// ====== MAIN INTERVAL (3s) ======
setInterval(function(){
  checkUpgradeTimers();
  // تعدين RECORD من البطاقات — مستقل
  if(recordPerSec>0) record+=recordPerSec*3;
  // تعدين REC — مع بوست VIP لو مفعّل
  if(recPerSec>0){
    var _effectiveRec = recPerSec;
    if(vipData && parseInt(vipData.tier||0)>=1 && parseInt(vipData.expiry||0)>Date.now() && vipData.boostDate===getTodayStr()){
      _effectiveRec *= 1.5;
    }
    pendingRec+=_effectiveRec*3;
    checkForBlock();
  }
  // شحن الطاقة — مستقل
  if(energy<maxEnergy) energy=Math.min(maxEnergy,energy+(maxEnergy/43200*3));
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
  s('pendingRecDisplay',pendingRec.toFixed(6));
  s('recMini',rec.toFixed(6));
  s('energyText',Math.floor(energy)+' / '+maxEnergy);
  s('profileRecord',Math.floor(record).toLocaleString());
  s('recPoolBalance',rec.toFixed(6));
  var eb=document.getElementById('energyBar');if(eb)eb.style.width=(energy/maxEnergy*100)+'%';
  // Mining speeds on home
  var recs=document.getElementById('recSpeedShow');
  var recs2=document.getElementById('recordSpeedShow');
  var _displayRec = recPerSec;
  if(vipData && parseInt(vipData.tier||0)>=1 && parseInt(vipData.expiry||0)>Date.now() && vipData.boostDate===getTodayStr()) _displayRec*=1.5;
  if(recs)recs.textContent=_displayRec>0?_displayRec.toFixed(8):'0.00000000';
  if(recs2)recs2.textContent=recordPerSec>0?Math.floor(recordPerSec).toLocaleString():'0';
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
  showToast('⚡ تمت تعبئة الطاقة! '+window.refillData.count+' فرص متبقية');
}

function loadRefillData(){
  // البيانات تتحمل من applyData — بس نتأكد من التاريخ
  var today=getTodayStr();
  if(!window.refillData || window.refillData.date!==today){
    window.refillData={date:today,count:3};
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
var adminComboSelection = [null, null, null];

function openCombo() {
  document.getElementById('comboOverlay').style.display = 'block';
  document.getElementById('comboPopup').style.display = 'block';
  loadComboData();
  if(tgUser && tgUser.id === ADMIN_TG_ID) {
    document.getElementById('comboAdminPanel').style.display = 'block';
    buildAdminComboSlots();
  }
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
  if(!tgUser || !comboData || !comboData.exists) return;
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
      loadComboData(); // refresh combo display
    }
  }).catch(function(){});
}

// ====== ADMIN COMBO SETTER ======
function buildAdminComboSlots() {
  var panel = document.getElementById('comboAdminSlots');
  if(!panel) return;
  var cats = typeof categories !== 'undefined' ? categories : [];
  var allCards = [];
  cats.forEach(function(cat, ci) {
    cat.cards.forEach(function(card, idx) {
      allCards.push({ key: ci+'_'+idx, label: (card.e||'🃏') + ' ' + (card.en||card.n||'Card'), ci: ci, idx: idx });
    });
  });

  panel.innerHTML = [0,1,2].map(function(slot) {
    return '<select id="adminComboSlot_'+slot+'" style="width:100%;background:rgba(0,0,0,0.5);border:1px solid rgba(255,100,50,0.3);color:white;padding:8px;border-radius:8px;font-size:11px;">' +
      '<option value="">-- بطاقة '+(slot+1)+' --</option>' +
      allCards.map(function(c) {
        return '<option value="'+c.key+'|'+c.ci+'|'+c.idx+'">'+c.label+'</option>';
      }).join('') +
      '</select>';
  }).join('');
}

function saveAdminCombo() {
  if(!tgUser) { showToast('❌ No tgUser'); return; }
  if(String(tgUser.id) !== String(ADMIN_TG_ID)) { showToast('❌ Not admin: '+tgUser.id); return; }
  var cards = [];
  for(var i=0;i<3;i++) {
    var sel = document.getElementById('adminComboSlot_'+i);
    if(!sel) { showToast('❌ Select '+i+' not found'); return; }
    if(!sel.value) { showToast('❌ اختر بطاقة '+(i+1)); return; }
    var parts = sel.value.split('|');
    if(parts.length < 3) { showToast('❌ قيمة خاطئة: '+sel.value); return; }
    cards.push({ key: parts[0], categoryIndex: parseInt(parts[1]), cardIndex: parseInt(parts[2]) });
  }
  if(cards[0].key===cards[1].key || cards[1].key===cards[2].key || cards[0].key===cards[2].key) {
    showToast('❌ لا تكرر نفس البطاقة'); return;
  }
  showToast('⏳ جاري الحفظ...');
  fetch('/api/combo/set', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ adminId: parseInt(tgUser.id), cards })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(d.success) { showToast('✅ تم حفظ الكومبو! ' + d.date); loadComboData(); }
    else showToast('❌ ' + JSON.stringify(d));
  }).catch(function(e){ showToast('❌ Fetch error: '+e.message); });
}
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

// ====== INVITE PAGE FUNCTIONS ======
var refData = { l1:[], l2:[], l3:[] };
var currentRefLevel = 1;

function switchInviteTab(tab, btn) {
  document.getElementById('inviteTabContent_invite').style.display = tab==='invite' ? 'block' : 'none';
  document.getElementById('inviteTabContent_referrals').style.display = tab==='referrals' ? 'block' : 'none';
  ['invite','referrals'].forEach(function(t){
    var b = document.getElementById('inviteTab_'+t);
    if(b) {
      if(t===tab) {
        b.style.background='rgba(255,100,50,0.15)';
        b.style.borderColor='rgba(255,100,50,0.5)';
        b.style.color='#FF6644';
      } else {
        b.style.background='rgba(255,255,255,0.04)';
        b.style.borderColor='rgba(255,255,255,0.08)';
        b.style.color='rgba(255,255,255,0.4)';
      }
    }
  });
  if(tab==='referrals') loadRefList();
}

function switchRefLevel(lvl) {
  currentRefLevel = lvl;
  [1,2,3].forEach(function(l){
    var b = document.getElementById('refLvlBtn_'+l);
    if(!b) return;
    if(l===lvl) {
      b.style.background='rgba(255,100,50,0.15)';
      b.style.borderColor='rgba(255,100,50,0.5)';
      b.style.color='#FF6644';
    } else {
      b.style.background='rgba(255,255,255,0.04)';
      b.style.borderColor='rgba(255,255,255,0.08)';
      b.style.color='rgba(255,255,255,0.3)';
    }
  });
  renderRefList();
}

function loadRefList() {
  if(!tgUser) return;
  var el = document.getElementById('refListContent');
  if(el) el.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.2);font-size:13px;">⏳ Loading...</div>';
  fetch('/api/referrals/'+tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      refData = d;
      renderRefList();
    })
    .catch(function(){
      var el = document.getElementById('refListContent');
      if(el) el.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.2);">Could not load</div>';
    });
}

function renderRefList() {
  var el = document.getElementById('refListContent');
  if(!el) return;
  var list = currentRefLevel===1 ? refData.l1 : currentRefLevel===2 ? refData.l2 : refData.l3;
  if(!list || list.length === 0) {
    el.innerHTML = '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;text-align:center;"><div style="font-size:32px;margin-bottom:8px;">👥</div><div style="font-size:13px;color:rgba(255,255,255,0.25);">No referrals yet</div></div>';
    return;
  }
  el.innerHTML = list.map(function(u){
    var name = u.username ? '@'+u.username : (u.firstName||'User');
    var speed = (u.miningSpeed||0).toFixed(6);
    var earned = (u.rec||0).toFixed(3);
    return '<div style="display:grid;grid-template-columns:1fr 80px 80px;gap:4px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 12px;margin-bottom:6px;align-items:center;">'+
      '<div style="font-size:13px;color:white;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+name+'</div>'+
      '<div style="font-size:10px;color:rgba(0,255,136,0.7);text-align:center;">'+speed+'</div>'+
      '<div style="font-size:11px;color:#00FF88;text-align:right;font-weight:700;">'+earned+'</div>'+
      '</div>';
  }).join('');
}

// Update invite link display when page loads
function updateInviteLinkDisplay() {
  var el = document.getElementById('inviteLinkDisplay');
  if(!el || !tgUser) return;
  var botUsername = 'RecMiningGame_bot';
  el.textContent = 'https://t.me/'+botUsername+'?start='+tgUser.id;
}

// ====== END INVITE PAGE ======

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
      // Sync VIP tier/expiry only — keep local daily state (boxes, boost, refill)
      if(serverData.vip && parseInt(serverData.vip.tier||0) > 0) {
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
      }
      // Sync record if server has significantly more
      if(serverData.record > record * 1.5) {
        applyData(serverData);
        updateUI();
      }
      // Sync pendingRec from server
      if(serverData.pendingRec && serverData.pendingRec > (typeof pendingRec!=='undefined'?pendingRec:0)) {
        if(typeof pendingRec!=='undefined') pendingRec = serverData.pendingRec;
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
