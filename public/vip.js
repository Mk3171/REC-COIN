function openVIP() {
  renderVIPPage();
  showPage('vip', null);
  // دايماً حمّل بيانات الكومبو عند فتح VIP
  if(tgUser) {
    fetch('/api/combo/today/' + tgUser.id)
      .then(function(r){ return r.json(); })
      .then(function(d){
        comboData = d;
        switchVIPTab(1); // أعد رسم التاب مع البيانات الجديدة
      }).catch(function(){});
  }
}
function closeVIP() {
  showPage('home', document.getElementById('navHomeBtn'));
}
function openVIPInfo() {
  var ol = document.createElement('div');
  ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:99999;display:flex;align-items:flex-end;';
  ol.className = 'vip-info-ol'; ol.onclick = function(e){ if(e.target===ol) ol.remove(); };

  ol.innerHTML = '<div style="width:100%;background:linear-gradient(180deg,#1a0a00,#0d0500);border-radius:24px 24px 0 0;border-top:2px solid rgba(255,200,0,0.3);padding:20px 16px 36px;max-height:88vh;overflow-y:auto;" onclick="event.stopPropagation()">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
      '<div style="font-size:18px;font-weight:900;color:#FFD700;font-family:Impact,sans-serif;letter-spacing:2px;">👑 مستويات VIP</div>' +
      '<div onclick="document.querySelectorAll(\'.vip-info-ol\')[0].remove()" style="width:30px;height:30px;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.4);font-size:13px;">✕</div>' +
    '</div>' +

    // VIP I
    '<div style="background:rgba(255,50,50,0.08);border:1px solid rgba(255,50,50,0.3);border-radius:14px;padding:14px;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
        '<div style="font-size:22px;">👑</div>' +
        '<div><div style="font-size:15px;font-weight:700;color:#FF6644;">VIP I</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4);">1 TON / شهر</div></div>' +
        '<div style="margin-left:auto;background:rgba(255,50,50,0.2);border-radius:8px;padding:4px 10px;font-size:10px;color:#FF6644;font-weight:700;">متاح ✅</div>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.6);line-height:1.9;">' +
        '📦 ٣ صناديق يومية (Common, Rare, Epic)<br>' +
        '🦅 فرصة الحصول على بطاقة Epic النادرة (1%)<br>' +
        '⚡ ×١.٥ سرعة تعدين REC<br>' +
        '🔋 شحن طاقة ٦ مرات يومياً<br>' +
        '💰 حد سحب يومي من 1,000 حتى 20,000 REC<br>' +
        '🎯 تلميح بطاقة واحدة من الكومبو اليومي<br>' +
        '🎁 +50 REC مكافأة ترحيبية فورية<br>' +
        '👑 شارة VIP ذهبية بالليدربورد' +
      '</div>' +
    '</div>' +

    // VIP II
    '<div style="background:rgba(100,100,255,0.06);border:1px solid rgba(100,100,255,0.2);border-radius:14px;padding:14px;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
        '<div style="font-size:22px;">👑</div>' +
        '<div><div style="font-size:15px;font-weight:700;color:#6688FF;">VIP II</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4);">'+t('comingSoon')+'</div></div>' +
        '<div style="margin-left:auto;background:rgba(255,255,255,0.05);border-radius:8px;padding:4px 10px;font-size:10px;color:rgba(255,255,255,0.3);font-weight:700;">🔒 '+t('comingSoon')+'</div>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.3);">كل مميزات VIP I + مميزات حصرية إضافية</div>' +
    '</div>' +

    // VIP III
    '<div style="background:rgba(170,100,255,0.06);border:1px solid rgba(170,100,255,0.2);border-radius:14px;padding:14px;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
        '<div style="font-size:22px;">💎</div>' +
        '<div><div style="font-size:15px;font-weight:700;color:#AA66FF;">VIP III</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4);">'+t('comingSoon')+'</div></div>' +
        '<div style="margin-left:auto;background:rgba(255,255,255,0.05);border-radius:8px;padding:4px 10px;font-size:10px;color:rgba(255,255,255,0.3);font-weight:700;">🔒 '+t('comingSoon')+'</div>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.3);">المستوى الأعلى — مميزات لا مثيل لها</div>' +
    '</div>' +

  '</div>';

  document.body.appendChild(ol);
}

