// ==========================================
// REC Mining - app.js - i18n VERSION
// ==========================================

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

var tgUser = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user;
var saveKey = 'recmining_' + (tgUser ? tgUser.id : 'guest');
var CS = window.Telegram.WebApp.CloudStorage || null;

// ====== TRANSLATIONS ======
var T = {
  ar: {
    dir:'rtl', tapMine:'اضغط للتعدين', energyLabel:'⚡ الطاقة',
    miningSpeedLabel:'سرعة التعدين:', upgradesTitle:'الترقيات',
    tapUpgradeTitle:'⚡ ترقية الكبسات', energyUpgradeTitle:'🔋 ترقية الطاقة',
    levelLabel:'المستوى:', costLabel:'التكلفة:', tapsPerClick:'كبسات لكل ضغطة:',
    totalEnergy:'الطاقة الكلية:', upgradeBtn:'ترقية', backBtn:'← رجوع',
    cardsTitle:'🃏 البطاقات', catAnime:'🎌 أنمي', catCars:'🚗 سيارات',
    catClubs:'🌙 ملاهي', catPalaces:'🏰 قصور', cardLevel:'المستوى',
    cardUpgradeBtn:'ترقية ←', cardMaxLevel:'✅ وصلت للمستوى الأقصى!',
    cardMiningBonus:'مكافأة التعدين', cardUpgradeCost:'تكلفة الترقية للمستوى',
    tasksTitle:'✅ المهام', telegramTask:'📱 انضم لجروب تيليغرام',
    joinGroupBtn:'انضم للجروب ←', twitterTask:'🐦 تابع على تويتر',
    followTwitterBtn:'تابع على تويتر ←', getRecord:'احصل على 10,000 RECORD',
    taskDone:'✅ تم الإنجاز',
    inviteTitle:'👥 الدعوة', inviteSubtitle:'ادعو أصدقاءك واربح عملات REC!',
    totalInvited:'إجمالي المدعوين', personJoined:'شخص انضم عبر رابطك',
    milestonesTitle:'🎯 مراحل المكافآت', copyLink:'📋 نسخ الرابط',
    shareBtn:'📤 مشاركة', claimBtn:'احصل! 🎁',
    inviteN:'ادعُ {n} شخص',
    rankTitle:'🏆 الترتيب', yourLevel:'مستواك الحالي', yourBalance:'رصيدك:',
    connectWallet:'ربط المحفظة', support:'💬 الدعم الفني @Momokhli',
    poolWallet:'Pool Wallet', withdrawable:'Withdrawable balance',
    controls:'Controls', withdrawPool:'Withdraw Pool',
    transferPool:'Transfer Pool to Wallet', history:'History',
    yourWithdrawals:'Your withdrawals', comingSoon:'Coming Soon', locked:'Locked',
    navHome:'Home', navCards:'Cards', navTasks:'Tasks', navInvite:'Invite',
    navRank:'Rank', navProfile:'Profile',
    toastCopied:'✅ تم نسخ الرابط!', toastTask:'🎉 حصلت على 10,000 RECORD!',
    toastClaimed:'🎉 حصلت على {n} REC!', toastNotMet:'لم تكمل المتطلب بعد!',
    toastAlready:'أنجزت هذه المهمة مسبقاً!',
  },
  en: {
    dir:'ltr', tapMine:'Tap to Mine', energyLabel:'⚡ Energy',
    miningSpeedLabel:'Mining Speed:', upgradesTitle:'Upgrades',
    tapUpgradeTitle:'⚡ Tap Upgrade', energyUpgradeTitle:'🔋 Energy Upgrade',
    levelLabel:'Level:', costLabel:'Cost:', tapsPerClick:'Taps per click:',
    totalEnergy:'Total Energy:', upgradeBtn:'Upgrade', backBtn:'← Back',
    cardsTitle:'🃏 Cards', catAnime:'🎌 Anime', catCars:'🚗 Cars',
    catClubs:'🌙 Clubs', catPalaces:'🏰 Palaces', cardLevel:'Level',
    cardUpgradeBtn:'Upgrade →', cardMaxLevel:'✅ Max level reached!',
    cardMiningBonus:'Mining Bonus', cardUpgradeCost:'Upgrade cost to level',
    tasksTitle:'✅ Tasks', telegramTask:'📱 Join Telegram Group',
    joinGroupBtn:'Join Group →', twitterTask:'🐦 Follow on Twitter',
    followTwitterBtn:'Follow Twitter →', getRecord:'Get 10,000 RECORD',
    taskDone:'✅ Completed',
    inviteTitle:'👥 Invite', inviteSubtitle:'Invite friends and earn REC!',
    totalInvited:'Total Invited', personJoined:'people joined via your link',
    milestonesTitle:'🎯 Reward Milestones', copyLink:'📋 Copy Link',
    shareBtn:'📤 Share', claimBtn:'Claim! 🎁',
    inviteN:'Invite {n} people',
    rankTitle:'🏆 Ranking', yourLevel:'Your Current Level', yourBalance:'Your Balance:',
    connectWallet:'Connect Wallet', support:'💬 Support @Momokhli',
    poolWallet:'Pool Wallet', withdrawable:'Withdrawable balance',
    controls:'Controls', withdrawPool:'Withdraw Pool',
    transferPool:'Transfer Pool to Wallet', history:'History',
    yourWithdrawals:'Your withdrawals', comingSoon:'Coming Soon', locked:'Locked',
    navHome:'Home', navCards:'Cards', navTasks:'Tasks', navInvite:'Invite',
    navRank:'Rank', navProfile:'Profile',
    toastCopied:'✅ Link Copied!', toastTask:'🎉 Got 10,000 RECORD!',
    toastClaimed:'🎉 Got {n} REC!', toastNotMet:'Requirement not met yet!',
    toastAlready:'Task already completed!',
  },
  uk: {
    dir:'ltr', tapMine:'Натисніть для майнінгу', energyLabel:'⚡ Енергія',
    miningSpeedLabel:'Швидкість майнінгу:', upgradesTitle:'Покращення',
    tapUpgradeTitle:'⚡ Покращення натискань', energyUpgradeTitle:'🔋 Покращення енергії',
    levelLabel:'Рівень:', costLabel:'Вартість:', tapsPerClick:'Натискань за клік:',
    totalEnergy:'Загальна енергія:', upgradeBtn:'Покращити', backBtn:'← Назад',
    cardsTitle:'🃏 Картки', catAnime:'🎌 Аніме', catCars:'🚗 Машини',
    catClubs:'🌙 Клуби', catPalaces:'🏰 Палаци', cardLevel:'Рівень',
    cardUpgradeBtn:'Покращити →', cardMaxLevel:'✅ Максимальний рівень!',
    cardMiningBonus:'Бонус майнінгу', cardUpgradeCost:'Вартість до рівня',
    tasksTitle:'✅ Завдання', telegramTask:'📱 Приєднатися до Telegram',
    joinGroupBtn:'Приєднатися →', twitterTask:'🐦 Підписатися в Twitter',
    followTwitterBtn:'Підписатися →', getRecord:'Отримати 10,000 RECORD',
    taskDone:'✅ Виконано',
    inviteTitle:'👥 Запросити', inviteSubtitle:'Запрошуйте друзів і заробляйте REC!',
    totalInvited:'Всього запрошено', personJoined:'людей приєдналися за посиланням',
    milestonesTitle:'🎯 Етапи винагород', copyLink:'📋 Копіювати посилання',
    shareBtn:'📤 Поділитися', claimBtn:'Отримати! 🎁',
    inviteN:'Запросіть {n} людей',
    rankTitle:'🏆 Рейтинг', yourLevel:'Ваш поточний рівень', yourBalance:'Ваш баланс:',
    connectWallet:'Підключити гаманець', support:'💬 Підтримка @Momokhli',
    poolWallet:'Pool Wallet', withdrawable:'Доступний баланс',
    controls:'Управління', withdrawPool:'Вивести Pool',
    transferPool:'Перевести Pool в гаманець', history:'Історія',
    yourWithdrawals:'Ваші виведення', comingSoon:'Незабаром', locked:'Заблоковано',
    navHome:'Home', navCards:'Cards', navTasks:'Tasks', navInvite:'Invite',
    navRank:'Rank', navProfile:'Profile',
    toastCopied:'✅ Посилання скопійовано!', toastTask:'🎉 Отримано 10,000 RECORD!',
    toastClaimed:'🎉 Отримано {n} REC!', toastNotMet:'Вимога не виконана!',
    toastAlready:'Завдання вже виконано!',
  },
  zh: {
    dir:'ltr', tapMine:'点击挖矿', energyLabel:'⚡ 能量',
    miningSpeedLabel:'挖矿速度:', upgradesTitle:'升级',
    tapUpgradeTitle:'⚡ 点击升级', energyUpgradeTitle:'🔋 能量升级',
    levelLabel:'等级:', costLabel:'费用:', tapsPerClick:'每次点击次数:',
    totalEnergy:'总能量:', upgradeBtn:'升级', backBtn:'← 返回',
    cardsTitle:'🃏 卡片', catAnime:'🎌 动漫', catCars:'🚗 汽车',
    catClubs:'🌙 夜总会', catPalaces:'🏰 宫殿', cardLevel:'等级',
    cardUpgradeBtn:'升级 →', cardMaxLevel:'✅ 已达最高等级!',
    cardMiningBonus:'挖矿奖励', cardUpgradeCost:'升到等级所需费用',
    tasksTitle:'✅ 任务', telegramTask:'📱 加入Telegram群组',
    joinGroupBtn:'加入群组 →', twitterTask:'🐦 在推特关注',
    followTwitterBtn:'在推特关注 →', getRecord:'获得 10,000 RECORD',
    taskDone:'✅ 已完成',
    inviteTitle:'👥 邀请', inviteSubtitle:'邀请朋友赚取REC!',
    totalInvited:'总邀请人数', personJoined:'人通过您的链接加入',
    milestonesTitle:'🎯 奖励里程碑', copyLink:'📋 复制链接',
    shareBtn:'📤 分享', claimBtn:'领取! 🎁',
    inviteN:'邀请{n}人',
    rankTitle:'🏆 排名', yourLevel:'您的当前级别', yourBalance:'您的余额:',
    connectWallet:'连接钱包', support:'💬 技术支持 @Momokhli',
    poolWallet:'Pool Wallet', withdrawable:'可提现余额',
    controls:'操作', withdrawPool:'提取Pool',
    transferPool:'将Pool转入钱包', history:'历史',
    yourWithdrawals:'您的提现记录', comingSoon:'即将推出', locked:'已锁定',
    navHome:'Home', navCards:'Cards', navTasks:'Tasks', navInvite:'Invite',
    navRank:'Rank', navProfile:'Profile',
    toastCopied:'✅ 链接已复制!', toastTask:'🎉 获得10,000 RECORD!',
    toastClaimed:'🎉 获得{n} REC!', toastNotMet:'尚未满足要求!',
    toastAlready:'任务已完成!',
  }
};

