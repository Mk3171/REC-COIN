// ====== SUPER REC - Mario Style ======
'use strict';

var GRAV = 0.55, JUMP = -13, SPD = 4.0, TS = 48;
var REWARDS = [0,0.001,0.001,0.005,0.005,0.05,0.1,0.2,0.5,0.5];

var canvas, ctx, W, H, GY;
var gState = 'start';
var curLevel=1, lives=3, score=0, sessionRec=0, levelRec=0, levelCoins=0;
var tgUser=null, lastSave=0, camX=0, worldW=3000, goalX=2850;
var grounds=[], platfs=[], qblocks=[], enemies=[], floatCoins=[], parts=[];
var ctrl={left:false,right:false,jump:false}, jumpWas=false;
var P={};

function resetP(){
  P={x:100,y:50,w:28,h:42,vx:0,vy:0,onGround:false,dead:false,deadTimer:0,jumps:0,
     facing:1,runFrame:0,runTimer:0,invTimer:0};
}

// ====== INIT ======
window.onload=function(){
  try{
    if(window.Telegram&&window.Telegram.WebApp){
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      tgUser=window.Telegram.WebApp.initDataUnsafe&&window.Telegram.WebApp.initDataUnsafe.user;
    }
  }catch(e){}
  canvas=document.getElementById('gc');
  ctx=canvas.getContext('2d');
  doResize();
  window.addEventListener('resize',doResize);
  setupCtrl();
  showScreen('startScreen');
  requestAnimationFrame(loop);
};

function doResize(){
  W=canvas.width=window.innerWidth||375;
  H=canvas.height=window.innerHeight||667;
  GY=H-95;
  if(gState==='playing') buildLevel(curLevel);
}

// ====== CONTROLS ======
function setupCtrl(){
  function btn(id,k){
    var el=document.getElementById(id);
    if(!el)return;
    el.addEventListener('touchstart',function(e){e.preventDefault();ctrl[k]=true;el.classList.add('active');},{passive:false});
    el.addEventListener('touchend',function(e){e.preventDefault();ctrl[k]=false;el.classList.remove('active');},{passive:false});
    el.addEventListener('mousedown',function(){ctrl[k]=true;el.classList.add('active');});
    document.addEventListener('mouseup',function(){ctrl[k]=false;el.classList.remove('active');});
  }
  btn('btnLeft','left'); btn('btnRight','right'); btn('btnJump','jump');
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'||e.key==='a')ctrl.left=true;
    if(e.key==='ArrowRight'||e.key==='d')ctrl.right=true;
    if(e.key===' '||e.key==='ArrowUp')ctrl.jump=true;
  });
  document.addEventListener('keyup',function(e){
    if(e.key==='ArrowLeft'||e.key==='a')ctrl.left=false;
    if(e.key==='ArrowRight'||e.key==='d')ctrl.right=false;
    if(e.key===' '||e.key==='ArrowUp')ctrl.jump=false;
  });
}

// ====== BUILD LEVEL ======
function buildLevel(n){
  grounds=[];platfs=[];qblocks=[];enemies=[];floatCoins=[];parts=[];
  camX=0;levelRec=0;levelCoins=0;
  resetP();
  worldW=3000+n*300; goalX=worldW-160;
  var gapSz=70+n*15, gapN=Math.min(1+Math.floor(n/2),5);
  var segW=Math.floor((worldW-gapN*gapSz)/(gapN+1));
  var gx=0;
  for(var i=0;i<=gapN;i++){
    if(i===0){var w=Math.max(segW,320);addG(0,GY,w);gx=w;}
    else{gx+=gapSz;var sw=(i===gapN)?worldW-gx:segW;if(sw>0)addG(gx,GY,sw);gx+=sw;}
  }
  // platforms
  var pc=6+n*2,sp=(worldW-300)/pc;
  // Platforms low enough for Mario to jump on
  for(var p=0;p<pc;p++){
    var px=200+p*sp+Math.random()*80;
    var py=GY-TS*2-Math.random()*TS; // 2-3 tiles above ground
    var pw=2+Math.floor(Math.random()*3);
    addP(px,py,pw,Math.random()>0.5?'brick':'solid');
  }
  // Q blocks: float at jump height from ground (Mario hits from BELOW)
  // Jump height ~ GY - 170 to GY - 210 (reachable with single jump)
  var qCount=7+n;
  for(var q=0;q<qCount;q++){
    var qx=200+(worldW-400)/qCount*q+Math.random()*70;
    var qy=GY-TS*3.2-Math.random()*TS*0.8; // fixed jump height
    addQ(qx,qy);
  }
  // enemies
  var ec=3+n*2,es=(worldW-300)/ec,espd=0.9+n*0.3;
  for(var e=0;e<ec;e++){
    addE(300+e*es+Math.random()*60, GY-TS*0.7, espd+Math.random()*0.4);
  }
}

