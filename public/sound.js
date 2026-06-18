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
  'rank':        '/Sounds/leaderboard.mp3',
  'games':       '/Sounds/game1.mp3',
  'game2':       '/Sounds/game2.mp3'
};

function playPageSound(pageId) {
  if (!soundEnabled) return;
  var src = SOUNDS[pageId];
  if (!src) return;
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

// Wrap all navigation functions after page loads
window.addEventListener('load', function() {
  // Sound button
  var btn = document.getElementById('soundToggleBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';

  // Wrap showPage
  if (typeof showPage === 'function') {
    var _orig = showPage;
    window.showPage = function(id, el) {
      _orig(id, el);
      playPageSound(id);
    };
  }

  // Wrap each navigation function
  var fnMap = {
    'openVIP':        'vip',
    'openNFTPage':    'nft',
    'openDailyLogin': 'daily',
    'openUpgrade':    'upgradePage',
    'openExchange':   'exchange',
    'openStarsShop':  'shop',
    'openAirdrop':    'airdrop',
    'openGames':      'games',
    'openNFTPage':    'nft'
  };

  Object.keys(fnMap).forEach(function(fnName) {
    if (typeof window[fnName] === 'function') {
      var _orig = window[fnName];
      var soundId = fnMap[fnName];
      window[fnName] = function() {
        _orig.apply(this, arguments);
        playPageSound(soundId);
      };
    }
  });

  // Start home sound
  setTimeout(function() { playPageSound('home'); }, 800);
});
