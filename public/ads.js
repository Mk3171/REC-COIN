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
  inner.style.cssText = 'background:linear-gradient(180deg,#0a1a0e,#050d08);border-radius:24px 24px 0 0;border-top:2px solid rgba(0,255,136,0.5);padding:20px 16px 40px;width:100%;max-height:90vh;overflow-y:auto;';

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

  // Tier cards
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

    var borderColor = isComplete ? 'rgba(0,255,136,0.4)' : isActive ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)';
    var bgColor = isComplete ? 'rgba(0,255,136,0.06)' : isActive ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.02)';
    var opacity = isLocked ? '0.4' : '1';

    html += '<div style="border:1px solid ' + borderColor + ';background:' + bgColor + ';border-radius:14px;padding:12px 14px;margin-bottom:10px;opacity:' + opacity + ';">';

    // Tier header
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span style="font-size:20px;">' + t2.label + '</span>' +
        '<div>' +
          '<div style="font-size:12px;font-weight:700;color:' + (isComplete ? '#00FF88' : isActive ? '#FFD700' : 'rgba(255,255,255,0.5)') + ';">' +
            t('adsTier','Tier') + ' ' + (i+1) +
          '</div>' +
          '<div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t2.ads + ' ' + t('adsAdsLabel','ads') + ' → +' + t2.bonus + ' REC</div>' +
        '</div>' +
      '</div>' +
      (isComplete && !bonusClaimed
        ? '<button onclick="claimTierBonus(' + i + ')" style="background:linear-gradient(135deg,#FFD700,#FF8800);border:none;color:#000;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:900;cursor:pointer;">+' + t2.bonus + ' REC</button>'
        : isComplete && bonusClaimed
          ? '<span style="color:#00FF88;font-size:12px;font-weight:700;">✅ +' + t2.bonus + '</span>'
          : '<span style="color:rgba(255,255,255,0.3);font-size:11px;">' + tWatched + '/' + t2.ads + '</span>'
      ) +
    '</div>';

    // Progress bar
    html += '<div style="background:rgba(255,255,255,0.06);border-radius:4px;height:4px;">' +
      '<div style="background:' + (isComplete ? '#00FF88' : '#FFD700') + ';width:' + tPct + '%;height:4px;border-radius:4px;"></div>' +
    '</div>';

    html += '</div>';
  }

  // Watch button or done
  html += '<div style="margin-top:4px;">';
  if(allDone) {
    html += '<div style="text-align:center;padding:14px;background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);border-radius:14px;color:#00FF88;font-size:13px;font-weight:700;">' +
      '🏆 ' + t('adsDailyLimit','Daily limit reached — come back tomorrow!') +
    '</div>';
  } else {
    html += '<button id="watchAdBtn" style="width:100%;background:linear-gradient(135deg,#00CC66,#00FF88);border:none;color:#000;padding:14px;border-radius:14px;font-size:15px;font-weight:900;cursor:pointer;">' +
      t('adsWatchBtn','📺 Watch Ad') + ' ← +' + AD_REC_REWARD + ' REC' +
    '</button>';
  }
  html += '</div>';

  inner.innerHTML = html;
  modal.appendChild(inner);
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
