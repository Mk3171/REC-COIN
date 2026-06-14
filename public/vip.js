function checkPendingVip() {
  try {
    var pending = JSON.parse(localStorage.getItem('pendingVipCheck') || 'null');
    if(!pending || !pending.tier) return;
    // Only check if within last 20 minutes
    if(Date.now() - pending.time > 20 * 60 * 1000) {
      localStorage.removeItem('pendingVipCheck');
      return;
    }
    console.log('[VIP] Pending check found, verifying tier', pending.tier);
    showToast(t('vipVerifying'));
    var checkAttempts = 0;
    function doCheck() {
      fetch('/api/vip/verify', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ telegramId: tgUser ? tgUser.id : null, tier: pending.tier })
      }).then(function(r){ return r.json(); }).then(function(data) {
        if(data.success) {
          vipData.tier = data.tier;
          vipData.expiry = data.expiry;
          vipData.boxes = vipData.boxes || {};
          try {
            localStorage.removeItem('pendingVipCheck');
            var ls = JSON.parse(localStorage.getItem(saveKey)||'{}');
            ls.vip = { tier: data.tier, expiry: data.expiry, boxes: vipData.boxes };
            localStorage.setItem(saveKey, JSON.stringify(ls));
          } catch(e) {}
          showToast(t('vipActivated').replace('{tier}', pending.tier===1?'I':pending.tier===2?'II':'III'));
          if(typeof saveData === 'function') saveData(true);
          renderVIPPage();
          if(pending.tier === 2) switchVIPTab(2);
        } else if(checkAttempts < 2) {
          checkAttempts++;
          setTimeout(doCheck, 10000);
        } else {
          localStorage.removeItem('pendingVipCheck');
        }
      }).catch(function(){ if(checkAttempts < 2){ checkAttempts++; setTimeout(doCheck,15000); } });
    }
    setTimeout(doCheck, 3000);
  } catch(e) {}
}