function addG(x,y,w){grounds.push({x:x,y:y,w:w,h:95});}
function addP(x,y,t,type){platfs.push({x:x,y:y,w:t*TS,h:TS,type:type});}
function addQ(x,y){qblocks.push({x:x,y:y,w:TS,h:TS,hit:false,bt:0});}
function addE(x,y,spd){enemies.push({x:x,y:y,w:TS*0.75,h:TS*0.65,vx:spd,vy:0,dead:false,dt:0,sq:false,og:false});}

// ====== PHYSICS ======
function getSolids(){
  var b=[];
  grounds.forEach(function(g){b.push(g);});
  platfs.forEach(function(p){b.push(p);});
  qblocks.forEach(function(q,i){b.push({x:q.x,y:q.y+(q.bt>0?-Math.sin(q.bt/8*Math.PI)*6:0),w:q.w,h:q.h,isQ:true,qi:i});});
  return b;
}

function moveAndCollide(obj,solids){
  var og=false;
  obj.x+=obj.vx; obj.y+=obj.vy;
  for(var i=0;i<solids.length;i++){
    var b=solids[i];
    if(obj.x+obj.w>b.x&&obj.x<b.x+b.w&&obj.y+obj.h>b.y&&obj.y<b.y+b.h){
      var ol={l:b.x+b.w-obj.x,r:obj.x+obj.w-b.x,t:b.y+b.h-obj.y,bo:obj.y+obj.h-b.y};
      var minX=Math.min(ol.l,ol.r), minY=Math.min(ol.t,ol.bo);
      if(minX<minY){
        if(ol.r<ol.l){obj.x-=ol.r;if(obj.vx>0)obj.vx=0;}
        else{obj.x+=ol.l;if(obj.vx<0)obj.vx=0;}
      }else{
        if(ol.bo<ol.t){
          obj.y-=ol.bo;
          if(obj.vy>0){obj.vy=0;og=true;}
        }else{
          obj.y+=ol.t;
          if(obj.vy<0){
            obj.vy=0;
            if(b.isQ){
              hitQBlock(b.qi);
            } else if(b.type==='brick' && obj===P && !P.dead){
              doBrickBreak(b);
            }
          }
        }
      }
    }
  }
  return og;
}

function hitQBlock(qi){
  var q=qblocks[qi];
  if(!q||q.hit)return;
  q.hit=true;q.bt=16;
  floatCoins.push({x:q.x+q.w/2,y:q.y,vy:-5,life:50});
  levelCoins++;
  var rec=REWARDS[Math.min(curLevel,REWARDS.length-1)];
  sessionRec=parseFloat((sessionRec+rec).toFixed(6));
  levelRec=parseFloat((levelRec+rec).toFixed(6));
  score+=100; updHUD();
  spawnPt(q.x+q.w/2,q.y+q.h/2,'#FFD700',5);
}

function doBrickBreak(plat){
  var idx=platfs.indexOf(plat);
  if(idx<0)return;
  var mx=P.x+P.w/2;
  var ts=Math.floor((mx-plat.x)/TS)*TS+plat.x;
  ts=Math.max(plat.x,Math.min(plat.x+plat.w-TS,ts));
  spawnPt(ts+TS/2,plat.y,'#C0392B',8);
  spawnPt(ts+TS/2,plat.y,'#8B4513',5);
  score+=50;
  if(plat.w<=TS){
    platfs.splice(idx,1);
  } else if(ts<=plat.x){
    plat.x+=TS;plat.w-=TS;
  } else if(ts+TS>=plat.x+plat.w){
    plat.w-=TS;
  } else {
    var rp={x:ts+TS,y:plat.y,w:plat.x+plat.w-(ts+TS),h:plat.h,type:'brick'};
    plat.w=ts-plat.x;
    platfs.push(rp);
  }
}

