// ==========================================
// REC Mining - app.js
// ==========================================

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

var tgUser = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user;
if (tgUser) {
  document.getElementById('profileName').textContent = tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : '');
}

var saveKey = 'recmining_' + (tgUser ? tgUser.id : 'guest');

// ====== DATA ======
var saved = null;
try { saved = JSON.parse(localStorage.getItem(saveKey)); } catch(e) {}

var record       = saved ? (saved.record || 0) : 0;
var rec          = saved ? (saved.rec || 0) : 0;
var energy       = saved ? (saved.energy !== undefined ? saved.energy : 1000) : 1000;
var maxEnergy    = saved ? (saved.maxEnergy || 1000) : 1000;
var tapLevelVal  = saved ? (saved.tapLevelVal || 0) : 0;
var energyLevelVal = saved ? (saved.energyLevelVal || 0) : 0;
var tapPowerVal  = saved ? (saved.tapPowerVal || 1) : 1;
var miningSpeed  = saved ? (saved.miningSpeed || 0.000001) : 0.000001;
var completedTasks = saved ? (saved.completedTasks || []) : [];
var cardLevels   = saved ? (saved.cardLevels || {}) : {};

function saveData() {
  try {
    localStorage.setItem(saveKey, JSON.stringify({
      record, rec, energy, maxEnergy,
      tapLevelVal, energyLevelVal, tapPowerVal, miningSpeed,
      completedTasks, cardLevels
    }));
  } catch(e) {}
}

// ====== NAVIGATION ======
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
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

// تعدين تلقائي كل 10 ثواني
setInterval(function() {
  rec += miningSpeed * 10;
  if (energy < maxEnergy) energy = Math.min(maxEnergy, energy + 1);
  saveData();
  updateUI();
}, 10000);

function updateUI() {
  document.getElementById('recordCount').textContent = Math.floor(record).toLocaleString();
  document.getElementById('recAmount').textContent = rec.toFixed(6);
  document.getElementById('energyText').textContent = Math.floor(energy) + ' / ' + maxEnergy;
  document.getElementById('energyBar').style.width = (energy / maxEnergy * 100) + '%';
  document.getElementById('miningSpeedShow').textContent = miningSpeed.toFixed(6);
  document.getElementById('profileRecord').textContent = Math.floor(record).toLocaleString();
  var m = getMyMedal();
  document.getElementById('myRankName').textContent = m.name;
  document.getElementById('myRankName').style.color = m.color;
  document.getElementById('myRankRecord').textContent = Math.floor(record).toLocaleString();
}

// ====== UPGRADE ======
function getTapCost(lvl) { return Math.floor(50 * Math.pow(2, Math.floor(lvl / 5))); }
function getEnergyCost(lvl) { return Math.floor(50 * Math.pow(2, Math.floor(lvl / 5))); }

function openUpgrade() {
  updateUpgradeUI();
  document.getElementById('upgradePage').classList.add('open');
}

function upgradeTap() {
  var cost = getTapCost(tapLevelVal);
  if (record < cost || tapLevelVal >= 100) return;
  record -= cost;
  tapLevelVal++;
  tapPowerVal = 1 + Math.floor(tapLevelVal / 5);
  miningSpeed += 0.000002;
  saveData();
  updateUpgradeUI();
  updateUI();
}

function upgradeEnergy() {
  var cost = getEnergyCost(energyLevelVal);
  if (record < cost || energyLevelVal >= 100) return;
  record -= cost;
  energyLevelVal++;
  maxEnergy = 1000 + energyLevelVal * 500;
  saveData();
  updateUpgradeUI();
  updateUI();
}

