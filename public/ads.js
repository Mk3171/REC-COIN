// ====== ADS SYSTEM (Adsgram) ======
var AdsController = null;
var ADSGRAM_BLOCK_ID = '33984';
var AD_REC_REWARD = 5;
var AD_DAILY_MAX = 100;
var todayAdsWatched = 0;

function initAdsgram() {
  try {
    if(window.Adsgram) {
      AdsController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
    }
  } catch(e) { console.log('Adsgram init error:', e); }
}

function openAds() {
  var overlay = document.getElementById('adsOverlay');
  var popup = document.getElementById('adsPopup');
  if(!overlay || !popup) {
    // Elements not found - create them dynamically
    createAdsElements();
    overlay = document.getElementById('adsOverlay');
    popup = document.getElementById('adsPopup');
  }
  if(overlay) { overlay.style.cssText = 'display:block!important;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999990;'; }
  if(popup) { popup.style.cssText = 'display:block!important;position:fixed;bottom:0;left:0;right:0;z-index:999991;background:linear-gradient(180deg,#0a1a0e,#050d08);border-radius:24px 24px 0 0;border-top:2px solid rgba(0,255,136,0.4);padding:20px 16px 36px;max-height:85vh;overflow-y:auto;'; }
  renderAdsUI();
}

function createAdsElements() {
  if(document.getElementById('adsOverlay')) return;
  var ov = document.createElement('div');
  ov.id = 'adsOverlay';
  ov.onclick = closeAds;
  document.body.appendChild(ov);
  var pp = document.createElement('div');
  pp.id = 'adsPopup';
  pp.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><div style="font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#00FF88;">📺 ADS</div><button onclick="closeAds()" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);color:white;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;">✕</button></div><div id="adsContent"></div>';
  document.body.appendChild(pp);
}

function closeAds() {
  var overlay = document.getElementById('adsOverlay');
  var popup = document.getElementById('adsPopup');
  if(overlay) overlay.style.display = 'none';
  if(popup) popup.style.display = 'none';
}

function renderAdsUI() {
  var today = new Date().toISOString().split('T')[0];
  var savedDate = localStorage.getItem('adsDate');
  if(savedDate !== today) {
    todayAdsWatched = 0;
    localStorage.setItem('adsDate', today);
    localStorage.setItem('adsCount', '0');
  } else {
    todayAdsWatched = parseInt(localStorage.getItem('adsCount') || '0');
  }

  var remaining = AD_DAILY_MAX - todayAdsWatched;
  var el = document.getElementById('adsContent');
  if(!el) return;

  el.innerHTML =
    '<div style="text-align:center;margin-bottom:20px;">' +
      '<div style="font-size:48px;margin-bottom:8px;">📺</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:16px;color:#00FF88;font-weight:900;">WATCH & EARN</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;">شاهد إعلان واكسب REC مجاناً</div>' +
    '</div>' +
    '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:14px;padding:16px;margin-bottom:16px;text-align:center;">' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">مكافأة كل إعلان</div>' +
      '<div style="font-size:32px;font-family:Orbitron,sans-serif;color:#00FF88;font-weight:900;">+' + AD_REC_REWARD + ' REC</div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);border-radius:10px;padding:10px 14px;margin-bottom:20px;">' +
      '<span style="font-size:12px;color:rgba(255,255,255,0.5);">المشاهدات اليوم</span>' +
      '<span style="font-size:14px;font-weight:700;color:' + (remaining > 0 ? '#FFD700' : '#FF4444') + ';">' + todayAdsWatched + ' / ' + AD_DAILY_MAX + '</span>' +
    '</div>' +
    (remaining > 0
      ? '<button onclick="watchAd()" style="width:100%;background:linear-gradient(135deg,#00CC66,#00FF88);border:none;color:#000;padding:14px;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;font-family:Rajdhani,sans-serif;">📺 شاهد إعلان ← +' + AD_REC_REWARD + ' REC</button>'
      : '<div style="text-align:center;padding:14px;background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);border-radius:14px;color:#FF4444;font-size:13px;">✅ وصلت للحد اليومي — تعال غداً!</div>'
    ) +
    '<div style="text-align:center;margin-top:12px;font-size:10px;color:rgba(255,255,255,0.2);">يتجدد كل يوم في منتصف الليل</div>';
}

function watchAd() {
  var remaining = AD_DAILY_MAX - todayAdsWatched;
  if(remaining <= 0) { showToast('وصلت للحد اليومي!'); return; }

  if(!AdsController) {
    // Try to init again
    initAdsgram();
    if(!AdsController) {
      showToast('❌ الإعلانات غير متاحة الآن');
      return;
    }
  }

  AdsController.show().then(function(result) {
    if(result && result.done) {
      // Ad watched successfully - give reward
      giveAdReward();
    }
  }).catch(function(e) {
    console.log('Ad error:', e);
    showToast('❌ حدث خطأ — حاول مجدداً');
  });
}

function giveAdReward() {
  if(!tgUser) return;

  // Server-side reward
  fetch('/api/adsgram/reward?userId=' + tgUser.id, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ telegramId: tgUser.id, reward: AD_REC_REWARD })
  }).then(function(r){ return r.json(); })
  .then(function(d) {
    if(d.success) {
      // Update local rec
      if(typeof rec !== 'undefined') rec = d.newBalance || (rec + AD_REC_REWARD);
      if(typeof updateUI === 'function') updateUI();

      // Update counter
      todayAdsWatched++;
      localStorage.setItem('adsCount', String(todayAdsWatched));

      showToast('🎉 +' + AD_REC_REWARD + ' REC! شكراً على المشاهدة');
      renderAdsUI();
    }
  }).catch(function(){ 
    // Fallback: add locally
    if(typeof rec !== 'undefined') rec += AD_REC_REWARD;
    todayAdsWatched++;
    localStorage.setItem('adsCount', String(todayAdsWatched));
    if(typeof updateUI === 'function') updateUI();
    showToast('🎉 +' + AD_REC_REWARD + ' REC!');
    renderAdsUI();
  });
}

// Init on load
setTimeout(initAdsgram, 2000);
