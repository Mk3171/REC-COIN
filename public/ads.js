// ====== ADS SYSTEM (Monetag) ======
var MONETAG_ZONE = '11099536';
var AD_REC_REWARD = 5;
var AD_DAILY_MAX = 100;

function openAds() {
  var old = document.getElementById('adsModal');
  if(old) old.remove();

  var today = new Date().toISOString().split('T')[0];
  if(localStorage.getItem('adsDate') !== today) {
    localStorage.setItem('adsDate', today);
    localStorage.setItem('adsCount', '0');
  }
  var watched = parseInt(localStorage.getItem('adsCount') || '0');
  var remaining = AD_DAILY_MAX - watched;

  var modal = document.createElement('div');
  modal.id = 'adsModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:2147483647;display:flex;align-items:flex-end;justify-content:center;';

  var inner = document.createElement('div');
  inner.style.cssText = 'background:linear-gradient(180deg,#0a1a0e,#050d08);border-radius:24px 24px 0 0;border-top:2px solid rgba(0,255,136,0.5);padding:20px 16px 40px;width:100%;max-height:80vh;overflow-y:auto;';

  inner.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
      '<span style="font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#00FF88;">' + t('adsTitle','📺 ADS') + '</span>' +
      '<button id="adsCloseBtn" style="background:rgba(255,255,255,0.1);border:none;color:white;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px;">✕</button>' +
    '</div>' +
    '<div style="text-align:center;margin-bottom:20px;">' +
      '<div style="font-size:50px;margin-bottom:8px;">📺</div>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:15px;color:#00FF88;font-weight:900;">' + t('adsWatchEarn','WATCH & EARN') + '</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;">' + t('adsWatchSub','Watch an ad and earn free REC') + '</div>' +
    '</div>' +
    '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:14px;padding:16px;margin-bottom:14px;text-align:center;">' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">' + t('adsRewardLabel','Reward per ad') + '</div>' +
      '<div style="font-size:32px;font-family:Orbitron,sans-serif;color:#00FF88;font-weight:900;">+' + AD_REC_REWARD + ' REC</div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;background:rgba(255,255,255,0.04);border-radius:10px;padding:10px 14px;margin-bottom:20px;">' +
      '<span style="font-size:12px;color:rgba(255,255,255,0.5);">' + t('adsWatchedToday','Today views') + '</span>' +
      '<span style="font-size:14px;font-weight:700;color:' + (remaining > 0 ? '#FFD700' : '#FF4444') + ';">' + watched + ' / ' + AD_DAILY_MAX + '</span>' +
    '</div>' +
    (remaining > 0
      ? '<button id="watchAdBtn" style="width:100%;background:linear-gradient(135deg,#00CC66,#00FF88);border:none;color:#000;padding:14px;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;">' + t('adsWatchBtn','📺 Watch Ad') + ' ← +' + AD_REC_REWARD + ' REC</button>'
      : '<div style="text-align:center;padding:14px;background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);border-radius:14px;color:#FF4444;font-size:13px;">' + t('adsDailyLimit','✅ Daily limit reached — come back tomorrow!') + '</div>'
    );

  modal.appendChild(inner);
  document.body.appendChild(modal);

  modal.addEventListener('click', function(e){ if(e.target === modal) modal.remove(); });
  document.getElementById('adsCloseBtn').onclick = function(){ modal.remove(); };
  var watchBtn = document.getElementById('watchAdBtn');
  if(watchBtn) watchBtn.onclick = function(){ watchAd(modal); };
}

function watchAd(modal) {
  var btn = document.getElementById('watchAdBtn');
  if(btn) { btn.disabled = true; btn.textContent = t('adsLoading','⏳ Loading...'); }

  // ✅ تحقق إن Monetag SDK محمل
  if(typeof show_11099536 !== 'function') {
    if(btn) { btn.disabled = false; btn.textContent = t('adsWatchBtn','📺 Watch Ad') + ' ← +' + AD_REC_REWARD + ' REC'; }
    if(typeof showToast === 'function') showToast(t('adsLoading','⏳ Loading...'));
    // حاول تحميل SDK مجدداً
    var s = document.createElement('script');
    s.src = '//libtl.com/sdk.js';
    s.setAttribute('data-zone', '11099536');
    s.setAttribute('data-sdk', 'show_11099536');
    document.head.appendChild(s);
    return;
  }

  show_11099536().then(function() {
    giveAdReward(modal);
  }).catch(function(e) {
    console.log('Ad error:', e);
    if(btn) { btn.disabled = false; btn.textContent = '📺 شاهد إعلان ← +' + AD_REC_REWARD + ' REC'; }
    if(typeof showToast === 'function') showToast(t('adsUnavailable','❌ Ad unavailable — try again'));
  });
}

function giveAdReward(modal) {
  var telegramId = (typeof tgUser !== 'undefined' && tgUser) ? tgUser.id : null;

  // ✅ أضف المكافأة مباشرة لـ rec
  if(typeof rec !== 'undefined') rec += AD_REC_REWARD;
  var watched = parseInt(localStorage.getItem('adsCount') || '0') + 1;
  localStorage.setItem('adsCount', String(watched));
  if(typeof updateUI === 'function') updateUI();
  if(typeof saveData === 'function') saveData(true);
  if(typeof showToast === 'function') showToast('🎉 +' + AD_REC_REWARD + ' REC! ' + t('adsRewardMsg','Thanks for watching'));
  if(modal) modal.remove();

  // مزامنة مع السيرفر
  if(telegramId) {
    fetch('/api/adsgram/reward', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ telegramId: telegramId, reward: AD_REC_REWARD })
    }).catch(function(){});
  }

  setTimeout(openAds, 400);
}