function renderVIPPage() {
  var pp = document.getElementById('vipPageContent');
  pp.innerHTML =
    '<div style="width:100%;min-height:100vh;background:linear-gradient(180deg,#1a0000 0%,#0d0000 40%,#0a0010 100%);">' +

    // Header
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 16px 0;">' +
      '<div onclick="closeVIP()" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:8px 14px;cursor:pointer;font-size:12px;color:rgba(255,255,255,0.6);">← ' + t('backBtn').replace('← ','') + '</div>' +
      '<div onclick="openVIPInfo()" style="width:32px;height:32px;border-radius:50%;background:rgba(255,215,0,0.12);border:1px solid rgba(255,215,0,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;font-weight:900;color:#FFD700;">?</div>' +
    '</div>' +
    '<div style="text-align:center;padding:12px 16px 10px;">' +
      '<div style="font-family:Impact,sans-serif;font-size:42px;font-weight:900;' +
        'color:#FFD700;text-shadow:3px 3px 0 #aa6600,0 0 20px rgba(255,215,0,0.6);' +
        'letter-spacing:4px;">VIP</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;">'+t('vipExclusiveMembership')+'</div>' +
    '</div>' +

    // Tabs
    '<div style="display:flex;gap:8px;padding:0 16px;margin-bottom:16px;">' +
      '<div onclick="switchVIPTab(1)" id="vipTab1" style="flex:1;text-align:center;padding:10px;border-radius:12px;background:linear-gradient(135deg,#cc0000,#ff2222);border:1px solid #ff4444;cursor:pointer;">' +
        '<div style="font-size:13px;font-weight:700;color:#FFD700;">👑 VIP I</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.7);margin-top:2px;">'+t('vipPriceLabel')+'</div>' +
      '</div>' +
      '<div onclick="switchVIPTab(2)" id="vipTab2" style="flex:1;text-align:center;padding:10px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);cursor:pointer;">' +
        '<div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.4);">👑 VIP II</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:2px;">'+t('comingSoon')+'</div>' +
      '</div>' +
      '<div onclick="switchVIPTab(3)" id="vipTab3" style="flex:1;text-align:center;padding:10px;border-radius:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);cursor:pointer;">' +
        '<div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.4);">👑 VIP III</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:2px;">'+t('comingSoon')+'</div>' +
      '</div>' +
    '</div>' +

    '<div id="vipTabContent" style="padding:0 16px 30px;"></div>' +
    '</div>';

  switchVIPTab(1);
}

