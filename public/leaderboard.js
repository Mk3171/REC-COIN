// ====== LEADERBOARD — leaderboard.js ======
// ====== LEADERBOARD, PROFILE, OFFLINE, INIT — cards.js ======
var currentTab = 'global';

function switchLeaderTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.lb-tab').forEach(function(b) { b.classList.remove('active'); });
  var btn = document.getElementById('tab_' + tab);
  if(btn) btn.classList.add('active');
  loadLeaderboard(tab);
}

function loadLeaderboard(tab) {
  var cont = document.getElementById('lbContent');
  if(!cont) return;
  cont.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.3);">⏳ Loading...</div>';

  var uid = tgUser ? tgUser.id : 0;

  // Friends tab - separate fetch
  if(tab === 'friends') {
    fetch('/api/leaderboard/friends/' + uid)
      .then(function(r){ return r.json(); })
      .then(function(d){ renderFriends(d.friends || []); })
      .catch(function(){
        cont.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.4);">Connection failed<br><button onclick="loadLeaderboard(\'friends\')" style="margin-top:10px;background:#CC0000;border:none;color:white;padding:8px 20px;border-radius:8px;cursor:pointer;">🔄 Retry</button></div>';
      });
    return;
  }

  // Global / Weekly / My Level tabs
  var p1 = fetch('/api/leaderboard/global').then(function(r){return r.json();}).catch(function(){return {top100:[]};});
  var p2 = fetch('/api/leaderboard/myrank/'+uid).then(function(r){return r.json();}).catch(function(){return {myRank:'-',neighbors:[]};});
  var p3 = fetch('/api/leaderboard/weekly').then(function(r){return r.json();}).catch(function(){return {daysLeft:7};});

  Promise.all([p1, p2, p3]).then(function(results) {
    var top100 = (results[0] && results[0].top100) ? results[0].top100 : [];
    renderGlobal(top100, results[1], results[2]);
  }).catch(function() {
    cont.innerHTML = '<div style="text-align:center;padding:30px;">' +
      '<div style="font-size:36px;margin-bottom:10px;">📡</div>' +
      '<div style="color:rgba(255,255,255,0.4);font-size:13px;margin-bottom:16px;">Connection failed</div>' +
      '<button onclick="loadLeaderboard(\'global\')" style="background:linear-gradient(135deg,#CC0000,#FF2200);border:none;color:white;padding:10px 24px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:Rajdhani,sans-serif;">🔄 Try Again</button>' +
      '</div>';
  });
}

