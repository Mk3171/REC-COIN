// Safe initialization
try { window.Telegram.WebApp.ready(); } catch(e) {}
try { window.Telegram.WebApp.expand(); } catch(e) {}

// Fix viewport height for iOS touch issues
function fixViewport() {
  try {
    var h = window.Telegram.WebApp.viewportStableHeight || window.innerHeight;
    var wrap = document.getElementById('appWrapper');
    if (wrap) wrap.style.height = h + 'px';
  } catch(e) {}
}
try { window.Telegram.WebApp.onEvent('viewportChanged', fixViewport); } catch(e) {}

var tgUser = window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user;
var saveKey = 'recmining_' + (tgUser ? tgUser.id : 'guest');
var CS = window.Telegram.WebApp.CloudStorage || null;

// ====== TRANSLATIONS ======
var T = {
  ar:{dir:'rtl',tapMine:'اضغط للتعدين',energyLabel:'⚡ الطاقة',miningSpeedLabel:'تعدين REC:',recordSpeedLabel:'تعدين RECORD:',upgradesTitle:'الترقيات',tapUpgradeTitle:'⚡ ترقية الكبسات',energyUpgradeTitle:'🔋 ترقية الطاقة',levelLabel:'المستوى:',costLabel:'التكلفة:',tapsPerClick:'كبسات لكل ضغطة:',totalEnergy:'الطاقة الكلية:',upgradeBtn:'ترقية',backBtn:'← رجوع',cardsTitle:'🃏 البطاقات',catAnime:'🎌 أنمي',catCars:'🚗 سيارات',catClubs:'🌙 ملاهي',catPalaces:'🏰 قصور',cardLevel:'المستوى',cardUpgradeBtn:'ترقية',cardMaxLevel:'✅ وصلت للمستوى الأقصى!',cardMiningBonus:'تعدين هذه البطاقة',cardUpgradeCost:'تكلفة الترقية',cardWaitTime:'وقت الانتظار',upgrading:'⏳ جاري الترقية...',upgradeReady:'✅ جاهز',noMining:'⛔ لا يوجد تعدين - رقّ بطاقة أولاً',tasksTitle:'✅ المهام',telegramTask:'📱 انضم لجروب تيليغرام',joinGroupBtn:'انضم للجروب ←',twitterTask:'🐦 تابع على تويتر',followTwitterBtn:'تابع على تويتر ←',getRecord:'احصل على 10,000 RECORD',taskDone:'✅ تم الإنجاز',inviteTitle:'👥 الدعوة',inviteSubtitle:'ادعو أصدقاءك واربح عملات REC!',totalInvited:'إجمالي المدعوين',personJoined:'شخص انضم عبر رابطك',milestonesTitle:'🎯 مراحل المكافآت',copyLink:'📋 نسخ الرابط',shareBtn:'📤 مشاركة',claimBtn:'احصل! 🎁',inviteN:'ادعُ {n} شخص',rankTitle:'🏆 الترتيب',yourLevel:'مستواك الحالي',yourBalance:'رصيدك:',connectWallet:'ربط المحفظة',support:'💬 الدعم الفني @Momokhli',poolWallet:'Pool Wallet',withdrawable:'Withdrawable balance',controls:'Controls',withdrawPool:'Withdraw Pool',transferPool:'Transfer Pool to Wallet',history:'History',yourWithdrawals:'Your withdrawals',comingSoon:'Coming Soon',locked:'Locked',navHome:'Home',navCards:'Cards',navTasks:'Tasks',navInvite:'Invite',navRank:'Rank',navProfile:'Profile',toastCopied:'✅ تم نسخ الرابط!',toastTask:'🎉 حصلت على 10,000 RECORD!',toastClaimed:'🎉 حصلت على {n} REC!',toastNotMet:'لم تكمل المتطلب بعد!',toastAlready:'أنجزت هذه المهمة مسبقاً!',toastUpgradeStart:'⏳ بدأت ترقية البطاقة!',toastUpgradeDone:'🎉 تمت الترقية!',toastNotEnoughRecord:'رصيد RECORD غير كافٍ!',toastAlreadyUpgrading:'البطاقة قيد الترقية!',withdrawalBtn:'سحب',withdrawTitle:'سحب REC',withdrawSubtitle:'سحب عملة REC الحقيقية لمحفظتك',withdrawBalance:'رصيدك المتاح',withdrawMin:'الحد الأدنى',withdrawFee:'رسوم السحب',withdrawDaily:'الحد اليومي المتبقي',withdrawAmount:'الكمية المراد سحبها',withdrawBtn:'🏛️ سحب REC الآن',withdrawReceive:'ستصلك:',withdrawAfterFee:'بعد خصم الرسوم',withdrawMinErr:'الحد الأدنى {n} REC',withdrawSuccess:'✅ تم إرسال {n} REC لمحفظتك!',withdrawNoWallet:'❌ ربط محفظة TON أولاً!',withdrawLowBal:'❌ رصيدك غير كافٍ',withdrawDailyErr:'❌ وصلت الحد اليومي. تبقى: {n} REC',withdrawFailed:'❌ فشل السحب',withdrawLoading:'⏳ جاري الإرسال...',rankTitle:'🏆 المتصدرون',tabGlobal:'🌍 عالمي',tabFriends:'👥 أصدقاء',tabMyLevel:'📊 مستواي',myRankLabel:'ترتيبك العالمي',weeklyChallenge:'🏆 التحدي الأسبوعي',weeklyPrize:'جائزة 1,000 REC',daysLeft:'يوم متبقي',loadingLeader:'⏳ جاري التحميل...',noFriends:'لم تدعُ أحداً بعد',totalMined:'إجمالي REC المعدن',sinceJoined:'منذ انضمامك',top100only:'أول 100 مشترك فقط',rewardDist:'توزيع المكافآت',rankReward:'مكافأتك المتوقعة',shopTitle:'متجر النجوم',shopSubtitle:'ادعم المشروع واحصل على مكافآت فورية!',shopNote:'⭐ النجوم تشترى من تيليغرام مباشرة',shopEnergy:'⚡ شحن طاقة فوري',shopEnergyDesc:'يرجع طاقتك كاملة فوراً',shopRecord500:'💰 500,000 RECORD',shopRecord500Desc:'تضاف فوراً لرصيدك',shopRecord3m:'💰 3,000,000 RECORD',shopRecord3mDesc:'الأفضل قيمة ⭐',shopSkip:'🚀 تخطي وقت الانتظار',shopSkipDesc:'أكمل ترقية البطاقة فوراً',toastInvoiceLoading:'⏳ جاري تحضير الفاتورة...',toastPaid:'✅ تم الدفع بنجاح! جاري تحديث رصيدك...',toastCancelled:'تم إلغاء الدفع',toastFailed:'❌ فشل الدفع، حاول مرة أخرى',toastConnError:'❌ خطأ في الاتصال بالسيرفر'},
  en:{dir:'ltr',tapMine:'Tap to Mine',energyLabel:'⚡ Energy',miningSpeedLabel:'REC Mining:',recordSpeedLabel:'RECORD Mining:',upgradesTitle:'Upgrades',tapUpgradeTitle:'⚡ Tap Upgrade',energyUpgradeTitle:'🔋 Energy Upgrade',levelLabel:'Level:',costLabel:'Cost:',tapsPerClick:'Taps per click:',totalEnergy:'Total Energy:',upgradeBtn:'Upgrade',backBtn:'← Back',cardsTitle:'🃏 Cards',catAnime:'🎌 Anime',catCars:'🚗 Cars',catClubs:'🌙 Clubs',catPalaces:'🏰 Palaces',cardLevel:'Level',cardUpgradeBtn:'Upgrade',cardMaxLevel:'✅ Max level reached!',cardMiningBonus:'Card Mining',cardUpgradeCost:'Upgrade Cost',cardWaitTime:'Wait Time',upgrading:'⏳ Upgrading...',upgradeReady:'✅ Ready',noMining:'⛔ No mining — upgrade a card first',tasksTitle:'✅ Tasks',telegramTask:'📱 Join Telegram Group',joinGroupBtn:'Join Group →',twitterTask:'🐦 Follow on Twitter',followTwitterBtn:'Follow Twitter →',getRecord:'Get 10,000 RECORD',taskDone:'✅ Completed',inviteTitle:'👥 Invite',inviteSubtitle:'Invite friends and earn REC!',totalInvited:'Total Invited',personJoined:'people joined via your link',milestonesTitle:'🎯 Reward Milestones',copyLink:'📋 Copy Link',shareBtn:'📤 Share',claimBtn:'Claim! 🎁',inviteN:'Invite {n} people',rankTitle:'🏆 Ranking',yourLevel:'Your Current Level',yourBalance:'Your Balance:',connectWallet:'Connect Wallet',support:'💬 Support @Momokhli',poolWallet:'Pool Wallet',withdrawable:'Withdrawable balance',controls:'Controls',withdrawPool:'Withdraw Pool',transferPool:'Transfer Pool to Wallet',history:'History',yourWithdrawals:'Your withdrawals',comingSoon:'Coming Soon',locked:'Locked',navHome:'Home',navCards:'Cards',navTasks:'Tasks',navInvite:'Invite',navRank:'Rank',navProfile:'Profile',toastCopied:'✅ Link Copied!',toastTask:'🎉 Got 10,000 RECORD!',toastClaimed:'🎉 Got {n} REC!',toastNotMet:'Requirement not met!',toastAlready:'Task already completed!',toastUpgradeStart:'⏳ Card upgrade started!',toastUpgradeDone:'🎉 Upgrade complete!',toastNotEnoughRecord:'Not enough RECORD!',toastAlreadyUpgrading:'Card already upgrading!',withdrawalBtn:'Withdrawal',withdrawTitle:'Withdraw REC',withdrawSubtitle:'Withdraw real REC to your wallet',withdrawBalance:'Available Balance',withdrawMin:'Minimum',withdrawFee:'Fee',withdrawDaily:'Daily Remaining',withdrawAmount:'Amount to withdraw',withdrawBtn:'🏛️ Withdraw REC Now',withdrawReceive:'You will receive:',withdrawAfterFee:'after fee',withdrawMinErr:'Minimum {n} REC',withdrawSuccess:'✅ Sent {n} REC to your wallet!',withdrawNoWallet:'❌ Connect TON wallet first!',withdrawLowBal:'❌ Insufficient balance',withdrawDailyErr:'❌ Daily limit reached. Remaining: {n} REC',withdrawFailed:'❌ Withdrawal failed',withdrawLoading:'⏳ Sending...',rankTitle:'🏆 LEADERBOARD',tabGlobal:'🌍 Global',tabFriends:'👥 Friends',tabMyLevel:'📊 My Level',myRankLabel:'Your Global Rank',weeklyChallenge:'🏆 Weekly Challenge',weeklyPrize:'Prize: 1,000 REC',daysLeft:'days left',loadingLeader:'⏳ Loading...',noFriends:'You have not invited anyone yet',totalMined:'Total REC Mined',sinceJoined:'since you joined',top100only:'Top 100 players only',rewardDist:'Reward Distribution',rankReward:'Your expected reward',shopTitle:'Stars Shop',shopSubtitle:'Support the project and get instant rewards!',shopNote:'⭐ Stars are purchased directly from Telegram',shopEnergy:'⚡ Instant Energy Refill',shopEnergyDesc:'Refills your energy completely',shopRecord500:'💰 500,000 RECORD',shopRecord500Desc:'Added to your balance instantly',shopRecord3m:'💰 3,000,000 RECORD',shopRecord3mDesc:'Best value ⭐',shopSkip:'🚀 Skip Wait Timer',shopSkipDesc:'Complete card upgrade instantly',toastInvoiceLoading:'⏳ Preparing invoice...',toastPaid:'✅ Payment successful! Updating balance...',toastCancelled:'Payment cancelled',toastFailed:'❌ Payment failed, try again',toastConnError:'❌ Connection error'},
  uk:{dir:'ltr',tapMine:'Натисніть для майнінгу',energyLabel:'⚡ Енергія',miningSpeedLabel:'Майнінг REC:',recordSpeedLabel:'Майнінг RECORD:',upgradesTitle:'Покращення',tapUpgradeTitle:'⚡ Покращення натискань',energyUpgradeTitle:'🔋 Покращення енергії',levelLabel:'Рівень:',costLabel:'Вартість:',tapsPerClick:'Натискань за клік:',totalEnergy:'Загальна енергія:',upgradeBtn:'Покращити',backBtn:'← Назад',cardsTitle:'🃏 Картки',catAnime:'🎌 Аніме',catCars:'🚗 Машини',catClubs:'🌙 Клуби',catPalaces:'🏰 Палаци',cardLevel:'Рівень',cardUpgradeBtn:'Покращити',cardMaxLevel:'✅ Максимальний рівень!',cardMiningBonus:'Майнінг картки',cardUpgradeCost:'Вартість покращення',cardWaitTime:'Час очікування',upgrading:'⏳ Покращення...',upgradeReady:'✅ Готово',noMining:'⛔ Немає майнінгу — покращіть картку!',tasksTitle:'✅ Завдання',telegramTask:'📱 Приєднатися до Telegram',joinGroupBtn:'Приєднатися →',twitterTask:'🐦 Підписатися в Twitter',followTwitterBtn:'Підписатися →',getRecord:'Отримати 10,000 RECORD',taskDone:'✅ Виконано',inviteTitle:'👥 Запросити',inviteSubtitle:'Запрошуйте друзів і заробляйте REC!',totalInvited:'Всього запрошено',personJoined:'людей приєдналися',milestonesTitle:'🎯 Етапи винагород',copyLink:'📋 Копіювати посилання',shareBtn:'📤 Поділитися',claimBtn:'Отримати! 🎁',inviteN:'Запросіть {n} людей',rankTitle:'🏆 Рейтинг',yourLevel:'Ваш поточний рівень',yourBalance:'Ваш баланс:',connectWallet:'Підключити гаманець',support:'💬 Підтримка @Momokhli',poolWallet:'Pool Wallet',withdrawable:'Доступний баланс',controls:'Управління',withdrawPool:'Вивести Pool',transferPool:'Перевести в гаманець',history:'Історія',yourWithdrawals:'Ваші виведення',comingSoon:'Незабаром',locked:'Заблоковано',navHome:'Home',navCards:'Cards',navTasks:'Tasks',navInvite:'Invite',navRank:'Rank',navProfile:'Profile',toastCopied:'✅ Посилання скопійовано!',toastTask:'🎉 Отримано 10,000 RECORD!',toastClaimed:'🎉 Отримано {n} REC!',toastNotMet:'Вимога не виконана!',toastAlready:'Завдання вже виконано!',toastUpgradeStart:'⏳ Покращення розпочато!',toastUpgradeDone:'🎉 Покращення завершено!',toastNotEnoughRecord:'Недостатньо RECORD!',toastAlreadyUpgrading:'Картка вже покращується!',withdrawalBtn:'Виведення',withdrawTitle:'Вивести REC',withdrawSubtitle:'Виведення реального REC на гаманець',withdrawBalance:'Доступний баланс',withdrawMin:'Мінімум',withdrawFee:'Комісія',withdrawDaily:'Залишок ліміту',withdrawAmount:'Сума виведення',withdrawBtn:'🏛️ Вивести REC',withdrawReceive:'Ви отримаєте:',withdrawAfterFee:'після комісії',withdrawMinErr:'Мінімум {n} REC',withdrawSuccess:'✅ Відправлено {n} REC!',withdrawNoWallet:'❌ Підключіть гаманець!',withdrawLowBal:'❌ Недостатньо коштів',withdrawDailyErr:'❌ Ліміт. Залишок: {n} REC',withdrawFailed:'❌ Помилка виведення',withdrawLoading:'⏳ Відправка...',rankTitle:'🏆 ЛІДЕРБОРД',tabGlobal:'🌍 Глобально',tabFriends:'👥 Друзі',tabMyLevel:'📊 Мій рівень',myRankLabel:'Ваш глобальний ранг',weeklyChallenge:'🏆 Тижневий виклик',weeklyPrize:'Приз: 1,000 REC',daysLeft:'днів залишилось',loadingLeader:'⏳ Завантаження...',noFriends:'Ви ще нікого не запросили',totalMined:'Всього REC здобуто',sinceJoined:'з моменту приєднання',top100only:'Тільки топ 100',rewardDist:'Розподіл нагород',rankReward:'Очікувана нагорода',shopTitle:'Магазин зірок',shopSubtitle:'Підтримайте проект і отримайте нагороди!',shopNote:'⭐ Зірки купуються в Telegram',shopEnergy:'⚡ Миттєва зарядка енергії',shopEnergyDesc:'Повністю відновлює енергію',shopRecord500:'💰 500,000 RECORD',shopRecord500Desc:'Додається на баланс миттєво',shopRecord3m:'💰 3,000,000 RECORD',shopRecord3mDesc:'Найкраща цінність ⭐',shopSkip:'🚀 Пропустити очікування',shopSkipDesc:'Завершити покращення карти миттєво',toastInvoiceLoading:'⏳ Підготовка рахунку...',toastPaid:'✅ Оплата успішна! Оновлення балансу...',toastCancelled:'Оплату скасовано',toastFailed:'❌ Помилка оплати',toastConnError:'❌ Помилка з\'єднання'},
  zh:{dir:'ltr',tapMine:'点击挖矿',energyLabel:'⚡ 能量',miningSpeedLabel:'REC挖矿:',recordSpeedLabel:'RECORD挖矿:',upgradesTitle:'升级',tapUpgradeTitle:'⚡ 点击升级',energyUpgradeTitle:'🔋 能量升级',levelLabel:'等级:',costLabel:'费用:',tapsPerClick:'每次点击次数:',totalEnergy:'总能量:',upgradeBtn:'升级',backBtn:'← 返回',cardsTitle:'🃏 卡片',catAnime:'🎌 动漫',catCars:'🚗 汽车',catClubs:'🌙 夜总会',catPalaces:'🏰 宫殿',cardLevel:'等级',cardUpgradeBtn:'升级',cardMaxLevel:'✅ 已达最高等级!',cardMiningBonus:'卡片挖矿',cardUpgradeCost:'升级费用',cardWaitTime:'等待时间',upgrading:'⏳ 升级中...',upgradeReady:'✅ 就绪',noMining:'⛔ 无挖矿 — 请先升级卡片!',tasksTitle:'✅ 任务',telegramTask:'📱 加入Telegram群组',joinGroupBtn:'加入群组 →',twitterTask:'🐦 在推特关注',followTwitterBtn:'在推特关注 →',getRecord:'获得 10,000 RECORD',taskDone:'✅ 已完成',inviteTitle:'👥 邀请',inviteSubtitle:'邀请朋友赚取REC!',totalInvited:'总邀请人数',personJoined:'人加入',milestonesTitle:'🎯 奖励里程碑',copyLink:'📋 复制链接',shareBtn:'📤 分享',claimBtn:'领取! 🎁',inviteN:'邀请{n}人',rankTitle:'🏆 排名',yourLevel:'您的当前级别',yourBalance:'您的余额:',connectWallet:'连接钱包',support:'💬 技术支持 @Momokhli',poolWallet:'Pool Wallet',withdrawable:'可提现余额',controls:'操作',withdrawPool:'提取Pool',transferPool:'将Pool转入钱包',history:'历史',yourWithdrawals:'提现记录',comingSoon:'即将推出',locked:'已锁定',navHome:'Home',navCards:'Cards',navTasks:'Tasks',navInvite:'Invite',navRank:'Rank',navProfile:'Profile',toastCopied:'✅ 链接已复制!',toastTask:'🎉 获得10,000 RECORD!',toastClaimed:'🎉 获得{n} REC!',toastNotMet:'尚未满足要求!',toastAlready:'任务已完成!',toastUpgradeStart:'⏳ 卡片升级开始!',toastUpgradeDone:'🎉 升级完成!',toastNotEnoughRecord:'RECORD不足!',toastAlreadyUpgrading:'卡片升级中!'}
};

