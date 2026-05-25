// ==========================================
// REC Mining - app.js - CLEAN VERSION
// ==========================================

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

var tgUser = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user;
var saveKey = 'recmining_' + (tgUser ? tgUser.id : 'guest');
var CS = window.Telegram.WebApp.CloudStorage || null;

// ====== LOAD DATA ======
var defaultData = {
  record: 0, rec: 0, energy: 1000, maxEnergy: 1000,
  tapLevelVal: 0, energyLevelVal: 0, tapPowerVal: 1, miningSpeed: 0.000001,
  completedTasks: [], cardLevels: {}, refCount: 0, claimedMilest: []
};

var G = Object.assign({}, defaultData);
try {
  var ls = JSON.parse(localStorage.getItem(saveKey));
  if (ls) G = Object.assign({}, defaultData, ls);
} catch(e) {}

// Shortcuts
var record, rec, energy, maxEnergy, tapLevelVal, energyLevelVal,
    tapPowerVal, miningSpeed, completedTasks, cardLevels, refCount, claimedMilest;

function applyData(d) {
  record = d.record || 0;
  rec = d.rec || 0;
  energy = d.energy !== undefined ? d.energy : 1000;
  maxEnergy = d.maxEnergy || 1000;
  tapLevelVal = d.tapLevelVal || 0;
  energyLevelVal = d.energyLevelVal || 0;
  tapPowerVal = d.tapPowerVal || 1;
  miningSpeed = d.miningSpeed || 0.000001;
  completedTasks = d.completedTasks || [];
  cardLevels = d.cardLevels || {};
  refCount = d.refCount || 0;
  claimedMilest = d.claimedMilest || [];
}
applyData(G);

// Load from CloudStorage if available (more persistent on iOS)
if (CS) {
  CS.getItem('gameData', function(err, val) {
    if (!err && val) {
      try {
        var cd = JSON.parse(val);
        // Use cloud data if newer (higher record)
        if (!cd.record || cd.record >= record) {
          applyData(cd);
          updateUI();
          buildMilestones();
          restoreTasksUI();
        }
      } catch(e) {}
    }
  });
}

function saveData() {
  var d = JSON.stringify({
    record, rec, energy, maxEnergy,
    tapLevelVal, energyLevelVal, tapPowerVal, miningSpeed,
    completedTasks, cardLevels, refCount, claimedMilest
  });
  try { localStorage.setItem(saveKey, d); } catch(e) {}
  if (CS) { try { CS.setItem('gameData', d); } catch(e) {} }
}

// ====== TOAST ======
function showToast(msg) {
  var t = document.getElementById('toast-msg');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast-msg';
    t.style.cssText = [
      'position:fixed', 'bottom:75px', 'left:50%',
      'transform:translateX(-50%)',
      'background:rgba(30,30,30,0.95)',
      'color:white', 'padding:10px 22px',
      'border-radius:20px', 'font-size:14px',
      'z-index:9999', 'border:1px solid #444',
      'pointer-events:none', 'opacity:0',
      'transition:opacity 0.25s', 'white-space:nowrap'
    ].join(';');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(function() { t.style.opacity = '0'; }, 2200);
}

// ====== NAVIGATION ======
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

// ====== HOME ======
function tap() {
  if (energy <= 0) return;
  energy = Math.max(0, energy - tapPowerVal);
  record += tapPowerVal;
  saveData();
  updateUI();
}

setInterval(function() {
  rec += miningSpeed * 3;
  if (energy < maxEnergy) energy = Math.min(maxEnergy, energy + 5);
  saveData();
  updateUI();
}, 3000);

function updateUI() {
  var set = function(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; };
  set('recordCount', Math.floor(record).toLocaleString());
  set('recAmount', rec.toFixed(6));
  set('recMini', rec.toFixed(6));
  set('energyText', Math.floor(energy) + ' / ' + maxEnergy);
  set('miningSpeedShow', miningSpeed.toFixed(6));
  set('profileRecord', Math.floor(record).toLocaleString());
  set('recPoolBalance', rec.toFixed(6));
  var eb = document.getElementById('energyBar');
  if (eb) eb.style.width = (energy / maxEnergy * 100) + '%';
  var m = getMyMedal();
  var mrn = document.getElementById('myRankName');
  if (mrn) { mrn.textContent = m.name; mrn.style.color = m.color; }
  set('myRankRecord', Math.floor(record).toLocaleString());
  var rd = document.getElementById('refCountDisplay');
  if (rd) rd.textContent = refCount;
}

