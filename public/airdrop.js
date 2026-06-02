// ====== AIRDROP SYSTEM — airdrop.js ======

var AIRDROP_TOTAL = 1000000000; // 1 مليار REC

// ====== DAILY SESSION TRACKING ======
function getAirdropData() {
  try {
    var key = 'airdropData_v1';
    var d = JSON.parse(localStorage.getItem(key) || '{}');
    return d;
  } catch(e) { return {}; }
}

function saveAirdropData(d) {
  try {
    localStorage.setItem('airdropData_v1', JSON.stringify(d));
  } catch(e) {}
}

function trackDailySession() {
  var d = getAirdropData();
  var today = new Date().toISOString().split('T')[0];
  if(!d.sessions) d.sessions = {};
  if(!d.sessions[today]) d.sessions[today] = 0;
  d.sessions[today]++;
  // Keep last 30 days only
  var keys = Object.keys(d.sessions).sort();
  if(keys.length > 30) delete d.sessions[keys[0]];
  saveAirdropData(d);
}

function getTotalActiveDays() {
  var d = getAirdropData();
  if(!d.sessions) return 0;
  return Object.keys(d.sessions).length;
}

function getAvgSessionsPerDay() {
  var d = getAirdropData();
  if(!d.sessions) return 0;
  var days = Object.keys(d.sessions);
  if(!days.length) return 0;
  var total = days.reduce(function(s,k){ return s + d.sessions[k]; }, 0);
  return Math.min(10, total / days.length);
}

// ====== SCORE CALCULATION ======
function calcAirdropScore() {
  var score = 0;

  // Daily logins (max 500 pts)
  var loginDays = (typeof dailyLogin !== 'undefined' ? (dailyLogin.day || 0) : 0);
  score += Math.min(500, loginDays * 10);

  // Active days tracked locally (max 300 pts)
  score += Math.min(300, getTotalActiveDays() * 10);

  // Sessions per day avg (max 100 pts)
  score += Math.min(100, Math.floor(getAvgSessionsPerDay() * 20));

  // REC balance (max 2000 pts) - log scale
  var recBal = (typeof rec !== 'undefined' ? rec : 0) + (typeof pendingRec !== 'undefined' ? pendingRec : 0);
  if(recBal > 0) score += Math.min(2000, Math.floor(Math.log10(recBal + 1) * 400));

  // Level (max 1000 pts)
  var lvl = (typeof calcPlayerLevel === 'function' && typeof playerXP !== 'undefined')
    ? calcPlayerLevel(playerXP) : 0;
  score += lvl * 10;

  // Card levels sum (max 1500 pts)
  if(typeof cardLevels !== 'undefined') {
    var cardSum = Object.values(cardLevels).reduce(function(s,v){ return s+(v||0); }, 0);
    score += Math.min(1500, cardSum * 2);
  }

  // Tasks done (max 300 pts)
  if(typeof completedTasks !== 'undefined') {
    score += Math.min(300, completedTasks.length * 15);
  }

  // Referrals (max 500 pts)
  if(typeof refCount !== 'undefined') {
    score += Math.min(500, refCount * 50);
  }

  // VIP membership bonus
  if(typeof vipData !== 'undefined' && parseInt(vipData.tier||0) >= 1 && parseInt(vipData.expiry||0) > Date.now()) {
    score += 200;
  }

  return Math.floor(score);
}

// ====== ESTIMATED SHARE ======
function calcEstimatedREC(score, globalAvg) {
  // Use global avg score from server, fallback to estimate
  var avg = globalAvg || 1500;
  var ratio = score / (avg * 10); // conservative estimate
  return Math.floor(AIRDROP_TOTAL * ratio);
}

