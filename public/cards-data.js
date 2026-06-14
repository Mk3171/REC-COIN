// VIP2 formulas (also defined in app.js — kept here for cards-data scope)
function vipCardRECSpeed(lvl){ if(lvl<=0)return 0; return 0.0005*Math.pow(10000,(lvl-1)/99); }
function vipCardCost(lvl){ return Math.floor(500000*Math.pow(9e9,lvl/99)); }

// ====== CARDS DATA & UPGRADE LOGIC — cards-data.js ======
var categories=[
  {nameKey:'catAnime',cards:[
    {n:'ناروتو',en:'Naruto',e:'🍥'},{n:'غوكو',en:'Goku',e:'⚡'},{n:'لوفي',en:'Luffy',e:'🏴‍☠️'},{n:'ساسكي',en:'Sasuke',e:'🌩️'},
    {n:'إيتاشي',en:'Itachi',e:'🌸'},{n:'زورو',en:'Zoro',e:'⚔️'},{n:'توتورو',en:'Totoro',e:'🌿'},{n:'ميكاسا',en:'Mikasa',e:'🗡️'},
    {n:'ليفاي',en:'Levi',e:'💨'},{n:'إيرين',en:'Eren',e:'🔑'},{n:'آرمين',en:'Armin',e:'📚'},{n:'بيكولو',en:'Piccolo',e:'👁️'},
    {n:'فيجيتا',en:'Vegeta',e:'👑'},{n:'ناتسو',en:'Natsu',e:'🔥'},{n:'غراي',en:'Gray',e:'❄️'},{n:'إيرزا',en:'Erza',e:'🛡️'},
    {n:'لوسي',en:'Lucy',e:'⭐'},{n:'كيريتو',en:'Kirito',e:'🗡️'},{n:'أسونا',en:'Asuna',e:'🌹'},{n:'غون',en:'Gon',e:'🌟'},
    {n:'كيليوا',en:'Killua',e:'⚡'},{n:'كوروكو',en:'Kuroko',e:'🏀'},{n:'زيرو تو',en:'Zero Two',e:'🦋'},{n:'ريم',en:'Rem',e:'💙'},
    {n:'غوجو',en:'Gojo',e:'🌀'},{n:'يوجي',en:'Yuji',e:'👊'},{n:'تانجيرو',en:'Tanjiro',e:'💧'},{n:'نيزوكو',en:'Nezuko',e:'🎋'},
    {n:'زينيتسو',en:'Zenitsu',e:'⚡'},{n:'إيزوكو',en:'Izuku',e:'💚'},{n:'كاتسوكي',en:'Bakugo',e:'💥'},{n:'شوتو',en:'Shoto',e:'🌓'},
    {n:'إيتشيغو',en:'Ichigo',e:'🌙'},{n:'كازوما',en:'Kazuma',e:'💰'},{n:'أكوا',en:'Aqua',e:'💧'},{n:'ميغومين',en:'Megumin',e:'💥'},
    {n:'يوريتشي',en:'Yoriichi',e:'☀️'},{n:'رينغوكو',en:'Rengoku',e:'🔥'},{n:'أكازا',en:'Akaza',e:'🌺'},{n:'تشيهيرو',en:'Chihiro',e:'🏮'}
  ]},
  {nameKey:'catCars',cards:[
    {n:'Ferrari SF90',e:'🔴'},{n:'Lamborghini Aventador',e:'🟡'},{n:'Bugatti Chiron',e:'🔵'},
    {n:'McLaren P1',e:'🟠'},{n:'Porsche 911',e:'⚫'},{n:'Mercedes AMG GT',e:'⬛'},
    {n:'BMW M8',e:'🔵'},{n:'Audi R8',e:'⚪'},{n:'Koenigsegg Jesko',e:'🟢'},
    {n:'Pagani Huayra',e:'🥈'},{n:'Rolls Royce Ghost',e:'⬜'},{n:'Bentley Continental',e:'🟤'},
    {n:'Aston Martin DB11',e:'🟢'},{n:'Rimac Nevera',e:'⚡'},{n:'Tesla Roadster',e:'🔴'},
    {n:'Nissan GT-R',e:'⬛'},{n:'Toyota Supra',e:'🟠'},{n:'Mazda RX-7',e:'🔴'},
    {n:'Ferrari 458',e:'🔴'},{n:'Lamborghini Huracan',e:'🟡'},{n:'McLaren 720S',e:'🟠'},
    {n:'Ferrari LaFerrari',e:'🔴'},{n:'McLaren Senna',e:'🟠'},{n:'Bugatti Divo',e:'🔵'},
    {n:'Porsche 918',e:'⚫'},{n:'Ferrari Enzo',e:'🔴'},{n:'McLaren F1',e:'🟠'},
    {n:'Ferrari F40',e:'🔴'},{n:'Porsche Carrera GT',e:'⚫'},{n:'Koenigsegg Agera',e:'🟢'}
  ]},
  {nameKey:'catClubs',cards:[
    {n:'Omnia Dubai',e:'🌃'},{n:'Pacha Ibiza',e:'🏝️'},{n:'Berghain Berlin',e:'⬛'},
    {n:'Fabric London',e:'🇬🇧'},{n:'Amnesia Ibiza',e:'🌊'},{n:'DC10 Ibiza',e:'🎵'},
    {n:'Marquee NYC',e:'🗽'},{n:'LIV Miami',e:'🌴'},{n:'E11even Miami',e:'🔥'},
    {n:'Hakkasan Vegas',e:'🎰'},{n:'Omnia Vegas',e:'💎'},{n:'XS Vegas',e:'✨'},
    {n:'Womb Tokyo',e:'🎌'},{n:'Zuma Dubai',e:'🌟'},{n:'White Dubai',e:'⬜'},
    {n:'Ministry of Sound',e:'🔊'},{n:'Tresor Berlin',e:'💎'},{n:'Watergate Berlin',e:'🌊'},
    {n:'Printworks London',e:'🖨️'},{n:'Output Brooklyn',e:'🗽'}
  ]},
  {nameKey:'catPalaces',cards:[
    {n:'قصر بكنغهام',en:'Buckingham Palace',e:'👑'},
    {n:'قصر فرساي',en:'Palace of Versailles',e:'🌹'},
    {n:'قصر الحمراء',en:'Alhambra Palace',e:'🌺'},
    {n:'قصر نويشفانشتاين',en:'Neuschwanstein Castle',e:'❄️'},
    {n:'قصر توبكابي',en:'Topkapi Palace',e:'🌙'},
    {n:'قصر الكرملين',en:'Kremlin Palace',e:'⭐'},
    {n:'قصر شينبرون',en:'Schönbrunn Palace',e:'🟡'},
    {n:'قصر موناكو',en:'Monaco Palace',e:'🎰'},
    {n:'قصر مدريد',en:'Royal Palace Madrid',e:'🔴'},
    {n:'قصر براغ',en:'Prague Castle',e:'🧙'},
    {n:'قصر دبي',en:'Dubai Palace',e:'🏙️'},
    {n:'قصر أبوظبي',en:'Abu Dhabi Palace',e:'🕌'},
    {n:'قصر الرياض',en:'Riyadh Palace',e:'🌴'},
    {n:'قصر القاهرة',en:'Cairo Palace',e:'🏺'},
    {n:'قصر إسطنبول',en:'Istanbul Palace',e:'🌙'},
    {n:'قصر طوكيو',en:'Tokyo Imperial Palace',e:'🌸'},
    {n:'قصر كيوتو',en:'Kyoto Palace',e:'⛩️'},
    {n:'قصر بكين',en:'Beijing Palace',e:'🐉'},
    {n:'قصر لندن',en:'London Palace',e:'👑'},
    {n:'قصر باريس',en:'Paris Palace',e:'🗼'}
  ]},
  // Season 1 Limited Cards
  {nameKey:'catLimited',cards:[
    {n:'Dragon Emperor',en:'Dragon Emperor',e:'🐉'},
    {n:'Crystal Phoenix',en:'Crystal Phoenix',e:'🦅'},
    {n:'Shadow Reaper',en:'Shadow Reaper',e:'💀'},
    {n:'Solar God',en:'Solar God',e:'☀️'},
    {n:'Thunder Zeus',en:'Thunder Zeus',e:'⚡'},
    {n:'Neon Samurai',en:'Neon Samurai',e:'⚔️'},
    {n:'Cosmic Witch',en:'Cosmic Witch',e:'🔮'},
    {n:'Ice Queen',en:'Ice Queen',e:'❄️'},
    {n:'Desert Sultan',en:'Desert Sultan',e:'🏜️'},
    {n:'Ocean Master',en:'Ocean Master',e:'🌊'},
    {n:'Sky Pegasus',en:'Sky Pegasus',e:'🐎'},
    {n:'Void Walker',en:'Void Walker',e:'🌌'}
  ]},
  // ====== VIP2 CARDS (Category 5) — REC mining only, 5 REC/s at max ======
  {nameKey:'catVip2',cards:[
    {n:'Galactic Emperor',en:'Galactic Emperor',e:'👑'},
    {n:'Nebula Goddess',en:'Nebula Goddess',e:'🌸'},
    {n:'Quantum Titan',en:'Quantum Titan',e:'⚛️'},
    {n:'Stellar Phoenix',en:'Stellar Phoenix',e:'🌟'},
    {n:'Dark Matter Lord',en:'Dark Matter Lord',e:'🌑'},
    {n:'Aurora Valkyrie',en:'Aurora Valkyrie',e:'🌈'},
    {n:'Supernova King',en:'Supernova King',e:'💥'},
    {n:'Cosmic Oracle',en:'Cosmic Oracle',e:'🔭'},
    {n:'Singularity Beast',en:'Singularity Beast',e:'🌀'},
    {n:'Event Horizon',en:'Event Horizon',e:'🕳️'},
    {n:'Pulsar Guardian',en:'Pulsar Guardian',e:'💫'},
    {n:'Quasar Empress',en:'Quasar Empress',e:'✨'},
    {n:'Hypernova Sage',en:'Hypernova Sage',e:'🧿'},
    {n:'Magnetar Warrior',en:'Magnetar Warrior',e:'🧲'},
    {n:'Celestial Warlord',en:'Celestial Warlord',e:'⚔️'},
    {n:'Photon Assassin',en:'Photon Assassin',e:'💡'},
    {n:'Gravity Master',en:'Gravity Master',e:'🌍'},
    {n:'Plasma Overlord',en:'Plasma Overlord',e:'🔥'},
    {n:'Anti-Matter God',en:'Anti-Matter God',e:'♾️'},
    {n:'Universe Creator',en:'Universe Creator',e:'🌌'}
  ]}
];