var currentLang='ar';
try{var sl=localStorage.getItem('lang_'+saveKey);if(sl&&T[sl])currentLang=sl;}catch(e){}

function t(key,params){
  var tr=T[currentLang]||T.ar;
  var s=tr[key]!==undefined?tr[key]:(T.ar[key]||key);
  if(params)Object.keys(params).forEach(function(k){s=s.replace('{'+k+'}',params[k]);});
  return s;
}
function applyLang(lang){
  if(!T[lang])return; currentLang=lang;
  try{localStorage.setItem('lang_'+saveKey,lang);}catch(e){}
  if(CS){try{CS.setItem('userLang',lang);}catch(e){}}
  var dir=T[lang].dir;
  document.documentElement.setAttribute('lang',lang);
  document.documentElement.setAttribute('dir',dir);
  document.body.style.direction=dir;
  document.querySelectorAll('[data-i18n]').forEach(function(el){el.textContent=t(el.getAttribute('data-i18n'));});
  buildMilestones(); restoreTasksUI(); closeLangMenu();
  updateUI();
}
function toggleLangMenu(){
  var m=document.getElementById('langDropdown'),o=document.getElementById('langOverlay');
  if(!m)return; var show=m.style.display==='none';
  m.style.display=show?'block':'none';
  if(o)o.style.display=show?'block':'none';
}
function closeLangMenu(){
  var m=document.getElementById('langDropdown'),o=document.getElementById('langOverlay');
  if(m)m.style.display='none';if(o)o.style.display='none';
}

