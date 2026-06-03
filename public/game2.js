// ====== SUPER REC - Mario Style Game ======
'use strict';

// === PHYSICS ===
var GRAVITY = 0.55;
var JUMP_VEL = -13;
var MOVE_SPD = 4.0;
var TS = 48; // tile size

// === REWARDS per coin per level ===
var REWARDS = [0, 0.001, 0.001, 0.005, 0.005, 0.05, 0.1, 0.2, 0.5, 0.5, 0.5];

// === CANVAS ===
var canvas, ctx, W, H, GY; // GY = ground Y

// === STATE ===
var gState = 'idle'; // idle | playing | dead | clear | over
var curLevel = 1;
var lives = 3;
var score = 0;
var sessionRec = 0;
var levelRec = 0;
var levelCoins = 0;
var tgUser = null;
var lastSave = 0;

// === CAMERA ===
var camX = 0;

// === PLAYER ===
var P;
function resetPlayer() {
  P = {
    x: 80, y: 100,
    w: 28, h: 42,
    vx: 0, vy: 0,
    onGround: false,
    dead: false,
    deadTimer: 0,
    facing: 1,
    runFrame: 0,
    runTimer: 0,
    invTimer: 0,
    jumping: false
  };
}

// === WORLD ===
var grounds = [];
var platfs = [];
var qblocks = [];
var enemies = [];
var floatCoins = [];
var goalX = 3000;
var worldW = 3200;

// === CONTROLS ===
var ctrl = { left:false, right:false, jump:false };
var jumpWas = false;

// === PARTICLES ===
var parts = [];

// ==================== INIT ====================
window.onload = function() {
  try {
    if(window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      tgUser = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user;
    }
  } catch(e) {}
  canvas = document.getElementById('gc');
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', function(){ resize(); if(gState==='playing') buildLevel(curLevel); });
  setupControls();
  requestAnimationFrame(loop);
};

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  GY = H - 90;
}

// ==================== CONTROLS ====================
function setupControls() {
  function hold(id, key) {
    var el = document.getElementById(id);
    el.addEventListener('touchstart', function(e){ e.preventDefault(); ctrl[key]=true; el.classList.add('active'); }, {passive:false});
    el.addEventListener('touchend',   function(e){ e.preventDefault(); ctrl[key]=false; el.classList.remove('active'); }, {passive:false});
    el.addEventListener('mousedown',  function(){ ctrl[key]=true; el.classList.add('active'); });
    el.addEventListener('mouseup',    function(){ ctrl[key]=false; el.classList.remove('active'); });
  }
  hold('btnLeft','left');
  hold('btnRight','right');
  hold('btnJump','jump');
  document.addEventListener('keydown', function(e){
    if(e.key==='ArrowLeft'||e.key==='a') ctrl.left=true;
    if(e.key==='ArrowRight'||e.key==='d') ctrl.right=true;
    if(e.key===' '||e.key==='ArrowUp'||e.key==='w') ctrl.jump=true;
  });
  document.addEventListener('keyup', function(e){
    if(e.key==='ArrowLeft'||e.key==='a') ctrl.left=false;
    if(e.key==='ArrowRight'||e.key==='d') ctrl.right=false;
    if(e.key===' '||e.key==='ArrowUp'||e.key==='w') ctrl.jump=false;
  });
}