function buildCards(){
  categories.forEach(function(cat,ci){
    var grid=document.getElementById('cat-'+ci);if(!grid)return;
    grid.innerHTML='';
    cat.cards.forEach(function(card,idx){
      var key=ci+'_'+idx;
      if(!cardLevels[key])cardLevels[key]=0;
      var div=document.createElement('div');
      div.className='card-item';div.id='citem_'+key;
      div.setAttribute('data-ci',ci);div.setAttribute('data-idx',idx);
      div.onclick=function(){openCard(+this.getAttribute('data-ci'),+this.getAttribute('data-idx'));};
      renderCardGridItem(div,key,card);
      grid.appendChild(div);
    });
  });
}

// Card background gradients per category
var catGradients = [
  // Anime - purple/blue fantasy
  ['135deg,#1a0a2e,#0d1a3a','135deg,#2a0a3e,#0a1a4a','135deg,#1a1a3e,#0a0a2e'],
  // Cars - dark racing  
  ['135deg,#1a0a00,#2a1500','135deg,#0a1500,#001a05','135deg,#00101a,#001525'],
  // Clubs - neon night
  ['135deg,#1a0025,#250015','135deg,#001a25,#001525','135deg,#1a1500,#251000'],
  // Palaces - royal gold
  ['135deg,#1a1500,#2a2000','135deg,#1a0a00,#2a1000','135deg,#001a1a,#002020']
];

