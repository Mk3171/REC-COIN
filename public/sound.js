// ====== REC MINING - SOUND SYSTEM ======

var soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
var currentAudio = null;
var currentSoundPage = '';

var SOUNDS = {
  'home':        '/Sounds/home.mp3',
  'exchange':    '/Sounds/home.mp3',
  'daily':       '/Sounds/home.mp3',
  'upgradePage': '/Sounds/home.mp3',
  'cards':       '/Sounds/cards.mp3',
  'tasks':       '/Sounds/tasks.mp3',
  'invite':      '/Sounds/invite.mp3',
  'wallet':      '/Sounds/wallet.mp3',
  'vip':         '/Sounds/vip.mp3',
  'nft':         '/Sounds/nft.mp3',
  'shop':        '/Sounds/shop.mp3',
  'airdrop':     '/Sounds/airdrop.mp3',
  'rank':        '/Sounds/leaderboard.mp3'
};

function playPageSound(pageId) {
  if (!soundEnabled) return;
  var src = SOUNDS[pageId];
  if (!src) { stopSound(); return; }
  if (currentSoundPage === pageId && currentAudio && !currentAudio.paused) return;

  stopSound();

  try {
    var audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.35;
    audio.play().then(function() {
      currentAudio = audio;
      currentSoundPage = pageId;
    }).catch(function() {
      currentAudio = audio;
      currentSoundPage = pageId;
      document.addEventListener('touchstart', function once() {
        if (currentAudio) currentAudio.play().catch(function(){});
        document.removeEventListener('touchstart', once);
      }, { once: true });
    });
  } catch(e) {}
}

function stopSound() {
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch(e) {}
    currentAudio = null;
    currentSoundPage = '';
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled ? 'true' : 'false');
  var btn = document.getElementById('soundToggleBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
  if (!soundEnabled) { stopSound(); }
  else { playPageSound(currentSoundPage || 'home'); }
}

// Hook into navigation WITHOUT overriding showPage
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[onclick]');
  if (!btn) return;
  var fn = btn.getAttribute('onclick') || '';
  var match = fn.match(/showPage\(['"](\w+)['"]/);
  if (match) {
    setTimeout(function() { playPageSound(match[1]); }, 50);
  }
}, true);

// Init
window.addEventListener('load', function() {
  var btn = document.getElementById('soundToggleBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
  setTimeout(function() { playPageSound('home'); }, 800);
});