// ====== UPGRADE ======
function getTapCost(l) { return Math.floor(50 * Math.pow(2, Math.floor(l / 5))); }
function getEnergyCost(l) { return Math.floor(50 * Math.pow(2, Math.floor(l / 5))); }

function openUpgrade() { updateUpgradeUI(); document.getElementById('upgradePage').classList.add('open'); }

function upgradeTap() {
  var cost = getTapCost(tapLevelVal);
  if (record < cost || tapLevelVal >= 100) return;
  record -= cost; tapLevelVal++;
  tapPowerVal = 1 + Math.floor(tapLevelVal / 5);
  miningSpeed += 0.000002;
  saveData(); updateUpgradeUI(); updateUI();
}

function upgradeEnergy() {
  var cost = getEnergyCost(energyLevelVal);
  if (record < cost || energyLevelVal >= 100) return;
  record -= cost; energyLevelVal++;
  maxEnergy = 1000 + energyLevelVal * 500;
  saveData(); updateUpgradeUI(); updateUI();
}

function updateUpgradeUI() {
  var set = function(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; };
  set('tapLevel', tapLevelVal); set('energyLevel', energyLevelVal);
  set('tapCost', getTapCost(tapLevelVal).toLocaleString());
  set('energyCost', getEnergyCost(energyLevelVal).toLocaleString());
  set('tapPower', tapPowerVal);
  set('maxEnergyShow', maxEnergy.toLocaleString());
  var tb = document.getElementById('tapUpgradeBtn');
  if (tb) tb.disabled = record < getTapCost(tapLevelVal) || tapLevelVal >= 100;
  var eb = document.getElementById('energyUpgradeBtn');
  if (eb) eb.disabled = record < getEnergyCost(energyLevelVal) || energyLevelVal >= 100;
}

