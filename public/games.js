// ====== REC CATCH GAME ======
const DAILY_MAX = 10;
const COIN_VALUE = 0.0002;
const COIN_INTERVAL = 1200;
const SAVE_KEY = 'recCatchData';

var canvas, ctx, W, H;
var basket = { x: 0, y: 0, w: 80, h: 18, color: '#FF0000' };
var coins = [];
var particles = [];
var powerupItems = [];
var activePowerups = { x2: 0, magnet: 0, shield: 0 };
var score = 0;
var sessionRec = 0;
var todayRec = 0;
var combo = 0;
var bestCombo = 0;
var coinsCaught = 0;
var gameRunning = false;
var gameOver = false;
var lastCoinTime = 0;
var coinSpeed = 2.5;
var tgUser = null;
var animFrame = null;
var lastSaveTime = 0;

var touchX = null;
var isDragging = false;

var dailyData = { date: '', rec: 0 };

// ====== BACKGROUND IMAGE ======
var bgImage = new Image();
bgImage.src = 'catch-bg.jpg';
var bgLoaded = false;
bgImage.onload = function(){ bgLoaded = true; };

// ====== INIT ======
window.onload = function(){
  try{
    if(window.Telegram && window.Telegram.WebApp){
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    }
  }catch(e){}

  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  loadDailyData();
  updateStartScreen();

  canvas.addEventListener('touchstart', onTouchStart, {passive:false});
  canvas.addEventListener('touchmove', onTouchMove, {passive:false});
  canvas.addEventListener('touchend', onTouchEnd, {passive:false});
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', function(){ isDragging=true; });
  canvas.addEventListener('mouseup', function(){ isDragging=false; });
};

function resizeCanvas(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  basket.x = W/2 - basket.w/2;
  basket.y = H - 80;
}

// ====== DAILY DATA ======
function getTodayStr(){
  var d = new Date();
  return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
}

function loadDailyData(){
  try{
    var d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if(d && d.date === getTodayStr()){
      dailyData = d;
    } else {
      dailyData = { date: getTodayStr(), rec: 0 };
    }
  }catch(e){
    dailyData = { date: getTodayStr(), rec: 0 };
  }
  todayRec = dailyData.rec;
}

function saveDailyData(){
  dailyData.date = getTodayStr();
  dailyData.rec = todayRec;
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(dailyData)); }catch(e){}

  var now = Date.now();
  if(tgUser && now - lastSaveTime > 10000){
    lastSaveTime = now;
    fetch('/api/game-earn', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        telegramId: tgUser.id,
        rec: sessionRec,
        gameType: 'catch'
      })
    }).catch(function(){});
  }
}

// ====== SCREENS ======
function updateStartScreen(){
  var pct = Math.min(100, (todayRec / DAILY_MAX) * 100);
  document.getElementById('startTodayLabel').textContent =
    todayRec.toFixed(4) + ' / ' + DAILY_MAX + ' REC';
  document.getElementById('startDailyBar').style.width = pct + '%';

  if(todayRec >= DAILY_MAX){
    document.getElementById('startBtn').disabled = true;
    document.getElementById('limitMsg').style.display = 'block';
  }
}

function showStart(){
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
  loadDailyData();
  updateStartScreen();
}

function showEndScreen(){
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('hidden');

  document.getElementById('endSession').textContent = sessionRec.toFixed(4) + ' REC';
  document.getElementById('endToday').textContent = todayRec.toFixed(4) + ' REC';
  document.getElementById('endCoins').textContent = coinsCaught;
  document.getElementById('endCombo').textContent = 'x' + bestCombo;

  var pct = Math.min(100, (todayRec / DAILY_MAX) * 100);
  document.getElementById('endTodayLabel').textContent =
    todayRec.toFixed(4) + ' / ' + DAILY_MAX + ' REC';
  document.getElementById('endDailyBar').style.width = pct + '%';

  if(todayRec >= DAILY_MAX){
    document.getElementById('playAgainBtn').disabled = true;
    document.getElementById('playAgainBtn').textContent = '🌙 Come back tomorrow!';
  }
}

// ====== GAME LOOP ======
function startGame(){
  document.getElementById('startScreen').classList.add('hidden');

  coins = [];
  particles = [];
  powerupItems = [];
  activePowerups = { x2: 0, magnet: 0, shield: 0 };
  score = 0;
  sessionRec = 0;
  combo = 0;
  bestCombo = 1;
  coinsCaught = 0;
  gameRunning = true;
  gameOver = false;
  lastCoinTime = 0;
  coinSpeed = 2.5;
  basket.x = W/2 - basket.w/2;

  updateHUD();
  if(animFrame) cancelAnimationFrame(animFrame);
  gameLoop();
}