// ==================== LEVEL BUILDER ====================
function buildLevel(n) {
  grounds=[]; platfs=[]; qblocks=[]; enemies=[]; floatCoins=[]; parts=[];
  camX=0; levelRec=0; levelCoins=0;
  resetPlayer();

  var w = n < 5 ? 3000 + n*400 : 4000 + (n-5)*200;
  worldW = w;
  goalX = worldW - 150;

  // Always full ground strip at bottom
  var gapW = 80 + n * 20; // gap width increases with level
  var gapCount = Math.min(2 + Math.floor(n/2), 7);

  // Build ground with gaps
  var gx = 0;
  var segW = Math.floor((worldW - gapCount * gapW) / (gapCount + 1));
  for(var i=0; i<=gapCount; i++) {
    if(i === 0) {
      // First segment always starts player safe
      addG(0, GY, Math.max(segW, 350));
      gx = Math.max(segW, 350);
    } else {
      gx += gapW; // gap
      var sw = i === gapCount ? worldW - gx : segW;
      if(sw > 0) addG(gx, GY, sw);
      gx += sw;
    }
  }

  // Floating platforms
  var platCount = 8 + n * 2;
  var pSpacing = worldW / platCount;
  for(var p=0; p<platCount; p++) {
    var px = 200 + p * pSpacing + Math.random()*100;
    var py = GY - 120 - Math.random()*160;
    var pw = 2 + Math.floor(Math.random()*3);
    var ptype = Math.random() > 0.4 ? 'brick' : 'solid';
    addP(px, py, pw, ptype);

    // ? block above some platforms
    if(Math.random() > 0.5) {
      addQ(px + pw*TS/2 - TS/2, py - TS);
    }
  }

  // Standalone ? blocks
  var qCount = 6 + n;
  for(var q=0; q<qCount; q++) {
    var qx = 300 + (worldW-400)/qCount * q + Math.random()*80;
    var qy = GY - 180 - Math.random()*100;
    addQ(qx, qy);
  }

  // Enemies
  var eCount = 4 + n * 2;
  var eSpacing = (worldW - 300) / eCount;
  var eSpd = 1.0 + n * 0.3;
  for(var e=0; e<eCount; e++) {
    var ex = 350 + e * eSpacing + Math.random()*80;
    // Find ground Y at this position
    var ey = GY;
    addE(ex, ey - TS * 0.8, eSpd + Math.random()*0.5);
  }
}

function addG(x,y,w){ grounds.push({x:x,y:y,w:w,h:90}); }
function addP(x,y,tiles,type){ platfs.push({x:x,y:y,w:tiles*TS,h:TS,type:type}); }
function addQ(x,y){ qblocks.push({x:x,y:y,w:TS,h:TS,hit:false,bounceTimer:0}); }
function addE(x,y,spd){
  enemies.push({x:x,y:y,w:TS*0.75,h:TS*0.65,vx:spd,dead:false,deadTimer:0,squished:false,onGround:false});
}

// ==================== PHYSICS ====================
function getBoxes() {
  var boxes = [];
  grounds.forEach(function(g){ boxes.push(g); });
  platfs.forEach(function(p){ boxes.push(p); });
  qblocks.forEach(function(q){ if(!q.hit) boxes.push(q); else boxes.push({x:q.x,y:q.y,w:q.w,h:q.h}); });
  return boxes;
}

function collideRect(a, boxes) {
  var onGround = false;
  for(var i=0;i<boxes.length;i++){
    var b = boxes[i];
    if(a.x+a.w > b.x && a.x < b.x+b.w && a.y+a.h > b.y && a.y < b.y+b.h) {
      var dx1 = b.x+b.w - a.x; // push right
      var dx2 = a.x+a.w - b.x; // push left
      var dy1 = b.y+b.h - a.y; // push down
      var dy2 = a.y+a.h - b.y; // push up

      var minX = Math.min(dx1,dx2);
      var minY = Math.min(dy1,dy2);

      if(minX < minY) {
        if(dx2 < dx1) { a.x -= dx2; if(a.vx>0) a.vx=0; }
        else { a.x += dx1; if(a.vx<0) a.vx=0; }
      } else {
        if(dy2 < dy1) {
          a.y -= dy2;
          if(a.vy > 0) { a.vy = 0; onGround = true; }
        } else {
          a.y += dy1;
          if(a.vy < 0) {
            a.vy = 0;
            // check if ? block was hit from below
            checkQBlockHit(b, a);
          }
        }
      }
    }
  }
  return onGround;
}

function checkQBlockHit(box, hitter) {
  for(var i=0;i<qblocks.length;i++){
    var q = qblocks[i];
    if(!q.hit && Math.abs(q.x-box.x)<2 && Math.abs(q.y-box.y)<2) {
      q.hit = true;
      q.bounceTimer = 8;
      spawnFloatCoin(q.x + q.w/2, q.y);
      addScore(200);
    }
  }
}