function switchVIPTab(n) {
  [1,2,3].forEach(function(i) {
    var tab = document.getElementById('vipTab'+i);
    if(!tab) return;
    if(i === n) {
      tab.style.background = 'linear-gradient(135deg,#cc0000,#ff2222)';
      tab.style.border = '1px solid #ff4444';
      tab.querySelector('div').style.color = '#FFD700';
    } else {
      tab.style.background = 'rgba(255,255,255,0.05)';
      tab.style.border = '1px solid rgba(255,255,255,0.1)';
      tab.querySelector('div').style.color = 'rgba(255,255,255,0.4)';
    }
  });

  var content = document.getElementById('vipTabContent');
  if(!content) return;

  if(n === 1) {
    var hasVIP = vipData && parseInt(vipData.tier||0) >= 1 && parseInt(vipData.expiry||0) > Date.now();
    content.innerHTML =
      // Combo hint
      (hasVIP && comboData && comboData.cards && comboData.cards.length > 0 ?
        '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.25);border-radius:14px;padding:12px;margin-bottom:12px;">' +
          '<div style="font-size:12px;font-weight:700;color:#FFD700;margin-bottom:10px;">' + t('vipComboHint') + '</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
            comboData.cards.map(function(c){
              var ci = getCardInfo(c.categoryIndex, c.cardIndex);
              var isDone = c.done;
              return '<div style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,215,0,' + (isDone?'0.5':'0.2') + ');border-radius:10px;padding:8px 4px;text-align:center;">' +
                '<div style="font-size:26px;">' + (ci ? ci.e : '🃏') + '</div>' +
                '<div style="font-size:10px;color:' + (isDone?'#00FF88':'#FFD700') + ';font-weight:700;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (ci ? ci.name : '???') + '</div>' +
                '<div style="font-size:14px;margin-top:2px;">' + (isDone ? '✅' : '🔒') + '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' : '') +

      // Boxes section
      '<div style="font-size:13px;font-weight:700;color:#FFD700;margin-bottom:10px;">' + t('vipDailyBoxes') + '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px;">' +
        _vipBox('common', hasVIP) +
        _vipBox('rare', hasVIP) +
        _vipBox('epic', hasVIP) +
      '</div>' +

      // Action buttons (VIP only)
      (hasVIP ?
        '<div style="margin-bottom:14px;">' +
          '<div style="background:rgba(255,200,0,0.08);border:1px solid rgba(255,200,0,0.25);border-radius:14px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">' +
            '<div><div style="font-size:12px;font-weight:700;color:#FFD700;">' + t('vipBoostTitle') + '</div>' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px;">' + t('vipBoostOnce') + '</div></div>' +
            (vipData.boostDate === getTodayStr() ?
              '<div style="background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.3);border-radius:10px;padding:6px 12px;font-size:11px;color:#FFD700;">' + t('vipBoostActivated') + '</div>' :
              '<div onclick="useVIPBoost()" style="background:linear-gradient(135deg,#886600,#FFD700);border-radius:10px;padding:7px 16px;font-size:11px;color:#000;font-weight:700;cursor:pointer;">' + t('vipBoostActivate') + '</div>'
            ) +
          '</div>' +
          '<div style="background:rgba(0,200,255,0.07);border:1px solid rgba(0,200,255,0.22);border-radius:14px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">' +
            '<div><div style="font-size:12px;font-weight:700;color:#00CCFF;">' + t('vipEnergyTitle') + '</div>' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px;">' + t('vipEnergyRemaining',{n:(window.refillData?window.refillData.count:6),max:6}) + '</div></div>' +
            '<div onclick="useEnergyRefill()" style="background:linear-gradient(135deg,#004466,#0088CC);border-radius:10px;padding:7px 16px;font-size:11px;color:white;font-weight:700;cursor:pointer;">' + t('vipEnergyBtn') + '</div>' +
          '</div>' +
          '<div style="background:rgba(0,255,100,0.05);border:1px solid rgba(0,255,100,0.18);border-radius:14px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;">' +
            '<div><div style="font-size:12px;font-weight:700;color:#00CC66;">' + t('vipWithdrawTitle') + '</div>' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px;">' + t('vipWithdrawDesc') + '</div></div>' +
            '<div style="font-size:11px;color:rgba(0,255,136,0.5);">' + t('vipSoonLock') + '</div>' +
          '</div>' +
        '</div>' : '') +

      // Membership status
      (hasVIP ?
        '<div style="background:rgba(0,255,100,0.1);border:1px solid rgba(0,255,100,0.3);border-radius:14px;padding:14px;text-align:center;">' +
          '<div style="font-size:14px;font-weight:700;color:#00FF88;">' + t('vipActiveMembership') + '</div>' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px;">' + t('vipExpiryDate') + ' ' + new Date(vipData.expiry).toLocaleDateString() + '</div>' +
        '</div>' :
        '<div onclick="buyVIP(1)" style="background:linear-gradient(135deg,#cc0000,#ff3333);border:none;border-radius:14px;padding:16px;text-align:center;cursor:pointer;box-shadow:0 4px 20px rgba(255,0,0,0.4);">' +
          '<div style="font-size:16px;font-weight:900;color:#FFD700;">' + t('vipSubscribeBtn') + '</div>' +
          '<div style="font-size:12px;color:rgba(255,255,255,0.8);margin-top:4px;">' + t('vipPriceLabel') + '</div>' +
        '</div>'
      );
  } else {
    content.innerHTML =
      '<div style="text-align:center;padding:40px 20px;">' +
        '<div style="font-size:40px;margin-bottom:12px;">🔒</div>' +
        '<div style="font-size:16px;font-weight:700;color:rgba(255,255,255,0.4);">'+t('comingSoon')+'</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.2);margin-top:6px;">'+t('vipComingSoon')+'</div>' +
      '</div>';
  }
}

function _vipBox(type, unlocked) {
  var configs = {
    common: { label:t('vipBoxCommon'), color:'#cccccc', bg:'rgba(200,200,200,0.08)', border:'rgba(200,200,200,0.25)', icon:'📦' },
    rare:   { label:t('vipBoxRare'),   color:'#66aaff', bg:'rgba(68,136,255,0.12)', border:'rgba(68,136,255,0.4)',  icon:'💎' },
    epic:   { label:t('vipBoxEpic'),   color:'#cc66ff', bg:'rgba(170,68,255,0.15)', border:'rgba(170,68,255,0.5)', icon:'🌌' }
  };
  var c = configs[type];
  var canOpen = unlocked && !(vipData.boxes && vipData.boxes[type] === getTodayStr());
  return '<div onclick="' + (unlocked ? 'openVIPBox(\'' + type + '\')' : '') + '" style="' +
    'background:' + c.bg + ';border:1px solid ' + c.border + ';border-radius:14px;' +
    'padding:12px 8px;text-align:center;cursor:' + (unlocked ? 'pointer' : 'default') + ';">' +
    '<div style="font-size:28px;">' + (unlocked ? c.icon : '🔒') + '</div>' +
    '<div style="font-size:10px;font-weight:700;color:' + c.color + ';margin-top:6px;">' + c.label + '</div>' +
    '<div style="font-size:9px;color:rgba(255,255,255,0.4);margin-top:3px;">' +
      (unlocked ? (canOpen ? 'افتح' : '✅ تم اليوم') : 'مقفل') +
    '</div>' +
  '</div>';
}

function openVIPBox(type) {
  if(!vipData || vipData.tier < 1 || parseInt(vipData.expiry||0) <= Date.now()) return;
  if(!vipData.boxes) vipData.boxes = {};
  var today = getTodayStr();
  if(vipData.boxes[type] === today) {
    showVIPBoxResult(type, null, true);
    return;
  }

  // Show opening animation first
  showVIPBoxOpening(type, function() {
    var reward = rollVIPBox(type);
    vipData.boxes[type] = today;

    // Apply reward
    if(reward.type === 'record') {
      record += reward.amount;
    } else if(reward.type === 'rec') {
      rec += reward.amount;
    } else if(reward.type === 'boost') {
      vipData.boost = { multi: reward.multi, expiry: Date.now() + 3600000 };
    } else if(reward.type === 'epicCard') {
      vipData.hasEpicCard = true;
      vipData.epicExpiry = vipData.expiry;
    }

    // Save to server
    fetch('/api/vip/boxes/save', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ telegramId: tgUser ? tgUser.id : null, boxes: vipData.boxes })
    }).catch(function(){});

    saveData(true);
    updateUI();
    if(reward) showVIPBoxResult(type, reward, false);
    else showToast('❌ خطأ في فتح الصندوق');
  });
}