function gameLoop(){
  if(!gameRunning) return;
  var now = Date.now();
  update(now);
  draw();
  animFrame = requestAnimationFrame(gameLoop);
}

// ====== UPDATE ======
function update(now){
  var interval = COIN_INTERVAL;
  if(activePowerups.x2 > now) interval *= 0.7;

  if(now - lastCoinTime > interval){
    spawnCoin();
    lastCoinTime = now;
    if(Math.random() < 0.033) spawnPowerupItem();
    if(coinSpeed < 6) coinSpeed += 0.002;
  }

  if(touchX !== null){
    var target = touchX - basket.w/2;
    basket.x += (target - basket.x) * 0.2;
    basket.x = Math.max(0, Math.min(W - basket.w, basket.x));
  }

  var magnetActive = activePowerups.magnet > now;
  var x2Active = activePowerups.x2 > now;

  for(var i = coins.length-1; i >= 0; i--){
    var c = coins[i];
    if(magnetActive){
      var bCenter = basket.x + basket.w/2;
      c.x += (bCenter - c.x) * 0.05;
    }
    c.y += c.speed;
    c.rot += 0.05;

    if(c.y + c.r >= basket.y && c.y - c.r <= basket.y + basket.h &&
       c.x >= basket.x - c.r && c.x <= basket.x + basket.w + c.r){
      var remaining = DAILY_MAX - todayRec;
      if(remaining <= 0){ showLimitFlash(); endGame(); return; }
      var earned = Math.min(c.value * (x2Active ? 2 : 1), remaining);
      sessionRec += earned;
      todayRec += earned;
      score += 10 * (x2Active ? 2 : 1);
      coinsCaught++;
      combo++;
      if(combo > bestCombo) bestCombo = combo;
      if(combo >= 5) showComboFlash('x'+combo+' COMBO! 🔥');
      else if(combo >= 3) showComboFlash('x'+combo);
      spawnParticles(c.x, c.y, x2Active ? '#FFD700' : '#00FF88');
      coins.splice(i, 1);
      updateHUD();
      saveDailyData();
      continue;
    }
    if(c.y > H + 20){
      combo = 0;
      coins.splice(i, 1);
      if(activePowerups.shield > now) activePowerups.shield = 0;
    }
  }

  for(var j = powerupItems.length-1; j >= 0; j--){
    var p = powerupItems[j];
    p.y += p.speed;
    p.rot += 0.03;
    if(p.y + 20 >= basket.y && p.y - 20 <= basket.y + basket.h &&
       p.x >= basket.x - 20 && p.x <= basket.x + basket.w + 20){
      activatePowerup(p.type);
      spawnParticles(p.x, p.y, p.color);
      powerupItems.splice(j, 1);
      continue;
    }
    if(p.y > H + 20) powerupItems.splice(j, 1);
  }

  for(var k = particles.length-1; k >= 0; k--){
    var pt = particles[k];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.vy += 0.15;
    pt.life -= 0.03;
    if(pt.life <= 0) particles.splice(k, 1);
  }

  updatePowerupBadges(now);
}

