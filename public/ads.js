// ====== ADS SYSTEM V2 — 7 Daily Tiers ======
var AD_REC_REWARD = 5;

// 7 Tiers: [ads required, bonus reward]
var AD_TIERS = [
  { ads: 20,  bonus: 200,  label: '🌱' },
  { ads: 50,  bonus: 300,  label: '⭐' },
  { ads: 100, bonus: 300,  label: '🔥' },
  { ads: 100, bonus: 400,  label: '💎' },
  { ads: 100, bonus: 500,  label: '🚀' },
  { ads: 100, bonus: 700,  label: '⚡' },
  { ads: 100, bonus: 1000, label: '👑' },
];

// ====== Persistent Total Ads Counter ======
function getTotalAdsWatched() {
  try { return parseInt(localStorage.getItem('adsTotalWatched') || '0'); } catch(e) { return 0; }
}
function incrementTotalAdsWatched() {
  try { localStorage.setItem('adsTotalWatched', getTotalAdsWatched() + 1); } catch(e) {}
}

// ====== Daily Reset ======
function getAdState() {
  var today = new Date().toISOString().split('T')[0];
  var raw = null;
  try { raw = JSON.parse(localStorage.getItem('adsStateV2')); } catch(e){}
  if(!raw || raw.date !== today) {
    raw = { date: today, watched: 0, bonusClaimed: [] };
    localStorage.setItem('adsStateV2', JSON.stringify(raw));
  }
  return raw;
}
function saveAdState(state) {
  try { localStorage.setItem('adsStateV2', JSON.stringify(state)); } catch(e){}
}

// ====== Get current tier index ======
function getCurrentTier(watched) {
  var cumulative = 0;
  for(var i = 0; i < AD_TIERS.length; i++) {
    cumulative += AD_TIERS[i].ads;
    if(watched < cumulative) return i;
  }
  return AD_TIERS.length - 1;
}
function getTierStart(tierIdx) {
  var s = 0;
  for(var i = 0; i < tierIdx; i++) s += AD_TIERS[i].ads;
  return s;
}
function getTotalAds() {
  return AD_TIERS.reduce(function(s,t){ return s + t.ads; }, 0); // 570
}