var currentLang = 'ar';
try {
  var sl = localStorage.getItem('lang_' + saveKey);
  if (sl && T[sl]) currentLang = sl;
} catch(e) {}

function t(key, params) {
  var tr = T[currentLang] || T.ar;
  var str = tr[key] !== undefined ? tr[key] : (T.ar[key] || key);
  if (params) {
    Object.keys(params).forEach(function(k) { str = str.replace('{' + k, params[k]); });
  }
  return str;
}

function applyLang(lang) {
  if (!T[lang]) return;
  currentLang = lang;
  try { localStorage.setItem('lang_' + saveKey, lang); } catch(e) {}
  if (CS) { try { CS.setItem('userLang', lang); } catch(e) {} }
  var dir = T[lang].dir;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', dir);
  document.body.style.direction = dir;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  buildMilestones();
  restoreTasksUI();
  closeLangMenu();
}

function toggleLangMenu() {
  var m=document.getElementById('langDropdown');
  var o=document.getElementById('langOverlay');
  if(!m)return;
  var show=m.style.display==='none';
  m.style.display=show?'block':'none';
  if(o)o.style.display=show?'block':'none';
}
function closeLangMenu() {
  var m=document.getElementById('langDropdown');
  var o=document.getElementById('langOverlay');
  if(m)m.style.display='none';
  if(o)o.style.display='none';
}