// ====== UPDATE ======
function update(){
  if(gState!=='playing')return;
  var solids=getSolids();

  // Player
  if(!P.dead){
    if(ctrl.left){P.vx=-SPD;P.facing=-1;}
    else if(ctrl.right){P.vx=SPD;P.facing=1;}
    else P.vx*=0.65;
    if(ctrl.jump&&!jumpWas&&P.jumps<2){P.vy=(P.jumps===0?JUMP:JUMP*0.75);P.onGround=false;P.jumps++;}
    jumpWas=ctrl.jump;
    P.vy+=GRAV;if(P.vy>16)P.vy=16;
    var og2=moveAndCollide(P,solids);
    if(og2&&!P.onGround)P.jumps=0;
    P.onGround=og2;
    if(P.x<0)P.x=0;if(P.x+P.w>worldW)P.x=worldW-P.w;
    if(P.invTimer>0)P.invTimer--;
    if(Math.abs(P.vx)>0.4&&P.onGround){P.runTimer++;if(P.runTimer>7){P.runFrame=(P.runFrame+1)%3;P.runTimer=0;}}
    else if(P.onGround)P.runFrame=0;
    if(P.y>H+80){diePlayer('Fell into a pit! 😱');return;}
    if(P.x+P.w>goalX){doLevelClear();return;}
    if(P.invTimer===0){
      for(var i=0;i<enemies.length;i++){
        var en=enemies[i];
        if(en.dead||en.sq)continue;
        if(overlap(P,en)){
          if(P.y+P.h<=en.y+10&&P.vy>0){
            en.sq=true;en.dt=25;P.vy=JUMP*0.55;
            score+=200;spawnPt(en.x+en.w/2,en.y,'#FF8800',6);
          }else{diePlayer('Got hit by Goomba! 🍄');}
        }
      }
    }
  } else {
    P.vy+=0.35;P.y+=P.vy;P.deadTimer--;
    if(P.deadTimer<=0){if(lives<=0)doGameOver();else doDeadScreen();}
  }

  // Enemies
  for(var ei=0;ei<enemies.length;ei++){
    var en=enemies[ei];
    if(en.dead)continue;
    if(en.sq){en.dt--;if(en.dt<=0)en.dead=true;continue;}
    en.vy+=GRAV;if(en.vy>14)en.vy=14;
    en.og=moveAndCollide(en,solids);
    if(en.x<0||en.x+en.w>worldW)en.vx*=-1;
    var lx=en.vx>0?en.x+en.w+3:en.x-3, ly=en.y+en.h+2, onp=false;
    for(var bi=0;bi<solids.length;bi++){var bx=solids[bi];if(lx>=bx.x&&lx<=bx.x+bx.w&&ly>=bx.y&&ly<=bx.y+bx.h+5){onp=true;break;}}
    if(!onp&&en.og)en.vx*=-1;
    if(en.y>H+80)en.dead=true;
  }

  // Float coins
  for(var ci=0;ci<floatCoins.length;ci++){
    var fc=floatCoins[ci];
    fc.y+=fc.vy;fc.vy+=0.3;fc.life--;
  }
  for(var qi=0;qi<qblocks.length;qi++)if(qblocks[qi].bt>0)qblocks[qi].bt--;
  for(var pi=parts.length-1;pi>=0;pi--){
    var pt=parts[pi];pt.x+=pt.vx;pt.y+=pt.vy;pt.vy+=0.2;pt.life--;
    if(pt.life<=0)parts.splice(pi,1);
  }

  var tx=P.x-W*0.35;
  camX+=(tx-camX)*0.14;
  if(camX<0)camX=0;
  if(camX>worldW-W)camX=worldW-W;
}

function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}