// ====== CARD MINING FORMULAS ======
// RECORD/s per card level (level 1=1, level 100=10,000)
function cardRecordSpeed(lvl){
  if(lvl<=0)return 0;
  return 1*Math.pow(10000,(lvl-1)/99);
}
// REC/s per card level (level 1=0.000001, level 100=0.05)
function cardRECSpeed(lvl){
  if(lvl<=0)return 0;
  return 0.000001*Math.pow(50000,(lvl-1)/99);
}
// RECORD cost to upgrade from current level
// Level 1: 10,000 | Level 100: 100,000,000,000
function cardCost(lvl){
  return Math.floor(10000*Math.pow(10000000,lvl/99));
}
// Wait seconds to upgrade from current level
function cardWait(lvl){
  if(lvl===0)return 5;
  return Math.floor(10*Math.pow(8640,(lvl-1)/98));
}
function formatWait(sec){
  if(sec<60)return sec+'s';
  if(sec<3600)return Math.floor(sec/60)+'m '+Math.floor(sec%60)+'s';
  if(sec<86400)return Math.floor(sec/3600)+'h '+Math.floor((sec%3600)/60)+'m';
  return Math.floor(sec/86400)+'d '+Math.floor((sec%86400)/3600)+'h';
}

var recordPerSec=0, recPerSec=0;
function calcTotalSpeeds(){
  recordPerSec=0; recPerSec=0;
  Object.keys(cardLevels).forEach(function(key){
    var lvl=cardLevels[key]||0;
    recordPerSec+=cardRecordSpeed(lvl);
    recPerSec+=cardRECSpeed(lvl);
  });
}