// ====== Open Ads Modal ======
function openAds() {
  var old = document.getElementById('adsModal');
  if(old) old.remove();

  var state = getAdState();
  var watched = state.watched;
  var totalAds = getTotalAds();
  var tierIdx = getCurrentTier(watched);
  var tier = AD_TIERS[Math.min(tierIdx, AD_TIERS.length-1)];
  var tierStart = getTierStart(tierIdx);
  var tierWatched = watched - tierStart;
  var tierRemaining = tier.ads - tierWatched;
  var allDone = watched >= totalAds;

  var modal = document.createElement('div');
  modal.id = 'adsModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:2147483647;display:flex;align-items:flex-end;justify-content:center;';

  var inner = document.createElement('div');
  inner.style.cssText = 'background:linear-gradient(180deg,#0a1a0e,#050d08);border-radius:24px 24px 0 0;border-top:2px solid rgba(0,255,136,0.5);padding:20px 16px 0;width:100%;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column;';

  // Header
  var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
    '<span style="font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#00FF88;">' + t('adsTitle','📺 ADS') + '</span>' +
    '<button id="adsCloseBtn" style="background:rgba(255,255,255,0.1);border:none;color:white;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px;">✕</button>' +
  '</div>';

  // Total progress bar
  var totalPct = Math.min(100, Math.floor(watched / totalAds * 100));
  html += '<div style="margin-bottom:16px;">' +
    '<div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">' +
      '<span>' + t('adsWatchedToday','Today') + '</span>' +
      '<span style="color:#FFD700;font-weight:700;">' + watched + ' / ' + totalAds + '</span>' +
    '</div>' +
    '<div style="background:rgba(255,255,255,0.06);border-radius:6px;height:6px;">' +
      '<div style="background:linear-gradient(90deg,#00FF88,#FFD700);width:' + totalPct + '%;height:6px;border-radius:6px;transition:width 0.3s;"></div>' +
    '</div>' +
  '</div>';

  // Tier cards - card style
  var cumulative = 0;
  for(var i = 0; i < AD_TIERS.length; i++) {
    var t2 = AD_TIERS[i];
    var tStart = cumulative;
    cumulative += t2.ads;
    var tWatched = Math.min(Math.max(watched - tStart, 0), t2.ads);
    var tPct = Math.floor(tWatched / t2.ads * 100);
    var isComplete = watched >= cumulative;
    var isActive = !isComplete && watched >= tStart;
    var isLocked = watched < tStart;
    var bonusClaimed = state.bonusClaimed.indexOf(i) !== -1;

    var cardBg = isComplete
      ? 'linear-gradient(135deg,rgba(0,255,136,0.12),rgba(0,180,80,0.06))'
      : isActive
        ? 'linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,140,0,0.06))'
        : 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))';
    var cardBorder = isComplete ? 'rgba(0,255,136,0.35)' : isActive ? 'rgba(255,215,0,0.35)' : 'rgba(255,255,255,0.07)';
    var accentColor = isComplete ? '#00FF88' : isActive ? '#FFD700' : 'rgba(255,255,255,0.3)';

    html += '<div style="background:' + cardBg + ';border:1px solid ' + cardBorder + ';border-radius:18px;padding:14px 16px;margin-bottom:10px;">';

    // Top row: emoji + tier info + count
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
        '<div style="width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:22px;">' +
          t2.label +
        '</div>' +
        '<div>' +
          '<div style="font-size:13px;font-weight:900;color:' + accentColor + ';letter-spacing:0.5px;">' +
            t('adsTier','Tier') + ' ' + (i+1) +
          '</div>' +
          '<div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:1px;">' +
            t2.ads + ' ' + t('adsAdsLabel','ads') +
          '</div>' +
        '</div>' +
      '</div>' +
      // Right side: progress count + bonus
      '<div style="text-align:right;">' +
        '<div style="font-size:14px;font-weight:900;color:' + accentColor + ';">' +
          tWatched + '<span style="font-size:11px;color:rgba(255,255,255,0.3);">/' + t2.ads + '</span>' +
        '</div>' +
        '<div style="font-size:11px;color:rgba(255,215,0,0.8);font-weight:700;margin-top:1px;">+' + t2.bonus + ' REC</div>' +
      '</div>' +
    '</div>';

    // Progress bar
    html += '<div style="background:rgba(255,255,255,0.07);border-radius:6px;height:7px;margin-bottom:10px;">' +
      '<div style="background:' + (isComplete ? 'linear-gradient(90deg,#00FF88,#00CC66)' : 'linear-gradient(90deg,#FFD700,#FF8800)') + ';width:' + tPct + '%;height:7px;border-radius:6px;transition:width 0.4s;"></div>' +
    '</div>';

    // Bottom: claim button or status
    if(isComplete && !bonusClaimed) {
      html += '<button onclick="claimTierBonus(' + i + ')" style="width:100%;background:linear-gradient(135deg,#FFD700,#FF8800);border:none;color:#000;padding:10px;border-radius:10px;font-size:13px;font-weight:900;cursor:pointer;letter-spacing:0.5px;">🎁 ' + t('adsTierClaim','Claim') + ' +' + t2.bonus + ' REC</button>';
    } else if(isComplete && bonusClaimed) {
      html += '<div style="text-align:center;font-size:12px;color:#00FF88;font-weight:700;">✅ +' + t2.bonus + ' REC ' + t('adsClaimed','Claimed') + '</div>';
    } else if(isActive) {
      html += '<div style="text-align:center;font-size:11px;color:rgba(255,215,0,0.6);">▶ ' + t('adsInProgress','In progress...') + '</div>';
    } else {
      html += '<div style="text-align:center;font-size:11px;color:rgba(255,255,255,0.25);">⏳ ' + t('adsWaiting','Not started yet') + '</div>';
    }

    html += '</div>';
  }

  // Watch button or done — sticky footer outside scrollable area
  inner.innerHTML = html;
  inner.style.paddingBottom = '0';

  // Sticky footer with Watch button
  var footer = document.createElement('div');
  footer.style.cssText = 'padding:12px 16px 28px;background:linear-gradient(0deg,#050d08 80%,transparent);position:sticky;bottom:0;left:0;right:0;';
  if(allDone) {
    footer.innerHTML = '<div style="text-align:center;padding:14px;background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);border-radius:14px;color:#00FF88;font-size:13px;font-weight:700;">' +
      '🏆 ' + t('adsDailyLimit','Daily limit reached — come back tomorrow!') +
    '</div>';
  } else {
    footer.innerHTML = '<button id="watchAdBtn" style="width:100%;background:linear-gradient(135deg,#00CC66,#00FF88);border:none;color:#000;padding:14px;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 4px 20px rgba(0,255,136,0.4);">' +
      t('adsWatchBtn','📺 Watch Ad') + ' ← +' + AD_REC_REWARD + ' REC' +
    '</button>';
  }

  modal.appendChild(inner);
  inner.appendChild(footer);
  document.body.appendChild(modal);

  modal.addEventListener('click', function(e){ if(e.target === modal) modal.remove(); });
  document.getElementById('adsCloseBtn').onclick = function(){ modal.remove(); };
  var wb = document.getElementById('watchAdBtn');
  if(wb) wb.onclick = function(){ watchAd(modal); };
}

