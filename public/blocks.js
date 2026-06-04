// ============================================================
// BLOCKS UI - REC Mining Frontend
// ============================================================

var blockPingInterval = null;
var currentPendingBlock = null;

// ============================================================
// PING كل دقيقة لتتبع النشاط وفحص البلوكات
// ============================================================
function startBlockPing() {
  if(blockPingInterval) return;
  blockPingInterval = setInterval(function() {
    if(!window.tgUser) return;
    fetch('/api/blocks/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId: tgUser.id })
    })
    .then(function(r){ return r.json(); })
    .then(function(d) {
      if(d.pendingBlock && !currentPendingBlock) {
        currentPendingBlock = d.pendingBlock;
        showBlockCollectScreen(d.pendingBlock);
      }
    })
    .catch(function(){});
  }, 60000); // كل دقيقة

  // فحص فوري عند فتح البوت
  setTimeout(function() {
    if(!window.tgUser) return;
    fetch('/api/blocks/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId: tgUser.id })
    })
    .then(function(r){ return r.json(); })
    .then(function(d) {
      if(d.pendingBlock) {
        currentPendingBlock = d.pendingBlock;
        showBlockCollectScreen(d.pendingBlock);
      }
    })
    .catch(function(){});
  }, 3000);
}

// ============================================================
// شاشة COLLECT البلوك
// ============================================================
function showBlockCollectScreen(block) {
  var old = document.getElementById('blockCollectOverlay');
  if(old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'blockCollectOverlay';
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'background:radial-gradient(ellipse at center, rgba(255,0,0,0.15) 0%, rgba(0,0,0,0.97) 70%)',
    'z-index:99999',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'animation:blockFadeIn 0.5s ease'
  ].join(';');

  var rewardFormatted = block.reward.toLocaleString();

  overlay.innerHTML =
    '<style>' +
      '@keyframes blockFadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}' +
      '@keyframes blockPulse{0%,100%{box-shadow:0 0 60px rgba(255,0,0,0.5)}50%{box-shadow:0 0 120px rgba(255,0,0,0.9)}}' +
      '@keyframes blockFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}' +
    '</style>' +
    '<div style="' +
      'background:linear-gradient(180deg,#0d0000,#1a0000,#0d0000);' +
      'border:2px solid rgba(255,0,0,0.6);' +
      'border-radius:24px;' +
      'padding:32px 24px;' +
      'width:88vw;' +
      'max-width:340px;' +
      'text-align:center;' +
      'animation:blockPulse 2s ease-in-out infinite;' +
    '">' +
      '<div style="font-size:64px;animation:blockFloat 3s ease-in-out infinite;margin-bottom:8px;">⛏️</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:22px;font-weight:900;color:#FF0000;margin-bottom:4px;letter-spacing:2px;">'+t('blockFound')+'</div>' +
      '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:20px;">'+t('blockFoundSub')+'</div>' +

      '<div style="background:rgba(255,0,0,0.08);border:1px solid rgba(255,0,0,0.3);border-radius:14px;padding:8px 14px;display:inline-block;margin-bottom:20px;">' +
        '<span style="font-size:12px;color:rgba(255,255,255,0.5);">🔴 Block #</span>' +
        '<span style="font-size:18px;font-family:Orbitron,monospace;color:#FF4444;font-weight:900;">' + block.blockNumber + '</span>' +
      '</div>' +

      '<div style="background:linear-gradient(135deg,rgba(0,255,136,0.08),rgba(0,255,136,0.04));border:1px solid rgba(0,255,136,0.3);border-radius:16px;padding:20px;margin-bottom:24px;">' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;">'+t('blockReward')+'</div>' +
        '<div style="font-family:Orbitron,sans-serif;font-size:32px;font-weight:900;color:#00FF88;">+' + rewardFormatted + '</div>' +
        '<div style="font-size:14px;color:rgba(0,255,136,0.7);margin-top:4px;">REC</div>' +
      '</div>' +

      '<button id="collectBlockBtn" onclick="collectBlock()" style="' +
        'width:100%;' +
        'background:linear-gradient(135deg,#CC0000,#FF3300);' +
        'border:none;' +
        'color:white;' +
        'padding:16px;' +
        'border-radius:14px;' +
        'font-size:18px;' +
        'font-weight:900;' +
        'cursor:pointer;' +
        'letter-spacing:1px;' +
        'font-family:Orbitron,sans-serif;' +
      '">'+t('blockCollect')+'</button>' +

      '<div style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:12px;">'+t('blockCollectHint')+'</div>' +
    '</div>';

  document.body.appendChild(overlay);
}