function renderGlobal(top100, myRankData, weekly) {
  var cont = document.getElementById('lbContent');
  var myRank = myRankData ? myRankData.myRank : '-';

  // Calculate end of week client-side (next Sunday midnight)
  var _d = new Date();
  var _day = _d.getDay();
  var _daysLeft = _day === 0 ? 7 : 7 - _day;
  var _endOfWeek = new Date(_d.getTime() + _daysLeft * 86400000);
  _endOfWeek.setHours(0,0,0,0);
  weeklyEndMs = _endOfWeek.getTime();

  // Pre-calculate countdown string
  var _diff = Math.max(0, weeklyEndMs - Date.now());
  var _dd = Math.floor(_diff/86400000);
  var _hh = Math.floor((_diff%86400000)/3600000);
  var _mm = Math.floor((_diff%3600000)/60000);
  var _ss = Math.floor((_diff%60000)/1000);
  var _cdStr = pad2(_dd)+'d '+pad2(_hh)+'h '+pad2(_mm)+'m '+pad2(_ss)+'s';

  var html = '';

  // Weekly countdown
  html += '<div style="text-align:center;margin-bottom:16px;">' +
    '<div style="font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:2px;margin-bottom:4px;">REWARDS CREDIT IN</div>' +
    '<div id="weeklyCountdown" style="font-family:Orbitron,sans-serif;font-size:16px;color:#FFD700;font-weight:700;letter-spacing:2px;">'+_cdStr+'</div>' +
    '</div>';

  if(top100.length === 0) {
    cont.innerHTML = html + '<div style="text-align:center;color:#555;padding:30px;">🏆</div>';
    return;
  }

  // Full list from #1 — highlight current user naturally
  var rankColors = { 1:'#FFD700', 2:'#C0C0C0', 3:'#CD7F32' };
  var avatarBgs  = { 1:'linear-gradient(135deg,#CC8800,#FFD700)', 2:'linear-gradient(135deg,#777,#C0C0C0)', 3:'linear-gradient(135deg,#7a4f2a,#CD7F32)' };

  top100.forEach(function(p) {
    var isMe   = tgUser && p.telegramId == tgUser.id;
    var speed  = isMe ? recPerSec : (p.miningSpeed || 0);
    var speedStr = speed > 0 ? speed.toFixed(6) : '—';
    var rCol   = rankColors[p.rank] || (isMe ? '#FF6644' : 'rgba(255,255,255,0.4)');
    var bg     = isMe ? 'rgba(255,100,50,0.12)' : 'rgba(255,255,255,0.03)';
    var border = isMe ? 'rgba(255,100,50,0.5)' : (rankColors[p.rank] ? rCol+'40' : 'rgba(255,255,255,0.07)');
    var avBg   = avatarBgs[p.rank] || (isMe ? 'linear-gradient(135deg,#FF4444,#CC0000)' : 'linear-gradient(135deg,#2a2a3a,#3a3a4a)');

    var dotColor = p.online ? '#00FF88' : '#FF4444';
    var dotGlow = p.online ? '0 0 6px rgba(0,255,136,0.8)' : '0 0 4px rgba(255,68,68,0.5)';
    var onlineDot = '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + dotColor + ';box-shadow:' + dotGlow + ';flex-shrink:0;border:1.5px solid rgba(0,0,0,0.5);"></span>';
    html += '<div style="display:flex;align-items:center;gap:12px;background:' + bg + ';border:1px solid ' + border + ';border-radius:14px;padding:12px 14px;margin-bottom:8px;">' +
      '<div style="font-family:Orbitron,sans-serif;font-size:15px;font-weight:900;color:' + rCol + ';min-width:36px;text-align:center;">#' + p.rank + '</div>' +
      '<div data-uid="' + p.telegramId + '" style="width:42px;height:42px;border-radius:50%;background:' + avBg + ';display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:bold;color:white;flex-shrink:0;">' + (p.name||'?')[0].toUpperCase() + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:14px;font-weight:700;color:' + (isMe?'#FF6644':'white') + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (p.vip ? '<span style="color:#FFD700;font-size:11px;">👑</span> ' : '') + (p.name||'User') + (isMe?' 👈':'') + '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:2px;">⚡ ' + speedStr + (speed > 0 ? ' REC/s' : '') + '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">' +
        onlineDot +
        '<div style="text-align:right;">' +
          '<div style="font-size:14px;color:#00FF88;font-weight:700;">' + (p.rec||0).toFixed(3) + '</div>' +
          '<div style="font-size:9px;color:rgba(255,255,255,0.3);">REC</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  });

  // If user is outside top 100
  if(myRankData && myRankData.myRank > 100) {
    html += '<div style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;padding:6px 0;">• • •</div>';
    (myRankData.neighbors||[]).forEach(function(p) {
      var isMe = p.isMe;
      html += '<div style="display:flex;align-items:center;gap:12px;background:' + (isMe?'rgba(255,100,50,0.12)':'rgba(255,255,255,0.03)') + ';border:1px solid ' + (isMe?'rgba(255,100,50,0.5)':'rgba(255,255,255,0.07)') + ';border-radius:14px;padding:12px 14px;margin-bottom:8px;">' +
        '<div style="font-family:Orbitron,sans-serif;font-size:15px;font-weight:900;color:rgba(255,255,255,0.35);min-width:36px;text-align:center;">#' + p.rank + '</div>' +
        '<div style="width:42px;height:42px;border-radius:50%;background:' + (isMe?'linear-gradient(135deg,#FF4444,#CC0000)':'linear-gradient(135deg,#2a2a3a,#3a3a4a)') + ';display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:bold;color:white;flex-shrink:0;">' + (p.name||'?')[0].toUpperCase() + '</div>' +
        '<div style="flex:1;min-width:0;"><div style="font-size:14px;font-weight:700;color:' + (isMe?'#FF6644':'white') + ';">' + (p.vip ? '<span style="color:#FFD700;font-size:11px;">👑</span> ' : '') + (p.name||'User') + (isMe?' 👈':'') + '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.3);">⚡ ' + (p.miningSpeed||0).toFixed(6) + ' REC/s</div></div>' +
        '<div style="text-align:right;"><div style="font-size:14px;color:#00FF88;font-weight:700;">' + (p.rec||0).toFixed(3) + '</div><div style="font-size:9px;color:rgba(255,255,255,0.3);">REC</div></div>' +
      '</div>';
    });
  }

  cont.innerHTML = html;

  // Load avatars async - safe replacement
  top100.slice(0,15).forEach(function(p) {
    getAvatar(p.telegramId, p.name, 42, function(avatarHtml) {
      if(!avatarHtml) return;
      document.querySelectorAll('[data-uid="' + p.telegramId + '"]').forEach(function(el) {
        if(el && el.parentNode) {
          var tmp = document.createElement('div');
          tmp.innerHTML = avatarHtml;
          if(tmp.firstChild) el.parentNode.replaceChild(tmp.firstChild, el);
        }
      });
    });
  });
}


function renderFriends(friends) {
  var cont = document.getElementById('lbContent'); if(!cont) return;
  if(friends.length === 0) {
    cont.innerHTML = '<div style="text-align:center;padding:40px;color:#555;">' +
      '<div style="font-size:40px;margin-bottom:10px;">👥</div>' +
      '<div>' + t('noFriends') + '</div></div>';
    return;
  }
  var html = '';
  friends.forEach(function(p) {
    html += '<div style="display:flex;align-items:center;gap:8px;background:#161616;border:1px solid #222;border-radius:10px;padding:8px 10px;margin-bottom:6px;">' +
      '<div style="font-size:12px;color:#555;min-width:26px;text-align:center;">#' + p.rank + '</div>' +
      '<div style="width:32px;height:32px;border-radius:50%;background:#222;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:bold;color:#aaa;flex-shrink:0;">' + (p.name||'?')[0].toUpperCase() + '</div>' +
      '<div style="flex:1;"><div style="font-size:12px;color:#ddd;">' + (p.name||'User') + '</div>' +
      '<div style="font-size:10px;color:#FF0000;">' + Math.floor(p.record).toLocaleString() + ' RECORD</div></div>' +
      '<div style="font-size:10px;color:#00FF88;">' + (p.rec||0).toFixed(3) + ' REC</div></div>';
  });
  cont.innerHTML = html;
}

function renderMyLevel() {
  var cont = document.getElementById('lbContent'); if(!cont) return;
  var m = getMyMedal();
  var name = tgUser ? (tgUser.first_name + (tgUser.last_name?' '+tgUser.last_name:'')) : 'You';
  cont.innerHTML =
    '<div style="background:#1a1a1a;border:1px solid #333;border-radius:14px;padding:20px;text-align:center;margin-bottom:12px;">' +
      '<div style="width:80px;height:80px;border-radius:50%;background:#1a0000;border:3px solid #FF0000;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:#FF0000;margin:0 auto 10px;">' + (tgUser&&tgUser.first_name?tgUser.first_name[0].toUpperCase():'?') + '</div>' +
      '<div style="font-size:18px;font-weight:bold;">' + name + '</div>' +
      '<div style="font-size:12px;color:#aaa;margin-top:4px;">ID: ' + (tgUser?tgUser.id:'-') + '</div>' +
    '</div>' +
    '<div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:14px;margin-bottom:10px;">' +
      '<div style="color:#aaa;font-size:11px;margin-bottom:8px;">' + t('totalMined') + '</div>' +
      '<div style="font-size:28px;font-family:Orbitron,sans-serif;color:#00FF88;">' + rec.toFixed(6) + '</div>' +
      '<div style="color:#aaa;font-size:10px;margin-top:3px;">REC • ' + t('sinceJoined') + '</div>' +
    '</div>' +
    '<div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:14px;margin-bottom:10px;">' +
      '<div style="color:#aaa;font-size:11px;margin-bottom:8px;">RECORD</div>' +
      '<div style="font-size:24px;font-family:Orbitron,sans-serif;color:#FF0000;">' + Math.floor(record).toLocaleString() + '</div>' +
    '</div>' +
    '<div style="background:#1a1a1a;border:1px solid ' + m.color + ';border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;">' +
      '<div style="font-size:40px;">' + m.emoji + '</div>' +
      '<div><div style="font-size:16px;color:' + m.color + ';font-weight:bold;">' + m.name + '</div>' +
      '<div style="color:#aaa;font-size:11px;margin-top:3px;">🔴 ' + Math.floor(record).toLocaleString() + ' RECORD</div></div>' +
    '</div>';
}

// ====== PROFILE ======
function openSupport(){window.Telegram.WebApp.openTelegramLink('https://t.me/Momokhli');}

// ====== TON ADDRESS CONVERTER ======
// Converts raw "0:hexhash" to friendly "UQDu...6PP2" format
function crc16ton(data) {
  var crc = 0;
  for (var i = 0; i < data.length; i++) {
    crc ^= (data[i] << 8);
    for (var j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (((crc << 1) ^ 0x1021) & 0xFFFF) : ((crc << 1) & 0xFFFF);
    }
  }
  return crc;
}

function rawToFriendly(rawAddr) {
  try {
    // If already friendly (starts with UQ, EQ, etc.), return as-is
    if (!rawAddr.includes(':')) return rawAddr;
    var parts = rawAddr.split(':');
    if (parts.length !== 2) return rawAddr;
    var wc = parseInt(parts[0]);
    var hex = parts[1];
    if (hex.length !== 64) return rawAddr;

    // Build 36-byte buffer
    var buf = new Uint8Array(36);
    buf[0] = 0x51;  // non-bounceable (UQ...)
    buf[1] = wc < 0 ? 0xFF : (wc & 0xFF);
    for (var i = 0; i < 32; i++) {
      buf[2 + i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    // CRC16
    var crc = crc16ton(buf.slice(0, 34));
    buf[34] = (crc >> 8) & 0xFF;
    buf[35] = crc & 0xFF;

    // Base64url
    var bin = '';
    for (var i = 0; i < 36; i++) bin += String.fromCharCode(buf[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch(e) { return rawAddr; }
}

function shortTonAddr(addr) {
  if (!addr) return '';
  var friendly = rawToFriendly(addr);
  // UQDu...6PP2 format (first 4 + ... + last 4)
  return friendly.length > 10 ? friendly.slice(0, 4) + '...' + friendly.slice(-4) : friendly;
}

// ====== TON CONNECT ======
var tonConnect = null;

function initTonConnect() {
  try {
    if (typeof TON_CONNECT_UI === 'undefined') return;
    tonConnect = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://rec-coin.onrender.com/tonconnect-manifest.json'
    });
    // Subscribe to wallet status changes
    tonConnect.onStatusChange(function(wallet) {
      updateWalletBtn(wallet);
    });
    // Apply current status on load
    updateWalletBtn(tonConnect.wallet);
  } catch(e) { console.log('TonConnect error:', e); }
}

function updateWalletBtn(wallet) {
  var btn = document.getElementById('walletBtn');
  if (!btn) return;
  if (wallet && wallet.account && wallet.account.address) {
    var addr = wallet.account.address;
    // Convert raw hex address to friendly TON format (UQDu...6PP2)
    var short = shortTonAddr(addr);
    btn.textContent = '💎 ' + short;
    btn.style.background = '#1a6b1a';
    btn.style.border = '1px solid #4eff4e';
    btn.style.color = '#4eff4e';
    btn.removeAttribute('data-i18n');
    btn.setAttribute('data-raw', rawToFriendly(addr)); // save for withdrawal
    // Save to storage
    try { localStorage.setItem('ton_wallet_' + saveKey, addr); } catch(e) {}
    if (CS) { try { CS.setItem('tonWallet', addr); } catch(e) {} }
    // Save wallet to server
    if(tgUser) {
      fetch('/api/user/save', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ telegramId: tgUser.id, walletAddress: rawToFriendly(addr) })
      }).catch(function(){});
    }
  } else {
    btn.textContent = t('connectWallet');
    btn.style.background = '#4B9EFF';
    btn.style.border = 'none';
    btn.style.color = 'white';
    btn.setAttribute('data-i18n', 'connectWallet');
  }
}

function connectWallet() {
  if (!tonConnect) {
    // TonConnect not loaded yet, try init
    initTonConnect();
    setTimeout(function() {
      if (tonConnect) {
        if (tonConnect.connected) tonConnect.disconnect();
        else tonConnect.openModal();
      } else {
        // Fallback: open Telegram wallet directly
        window.Telegram.WebApp.openTelegramLink('https://t.me/wallet');
      }
    }, 500);
    return;
  }
  if (tonConnect.connected) {
    // Show disconnect confirmation
    window.Telegram.WebApp.showConfirm(
      currentLang === 'ar' ? 'هل تريد فصل المحفظة؟' :
      currentLang === 'uk' ? 'Відключити гаманець?' :
      currentLang === 'zh' ? '断开钱包连接？' : 'Disconnect wallet?',
      function(confirmed) {
        if (confirmed) { tonConnect.disconnect(); showToast('🔴 Wallet disconnected'); }
      }
    );
  } else {
    tonConnect.openModal();
  }
}

// ====== INIT ======


// ====== AUTO REFRESH EVERY 5 MINUTES ======
var _lbRefreshTimer = null;
var _lbLastUpdate = 0;

function startLeaderboardAutoRefresh() {
  if(_lbRefreshTimer) clearInterval(_lbRefreshTimer);
  _lbRefreshTimer = setInterval(function() {
    // Only refresh if leaderboard is visible
    var lbSection = document.getElementById('leaderboardSection') || 
                    document.getElementById('lbContent');
    if(lbSection && lbSection.offsetParent !== null) {
      loadLeaderboard(currentTab || 'global');
      _lbLastUpdate = Date.now();
      updateLastUpdatedLabel();
    }
  }, 5 * 60 * 1000); // 5 minutes
}

function updateLastUpdatedLabel() {
  var el = document.getElementById('lbLastUpdated');
  if(!el) return;
  var seconds = Math.floor((Date.now() - _lbLastUpdate) / 1000);
  if(seconds < 60) {
    el.textContent = '🔄 Updated just now';
  } else {
    var mins = Math.floor(seconds / 60);
    el.textContent = '🔄 Updated ' + mins + 'm ago';
  }
}

// Update "last updated" label every 30 seconds
setInterval(updateLastUpdatedLabel, 30000);

// Start auto-refresh when page loads
setTimeout(function() {
  startLeaderboardAutoRefresh();
  _lbLastUpdate = Date.now();
}, 1000);