function showVIPBoxOpening(type, callback) {
  var configs = {
    common: { icon:'📦', color:'#cccccc', name:'Common', bg:'rgba(200,200,200,0.15)' },
    rare:   { icon:'💎', color:'#66aaff', name:'Rare',   bg:'rgba(68,136,255,0.15)' },
    epic:   { icon:'🌌', color:'#cc66ff', name:'Epic',   bg:'rgba(170,68,255,0.15)' }
  };
  var c = configs[type];

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;';

  overlay.innerHTML =
    '<div style="text-align:center;">' +
      '<div id="boxAnim" style="font-size:80px;animation:boxShake 0.5s infinite;margin-bottom:20px;">' + c.icon + '</div>' +
      '<div style="font-size:22px;font-weight:900;color:' + c.color + ';margin-bottom:8px;">' + c.name + ' Box</div>' +
      '<div style="font-size:14px;color:rgba(255,255,255,0.5);">جاري الفتح...</div>' +
    '</div>';

  // Add shake animation
  var style = document.createElement('style');
  style.innerHTML = '@keyframes boxShake{0%,100%{transform:rotate(-5deg) scale(1)}50%{transform:rotate(5deg) scale(1.1)}}';
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  setTimeout(function() {
    document.body.removeChild(overlay);
    callback();
  }, 1500);
}