// ====== DATA ======
var defaultData={record:0,rec:0,energy:1000,maxEnergy:1000,
  tapLevelVal:0,energyLevelVal:0,tapPowerVal:1,
  completedTasks:[],cardLevels:{},cardUpgrades:{},refCount:0,claimedMilest:[]};
var G=Object.assign({},defaultData);
try{var ls=JSON.parse(localStorage.getItem(saveKey));if(ls)G=Object.assign({},defaultData,ls);}catch(e){}

var record,rec,energy,maxEnergy,tapLevelVal,energyLevelVal,tapPowerVal,
    completedTasks,cardLevels,cardUpgrades,refCount,claimedMilest;

function applyData(d){
  record=d.record||0; rec=d.rec||0;
  energy=d.energy!==undefined?d.energy:1000; maxEnergy=d.maxEnergy||1000;
  tapLevelVal=d.tapLevelVal||0; energyLevelVal=d.energyLevelVal||0;
  tapPowerVal=d.tapPowerVal||1;
  completedTasks=d.completedTasks||[]; cardLevels=d.cardLevels||{};
  cardUpgrades=d.cardUpgrades||{}; refCount=d.refCount||0;
  claimedMilest=d.claimedMilest||[];
  calcTotalSpeeds();
}
applyData(G);

// CloudStorage loaded in loadAndInit()

function saveData(immediate){
  var d=JSON.stringify({record,rec,energy,maxEnergy,tapLevelVal,energyLevelVal,tapPowerVal,
    completedTasks,cardLevels,cardUpgrades,refCount,claimedMilest});
  try{localStorage.setItem(saveKey,d);}catch(e){}
  if(CS){try{CS.setItem('gameData',d);}catch(e){}}
  if(immediate){
    // Save to server immediately (for upgrades/purchases)
    saveToServer();
  } else {
    // Debounced save for routine updates (mining)
    clearTimeout(window._saveTimer);
    window._saveTimer = setTimeout(function(){ saveToServer(); }, 15000);
  }
}

function saveToServer(){
  if(!tgUser) return;
  try {
    fetch('/api/user/save', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        telegramId: tgUser.id,
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        record, rec, energy, maxEnergy,
        tapLevelVal, energyLevelVal, tapPowerVal,
        completedTasks, cardLevels, cardUpgrades,
        refCount, claimedMilest
      })
    }).catch(function(){});
  } catch(e){}
}

function loadFromServer(callback){
  if(!tgUser){ callback(null); return; }
  fetch('/api/user/' + tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(res){
      if(res.exists && res.data){ callback(res.data); }
      else { callback(null); }
    })
    .catch(function(){ callback(null); });
}

// ====== TOAST ======
function showToast(msg){
  var toast=document.getElementById('toast-msg');
  if(!toast){toast=document.createElement('div');toast.id='toast-msg';
    toast.style.cssText='position:fixed;bottom:75px;left:50%;transform:translateX(-50%);background:rgba(20,20,20,0.97);color:white;padding:10px 22px;border-radius:20px;font-size:14px;z-index:9999;border:1px solid #444;pointer-events:none;opacity:0;transition:opacity 0.25s;white-space:nowrap;max-width:90vw;text-align:center;';
    document.body.appendChild(toast);}
  toast.textContent=msg; toast.style.opacity='1';
  clearTimeout(toast._t);
  toast._t=setTimeout(function(){toast.style.opacity='0';},2500);
}