function getCardBg(ci, idx) {
  var grads = catGradients[ci] || catGradients[0];
  return grads[idx % grads.length];
}

function getCardRarity(lvl) {
  if(lvl >= 75) return {color:'#FF4400', glow:'rgba(255,68,0,0.6)',  border:'#FF4400'};
  if(lvl >= 50) return {color:'#CC00FF', glow:'rgba(180,0,255,0.5)', border:'#CC00FF'};
  if(lvl >= 25) return {color:'#0099FF', glow:'rgba(0,150,255,0.5)', border:'#0099FF'};
  if(lvl >= 10) return {color:'#00CC66', glow:'rgba(0,200,100,0.4)', border:'#00CC66'};
  if(lvl >= 1)  return {color:'#888',    glow:'rgba(100,100,100,0.3)', border:'#555'};
  return              {color:'#333',    glow:'transparent',            border:'#222'};
}

function getCardName(card) {
  if(currentLang === 'ar') return card.n || card.en;
  return card.en || card.n;
}

function formatCost(cost) {
  if(cost >= 1e9) return (cost/1e9).toFixed(1)+'B';
  if(cost >= 1e6) return (cost/1e6).toFixed(1)+'M';
  if(cost >= 1e3) return (cost/1e3).toFixed(1)+'K';
  return Math.floor(cost).toString();
}

// Long press detection
var lpTimer = null;

