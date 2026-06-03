// ====== ADS SYSTEM (Adsgram) ======
var AdsController = null;
var ADSGRAM_BLOCK_ID = '33984';
var AD_REC_REWARD = 5;
var AD_DAILY_MAX = 100;

function openAds() {
  // Remove old if exists
  var old = document.getElementById('adsModal');
  if(old) old.remove();

  var modal = document.createElement('div');
  modal.id = 'adsModal';
  modal.style.cssText = [
    'position:fixed',
    'top:0','left:0','right:0','bottom:0',
    'background:rgba(0,0,0,0.9)',
    'z-index:2147483647',
    'display:flex',
    'align-items:flex-end',
    'justify-content:center'
  ].join(';');

  var today = new Date().toISOString().split('T')[0];
  if(localStorage.getItem('adsDate') !== today) {
    localStorage.setItem('adsDate', today);
    localStorage.setItem('adsCount', '0');
  }
  var watched = parseInt(localStorage.getItem('adsCount') || '0');
  var remaining = AD_DAILY_MAX - watched;

  var inner = document.createElement('div');
  inner.style.cssText = [
    'background:linear-gradient(180deg,#0a1a0e,#050d08)',
    'border-radius:24px 24px 0 0',
    'border-top:2px solid rgba(0,255,136,0.5)',
    'padding:20px 16px 40px',
    'width:100%',
    'max-height:80vh',
    'overflow-y:auto'
  ].join(';');

  inner.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
      '<span style="font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#00FF88;">📺 ADS</span>' +
      '<button id="adsCloseBtn" style="background:rgba(255,255,255,0.1);border:none;color:white;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px;line-height:1;">✕</button>' +
    '</div>' +
    '<div style="text-align:center;margin-bottom:20px;">' +
      '<div style="font-size:50px;margin-bottom:8px;">📺</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:15px;color:#00FF88;font-weight:900;">WATCH & EARN</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;">شاهد إعلان واكسب REC مجاناً</div>' +
    '</div>' +
    '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:14px;padding:16px;margin-bottom:14px;text-align:center;">' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">مكافأة كل إعلان</div>' +
      '<div style="font-size:32px;font-family:Orbitron,sans-serif;color:#00FF88;font-weight:900;">+' + AD_REC_REWARD + ' REC</div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;background:rgba(255,255,255,0.04);border-radius:10px;padding:10px 14px;margin-bottom:20px;">' +
      '<span style="font-size:12px;color:rgba(255,255,255,0.5);">المشاهدات اليوم</span>' +
      '<span style="font-size:14px;font-weight:700;color:' + (remaining > 0 ? '#FFD700' : '#FF4444') + ';">' + watched + ' / ' + AD_DAILY_MAX + '</span>' +
    '</div>' +
    (remaining > 0
      ? '<button id="watchAdBtn" style="width:100%;background:linear-gradient(135deg,#00CC66,#00FF88);border:none;color:#000;padding:14px;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;">📺 شاهد إعلان ← +' + AD_REC_REWARD + ' REC</button>'
      : '<div style="text-align:center;padding:14px;background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);border-radius:14px;color:#FF4444;font-size:13px;">✅ وصلت للحد اليومي — تعال غداً!</div>'
    );

  modal.appendChild(inner);
  document.body.appendChild(modal);

  // Close on backdrop
  modal.addEventListener('click', function(e) {
    if(e.target === modal) modal.remove();
  });
  var closeBtn = document.getElementById('adsCloseBtn');
  if(closeBtn) closeBtn.onclick = function() { modal.remove(); };

  var watchBtn = document.getElementById('watchAdBtn');
  if(watchBtn) watchBtn.onclick = function() { watchAd(modal); };
}

function watchAd(modal) {
  if(!AdsController) {
    initAdsgram();
    if(!AdsController) {
      if(typeof showToast === 'function') showToast('الإعلانات غير متاحة حالياً');
      return;
    }
  }
  AdsController.show().then(function(result) {
    if(result && result.done) {
      giveAdReward(modal);
    }
  }).catch(function(e) {
    console.log('Ad error:', e);
    if(typeof showToast === 'function') showToast('❌ حدث خطأ — حاول مجدداً');
  });
}

function giveAdReward(modal) {
  var telegramId = (typeof tgUser !== 'undefined' && tgUser) ? tgUser.id : null;
  if(!telegramId) return;

  fetch('/api/adsgram/reward', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ telegramId: telegramId, reward: AD_REC_REWARD })
  }).then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.success) {
      if(typeof rec !== 'undefined') rec = d.newBalance || (rec + AD_REC_REWARD);
    } else {
      if(typeof rec !== 'undefined') rec += AD_REC_REWARD;
    }
    var watched = parseInt(localStorage.getItem('adsCount') || '0') + 1;
    localStorage.setItem('adsCount', String(watched));
    if(typeof updateUI === 'function') updateUI();
    if(typeof showToast === 'function') showToast('🎉 +' + AD_REC_REWARD + ' REC! شكراً على المشاهدة');
    if(modal) modal.remove();
    setTimeout(openAds, 300);
  }).catch(function() {
    if(typeof rec !== 'undefined') rec += AD_REC_REWARD;
    var watched = parseInt(localStorage.getItem('adsCount') || '0') + 1;
    localStorage.setItem('adsCount', String(watched));
    if(typeof updateUI === 'function') updateUI();
    if(typeof showToast === 'function') showToast('🎉 +' + AD_REC_REWARD + ' REC!');
    if(modal) modal.remove();
    setTimeout(openAds, 300);
  });
}

function initAdsgram() {
  try {
    if(window.Adsgram) {
      AdsController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
    }
  } catch(e) { console.log('Adsgram init error:', e); }
}

setTimeout(initAdsgram, 2000);