function updateUpgradeUI() {
  document.getElementById('tapLevel').textContent = tapLevelVal;
  document.getElementById('energyLevel').textContent = energyLevelVal;
  document.getElementById('tapCost').textContent = getTapCost(tapLevelVal).toLocaleString();
  document.getElementById('energyCost').textContent = getEnergyCost(energyLevelVal).toLocaleString();
  document.getElementById('tapPower').textContent = tapPowerVal;
  document.getElementById('maxEnergyShow').textContent = maxEnergy.toLocaleString();
  document.getElementById('tapUpgradeBtn').disabled = record < getTapCost(tapLevelVal) || tapLevelVal >= 100;
  document.getElementById('energyUpgradeBtn').disabled = record < getEnergyCost(energyLevelVal) || energyLevelVal >= 100;
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
    {n:'هاياكاوا',e:'�فس'},{n:'ماكي',e:'🏹'},{n:'باندا',e:'🐼'},{n:'يوتا',e:'💜'},
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
    {n:'Subaru WRX STI',e:'🔵'},{n:'Ferrari 458',e:'🔴'},{n:'Lamborghini Huracan',e:'🟡'},
    {n:'McLaren 720S',e:'🟠'},{n:'Porsche Taycan',e:'⚫'},{n:'Mercedes EQS AMG',e:'⬛'},
    {n:'BMW iM',e:'🔵'},{n:'Audi e-tron GT',e:'⚪'},{n:'Ferrari LaFerrari',e:'🔴'},
    {n:'Lamborghini Sian',e:'🟡'},{n:'McLaren Speedtail',e:'🟠'},{n:'Bugatti Divo',e:'🔵'},
    {n:'Koenigsegg Gemera',e:'🟢'},{n:'Pagani Zonda',e:'🥈'},{n:'Hennessey Venom',e:'🔴'},
    {n:'SSC Tuatara',e:'⬛'},{n:'Zenvo TSR-S',e:'🔴'},{n:'Apollo IE',e:'⚫'},
    {n:'Ferrari 296 GTB',e:'🔴'},{n:'Lamborghini Revuelto',e:'🟡'},{n:'McLaren Artura',e:'🟠'},
    {n:'Porsche 918',e:'⚫'},{n:'Mercedes SLR',e:'⬛'},{n:'BMW M3 E46',e:'🔵'},
    {n:'Audi RS6',e:'⚪'},{n:'Ferrari Enzo',e:'🔴'},{n:'Lamborghini Diablo',e:'🟡'},
    {n:'McLaren F1',e:'🟠'},{n:'Bugatti EB110',e:'🔵'},{n:'Jaguar F-Type',e:'🟢'},
    {n:'Alfa Romeo 4C',e:'🔴'},{n:'Lotus Evija',e:'🟡'},{n:'Ariel Atom',e:'🔴'},
    {n:'Caterham Seven',e:'🟢'},{n:'TVR Griffith',e:'🔵'},{n:'Noble M600',e:'🔴'},
    {n:'Saleen S7',e:'🟡'},{n:'Ferrari F40',e:'🔴'},{n:'Ferrari F50',e:'🔴'},
    {n:'Porsche Carrera GT',e:'⚫'},{n:'Mercedes CLK GTR',e:'⬛'},{n:'McLaren Senna',e:'🟠'},
    {n:'Aston Martin Valkyrie',e:'🟢'},{n:'Gordon Murray T.50',e:'🔵'},{n:'Pagani Imola',e:'🥈'},
    {n:'Koenigsegg CC850',e:'🟢'},{n:'Czinger 21C',e:'⚫'},{n:'Hennessey F5',e:'🔴'},
    {n:'Rimac C_Two',e:'⚡'},{n:'Lotus Emira',e:'🟡'},{n:'Alpine A110',e:'🔵'},
    {n:'Renault Megane RS',e:'🔵'},{n:'Honda Civic Type R',e:'🔴'},{n:'Ferrari Monza SP2',e:'🔴'},
    {n:'McLaren Elva',e:'🟠'},{n:'Lamborghini Essenza',e:'🟡'},{n:'Bugatti La Voiture',e:'🔵'}
  ]},
  { name:'ملاهي', cards:[
    {n:'Omnia Dubai',e:'🌃'},{n:'Pacha Ibiza',e:'🏝️'},{n:'Berghain Berlin',e:'⬛'},
    {n:'Fabric London',e:'🇬🇧'},{n:'Amnesia Ibiza',e:'🌊'},{n:'DC10 Ibiza',e:'🎵'},
    {n:'Privilege Ibiza',e:'👑'},{n:'Space Ibiza',e:'🚀'},{n:'Ushuaia Ibiza',e:'☀️'},
    {n:'Hi Ibiza',e:'🎶'},{n:'Marquee NYC',e:'🗽'},{n:'Lavo NYC',e:'🌆'},
    {n:'1 OAK NYC',e:'🌿'},{n:'Avenue NYC',e:'🏙️'},{n:'LIV Miami',e:'🌴'},
    {n:'E11even Miami',e:'🔥'},{n:'Story Miami',e:'📖'},{n:'Club Space Miami',e:'🚀'},
    {n:'Hakkasan Vegas',e:'🎰'},{n:'Omnia Vegas',e:'💎'},{n:'XS Vegas',e:'✨'},
    {n:'Marquee Vegas',e:'🎰'},{n:'Zouk Vegas',e:'🎵'},{n:'Womb Tokyo',e:'🎌'},
    {n:'ageHa Tokyo',e:'🦋'},{n:'SOUND Tokyo',e:'🔊'},{n:'Vision Tokyo',e:'👁️'},
    {n:'Zuma Dubai',e:'🌟'},{n:'White Dubai',e:'⬜'},{n:'BASE Dubai',e:'🏗️'},
    {n:'CÉ LA VI Dubai',e:'🌆'},{n:'Cirque Le Soir London',e:'🎪'},{n:'KOKO London',e:'🎸'},
    {n:'Ministry of Sound',e:'🔊'},{n:'Heaven London',e:'😇'},{n:'XOYO London',e:'💋'},
    {n:'Rex Club Paris',e:'🇫🇷'},{n:'Social Club Paris',e:'🎵'},{n:'Concrete Paris',e:'🏗️'},
    {n:'Nuba Barcelona',e:'☀️'},{n:'Opium Barcelona',e:'🌺'},{n:'Razzmatazz Barcelona',e:'🎶'},
    {n:'Tresor Berlin',e:'💎'},{n:'Watergate Berlin',e:'🌊'},{n:'Sisyphos Berlin',e:'🪨'},
    {n:'Wilde Renate Berlin',e:'🌹'},{n:'Cocoon Club',e:'🦋'},{n:'Bootshaus Köln',e:'⛵'},
    {n:'De School Amsterdam',e:'🏫'},{n:'Shelter Amsterdam',e:'🏠'},{n:'Paradiso Amsterdam',e:'🎭'},
    {n:'Melkweg Amsterdam',e:'🌌'},{n:'Fabric Room 1',e:'🔊'},{n:'Fabric Room 2',e:'🎵'},
    {n:'Fabric Room 3',e:'🎶'},{n:'Nation London',e:'🇬🇧'},{n:'EGG London',e:'🥚'},
    {n:'Corsica Studios',e:'🏭'},{n:'Printworks London',e:'🖨️'},{n:'Junction 2',e:'🔀'},
    {n:'Fold London',e:'📄'},{n:'Village Underground',e:'🏘️'},{n:'Oval Space',e:'⭕'},
    {n:'Studio 338',e:'🏗️'},{n:'Drumsheds London',e:'🥁'},{n:'Phonox London',e:'📻'},
    {n:'Dalston Superstore',e:'🛒'},{n:'Dance Tunnel',e:'🕳️'},{n:'Cargo London',e:'📦'},
    {n:'Electric Brixton',e:'⚡'},{n:'O2 Academy',e:'🎵'},{n:'Roundhouse London',e:'🔵'},
    {n:'Scala London',e:'🎬'},{n:'Jazz Cafe',e:'🎷'},{n:'Batofar Paris',e:'⛵'},
    {n:'Glazart Paris',e:'🎨'},{n:'Badaboum Paris',e:'💥'},{n:'La Machine Paris',e:'⚙️'},
    {n:'Output Brooklyn',e:'🗽'},{n:'Public Works SF',e:'🔧'},{n:'Exchange LA',e:'🎵'},
    {n:'Nyx Athens',e:'🇬🇷'},{n:'Void Athens',e:'🕳️'},{n:'Club Riviera Athens',e:'🌊'}
  ]},
  { name:'قصور', cards:[
    {n:'قصر بكنغهام',e:'👑'},{n:'قصر فرساي',e:'🌹'},{n:'قصر الحمراء',e:'🌺'},
    {n:'قصر نويشفانشتاين',e:'❄️'},{n:'قصر توبكابي',e:'🌙'},{n:'قصر الكرملين',e:'⭐'},
    {n:'قصر شينبرون',e:'🟡'},{n:'قصر هوف',e:'🏛️'},{n:'قصر بيلينتيس',e:'🌊'},
    {n:'قصر موناكو',e:'🎰'},{n:'قصر برلين',e:'⬛'},{n:'قصر ميلان',e:'🏙️'},
    {n:'قصر روما',e:'🏛️'},{n:'قصر فلورنسا',e:'🌸'},{n:'قصر البندقية',e:'🚤'},
    {n:'قصر نابولي',e:'🌋'},{n:'قصر مدريد',e:'🔴'},{n:'قصر ليزبون',e:'🌊'},
    {n:'قصر براغ',e:'🧙'},{n:'قصر بودابست',e:'🌉'},{n:'قصر وارسو',e:'🦅'},
    {n:'قصر ستوكهولم',e:'⭐'},{n:'قصر كوبنهاغن',e:'🍀'},{n:'قصر أوسلو',e:'❄️'},
    {n:'قصر هلسنكي',e:'🌲'},{n:'قصر أمستردام',e:'🌷'},{n:'قصر بروكسل',e:'🇧🇪'},
    {n:'قصر برن',e:'🐻'},{n:'قصر جنيف',e:'🕊️'},{n:'قصر فيينا',e:'🎵'},
    {n:'قصر ميونخ',e:'🍺'},{n:'قصر هامبورغ',e:'⚓'},{n:'قصر دبي',e:'🏙️'},
    {n:'قصر أبوظبي',e:'🕌'},{n:'قصر الرياض',e:'🌴'},{n:'قصر الكويت',e:'🛢️'},
    {n:'قصر الدوحة',e:'🌐'},{n:'قصر المنامة',e:'🌊'},{n:'قصر مسقط',e:'🏔️'},
    {n:'قصر بيروت',e:'🌲'},{n:'قصر القاهرة',e:'🏺'},{n:'قصر الإسكندرية',e:'⛵'},
    {n:'قصر مراكش',e:'🌺'},{n:'قصر فاس',e:'🕌'},{n:'قصر تونس',e:'🌊'},
    {n:'قصر نيروبي',e:'🦁'},{n:'قصر كيب تاون',e:'🌊'},{n:'قصر جوهانسبرغ',e:'💎'},
    {n:'قصر مومباي',e:'🕌'},{n:'قصر دلهي',e:'🏯'},{n:'قصر جايبور',e:'🌸'},
    {n:'قصر آغرا',e:'🕌'},{n:'قصر بانكوك',e:'🐘'},{n:'قصر بالي',e:'🌺'},
    {n:'قصر سنغافورة',e:'🦁'},{n:'قصر كوالالمبور',e:'🏙️'},{n:'قصر هانوي',e:'🍜'},
    {n:'قصر كاتماندو',e:'🏔️'},{n:'قصر طوكيو',e:'🌸'},{n:'قصر كيوتو',e:'⛩️'},
    {n:'قصر أوساكا',e:'🏯'},{n:'قصر بكين',e:'🐉'},{n:'قصر شنغهاي',e:'🌆'},
    {n:'قصر هونغ كونغ',e:'🌃'},{n:'قصر سيول',e:'🎎'},{n:'قصر موسكو',e:'⛪'},
    {n:'قصر سان بطرسبرغ',e:'❄️'},{n:'قصر لندن',e:'👑'},{n:'قصر باريس',e:'🗼'},
    {n:'قصر واشنطن',e:'🏛️'},{n:'قصر نيويورك',e:'🗽'},{n:'قصر لوس أنجلوس',e:'🌴'},
    {n:'قصر ريو',e:'🌊'},{n:'قصر بوينس آيرس',e:'🥩'},{n:'قصر سانتياغو',e:'🏔️'},
    {n:'قصر بوغوتا',e:'☕'},{n:'قصر ليما',e:'🦙'},{n:'قصر مكسيكو',e:'🌮'},
    {n:'قصر أثينا',e:'🏛️'},{n:'قصر إسطنبول',e:'🌙'},{n:'قصر تبريز',e:'🌹'},
    {n:'قصر طهران',e:'🌺'},{n:'قصر بغداد',e:'🌙'},{n:'قصر دمشق',e:'🌸'},
    {n:'قصر القدس',e:'⭐'},{n:'قصر عمان',e:'🌊'},{n:'قصر صنعاء',e:'🏰'}
  ]}
];