function showVIPBoxResult(type, reward, alreadyOpened) {
  var configs = {
    common: { color:'#cccccc', name:'Common', bg:'linear-gradient(135deg,#1a1a1a,#2a2a2a)', border:'rgba(200,200,200,0.3)' },
    rare:   { color:'#66aaff', name:'Rare',   bg:'linear-gradient(135deg,#001133,#002266)', border:'rgba(68,136,255,0.5)' },
    epic:   { color:'#cc66ff', name:'Epic',   bg:'linear-gradient(135deg,#1a0033,#2d0066)', border:'rgba(170,68,255,0.6)' }
  };
  var c = configs[type];

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
  overlay.onclick = function() { document.body.removeChild(overlay); renderVIPPage(); };

  if(alreadyOpened) {
    overlay.innerHTML =
      '<div style="background:' + c.bg + ';border:2px solid ' + c.border + ';border-radius:24px;padding:36px 32px;max-width:300px;text-align:center;">' +
        '<div style="font-size:50px;margin-bottom:16px;">🔒</div>' +
        '<div style="font-size:18px;font-weight:700;color:' + c.color + ';margin-bottom:8px;">' + c.name + ' Box</div>' +
        '<div style="font-size:14px;color:rgba(255,255,255,0.5);margin-bottom:20px;">'+t('vipBoxAlreadyOpened')+'</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.3);">'+t('vipBoxComeBack')+'</div>' +
        '<div style="margin-top:20px;background:rgba(255,255,255,0.08);border-radius:12px;padding:12px;cursor:pointer;color:rgba(255,255,255,0.7);font-size:14px;">'+t('vipBoxClose')+'</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return;
  }

  // Build reward display
  var rewardIcon, rewardTitle, rewardValue, rewardColor;
  if(reward.type === 'record') {
    rewardIcon = '🔴'; rewardTitle = 'RECORD'; rewardColor = '#FF6644';
    rewardValue = '+' + formatCost(reward.amount) + ' RECORD';
  } else if(reward.type === 'rec') {
    rewardIcon = '⚡'; rewardTitle = 'REC'; rewardColor = '#00FF88';
    rewardValue = '+' + reward.amount.toFixed(6) + ' REC';
  } else if(reward.type === 'boost') {
    rewardIcon = '🚀'; rewardTitle = 'تسريع التعدين'; rewardColor = '#FFD700';
    rewardValue = '×' + reward.multi + ' لمدة ساعة';
  } else if(reward.type === 'epicCard') {
    rewardIcon = '🦅'; rewardTitle = 'بطاقة EPIC النادرة!'; rewardColor = '#FFD700';
    rewardValue = 'تعدين 0.001 REC/ثانية';
  }

  overlay.innerHTML =
    '<div style="background:' + c.bg + ';border:2px solid ' + c.border + ';border-radius:24px;padding:36px 32px;max-width:300px;text-align:center;box-shadow:0 0 40px ' + c.border + ';">' +
      '<div style="font-size:14px;color:' + c.color + ';font-weight:700;margin-bottom:16px;letter-spacing:2px;">' + c.name.toUpperCase() + ' BOX</div>' +
      '<div style="font-size:64px;margin-bottom:20px;">' + rewardIcon + '</div>' +
      '<div style="font-size:16px;color:rgba(255,255,255,0.6);margin-bottom:8px;">'+t('vipBoxYouGot')+'</div>' +
      '<div style="font-size:24px;font-weight:900;color:' + rewardColor + ';margin-bottom:6px;">' + rewardTitle + '</div>' +
      '<div style="font-size:20px;font-weight:700;color:white;margin-bottom:24px;">' + rewardValue + '</div>' +
      '<div style="background:' + c.border + ';border-radius:12px;padding:12px;cursor:pointer;color:white;font-size:14px;font-weight:700;">🎉 رائع!</div>' +
    '</div>';

  document.body.appendChild(overlay);
}

function rollVIPBox(type) {
  var r = Math.random();
  var multi = type === 'common' ? 1 : type === 'rare' ? 2 : 3;

  // Epic card chance: 1%
  if(type === 'epic' && r < 0.01 && !vipData.hasEpicCard) {
    return { type:'epicCard' };
  }

  var r2 = Math.random();
  if(r2 < 0.45) {
    // RECORD
    var base = 10000 + Math.random() * 490000;
    return { type:'record', amount: Math.floor(base * multi) };
  } else if(r2 < 0.85) {
    // REC
    var base = 0.000001 + Math.random() * 0.000299;
    return { type:'rec', amount: parseFloat((base * multi).toFixed(6)) };
  } else {
    // Boost
    var boosts = [2,3,4,5];
    var b = boosts[Math.floor(Math.random() * boosts.length)];
    return { type:'boost', multi: Math.min(b * (multi > 1 ? 2 : 1), 5) };
  }
}