// ====== LOAD DATA ======
var defaultData = {
  record:0, rec:0, energy:1000, maxEnergy:1000,
  tapLevelVal:0, energyLevelVal:0, tapPowerVal:1, miningSpeed:0.000001,
  completedTasks:[], cardLevels:{}, refCount:0, claimedMilest:[]
};
var G = Object.assign({}, defaultData);
try { var ls = JSON.parse(localStorage.getItem(saveKey)); if (ls) G = Object.assign({}, defaultData, ls); } catch(e) {}

var record, rec, energy, maxEnergy, tapLevelVal, energyLevelVal,
    tapPowerVal, miningSpeed, completedTasks, cardLevels, refCount, claimedMilest;

function applyData(d) {
  record=d.record||0; rec=d.rec||0; energy=d.energy!==undefined?d.energy:1000;
  maxEnergy=d.maxEnergy||1000; tapLevelVal=d.tapLevelVal||0;
  energyLevelVal=d.energyLevelVal||0; tapPowerVal=d.tapPowerVal||1;
  miningSpeed=d.miningSpeed||0.000001; completedTasks=d.completedTasks||[];
  cardLevels=d.cardLevels||{}; refCount=d.refCount||0; claimedMilest=d.claimedMilest||[];
}
applyData(G);

if (CS) {
  CS.getItem('gameData', function(err, val) {
    if (!err && val) { try { var cd=JSON.parse(val); if(cd.record>=record){applyData(cd);updateUI();buildMilestones();restoreTasksUI();} } catch(e){} }
  });
  CS.getItem('userLang', function(err, val) {
    if (!err && val && T[val]) { currentLang = val; applyLang(val); }
  });
}