// ====== Watch Ad ======
function watchAd(modal) {
  var btn = document.getElementById('watchAdBtn');
  if(btn) { btn.disabled = true; btn.textContent = t('adsLoading','⏳ Loading...'); }

  // Try RichAds first; if no fill / error, fall back to Monetag.
  if(window.TelegramAdsController && typeof window.TelegramAdsController.triggerInterstitialVideo === 'function') {
    // RichAds' ad overlay renders at a normal z-index, which ends up BEHIND our
    // fullscreen ads modal (z-index:2147483647). Hide our modal while their ad
    // plays so it's actually visible, then restore it afterwards.
    if(modal) modal.style.display = 'none';
    window.TelegramAdsController.triggerInterstitialVideo().then(function() {
      if(modal) modal.style.display = 'flex';
      giveAdReward(modal);
    }).catch(function(e) {
      console.log('RichAds unavailable, falling back to Monetag:', e);
      if(modal) modal.style.display = 'flex';
      watchAdMonetag(modal, btn);
    });
  } else {
    watchAdMonetag(modal, btn);
  }
}

function watchAdMonetag(modal, btn) {
  if(typeof show_11099536 === 'function') {
    show_11099536().then(function() {
      giveAdReward(modal);
    }).catch(function(e) {
      console.log('Ad error:', e);
      if(btn) { btn.disabled = false; btn.textContent = t('adsWatchBtn','📺 Watch Ad') + ' ← +' + AD_REC_REWARD + ' REC'; }
      if(typeof showToast === 'function') showToast(t('adsUnavailable','❌ Ad unavailable — try again'));
    });
  } else {
    if(btn) { btn.disabled = false; btn.textContent = t('adsWatchBtn','📺 Watch Ad') + ' ← +' + AD_REC_REWARD + ' REC'; }
    if(typeof showToast === 'function') showToast(t('adsUnavailable','❌ Ad unavailable — try again'));
    var s = document.createElement('script');
    s.src = '//libtl.com/sdk.js';
    s.setAttribute('data-zone', '11099536');
    s.setAttribute('data-sdk', 'show_11099536');
    document.head.appendChild(s);
  }
}

// ====== Give Reward ======
function giveAdReward(modal) {
  var state = getAdState();
  state.watched += 1;
  saveAdState(state);
  incrementTotalAdsWatched();
  if(typeof incrementAdsTaskProgress === 'function') incrementAdsTaskProgress();

  if(typeof rec !== 'undefined') rec += AD_REC_REWARD;
  if(typeof updateUI === 'function') updateUI();
  if(typeof saveData === 'function') saveData(true);
  if(typeof showToast === 'function') showToast('🎉 +' + AD_REC_REWARD + ' REC! ' + t('adsRewardMsg','Thanks for watching'));
  if(modal) modal.remove();

  var tid = (typeof tgUser !== 'undefined' && tgUser) ? tgUser.id : null;
  if(tid) fetch('/api/adsgram/reward', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ telegramId: tid, reward: AD_REC_REWARD }) }).catch(function(){});

  setTimeout(openAds, 400);
}

// ====== Claim Tier Bonus ======
function claimTierBonus(tierIdx) {
  var state = getAdState();
  if(state.bonusClaimed.indexOf(tierIdx) !== -1) return;

  var bonus = AD_TIERS[tierIdx].bonus;
  state.bonusClaimed.push(tierIdx);
  saveAdState(state);

  if(typeof rec !== 'undefined') rec += bonus;
  if(typeof updateUI === 'function') updateUI();
  if(typeof saveData === 'function') saveData(true);
  if(typeof showToast === 'function') showToast('🎁 +' + bonus + ' REC! ' + t('adsTierBonus','Tier bonus claimed!'));

  var tid = (typeof tgUser !== 'undefined' && tgUser) ? tgUser.id : null;
  if(tid) fetch('/api/adsgram/reward', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ telegramId: tid, reward: bonus }) }).catch(function(){});

  setTimeout(openAds, 300);
}
