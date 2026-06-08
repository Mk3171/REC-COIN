// ============================================================
// REFERRAL SYSTEM — referral.js (standalone)
// ============================================================

var refData = { l1: [], l2: [], l3: [] };
var currentRefLevel = 1;

// ====== Switch Invite Tab ======
function switchInviteTab(tab, btn) {
  var inv = document.getElementById('inviteTabContent_invite');
  var refs = document.getElementById('inviteTabContent_referrals');
  if(inv) inv.style.display = tab === 'invite' ? 'block' : 'none';
  if(refs) refs.style.display = tab === 'referrals' ? 'block' : 'none';

  ['invite','referrals'].forEach(function(t) {
    var b = document.getElementById('inviteTab_' + t);
    if(!b) return;
    if(t === tab) {
      b.style.background = 'rgba(255,100,50,0.15)';
      b.style.borderColor = 'rgba(255,100,50,0.5)';
      b.style.color = '#FF6644';
    } else {
      b.style.background = 'rgba(255,255,255,0.04)';
      b.style.borderColor = 'rgba(255,255,255,0.08)';
      b.style.color = 'rgba(255,255,255,0.4)';
    }
  });

  if(tab === 'referrals') loadRefList();
}

// ====== Switch Level Tabs ======
function switchRefLevel(lvl) {
  currentRefLevel = lvl;
  [1,2,3].forEach(function(l) {
    var b = document.getElementById('refLvlBtn_' + l);
    if(!b) return;
    if(l === lvl) {
      b.style.background = 'rgba(255,100,50,0.15)';
      b.style.borderColor = 'rgba(255,100,50,0.5)';
      b.style.color = '#FF6644';
    } else {
      b.style.background = 'rgba(255,255,255,0.04)';
      b.style.borderColor = 'rgba(255,255,255,0.08)';
      b.style.color = 'rgba(255,255,255,0.3)';
    }
  });
  renderRefList();
}

// ====== Load Referrals from Server ======
function loadRefList() {
  if(!window.tgUser) return;

  var el = document.getElementById('refListContent');
  if(el) el.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.2);font-size:13px;">⏳ Loading...</div>';

  fetch('/api/referrals/' + tgUser.id)
    .then(function(r) { return r.json(); })
    .then(function(d) {
      refData = d || { l1: [], l2: [], l3: [] };

      // ✅ Update real referral count from server
      if(d && d.l1) {
        if(typeof refCount !== 'undefined') refCount = d.l1.length;
        var el1 = document.getElementById('refCountDisplay');
        if(el1) el1.textContent = d.l1.length;
        var el2 = document.getElementById('friendsCountDisplay');
        if(el2) el2.textContent = d.l1.length;
      }

      renderRefList();
    })
    .catch(function() {
      var el = document.getElementById('refListContent');
      if(el) el.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.2);">Could not load</div>';
    });
}

// ====== Render Referral List ======
function renderRefList() {
  var el = document.getElementById('refListContent');
  if(!el) return;

  var list = currentRefLevel === 1 ? refData.l1 :
             currentRefLevel === 2 ? refData.l2 : refData.l3;

  if(!list || list.length === 0) {
    el.innerHTML =
      '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;text-align:center;">' +
        '<div style="font-size:32px;margin-bottom:8px;">👥</div>' +
        '<div style="font-size:13px;color:rgba(255,255,255,0.25);">No referrals yet</div>' +
      '</div>';
    return;
  }

  el.innerHTML = list.map(function(u) {
    var name = u.username ? '@' + u.username : (u.firstName || 'User');
    var speed = (u.miningSpeed || 0).toFixed(6);
    var earned = (u.rec || 0).toFixed(3);
    return '<div style="display:grid;grid-template-columns:1fr 80px 80px;gap:4px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 12px;margin-bottom:6px;align-items:center;">' +
      '<div style="font-size:13px;color:white;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + name + '</div>' +
      '<div style="font-size:10px;color:rgba(0,255,136,0.7);text-align:center;">' + speed + '</div>' +
      '<div style="font-size:11px;color:#00FF88;text-align:right;font-weight:700;">' + earned + '</div>' +
    '</div>';
  }).join('');
}

// ====== Update Invite Link Display ======
function updateInviteLinkDisplay() {
  var el = document.getElementById('inviteLinkDisplay');
  if(!el || !window.tgUser) return;
  el.textContent = 'https://t.me/RecMiningGame_bot?start=ref' + tgUser.id;
}

// ====== Auto-init when page loads ======
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if(window.tgUser) updateInviteLinkDisplay();
  }, 2000);
});