function saveData() {
  var d = JSON.stringify({record,rec,energy,maxEnergy,tapLevelVal,energyLevelVal,tapPowerVal,miningSpeed,completedTasks,cardLevels,refCount,claimedMilest});
  try { localStorage.setItem(saveKey, d); } catch(e) {}
  if (CS) { try { CS.setItem('gameData', d); } catch(e) {} }
}

// ====== TOAST ======
function showToast(msg) {
  var toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.style.cssText = 'position:fixed;bottom:75px;left:50%;transform:translateX(-50%);background:rgba(25,25,25,0.96);color:white;padding:10px 22px;border-radius:20px;font-size:14px;z-index:9999;border:1px solid #444;pointer-events:none;opacity:0;transition:opacity 0.25s;white-space:nowrap;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(function() { toast.style.opacity = '0'; }, 2200);
}

// ====== NAVIGATION ======
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  closeLangMenu();
}

// ====== HOME ======
function tap() {
  if (energy <= 0) return;
  energy = Math.max(0, energy - tapPowerVal);
  record += tapPowerVal;
  saveData(); updateUI();
}

setInterval(function() {
  rec += miningSpeed * 3;
  if (energy < maxEnergy) energy = Math.min(maxEnergy, energy + 5);
  saveData(); updateUI();
}, 3000);

function updateUI() {
  var s = function(id, v) { var e=document.getElementById(id); if(e) e.textContent=v; };
  s('recordCount', Math.floor(record).toLocaleString());
  s('recAmount', rec.toFixed(6));
  s('recMini', rec.toFixed(6));
  s('energyText', Math.floor(energy)+' / '+maxEnergy);
  s('miningSpeedShow', miningSpeed.toFixed(6));
  s('profileRecord', Math.floor(record).toLocaleString());
  s('recPoolBalance', rec.toFixed(6));
  var eb=document.getElementById('energyBar'); if(eb) eb.style.width=(energy/maxEnergy*100)+'%';
  var m=getMyMedal();
  var mrn=document.getElementById('myRankName'); if(mrn){mrn.textContent=m.name;mrn.style.color=m.color;}
  s('myRankRecord', Math.floor(record).toLocaleString());
  s('refCountDisplay', refCount);
}

// ====== UPGRADE ======
function getTapCost(l){return Math.floor(50*Math.pow(2,Math.floor(l/5)));}
function getEnergyCost(l){return Math.floor(50*Math.pow(2,Math.floor(l/5)));}
function openUpgrade(){updateUpgradeUI();document.getElementById('upgradePage').classList.add('open');}

function upgradeTap() {
  var cost=getTapCost(tapLevelVal);
  if(record<cost||tapLevelVal>=100)return;
  record-=cost;tapLevelVal++;tapPowerVal=1+Math.floor(tapLevelVal/5);miningSpeed+=0.000002;
  saveData();updateUpgradeUI();updateUI();
}
function upgradeEnergy() {
  var cost=getEnergyCost(energyLevelVal);
  if(record<cost||energyLevelVal>=100)return;
  record-=cost;energyLevelVal++;maxEnergy=1000+energyLevelVal*500;
  saveData();updateUpgradeUI();updateUI();
}
function updateUpgradeUI() {
  var s=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  s('tapLevel',tapLevelVal);s('energyLevel',energyLevelVal);
  s('tapCost',getTapCost(tapLevelVal).toLocaleString());
  s('energyCost',getEnergyCost(energyLevelVal).toLocaleString());
  s('tapPower',tapPowerVal);s('maxEnergyShow',maxEnergy.toLocaleString());
  var tb=document.getElementById('tapUpgradeBtn');if(tb)tb.disabled=record<getTapCost(tapLevelVal)||tapLevelVal>=100;
  var eb=document.getElementById('energyUpgradeBtn');if(eb)eb.disabled=record<getEnergyCost(energyLevelVal)||energyLevelVal>=100;
}