function spawnFloatCoin(x, y) {
  floatCoins.push({
    x: x, y: y,
    vy: -4,
    life: 60,
    collected: false
  });
  levelCoins++;
  var rec = REWARDS[Math.min(curLevel, REWARDS.length-1)];
  sessionRec = parseFloat((sessionRec + rec).toFixed(6));
  levelRec = parseFloat((levelRec + rec).toFixed(6));
  addScore(100);
  updateHUD();
}

// ==================== UPDATE ====================
function update() {
  if(gState !== 'playing') return;

  var boxes = getBoxes();

  // === PLAYER ===
  if(!P.dead) {
    // Horizontal
    if(ctrl.left) { P.vx = -MOVE_SPD; P.facing = -1; }
    else if(ctrl.right) { P.vx = MOVE_SPD; P.facing = 1; }
    else { P.vx *= 0.7; }

    // Jump
    if(ctrl.jump && !jumpWas && P.onGround) {
      P.vy = JUMP_VEL;
      P.onGround = false;
      P.jumping = true;
    }
    jumpWas = ctrl.jump;

    // Gravity
    P.vy += GRAVITY;
    if(P.vy > 16) P.vy = 16;

    P.x += P.vx;
    P.y += P.vy;

    // World boundaries
    if(P.x < 0) P.x = 0;
    if(P.x + P.w > worldW) P.x = worldW - P.w;

    // Collision
    P.onGround = collideRect(P, boxes);

    // Run animation
    if(Math.abs(P.vx) > 0.5 && P.onGround) {
      P.runTimer++;
      if(P.runTimer > 8) { P.runFrame = (P.runFrame+1)%3; P.runTimer=0; }
    } else if(P.onGround) { P.runFrame=0; }

    // Invincibility countdown
    if(P.invTimer > 0) P.invTimer--;

    // Fall into pit
    if(P.y > H + 100) {
      killPlayer('Fell into a pit! 😱');
    }

    // Reach goal
    if(P.x + P.w > goalX) {
      levelComplete();
      return;
    }

    // Check enemy collision
    if(P.invTimer === 0) {
      for(var i=0;i<enemies.length;i++){
        var en = enemies[i];
        if(en.dead || en.squished) continue;
        if(rectsOverlap(P, en)) {
          // Check if stomping from above
          var pBottom = P.y + P.h;
          var eTop = en.y + 4;
          if(pBottom <= eTop + 12 && P.vy > 0) {
            // Stomp!
            en.squished = true;
            en.deadTimer = 30;
            P.vy = JUMP_VEL * 0.6;
            addScore(200);
            spawnPart(en.x+en.w/2, en.y, '#FF8800', 6);
          } else {
            // Hit by enemy
            killPlayer('Got hit by an enemy! 🍄');
          }
        }
      }
    }
  } else {
    // Dead animation
    P.deadTimer--;
    P.y += P.vy;
    P.vy += 0.4;
    if(P.deadTimer <= 0) showDeadScreen();
  }

  // === ENEMIES ===
  for(var ei=0;ei<enemies.length;ei++){
    var en = enemies[ei];
    if(en.dead) continue;
    if(en.squished) {
      en.deadTimer--;
      if(en.deadTimer <= 0) en.dead = true;
      continue;
    }
    // Move
    en.x += en.vx;
    en.vy = (en.vy||0) + GRAVITY;
    if(en.vy > 14) en.vy = 14;
    en.y += en.vy;

    // Collide with world
    var enOnGround = collideRect(en, boxes);
    en.onGround = enOnGround;

    // Reverse at edges / pits / walls
    if(en.x < 0 || en.x + en.w > worldW) en.vx *= -1;

    // Check pit ahead
    var lookX = en.vx > 0 ? en.x + en.w + 4 : en.x - 4;
    var lookY = en.y + en.h + 2;
    var onPlatform = false;
    for(var bi=0;bi<boxes.length;bi++){
      var bx = boxes[bi];
      if(lookX >= bx.x && lookX <= bx.x+bx.w && lookY >= bx.y && lookY <= bx.y+bx.h+4) {
        onPlatform = true; break;
      }
    }
    if(!onPlatform && en.onGround) en.vx *= -1;

    // Enemy falls off world
    if(en.y > H + 100) en.dead = true;
  }

  // === FLOAT COINS ===
  for(var ci=0;ci<floatCoins.length;ci++){
    var fc = floatCoins[ci];
    if(fc.collected) continue;
    fc.y += fc.vy;
    fc.vy += 0.2;
    fc.life--;
    if(fc.life <= 0) fc.collected = true;
  }

  // === ? BLOCK BOUNCE ===
  for(var qi=0;qi<qblocks.length;qi++){
    if(qblocks[qi].bounceTimer > 0) qblocks[qi].bounceTimer--;
  }

  // === PARTICLES ===
  for(var pi=parts.length-1;pi>=0;pi--){
    var pt = parts[pi];
    pt.x += pt.vx; pt.y += pt.vy;
    pt.vy += 0.2; pt.life--;
    if(pt.life<=0) parts.splice(pi,1);
  }

  // Camera
  var targetCamX = P.x - W * 0.35;
  camX += (targetCamX - camX) * 0.12;
  if(camX < 0) camX = 0;
  if(camX > worldW - W) camX = worldW - W;
}