// ============================================================
// COLLECT
// ============================================================
function collectBlock() {
  if(!currentPendingBlock || !window.tgUser) return;

  var btn = document.getElementById('collectBlockBtn');
  if(btn) { btn.disabled = true; btn.textContent = t('blockCollecting'); }

  fetch('/api/blocks/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telegramId:  tgUser.id,
      blockNumber: currentPendingBlock.blockNumber,
      token:       currentPendingBlock.token
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.success) {
      // أضف للرصيد المحلي
      if(typeof rec !== 'undefined') rec = d.newBalance || (rec + currentPendingBlock.reward);
      if(typeof updateUI === 'function') updateUI();
      if(typeof saveData === 'function') saveData(true);

      var overlay = document.getElementById('blockCollectOverlay');
      if(overlay) {
        overlay.innerHTML =
          '<div style="background:linear-gradient(180deg,#001a00,#000d00);border:2px solid rgba(0,255,136,0.5);border-radius:24px;padding:40px 24px;width:88vw;max-width:340px;text-align:center;">' +
            '<div style="font-size:64px;margin-bottom:12px;">🎉</div>' +
            '<div style="font-family:Orbitron,sans-serif;font-size:20px;font-weight:900;color:#00FF88;margin-bottom:8px;">'+t('blockCollected')+'</div>' +
            '<div style="font-size:32px;font-family:Orbitron,sans-serif;color:#00FF88;font-weight:900;margin:16px 0;">+' + currentPendingBlock.reward.toLocaleString() + ' REC</div>' +
            '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:20px;">'+t('blockAddedBal')+'</div>' +
            '<button onclick="document.getElementById(\'blockCollectOverlay\').remove()" style="background:rgba(0,255,136,0.15);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:12px 32px;border-radius:12px;cursor:pointer;font-size:14px;">'+t('blockClose')+'</button>' +
          '</div>';
      }
      currentPendingBlock = null;
      if(typeof showToast === 'function') showToast('🎉 Block #' + d.blockNumber + ' collected! +' + d.reward?.toLocaleString() + ' REC');
    } else {
      if(btn) { btn.disabled = false; btn.textContent = ''+t('blockCollect')+''; }
      if(typeof showToast === 'function') showToast(t('blockCollectErr'));
    }
  })
  .catch(function() {
    if(btn) { btn.disabled = false; btn.textContent = ''+t('blockCollect')+''; }
  });
}

// ============================================================
// BLOCK HISTORY
// ============================================================
function openBlockHistory() {
  if(!window.tgUser) return;

  var old = document.getElementById('blockHistoryModal');
  if(old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'blockHistoryModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;flex-direction:column;';

  modal.innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid rgba(255,255,255,0.08);">' +
      '<button onclick="document.getElementById(\'blockHistoryModal\').remove()" style="background:rgba(255,255,255,0.1);border:none;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px;">←</button>' +
      '<span style="font-family:Orbitron,sans-serif;font-size:16px;font-weight:900;color:white;">⛏️ '+t('blockHistory')+'</span>' +
    '</div>' +
    '<div id="blockHistoryList" style="flex:1;overflow-y:auto;padding:12px;">' +
      '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.3);">'+t('blockLoading')+'</div>' +
    '</div>';

  document.body.appendChild(modal);

  // جيب السجل
  fetch('/api/blocks/history/' + tgUser.id)
  .then(function(r){ return r.json(); })
  .then(function(blocks) {
    var list = document.getElementById('blockHistoryList');
    if(!list) return;

    if(!blocks || blocks.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:60px 20px;"><div style="font-size:48px;margin-bottom:12px;">⛏️</div><div style="color:rgba(255,255,255,0.3);font-size:14px;">'+t('blockEmpty')+'</div><div style="color:rgba(255,255,255,0.2);font-size:12px;margin-top:8px;">'+t('blockEmptySub')+'</div></div>';
      return;
    }

    list.innerHTML = blocks.map(function(b) {
      var date = new Date(b.foundAt).toLocaleDateString('ar', { day:'numeric', month:'short', year:'numeric' });
      var time = new Date(b.foundAt).toLocaleTimeString('ar', { hour:'2-digit', minute:'2-digit' });
      var status = b.collected
        ? '<span style="color:#00FF88;font-size:11px;">✅ تم الاستلام</span>'
        : '<span style="color:#FF8800;font-size:11px;">⏳ لم يُستلم</span>';

      return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;margin-bottom:10px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
          '<div style="font-family:Orbitron,monospace;font-size:13px;color:#FF4444;">🔴 Block #' + b.blockNumber + '</div>' +
          status +
        '</div>' +
        '<div style="font-family:Orbitron,sans-serif;font-size:20px;font-weight:900;color:#00FF88;margin-bottom:6px;">+' + b.reward.toLocaleString() + ' REC</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.3);">📅 ' + date + ' • ' + time + '</div>' +
      '</div>';
    }).join('');
  })
  .catch(function() {
    var list = document.getElementById('blockHistoryList');
    if(list) list.innerHTML = '<div style="text-align:center;padding:40px;color:#FF4444;">'+t('blockLoadErr')+'</div>';
  });
}

// ابدأ الـ ping عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(startBlockPing, 5000);
});