function startLongPress(ci, idx) {
  lpTimer = setTimeout(function(){ showCardInfo(ci, idx); }, 600);
}
function cancelLongPress() {
  if(lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
}

function showCardInfo(ci, idx) {
  var key = ci+'_'+idx;
  var card = categories[ci].cards[idx];
  var lvl = cardLevels[key]||0;
  var isLimited = ci === 4;
  var isVip2 = ci === 5;
  var multi = isLimited ? 3 : 1;
  var recRec = isVip2 ? 0 : cardRecordSpeed(lvl) * multi;
  var recSpd = isVip2 ? vipCardRECSpeed(lvl) : cardRECSpeed(lvl) * multi;
  var name = getCardName(card);

  function closePopup(e) {
    if(e){ e.stopPropagation(); e.preventDefault(); }
    if(overlay.parentElement) overlay.remove();
    if(popup.parentElement) popup.remove();
  }

  // Dark overlay
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9998;';
  overlay.addEventListener('click', closePopup);
  overlay.addEventListener('touchend', closePopup);

  // Show info popup
  var popup = document.createElement('div');
  popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(5,5,20,0.97);border:1px solid rgba(255,255,255,0.15);border-radius:18px;padding:20px;width:75vw;max-width:280px;z-index:9999;text-align:center;backdrop-filter:blur(15px);box-shadow:0 0 40px rgba(0,0,0,0.8);';
  popup.addEventListener('click', function(e){ e.stopPropagation(); });
  popup.addEventListener('touchend', function(e){ e.stopPropagation(); });

  popup.innerHTML =
    '<div style="font-size:36px;margin-bottom:8px;">'+card.e+'</div>'+
    '<div style="font-size:16px;font-weight:bold;color:white;margin-bottom:12px;">'+name+'</div>'+
    '<div style="background:rgba(255,0,0,0.1);border:1px solid rgba(255,0,0,0.2);border-radius:10px;padding:10px;margin-bottom:8px;">'+
      '<div style="font-size:11px;color:#aaa;margin-bottom:4px;">⚡ RECORD/s</div>'+
      '<div style="font-size:18px;color:#FF6644;font-family:Orbitron,sans-serif;">'+Math.floor(recRec)+'</div>'+
    '</div>'+
    '<div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);border-radius:10px;padding:10px;margin-bottom:8px;">'+
      '<div style="font-size:11px;color:#aaa;margin-bottom:4px;">🟢 REC/s</div>'+
      '<div style="font-size:18px;color:#00FF88;font-family:Orbitron,sans-serif;">'+recSpd.toFixed(8)+'</div>'+
    '</div>'+
    '<div style="font-size:12px;color:#aaa;margin-bottom:14px;">Level '+lvl+' / 100</div>'+
    '<button id="cardInfoOkBtn" style="background:linear-gradient(135deg,#CC0000,#FF2200);border:none;color:white;padding:8px 24px;border-radius:10px;cursor:pointer;font-size:13px;">OK</button>';

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  var okBtn = document.getElementById('cardInfoOkBtn');
  if(okBtn){
    okBtn.addEventListener('click', closePopup);
    okBtn.addEventListener('touchend', closePopup);
  }
}

function directUpgrade(ci, idx, event) {
  if(event) event.stopPropagation();
  cancelLongPress();
  var key = ci+'_'+idx;
  var lvl = cardLevels[key]||0;
  if(lvl >= 100){ showToast(t('cardMaxLevel')); return; }
  var upg = cardUpgrades[key];
  if(upg && upg.endTime > Date.now()){ showToast(t('toastAlreadyUpgrading')); return; }
  var cost = cardCost(lvl, ci===4);
  // VIP2 20% discount (2-minute window, non-VIP cards only)
  var isVip2Active = vipData && parseInt(vipData.tier||0) >= 2 && parseInt(vipData.expiry||0) > Date.now();
  if(isVip2Active && vipData.discountExpiry && vipData.discountExpiry > Date.now()) {
    cost = Math.floor(cost * 0.8);
  }
  if(record < cost){ showToast('⛔ ' + t('toastNotEnoughRecord')); return; }
  record -= cost;
  var wait = cardWait(lvl);
  cardUpgrades[key] = { endTime: Date.now() + wait*1000, toLevel: lvl+1 };
  if(typeof addXP==='function') addXP(xpForCardUpgrade ? xpForCardUpgrade(lvl) : 50);
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  dailyTasksData.upgrades++; dailyTasksData.spent+=cost;
  checkDailyTaskProgress(); checkCardMissions();
  saveData(true); updateUI();
  updateCardGridItem(key);
  showToast('⏳ ' + formatWait(wait));
}

function renderCardGridItem(div, key, card) {
  var isVip2 = parseInt(key.split('_')[0]) === 5;
  var ci = parseInt(key.split('_')[0]);
  var idx = parseInt(key.split('_')[1]);
  var lvl = cardLevels[key]||0;
  var upg = cardUpgrades[key];
  var now = Date.now();
  var isUpgrading = upg && upg.endTime > now;
  var rem = isUpgrading ? Math.max(0, Math.ceil((upg.endTime-now)/1000)) : 0;
  var recRec = cardRecordSpeed(lvl);
  var isLimited = ci === 4;
  var baseCost = isVip2 ? vipCardCost(lvl) : cardCost(lvl, isLimited);
  var discountActive = !isVip2 && vipData && parseInt(vipData.tier||0) >= 2 && parseInt(vipData.expiry||0) > Date.now() && vipData.discountExpiry && vipData.discountExpiry > Date.now();
  var cost = discountActive ? Math.floor(baseCost * 0.8) : baseCost;
  var rarity = getCardRarity(lvl);
  var cardName = getCardName(card);
  var bg = getCardBg(ci, idx);
  var canUpgrade = record >= cost && lvl < 100 && !isUpgrading;
  var multi = isLimited ? 3 : 1;
  var boostedRec = isVip2 ? 0 : recRec * multi; // VIP2 doesn't give RECORD
  var vip2Rec = isVip2 ? vipCardRECSpeed(lvl) : 0;

  div.style.cssText = 'background:linear-gradient('+bg+');border:1px solid '+(lvl>0?rarity.border:'#1a1a2a')+';border-radius:16px;overflow:hidden;cursor:pointer;position:relative;'+
    (lvl>0?'box-shadow:0 0 20px '+rarity.glow+';':'');

  div.ontouchstart = null;
  div.ontouchend = null;
  div.ontouchmove = null;
  div.onmousedown = null;
  div.onmouseup = null;
  div.onclick = function(e){ showCardInfo(ci, idx); };

  div.innerHTML =
    // Image area with emoji
    '<div style="height:100px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;">'+
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 60%, '+rarity.glow+', transparent 70%);"></div>'+
      '<div style="font-size:52px;position:relative;filter:drop-shadow(0 4px 12px '+rarity.glow+');">'+card.e+'</div>'+
      (lvl>0?'<div style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.7);border:1px solid '+rarity.border+';border-radius:6px;padding:1px 6px;font-size:9px;color:'+rarity.color+';font-family:Orbitron,sans-serif;">'+lvl+'</div>':'')+
      (isLimited?'<div style="position:absolute;top:6px;left:6px;background:rgba(255,215,0,0.2);border:1px solid #FFD700;border-radius:6px;padding:1px 5px;font-size:8px;color:#FFD700;">3x</div>':'')+
    '</div>'+
    // Name
    '<div style="padding:0 6px 4px;text-align:center;">'+
      '<div style="font-size:11px;color:#ddd;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;">'+cardName+'</div>'+
      // Mining speed or status
      (lvl > 0
        ? (isVip2
            ? '<div style="font-size:9px;color:#00CFFF;margin-bottom:5px;">💎 '+vip2Rec.toFixed(4)+' REC/s</div>'
            : '<div style="font-size:9px;color:#00FF88;margin-bottom:5px;">⚡ '+Math.floor(boostedRec)+' R/s'+(isLimited?' <span style="color:#FFD700;">×3</span>':'')+'</div>')
        : '<div style="font-size:9px;color:#444;margin-bottom:5px;">⛔ No mining</div>')+
      // Upgrade button
      (lvl >= 100
        ? '<div style="background:rgba(255,215,0,0.15);border:1px solid #FFD700;border-radius:8px;padding:4px;font-size:9px;color:#FFD700;text-align:center;">MAX ✅</div>'
        : isUpgrading
          ? '<div id="timer_'+key+'" style="background:rgba(255,200,0,0.15);border:1px solid #FFD700;border-radius:8px;padding:4px;font-size:9px;color:#FFD700;text-align:center;">⏳ '+formatWait(rem)+'</div>'
          : '<button onclick="directUpgrade('+ci+','+idx+',event)" style="width:100%;background:'+(canUpgrade?'linear-gradient(135deg,#CC0000,#FF2200)':'rgba(30,30,30,0.8)')+';border:1px solid '+(canUpgrade?'#FF4444':'#333')+';border-radius:8px;padding:4px 2px;font-size:9px;color:'+(canUpgrade?'white':'#555')+';cursor:'+(canUpgrade?'pointer':'not-allowed')+';font-weight:bold;">'+
            (discountActive
              ? (lvl===0?'🔓 ':'⬆️ ')+'<span style="text-decoration:line-through;opacity:0.5;font-size:8px;">'+formatCost(baseCost)+'</span> <span style="color:#FFD700;">'+formatCost(cost)+'</span> REC'
              : (lvl===0?'🔓 ':'⬆️ ')+formatCost(cost)+' REC')+
            '</button>')+
    '</div>';
}

function updateCardGridItem(key){
  var div=document.getElementById('citem_'+key);if(!div)return;
  var parts=key.split('_');
  var ci=parseInt(parts[0]),idx=parseInt(parts[1]);
  var card=categories[ci]&&categories[ci].cards[idx];
  if(card)renderCardGridItem(div,key,card);
}