// ====== OPEN AIRDROP PAGE ======
function openAirdrop() {
  var old = document.getElementById('airdropOverlay');
  if(old) old.remove();

  var score = calcAirdropScore();

  var ol = document.createElement('div');
  ol.id = 'airdropOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:rgba(6,3,15,0.95);z-index:5000;overflow-y:auto;padding:20px;';

  // Score breakdown
  var loginDays = (typeof dailyLogin !== 'undefined' ? (dailyLogin.day || 0) : 0);
  var activeDays = getTotalActiveDays();
  var lvl = (typeof calcPlayerLevel === 'function' && typeof playerXP !== 'undefined') ? calcPlayerLevel(playerXP) : 0;
  var cardSum = 0;
  if(typeof cardLevels !== 'undefined') cardSum = Object.values(cardLevels).reduce(function(s,v){return s+(v||0);},0);
  var tasksDone = (typeof completedTasks !== 'undefined') ? completedTasks.length : 0;
  var refs = (typeof refCount !== 'undefined') ? refCount : 0;
  var recBal = Math.floor((typeof rec !== 'undefined' ? rec : 0) + (typeof pendingRec !== 'undefined' ? pendingRec : 0));

  function row(icon, label, val, pts) {
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">'+
      '<span style="font-size:20px;width:28px;text-align:center;">'+icon+'</span>'+
      '<div style="flex:1;">'+
        '<div style="font-size:12px;color:rgba(255,255,255,0.7);">'+label+'</div>'+
        '<div style="font-size:11px;color:rgba(255,255,255,0.35);">'+val+'</div>'+
      '</div>'+
      '<div style="font-size:12px;font-weight:700;color:#FFD700;">+'+pts+' pts</div>'+
    '</div>';
  }

  ol.innerHTML =
    // Back button
    '<div onclick="document.getElementById(\'airdropOverlay\').remove()" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:8px 16px;cursor:pointer;font-size:13px;color:rgba(255,255,255,0.6);display:inline-block;margin-bottom:20px;">← '+(currentLang==='ar'?'رجوع':'Back')+'</div>'+

    // Header
    '<div style="text-align:center;margin-bottom:24px;">'+
      '<div style="font-size:48px;margin-bottom:8px;">🪂</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:22px;font-weight:900;color:#FFD700;margin-bottom:4px;">'+(currentLang==='ar'?'الإنزال المظلي':'AirDrop')+'</div>'+
      '<div style="font-size:13px;color:rgba(255,255,255,0.4);">'+(currentLang==='ar'?'إجمالي المكافأة:':'Total reward:')+' <span style="color:#FFD700;font-weight:700;">1,000,000,000 REC</span></div>'+
    '</div>'+

    // Coming Soon banner
    '<div style="background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,150,0,0.05));border:1px solid rgba(255,215,0,0.3);border-radius:16px;padding:16px;text-align:center;margin-bottom:20px;">'+
      '<div style="font-size:28px;margin-bottom:6px;">🔒</div>'+
      '<div style="font-size:16px;font-weight:700;color:#FFD700;">'+(currentLang==='ar'?'قريباً':'Coming Soon')+'</div>'+
      '<div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:4px;">'+(currentLang==='ar'?'استمر في اللعب لزيادة حصتك':'Keep playing to increase your share')+'</div>'+
    '</div>'+

    // Your score
    '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px;margin-bottom:16px;">'+
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:8px;">'+(currentLang==='ar'?'نقاطك الحالية':'YOUR CURRENT SCORE')+'</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:36px;font-weight:900;color:#00FF88;">'+score.toLocaleString()+'</div>'+
      '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;">'+(currentLang==='ar'?'كل نشاط يزيد نقاطك':'Every activity increases your score')+'</div>'+
    '</div>'+

    // Score breakdown
    '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;margin-bottom:16px;">'+
      '<div style="font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;margin-bottom:10px;">'+(currentLang==='ar'?'تفاصيل النقاط':'SCORE BREAKDOWN')+'</div>'+
      row('📅', currentLang==='ar'?'أيام الدخول اليومي':'Daily Login Days', loginDays+' '+(currentLang==='ar'?'يوم':'days'), Math.min(500,loginDays*10))+
      row('📱', currentLang==='ar'?'أيام النشاط المسجلة':'Tracked Active Days', activeDays+' '+(currentLang==='ar'?'يوم':'days'), Math.min(300,activeDays*10))+
      row('⚡', currentLang==='ar'?'رصيد REC':'REC Balance', recBal.toLocaleString()+' REC', Math.min(2000,Math.floor(Math.log10(recBal+1)*400)))+
      row('🏆', currentLang==='ar'?'المستوى':'Level', 'LVL '+lvl, lvl*10)+
      row('🃏', currentLang==='ar'?'مجموع مستويات البطاقات':'Card Levels Sum', cardSum.toLocaleString(), Math.min(1500,cardSum*2))+
      row('✅', currentLang==='ar'?'المهام المنجزة':'Tasks Done', tasksDone, Math.min(300,tasksDone*15))+
      row('👥', currentLang==='ar'?'الدعوات':'Referrals', refs, Math.min(500,refs*50))+
    '</div>'+

    // How to increase
    '<div style="background:rgba(0,255,136,0.04);border:1px solid rgba(0,255,136,0.15);border-radius:14px;padding:14px;">'+
      '<div style="font-size:12px;color:#00FF88;font-weight:700;margin-bottom:10px;">'+
        (currentLang==='ar'?'⬆️ كيف تزيد نقاطك؟':'⬆️ How to increase your score?')+
      '</div>'+
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.8;">'+
        (currentLang==='ar'?
          '• ادخل كل يوم واضغط Daily<br>• ارقِّ بطاقاتك<br>• أنجز المهام<br>• ادعُ أصدقاءك<br>• اجمع أكثر ما يمكن من REC':
          '• Login daily & claim Daily bonus<br>• Upgrade your cards<br>• Complete tasks<br>• Invite friends<br>• Collect as much REC as possible')+
      '</div>'+
    '</div>';

  document.body.appendChild(ol);

  // Save score to server
  if(tgUser) {
    fetch('/api/user/airdrop-score', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ telegramId: tgUser.id, airdropScore: score })
    }).catch(function(){});
  }
}

// ====== AUTO TRACK SESSION ======
// Call this on app start
function initAirdropTracking() {
  trackDailySession();
}