// ====== CARDS ======
var categories = [
  {nameKey:'catAnime', cards:[
    {n:'ناروتو',e:'🍥'},{n:'غوكو',e:'⚡'},{n:'لوفي',e:'🏴‍☠️'},{n:'ساسكي',e:'🌩️'},
    {n:'إيتاشي',e:'🌸'},{n:'زورو',e:'⚔️'},{n:'توتورو',e:'🌿'},{n:'ميكاسا',e:'🗡️'},
    {n:'ليفاي',e:'💨'},{n:'إيرين',e:'🔑'},{n:'آرمين',e:'📚'},{n:'بيكولو',e:'👁️'},
    {n:'فيجيتا',e:'👑'},{n:'ناتسو',e:'🔥'},{n:'غراي',e:'❄️'},{n:'إيرزا',e:'🛡️'},
    {n:'لوسي',e:'⭐'},{n:'كيريتو',e:'🗡️'},{n:'أسونا',e:'🌹'},{n:'غون',e:'🌟'},
    {n:'كيليوا',e:'⚡'},{n:'كوروكو',e:'🏀'},{n:'أكاشي',e:'🎯'},{n:'زيرو تو',e:'🦋'},
    {n:'ريم',e:'💙'},{n:'إيميلي',e:'💛'},{n:'يوميكو',e:'🌙'},{n:'ماكيما',e:'🔗'},
    {n:'باور',e:'🩸'},{n:'دينجي',e:'⛓️'},{n:'غوجو',e:'🌀'},{n:'يوجي',e:'👊'},
    {n:'تانجيرو',e:'💧'},{n:'نيزوكو',e:'🎋'},{n:'زينيتسو',e:'⚡'},{n:'إينوسكي',e:'🐗'},
    {n:'إيزوكو',e:'💚'},{n:'كاتسوكي',e:'💥'},{n:'شوتو',e:'🌓'},{n:'تسويو',e:'🐸'},
    {n:'إيتشيغو',e:'🌙'},{n:'ريوكيا',e:'❄️'},{n:'أوريهيمي',e:'🌸'},{n:'شاد',e:'🦾'},
    {n:'سينجي',e:'🤖'},{n:'ريي',e:'👁️'},{n:'آسوكا',e:'🔥'},{n:'كازوما',e:'💰'},
    {n:'أكوا',e:'💧'},{n:'ميغومين',e:'💥'},{n:'يوريتشي',e:'☀️'},{n:'رينغوكو',e:'🔥'},
    {n:'تانجيرو',e:'💧'},{n:'أكازا',e:'🌺'},{n:'موزان',e:'🌙'},{n:'تشيهيرو',e:'🏮'},
    {n:'هاول',e:'🔥'},{n:'كيكي',e:'🧹'},{n:'نوسيكا',e:'🌿'},{n:'سوفي',e:'🌺'}
  ]},
  {nameKey:'catCars', cards:[
    {n:'Ferrari SF90',e:'🔴'},{n:'Lamborghini Aventador',e:'🟡'},{n:'Bugatti Chiron',e:'🔵'},
    {n:'McLaren P1',e:'🟠'},{n:'Porsche 911',e:'⚫'},{n:'Mercedes AMG GT',e:'⬛'},
    {n:'BMW M8',e:'🔵'},{n:'Audi R8',e:'⚪'},{n:'Koenigsegg Jesko',e:'🟢'},
    {n:'Pagani Huayra',e:'🥈'},{n:'Rolls Royce Ghost',e:'⬜'},{n:'Bentley Continental',e:'🟤'},
    {n:'Aston Martin DB11',e:'🟢'},{n:'Maserati MC20',e:'🔴'},{n:'Ferrari Roma',e:'🔴'},
    {n:'Lamborghini Urus',e:'🟡'},{n:'Porsche Cayenne',e:'⚫'},{n:'McLaren GT',e:'🟠'},
    {n:'Rimac Nevera',e:'⚡'},{n:'Tesla Roadster',e:'🔴'},{n:'Dodge Viper',e:'🔴'},
    {n:'Ford GT',e:'🔵'},{n:'Chevrolet Corvette',e:'🟡'},{n:'Nissan GT-R',e:'⬛'},
    {n:'Toyota Supra',e:'🟠'},{n:'Mazda RX-7',e:'🔴'},{n:'Honda NSX',e:'⬛'},
    {n:'Ferrari 458',e:'🔴'},{n:'Lamborghini Huracan',e:'🟡'},{n:'McLaren 720S',e:'🟠'},
    {n:'Ferrari LaFerrari',e:'🔴'},{n:'McLaren Speedtail',e:'🟠'},{n:'Bugatti Divo',e:'🔵'},
    {n:'Porsche 918',e:'⚫'},{n:'Ferrari Enzo',e:'🔴'},{n:'McLaren F1',e:'🟠'},
    {n:'Jaguar F-Type',e:'🟢'},{n:'Ferrari F40',e:'🔴'},{n:'Ferrari F50',e:'🔴'},
    {n:'Porsche Carrera GT',e:'⚫'},{n:'McLaren Senna',e:'🟠'}
  ]},
  {nameKey:'catClubs', cards:[
    {n:'Omnia Dubai',e:'🌃'},{n:'Pacha Ibiza',e:'🏝️'},{n:'Berghain Berlin',e:'⬛'},
    {n:'Fabric London',e:'🇬🇧'},{n:'Amnesia Ibiza',e:'🌊'},{n:'DC10 Ibiza',e:'🎵'},
    {n:'Marquee NYC',e:'🗽'},{n:'LIV Miami',e:'🌴'},{n:'E11even Miami',e:'🔥'},
    {n:'Hakkasan Vegas',e:'🎰'},{n:'Omnia Vegas',e:'💎'},{n:'XS Vegas',e:'✨'},
    {n:'Womb Tokyo',e:'🎌'},{n:'Zuma Dubai',e:'🌟'},{n:'White Dubai',e:'⬜'},
    {n:'Ministry of Sound',e:'🔊'},{n:'Rex Club Paris',e:'🇫🇷'},{n:'Tresor Berlin',e:'💎'},
    {n:'Watergate Berlin',e:'🌊'},{n:'Shelter Amsterdam',e:'🏠'},
    {n:'Printworks London',e:'🖨️'},{n:'Output Brooklyn',e:'🗽'},
    {n:'Exchange LA',e:'🎵'},{n:'Nyx Athens',e:'🇬🇷'},{n:'Void Athens',e:'🕳️'}
  ]},
  {nameKey:'catPalaces', cards:[
    {n:'قصر بكنغهام',e:'👑'},{n:'قصر فرساي',e:'🌹'},{n:'قصر الحمراء',e:'🌺'},
    {n:'قصر نويشفانشتاين',e:'❄️'},{n:'قصر توبكابي',e:'🌙'},{n:'قصر الكرملين',e:'⭐'},
    {n:'قصر شينبرون',e:'🟡'},{n:'قصر موناكو',e:'🎰'},{n:'قصر مدريد',e:'🔴'},
    {n:'قصر براغ',e:'🧙'},{n:'قصر بودابست',e:'🌉'},{n:'قصر وارسو',e:'🦅'},
    {n:'قصر ستوكهولم',e:'⭐'},{n:'قصر أمستردام',e:'🌷'},{n:'قصر فيينا',e:'🎵'},
    {n:'قصر دبي',e:'🏙️'},{n:'قصر أبوظبي',e:'🕌'},{n:'قصر الرياض',e:'🌴'},
    {n:'قصر القاهرة',e:'🏺'},{n:'قصر مراكش',e:'🌺'},{n:'قصر إسطنبول',e:'🌙'},
    {n:'قصر مومباي',e:'🕌'},{n:'قصر طوكيو',e:'🌸'},{n:'قصر كيوتو',e:'⛩️'},
    {n:'قصر بكين',e:'🐉'},{n:'قصر شنغهاي',e:'🌆'},{n:'قصر سيول',e:'🎎'},
    {n:'قصر لندن',e:'👑'},{n:'قصر باريس',e:'🗼'},{n:'قصر واشنطن',e:'🏛️'}
  ]}
];