// ====== NAV ======
function showPage(id,btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById(id).classList.add('active');
  btn.classList.add('active'); closeLangMenu();
  if(id==='rank') loadLeaderboard(currentTab||'global');
}

// ====== HOME - TAP ======
function tap(){
  if(energy<=0)return;
  energy=Math.max(0,energy-1);
  record+=tapPowerVal;
  saveData(); updateUI();
}

// ====== CHECK UPGRADE TIMERS ======
function checkUpgradeTimers(){
  var now=Date.now(), changed=false;
  Object.keys(cardUpgrades).forEach(function(key){
    var upg=cardUpgrades[key];
    if(upg&&upg.endTime<=now){
      cardLevels[key]=upg.toLevel;
      delete cardUpgrades[key];
      changed=true;
      updateCardGridItem(key);
      showToast(t('toastUpgradeDone')+' ('+key+')');
    }
  });
  if(changed){calcTotalSpeeds();saveData();}
}

// ====== MAIN INTERVAL (3s) ======
setInterval(function(){
  checkUpgradeTimers();
  // Passive mining only if cards are upgraded
  if(recordPerSec>0||recPerSec>0){
    record+=recordPerSec*3;
    rec+=recPerSec*3;
  }
  // Energy recharge
  if(energy<maxEnergy)energy=Math.min(maxEnergy,energy+5);
  saveData(); updateUI(); updateTimerDisplays();
},3000);

// 1s interval for timer countdown display
setInterval(function(){updateTimerDisplays();},1000);

function updateTimerDisplays(){
  var now=Date.now();
  Object.keys(cardUpgrades).forEach(function(key){
    var upg=cardUpgrades[key];
    var el=document.getElementById('timer_'+key);
    if(el&&upg){
      var rem=Math.max(0,Math.ceil((upg.endTime-now)/1000));
      if(rem<=0){el.textContent=t('upgradeReady');}
      else{el.textContent='⏳ '+formatWait(rem);}
    }
  });
}

function updateUI(){
  var s=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  s('recordCount',Math.floor(record).toLocaleString());
  s('recordCountHome',Math.floor(record).toLocaleString());
  s('recCountHome',rec.toFixed(6));
  s('recMini',rec.toFixed(6));
  s('energyText',Math.floor(energy)+' / '+maxEnergy);
  s('profileRecord',Math.floor(record).toLocaleString());
  s('recPoolBalance',rec.toFixed(6));
  var eb=document.getElementById('energyBar');if(eb)eb.style.width=(energy/maxEnergy*100)+'%';
  // Mining speeds on home
  var recs=document.getElementById('recSpeedShow');
  var recs2=document.getElementById('recordSpeedShow');
  if(recs)recs.textContent=recPerSec>0?recPerSec.toFixed(8):'0.00000000';
  if(recs2)recs2.textContent=recordPerSec>0?Math.floor(recordPerSec).toLocaleString():'0';
  // Rank
  var m=getMyMedal();
  var mrn=document.getElementById('myRankName');if(mrn){mrn.textContent=m.name;mrn.style.color=m.color;}
  s('myRankRecord',Math.floor(record).toLocaleString());
  s('refCountDisplay',refCount);
}

// ====== UPGRADE OVERLAY (tap power + energy) ======
function getTapCost(l){return Math.floor(50*Math.pow(2,Math.floor(l/5)));}
function getEnergyCost(l){return Math.floor(50*Math.pow(2,Math.floor(l/5)));}
function openUpgrade(){updateUpgradeUI();document.getElementById('upgradePage').classList.add('open');}
function upgradeTap(){
  var cost=getTapCost(tapLevelVal);
  if(record<cost||tapLevelVal>=100)return;
  record-=cost;tapLevelVal++;tapPowerVal=1+Math.floor(tapLevelVal/5);
  saveData();updateUpgradeUI();updateUI();
}
function upgradeEnergy(){
  var cost=getEnergyCost(energyLevelVal);
  if(record<cost||energyLevelVal>=100)return;
  record-=cost;energyLevelVal++;maxEnergy=1000+energyLevelVal*500;
  saveData();updateUpgradeUI();updateUI();
}
function updateUpgradeUI(){
  var s=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  s('tapLevel',tapLevelVal);s('energyLevel',energyLevelVal);
  s('tapCost',getTapCost(tapLevelVal).toLocaleString());
  s('energyCost',getEnergyCost(energyLevelVal).toLocaleString());
  s('tapPower',tapPowerVal);s('maxEnergyShow',maxEnergy.toLocaleString());
  var tb=document.getElementById('tapUpgradeBtn');if(tb)tb.disabled=record<getTapCost(tapLevelVal)||tapLevelVal>=100;
  var eb=document.getElementById('energyUpgradeBtn');if(eb)eb.disabled=record<getEnergyCost(energyLevelVal)||energyLevelVal>=100;
}