function openCard(ci,idx){
  var key=ci+'_'+idx;
  var card=categories[ci].cards[idx];
  var lvl=cardLevels[key]||0;
  var upg=cardUpgrades[key];
  var now=Date.now();
  var isUpgrading=upg&&upg.endTime>now;
  var cost=cardCost(lvl);
  var wait=cardWait(lvl);
  var canUpgrade=!isUpgrading&&record>=cost&&lvl<100;
  var recRec=cardRecordSpeed(lvl);
  var recSpd=cardRECSpeed(lvl);
  var nextRecRec=isVip2?0:(lvl<100?cardRecordSpeed(lvl+1)*multi:0);
  var nextRecSpd=isVip2?(lvl<100?vipCardRECSpeed(lvl+1):0):(lvl<100?cardRECSpeed(lvl+1)*multi:0);
  var rem=isUpgrading?Math.max(0,Math.ceil((upg.endTime-now)/1000)):0;

  document.getElementById('cardDetail').innerHTML=
    '<div style="text-align:center;margin-bottom:15px;">'+
      '<div style="font-size:70px;">'+card.e+'</div>'+
      '<div style="font-size:20px;margin:8px 0;">'+card.n+'</div>'+
      '<div style="color:#FF0000;font-size:15px;">'+t('cardLevel')+' '+lvl+' / 100</div>'+
    '</div>'+
    // Current mining
    '<div class="info-card" style="margin-bottom:8px;">'+
      '<div style="color:#aaa;font-size:11px;margin-bottom:6px;">⛏️ '+t('cardMiningBonus')+'</div>'+
      '<div style="display:flex;justify-content:space-between;">'+
        '<div style="text-align:center;flex:1;border-right:1px solid #333;">'+
          '<div style="color:#FF0000;font-size:14px;font-weight:bold;">'+Math.floor(recRec).toLocaleString()+'</div>'+
          '<div style="color:#aaa;font-size:10px;">RECORD/s</div>'+
        '</div>'+
        '<div style="text-align:center;flex:1;">'+
          '<div style="color:#00FF88;font-size:14px;font-weight:bold;">'+recSpd.toFixed(8)+'</div>'+
          '<div style="color:#aaa;font-size:10px;">REC/s</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    // Next level preview
    (lvl<100?
    '<div class="info-card" style="margin-bottom:8px;border-color:#333;">'+
      '<div style="color:#aaa;font-size:11px;margin-bottom:6px;">⬆️ '+t('cardLevel')+' '+(lvl+1)+' '+t('cardMiningBonus')+'</div>'+
      '<div style="display:flex;justify-content:space-between;">'+
        '<div style="text-align:center;flex:1;border-right:1px solid #333;">'+
          '<div style="color:#FF6600;font-size:13px;">'+Math.floor(nextRecRec).toLocaleString()+'</div>'+
          '<div style="color:#aaa;font-size:10px;">RECORD/s</div>'+
        '</div>'+
        '<div style="text-align:center;flex:1;">'+
          '<div style="color:#88FF00;font-size:13px;">'+nextRecSpd.toFixed(8)+'</div>'+
          '<div style="color:#aaa;font-size:10px;">REC/s</div>'+
        '</div>'+
      '</div>'+
    '</div>':'')+
    // Upgrade section
    (lvl>=100?
      '<div style="text-align:center;color:#FFD700;padding:15px;">'+t('cardMaxLevel')+'</div>':
    isUpgrading?
      '<div class="info-card" style="text-align:center;border-color:#FFD700;">'+
        '<div style="color:#FFD700;font-size:14px;margin-bottom:5px;">'+t('upgrading')+'</div>'+
        '<div id="timer_modal_'+key+'" style="font-size:22px;font-family:Orbitron,sans-serif;color:#FFD700;">'+formatWait(rem)+'</div>'+
      '</div>':
      '<div class="info-card" style="margin-bottom:0;">'+
        '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">'+
          '<span style="color:#aaa;font-size:12px;">'+t('cardUpgradeCost')+'</span>'+
          '<span style="color:#FF0000;font-weight:bold;">'+cost.toLocaleString()+' RECORD</span>'+
        '</div>'+
        '<div style="display:flex;justify-content:space-between;margin-bottom:10px;">'+
          '<span style="color:#aaa;font-size:12px;">'+t('cardWaitTime')+'</span>'+
          '<span style="color:#FFD700;">⏳ '+formatWait(wait)+'</span>'+
        '</div>'+
        '<button class="do-btn"'+(canUpgrade?'':' disabled')+
          ' onclick="upgradeCard('+ci+','+idx+')" style="margin-top:0;">'+
          t('cardUpgradeBtn')+' → '+cost.toLocaleString()+' RECORD'+
        '</button>'+
        (!canUpgrade&&record<cost?'<div style="color:#FF4444;font-size:11px;text-align:center;margin-top:6px;">'+
          'تحتاج '+(cost-Math.floor(record)).toLocaleString()+' RECORD إضافي</div>':'')+'</div>');

  document.getElementById('cardModal').classList.add('open');

  // Start modal timer if upgrading
  if(isUpgrading){
    clearInterval(window._modalTimer);
    window._modalTimer=setInterval(function(){
      var r=Math.max(0,Math.ceil((upg.endTime-Date.now())/1000));
      var el=document.getElementById('timer_modal_'+key);
      if(el)el.textContent=r<=0?t('upgradeReady'):formatWait(r);
      if(r<=0)clearInterval(window._modalTimer);
    },1000);
  }
}

function upgradeCard(ci,idx){
  var key=ci+'_'+idx;
  var lvl=cardLevels[key]||0;
  if(lvl>=100){return;}
  if(cardUpgrades[key]&&cardUpgrades[key].endTime>Date.now()){showToast(t('toastAlreadyUpgrading'));return;}
  var cost=cardCost(lvl);
  if(record<cost){showToast(t('toastNotEnoughRecord'));return;}
  record-=cost;
  var wait=cardWait(lvl);
  cardUpgrades[key]={endTime:Date.now()+wait*1000,toLevel:lvl+1};
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  dailyTasksData.upgrades++; dailyTasksData.spent+=cost;
  checkDailyTaskProgress(); checkCardMissions();
  checkComboOnUpgrade(key);  // Check if this card is part of daily combo
  saveData(true); updateUI(); updateCardGridItem(key);
  document.getElementById('cardModal').classList.remove('none');
  openCard(ci,idx);
  showToast(t('toastUpgradeStart')+' ⏳ '+formatWait(wait));
}