function buildCards() {
  categories.forEach(function(cat, ci) {
    var grid = document.getElementById('cat-'+ci);
    if (!grid) return;
    grid.innerHTML = '';
    cat.cards.forEach(function(card, idx) {
      var key = ci+'_'+idx;
      if (!cardLevels[key]) cardLevels[key] = 0;
      var div = document.createElement('div');
      div.className = 'card-item';
      div.setAttribute('data-ci', ci); div.setAttribute('data-idx', idx);
      div.onclick = function(){openCard(+this.getAttribute('data-ci'),+this.getAttribute('data-idx'));};
      var lvl = cardLevels[key];
      div.innerHTML = '<div class="card-emoji">'+card.e+'</div>' +
        '<div class="card-name">'+card.n+'</div>' +
        '<div class="card-level">LVL '+lvl+'</div>' +
        '<div class="card-speed">+' +(lvl*0.000001).toFixed(6)+' REC/ث</div>';
      grid.appendChild(div);
    });
  });
}

function openCard(ci, idx) {
  var key=ci+'_'+idx; var card=categories[ci].cards[idx];
  var lvl=cardLevels[key]||0;
  var cost=lvl===0?100:lvl===1?300:lvl===2?500:Math.floor(500*Math.pow(1.5,lvl-2));
  var canUpgrade=record>=cost&&lvl<100;
  document.getElementById('cardDetail').innerHTML =
    '<div style="text-align:center;margin-bottom:20px;">' +
    '<div style="font-size:80px;">'+card.e+'</div>' +
    '<div style="font-size:22px;margin:10px 0;">'+card.n+'</div>' +
    '<div style="color:#FF0000;font-size:16px;">'+t('cardLevel')+' '+lvl+' / 100</div></div>' +
    '<div class="info-card"><div style="color:#aaa;font-size:12px;margin-bottom:5px;">'+t('cardMiningBonus')+'</div>' +
    '<div style="color:#FF0000;">+'+(lvl*0.000001).toFixed(6)+' REC/s</div></div>' +
    '<div class="info-card"><div style="color:#aaa;font-size:12px;margin-bottom:5px;">'+t('cardUpgradeCost')+' '+(lvl+1)+'</div>' +
    '<div>'+cost.toLocaleString()+' RECORD</div></div>' +
    (lvl<100?'<button class="do-btn"'+(canUpgrade?'':' disabled')+' onclick="upgradeCard('+ci+','+idx+')">'+t('cardUpgradeBtn')+' '+cost.toLocaleString()+' RECORD</button>':
    '<div style="text-align:center;color:#FFD700;margin-top:15px;">'+t('cardMaxLevel')+'</div>');
  document.getElementById('cardModal').classList.add('open');
}