function buyVIP(tier) {
  // Check wallet connected
  if (!tonConnect || !tonConnect.connected) {
    showToast('❌ ربط محفظتك أولاً من صفحة Wallet!');
    return;
  }

  var prices = { 1: '1000000000', 2: '3000000000', 3: '10000000000' }; // nanoTON
  var labels = { 1: 'VIP I — 1 TON', 2: 'VIP II — 3 TON', 3: 'VIP III — 10 TON' };
  var nanoAmount = prices[tier];

  showToast('⏳ جاري فتح محفظتك...');

  var BOT_WALLET = 'UQD-FoGlRG5pBxZpkf3H9ZOsNTL5basBbTEZE8zvMgHLB99o'; // محفظة البوت — نفس محفظة السحب

  // Send TON transaction
  // Build proper TON text comment cell (BOC)
  function buildCommentPayload(text) {
    var bytes = [];
    // 4 bytes: 0x00000000 (text comment op)
    bytes.push(0,0,0,0);
    for(var i=0;i<text.length;i++) bytes.push(text.charCodeAt(i));
    // Wrap in simple BOC: b5ee9c72 01010101 00 + length + 00 + data
    var dataLen = bytes.length;
    var cell = [0xb5,0xee,0x9c,0x72,0x01,0x01,0x01,0x01,0x00,dataLen+2,0x00,dataLen*8>>8,dataLen*8&0xff].concat(bytes);
    // Actually use simpler approach - encode as hex then base64
    var hexStr = '';
    for(var j=0;j<bytes.length;j++) hexStr += ('0'+bytes[j].toString(16)).slice(-2);
    return btoa(String.fromCharCode.apply(null,bytes));
  }

  var commentText = 'VIP' + tier + ':' + (tgUser ? tgUser.id : '');

  tonConnect.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{
      address: BOT_WALLET,
      amount: nanoAmount
    }]
  }).then(function(result) {
    showToast('⏳ جاري التحقق من الدفع...');

    // Get user wallet address
    var userWallet = '';
    try {
      if(tonConnect && tonConnect.wallet && tonConnect.wallet.account) {
        userWallet = rawToFriendly(tonConnect.wallet.account.address);
      }
    } catch(e) {}

    // Wait 8 seconds then verify by checking bot wallet transactions
    setTimeout(function() {
      fetch('/api/vip/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: tgUser ? tgUser.id : null,
          userWallet: userWallet,
          tier: tier
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) {
          vipData.tier = data.tier;
          vipData.expiry = data.expiry;
          vipData.boxes = {};
          // Welcome bonus: 50 REC
          if(data.tier === 1) {
            rec += 50;
            showToast('🎁 +50 REC مكافأة ترحيبية!');
            setTimeout(function(){
              showToast('👑 تم تفعيل VIP I بنجاح!');
            }, 2000);
          } else {
            showToast('👑 تم تفعيل VIP ' + (tier===1?'I':tier===2?'II':'III') + ' بنجاح!');
          }
          saveData(true);
          renderVIPPage();
        } else {
          showToast('❌ ' + (data.error || 'فشل التحقق، تواصل مع الدعم'));
        }
      }).catch(function() {
        showToast('❌ خطأ في الاتصال بالسيرفر');
      });
    }, 8000);

  }).catch(function(e) {
    if (e && e.message && (e.message.includes('cancel') || e.message.includes('reject'))) {
      showToast('تم إلغاء الدفع');
    } else {
      showToast('❌ خطأ في الدفع');
    }
  });
}

// Load VIP data from server
function loadVIPData(callback) {
  if (!tgUser) { if(callback) callback(); return; }
  fetch('/api/vip/' + tgUser.id)
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.vip && parseInt(data.vip.tier||0) > 0) {
      // فقط نحدّث الـ tier والـ expiry — نحافظ على boxes وboostDate المحلية
      vipData.tier = data.vip.tier;
      vipData.expiry = data.vip.expiry;
      if(!vipData.boxes) vipData.boxes = {};
    }
    if(callback) callback();
  }).catch(function(){ if(callback) callback(); });
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