// ====== CARDS ======
var categories = [
  { name:'أنمي', cards:[
    {n:'ناروتو',e:'🍥'},{n:'غوكو',e:'⚡'},{n:'لوفي',e:'🏴‍☠️'},{n:'ساسكي',e:'🌩️'},
    {n:'إيتاشي',e:'🌸'},{n:'زورو',e:'⚔️'},{n:'توتورو',e:'🌿'},{n:'ميكاسا',e:'🗡️'},
    {n:'ليفاي',e:'💨'},{n:'إيرين',e:'🔑'},{n:'آرمين',e:'📚'},{n:'بيكولو',e:'👁️'},
    {n:'فيجيتا',e:'👑'},{n:'ناتسو',e:'🔥'},{n:'غراي',e:'❄️'},{n:'إيرزا',e:'🛡️'},
    {n:'لوسي',e:'⭐'},{n:'كيريتو',e:'🗡️'},{n:'أسونا',e:'🌹'},{n:'غون',e:'🌟'},
    {n:'كيليوا',e:'⚡'},{n:'كوروكو',e:'🏀'},{n:'أكاشي',e:'🎯'},{n:'زيرو تو',e:'🦋'},
    {n:'ريم',e:'💙'},{n:'إيميلي',e:'💛'},{n:'يوميكو',e:'🌙'},{n:'ماكيما',e:'🔗'},
    {n:'باور',e:'🩸'},{n:'دينجي',e:'⛓️'},{n:'غوجو',e:'🌀'},{n:'يوجي',e:'👊'},
    {n:'نوبارا',e:'🌸'},{n:'ميغومي',e:'🐕'},{n:'تانجيرو',e:'💧'},{n:'نيزوكو',e:'🎋'},
    {n:'زينيتسو',e:'⚡'},{n:'إينوسكي',e:'🐗'},{n:'أكازا',e:'🌺'},{n:'موزان',e:'🌙'},
    {n:'إيزوكو',e:'💚'},{n:'كاتسوكي',e:'💥'},{n:'شوتو',e:'🌓'},{n:'تسويو',e:'🐸'},
    {n:'كيريشيما',e:'🪨'},{n:'أوشاكو',e:'🍇'},{n:'إيتشيغو',e:'🌙'},{n:'ريوكيا',e:'❄️'},
    {n:'أوريهيمي',e:'🌸'},{n:'شاد',e:'🦾'},{n:'سينجي',e:'🤖'},{n:'ريي',e:'👁️'},
    {n:'آسوكا',e:'🔥'},{n:'ميساتو',e:'🍺'},{n:'كاجي',e:'🌱'},{n:'يوي',e:'💙'},
    {n:'كازوما',e:'💰'},{n:'أكوا',e:'💧'},{n:'ميغومين',e:'💥'},{n:'داكنس',e:'⚔️'},
    {n:'ديانا',e:'🌟'},{n:'إيكي',e:'⚡'},{n:'نورا',e:'🌸'},{n:'بيشامون',e:'👗'},
    {n:'هاياكاوا',e:'🔫'},{n:'ماكي',e:'🏹'},{n:'باندا',e:'🐼'},{n:'يوتا',e:'💜'},
    {n:'نانامي',e:'👔'},{n:'إينومايكي',e:'🎵'},{n:'يوريتشي',e:'☀️'},{n:'كوكوشيبو',e:'🌑'},
    {n:'رينغوكو',e:'🔥'},{n:'دوما',e:'❄️'},{n:'سانيمي',e:'💨'},{n:'غييو',e:'🐍'},
    {n:'مودا',e:'⚡'},{n:'هيموجيما',e:'🌊'},{n:'تشيهيرو',e:'🏮'},{n:'سوفي',e:'🌺'},
    {n:'كيكي',e:'🧹'},{n:'هاول',e:'🔥'},{n:'نوسيكا',e:'🌿'},{n:'شيتا',e:'⭐'},
    {n:'مورو',e:'🐺'},{n:'أشيتاكا',e:'🌲'},{n:'كالسيفر',e:'🔥'},{n:'هاكو',e:'🐉'},
    {n:'يوباابا',e:'🧙'},{n:'بورو',e:'🌊'},{n:'لين',e:'🌸'},{n:'ريو',e:'🐲'}
  ]},
  { name:'سيارات', cards:[
    {n:'Ferrari SF90',e:'🔴'},{n:'Lamborghini Aventador',e:'🟡'},{n:'Bugatti Chiron',e:'🔵'},
    {n:'McLaren P1',e:'🟠'},{n:'Porsche 911',e:'⚫'},{n:'Mercedes AMG GT',e:'⬛'},
    {n:'BMW M8',e:'🔵'},{n:'Audi R8',e:'⚪'},{n:'Koenigsegg Jesko',e:'🟢'},
    {n:'Pagani Huayra',e:'🥈'},{n:'Rolls Royce Ghost',e:'⬜'},{n:'Bentley Continental',e:'🟤'},
    {n:'Aston Martin DB11',e:'🟢'},{n:'Maserati MC20',e:'🔴'},{n:'Ferrari Roma',e:'🔴'},
    {n:'Lamborghini Urus',e:'🟡'},{n:'Porsche Cayenne',e:'⚫'},{n:'McLaren GT',e:'🟠'},
    {n:'Bugatti Veyron',e:'🔵'},{n:'Koenigsegg Agera',e:'🟢'},{n:'Rimac Nevera',e:'⚡'},
    {n:'Tesla Roadster',e:'🔴'},{n:'Dodge Viper',e:'🔴'},{n:'Ford GT',e:'🔵'},
    {n:'Chevrolet Corvette',e:'🟡'},{n:'Nissan GT-R',e:'⬛'},{n:'Toyota Supra',e:'🟠'},
    {n:'Mazda RX-7',e:'🔴'},{n:'Honda NSX',e:'⬛'},{n:'Mitsubishi Evo',e:'🔵'},
    {n:'Ferrari 458',e:'🔴'},{n:'Lamborghini Huracan',e:'🟡'},{n:'McLaren 720S',e:'🟠'},
    {n:'Porsche Taycan',e:'⚫'},{n:'Ferrari LaFerrari',e:'🔴'},{n:'Lamborghini Sian',e:'🟡'},
    {n:'McLaren Speedtail',e:'🟠'},{n:'Bugatti Divo',e:'🔵'},{n:'Koenigsegg Gemera',e:'🟢'},
    {n:'Pagani Zonda',e:'🥈'},{n:'Ferrari 296 GTB',e:'🔴'},{n:'Lamborghini Revuelto',e:'🟡'},
    {n:'McLaren Artura',e:'🟠'},{n:'Porsche 918',e:'⚫'},{n:'Ferrari Enzo',e:'🔴'},
    {n:'Lamborghini Diablo',e:'🟡'},{n:'McLaren F1',e:'🟠'},{n:'Jaguar F-Type',e:'🟢'},
    {n:'Ferrari F40',e:'🔴'},{n:'Ferrari F50',e:'🔴'},{n:'Porsche Carrera GT',e:'⚫'},
    {n:'McLaren Senna',e:'🟠'},{n:'Aston Martin Valkyrie',e:'🟢'},{n:'Gordon Murray T.50',e:'🔵'}
  ]},
  { name:'ملاهي', cards:[
    {n:'Omnia Dubai',e:'🌃'},{n:'Pacha Ibiza',e:'🏝️'},{n:'Berghain Berlin',e:'⬛'},
    {n:'Fabric London',e:'🇬🇧'},{n:'Amnesia Ibiza',e:'🌊'},{n:'DC10 Ibiza',e:'🎵'},
    {n:'Marquee NYC',e:'🗽'},{n:'LIV Miami',e:'🌴'},{n:'E11even Miami',e:'🔥'},
    {n:'Hakkasan Vegas',e:'🎰'},{n:'Omnia Vegas',e:'💎'},{n:'XS Vegas',e:'✨'},
    {n:'Womb Tokyo',e:'🎌'},{n:'Zuma Dubai',e:'🌟'},{n:'White Dubai',e:'⬜'},
    {n:'Ministry of Sound',e:'🔊'},{n:'Rex Club Paris',e:'🇫🇷'},{n:'Tresor Berlin',e:'💎'},
    {n:'Watergate Berlin',e:'🌊'},{n:'Berghain Kantine',e:'🪨'},{n:'Shelter Amsterdam',e:'🏠'},
    {n:'Fabric Room 1',e:'🔊'},{n:'Fabric Room 2',e:'🎵'},{n:'Fabric Room 3',e:'🎶'},
    {n:'Printworks London',e:'🖨️'},{n:'Oval Space',e:'⭕'},{n:'Output Brooklyn',e:'🗽'},
    {n:'Exchange LA',e:'🎵'},{n:'Nyx Athens',e:'🇬🇷'},{n:'Void Athens',e:'🕳️'}
  ]},
  { name:'قصور', cards:[
    {n:'قصر بكنغهام',e:'👑'},{n:'قصر فرساي',e:'🌹'},{n:'قصر الحمراء',e:'🌺'},
    {n:'قصر نويشفانشتاين',e:'❄️'},{n:'قصر توبكابي',e:'🌙'},{n:'قصر الكرملين',e:'⭐'},
    {n:'قصر شينبرون',e:'🟡'},{n:'قصر موناكو',e:'🎰'},{n:'قصر مدريد',e:'🔴'},
    {n:'قصر براغ',e:'🧙'},{n:'قصر بودابست',e:'🌉'},{n:'قصر وارسو',e:'🦅'},
    {n:'قصر ستوكهولم',e:'⭐'},{n:'قصر أمستردام',e:'🌷'},{n:'قصر فيينا',e:'🎵'},
    {n:'قصر دبي',e:'🏙️'},{n:'قصر أبوظبي',e:'🕌'},{n:'قصر الرياض',e:'🌴'},
    {n:'قصر الكويت',e:'🛢️'},{n:'قصر الدوحة',e:'🌐'},{n:'قصر مسقط',e:'🏔️'},
    {n:'قصر القاهرة',e:'🏺'},{n:'قصر مراكش',e:'🌺'},{n:'قصر إسطنبول',e:'🌙'},
    {n:'قصر مومباي',e:'🕌'},{n:'قصر دلهي',e:'🏯'},{n:'قصر بانكوك',e:'🐘'},
    {n:'قصر طوكيو',e:'🌸'},{n:'قصر كيوتو',e:'⛩️'},{n:'قصر بكين',e:'🐉'},
    {n:'قصر شنغهاي',e:'🌆'},{n:'قصر سيول',e:'🎎'},{n:'قصر لندن',e:'👑'},
    {n:'قصر باريس',e:'🗼'},{n:'قصر واشنطن',e:'🏛️'},{n:'قصر نيويورك',e:'🗽'}
  ]}
];