function upgradeCard(ci, idx) {
  var key=ci+'_'+idx; var lvl=cardLevels[key]||0;
  var cost=lvl===0?100:lvl===1?300:lvl===2?500:Math.floor(500*Math.pow(1.5,lvl-2));
  if(record<cost||lvl>=100)return;
  record-=cost; cardLevels[key]=lvl+1; miningSpeed+=0.000001;
  saveData(); openCard(ci,idx); updateUI();
}

function showCategory(idx, btn) {
  document.querySelectorAll('.card-grid').forEach(function(g){g.style.display='none';});
  document.querySelectorAll('.cat-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById('cat-'+idx).style.display='grid';
  btn.classList.add('active');
}

// ====== TASKS ======
function joinAndWait(type, joinBtnId, claimBtnId) {
  if(type==='telegram') window.Telegram.WebApp.openTelegramLink('https://t.me/Momokh1');
  else window.Telegram.WebApp.openLink('https://x.com/mohamma33122570');
  var jb=document.getElementById(joinBtnId); var cb=document.getElementById(claimBtnId);
  if(!jb||!cb)return;
  jb.disabled=true; var sec=30; jb.textContent='⏳ '+sec+'s...';
  var timer=setInterval(function(){
    sec--; jb.textContent='⏳ '+sec+'s...';
    if(sec<=0){clearInterval(timer);jb.style.display='none';cb.disabled=false;}
  },1000);
}

function claimTask(type, btnId, joinBtnId) {
  if(completedTasks.indexOf(type)!==-1){showToast(t('toastAlready'));return;}
  completedTasks.push(type); record+=10000;
  var btn=document.getElementById(btnId);
  if(btn){btn.textContent=t('taskDone');btn.disabled=true;btn.classList.add('done');}
  var jb=document.getElementById(joinBtnId); if(jb)jb.style.display='none';
  saveData();updateUI();showToast(t('toastTask'));
}

function restoreTasksUI() {
  if(completedTasks.indexOf('telegram')!==-1){
    var b=document.getElementById('task1Btn');
    if(b){b.textContent=t('taskDone');b.disabled=true;b.classList.add('done');}
    var j=document.getElementById('task1JoinBtn');if(j)j.style.display='none';
  }
  if(completedTasks.indexOf('twitter')!==-1){
    var b2=document.getElementById('task2Btn');
    if(b2){b2.textContent=t('taskDone');b2.disabled=true;b2.classList.add('done');}
    var j2=document.getElementById('task2JoinBtn');if(j2)j2.style.display='none';
  }
}

// ====== REFERRAL MILESTONES ======
var refMilestones = [
  {req:5,  reward:5},  {req:10, reward:15},
  {req:30, reward:50}, {req:50, reward:100}, {req:100,reward:500}
];

function buildMilestones() {
  var cont=document.getElementById('milestonesContainer'); if(!cont)return;
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
    card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:'+(claimed?'0':'8px')+';">' +
      '<div><div style="font-size:13px;color:'+(claimed?'#4eff4e':'white')+';">'+t('inviteN',{n:m.req})+'</div>' +
      '<div style="font-size:12px;color:#00FF88;margin-top:3px;">🟢 + '+m.reward+' REC</div></div>'+badge+'</div>'+
      (!claimed?'<div style="background:#2a2a2a;border-radius:6px;height:5px;overflow:hidden;"><div style="width:'+pct+'%;height:100%;background:'+(canClaim?'#FF0000':'linear-gradient(90deg,#FF0000,#ff6600)')+';border-radius:6px;transition:width 0.4s;"></div></div>':'');
    cont.appendChild(card);
  });
  var rd=document.getElementById('refCountDisplay'); if(rd)rd.textContent=refCount;
}