function buildCards() {
  categories.forEach(function(cat, ci) {
    var grid = document.getElementById('cat-' + ci);
    cat.cards.forEach(function(card, idx) {
      var key = ci + '_' + idx;
      if (!cardLevels[key]) cardLevels[key] = 0;
      var div = document.createElement('div');
      div.className = 'card-item';
      div.id = 'card-' + key;
      div.setAttribute('data-ci', ci);
      div.setAttribute('data-idx', idx);
      div.onclick = function() {
        openCard(parseInt(this.getAttribute('data-ci')), parseInt(this.getAttribute('data-idx')));
      };
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
  record -= cost;
  cardLevels[key] = lvl + 1;
  miningSpeed += 0.000001;
  var el = document.getElementById('card-' + key);
  if (el) {
    el.querySelector('.card-level').textContent = 'LVL ' + (lvl + 1);
    el.querySelector('.card-speed').textContent = '+' + ((lvl + 1) * 0.000001).toFixed(6) + ' REC/ث';
  }
  saveData();
  openCard(ci, idx);
  updateUI();
}

function showCategory(idx, btn) {
  document.querySelectorAll('.card-grid').forEach(g => g.style.display = 'none');
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('cat-' + idx).style.display = 'grid';
  btn.classList.add('active');
}

// ====== TASKS ======
function joinTask(type) {
  if (type === 'telegram') {
    window.Telegram.WebApp.openTelegramLink('https://t.me/Momokh1');
  } else if (type === 'twitter') {
    window.Telegram.WebApp.openLink('https://x.com/mohamma33122570');
  }
}

function claimTask(type, btnId, joinBtnId) {
  if (completedTasks.indexOf(type) !== -1) {
    alert('أنجزت هذه المهمة مسبقاً!');
    return;
  }
  completedTasks.push(type);
  record += 10000;
  var btn = document.getElementById(btnId);
  btn.textContent = '✅ تم الإنجاز';
  btn.disabled = true;
  btn.classList.add('done');
  document.getElementById(joinBtnId).style.display = 'none';
  saveData();
  updateUI();
}

function restoreTasksUI() {
  if (completedTasks.indexOf('telegram') !== -1) {
    var b = document.getElementById('task1Btn');
    b.textContent = '✅ تم الإنجاز';
    b.disabled = true;
    b.classList.add('done');
    document.getElementById('task1JoinBtn').style.display = 'none';
  }
  if (completedTasks.indexOf('twitter') !== -1) {
    var b = document.getElementById('task2Btn');
    b.textContent = '✅ تم الإنجاز';
    b.disabled = true;
    b.classList.add('done');
    document.getElementById('task2JoinBtn').style.display = 'none';
  }
}

// ====== INVITE ======
function copyInvite() {
  var userId = tgUser ? tgUser.id : '0';
  var link = 'https://t.me/RecMining_bot?start=' + userId;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(function() { alert('✅ تم نسخ الرابط!'); });
  } else {
    alert('الرابط: ' + link);
  }
}

function shareInvite() {
  var userId = tgUser ? tgUser.id : '0';
  var link = 'https://t.me/RecMining_bot?start=' + userId;
  var text = 'انضم لـ REC Mining وابدأ التعدين! 🔴\n' + link;
  window.Telegram.WebApp.openTelegramLink(
    'https://t.me/share/url?url=' + encodeURIComponent(link) +
    '&text=' + encodeURIComponent('انضم لـ REC Mining وابدأ التعدين! 🔴')
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
  document.getElementById('medalEmoji').textContent = m.emoji;
  document.getElementById('medalName').textContent = m.name;
  document.getElementById('medalName').style.color = m.color;
  document.getElementById('medalRange').textContent = m.range + ' RECORD';
  document.getElementById('medalBox').style.borderColor = m.color;
}

function getMyMedal() {
  for (var i = medals.length - 1; i >= 0; i--) {
    if (record >= medals[i].min) return medals[i];
  }
  return medals[0];
}

// ====== PROFILE ======
function toggleLang() {
  var menu = document.getElementById('langMenu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function setLang(lang) {
  document.getElementById('langMenu').style.display = 'none';
  var texts = {
    ar: { home:'الرئيسية', cards:'البطاقات', tasks:'المهام', invite:'الدعوة', rank:'الترتيب', profile:'الملف' },
    en: { home:'Home', cards:'Cards', tasks:'Tasks', invite:'Invite', rank:'Rank', profile:'Profile' },
    de: { home:'Start', cards:'Karten', tasks:'Aufgaben', invite:'Einladen', rank:'Rang', profile:'Profil' },
    ru: { home:'Главная', cards:'Карты', tasks:'Задачи', invite:'Пригласить', rank:'Рейтинг', profile:'Профиль' },
    uk: { home:'Головна', cards:'Картки', tasks:'Завдання', invite:'Запросити', rank:'Рейтинг', profile:'Профіль' },
    zh: { home:'主页', cards:'卡片', tasks:'任务', invite:'邀请', rank:'排名', profile:'个人' },
    fa: { home:'خانه', cards:'کارت‌ها', tasks:'وظایف', invite:'دعوت', rank:'رتبه', profile:'پروفایل' }
  };
  var t = texts[lang] || texts['ar'];
  var navBtns = document.querySelectorAll('.nav-btn');
  var keys = ['home','cards','tasks','invite','rank','profile'];
  navBtns.forEach(function(btn, i) {
    if (keys[i]) btn.lastChild.textContent = t[keys[i]];
  });
}

function openSupport() {
  window.Telegram.WebApp.openTelegramLink('https://t.me/Momokhli');
}

// ====== TON CONNECT ======
function connectWallet() {
  try {
    var tc = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://rec-mining-bot.vercel.app/tonconnect-manifest.json',
      buttonRootId: null
    });
    tc.openModal();
  } catch(e) {
    window.Telegram.WebApp.openTelegramLink('https://t.me/wallet');
  }
}

// ====== INIT ======
buildCards();
restoreTasksUI();
updateUI();
