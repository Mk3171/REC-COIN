// ====== REC MINING - SOUND SYSTEM ======

var soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
var currentAudio = null;
var currentSoundPage = '';
var soundToken = 0; // increments every time we request a new track

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

var GAME_SOUNDS = {
  1: '/Sounds/game1.mp3',
  2: '/Sounds/game2.mp3'
};

function stopSound() {
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch(e) {}
  }
  currentAudio = null;
  currentSoundPage = '';
}

function _startTrack(src, pageId) {
  if (!soundEnabled) return;
  if (currentSoundPage === pageId && currentAudio && !currentAudio.paused) return;

  stopSound();
  soundToken++;
  var myToken = soundToken;

  var audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0.35;

  var playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(function() {
      // Only adopt as "current" if nothing newer has been requested
      if (myToken === soundToken) {
        currentAudio = audio;
        currentSoundPage = pageId;
      } else {
        try { audio.pause(); } catch(e) {}
      }
    }).catch(function() {
      // Autoplay blocked - wait for ONE real user gesture, but verify
      // this request is still the latest before playing.
      var resume = function() {
        document.removeEventListener('touchstart', resume);
        document.removeEventListener('click', resume);
        if (myToken !== soundToken) return; // superseded by a newer page - ignore
        audio.play().then(function() {
          if (myToken === soundToken) {
            currentAudio = audio;
            currentSoundPage = pageId;
          } else {
            try { audio.pause(); } catch(e) {}
          }
        }).catch(function(){});
      };
      document.addEventListener('touchstart', resume, { once: true });
      document.addEventListener('click', resume, { once: true });
    });
  }
}

function playPageSound(pageId) {
  var src = SOUNDS[pageId];
  if (!src) return;
  _startTrack(src, pageId);
}

function playGameSound(gameNum) {
  var src = GAME_SOUNDS[gameNum];
  if (!src) return;
  _startTrack(src, 'game' + gameNum);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled ? 'true' : 'false');
  var btn = document.getElementById('soundToggleBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
  if (!soundEnabled) {
    soundToken++; // invalidate any pending track
    stopSound();
  } else {
    playPageSound(currentSoundPage || 'home');
  }
}

// Wrap navigation functions once page is ready
window.addEventListener('load', function() {
  var btn = document.getElementById('soundToggleBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';

  if (typeof showPage === 'function') {
    var _origShowPage = showPage;
    window.showPage = function(id, el) {
      _origShowPage(id, el);
      playPageSound(id);
    };
  }

  var fnMap = {
    'openVIP':        'vip',
    'openNFTPage':    'nft',
    'openDailyLogin': 'daily',
    'openUpgrade':    'upgradePage',
    'openExchange':   'exchange',
    'openStarsShop':  'shop',
    'openAirdrop':    'airdrop'
    // NOTE: openGames intentionally NOT mapped — sound should only
    // start once a specific game is picked (handled by the game
    // iframe itself calling parent.playGameSound()).
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

  setTimeout(function() { playPageSound('home'); }, 800);
});