// ====== CARDS ======
var categories=[
  {nameKey:'catAnime',cards:[
    {n:'ناروتو',e:'🍥'},{n:'غوكو',e:'⚡'},{n:'لوفي',e:'🏴‍☠️'},{n:'ساسكي',e:'🌩️'},
    {n:'إيتاشي',e:'🌸'},{n:'زورو',e:'⚔️'},{n:'توتورو',e:'🌿'},{n:'ميكاسا',e:'🗡️'},
    {n:'ليفاي',e:'💨'},{n:'إيرين',e:'🔑'},{n:'آرمين',e:'📚'},{n:'بيكولو',e:'👁️'},
    {n:'فيجيتا',e:'👑'},{n:'ناتسو',e:'🔥'},{n:'غراي',e:'❄️'},{n:'إيرزا',e:'🛡️'},
    {n:'لوسي',e:'⭐'},{n:'كيريتو',e:'🗡️'},{n:'أسونا',e:'🌹'},{n:'غون',e:'🌟'},
    {n:'كيليوا',e:'⚡'},{n:'كوروكو',e:'🏀'},{n:'زيرو تو',e:'🦋'},{n:'ريم',e:'💙'},
    {n:'غوجو',e:'🌀'},{n:'يوجي',e:'👊'},{n:'تانجيرو',e:'💧'},{n:'نيزوكو',e:'🎋'},
    {n:'زينيتسو',e:'⚡'},{n:'إيزوكو',e:'💚'},{n:'كاتسوكي',e:'💥'},{n:'شوتو',e:'🌓'},
    {n:'إيتشيغو',e:'🌙'},{n:'كازوما',e:'💰'},{n:'أكوا',e:'💧'},{n:'ميغومين',e:'💥'},
    {n:'يوريتشي',e:'☀️'},{n:'رينغوكو',e:'🔥'},{n:'أكازا',e:'🌺'},{n:'تشيهيرو',e:'🏮'}
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
    {n:'قصر بكنغهام',e:'👑'},{n:'قصر فرساي',e:'🌹'},{n:'قصر الحمراء',e:'🌺'},
    {n:'قصر نويشفانشتاين',e:'❄️'},{n:'قصر توبكابي',e:'🌙'},{n:'قصر الكرملين',e:'⭐'},
    {n:'قصر شينبرون',e:'🟡'},{n:'قصر موناكو',e:'🎰'},{n:'قصر مدريد',e:'🔴'},
    {n:'قصر براغ',e:'🧙'},{n:'قصر دبي',e:'🏙️'},{n:'قصر أبوظبي',e:'🕌'},
    {n:'قصر الرياض',e:'🌴'},{n:'قصر القاهرة',e:'🏺'},{n:'قصر إسطنبول',e:'🌙'},
    {n:'قصر طوكيو',e:'🌸'},{n:'قصر كيوتو',e:'⛩️'},{n:'قصر بكين',e:'🐉'},
    {n:'قصر لندن',e:'👑'},{n:'قصر باريس',e:'🗼'}
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

function renderCardGridItem(div,key,card){
  var lvl=cardLevels[key]||0;
  var upg=cardUpgrades[key];
  var now=Date.now();
  var isUpgrading=upg&&upg.endTime>now;
  var rem=isUpgrading?Math.max(0,Math.ceil((upg.endTime-now)/1000)):0;
  var recSpd=cardRECSpeed(lvl);
  var recRec=cardRecordSpeed(lvl);
  div.innerHTML=
    '<div class="card-emoji">'+card.e+'</div>'+
    '<div class="card-name">'+card.n+'</div>'+
    '<div class="card-level">LVL '+lvl+(isUpgrading?' ▲':'')+'</div>'+
    (isUpgrading
      ? '<div id="timer_'+key+'" style="font-size:10px;color:#FFD700;">⏳ '+formatWait(rem)+'</div>'
      : lvl>0
        ? '<div style="font-size:9px;color:#00FF88;">📈 '+Math.floor(recRec)+' R/s</div>'
        : '<div style="font-size:9px;color:#555;">⛔ لا تعدين</div>');
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
  var nextRecRec=lvl<100?cardRecordSpeed(lvl+1):0;
  var nextRecSpd=lvl<100?cardRECSpeed(lvl+1):0;
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
  saveData(true); updateUI(); updateCardGridItem(key); // immediate=true: save cost deduction NOW
  document.getElementById('cardModal').classList.remove('none');
  openCard(ci,idx);
  showToast(t('toastUpgradeStart')+' ⏳ '+formatWait(wait));
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
        '<div style="font-size:15px;">' + item.emoji + ' ' + item.title + '</div>' +
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

function switchLeaderTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.lb-tab').forEach(function(b) { b.classList.remove('active'); });
  var btn = document.getElementById('tab_' + tab);
  if(btn) btn.classList.add('active');
  loadLeaderboard(tab);
}

function loadLeaderboard(tab) {
  var cont = document.getElementById('lbContent');
  if(!cont) return;
  cont.innerHTML = '<div style="text-align:center;padding:30px;color:#555;">' + t('loadingLeader') + '</div>';

  if(tab === 'global') {
    Promise.all([
      fetch('/api/leaderboard/global').then(function(r){return r.json();}),
      fetch('/api/leaderboard/myrank/' + (tgUser?tgUser.id:0)).then(function(r){return r.json();}),
      fetch('/api/leaderboard/weekly').then(function(r){return r.json();})
    ]).then(function(results) {
      renderGlobal(results[0].top100 || [], results[1], results[2]);
    }).catch(function(){ cont.innerHTML = '<div style="text-align:center;color:#555;padding:20px;">❌</div>'; });
  } else if(tab === 'friends') {
    fetch('/api/leaderboard/friends/' + (tgUser?tgUser.id:0))
      .then(function(r){return r.json();})
      .then(function(data){ renderFriends(data.friends || []); })
      .catch(function(){});
  } else if(tab === 'mylevel') {
    renderMyLevel();
  }
}

function renderGlobal(top100, myRankData, weekly) {
  var cont = document.getElementById('lbContent');
  var myRank = myRankData ? myRankData.myRank : '-';
  var daysLeft = weekly ? weekly.daysLeft : 7;

  var html = '';

  // Weekly challenge banner
  html += '<div style="background:linear-gradient(135deg,#1a0a00,#2a1500);border:1px solid #FFD700;border-radius:12px;padding:12px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">' +
    '<div><div style="color:#FFD700;font-size:13px;font-weight:bold;">' + t('weeklyChallenge') + '</div>' +
    '<div style="color:#aaa;font-size:11px;margin-top:2px;">' + t('weeklyPrize') + '</div></div>' +
    '<div style="text-align:center;"><div style="font-size:22px;font-family:Orbitron,sans-serif;color:#FFD700;">' + daysLeft + '</div>' +
    '<div style="font-size:9px;color:#aaa;">' + t('daysLeft') + '</div></div></div>';

  // My rank card
  var m = getMyMedal();
  html += '<div style="background:#1a0000;border:1px solid #FF0000;border-radius:12px;padding:12px;margin-bottom:12px;display:flex;align-items:center;gap:10px;">' +
    '<div style="font-size:32px;">👤</div>' +
    '<div style="flex:1;"><div style="font-size:11px;color:#aaa;">' + t('myRankLabel') + '</div>' +
    '<div style="font-size:22px;font-family:Orbitron,sans-serif;color:#FF0000;">#' + myRank + '</div>' +
    '<div style="font-size:11px;color:#00FF88;">🔴 ' + Math.floor(record).toLocaleString() + ' RECORD</div></div>' +
    '<div style="text-align:center;"><div style="font-size:28px;">' + m.emoji + '</div>' +
    '<div style="font-size:9px;color:' + m.color + ';">' + m.name + '</div></div></div>';

  if(top100.length === 0) { cont.innerHTML = html + '<div style="text-align:center;color:#555;padding:20px;">🏆</div>'; return; }

  // Podium top 3
  var emojis = ['🥇','🥈','🥉'];
  var colors = ['#FFD700','#C0C0C0','#CD7F32'];
  html += '<div style="display:flex;justify-content:center;align-items:flex-end;gap:6px;margin-bottom:15px;">';
  var order = [1,0,2]; // 2nd, 1st, 3rd
  order.forEach(function(i) {
    var p = top100[i]; if(!p) return;
    var isFirst = i === 0;
    html += '<div style="flex:1;text-align:center;background:#1a1a1a;border:1px solid ' + colors[i] + ';border-radius:12px 12px 0 0;padding:' + (isFirst?'20px':'12px') + ' 6px 10px;' + (isFirst?'margin-bottom:-8px;':'') + 'position:relative;">' +
      (isFirst ? '<div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);font-size:20px;">👑</div>' : '') +
      '<div style="font-size:' + (isFirst?'24':'18') + 'px;font-weight:bold;color:' + colors[i] + ';">' + emojis[i] + '</div>' +
      '<div style="font-size:22px;margin:4px 0;">👤</div>' +
      '<div style="font-size:10px;color:#ddd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (p.name||'User') + '</div>' +
      '<div style="font-size:9px;color:#FF0000;margin-top:2px;">' + Math.floor(p.record).toLocaleString() + '</div></div>';
  });
  html += '</div>';

  // List 4-100
  top100.slice(3).forEach(function(p) {
    var isMe = tgUser && p.telegramId == tgUser.id;
    html += '<div style="display:flex;align-items:center;gap:8px;background:' + (isMe?'#1a0000':'#161616') + ';border:1px solid ' + (isMe?'#FF0000':'#222') + ';border-radius:10px;padding:8px 10px;margin-bottom:6px;">' +
      '<div style="font-size:12px;color:#555;min-width:26px;text-align:center;">#' + p.rank + '</div>' +
      '<div style="font-size:18px;">👤</div>' +
      '<div style="flex:1;"><div style="font-size:12px;color:' + (isMe?'#FF0000':'#ddd') + ';">' + (p.name||'User') + (isMe?' ←':'') + '</div>' +
      '<div style="font-size:10px;color:#FF0000;">' + Math.floor(p.record).toLocaleString() + ' REC</div></div>' +
      '<div style="font-size:10px;color:#00FF88;text-align:right;">' + (p.rec||0).toFixed(3) + ' REC</div></div>';
  });

  // Show neighbors if outside top 100
  if(myRankData && myRankData.myRank > 100) {
    html += '<div style="text-align:center;color:#555;font-size:11px;padding:5px 0;">• • •</div>';
    (myRankData.neighbors||[]).forEach(function(p) {
      var isMe = p.isMe;
      html += '<div style="display:flex;align-items:center;gap:8px;background:' + (isMe?'#1a0000':'#161616') + ';border:1px solid ' + (isMe?'#FF0000':'#222') + ';border-radius:10px;padding:8px 10px;margin-bottom:6px;">' +
        '<div style="font-size:12px;color:#555;min-width:26px;text-align:center;">#' + p.rank + '</div>' +
        '<div style="font-size:18px;">👤</div>' +
        '<div style="flex:1;"><div style="font-size:12px;color:' + (isMe?'#FF0000':'#ddd') + ';">' + (p.name||'User') + (isMe?' ←':'') + '</div></div>' +
        '<div style="font-size:10px;color:#FF0000;">' + Math.floor(p.record).toLocaleString() + '</div></div>';
    });
  }

  cont.innerHTML = html;
}

function renderFriends(friends) {
  var cont = document.getElementById('lbContent'); if(!cont) return;
  if(friends.length === 0) {
    cont.innerHTML = '<div style="text-align:center;padding:40px;color:#555;">' +
      '<div style="font-size:40px;margin-bottom:10px;">👥</div>' +
      '<div>' + t('noFriends') + '</div></div>';
    return;
  }
  var html = '';
  friends.forEach(function(p) {
    html += '<div style="display:flex;align-items:center;gap:8px;background:#161616;border:1px solid #222;border-radius:10px;padding:8px 10px;margin-bottom:6px;">' +
      '<div style="font-size:12px;color:#555;min-width:26px;text-align:center;">#' + p.rank + '</div>' +
      '<div style="font-size:18px;">👤</div>' +
      '<div style="flex:1;"><div style="font-size:12px;color:#ddd;">' + (p.name||'User') + '</div>' +
      '<div style="font-size:10px;color:#FF0000;">' + Math.floor(p.record).toLocaleString() + ' RECORD</div></div>' +
      '<div style="font-size:10px;color:#00FF88;">' + (p.rec||0).toFixed(3) + ' REC</div></div>';
  });
  cont.innerHTML = html;
}

function renderMyLevel() {
  var cont = document.getElementById('lbContent'); if(!cont) return;
  var m = getMyMedal();
  var name = tgUser ? (tgUser.first_name + (tgUser.last_name?' '+tgUser.last_name:'')) : 'You';
  cont.innerHTML =
    '<div style="background:#1a1a1a;border:1px solid #333;border-radius:14px;padding:20px;text-align:center;margin-bottom:12px;">' +
      '<div style="font-size:50px;margin-bottom:10px;">👤</div>' +
      '<div style="font-size:18px;font-weight:bold;">' + name + '</div>' +
      '<div style="font-size:12px;color:#aaa;margin-top:4px;">ID: ' + (tgUser?tgUser.id:'-') + '</div>' +
    '</div>' +
    '<div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:14px;margin-bottom:10px;">' +
      '<div style="color:#aaa;font-size:11px;margin-bottom:8px;">' + t('totalMined') + '</div>' +
      '<div style="font-size:28px;font-family:Orbitron,sans-serif;color:#00FF88;">' + rec.toFixed(6) + '</div>' +
      '<div style="color:#aaa;font-size:10px;margin-top:3px;">REC • ' + t('sinceJoined') + '</div>' +
    '</div>' +
    '<div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:14px;margin-bottom:10px;">' +
      '<div style="color:#aaa;font-size:11px;margin-bottom:8px;">RECORD</div>' +
      '<div style="font-size:24px;font-family:Orbitron,sans-serif;color:#FF0000;">' + Math.floor(record).toLocaleString() + '</div>' +
    '</div>' +
    '<div style="background:#1a1a1a;border:1px solid ' + m.color + ';border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;">' +
      '<div style="font-size:40px;">' + m.emoji + '</div>' +
      '<div><div style="font-size:16px;color:' + m.color + ';font-weight:bold;">' + m.name + '</div>' +
      '<div style="color:#aaa;font-size:11px;margin-top:3px;">🔴 ' + Math.floor(record).toLocaleString() + ' RECORD</div></div>' +
    '</div>';
}

// ====== PROFILE ======
function openSupport(){window.Telegram.WebApp.openTelegramLink('https://t.me/Momokhli');}

// ====== TON ADDRESS CONVERTER ======
// Converts raw "0:hexhash" to friendly "UQDu...6PP2" format
function crc16ton(data) {
  var crc = 0;
  for (var i = 0; i < data.length; i++) {
    crc ^= (data[i] << 8);
    for (var j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (((crc << 1) ^ 0x1021) & 0xFFFF) : ((crc << 1) & 0xFFFF);
    }
  }
  return crc;
}

function rawToFriendly(rawAddr) {
  try {
    // If already friendly (starts with UQ, EQ, etc.), return as-is
    if (!rawAddr.includes(':')) return rawAddr;
    var parts = rawAddr.split(':');
    if (parts.length !== 2) return rawAddr;
    var wc = parseInt(parts[0]);
    var hex = parts[1];
    if (hex.length !== 64) return rawAddr;

    // Build 36-byte buffer
    var buf = new Uint8Array(36);
    buf[0] = 0x51;  // non-bounceable (UQ...)
    buf[1] = wc < 0 ? 0xFF : (wc & 0xFF);
    for (var i = 0; i < 32; i++) {
      buf[2 + i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    // CRC16
    var crc = crc16ton(buf.slice(0, 34));
    buf[34] = (crc >> 8) & 0xFF;
    buf[35] = crc & 0xFF;

    // Base64url
    var bin = '';
    for (var i = 0; i < 36; i++) bin += String.fromCharCode(buf[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch(e) { return rawAddr; }
}

function shortTonAddr(addr) {
  if (!addr) return '';
  var friendly = rawToFriendly(addr);
  // UQDu...6PP2 format (first 4 + ... + last 4)
  return friendly.length > 10 ? friendly.slice(0, 4) + '...' + friendly.slice(-4) : friendly;
}

// ====== TON CONNECT ======
var tonConnect = null;

function initTonConnect() {
  try {
    if (typeof TON_CONNECT_UI === 'undefined') return;
    tonConnect = new TON_CONNECT_UI.TonConnectUI({
      manifestUrl: 'https://rec-coin.onrender.com/tonconnect-manifest.json'
    });
    // Subscribe to wallet status changes
    tonConnect.onStatusChange(function(wallet) {
      updateWalletBtn(wallet);
    });
    // Apply current status on load
    updateWalletBtn(tonConnect.wallet);
  } catch(e) { console.log('TonConnect error:', e); }
}

function updateWalletBtn(wallet) {
  var btn = document.getElementById('walletBtn');
  if (!btn) return;
  if (wallet && wallet.account && wallet.account.address) {
    var addr = wallet.account.address;
    // Convert raw hex address to friendly TON format (UQDu...6PP2)
    var short = shortTonAddr(addr);
    btn.textContent = '💎 ' + short;
    btn.style.background = '#1a6b1a';
    btn.style.border = '1px solid #4eff4e';
    btn.style.color = '#4eff4e';
    btn.removeAttribute('data-i18n');
    btn.setAttribute('data-raw', rawToFriendly(addr)); // save for withdrawal
    // Save to storage
    try { localStorage.setItem('ton_wallet_' + saveKey, addr); } catch(e) {}
    if (CS) { try { CS.setItem('tonWallet', addr); } catch(e) {} }
    // Save wallet to server
    if(tgUser) {
      fetch('/api/user/save', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ telegramId: tgUser.id, walletAddress: rawToFriendly(addr) })
      }).catch(function(){});
    }
  } else {
    btn.textContent = t('connectWallet');
    btn.style.background = '#4B9EFF';
    btn.style.border = 'none';
    btn.style.color = 'white';
    btn.setAttribute('data-i18n', 'connectWallet');
  }
}

function connectWallet() {
  if (!tonConnect) {
    // TonConnect not loaded yet, try init
    initTonConnect();
    setTimeout(function() {
      if (tonConnect) {
        if (tonConnect.connected) tonConnect.disconnect();
        else tonConnect.openModal();
      } else {
        // Fallback: open Telegram wallet directly
        window.Telegram.WebApp.openTelegramLink('https://t.me/wallet');
      }
    }, 500);
    return;
  }
  if (tonConnect.connected) {
    // Show disconnect confirmation
    window.Telegram.WebApp.showConfirm(
      currentLang === 'ar' ? 'هل تريد فصل المحفظة؟' :
      currentLang === 'uk' ? 'Відключити гаманець?' :
      currentLang === 'zh' ? '断开钱包连接？' : 'Disconnect wallet?',
      function(confirmed) {
        if (confirmed) { tonConnect.disconnect(); showToast('🔴 Wallet disconnected'); }
      }
    );
  } else {
    tonConnect.openModal();
  }
}

// ====== INIT ======
function initApp() {
  try {
    if(tgUser){
      var name=tgUser.first_name+(tgUser.last_name?' '+tgUser.last_name:'');
      var el=document.getElementById('profileName');if(el)el.textContent=name;
      var idEl=document.getElementById('profileId');if(idEl)idEl.textContent=tgUser.id;
    }
    fixViewport();
    calcTotalSpeeds();
    checkUpgradeTimers();
    applyLang(currentLang);
    buildCards();
    buildMilestones();
    restoreTasksUI();
    updateUI();
    setTimeout(initTonConnect, 800);
  } catch(e) {
    console.log('Init error:', e);
    // Try minimal init so UI at least works
    try { buildCards(); updateUI(); } catch(e2) {}
  }
}

// Load data: Server > CloudStorage > localStorage
function loadAndInit() {
  // If local data exists, use it first (prevents overwrite after upgrade)
  var hasLocalData = false;
  try {
    var lsRaw = localStorage.getItem(saveKey);
    if(lsRaw) {
      var lsParsed = JSON.parse(lsRaw);
      if(lsParsed && lsParsed.record >= 0) hasLocalData = true;
    }
  } catch(e) {}

  if(hasLocalData) {
    // Local data exists - use it, sync server in background only
    initApp();
    // Background sync from server to recover if local is empty
    loadFromServer(function(serverData) {
      if(serverData && serverData.record > record * 1.5) {
        // Server has significantly more - might be from another device
        applyData(serverData);
        updateUI();
      }
    });
    return;
  }

  // No local data - load from server
  loadFromServer(function(serverData) {
    if(serverData && (serverData.record > 0 || serverData.rec > 0 ||
       Object.keys(serverData.cardLevels||{}).length > 0)) {
      applyData(serverData);
      if(serverData.language && T[serverData.language]) currentLang = serverData.language;
      initApp();
      return;
    }
    // Fallback: CloudStorage
    if(CS) {
      try {
        CS.getItems(['gameData','userLang'], function(err, vals) {
          try {
            if(!err && vals && vals.gameData) {
              var cd = JSON.parse(vals.gameData);
              if(cd && (cd.record > 0 || cd.rec > 0)) applyData(cd);
            }
            if(!err && vals && vals.userLang && T[vals.userLang]) currentLang = vals.userLang;
          } catch(e) {}
          initApp();
        });
      } catch(e) { initApp(); }
    } else { initApp(); }
  });
}

document.addEventListener('DOMContentLoaded', loadAndInit);
