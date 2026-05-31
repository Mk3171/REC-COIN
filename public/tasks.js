function showTaskTab(name, btn){
  ['social','daily','missions'].forEach(function(t){
    document.getElementById('taskTab-'+t).style.display = t===name ? 'block' : 'none';
    document.getElementById('ttab_'+t).classList.remove('active');
  });
  btn.classList.add('active');
  if(name==='daily') renderDailyTasksUI();
  if(name==='missions') renderCardMissionsUI();
  if(name==='social') renderTwitterTasks();
}

// ====== TWITTER TASKS ======
var TWEET_URLS = [
  'https://x.com/mohamma33122570/status/2059639413643125243',
  'https://x.com/mohamma33122570/status/2059639523705839913',
  'https://x.com/mohamma33122570/status/2059639661262143794',
  'https://x.com/mohamma33122570/status/2059639750705738121',
  'https://x.com/mohamma33122570/status/2059639828250058910',
  'https://x.com/mohamma33122570/status/2059639902967308644',
  'https://x.com/mohamma33122570/status/2059639974689939719'
];

function renderTwitterTasks(){
  renderChannelTask('blocksChannelTask','join_blocks','⛏️ REC Blocks Channel','https://t.me/REC_Blocks',5);
  renderChannelTask('chatGroupTask','join_chat','💬 REC Mining Chat','https://t.me/REC_Mining_Chat',5);
  renderChannelTask('telegramFollowTask','telegram','📱 Join Telegram Group','https://t.me/Momokh1',5);
  renderChannelTask('twitterFollowTask','twitter','🐦 Follow on Twitter','https://x.com/mohamma33122570',5);
  renderTweetGroup('likeTasks','like','❤️ Like','like',5);
  renderTweetGroup('retweetTasks','rt','🔁 Retweet','retweet',5);
}

function renderChannelTask(containerId, taskId, label, url, recReward){
  var cont = document.getElementById(containerId);
  if(!cont) return;
  var done = completedTasks.indexOf(taskId) !== -1;
  var joinBtnId = taskId+'_join';
  var claimBtnId = taskId+'_claim';
  cont.innerHTML =
    '<div style="background:rgba(10,10,20,0.75);border:1px solid '+(done?'rgba(0,200,100,0.3)':'rgba(255,255,255,0.06)')+';border-radius:12px;padding:11px 12px;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center;">'+
      '<div>'+
        '<div style="font-size:13px;color:'+(done?'#4eff4e':'#ddd')+'">'+(done?'✅ ':'')+label+'</div>'+
        '<div style="font-size:11px;color:#00FF88;margin-top:2px;">+'+recReward+' REC</div>'+
      '</div>'+
      (done
        ? '<div style="font-size:11px;color:#4eff4e;padding:6px 10px;">Done ✅</div>'
        : '<div style="display:flex;gap:5px;">'+
            '<button id="'+joinBtnId+'" onclick="channelTaskOpen(\''+taskId+'\',\''+url+'\',\''+joinBtnId+'\',\''+claimBtnId+'\')" style="background:#1a1a1a;border:1px solid #333;color:white;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;">Join →</button>'+
            '<button id="'+claimBtnId+'" onclick="channelTaskClaim(\''+taskId+'\',\''+claimBtnId+'\','+recReward+')" disabled style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;opacity:0.4;">Claim</button>'+
          '</div>')+
    '</div>';
}

function channelTaskOpen(taskId, url, openBtnId, claimBtnId){
  if(completedTasks.indexOf(taskId)!==-1) return;
  window.Telegram.WebApp.openTelegramLink(url);
  var openBtn = document.getElementById(openBtnId);
  if(openBtn){ openBtn.disabled=true; openBtn.style.opacity='0.4'; }
  setTimeout(function(){
    var claimBtn = document.getElementById(claimBtnId);
    if(claimBtn){ claimBtn.disabled=false; claimBtn.style.opacity='1'; }
  }, 10000);
}

function channelTaskClaim(taskId, claimBtnId, recReward){
  if(completedTasks.indexOf(taskId)!==-1){ showToast(t('toastAlready')); return; }
  completedTasks.push(taskId);
  if(recReward >= 1000) {
    record += recReward;
    showToast('✅ +'+formatCost(recReward)+' RECORD earned!');
  } else {
    rec += recReward;
    showToast('✅ +'+recReward+' REC earned!');
  }
  saveData(true); updateUI();
  renderTwitterTasks();
}



