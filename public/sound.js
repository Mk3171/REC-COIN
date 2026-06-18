// ====== REC MINING - SOUND SYSTEM ======

var soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
var currentAudio = null;
var currentPage = '';

var SOUNDS = {
  'home':         '/Sounds/home.mp3',
  'exchange':     '/Sounds/home.mp3',
  'daily':        '/Sounds/home.mp3',
  'upgrade':      '/Sounds/home.mp3',
  'upgradePage':  '/Sounds/home.mp3',
  'cards':        '/Sounds/cards.mp3',
  'tasks':        '/Sounds/tasks.mp3',
  'invite':       '/Sounds/invite.mp3',
  'wallet':       '/Sounds/wallet.mp3',
  'vip':          '/Sounds/vip.mp3',
  'nft':          '/Sounds/nft.mp3',
  'shop':         '/Sounds/shop.mp3',
  'airdrop':      '/Sounds/airdrop.mp3',
  'rank':         '/Sounds/leaderboard.mp3',
  'game1':        '/Sounds/game1.mp3',
  'game2':        '/Sounds/game2.mp3'
};

function playPageSound(pageId) {
  if (!soundEnabled) return;
  var src = SOUNDS[pageId];
  if (!src) return;
  if (currentAudio && currentPage === pageId) return; // نفس الصفحة ما نعيد التشغيل

  // أوقف الصوت الحالي
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  try {
    var audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(function() {
        currentAudio = audio;
        currentPage = pageId;
      }).catch(function(e) {
        // Autoplay blocked - will play on next user interaction
        document.addEventListener('touchstart', function resumeAudio() {
          audio.play().then(function() {
            currentAudio = audio;
            currentPage = pageId;
          }).catch(function(){});
          document.removeEventListener('touchstart', resumeAudio);
        }, { once: true });
      });
    }
  } catch(e) {}
}

function stopSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentPage = '';
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  updateSoundBtn();
  if (!soundEnabled) {
    stopSound();
  } else {
    playPageSound(currentPage || 'home');
  }
}

function updateSoundBtn() {
  var btn = document.getElementById('soundToggleBtn');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
}

// Override showPage to add sound
var _origShowPage = showPage;
function showPage(id, btn) {
  _origShowPage(id, btn);
  playPageSound(id);
}

// Play sound for game pages
function playGameSound(gameNum) {
  playPageSound('game' + gameNum);
}

// Init sound on first page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    playPageSound('home');
    updateSoundBtn();
  }, 500);
});