function buildCards() {
  categories.forEach(function(cat, ci) {
    var grid = document.getElementById('cat-' + ci);
    if (!grid) return;
    cat.cards.forEach(function(card, idx) {
      var key = ci + '_' + idx;
      if (!cardLevels[key]) cardLevels[key] = 0;
      var div = document.createElement('div');
      div.className = 'card-item';
      div.id = 'card-' + key;
      div.setAttribute('data-ci', ci);
      div.setAttribute('data-idx', idx);
      div.onclick = function() { openCard(parseInt(this.getAttribute('data-ci')), parseInt(this.getAttribute('data-idx'))); };
      var lvl = cardLevels[key];
      div.innerHTML =
        '<div class="card-emoji">' + card.e + '</div>' +
        '<div class="card-name">' + card.n + '</div>' +
        '<div class="card-level">LVL ' + lvl + '</div>' +
        '<div class="card-speed">+' + (lvl * 0.000001).toFixed(6) + ' REC/ث</div>';
      grid.appendChild(div);
    });
  });
}

function openCard(ci, idx) {
  var key = ci + '_' + idx;
  var card = categories[ci].cards[idx];
  var lvl = cardLevels[key] || 0;
  var cost = lvl === 0 ? 100 : lvl === 1 ? 300 : lvl === 2 ? 500 : Math.floor(500 * Math.pow(1.5, lvl - 2));
  var canUpgrade = record >= cost && lvl < 100;
  document.getElementById('cardDetail').innerHTML =
    '<div style="text-align:center; margin-bottom:20px;">' +
      '<div style="font-size:80px;">' + card.e + '</div>' +
      '<div style="font-size:22px; margin:10px 0;">' + card.n + '</div>' +
      '<div style="color:#FF0000; font-size:16px;">المستوى ' + lvl + ' / 100</div>' +
    '</div>' +
    '<div class="info-card"><div style="color:#aaa;font-size:12px;margin-bottom:5px;">مكافأة التعدين</div>' +
    '<div style="color:#FF0000;">+' + (lvl * 0.000001).toFixed(6) + ' REC/ثانية</div></div>' +
    '<div class="info-card"><div style="color:#aaa;font-size:12px;margin-bottom:5px;">تكلفة الترقية للمستوى ' + (lvl + 1) + '</div>' +
    '<div>' + cost.toLocaleString() + ' RECORD</div></div>' +
    (lvl < 100
      ? '<button class="do-btn" ' + (canUpgrade ? '' : 'disabled') + ' onclick="upgradeCard(' + ci + ',' + idx + ')">ترقية ← ' + cost.toLocaleString() + ' RECORD</button>'
      : '<div style="text-align:center;color:#FFD700;margin-top:15px;">✅ وصلت للمستوى الأقصى!</div>');
  document.getElementById('cardModal').classList.add('open');
}