function renderTweetGroup(containerId, prefix, label, action, recReward){
  var cont = document.getElementById(containerId);
  if(!cont) return;
  var html = '';
  TWEET_URLS.forEach(function(url, i){
    var taskId = prefix+'_'+(i+1);
    var done = completedTasks.indexOf(taskId) !== -1;
    var openId = prefix+'Open'+(i+1);
    var claimId = prefix+'Claim'+(i+1);
    var intentUrl = action==='like'
      ? 'https://twitter.com/intent/like?tweet_id='+url.split('/status/')[1].split('?')[0]
      : 'https://twitter.com/intent/retweet?tweet_id='+url.split('/status/')[1].split('?')[0];
    html +=
      '<div style="background:rgba(10,10,20,0.75);border:1px solid '+(done?'rgba(0,200,100,0.3)':'rgba(255,255,255,0.06)')+';border-radius:12px;padding:11px 12px;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center;">'+
        '<div>'+
          '<div style="font-size:13px;color:'+(done?'#4eff4e':'#ddd')+'">'+(done?'✅ ':'')+''+label+' — Tweet #'+(i+1)+'</div>'+
          '<div style="font-size:11px;color:#00FF88;margin-top:2px;">+'+recReward+' REC</div>'+
        '</div>'+
        (done
          ? '<div style="font-size:11px;color:#4eff4e;padding:6px 10px;">Done ✅</div>'
          : '<div style="display:flex;gap:5px;">'+
              '<button id="'+openId+'" onclick="twitterTaskOpen(\''+taskId+'\',\''+intentUrl+'\',\''+openId+'\',\''+claimId+'\')" style="background:#1a1a1a;border:1px solid #333;color:white;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;">'+label+' →</button>'+
              '<button id="'+claimId+'" onclick="twitterTaskClaim(\''+taskId+'\',\''+claimId+'\',\''+openId+'\','+recReward+')" disabled style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;opacity:0.4;">Claim</button>'+
            '</div>')+
      '</div>';
  });
  cont.innerHTML = html;
}

function twitterTaskOpen(taskId, url, openBtnId, claimBtnId){
  if(completedTasks.indexOf(taskId)!==-1) return;
  window.open(url,'_blank');
  var openBtn = document.getElementById(openBtnId);
  if(openBtn){ openBtn.disabled=true; openBtn.style.opacity='0.4'; }
  setTimeout(function(){
    var claimBtn = document.getElementById(claimBtnId);
    if(claimBtn){ claimBtn.disabled=false; claimBtn.style.opacity='1'; }
  }, 15000);
}

function twitterTaskClaim(taskId, claimBtnId, openBtnId, recReward){
  if(completedTasks.indexOf(taskId)!==-1){ showToast(t('toastAlready')); return; }
  completedTasks.push(taskId);
  rec += recReward;
  saveData(true); updateUI();
  showToast('✅ +'+recReward+' REC earned!');
  renderTwitterTasks();
}

// ====== REC → RECORD EXCHANGE ======
var EXCHANGE_RATE = 300000000; // 1 REC = 300,000,000 RECORD
var EXCHANGE_DAILY_LIMIT = 10; // 10 REC per day max
var EXCHANGE_MIN = 0.05; // minimum 0.05 REC

// RECORD → REC: 1,000,000,000 RECORD = 0.5 REC
var RECORD_TO_REC_RATE = 0.5 / 1000000000; // per RECORD
var RECORD_TO_REC_MIN  = 100000000;         // 100 مليون حد أدنى
var RECORD_TO_REC_MAX  = 1000000000000;     // 1 تريليون حد أقصى