function claimMilestone(i) {
  if(claimedMilest.indexOf(i)!==-1)return;
  if(refCount<refMilestones[i].req){showToast(t('toastNotMet'));return;}
  claimedMilest.push(i); rec+=refMilestones[i].reward;
  saveData();buildMilestones();updateUI();
  showToast(t('toastClaimed',{n:refMilestones[i].reward}));
}

// ====== INVITE ======
function copyInvite() {
  var userId=tgUser?tgUser.id:'0';
  var link='https://t.me/RecMiningGame_bot?start=ref'+userId;
  if(navigator&&navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(link).then(function(){showToast(t('toastCopied'));}).catch(function(){showToast('🔗 '+link);});
  } else { showToast('🔗 '+link); }
}

function shareInvite() {
  var userId=tgUser?tgUser.id:'0';
  var link='https://t.me/RecMiningGame_bot?start=ref'+userId;
  window.Telegram.WebApp.openTelegramLink('https://t.me/share/url?url='+encodeURIComponent(link)+'&text='+encodeURIComponent('🔴 REC Mining\n\n👇'));
}

// ====== RANK ======
var medals=[
  {name:'Bronze I',  emoji:'🥉',color:'#CD7F32',range:'0 - 1M',     min:0},
  {name:'Bronze II', emoji:'🥉',color:'#CD7F32',range:'1M - 5M',    min:1000000},
  {name:'Bronze III',emoji:'🥉',color:'#CD7F32',range:'5M - 10M',   min:5000000},
  {name:'Silver I',  emoji:'🥈',color:'#C0C0C0',range:'10M - 25M',  min:10000000},
  {name:'Silver II', emoji:'🥈',color:'#C0C0C0',range:'25M - 50M',  min:25000000},
  {name:'Silver III',emoji:'🥈',color:'#C0C0C0',range:'50M - 100M', min:50000000},
  {name:'Gold I',    emoji:'🥇',color:'#FFD700',range:'100M - 250M',min:100000000},
  {name:'Gold II',   emoji:'🥇',color:'#FFD700',range:'250M - 500M',min:250000000},
  {name:'Gold III',  emoji:'🥇',color:'#FFD700',range:'500M - 1B',  min:500000000},
  {name:'Platinum',  emoji:'💎',color:'#E5E4E2',range:'1B - 5B',    min:1000000000},
  {name:'Diamond',   emoji:'💠',color:'#00BFFF',range:'5B - 10B',   min:5000000000},
  {name:'Legendary', emoji:'👑',color:'#FF0000',range:'10B+',       min:10000000000}
];
var currentMedalIndex=0;
function changeMedal(dir){
  currentMedalIndex=Math.max(0,Math.min(medals.length-1,currentMedalIndex+dir));
  var m=medals[currentMedalIndex];
  var s=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  s('medalEmoji',m.emoji);s('medalName',m.name);s('medalRange',m.range+' RECORD');
  var mn=document.getElementById('medalName');if(mn)mn.style.color=m.color;
  var mb=document.getElementById('medalBox');if(mb)mb.style.borderColor=m.color;
}
function getMyMedal(){
  for(var i=medals.length-1;i>=0;i--){if(record>=medals[i].min)return medals[i];}
  return medals[0];
}

// ====== PROFILE ======
function openSupport(){window.Telegram.WebApp.openTelegramLink('https://t.me/Momokhli');}
function connectWallet(){window.Telegram.WebApp.openTelegramLink('https://t.me/wallet');}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', function() {
  if(tgUser){
    var name=tgUser.first_name+(tgUser.last_name?' '+tgUser.last_name:'');
    var el=document.getElementById('profileName');if(el)el.textContent=name;
    var idEl=document.getElementById('profileId');if(idEl)idEl.textContent=tgUser.id;
  }
  applyLang(currentLang);
  buildCards();
  buildMilestones();
  restoreTasksUI();
  updateUI();
});