function openVIP() {
  showPage('vip', null);
  // Always fetch fresh VIP status from server before rendering
  if(tgUser) {
    fetch('/api/vip/status/' + tgUser.id)
      .then(function(r){ return r.json(); })
      .then(function(data) {
        if(data.tier && data.tier > 0) {
          vipData.tier = data.tier;
          vipData.expiry = data.expiry;
          vipData.boxes = data.boxes || vipData.boxes || {};
          // Update localStorage
          try {
            var ls = JSON.parse(localStorage.getItem(saveKey)||'{}');
            ls.vip = { tier: data.tier, expiry: data.expiry, boxes: vipData.boxes };
            localStorage.setItem(saveKey, JSON.stringify(ls));
          } catch(e) {}
        }
        renderVIPPage();
        setTimeout(checkPendingVip, 500);
      })
      .catch(function() {
        renderVIPPage();
        setTimeout(checkPendingVip, 500);
      });
  } else {
    renderVIPPage();
  }
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
      '<div style="font-size:18px;font-weight:900;color:#FFD700;font-family:Impact,sans-serif;letter-spacing:2px;">'+t('vipLevelsTitle')+'</div>' +
      '<div onclick="document.querySelectorAll(\'.vip-info-ol\')[0].remove()" style="width:30px;height:30px;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.4);font-size:13px;">✕</div>' +
    '</div>' +

    // VIP I
    '<div style="background:rgba(255,50,50,0.08);border:1px solid rgba(255,50,50,0.3);border-radius:14px;padding:14px;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
        '<div style="font-size:22px;">👑</div>' +
        '<div><div style="font-size:15px;font-weight:700;color:#FF6644;">VIP I</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.4);">'+t('vipPriceLabelI')+'</div></div>' +
        '<div style="margin-left:auto;background:rgba(255,50,50,0.2);border-radius:8px;padding:4px 10px;font-size:10px;color:#FF6644;font-weight:700;">'+t('vip2Available')+'</div>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.6);line-height:1.9;">' +
        t('vip1Feature1')+'<br>' +
        t('vip1Feature2')+'<br>' +
        t('vip1Feature3')+'<br>' +
        t('vip1Feature4')+'<br>' +
        t('vip1Feature5')+'<br>' +
        t('vip1Feature6')+'<br>' +
        t('vip1Feature7')+'<br>' +
        t('vip1Feature8') +
      '</div>' +
    '</div>' +

    // VIP II
    '<div style="background:rgba(30,10,80,0.5);border:1px solid rgba(100,136,255,0.35);border-radius:14px;padding:14px;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
        '<div style="font-size:22px;">💎</div>' +
        '<div><div style="font-size:15px;font-weight:700;color:#6688FF;">VIP II</div>' +
        '<div style="font-size:10px;color:rgba(100,136,255,0.6);">'+t('vip2PriceLabel')+'</div></div>' +
        '<div style="margin-left:auto;background:rgba(100,136,255,0.15);border-radius:8px;padding:4px 10px;font-size:10px;color:#6688FF;font-weight:700;">'+t('vip2Available')+'</div>' +
      '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.6);line-height:1.9;">' +
        t('vip2Feature1')+'<br>' +
        t('vip2Feature2')+'<br>' +
        t('vip2Feature3')+'<br>' +
        t('vip2Feature4')+'<br>' +
        '🔥 '+t('vip2BoostTitle')+'<br>' +
        '⚡ '+t('vip2CombinedBoost')+' <b style="color:#FFD700;">×4.5 REC</b> / <b style="color:#00CFFF;">×3 RECORD</b>' +
      '</div>' +
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
        '<div style="font-size:13px;font-weight:700;color:#6688FF;">💎 VIP II</div>' +
        '<div style="font-size:10px;color:rgba(100,136,255,0.7);margin-top:2px;">'+t('vip2PriceLabel')+'</div>' +
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
    var isAdmin = tgUser && String(tgUser.id) === '6995765586';
    var hasVIP = isAdmin || (vipData && parseInt(vipData.tier||0) >= 1 && parseInt(vipData.expiry||0) > Date.now());
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
          '<div onclick="openVIPWithdrawModal()" style="background:rgba(0,255,100,0.08);border:1px solid rgba(0,255,100,0.35);border-radius:14px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;">' +
            '<div><div style="font-size:12px;font-weight:700;color:#00CC66;">' + t('vipWithdrawTitle','VIP Withdraw') + '</div>' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px;">50,000 – 1,000,000 REC</div></div>' +
            '<div style="background:linear-gradient(135deg,#006633,#00CC66);border-radius:8px;padding:5px 12px;font-size:11px;color:white;font-weight:700;">Withdraw →</div>' +
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
  } else if(n === 2) {
    var isAdmin = tgUser && String(tgUser.id) === '6995765586';
    var hasVIP2 = vipData && parseInt(vipData.tier||0) >= 2 && parseInt(vipData.expiry||0) > Date.now();
    content.innerHTML =
      // Membership status or buy button
      (hasVIP2 ?
        // Active membership status
        // 20% Discount section
        '<div style="background:rgba(255,165,0,0.07);border:1px solid rgba(255,165,0,0.22);border-radius:14px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">' +
          '<div>' +
            '<div style="font-size:12px;font-weight:700;color:#FFA500;">'+t('vip2DiscountTitle')+'</div>' +
            '<div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px;">'+t('vip2DiscountOnce')+'</div>' +
          '</div>' +
          (function(){
            var dActive = vipData.discountExpiry && vipData.discountExpiry > Date.now();
            var dUsed = vipData.discountDate === getTodayStr() && !dActive;
            if(dActive) {
              var secsLeft = Math.ceil((vipData.discountExpiry - Date.now())/1000);
              return '<div class="disc-timer" style="background:rgba(255,165,0,0.15);border:1px solid rgba(255,165,0,0.4);border-radius:10px;padding:6px 12px;font-size:11px;color:#FFA500;">⏱ '+secsLeft+'s</div>';
            } else if(dUsed) {
              return '<div style="background:rgba(255,165,0,0.1);border:1px solid rgba(255,165,0,0.2);border-radius:10px;padding:6px 12px;font-size:11px;color:rgba(255,165,0,0.5);">'+t('vipBoostActivated')+'</div>';
            } else {
              return '<div onclick="useVIP2Discount()" style="background:linear-gradient(135deg,#7a3d00,#FF8C00);border-radius:10px;padding:7px 16px;font-size:11px;color:#fff;font-weight:700;cursor:pointer;">'+t('vip2DiscountActivate')+'</div>';
            }
          })() +
        '</div>' +
        // x3 Boost section
        '<div style="background:rgba(0,150,255,0.07);border:1px solid rgba(0,150,255,0.22);border-radius:14px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">' +
          '<div><div style="font-size:12px;font-weight:700;color:#00CFFF;">'+t('vip2BoostTitle')+'</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px;">'+t('vip2BoostOnce')+'</div></div>' +
          (vipData.boost2Date === getTodayStr() ?
            '<div style="background:rgba(0,200,255,0.15);border:1px solid rgba(0,200,255,0.3);border-radius:10px;padding:6px 12px;font-size:11px;color:#00CFFF;">' + t('vipBoostActivated') + '</div>' :
            '<div onclick="useVIP2Boost()" style="background:linear-gradient(135deg,#003366,#0088FF);border-radius:10px;padding:7px 16px;font-size:11px;color:#fff;font-weight:700;cursor:pointer;">' + t('vip2BoostActivate') + '</div>'
          ) +
        '</div>' +
        // Active membership box at bottom (like VIP I)
        '<div style="background:rgba(0,200,100,0.1);border:1px solid rgba(0,200,100,0.3);border-radius:14px;padding:14px;text-align:center;">' +
          '<div style="font-size:14px;font-weight:700;color:#00FF88;">'+t('vip2ActiveMembership')+'</div>' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px;">'+t('vipExpiryDate')+' ' + new Date(vipData.expiry).toLocaleDateString() + '</div>' +
        '</div>' :
        // Not subscribed — show buy button
        '<div onclick="buyVIP(2)" style="background:linear-gradient(135deg,#1a0066,#4422cc);border:1px solid rgba(100,136,255,0.5);border-radius:14px;padding:16px;text-align:center;cursor:pointer;box-shadow:0 4px 24px rgba(100,100,255,0.35);">' +
          '<div style="font-size:16px;font-weight:900;color:#fff;">'+t('vip2SubscribeBtn')+'</div>' +
          '<div style="font-size:12px;color:rgba(200,200,255,0.8);margin-top:4px;">'+t('vip2PriceLabel')+'</div>' +
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
      (unlocked ? (canOpen ? t('vipBoxOpen') : t('vipBoxDone')) : t('locked')) +
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
    if(typeof addXP==='function') addXP(type==='common'?50:type==='rare'?100:200);
    if(reward) showVIPBoxResult(type, reward, false);
    else showToast(t('vipErrBoxOpen'));
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
      '<div style="font-size:14px;color:rgba(255,255,255,0.5);">' + t('vipBoxOpening','🎁 Opening...') + '</div>' +
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
    rewardIcon = '🚀'; rewardTitle = t('vipBoxBoostTitle','Mining Boost'); rewardColor = '#FFD700';
    rewardValue = t('vipBoxBoostValue','×{n} for 1 hour').replace('{n}', reward.multi);
  } else if(reward.type === 'epicCard') {
    rewardIcon = '🦅'; rewardTitle = t('vipBoxEpicCardTitle','EPIC Card!'); rewardColor = '#FFD700';
    rewardValue = t('vipBoxEpicCardValue','Mining 0.001 REC/sec');
  }

  overlay.innerHTML =
    '<div style="background:' + c.bg + ';border:2px solid ' + c.border + ';border-radius:24px;padding:36px 32px;max-width:300px;text-align:center;box-shadow:0 0 40px ' + c.border + ';">' +
      '<div style="font-size:14px;color:' + c.color + ';font-weight:700;margin-bottom:16px;letter-spacing:2px;">' + c.name.toUpperCase() + ' BOX</div>' +
      '<div style="font-size:64px;margin-bottom:20px;">' + rewardIcon + '</div>' +
      '<div style="font-size:16px;color:rgba(255,255,255,0.6);margin-bottom:8px;">'+t('vipBoxYouGot')+'</div>' +
      '<div style="font-size:24px;font-weight:900;color:' + rewardColor + ';margin-bottom:6px;">' + rewardTitle + '</div>' +
      '<div style="font-size:20px;font-weight:700;color:white;margin-bottom:24px;">' + rewardValue + '</div>' +
      '<div style="background:' + c.border + ';border-radius:12px;padding:12px;cursor:pointer;color:white;font-size:14px;font-weight:700;">' + t('vipBoxGreat','🎉 Awesome!') + '</div>' +
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
    showToast(t('vipErrWallet'));
    return;
  }

  var prices = { 1: '1000000000', 2: '5000000000', 3: '10000000000' }; // nanoTON
  var labels = { 1: 'VIP I — 1 TON', 2: 'VIP II — 5 TON', 3: 'VIP III — 10 TON' };
  var nanoAmount = prices[tier];

  showToast(t('vipLoadingWallet'));

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
    // Save pending check to localStorage — survives mini app reload
    try {
      localStorage.setItem('pendingVipCheck', JSON.stringify({
        tier: tier,
        time: Date.now(),
        wallet: (tonConnect&&tonConnect.wallet&&tonConnect.wallet.account ? tonConnect.wallet.account.address : '')
      }));
    } catch(e) {}
    showToast(t('vipVerifying'));

    // Get user wallet address
    var userWallet = '';
    try {
      if(tonConnect && tonConnect.wallet && tonConnect.wallet.account) {
        userWallet = rawToFriendly(tonConnect.wallet.account.address);
      }
    } catch(e) {}

    // Retry verification: 8s, 25s, 55s (handles slow TON transactions)
    function tryVerify(attempt) {
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
          // Activate VIP in local state
          vipData.tier = data.tier;
          vipData.expiry = data.expiry;
          vipData.boxes = vipData.boxes || {};
          // Save to localStorage explicitly
          try { 
            var ls = JSON.parse(localStorage.getItem(saveKey) || '{}');
            ls.vip = { tier: data.tier, expiry: data.expiry, boxes: vipData.boxes };
            localStorage.setItem(saveKey, JSON.stringify(ls));
          } catch(e) {}
          if(data.tier === 1) {
            rec += 50;
            showToast(t('vipWelcomeBonus'));
            setTimeout(function(){ showToast(t('vipActivated').replace('{tier}','I')); }, 2000);
          } else {
            showToast(t('vipActivated').replace('{tier}',tier===1?'I':tier===2?'II':'III'));
          }
          if(typeof addXP==='function') addXP(500);
          try { localStorage.removeItem('pendingVipCheck'); } catch(e) {}
          saveData(true);
          renderVIPPage();
          if(tier === 2) switchVIPTab(2);
        } else if (data.error === 'VIP already active') {
          // VIP already activated — just refresh UI
          showToast('✅ VIP ' + (tier===1?'I':tier===2?'II':'III') + ' ' + t('vipActivated').replace('👑 ','').replace('{tier}','').trim());
          loadFromServer(function(sd){
            if(sd && sd.vip && sd.vip.tier >= tier) {
              vipData.tier = sd.vip.tier;
              vipData.expiry = sd.vip.expiry;
              try {
                var ls = JSON.parse(localStorage.getItem(saveKey) || '{}');
                ls.vip = { tier: sd.vip.tier, expiry: sd.vip.expiry, boxes: vipData.boxes || {} };
                localStorage.setItem(saveKey, JSON.stringify(ls));
              } catch(e) {}
              renderVIPPage();
              if(tier === 2) switchVIPTab(2);
            }
          });
        } else if (attempt < 3) {
          var delays = [0, 25000, 55000];
          showToast('⏳ ' + (attempt+1) + '/3 ' + t('vipVerifying'));
          setTimeout(function(){ tryVerify(attempt+1); }, delays[attempt]);
        } else {
          showToast('❌ ' + (data.error || t('vipVerifyFail')));
        }
      }).catch(function() {
        if (attempt < 3) {
          setTimeout(function(){ tryVerify(attempt+1); }, 20000);
        } else {
          showToast(t('vipErrServer'));
        }
      });
    }
    setTimeout(function(){ tryVerify(1); }, 8000);

  }).catch(function(e) {
    if (e && e.message && (e.message.includes('cancel') || e.message.includes('reject'))) {
      showToast(t('vipCancelled'));
    } else {
      showToast(t('vipErrPayment'));
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
  if(vipData.boostDate === today) { showToast(t('vipBoostAlready')); return; }
  vipData.boostDate = today;
  saveData(true);
  showToast(t('vipBoostActivated2'));
  renderVIPPage();
}

function useVIP2Discount() {
  var isAdmin = tgUser && String(tgUser.id) === '6995765586';
  if(!isAdmin && (!vipData || parseInt(vipData.tier||0) < 2 || parseInt(vipData.expiry||0) <= Date.now())) return;
  var today = getTodayStr();
  if(vipData.discountDate === today && (!vipData.discountExpiry || vipData.discountExpiry < Date.now())) {
    showToast(t('vip2DiscountUsed'));
    return;
  }
  vipData.discountDate = today;
  vipData.discountExpiry = Date.now() + 2 * 60 * 1000; // 2 minutes
  saveData(true);
  showToast(t('vip2DiscountActivated'));
  renderVIPPage();
  switchVIPTab(2);
  // Auto-refresh countdown every second
  var discTimer = setInterval(function() {
    if(!vipData.discountExpiry || vipData.discountExpiry < Date.now()) {
      clearInterval(discTimer);
      renderVIPPage(); switchVIPTab(2);
      if(typeof updateUI === 'function') updateUI();
    } else {
      // Update timer in VIP tab
      var el = document.querySelector('.disc-timer');
      if(el) {
        var s = Math.ceil((vipData.discountExpiry - Date.now())/1000);
        el.textContent = '⏱ ' + s + 's';
      }
      // Refresh card prices every 5s to show discount
      if(typeof updateUI === 'function') updateUI();
    }
  }, 1000);
}

function useVIP2Boost() {
  var isAdmin = tgUser && String(tgUser.id) === '6995765586';
  if(!isAdmin && (!vipData || parseInt(vipData.tier||0) < 2 || parseInt(vipData.expiry||0) <= Date.now())) return;
  var today = getTodayStr();
  if(vipData.boost2Date === today) { showToast(t('vip2BoostAlready')); return; }
  vipData.boost2Date = today;
  saveData(true);
  showToast(t('vip2BoostActivated'));
  renderVIPPage();
  switchVIPTab(2);
}