function openExchange(){
  var popup = document.createElement('div');
  popup.id = 'exchangePopup';
  popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(180deg,#0d0d14,#111118);border:1px solid rgba(0,255,136,0.3);border-radius:18px;padding:20px;width:86vw;max-width:320px;z-index:10000;backdrop-filter:blur(15px);box-shadow:0 0 50px rgba(0,255,136,0.1);';

  popup.addEventListener('click', function(e){ e.stopPropagation(); });
  popup.addEventListener('touchend', function(e){ e.stopPropagation(); });

  var activeTab = 'rec'; // 'rec' or 'record'

  function renderExchange(){
    var tabRecStyle    = activeTab==='rec'    ? 'background:rgba(0,255,136,0.15);border-bottom:2px solid #00FF88;color:#00FF88;' : 'color:#555;border-bottom:2px solid transparent;';
    var tabRecordStyle = activeTab==='record' ? 'background:rgba(255,100,50,0.15);border-bottom:2px solid #FF6644;color:#FF6644;' : 'color:#555;border-bottom:2px solid transparent;';

    var body = '';
    if(activeTab === 'rec') {
      // REC → RECORD
      var inputVal = parseFloat(document.getElementById('excInput') ? document.getElementById('excInput').value : 0) || 0;
      body =
        '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:10px;padding:10px;margin-bottom:4px;display:flex;justify-content:space-between;">'+
          '<span style="color:#aaa;font-size:12px;">REC:</span>'+
          '<span style="color:#00FF88;font-size:13px;font-weight:bold;">'+rec.toFixed(6)+'</span>'+
        '</div>'+
        '<div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.15);border-radius:10px;padding:7px 10px;margin-bottom:6px;display:flex;justify-content:space-between;">'+
          '<span style="color:#aaa;font-size:11px;">'+(currentLang==='ar'?'متبقي اليوم:':'Today remaining:')+'</span>'+
          '<span style="color:#FFD700;font-size:11px;font-weight:bold;">'+(EXCHANGE_DAILY_LIMIT-getExchangedToday()).toFixed(3)+' / '+EXCHANGE_DAILY_LIMIT+' REC</span>'+
        '</div>'+
        '<div style="color:#aaa;font-size:11px;text-align:center;margin-bottom:4px;">1 REC = '+EXCHANGE_RATE.toLocaleString()+' RECORD</div>'+
        '<div style="color:#888;font-size:10px;text-align:center;margin-bottom:8px;">'+
          (currentLang==='ar'?'حد أدنى: 0.05 REC | أقصى يومي: 10 REC':'Min: 0.05 REC | Daily max: 10 REC')+
        '</div>'+
        '<input id="excInput" type="number" min="0" step="0.000001" placeholder="'+t('qbSwap')+' REC"'+
          ' style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(0,255,136,0.3);border-radius:10px;padding:10px;color:white;font-size:14px;text-align:center;box-sizing:border-box;outline:none;margin-bottom:8px;"'+
          ' oninput="document.getElementById(\'excPreview\').textContent=\'≈ \'+(Math.floor((parseFloat(this.value)||0)*'+EXCHANGE_RATE+')).toLocaleString()+\' RECORD\'">'+
        '<div id="excPreview" style="text-align:center;color:#FF8800;font-size:13px;margin-bottom:14px;">≈ 0 RECORD</div>'+
        '<div style="display:flex;gap:8px;">'+
          '<button onclick="confirmExchange()" style="flex:1;background:linear-gradient(135deg,#005522,#00AA44);border:none;color:white;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;">✅ '+t('qbExchange')+'</button>'+
          '<button onclick="document.getElementById(\'exchangeOverlay\').remove();document.getElementById(\'exchangePopup\').remove();" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#aaa;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;">'+t('backBtn').replace('← ','')+'</button>'+
        '</div>';
    } else {
      // RECORD → REC
      var recBal = Math.floor(record);
      body =
        '<div style="background:rgba(255,100,50,0.06);border:1px solid rgba(255,100,50,0.2);border-radius:10px;padding:10px;margin-bottom:6px;display:flex;justify-content:space-between;">'+
          '<span style="color:#aaa;font-size:12px;">RECORD:</span>'+
          '<span style="color:#FF6644;font-size:13px;font-weight:bold;">'+recBal.toLocaleString()+'</span>'+
        '</div>'+
        '<div style="color:#aaa;font-size:10px;text-align:center;margin-bottom:6px;">1B RECORD = 0.5 REC &nbsp;|&nbsp; '+
          (currentLang==='ar'?'حد أدنى':'Min')+': 100M &nbsp;|&nbsp; '+
          (currentLang==='ar'?'حد أقصى':'Max')+': 1T</div>'+
        '<input id="excInput2" type="number" min="'+RECORD_TO_REC_MIN+'" max="'+RECORD_TO_REC_MAX+'" step="1000000" placeholder="'+(currentLang==='ar'?'كمية RECORD':'Amount RECORD')+'"'+
          ' style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,100,50,0.3);border-radius:10px;padding:10px;color:white;font-size:14px;text-align:center;box-sizing:border-box;outline:none;margin-bottom:8px;"'+
          ' oninput="var v=parseFloat(this.value)||0;document.getElementById(\'excPreview2\').textContent=\'≈ \'+(v*'+RECORD_TO_REC_RATE+').toFixed(6)+\' REC\'">'+
        '<div id="excPreview2" style="text-align:center;color:#00FF88;font-size:13px;margin-bottom:14px;">≈ 0 REC</div>'+
        '<div style="display:flex;gap:8px;">'+
          '<button onclick="confirmExchangeRecord()" style="flex:1;background:linear-gradient(135deg,#660022,#CC0044);border:none;color:white;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;">✅ '+t('qbExchange')+'</button>'+
          '<button onclick="document.getElementById(\'exchangeOverlay\').remove();document.getElementById(\'exchangePopup\').remove();" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#aaa;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;">'+t('backBtn').replace('← ','')+'</button>'+
        '</div>';
    }

    popup.innerHTML =
      '<div style="display:flex;margin-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.08);">'+
        '<div onclick="window._exchTab(\'rec\')" style="flex:1;text-align:center;padding:8px 4px;font-size:12px;font-weight:700;cursor:pointer;'+tabRecStyle+'">REC → RECORD</div>'+
        '<div onclick="window._exchTab(\'record\')" style="flex:1;text-align:center;padding:8px 4px;font-size:12px;font-weight:700;cursor:pointer;'+tabRecordStyle+'">RECORD → REC</div>'+
      '</div>'+
      body;

    window._exchTab = function(tab){ activeTab = tab; renderExchange(); };
  }

  var overlay = document.createElement('div');
  overlay.id = 'exchangeOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;';
  overlay.addEventListener('click', function(e){ e.stopPropagation(); overlay.remove(); popup.remove(); });
  overlay.addEventListener('touchend', function(e){ e.stopPropagation(); overlay.remove(); popup.remove(); });

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
  renderExchange();
}

function getExchangedToday(){
  var key = 'exchRec_' + getTodayStr();
  try { return parseFloat(localStorage.getItem(key)||'0'); } catch(e){ return 0; }
}
function addExchangedToday(amount){
  var key = 'exchRec_' + getTodayStr();
  try { localStorage.setItem(key, (getExchangedToday()+amount).toFixed(6)); } catch(e){}
}

function confirmExchange(){
  var input = document.getElementById('excInput');
  if(!input) return;
  var amount = parseFloat(input.value) || 0;
  if(amount < EXCHANGE_MIN){
    showToast('❌ '+(currentLang==='ar'?'الحد الأدنى 0.05 REC':'Min 0.05 REC'));
    return;
  }
  if(amount > rec){ showToast('❌ '+(currentLang==='ar'?'رصيد REC غير كافٍ':'Not enough REC')); return; }
  var usedToday = getExchangedToday();
  if(usedToday >= EXCHANGE_DAILY_LIMIT){
    showToast('❌ '+(currentLang==='ar'?'وصلت الحد اليومي (10 REC)':'Daily limit reached (10 REC)'));
    return;
  }
  var remaining = EXCHANGE_DAILY_LIMIT - usedToday;
  if(amount > remaining) amount = Math.floor(remaining * 1000000) / 1000000;
  var gain = Math.floor(amount * EXCHANGE_RATE);
  rec -= amount;
  record += gain;
  addExchangedToday(amount);
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  dailyTasksData.spent += gain;
  checkDailyTaskProgress();
  saveData(true); updateUI();
  var ol = document.getElementById('exchangeOverlay');
  var pp = document.getElementById('exchangePopup');
  if(ol) ol.remove(); if(pp) pp.remove();
  showToast('✅ +'+gain.toLocaleString()+' RECORD');
}

function confirmExchangeRecord(){
  var input = document.getElementById('excInput2');
  if(!input) return;
  var amount = parseFloat(input.value) || 0;
  if(amount < RECORD_TO_REC_MIN){
    showToast('❌ '+(currentLang==='ar'?'الحد الأدنى 100 مليون RECORD':'Min 100M RECORD'));
    return;
  }
  if(amount > RECORD_TO_REC_MAX){
    showToast('❌ '+(currentLang==='ar'?'الحد الأقصى 1 تريليون RECORD':'Max 1T RECORD'));
    return;
  }
  if(amount > record){
    showToast('❌ '+(currentLang==='ar'?'رصيد RECORD غير كافٍ':'Not enough RECORD'));
    return;
  }
  var gain = parseFloat((amount * RECORD_TO_REC_RATE).toFixed(6));
  record -= amount;
  rec += gain;
  saveData(true); updateUI();
  var ol = document.getElementById('exchangeOverlay');
  var pp = document.getElementById('exchangePopup');
  if(ol) ol.remove(); if(pp) pp.remove();
  showToast('✅ +'+gain.toFixed(6)+' REC');
}

// ====== HELPER ======
function getTodayStr(){ return new Date().toISOString().split('T')[0]; }

// ====== DAILY LOGIN ======
var DAILY_REWARDS=[
  {record:1000,rec:0},{record:2000,rec:0},{record:3000,rec:0},
  {record:5000,rec:0},{record:8000,rec:0},{record:12000,rec:0},
  {record:20000,rec:0.001},
  {record:30000,rec:0},{record:40000,rec:0},{record:50000,rec:0},
  {record:70000,rec:0},{record:90000,rec:0},{record:120000,rec:0},
  {record:150000,rec:0.01},
  {record:200000,rec:0},{record:250000,rec:0},{record:300000,rec:0},
  {record:400000,rec:0},{record:500000,rec:0},{record:600000,rec:0},
  {record:800000,rec:0.1},
  {record:1000000,rec:0},{record:1200000,rec:0},{record:1500000,rec:0},
  {record:2000000,rec:0.5},
  {record:2500000,rec:0},
  {record:3000000,rec:1},
  {record:4000000,rec:2},
  {record:5000000,rec:3},
  {record:10000000,rec:5}
];

function openDailyLogin(){
  var today=getTodayStr();
  var login=dailyLogin;
  var alreadyClaimed=login.lastDate===today;
  if(login.lastDate&&!alreadyClaimed){
    var diff=Math.round((new Date(today)-new Date(login.lastDate))/86400000);
    if(diff>1){login.day=0;}
  }
  var currentDay=login.day%30;
  var reward=DAILY_REWARDS[currentDay];

  var ol=document.createElement('div');
  ol.id='dailyOverlay';
  ol.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px 0;';

  var grid='';
  for(var i=0;i<30;i++){
    var r=DAILY_REWARDS[i];
    var isClaimed=i<currentDay||(i===currentDay&&alreadyClaimed);
    var isCurr=i===currentDay&&!alreadyClaimed;
    var bg=isClaimed?'rgba(0,120,0,0.3)':isCurr?'rgba(255,215,0,0.18)':'rgba(255,255,255,0.03)';
    var brd=isClaimed?'#1a7a1a':isCurr?'#FFD700':'#1a1a2a';
    var tc=isClaimed?'#4eff4e':isCurr?'#FFD700':'#555';
    grid+='<div style="background:'+bg+';border:1px solid '+brd+';border-radius:8px;padding:5px 3px;text-align:center;">';
    if(isClaimed) grid+='<div style="font-size:13px;">✅</div>';
    else grid+='<div style="font-size:10px;color:'+tc+';">'+formatCost(r.record)+'</div>';
    if(r.rec>0&&!isClaimed) grid+='<div style="font-size:8px;color:#00FF88;">🟢'+r.rec+'</div>';
    grid+='<div style="font-size:8px;color:'+tc+';">'+(i+1)+'</div></div>';
  }

  var pp=document.createElement('div');
  pp.style.cssText='background:linear-gradient(180deg,#0a0a18,#111118);border:1px solid rgba(255,215,0,0.35);border-radius:20px;padding:20px;width:88vw;max-width:360px;';
  pp.addEventListener('click',function(e){e.stopPropagation();});
  pp.innerHTML=
    '<div style="text-align:center;margin-bottom:14px;">'+
      '<div style="font-size:30px;margin-bottom:4px;">📅</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:15px;color:#FFD700;">'+t('dailyRewardTitle')+'</div>'+
      '<div style="font-size:11px;color:#666;margin-top:3px;">'+t('dailyDay',{n:currentDay+1})+'</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:14px;">'+grid+'</div>'+
    (!alreadyClaimed?
      '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.3);border-radius:12px;padding:12px;margin-bottom:12px;text-align:center;">'+
        '<div style="font-size:11px;color:#aaa;margin-bottom:5px;">Today\'s Reward</div>'+
        '<div style="font-size:18px;color:#FFD700;font-family:Orbitron,sans-serif;font-weight:bold;">'+formatCost(reward.record)+' RECORD</div>'+
        (reward.rec>0?'<div style="font-size:15px;color:#00FF88;margin-top:3px;">+ '+reward.rec+' REC 🟢</div>':'')+
      '</div>':
      '<div style="background:rgba(0,100,0,0.12);border:1px solid #1a5c1a;border-radius:12px;padding:12px;margin-bottom:12px;text-align:center;">'+
        '<div style="color:#4eff4e;font-size:13px;">'+t('dailyAlreadyClaimed')+'</div>'+
        '<div style="color:#555;font-size:10px;margin-top:3px;">'+t('dailyComeBackTmr')+'</div>'+
      '</div>')+
    '<div style="display:flex;gap:8px;">'+
      (!alreadyClaimed?
        '<button onclick="claimDailyReward()" style="flex:1;background:linear-gradient(135deg,#886600,#FFD700);border:none;color:#000;padding:11px;border-radius:10px;font-size:14px;font-weight:bold;cursor:pointer;">🎁 Claim!</button>':
        '<button disabled style="flex:1;background:#222;border:1px solid #333;color:#555;padding:11px;border-radius:10px;font-size:13px;cursor:not-allowed;">Claimed ✅</button>')+
      '<button onclick="document.getElementById(\'dailyOverlay\').remove();" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);color:#aaa;padding:11px 15px;border-radius:10px;font-size:14px;cursor:pointer;">✕</button>'+
    '</div>';

  ol.addEventListener('click',function(e){if(e.target===ol)ol.remove();});
  ol.appendChild(pp); document.body.appendChild(ol);
}

function claimDailyReward(){
  var today=getTodayStr();
  if(dailyLogin.lastDate===today){showToast(t('dailyAlreadyClaimed'));return;}
  var currentDay=dailyLogin.day%30;
  var reward=DAILY_REWARDS[currentDay];
  record+=reward.record;
  if(reward.rec>0) rec+=reward.rec;
  dailyLogin.day=currentDay+1; dailyLogin.lastDate=today;
  saveData(true); updateUI();
  var ol=document.getElementById('dailyOverlay');
  if(ol)ol.remove();
  showToast('🎁 +'+formatCost(reward.record)+' RECORD'+(reward.rec>0?' +'+reward.rec+' REC':'')+'!');
  openDailyLogin();
}

// ====== MYSTERY BOX ======
function openMysteryBox(){
  var today=getTodayStr();
  var alreadyOpen=mysteryLastDate===today;

  var ol=document.createElement('div');
  ol.id='mysteryOverlay';
  ol.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;';
  ol.addEventListener('click',function(e){if(e.target===ol)ol.remove();});

  var pp=document.createElement('div');
  pp.style.cssText='background:linear-gradient(180deg,#0d0010,#150020);border:1px solid rgba(180,0,255,0.4);border-radius:20px;padding:22px 20px;width:82vw;max-width:300px;text-align:center;';
  pp.addEventListener('click',function(e){e.stopPropagation();});

  if(alreadyOpen){
    pp.innerHTML=
      '<div style="font-size:50px;margin-bottom:10px;filter:grayscale(1);">📦</div>'+
      '<div style="font-size:16px;color:#aaa;margin-bottom:6px;">Mystery Box</div>'+
      '<div style="color:#555;font-size:12px;margin-bottom:16px;">'+t('mysteryAlready')+'</div>'+
      '<button onclick="document.getElementById(\'mysteryOverlay\').remove();" style="background:#1a1a1a;border:1px solid #333;color:#aaa;padding:10px 24px;border-radius:10px;cursor:pointer;">Close</button>';
  } else {
    pp.innerHTML=
      '<div id="mysteryBox" style="font-size:60px;margin-bottom:10px;cursor:pointer;animation:boxFloat 2s ease-in-out infinite;transition:transform 0.2s;" onclick="revealMystery()">📦</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:15px;color:#CC88FF;margin-bottom:6px;">Mystery Box</div>'+
      '<div style="color:#888;font-size:11px;margin-bottom:16px;">Tap the box to reveal your daily prize!</div>'+
      '<div style="color:#555;font-size:10px;">1 free box per day</div>'+
      '<style>@keyframes boxFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}</style>';
  }

  ol.appendChild(pp); document.body.appendChild(ol);
}

function revealMystery(){
  var today=getTodayStr();
  if(mysteryLastDate===today){showToast('Already opened today!');return;}

  var roll=Math.random()*100;
  var reward;
  if(roll<40)      reward={type:'record',amount:Math.floor(5000+Math.random()*45000),label:'RECORD'};
  else if(roll<65) reward={type:'record',amount:Math.floor(50000+Math.random()*450000),label:'RECORD'};
  else if(roll<80) reward={type:'record',amount:Math.floor(500000+Math.random()*1500000),label:'RECORD'};
  else if(roll<90) reward={type:'record',amount:Math.floor(2000000+Math.random()*8000000),label:'RECORD'};
  else if(roll<96) reward={type:'rec',amount:parseFloat((0.001+Math.random()*0.009).toFixed(4)),label:'REC'};
  else if(roll<99) reward={type:'rec',amount:parseFloat((0.01+Math.random()*0.09).toFixed(4)),label:'REC'};
  else             reward={type:'rec',amount:parseFloat((0.1+Math.random()*0.4).toFixed(4)),label:'REC'};

  if(reward.type==='record') record+=reward.amount;
  else rec+=reward.amount;
  mysteryLastDate=today;
  saveData(true); updateUI();

  var pp=document.querySelector('#mysteryOverlay > div');
  if(!pp)return;
  var isRec=reward.type==='rec';
  var emoji=isRec?'🟢':'💥';
  var color=isRec?'#00FF88':'#FFD700';
  var amtStr=isRec?reward.amount+' REC':formatCost(reward.amount)+' RECORD';
  var rarity=roll<40?'Common':roll<65?'Uncommon':roll<80?'Rare':roll<90?'Epic':roll<96?'Legendary':'MYTHIC';
  var rarityColor=roll<40?'#888':roll<65?'#4488FF':roll<80?'#AA44FF':roll<90?'#FF8800':roll<96?'#FFD700':'#FF0055';

  pp.innerHTML=
    '<div style="font-size:60px;margin-bottom:8px;animation:popIn 0.4s ease;">'+emoji+'</div>'+
    '<div style="font-family:Orbitron,sans-serif;font-size:13px;color:'+rarityColor+';margin-bottom:4px;">'+rarity+'!</div>'+
    '<div style="font-size:24px;color:'+color+';font-family:Orbitron,sans-serif;font-weight:bold;margin:10px 0;">+'+amtStr+'</div>'+
    '<div style="color:#666;font-size:10px;margin-bottom:16px;">Added to your balance</div>'+
    '<button onclick="document.getElementById(\'mysteryOverlay\').remove();" style="background:linear-gradient(135deg,#4a0080,#8800FF);border:none;color:white;padding:10px 28px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;">Awesome! 🎉</button>'+
    '<style>@keyframes popIn{from{transform:scale(0)}to{transform:scale(1)}}</style>';
}

// ====== DAILY TASKS ======
var DAILY_TASK_POOL=[
  {id:'tap50',  tKey:'taskTapN',         tParam:{n:50},   type:'taps',    target:50,    reward:{record:5000}},
  {id:'tap100', tKey:'taskTapN',         tParam:{n:100},  type:'taps',    target:100,   reward:{record:12000}},
  {id:'tap200', tKey:'taskTapN',         tParam:{n:200},  type:'taps',    target:200,   reward:{record:25000}},
  {id:'tap500', tKey:'taskTapN',         tParam:{n:500},  type:'taps',    target:500,   reward:{record:70000}},
  {id:'upg1',   tKey:'taskUpgradeNCards',tParam:{n:1},    type:'upgrades',target:1,     reward:{record:15000}},
  {id:'upg3',   tKey:'taskUpgradeNCards',tParam:{n:3},    type:'upgrades',target:3,     reward:{record:50000}},
  {id:'upg5',   tKey:'taskUpgradeNCards',tParam:{n:5},    type:'upgrades',target:5,     reward:{record:120000}},
  {id:'spend50k', tKey:'taskSpendN',     tParam:{n:'50K'},type:'spent',   target:50000, reward:{record:30000}},
  {id:'spend500k',tKey:'taskSpendN',     tParam:{n:'500K'},type:'spent',  target:500000,reward:{record:200000}},
];

function getTodayTaskIndices(){
  var d=getTodayStr();
  var seed=0;
  for(var i=0;i<d.length;i++) seed=((seed*31)+d.charCodeAt(i))&0xFFFFFF;
  var pool=DAILY_TASK_POOL.slice();
  var picked=[];
  for(var j=0;j<3;j++){
    var idx=seed%pool.length;
    picked.push(pool.splice(idx,1)[0]);
    seed=Math.floor(seed/7)+j*13+1;
  }
  return picked;
}

function resetDailyTasks(today){
  dailyTasksData={date:today,done:[],taps:0,upgrades:0,spent:0};
}

function checkDailyTaskProgress(){
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  var tasks=getTodayTaskIndices();
  tasks.forEach(function(task){
    if(dailyTasksData.done.indexOf(task.id)!==-1) return;
    var prog=dailyTasksData[task.type]||0;
    if(prog>=task.target){
      dailyTasksData.done.push(task.id);
      if(task.reward.record) record+=task.reward.record;
      if(task.reward.rec) rec+=task.reward.rec;
      saveData(true); updateUI();
      showToast('✅ Task done! +'+formatCost(task.reward.record||0)+' RECORD');
    }
  });
  renderDailyTasksUI();
}

function renderDailyTasksUI(){
  var cont=document.getElementById('dailyTasksCont');
  if(!cont)return;
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  var tasks=getTodayTaskIndices();
  var html='';
  tasks.forEach(function(task){
    var done=dailyTasksData.done.indexOf(task.id)!==-1;
    var prog=Math.min(dailyTasksData[task.type]||0,task.target);
    var pct=Math.round(prog/task.target*100);
    var label=t(task.tKey, task.tParam);
    var rewardStr=task.reward.record?formatCost(task.reward.record)+' RECORD':(task.reward.rec+' REC');
    html+=
      '<div style="background:'+(done?'rgba(0,80,0,0.3)':'rgba(10,10,20,0.7)')+';border:1px solid '+(done?'#1a7a1a':'rgba(255,255,255,0.07)')+';border-radius:12px;padding:12px;margin-bottom:8px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">'+
          '<div style="font-size:12px;color:'+(done?'#4eff4e':'#ddd')+';flex:1;">'+label+'</div>'+
          '<div style="font-size:11px;color:'+(done?'#4eff4e':'#FFD700')+';margin-left:8px;white-space:nowrap;">'+(done?'✅ Done':'🏆 '+rewardStr)+'</div>'+
        '</div>'+
        (!done?
          '<div style="background:rgba(255,255,255,0.05);border-radius:6px;height:5px;overflow:hidden;">'+
            '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#FF4400,#FFD700);border-radius:6px;transition:width 0.3s;"></div>'+
          '</div>'+
          '<div style="font-size:9px;color:#555;text-align:right;margin-top:3px;">'+prog+' / '+task.target+'</div>':'')+
      '</div>';
  });
  cont.innerHTML=html;
}

// ====== CARD MISSIONS (in Tasks page) ======
var CARD_MISSIONS=[
  {id:'cm_naruto5', tKey:'taskUpgradeCard',tParam:{card:'Naruto',n:5},  cardKey:'0_0', reqLvl:5,  reward:{rec:0.005}},
  {id:'cm_goku10',  tKey:'taskUpgradeCard',tParam:{card:'Goku',n:10},   cardKey:'0_1', reqLvl:10, reward:{rec:0.01}},
  {id:'cm_luffy8',  tKey:'taskUpgradeCard',tParam:{card:'Luffy',n:8},   cardKey:'0_2', reqLvl:8,  reward:{rec:0.008}},
  {id:'cm_gojo20',  tKey:'taskUpgradeCard',tParam:{card:'Gojo',n:20},   cardKey:'0_24',reqLvl:20, reward:{rec:0.1}},
  {id:'cm_ferrari5',tKey:'taskUpgradeCard',tParam:{card:'Ferrari SF90',n:5},cardKey:'1_0',reqLvl:5,reward:{rec:0.005}},
  {id:'cm_lambo10', tKey:'taskUpgradeCard',tParam:{card:'Lamborghini',n:10},cardKey:'1_1',reqLvl:10,reward:{rec:0.015}},
  {id:'cm_any25',   tKey:'taskAnyCard',    tParam:{n:25},               cardKey:'any', reqLvl:25, reward:{rec:0.1}},
  {id:'cm_any50',   tKey:'taskAnyCard',    tParam:{n:50},               cardKey:'any', reqLvl:50, reward:{rec:1}},
  {id:'cm_any75',   tKey:'taskAnyCard',    tParam:{n:75},               cardKey:'any', reqLvl:75, reward:{rec:5}},
  {id:'cm_any100',  tKey:'taskAnyCard',    tParam:{n:100},              cardKey:'any', reqLvl:100,reward:{rec:15}},
];

function checkCardMissions(){
  var changed=false;
  CARD_MISSIONS.forEach(function(m){
    if(cardTasksClaimed.indexOf(m.id)!==-1) return;
    var met=false;
    if(m.cardKey==='any'){
      met=Object.keys(cardLevels).some(function(k){return (cardLevels[k]||0)>=m.reqLvl;});
    } else {
      met=(cardLevels[m.cardKey]||0)>=m.reqLvl;
    }
    if(met){
      cardTasksClaimed.push(m.id);
      if(m.reward.rec) rec+=m.reward.rec;
      if(m.reward.record) record+=m.reward.record;
      changed=true;
      showToast('🎯 Mission done! +'+m.reward.rec+' REC');
    }
  });
  if(changed){saveData(true);updateUI();renderCardMissionsUI();}
}

function renderCardMissionsUI(){
  var cont=document.getElementById('cardMissionsCont');
  if(!cont)return;
  var html='';
  CARD_MISSIONS.forEach(function(m){
    var done=cardTasksClaimed.indexOf(m.id)!==-1;
    var label=t(m.tKey, m.tParam);
    var prog=0,target=m.reqLvl;
    if(m.cardKey==='any'){
      Object.keys(cardLevels).forEach(function(k){prog=Math.max(prog,cardLevels[k]||0);});
    } else {
      prog=cardLevels[m.cardKey]||0;
    }
    prog=Math.min(prog,target);
    var pct=Math.round(prog/target*100);
    html+=
      '<div style="background:'+(done?'rgba(0,80,0,0.3)':'rgba(10,10,20,0.7)')+';border:1px solid '+(done?'#1a7a1a':'rgba(0,255,136,0.12)')+';border-radius:12px;padding:12px;margin-bottom:8px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">'+
          '<div style="font-size:12px;color:'+(done?'#4eff4e':'#ddd')+';flex:1;">'+label+'</div>'+
          '<div style="font-size:11px;color:'+(done?'#4eff4e':'#00FF88')+';margin-left:8px;white-space:nowrap;">'+(done?'✅':'🟢 +'+m.reward.rec+' REC')+'</div>'+
        '</div>'+
        (!done?
          '<div style="background:rgba(255,255,255,0.05);border-radius:6px;height:5px;overflow:hidden;">'+
            '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#00AA44,#00FF88);border-radius:6px;"></div>'+
          '</div>'+
          '<div style="font-size:9px;color:#555;text-align:right;margin-top:3px;">Lv '+prog+' / '+target+'</div>':'')+
      '</div>';
  });
  cont.innerHTML=html;
}

function initNewFeatures(){
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  renderDailyTasksUI();
  renderCardMissionsUI();
  renderTwitterTasks();
}
function upgradeTap(){
  var cost=getTapCost(tapLevelVal);
  if(record<cost||tapLevelVal>=100)return;
  record-=cost; tapLevelVal++;
  tapPowerVal=(tapLevelVal+1)*2;
  saveData(true); updateUpgradeUI(); updateUI();
}
function upgradeEnergy(){
  var cost=getEnergyCost(energyLevelVal);
  if(record<cost||energyLevelVal>=100)return;
  record-=cost; energyLevelVal++;
  maxEnergy=Math.floor(1000*Math.pow(10000,energyLevelVal/99));
  saveData(true); updateUpgradeUI(); updateUI();
}

function useVIPBoost() {
  if(!vipData || parseInt(vipData.tier||0) < 1 || parseInt(vipData.expiry||0) <= Date.now()) return;
  var today = getTodayStr();
  if(vipData.boostDate === today) { showToast('✅ البوست مفعّل اليوم مسبقاً'); return; }
  vipData.boostDate = today;
  saveData(true);
  showToast('⚡ تم تفعيل ×١.٥ تعدين REC لبقية اليوم!');
  renderVIPPage();
}

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
      t('recYourSpeed') + ' ' + recPerSec.toFixed(8) + ' REC/s</div>') +

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