function rectsOverlap(a,b){
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}

function killPlayer(msg) {
  if(P.dead) return;
  P.dead = true;
  P.vy = JUMP_VEL;
  P.vx = 0;
  P.deadTimer = 80;
  P.invTimer = 0;
  lives--;
  document.getElementById('deadMsg').textContent = msg;
  document.getElementById('deadLives').textContent = lives + ' ❤️';
  document.getElementById('deadRec').textContent = sessionRec.toFixed(4) + ' REC';
  if(lives <= 0) {
    P.deadTimer = 60;
  }
}

function addScore(pts) {
  score += pts;
  document.getElementById('hudScore').textContent = score;
}

// ==================== DRAW ====================
function draw() {
  // Sky background
  var sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#5C94FC');
  sky.addColorStop(1,'#9BB8F0');
  ctx.fillStyle = sky;
  ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.translate(-Math.floor(camX), 0);

  // Clouds (static, based on camX)
  drawClouds();

  // Goal flag
  drawGoal();

  // Ground
  grounds.forEach(function(g){ drawGround(g); });

  // Platforms
  platfs.forEach(function(p){ drawPlatform(p); });

  // ? blocks
  qblocks.forEach(function(q){ drawQBlock(q); });

  // Float coins
  floatCoins.forEach(function(fc){ if(!fc.collected) drawFloatCoin(fc); });

  // Particles
  parts.forEach(function(pt){
    ctx.globalAlpha = pt.life/20;
    ctx.fillStyle = pt.color;
    ctx.beginPath(); ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Enemies
  enemies.forEach(function(en){ if(!en.dead) drawEnemy(en); });

  // Player
  if(!P.dead || P.deadTimer > 0) {
    if(P.invTimer === 0 || Math.floor(P.invTimer/4)%2===0) drawMario(P);
  }

  ctx.restore();

  // Progress bar
  var pct = Math.max(0, Math.min(1, (P.x - 80) / (goalX - 80)));
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(0, H-5, W, 5);
  ctx.fillStyle = '#00FF88';
  ctx.fillRect(0, H-5, W*pct, 5);
}

// ==================== DRAW HELPERS ====================
function drawMario(p) {
  var x = Math.floor(p.x), y = Math.floor(p.y);
  var flip = p.facing === -1;
  ctx.save();
  if(flip) { ctx.scale(-1,1); x = -(x + p.w); }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath(); ctx.ellipse(x+p.w/2, p.y+p.h, p.w/2, 5, 0, 0, Math.PI*2); ctx.fill();

  // Hat (red)
  ctx.fillStyle = '#E52521';
  ctx.fillRect(x+2, y, p.w-4, 10);
  ctx.fillRect(x-2, y+6, p.w+4, 6);

  // Hair
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x+2, y+10, 4, 4);
  ctx.fillRect(x+p.w-6, y+10, 4, 4);

  // Face (skin)
  ctx.fillStyle = '#FFCC99';
  ctx.fillRect(x+2, y+12, p.w-4, 14);

  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(x+5, y+15, 4, 4);
  ctx.fillRect(x+p.w-9, y+15, 4, 4);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x+6, y+15, 2, 2);
  ctx.fillRect(x+p.w-8, y+15, 2, 2);

  // Mustache
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x+4, y+21, p.w-8, 3);
  ctx.fillRect(x+2, y+22, 6, 3);
  ctx.fillRect(x+p.w-8, y+22, 6, 3);

  // Body (red)
  ctx.fillStyle = '#E52521';
  ctx.fillRect(x+4, y+26, p.w-8, 8);

  // Overalls (blue)
  ctx.fillStyle = '#0066CC';
  ctx.fillRect(x+2, y+30, p.w-4, 12);
  // Straps
  ctx.fillStyle = '#0066CC';
  ctx.fillRect(x+6, y+26, 5, 6);
  ctx.fillRect(x+p.w-11, y+26, 5, 6);

  // Buttons
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x+7, y+32, 3, 3);
  ctx.fillRect(x+p.w-10, y+32, 3, 3);

  // Legs (run animation)
  ctx.fillStyle = '#E52521';
  if(!p.onGround || Math.abs(p.vx) < 0.5) {
    // Standing
    ctx.fillRect(x+4, y+42, 8, 8);
    ctx.fillRect(x+p.w-12, y+42, 8, 8);
  } else {
    var f = p.runFrame;
    if(f===0){ ctx.fillRect(x+4,y+42,8,8); ctx.fillRect(x+p.w-12,y+38,8,10); }
    else if(f===1){ ctx.fillRect(x+4,y+40,8,10); ctx.fillRect(x+p.w-12,y+42,8,8); }
    else { ctx.fillRect(x+4,y+38,8,10); ctx.fillRect(x+p.w-12,y+42,8,8); }
  }

  // Shoes
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x+2, y+p.h-6, 10, 6);
  ctx.fillRect(x+p.w-12, y+p.h-6, 10, 6);

  ctx.restore();
}