// VIP2 category — locked for non-VIP2 users
function showVip2Category(btn) {
  var isAdminUser = tgUser && String(tgUser.id) === '6995765586';
  var isVip2User = vipData && parseInt(vipData.tier||0) >= 2 && parseInt(vipData.expiry||0) > Date.now();
  document.querySelectorAll('.cat-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  for(var i=0;i<=4;i++){
    var g=document.getElementById('cat-'+i);
    if(g) g.style.display='none';
  }
  var lock=document.getElementById('vip2-lock-msg');
  var grid=document.getElementById('cat-5');
  if(isVip2User){
    if(lock) lock.style.display='none';
    if(grid){ grid.style.display=''; buildCards(5); }
  } else {
    if(grid) grid.style.display='none';
    if(lock) lock.style.display='block';
  }
}

function showCategory(idx,btn){
  document.querySelectorAll('.card-grid').forEach(function(g){g.style.display='none';});
  document.querySelectorAll('.cat-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById('cat-'+idx).style.display='grid';
  btn.classList.add('active');
}

// ====== TASKS ======
function joinAndWait(type,joinBtnId,claimBtnId){
  if(type==='telegram')window.Telegram.WebApp.openTelegramLink('https://t.me/Momokh1');
  else window.Telegram.WebApp.openLink('https://x.com/mohamma33122570');
  var jb=document.getElementById(joinBtnId),cb=document.getElementById(claimBtnId);
  if(!jb||!cb)return;
  jb.disabled=true;var sec=30;jb.textContent='⏳ '+sec+'s...';
  var timer=setInterval(function(){sec--;jb.textContent='⏳ '+sec+'s...';
    if(sec<=0){clearInterval(timer);jb.style.display='none';cb.disabled=false;}},1000);
}
function claimTask(type,btnId,joinBtnId){
  if(completedTasks.indexOf(type)!==-1){showToast(t('toastAlready'));return;}
  completedTasks.push(type);record+=10000;
  var btn=document.getElementById(btnId);
  if(btn){btn.textContent=t('taskDone');btn.disabled=true;btn.classList.add('done');}
  var jb=document.getElementById(joinBtnId);if(jb)jb.style.display='none';
  saveData();updateUI();showToast(t('toastTask'));
}
function restoreTasksUI(){
  ['telegram','twitter'].forEach(function(type,i){
    if(completedTasks.indexOf(type)!==-1){
      var b=document.getElementById('task'+(i+1)+'Btn');
      if(b){b.textContent=t('taskDone');b.disabled=true;b.classList.add('done');}
      var j=document.getElementById('task'+(i+1)+'JoinBtn');if(j)j.style.display='none';
    }
  });
}

// ====== MILESTONES ======
var refMilestones=[{req:5,reward:5},{req:10,reward:15},{req:30,reward:50},{req:50,reward:100},{req:100,reward:500}];
function buildMilestones(){
  var cont=document.getElementById('milestonesContainer');if(!cont)return;
  cont.innerHTML='';
  refMilestones.forEach(function(m,i){
    var claimed=claimedMilest.indexOf(i)!==-1;
    var canClaim=!claimed&&refCount>=m.req;
    var pct=Math.min(100,Math.round((refCount/m.req)*100));
    var card=document.createElement('div');
    card.style.cssText='background:#161616;border:1px solid '+(claimed?'#1a5c1a':canClaim?'#FF0000':'#2a2a2a')+';border-radius:12px;padding:12px 14px;margin-bottom:9px;';
    var badge=claimed?'<div style="background:#1a4a1a;color:#4eff4e;padding:5px 12px;border-radius:8px;font-size:12px;">✅</div>':
      canClaim?'<button onclick="claimMilestone('+i+')" style="background:#FF0000;border:none;color:white;padding:5px 13px;border-radius:8px;font-size:12px;cursor:pointer;font-weight:bold;">'+t('claimBtn')+'</button>':
      '<div style="color:#555;font-size:11px;">'+refCount+' / '+m.req+'</div>';
    card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:'+(claimed?'0':'8px')+';">'+
      '<div><div style="font-size:13px;color:'+(claimed?'#4eff4e':'white')+';">'+t('inviteN',{n:m.req})+'</div>'+
      '<div style="font-size:12px;color:#00FF88;margin-top:3px;">🟢 + '+m.reward+' REC</div></div>'+badge+'</div>'+
      (!claimed?'<div style="background:#2a2a2a;border-radius:6px;height:5px;overflow:hidden;"><div style="width:'+pct+'%;height:100%;background:'+(canClaim?'#FF0000':'linear-gradient(90deg,#FF0000,#ff6600)')+';border-radius:6px;"></div></div>':'');
    cont.appendChild(card);
  });
  var rd=document.getElementById('refCountDisplay');if(rd)rd.textContent=refCount;
}
function claimMilestone(i){
  if(claimedMilest.indexOf(i)!==-1)return;
  if(refCount<refMilestones[i].req){showToast(t('toastNotMet'));return;}
  claimedMilest.push(i);rec+=refMilestones[i].reward;
  saveData();buildMilestones();updateUI();
  showToast(t('toastClaimed',{n:refMilestones[i].reward}));
}

// ====== INVITE ======
function copyInvite(){
  var userId=tgUser?tgUser.id:'0';
  var link='https://t.me/RecMiningGame_bot?start=ref'+userId;
  if(navigator&&navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(link).then(function(){showToast(t('toastCopied'));}).catch(function(){showToast('🔗 '+link);});
  }else{showToast('🔗 '+link);}
}
function shareInvite(){
  var userId=tgUser?tgUser.id:'0';
  var link='https://t.me/RecMiningGame_bot?start=ref'+userId;
  window.Telegram.WebApp.openTelegramLink('https://t.me/share/url?url='+encodeURIComponent(link)+'&text='+encodeURIComponent('🔴 REC Mining\n\n👇'));
}

// ====== STARS SHOP ======
function openStarsShop() {
  var items = [
    { title:t('shopEnergy'),    desc:t('shopEnergyDesc'),    price:'15',  color:'#FFD700', key:'energy' },
    { title:t('shopRecord500'), desc:t('shopRecord500Desc'), price:'50',  color:'#FFD700', key:'record_500k' },
    { title:t('shopRecord3m'),  desc:t('shopRecord3mDesc'),  price:'200', color:'#FF0000', key:'record_3m' },
    { title:t('shopSkip'),      desc:t('shopSkipDesc'),      price:'100', color:'#00BFFF', key:'skip_timer' }
  ];

  var html = '<div style="text-align:center;margin-bottom:20px;">' +
    '<div style="font-size:40px;">⭐</div>' +
    '<div style="font-size:18px;font-weight:bold;margin:8px 0;">' + t('shopTitle') + '</div>' +
    '<div style="color:#aaa;font-size:12px;">' + t('shopSubtitle') + '</div>' +
    '</div>';

  items.forEach(function(item) {
    html += '<div style="background:#1a1a1a;border:1px solid ' + item.color + ';border-radius:12px;padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="buyWithStars(\'' + item.key + '\')"> ' +
      '<div>' +
        '<div style="font-size:15px;">' + item.title + '</div>' +
        '<div style="color:#aaa;font-size:11px;margin-top:3px;">' + item.desc + '</div>' +
      '</div>' +
      '<div style="background:' + item.color + ';color:#000;padding:6px 14px;border-radius:20px;font-weight:bold;font-size:13px;">' + item.price + ' ⭐</div>' +
    '</div>';
  });

  html += '<div style="color:#555;font-size:10px;text-align:center;margin-top:10px;">' + t('shopNote') + '</div>';

  document.getElementById('cardDetail').innerHTML = html;
  document.getElementById('cardModal').classList.add('open');
}

function buyWithStars(product) {
  showToast(t('toastInvoiceLoading'));
  fetch('/api/create-invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: product })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (!data.link) { showToast('❌ Error'); return; }
    // Open payment screen DIRECTLY inside the mini app
    window.Telegram.WebApp.openInvoice(data.link, function(status) {
      if (status === 'paid') {
        showToast(t('toastPaid'));
        setTimeout(function() { checkServerRewards(); }, 2500);
      } else if (status === 'cancelled') {
        showToast(t('toastCancelled'));
      } else if (status === 'failed') {
        showToast(t('toastFailed'));
      }
    });
  })
  .catch(function() { showToast(t('toastConnError')); });
}