// ====== DRAW ======
function draw(){
  // Sky
  var sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#4a80e8');sky.addColorStop(1,'#87b4f5');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.translate(-Math.floor(camX),0);

  // Clouds
  drawClouds();

  // Goal
  ctx.fillStyle='#777';ctx.fillRect(goalX+18,GY-200,6,200);
  ctx.fillStyle='#22AA22';
  ctx.beginPath();ctx.moveTo(goalX+24,GY-200);ctx.lineTo(goalX+65,GY-182);ctx.lineTo(goalX+24,GY-164);ctx.fill();
  ctx.fillStyle='#666';ctx.fillRect(goalX,GY-16,48,16);

  // Ground
  grounds.forEach(drawGnd);
  // Platforms
  platfs.forEach(drawPlat);
  // Q blocks
  qblocks.forEach(drawQB);
  // Float coins
  floatCoins.forEach(function(fc){if(fc.life>0)drawFC(fc);});
  // Particles
  ctx.save();
  parts.forEach(function(pt){ctx.globalAlpha=pt.life/20;ctx.fillStyle=pt.color;ctx.beginPath();ctx.arc(pt.x,pt.y,pt.r,0,Math.PI*2);ctx.fill();});
  ctx.globalAlpha=1;ctx.restore();
  // Enemies
  enemies.forEach(function(en){if(!en.dead)drawEnemy(en);});
  // Mario
  if(!P.dead||P.deadTimer>0){
    if(P.invTimer===0||Math.floor(P.invTimer/4)%2===0)drawMario();
  }

  ctx.restore();

  // Progress
  var pct=Math.max(0,Math.min(1,(P.x-100)/(goalX-100)));
  ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(0,H-5,W,5);
  ctx.fillStyle='#00FF88';ctx.fillRect(0,H-5,W*pct,5);
}

function drawMario(){
  var x=Math.floor(P.x),y=Math.floor(P.y),fl=P.facing===-1;
  ctx.save();
  if(fl){ctx.scale(-1,1);x=-(x+P.w);}
  var w=P.w,h=P.h;
  // Hat
  ctx.fillStyle='#E52521';ctx.fillRect(x+2,y,w-4,9);ctx.fillRect(x-2,y+5,w+4,5);
  // Face
  ctx.fillStyle='#FFCC99';ctx.fillRect(x+2,y+10,w-4,13);
  // Eyes
  ctx.fillStyle='#000';ctx.fillRect(x+5,y+13,3,3);ctx.fillRect(x+w-8,y+13,3,3);
  ctx.fillStyle='#fff';ctx.fillRect(x+6,y+13,1,2);ctx.fillRect(x+w-7,y+13,1,2);
  // Mustache
  ctx.fillStyle='#5C2D00';ctx.fillRect(x+3,y+19,w-6,3);ctx.fillRect(x+1,y+20,5,3);ctx.fillRect(x+w-6,y+20,5,3);
  // Body
  ctx.fillStyle='#E52521';ctx.fillRect(x+4,y+23,w-8,7);
  // Overalls
  ctx.fillStyle='#0055BB';ctx.fillRect(x+2,y+27,w-4,11);
  ctx.fillStyle='#0055BB';ctx.fillRect(x+5,y+23,5,6);ctx.fillRect(x+w-10,y+23,5,6);
  ctx.fillStyle='#FFD700';ctx.fillRect(x+7,y+29,2,2);ctx.fillRect(x+w-9,y+29,2,2);
  // Legs
  ctx.fillStyle='#E52521';
  var f=P.runFrame;
  if(!P.onGround||Math.abs(P.vx)<0.4){ctx.fillRect(x+3,y+38,8,7);ctx.fillRect(x+w-11,y+38,8,7);}
  else if(f===0){ctx.fillRect(x+3,y+38,8,7);ctx.fillRect(x+w-11,y+36,8,9);}
  else if(f===1){ctx.fillRect(x+3,y+36,8,9);ctx.fillRect(x+w-11,y+38,8,7);}
  else{ctx.fillRect(x+3,y+34,8,11);ctx.fillRect(x+w-11,y+38,8,7);}
  // Shoes
  ctx.fillStyle='#5C2D00';ctx.fillRect(x+1,y+h-5,10,5);ctx.fillRect(x+w-11,y+h-5,10,5);
  ctx.restore();
}