function upgradeCard(ci, idx) {
  var key = ci + '_' + idx;
  var lvl = cardLevels[key] || 0;
  var cost = lvl === 0 ? 100 : lvl === 1 ? 300 : lvl === 2 ? 500 : Math.floor(500 * Math.pow(1.5, lvl - 2));
  if (record < cost || lvl >= 100) return;
  record -= cost; cardLevels[key] = lvl + 1; miningSpeed += 0.000001;
  var el = document.getElementById('card-' + key);
  if (el) {
    el.querySelector('.card-level').textContent = 'LVL ' + (lvl + 1);
    el.querySelector('.card-speed').textContent = '+' + ((lvl + 1) * 0.000001).toFixed(6) + ' REC/ث';
  }
  saveData(); openCard(ci, idx); updateUI();
}

function showCategory(idx, btn) {
  document.querySelectorAll('.card-grid').forEach(function(g) { g.style.display = 'none'; });
  document.querySelectorAll('.cat-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('cat-' + idx).style.display = 'grid';
  btn.classList.add('active');
}

// ====== TASKS ======
function joinAndWait(type, joinBtnId, claimBtnId) {
  if (type === 'telegram') {
    window.Telegram.WebApp.openTelegramLink('https://t.me/Momokh1');
  } else {
    window.Telegram.WebApp.openLink('https://x.com/mohamma33122570');
  }
  var joinBtn = document.getElementById(joinBtnId);
  var claimBtn = document.getElementById(claimBtnId);
  if (!joinBtn || !claimBtn) return;
  joinBtn.disabled = true;
  var sec = 30;
  joinBtn.textContent = '⏳ ' + sec + ' ثانية...';
  var timer = setInterval(function() {
    sec--;
    joinBtn.textContent = '⏳ ' + sec + ' ثانية...';
    if (sec <= 0) {
      clearInterval(timer);
      joinBtn.style.display = 'none';
      claimBtn.disabled = false;
    }
  }, 1000);
}

function claimTask(type, btnId, joinBtnId) {
  if (completedTasks.indexOf(type) !== -1) {
    showToast('أنجزت هذه المهمة مسبقاً!');
    return;
  }
  completedTasks.push(type);
  record += 10000;
  var btn = document.getElementById(btnId);
  if (btn) { btn.textContent = '✅ تم الإنجاز'; btn.disabled = true; btn.classList.add('done'); }
  var jb = document.getElementById(joinBtnId);
  if (jb) jb.style.display = 'none';
  saveData(); updateUI();
  showToast('🎉 حصلت على 10,000 RECORD!');
}

function restoreTasksUI() {
  if (completedTasks.indexOf('telegram') !== -1) {
    var b = document.getElementById('task1Btn');
    if (b) { b.textContent = '✅ تم الإنجاز'; b.disabled = true; b.classList.add('done'); }
    var j = document.getElementById('task1JoinBtn');
    if (j) j.style.display = 'none';
  }
  if (completedTasks.indexOf('twitter') !== -1) {
    var b2 = document.getElementById('task2Btn');
    if (b2) { b2.textContent = '✅ تم الإنجاز'; b2.disabled = true; b2.classList.add('done'); }
    var j2 = document.getElementById('task2JoinBtn');
    if (j2) j2.style.display = 'none';
  }
}

// ====== REFERRAL MILESTONES ======
var refMilestones = [
  { req: 5,   reward: 5,   label: 'ادعُ 5 أشخاص'   },
  { req: 10,  reward: 15,  label: 'ادعُ 10 أشخاص'  },
  { req: 30,  reward: 50,  label: 'ادعُ 30 شخص'    },
  { req: 50,  reward: 100, label: 'ادعُ 50 شخص'    },
  { req: 100, reward: 500, label: 'ادعُ 100 شخص'   }
];

function buildMilestones() {
  var cont = document.getElementById('milestonesContainer');
  if (!cont) return;
  cont.innerHTML = '';
  refMilestones.forEach(function(m, i) {
    var claimed = claimedMilest.indexOf(i) !== -1;
    var canClaim = !claimed && refCount >= m.req;
    var pct = Math.min(100, Math.round((refCount / m.req) * 100));
    var borderColor = claimed ? '#1a5c1a' : canClaim ? '#FF0000' : '#2a2a2a';
    var card = document.createElement('div');
    card.style.cssText = 'background:#161616;border:1px solid ' + borderColor + ';border-radius:12px;padding:12px 14px;margin-bottom:9px;';
    var badgeHtml;
    if (claimed) {
      badgeHtml = '<div style="background:#1a4a1a;color:#4eff4e;padding:5px 12px;border-radius:8px;font-size:12px;white-space:nowrap;">✅ تم</div>';
    } else if (canClaim) {
      badgeHtml = '<button onclick="claimMilestone(' + i + ')" style="background:#FF0000;border:none;color:white;padding:5px 13px;border-radius:8px;font-size:12px;cursor:pointer;font-weight:bold;white-space:nowrap;">احصل! 🎁</button>';
    } else {
      badgeHtml = '<div style="color:#555;font-size:11px;white-space:nowrap;">' + refCount + ' / ' + m.req + '</div>';
    }
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:' + (claimed ? '0' : '8px') + ';">' +
        '<div>' +
          '<div style="font-size:13px;color:' + (claimed ? '#4eff4e' : 'white') + ';">' + m.label + '</div>' +
          '<div style="font-size:12px;color:#00FF88;margin-top:3px;">🟢 + ' + m.reward + ' REC</div>' +
        '</div>' +
        badgeHtml +
      '</div>' +
      (!claimed ? '<div style="background:#2a2a2a;border-radius:6px;height:5px;overflow:hidden;">' +
        '<div style="width:' + pct + '%;height:100%;background:' + (canClaim ? '#FF0000' : 'linear-gradient(90deg,#FF0000,#ff6600)') + ';border-radius:6px;transition:width 0.4s;"></div>' +
        '</div>' : '');
    cont.appendChild(card);
  });
  var rd = document.getElementById('refCountDisplay');
  if (rd) rd.textContent = refCount;
}

function claimMilestone(i) {
  if (claimedMilest.indexOf(i) !== -1) return;
  if (refCount < refMilestones[i].req) { showToast('لم تكمل المتطلب بعد!'); return; }
  claimedMilest.push(i);
  rec += refMilestones[i].reward;
  saveData(); buildMilestones(); updateUI();
  showToast('🎉 حصلت على ' + refMilestones[i].reward + ' REC!');
}

// ====== INVITE ======
function copyInvite() {
  var userId = tgUser ? tgUser.id : '0';
  var link = 'https://t.me/RecMiningGame_bot?start=ref' + userId;
  // Use navigator.clipboard only — no execCommand (prevents keyboard/system dialog on iOS)
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link)
      .then(function() { showToast('✅ تم نسخ الرابط!'); })
      .catch(function() { showToast('🔗 ' + link); });
  } else {
    showToast('🔗 ' + link);
  }
}