function drawEnemy(en) {
  var x = Math.floor(en.x), y = Math.floor(en.y);
  if(en.squished) {
    // Squished goomba
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y+en.h-8, en.w, 8);
    ctx.fillStyle = '#4a2200';
    ctx.fillRect(x+2, y+en.h-8, 6, 4);
    ctx.fillRect(x+en.w-8, y+en.h-8, 6, 4);
    return;
  }

  // Goomba body
  var bx = x, by = y;
  var bw = en.w, bh = en.h;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath(); ctx.ellipse(bx+bw/2, by+bh, bw/2, 4, 0, 0, Math.PI*2); ctx.fill();

  // Body (dark brown mushroom shape)
  ctx.fillStyle = '#8B4513';
  // Head (round top)
  ctx.beginPath();
  ctx.arc(bx+bw/2, by+bh*0.45, bw*0.48, Math.PI, 0);
  ctx.fill();
  // Body bottom
  ctx.fillRect(bx+2, by+bh*0.45, bw-4, bh*0.35);

  // Darker cap stripe
  ctx.fillStyle = '#5C2D00';
  ctx.beginPath();
  ctx.arc(bx+bw/2, by+bh*0.35, bw*0.35, Math.PI, 0);
  ctx.fill();

  // Eyes (angry)
  ctx.fillStyle = '#fff';
  ctx.fillRect(bx+5, by+bh*0.32, 9, 7);
  ctx.fillRect(bx+bw-14, by+bh*0.32, 9, 7);
  ctx.fillStyle = '#000';
  ctx.fillRect(bx+6, by+bh*0.33, 5, 5);
  ctx.fillRect(bx+bw-13, by+bh*0.33, 5, 5);
  // Angry eyebrows
  ctx.fillStyle = '#5C2D00';
  ctx.fillRect(bx+4, by+bh*0.28, 10, 3);
  ctx.fillRect(bx+bw-14, by+bh*0.28, 10, 3);
  // Rotate eyebrows
  ctx.save();
  ctx.fillStyle = '#5C2D00';
  ctx.translate(bx+9, by+bh*0.3);
  ctx.rotate(0.3); ctx.fillRect(-5,-1,10,3);
  ctx.restore();
  ctx.save();
  ctx.translate(bx+bw-9, by+bh*0.3);
  ctx.rotate(-0.3); ctx.fillRect(-5,-1,10,3);
  ctx.restore();

  // Feet
  ctx.fillStyle = '#3D1A00';
  var walkPhase = Math.sin(Date.now()/150) * 4;
  ctx.fillRect(bx+2, by+bh-10+walkPhase, 12, 8);
  ctx.fillRect(bx+bw-14, by+bh-10-walkPhase, 12, 8);
}