function checkServerRewards() {
  if(!tgUser) return;
  loadFromServer(function(serverData) {
    if(!serverData) return;
    if(serverData.energyRefill && serverData.energyRefill > (window._lastEnergyRefill||0)) {
      window._lastEnergyRefill = serverData.energyRefill;
      energy = maxEnergy;
      showToast('⚡ تم شحن طاقتك!');
      saveData(); updateUI();
    }
    if(serverData.record > record) {
      record = serverData.record;
      showToast('💰 تمت إضافة RECORD لرصيدك!');
      saveData(); updateUI();
    }
    if(serverData.cardUpgrades && Object.keys(serverData.cardUpgrades).length === 0 &&
       Object.keys(cardUpgrades).length > 0) {
      cardUpgrades = {};
      buildCards(); calcTotalSpeeds();
      showToast('🚀 تم تخطي أوقات الانتظار!');
      saveData(); updateUI();
    }
  });
}

try { window.Telegram.WebApp.onEvent('activated', checkServerRewards); } catch(e) {}

// ====== AVATAR HELPER ======
var avatarCache = {};

function makeImgTag(url, size) {
  var s = 'width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;flex-shrink:0;';
  return '<img src="' + url + '" style="' + s + '">';
}

function makeFallback(name, size) {
  var initial = (name||'?')[0].toUpperCase();
  return '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:#1a0000;border:2px solid #FF0000;display:flex;align-items:center;justify-content:center;font-size:' + Math.floor(size*0.4) + 'px;font-weight:bold;color:#FF0000;flex-shrink:0;">' + initial + '</div>';
}

function getAvatar(telegramId, name, size, callback) {
  size = size || 40;
  if (avatarCache[telegramId] === 'none') { callback(makeFallback(name, size)); return; }
  if (avatarCache[telegramId]) { callback(makeImgTag(avatarCache[telegramId], size)); return; }
  var url = '/api/photo/' + telegramId;
  var img = new Image();
  img.onload = function() { avatarCache[telegramId] = url; callback(makeImgTag(url, size)); };
  img.onerror = function() { avatarCache[telegramId] = 'none'; callback(makeFallback(name, size)); };
  img.src = url;
}

function loadProfilePhoto() {
  if (!tgUser) return;
  getAvatar(tgUser.id, tgUser.first_name, 80, function(html) {
    var el = document.getElementById('profileAvatar');
    if (el) el.outerHTML = html;
  });
}

// ====== WITHDRAWAL ======
var WITHDRAW_FEE = 70;
var MIN_WITHDRAW = 500;
var DAILY_LIMIT  = 10000;