function drawEnemy(en){
  var x=Math.floor(en.x),y=Math.floor(en.y),w=en.w,h=en.h;
  if(en.sq){ctx.fillStyle='#6B3200';ctx.fillRect(x,y+h-7,w,7);return;}
  ctx.fillStyle='#8B4513';
  ctx.beginPath();ctx.arc(x+w/2,y+h*0.4,w*0.47,Math.PI,0);ctx.fill();
  ctx.fillRect(x+2,y+h*0.4,w-4,h*0.38);
  ctx.fillStyle='#5C2D00';
  ctx.beginPath();ctx.arc(x+w/2,y+h*0.3,w*0.32,Math.PI,0);ctx.fill();
  ctx.fillStyle='#fff';ctx.fillRect(x+5,y+h*0.3,8,6);ctx.fillRect(x+w-13,y+h*0.3,8,6);
  ctx.fillStyle='#000';ctx.fillRect(x+6,y+h*0.31,4,4);ctx.fillRect(x+w-12,y+h*0.31,4,4);
  ctx.fillStyle='#5C2D00';
  var wp=Math.sin(Date.now()/130)*3;
  ctx.fillRect(x+2,y+h-9+wp,11,7);ctx.fillRect(x+w-13,y+h-9-wp,11,7);
}

function drawGnd(g){
  ctx.fillStyle='#4CAF50';ctx.fillRect(g.x,g.y,g.w,13);
  ctx.fillStyle='#66BB6A';
  for(var i=g.x;i<g.x+g.w;i+=10)ctx.fillRect(i,g.y,5,3);
  ctx.fillStyle='#795548';ctx.fillRect(g.x,g.y+13,g.w,g.h-13);
  ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=1;
  for(var tx=g.x;tx<g.x+g.w;tx+=TS){ctx.beginPath();ctx.moveTo(tx,g.y+13);ctx.lineTo(tx,g.y+g.h);ctx.stroke();}
  for(var ty=g.y+13;ty<g.y+g.h;ty+=22){ctx.beginPath();ctx.moveTo(g.x,ty);ctx.lineTo(g.x+g.w,ty);ctx.stroke();}
}

function drawPlat(p){
  if(p.type==='brick'){
    ctx.save();
    ctx.beginPath();ctx.rect(p.x,p.y,p.w,p.h);ctx.clip();
    ctx.fillStyle='#C0392B';ctx.fillRect(p.x,p.y,p.w,p.h);
    ctx.strokeStyle='rgba(0,0,0,0.25)';ctx.lineWidth=2;
    for(var bx=p.x;bx<p.x+p.w+TS;bx+=TS)for(var by2=p.y;by2<p.y+p.h;by2+=TS/2){
      var off=(Math.floor((by2-p.y)/(TS/2))%2)*TS/2;
      ctx.strokeRect(bx+off+1,by2+1,TS-2,TS/2-2);
    }
    ctx.restore();
  }else{
    ctx.fillStyle='#7D5A3C';ctx.fillRect(p.x,p.y,p.w,p.h);
    ctx.fillStyle='#9E7B5C';ctx.fillRect(p.x,p.y,p.w,5);
    ctx.fillStyle='#5D3A1A';ctx.fillRect(p.x,p.y+p.h-3,p.w,3);
  }
}

function drawQB(q){
  var by=q.y+(q.bt>0?-Math.sin(q.bt/8*Math.PI)*6:0);
  if(q.hit){
    ctx.fillStyle='#6B4C00';ctx.fillRect(q.x,by,q.w,q.h);
    ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(q.x,by,q.w,q.h);
    ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=2;ctx.strokeRect(q.x+1,by+1,q.w-2,q.h-2);
    // dark X to show used
    ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(q.x+6,by+6);ctx.lineTo(q.x+q.w-6,by+q.h-6);ctx.stroke();
    ctx.beginPath();ctx.moveTo(q.x+q.w-6,by+6);ctx.lineTo(q.x+6,by+q.h-6);ctx.stroke();
  }else{
    ctx.fillStyle='#F0A000';ctx.fillRect(q.x,by,q.w,q.h);
    ctx.fillStyle='#FFD700';ctx.fillRect(q.x+2,by+2,q.w-4,5);ctx.fillRect(q.x+2,by+2,5,q.h-4);
    ctx.fillStyle='#B07800';ctx.fillRect(q.x+2,by+q.h-4,q.w-2,4);ctx.fillRect(q.x+q.w-4,by+2,4,q.h-2);
    ctx.strokeStyle='#000';ctx.lineWidth=2;ctx.strokeRect(q.x+1,by+1,q.w-2,q.h-2);
    ctx.fillStyle='#fff';ctx.font='bold 20px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('?',q.x+q.w/2,by+q.h/2+1);
    ctx.fillStyle='#000';ctx.fillText('?',q.x+q.w/2,by+q.h/2);
  }
}