function shareInvite() {
  var userId = tgUser ? tgUser.id : '0';
  var link = 'https://t.me/RecMiningGame_bot?start=ref' + userId;
  window.Telegram.WebApp.openTelegramLink(
    'https://t.me/share/url?url=' + encodeURIComponent(link) +
    '&text=' + encodeURIComponent('🔴 انضم لـ REC Mining وابدأ التعدين مجاناً!\n\n👇 اضغط هنا وابدأ')
  );
}

// ====== RANK ======
var medals = [
  {name:'Bronze I',   emoji:'🥉', color:'#CD7F32', range:'0 - 1M',     min:0},
  {name:'Bronze II',  emoji:'🥉', color:'#CD7F32', range:'1M - 5M',    min:1000000},
  {name:'Bronze III', emoji:'🥉', color:'#CD7F32', range:'5M - 10M',   min:5000000},
  {name:'Silver I',   emoji:'🥈', color:'#C0C0C0', range:'10M - 25M',  min:10000000},
  {name:'Silver II',  emoji:'🥈', color:'#C0C0C0', range:'25M - 50M',  min:25000000},
  {name:'Silver III', emoji:'🥈', color:'#C0C0C0', range:'50M - 100M', min:50000000},
  {name:'Gold I',     emoji:'🥇', color:'#FFD700', range:'100M - 250M',min:100000000},
  {name:'Gold II',    emoji:'🥇', color:'#FFD700', range:'250M - 500M',min:250000000},
  {name:'Gold III',   emoji:'🥇', color:'#FFD700', range:'500M - 1B',  min:500000000},
  {name:'Platinum',   emoji:'💎', color:'#E5E4E2', range:'1B - 5B',    min:1000000000},
  {name:'Diamond',    emoji:'💠', color:'#00BFFF', range:'5B - 10B',   min:5000000000},
  {name:'Legendary',  emoji:'👑', color:'#FF0000', range:'10B+',       min:10000000000}
];
var currentMedalIndex = 0;