function openWithdraw() {
  if (!tgUser) { showToast('❌ يجب فتح البوت من تيليغرام'); return; }
  var walletEl = document.getElementById('walletBtn');
  var walletAddr = walletEl ? walletEl.getAttribute('data-raw') : '';
  if (!walletAddr) {
    showToast('❌ ربط محفظة TON أولاً!');
    document.getElementById('cardModal').classList.remove('open');
    return;
  }

  var todayKey = 'wd_' + new Date().toISOString().split('T')[0];
  var dailyUsed = 0;
  try { dailyUsed = parseInt(localStorage.getItem(todayKey) || '0'); } catch(e){}
  var remaining = DAILY_LIMIT - dailyUsed;

  document.getElementById('cardDetail').innerHTML =
    '<div style="text-align:center;margin-bottom:20px;">' +
      '<div style="font-size:40px;">🏛️</div>' +
      '<div style="font-size:18px;font-weight:bold;margin:8px 0;">' + t('withdrawTitle') + '</div>' +
      '<div style="color:#aaa;font-size:12px;">' + t('withdrawSubtitle') + '</div>' +
    '</div>' +
    '<div class="info-card" style="margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">' +
        '<span style="color:#aaa;font-size:12px;">' + t('withdrawBalance') + '</span>' +
        '<span style="color:#00FF88;font-weight:bold;">' + rec.toFixed(4) + ' REC</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">' +
        '<span style="color:#aaa;font-size:12px;">' + t('withdrawMin') + '</span>' +
        '<span>' + MIN_WITHDRAW + ' REC</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">' +
        '<span style="color:#aaa;font-size:12px;">' + t('withdrawFee') + '</span>' +
        '<span style="color:#FFD700;">' + WITHDRAW_FEE + ' REC</span>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;">' +
        '<span style="color:#aaa;font-size:12px;">' + t('withdrawDaily') + '</span>' +
        '<span>' + remaining + ' / ' + DAILY_LIMIT + ' REC</span>' +
      '</div>' +
    '</div>' +
    '<div class="info-card" style="margin-bottom:10px;">' +
      '<div style="color:#aaa;font-size:11px;margin-bottom:6px;">' + t('withdrawAmount') + '</div>' +
      '<input id="withdrawAmount" type="number" min="' + MIN_WITHDRAW + '" max="' + Math.min(rec, remaining) + '" ' +
        'value="' + Math.min(Math.floor(rec), remaining, DAILY_LIMIT) + '" ' +
        'style="width:100%;background:#0a0a0a;border:1px solid #333;color:white;padding:10px;border-radius:8px;font-size:16px;" ' +
        'oninput="updateWithdrawPreview()">' +
      '<div id="withdrawPreview" style="margin-top:8px;color:#00FF88;font-size:13px;text-align:center;"></div>' +
    '</div>' +
    '<div style="color:#aaa;font-size:11px;text-align:center;margin-bottom:10px;">📬 ' + walletAddr.slice(0,6) + '...' + walletAddr.slice(-6) + '</div>' +
    '<button class="do-btn" onclick="confirmWithdraw()" style="margin-top:0;">' + t('withdrawBtn') + '</button>';

  document.getElementById('cardModal').classList.add('open');
  updateWithdrawPreview();
}

function updateWithdrawPreview() {
  var input = document.getElementById('withdrawAmount');
  var preview = document.getElementById('withdrawPreview');
  if (!input || !preview) return;
  var amt = parseFloat(input.value) || 0;
  if (amt < MIN_WITHDRAW) {
    preview.style.color = '#FF4444';
    preview.textContent = t('withdrawMinErr',{n:MIN_WITHDRAW});
  } else {
    var net = amt - WITHDRAW_FEE;
    preview.style.color = '#00FF88';
    preview.textContent = t('withdrawReceive') + ' ' + net.toFixed(4) + ' REC (' + t('withdrawAfterFee') + ' ' + WITHDRAW_FEE + ' REC)';
  }
}

function confirmWithdraw() {
  var input = document.getElementById('withdrawAmount');
  var amount = parseFloat(input ? input.value : 0);
  if (isNaN(amount) || amount < MIN_WITHDRAW) { showToast(t('withdrawMinErr',{n:MIN_WITHDRAW})); return; }
  if (amount > rec) { showToast(t('withdrawLowBal')); return; }

  var btn = document.querySelector('#cardDetail .do-btn');
  if (btn) { btn.disabled = true; btn.textContent = t('withdrawLoading'); }

  fetch('/api/withdraw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId: tgUser.id, amount: amount })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      rec -= amount;
      // Track daily limit
      var todayKey = 'wd_' + new Date().toISOString().split('T')[0];
      try {
        var used = parseInt(localStorage.getItem(todayKey) || '0');
        localStorage.setItem(todayKey, used + amount);
      } catch(e){}
      saveData(true); updateUI();
      document.getElementById('cardModal').classList.remove('open');
      showToast(t('withdrawSuccess',{n:data.netAmount}));
    } else {
      if (btn) { btn.disabled = false; btn.textContent = t('withdrawBtn'); }
      var msgs = {'no_wallet':t('withdrawNoWallet'),'below_minimum':t('withdrawMinErr',{n:MIN_WITHDRAW}),'insufficient_balance':t('withdrawLowBal'),'daily_limit':t('withdrawDailyErr',{n:data.remaining||0})};
      showToast(msgs[data.error] || '❌ فشل السحب: ' + (data.error||''));
    }
  })
  .catch(function() {
    if (btn) { btn.disabled = false; btn.textContent = t('withdrawBtn'); }
    showToast(t('withdrawFailed'));
  });
}

// ====== RANK / LEADERBOARD ======
var currentTab = 'global';

function getMyMedal(){
  var medals=[
    {name:'Bronze',emoji:'🥉',color:'#CD7F32',min:0},
    {name:'Silver',emoji:'🥈',color:'#C0C0C0',min:1000000},
    {name:'Gold',emoji:'🥇',color:'#FFD700',min:100000000},
    {name:'Platinum',emoji:'💎',color:'#E5E4E2',min:1000000000},
    {name:'Diamond',emoji:'💠',color:'#00BFFF',min:5000000000},
    {name:'Legendary',emoji:'👑',color:'#FF0000',min:10000000000}
  ];
  for(var i=medals.length-1;i>=0;i--) if(record>=medals[i].min) return medals[i];
  return medals[0];
}