// ====== DRAW ======
function draw(){
  // Background image or fallback color
  if(bgLoaded){
    ctx.drawImage(bgImage, 0, 0, W, H);
    // Dark overlay for readability
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = '#000510';
    ctx.fillRect(0, 0, W, H);
  }

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for(var gx = 0; gx < W; gx += 40){
    ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke();
  }
  for(var gy = 0; gy < H; gy += 40){
    ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(W,gy); ctx.stroke();
  }

  // Particles
  particles.forEach(function(p){
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Coins
  coins.forEach(function(c){
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    var grad = ctx.createRadialGradient(0,0,0,0,0,c.r*2);
    grad.addColorStop(0, 'rgba(0,255,136,0.15)');
    grad.addColorStop(1, 'rgba(0,255,136,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, c.r*2, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = c.color;
    ctx.shadowColor = c.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, c.r, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000';
    ctx.font = 'bold '+(c.r*0.7)+'px Orbitron,monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('R', 0, 0);
    ctx.restore();
  });

  // Powerup items
  powerupItems.forEach(function(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 15;
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.emoji, 0, 0);
    ctx.restore();
  });

  // Basket
  var bx = basket.x, by = basket.y, bw = basket.w, bh = basket.h;
  var magnetActive = activePowerups.magnet > Date.now();
  var x2Active = activePowerups.x2 > Date.now();
  ctx.shadowColor = x2Active ? '#FFD700' : (magnetActive ? '#00AAFF' : '#FF0000');
  ctx.shadowBlur = 20;
  ctx.strokeStyle = x2Active ? '#FFD700' : (magnetActive ? '#00AAFF' : '#FF4444');
  ctx.lineWidth = 3;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = x2Active ? 'rgba(255,215,0,0.15)' : 'rgba(255,0,0,0.1)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = x2Active ? '#FFD700' : '#FF0000';
  ctx.fillRect(bx, by+bh-3, bw, 3);
  ctx.shadowBlur = 0;

  // Progress bar
  var pct = Math.min(1, todayRec / DAILY_MAX);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fillRect(0, H-4, W, 4);
  ctx.fillStyle = 'rgba(0,255,136,0.6)';
  ctx.fillRect(0, H-4, W*pct, 4);
}

// ====== SPAWN ======
function spawnCoin(){
  var r = 14 + Math.random()*6;
  coins.push({
    x: r + Math.random()*(W - r*2),
    y: -r,
    r: r,
    speed: coinSpeed + Math.random()*1.5,
    rot: 0,
    color: '#00FF88',
    value: COIN_VALUE
  });
}

function spawnPowerupItem(){
  var types = [
    { type:'x2', emoji:'⚡', color:'#FFD700', duration:8000 },
    { type:'magnet', emoji:'🧲', color:'#00AAFF', duration:6000 },
    { type:'shield', emoji:'🛡️', color:'#AA00FF', duration:0 }
  ];
  var t = types[Math.floor(Math.random()*types.length)];
  powerupItems.push({
    x: 30 + Math.random()*(W-60),
    y: -20,
    speed: 1.5 + Math.random(),
    rot: 0,
    type: t.type,
    emoji: t.emoji,
    color: t.color,
    duration: t.duration
  });
}

function activatePowerup(type){
  var now = Date.now();
  if(type === 'x2') activePowerups.x2 = now + 8000;
  if(type === 'magnet') activePowerups.magnet = now + 6000;
  if(type === 'shield') activePowerups.shield = now + 99999;
  showComboFlash(type==='x2'?'⚡ x2 ACTIVE!':type==='magnet'?'🧲 MAGNET!':'🛡️ SHIELD!');
}

function spawnParticles(x, y, color){
  for(var i=0; i<8; i++){
    var angle = (Math.PI*2/8)*i;
    particles.push({
      x: x, y: y,
      vx: Math.cos(angle)*3,
      vy: Math.sin(angle)*3 - 2,
      color: color,
      size: 3 + Math.random()*3,
      life: 1
    });
  }
}

// ====== POWERUP BADGES ======
function updatePowerupBadges(now){
  var container = document.getElementById('powerups');
  var html = '';
  if(activePowerups.x2 > now){
    var sec = Math.ceil((activePowerups.x2-now)/1000);
    html += '<div class="pu-badge" style="border-color:rgba(255,215,0,0.5);color:#FFD700;">⚡ x2 '+sec+'s</div>';
  }
  if(activePowerups.magnet > now){
    var sec2 = Math.ceil((activePowerups.magnet-now)/1000);
    html += '<div class="pu-badge" style="border-color:rgba(0,170,255,0.5);color:#00AAFF;">🧲 '+sec2+'s</div>';
  }
  if(activePowerups.shield > now){
    html += '<div class="pu-badge" style="border-color:rgba(170,0,255,0.5);color:#AA00FF;">🛡️</div>';
  }
  container.innerHTML = html;
}

// ====== HUD ======
function updateHUD(){
  document.getElementById('hudSession').textContent = sessionRec.toFixed(4);
  document.getElementById('hudToday').textContent = todayRec.toFixed(4);
  document.getElementById('hudScore').textContent = score;
}

// ====== FLASH MESSAGES ======
var comboTimeout = null;
function showComboFlash(text){
  var el = document.getElementById('comboFlash');
  el.textContent = text;
  el.style.opacity = '1';
  if(comboTimeout) clearTimeout(comboTimeout);
  comboTimeout = setTimeout(function(){ el.style.opacity='0'; }, 1200);
}

function showLimitFlash(){
  var el = document.getElementById('limitFlash');
  el.innerHTML = '🎉 DAILY LIMIT REACHED!<br><span style="font-size:13px;color:#aaa">+'+sessionRec.toFixed(4)+' REC earned today</span>';
  el.style.opacity = '1';
  setTimeout(function(){ el.style.opacity='0'; }, 3000);
}

// ====== END GAME ======
function endGame(){
  gameRunning = false;
  cancelAnimationFrame(animFrame);
  saveDailyData();
  setTimeout(function(){ showEndScreen(); }, 1500);
}

// ====== CONTROLS ======
function onTouchStart(e){ e.preventDefault(); touchX = e.touches[0].clientX; }
function onTouchMove(e){ e.preventDefault(); touchX = e.touches[0].clientX; }
function onTouchEnd(e){ e.preventDefault(); }
function onMouseMove(e){ touchX = e.clientX; }