function drawGround(g) {
  // Grass top
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(g.x, g.y, g.w, 14);
  // Dirt body
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(g.x, g.y+14, g.w, g.h-14);
  // Tile lines
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for(var tx=g.x; tx<g.x+g.w; tx+=TS) {
    ctx.beginPath(); ctx.moveTo(tx,g.y+14); ctx.lineTo(tx,g.y+g.h); ctx.stroke();
  }
  for(var ty=g.y+14; ty<g.y+g.h; ty+=24) {
    ctx.beginPath(); ctx.moveTo(g.x,ty); ctx.lineTo(g.x+g.w,ty); ctx.stroke();
  }
  // Grass detail
  ctx.fillStyle = '#66BB6A';
  for(var gd=g.x; gd<g.x+g.w; gd+=12) {
    ctx.fillRect(gd, g.y, 6, 4);
  }
}

function drawPlatform(p) {
  if(p.type === 'brick') {
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    // Brick pattern
    ctx.fillStyle = '#8B2500';
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    for(var bx=p.x; bx<p.x+p.w; bx+=TS){
      for(var by2=p.y; by2<p.y+p.h; by2+=TS/2){
        var offset = (Math.floor((by2-p.y)/(TS/2))%2)*TS/2;
        ctx.strokeRect(bx+offset+1, by2+1, TS-2, TS/2-2);
      }
    }
  } else {
    // Solid platform
    ctx.fillStyle = '#7D5A3C';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#9E7B5C';
    ctx.fillRect(p.x, p.y, p.w, 6);
    ctx.fillStyle = '#5D3A1A';
    ctx.fillRect(p.x, p.y+p.h-4, p.w, 4);
  }
}

function drawQBlock(q) {
  var bounce = q.bounceTimer > 0 ? -Math.sin(q.bounceTimer/8*Math.PI)*8 : 0;
  var qy = q.y + bounce;

  if(q.hit) {
    // Empty block
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(q.x, qy, q.w, q.h);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(q.x+1, qy+1, q.w-2, q.h-2);
  } else {
    // ? block - animated
    var pulse = 0.85 + Math.sin(Date.now()/200)*0.15;
    ctx.fillStyle = '#F0A000';
    ctx.fillRect(q.x, qy, q.w, q.h);

    // Shine
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(q.x+2, qy+2, q.w-4, 6);
    ctx.fillRect(q.x+2, qy+2, 6, q.h-4);

    // Shadow
    ctx.fillStyle = '#C07800';
    ctx.fillRect(q.x+2, qy+q.h-4, q.w-2, 4);
    ctx.fillRect(q.x+q.w-4, qy+2, 4, q.h-2);

    // Border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(q.x+1, qy+1, q.w-2, q.h-2);

    // ?
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', q.x+q.w/2, qy+q.h/2+1);
    ctx.fillStyle = '#000';
    ctx.fillText('?', q.x+q.w/2, qy+q.h/2);
  }
}