function changeMedal(dir) {
  currentMedalIndex = Math.max(0, Math.min(medals.length - 1, currentMedalIndex + dir));
  var m = medals[currentMedalIndex];
  var set = function(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; };
  set('medalEmoji', m.emoji); set('medalName', m.name);
  set('medalRange', m.range + ' RECORD');
  var mn = document.getElementById('medalName'); if (mn) mn.style.color = m.color;
  var mb = document.getElementById('medalBox'); if (mb) mb.style.borderColor = m.color;
}

function getMyMedal() {
  for (var i = medals.length - 1; i >= 0; i--) {
    if (record >= medals[i].min) return medals[i];
  }
  return medals[0];
}

// ====== PROFILE ======
function openSupport() { window.Telegram.WebApp.openTelegramLink('https://t.me/Momokhli'); }
function toggleLang() {
  var m = document.getElementById('langMenu');
  if (m) m.style.display = m.style.display === 'none' ? 'block' : 'none';
}
function setLang(lang) {
  var m = document.getElementById('langMenu');
  if (m) m.style.display = 'none';
  var dir = (lang === 'ar' || lang === 'fa') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('lang', lang);
  document.body.style.direction = dir;
  try { localStorage.setItem('lang_' + saveKey, lang); } catch(e) {}
}
function connectWallet() { window.Telegram.WebApp.openTelegramLink('https://t.me/wallet'); }

// ====== INIT ======
document.addEventListener('DOMContentLoaded', function() {
  if (tgUser) {
    var name = tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : '');
    var el = document.getElementById('profileName'); if (el) el.textContent = name;
    var idEl = document.getElementById('profileId'); if (idEl) idEl.textContent = tgUser.id;
  }
  buildCards();
  buildMilestones();
  restoreTasksUI();
  updateUI();
});
