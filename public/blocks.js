// ============================================================
// BLOCKS UI V2 — Bitcoin-style Block Mining
// ============================================================

var _blockCheckRunning = false;
var _pendingBlock = null;

// ============================================================
// فحص البلوك كل 3 ثواني (مدمج مع interval التعدين)
// ============================================================
function checkForBlock() {
  if(!window.tgUser || !recPerSec || recPerSec <= 0) return;
  if(_pendingBlock) return; // عنده بلوك ما استلمه بعد

  fetch('/api/blocks/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: tgUser.id, recPerSec: recPerSec })
  })
  .then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.found && d.blockNumber) {
      _pendingBlock = { blockNumber: d.blockNumber, reward: d.reward, token: d.token };
      showBlockPopup(_pendingBlock);
    }
  })
  .catch(function(){});
}

// ============================================================
// عند فتح البوت — فحص بلوك pending
// ============================================================
function checkPendingBlock() {
  if(!window.tgUser) return;
  fetch('/api/blocks/pending', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: tgUser.id })
  })
  .then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.pending) {
      _pendingBlock = d.pending;
      showBlockPopup(_pendingBlock);
    }
  })
  .catch(function(){});
}

// ============================================================
// POPUP — شاشة البلوك
// ============================================================
function showBlockPopup(block) {
  var old = document.getElementById('blockFoundOverlay');
  if(old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'blockFoundOverlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0',
    'background:radial-gradient(ellipse at center,rgba(255,0,0,0.15) 0%,rgba(0,0,0,0.97) 70%)',
    'z-index:99999', 'display:flex', 'align-items:center', 'justify-content:center',
    'animation:bfadeIn 0.4s ease'
  ].join(';');

  var box = document.createElement('div');
  box.style.cssText = [
    'background:linear-gradient(180deg,#0d0000,#1a0000)',
    'border:2px solid rgba(255,0,0,0.6)',
    'border-radius:24px', 'padding:32px 24px',
    'width:88vw', 'max-width:340px', 'text-align:center',
    'box-shadow:0 0 80px rgba(255,0,0,0.4)'
  ].join(';');

  box.innerHTML =
    '<style>@keyframes bfadeIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}' +
    '@keyframes bpulse{0%,100%{box-shadow:0 0 40px rgba(255,0,0,0.4)}50%{box-shadow:0 0 100px rgba(255,0,0,0.8)}}</style>' +
    '<div style="font-size:56px;margin-bottom:10px;">⛏️</div>' +
    '<div style="font-family:Orbitron,sans-serif;font-size:20px;font-weight:900;color:#FF0000;letter-spacing:2px;margin-bottom:4px;">BLOCK FOUND!</div>' +
    '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:20px;">لقيت بلوك جديد!</div>' +
    '<div style="background:rgba(255,0,0,0.08);border:1px solid rgba(255,0,0,0.3);border-radius:12px;padding:8px 16px;display:inline-block;margin-bottom:16px;">' +
      '<span style="font-size:13px;color:rgba(255,255,255,0.4);">🔴 Block #</span>' +
      '<span style="font-size:20px;font-family:Orbitron,monospace;color:#FF4444;font-weight:900;">' + block.blockNumber + '</span>' +
    '</div>' +
    '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.25);border-radius:14px;padding:18px;margin-bottom:22px;">' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px;">💰 مكافأتك</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:34px;font-weight:900;color:#00FF88;">+' + block.reward.toLocaleString() + '</div>' +
      '<div style="font-size:13px;color:rgba(0,255,136,0.6);margin-top:2px;">REC</div>' +
    '</div>' +
    '<button id="collectBlockBtn" onclick="collectBlock()" style="' +
      'width:100%;background:linear-gradient(135deg,#CC0000,#FF3300);' +
      'border:none;color:white;padding:16px;border-radius:14px;' +
      'font-size:18px;font-weight:900;cursor:pointer;' +
      'font-family:Orbitron,sans-serif;letter-spacing:1px;' +
    '">⚡ COLLECT</button>' +
    '<div style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:10px;">اضغط Collect لاستلام مكافأتك</div>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// ============================================================
// COLLECT
// ============================================================
function collectBlock() {
  if(!_pendingBlock || !window.tgUser) return;
  var btn = document.getElementById('collectBlockBtn');
  if(btn) { btn.disabled = true; btn.textContent = '⏳ جاري الاستلام...'; }

  fetch('/api/blocks/collect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telegramId:  tgUser.id,
      blockNumber: _pendingBlock.blockNumber,
      token:       _pendingBlock.token
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.success) {
      if(typeof rec !== 'undefined') rec = d.newBalance || (rec + _pendingBlock.reward);
      if(typeof updateUI === 'function') updateUI();
      if(typeof saveData === 'function') saveData(true);

      var overlay = document.getElementById('blockFoundOverlay');
      if(overlay) {
        overlay.innerHTML =
          '<div style="background:linear-gradient(180deg,#001a00,#000d00);border:2px solid rgba(0,255,136,0.5);border-radius:24px;padding:40px 24px;width:88vw;max-width:340px;text-align:center;">' +
            '<div style="font-size:56px;margin-bottom:12px;">🎉</div>' +
            '<div style="font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#00FF88;margin-bottom:10px;">' + t('blockCollected','✅ Collected') + '</div>' +
            '<div style="font-size:32px;font-family:Orbitron,sans-serif;color:#00FF88;font-weight:900;margin:12px 0;">+' + _pendingBlock.reward.toLocaleString() + ' REC</div>' +
            '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:20px;">أضيف لرصيدك ✅</div>' +
            '<button onclick="document.getElementById(\'blockFoundOverlay\').remove()" style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:12px 32px;border-radius:12px;cursor:pointer;font-size:14px;">إغلاق ✕</button>' +
          '</div>';
      }
      _pendingBlock = null;
    } else {
      if(btn) { btn.disabled = false; btn.textContent = '⚡ COLLECT'; }
    }
  })
  .catch(function() {
    if(btn) { btn.disabled = false; btn.textContent = '⚡ COLLECT'; }
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
      '<span style="font-family:Orbitron,sans-serif;font-size:16px;font-weight:900;color:white;">⛏️ Block History</span>' +
    '</div>' +
    '<div id="blockHistoryList" style="flex:1;overflow-y:auto;padding:12px;">' +
      '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.3);">' + t('blockLoading','⏳ Loading...') + '</div>' +
    '</div>';

  document.body.appendChild(modal);

  fetch('/api/blocks/history/' + tgUser.id)
  .then(function(r){ return r.json(); })
  .then(function(blocks) {
    var list = document.getElementById('blockHistoryList');
    if(!list) return;
    if(!blocks || blocks.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:60px 20px;"><div style="font-size:48px;margin-bottom:12px;">⛏️</div><div style="color:rgba(255,255,255,0.3);font-size:14px;">' + t('blockEmpty') + '</div><div style="color:rgba(255,255,255,0.2);font-size:12px;margin-top:8px;">' + t('blockEmptySub') + '</div></div>';
      return;
    }
    list.innerHTML = blocks.map(function(b) {
      var date = new Date(b.foundAt).toLocaleDateString('ar', { day:'numeric', month:'short', year:'numeric' });
      var status = b.collected
        ? '<span style="color:#00FF88;font-size:11px;">' + t('blockCollected','✅ Collected') + '</span>'
        : '<span style="color:#FF8800;font-size:11px;cursor:pointer;" onclick="collectBlock()">⏳ اضغط للاستلام</span>';
      return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:14px 16px;margin-bottom:10px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<div style="font-family:Orbitron,monospace;font-size:13px;color:#FF4444;">🔴 Block #' + b.blockNumber + '</div>' +
          status +
        '</div>' +
        '<div style="font-family:Orbitron,sans-serif;font-size:20px;font-weight:900;color:#00FF88;margin-bottom:4px;">+' + b.reward.toLocaleString() + ' REC</div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.3);">📅 ' + date + '</div>' +
      '</div>';
    }).join('');
  })
  .catch(function() {
    var list = document.getElementById('blockHistoryList');
    if(list) list.innerHTML = '<div style="text-align:center;padding:40px;color:#FF4444;">خطأ في التحميل</div>';
  });
}

// ============================================================
// INIT — عند فتح البوت
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  // فحص بلوك pending فوراً
  setTimeout(checkPendingBlock, 3000);
});