function drawFC(fc){
  ctx.globalAlpha=Math.min(1,fc.life/10);
  ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(fc.x,fc.y,9,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#000';ctx.font='bold 8px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('R',fc.x,fc.y+1);
  ctx.globalAlpha=1;
}

function drawClouds(){
  ctx.fillStyle='rgba(255,255,255,0.85)';
  [200,600,1000,1500,2000,2500,3000,3500,4000].forEach(function(cx,i){
    var cy=55+(i%3)*25;
    ctx.beginPath();ctx.arc(cx,cy,28,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx+32,cy,22,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx+58,cy,27,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx+22,cy-14,19,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(cx+44,cy-16,16,0,Math.PI*2);ctx.fill();
  });
}

function spawnPt(x,y,color,n){
  for(var i=0;i<n;i++){
    var a=Math.random()*Math.PI*2,s=2+Math.random()*3;
    parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,color:color,r:3+Math.random()*2,life:20});
  }
}

// ====== HUD ======
function updHUD(){
  document.getElementById('hudLives').textContent='❤️'.repeat(Math.max(0,lives));
  document.getElementById('hudLevel').textContent=curLevel;
  document.getElementById('hudRec').textContent=sessionRec.toFixed(4);
  document.getElementById('hudScore').textContent=score;
}

// ====== SCREENS ======
function showScreen(id){
  ['startScreen','deadScreen','clearScreen','overScreen'].forEach(function(s){
    var el=document.getElementById(s);
    if(el)el.style.display='none';
  });
  if(id){var el=document.getElementById(id);if(el)el.style.display='flex';}
}

function diePlayer(msg){
  if(P.dead)return;
  P.dead=true;P.vy=JUMP*0.7;P.vx=0;P.deadTimer=70;lives--;
  document.getElementById('deadMsg').textContent=msg;
  document.getElementById('deadLives').textContent=lives+' ❤️';
  document.getElementById('deadRec').textContent=sessionRec.toFixed(4)+' REC';
}

function doDeadScreen(){gState='dead';showScreen('deadScreen');}
function doGameOver(){
  gState='over';
  document.getElementById('overLevel').textContent='Level '+curLevel;
  document.getElementById('overRec').textContent=sessionRec.toFixed(4)+' REC';
  showScreen('overScreen');saveRec();
}

function doLevelClear(){
  gState='clear';
  document.getElementById('clearSub').textContent='Level '+curLevel+' Complete! 🎉';
  document.getElementById('clearCoins').textContent=levelCoins;
  document.getElementById('clearRec').textContent=levelRec.toFixed(4)+' REC';
  document.getElementById('clearTotal').textContent=sessionRec.toFixed(4)+' REC';
  var nxt=curLevel+1, nr=REWARDS[Math.min(nxt,REWARDS.length-1)];
  document.getElementById('nextLevelInfo').textContent='Next: Level '+nxt+' — '+nr.toFixed(3)+' REC/coin';
  showScreen('clearScreen');saveRec();
}

function saveRec(){
  var now=Date.now();
  if(tgUser&&sessionRec>0&&now-lastSave>5000){
    lastSave=now;
    fetch('/api/game-earn',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({telegramId:tgUser.id,rec:sessionRec,gameType:'mario'})}).catch(function(){});
  }
}

// ====== GAME FLOW ======
function startGame(){curLevel=1;lives=3;score=0;sessionRec=0;showScreen(null);gState='playing';buildLevel(1);updHUD();}
function respawn(){showScreen(null);gState='playing';buildLevel(curLevel);updHUD();}
function nextLevel(){curLevel++;showScreen(null);gState='playing';buildLevel(curLevel);updHUD();}
function restartGame(){curLevel=1;lives=3;score=0;sessionRec=0;showScreen(null);gState='playing';buildLevel(1);updHUD();}

// ====== LOOP ======
function loop(){
  update();draw();
  requestAnimationFrame(loop);
}