function drawFloatCoin(fc) {
  var alpha = Math.min(1, fc.life/15);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#FFD700';
  ctx.beginPath(); ctx.arc(fc.x, fc.y, 10, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#FFF176';
  ctx.beginPath(); ctx.arc(fc.x-2, fc.y-2, 4, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.font = 'bold 9px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('R', fc.x, fc.y+1);
  ctx.globalAlpha = 1;
}

function drawGoal() {
  // Flag pole
  ctx.fillStyle = '#888';
  ctx.fillRect(goalX+20, GY-220, 6, 220);
  // Flag
  ctx.fillStyle = '#00CC00';
  ctx.beginPath();
  ctx.moveTo(goalX+26, GY-220);
  ctx.lineTo(goalX+70, GY-200);
  ctx.lineTo(goalX+26, GY-180);
  ctx.fill();
  // Castle-like block at bottom
  ctx.fillStyle = '#888';
  ctx.fillRect(goalX, GY-20, 50, 20);
  ctx.fillStyle = '#666';
  ctx.fillRect(goalX+5, GY-30, 10, 12);
  ctx.fillRect(goalX+20, GY-30, 10, 12);
  ctx.fillRect(goalX+35, GY-30, 10, 12);
}

function drawClouds() {
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  var cloudPositions = [200, 600, 1100, 1600, 2100, 2600, 3100, 3600, 4000];
  cloudPositions.forEach(function(cx, i) {
    var cy = 60 + (i%3)*30;
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+35, cy, 25, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+65, cy, 30, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+25, cy-15, 22, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+50, cy-18, 18, 0, Math.PI*2); ctx.fill();
  });
}

function spawnPart(x, y, color, count) {
  for(var i=0;i<count;i++){
    var a = Math.random()*Math.PI*2;
    var s = 2+Math.random()*3;
    parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3,color:color,r:3+Math.random()*3,life:20});
  }
}

// ==================== HUD ====================
function updateHUD() {
  document.getElementById('hudLives').textContent = '❤️'.repeat(Math.max(0,lives));
  document.getElementById('hudLevel').textContent = curLevel;
  document.getElementById('hudRec').textContent = sessionRec.toFixed(4);
}

// ==================== SCREENS ====================
function showScreen(id) {
  ['startScreen','deadScreen','clearScreen','overScreen'].forEach(function(s){
    document.getElementById(s).classList.remove('show');
  });
  if(id) document.getElementById(id).classList.add('show');
}

function showDeadScreen() {
  if(lives <= 0) {
    document.getElementById('overLevel').textContent = 'Level ' + curLevel;
    document.getElementById('overRec').textContent = sessionRec.toFixed(4) + ' REC';
    showScreen('overScreen');
    gState = 'over';
    saveRec();
  } else {
    showScreen('deadScreen');
    gState = 'dead';
  }
}

function levelComplete() {
  gState = 'clear';
  document.getElementById('clearSub').textContent = 'Level ' + curLevel + ' Complete! 🎉';
  document.getElementById('clearCoins').textContent = levelCoins;
  document.getElementById('clearRec').textContent = levelRec.toFixed(4) + ' REC';
  document.getElementById('clearTotal').textContent = sessionRec.toFixed(4) + ' REC';
  var nextLvl = curLevel + 1;
  var nextReward = REWARDS[Math.min(nextLvl, REWARDS.length-1)];
  document.getElementById('nextLevelInfo').textContent =
    'Next: Level ' + nextLvl + ' — ' + nextReward.toFixed(3) + ' REC/coin';
  showScreen('clearScreen');
  saveRec();
}

function saveRec() {
  var now = Date.now();
  if(tgUser && sessionRec > 0 && now - lastSave > 5000) {
    lastSave = now;
    fetch('/api/game-earn', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({telegramId:tgUser.id, rec:sessionRec, gameType:'mario'})
    }).catch(function(){});
  }
}

// ==================== GAME FLOW ====================
function startGame() {
  curLevel = 1; lives = 3; score = 0; sessionRec = 0;
  showScreen(null);
  gState = 'playing';
  buildLevel(curLevel);
  updateHUD();
  document.getElementById('hudScore').textContent = '0';
}

function respawn() {
  if(lives <= 0) { restartGame(); return; }
  showScreen(null);
  gState = 'playing';
  buildLevel(curLevel); // rebuild same level
  updateHUD();
}

function nextLevel() {
  curLevel++;
  showScreen(null);
  gState = 'playing';
  buildLevel(curLevel);
  updateHUD();
}

function restartGame() {
  curLevel = 1; lives = 3; score = 0; sessionRec = 0;
  showScreen(null);
  gState = 'playing';
  buildLevel(curLevel);
  updateHUD();
  document.getElementById('hudScore').textContent = '0';
}

// ==================== GAME LOOP ====================
var lastTime = 0;
function loop(ts) {
  var dt = Math.min((ts - lastTime)/16.67, 3);
  lastTime = ts;

  update();
  draw();
  requestAnimationFrame(loop);
}
