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
  ar:{dir:'rtl',tapMine:'اضغط للتعدين',energyLabel:'⚡ الطاقة',miningSpeedLabel:'تعدين REC:',recordSpeedLabel:'تعدين RECORD:',upgradesTitle:'الترقيات',tapUpgradeTitle:'⚡ ترقية الكبسات',energyUpgradeTitle:'🔋 ترقية الطاقة',levelLabel:'المستوى:',costLabel:'التكلفة:',tapsPerClick:'كبسات لكل ضغطة:',totalEnergy:'الطاقة الكلية:',upgradeBtn:'ترقية',backBtn:'← رجوع',cardsTitle:'🃏 البطاقات',catAnime:'🎌 أنمي',catCars:'🚗 سيارات',catClubs:'🌙 ملاهي',catPalaces:'🏰 قصور',catLimited:'🔥 محدود',cardLevel:'المستوى',cardUpgradeBtn:'ترقية',cardMaxLevel:'✅ وصلت للمستوى الأقصى!',cardMiningBonus:'تعدين هذه البطاقة',cardUpgradeCost:'تكلفة الترقية',cardWaitTime:'وقت الانتظار',upgrading:'⏳ جاري الترقية...',upgradeReady:'✅ جاهز',noMining:'⛔ لا يوجد تعدين - رقّ بطاقة أولاً',tasksTitle:'✅ المهام',telegramTask:'📱 انضم لجروب تيليغرام',joinGroupBtn:'انضم للجروب ←',twitterTask:'🐦 تابع على تويتر',followTwitterBtn:'تابع على تويتر ←',getRecord:'احصل على 10,000 RECORD',taskDone:'✅ تم الإنجاز',inviteTitle:'👥 الدعوة',inviteSubtitle:'ادعو أصدقاءك واربح عملات REC!',totalInvited:'إجمالي المدعوين',personJoined:'شخص انضم عبر رابطك',milestonesTitle:'🎯 مراحل المكافآت',copyLink:'📋 نسخ الرابط',shareBtn:'📤 مشاركة',claimBtn:'احصل! 🎁',inviteN:'ادعُ {n} شخص',rankTitle:'🏆 الترتيب',yourLevel:'مستواك الحالي',yourBalance:'رصيدك:',connectWallet:'ربط المحفظة',support:'💬 الدعم الفني @Momokhli',poolWallet:'Pool Wallet',withdrawable:'Withdrawable balance',controls:'Controls',withdrawPool:'Withdraw Pool',transferPool:'Transfer Pool to Wallet',history:'History',yourWithdrawals:'Your withdrawals',comingSoon:'Coming Soon',locked:'Locked',navHome:'الرئيسية',navCards:'البطاقات',navTasks:'المهام',navInvite:'الدعوة',navRank:'الترتيب',navProfile:'الملف',toastCopied:'✅ تم نسخ الرابط!',toastTask:'🎉 حصلت على 10,000 RECORD!',toastClaimed:'🎉 حصلت على {n} REC!',toastNotMet:'لم تكمل المتطلب بعد!',toastAlready:'أنجزت هذه المهمة مسبقاً!',toastUpgradeStart:'⏳ بدأت ترقية البطاقة!',toastUpgradeDone:'🎉 تمت الترقية!',toastNotEnoughRecord:'رصيد RECORD غير كافٍ!',toastAlreadyUpgrading:'البطاقة قيد الترقية!',withdrawalBtn:'سحب',withdrawTitle:'سحب REC',withdrawSubtitle:'سحب عملة REC الحقيقية لمحفظتك',withdrawBalance:'رصيدك المتاح',withdrawMin:'الحد الأدنى',withdrawFee:'رسوم السحب',withdrawDaily:'الحد اليومي المتبقي',withdrawAmount:'الكمية المراد سحبها',withdrawBtn:'🏛️ سحب REC الآن',withdrawReceive:'ستصلك:',withdrawAfterFee:'بعد خصم الرسوم',withdrawMinErr:'الحد الأدنى {n} REC',withdrawSuccess:'✅ تم إرسال {n} REC لمحفظتك!',withdrawNoWallet:'❌ ربط محفظة TON أولاً!',withdrawLowBal:'❌ رصيدك غير كافٍ',withdrawDailyErr:'❌ وصلت الحد اليومي. تبقى: {n} REC',withdrawFailed:'❌ فشل السحب',withdrawLoading:'⏳ جاري الإرسال...',rankTitle:'🏆 المتصدرون',tabGlobal:'🌍 عالمي',tabFriends:'👥 أصدقاء',tabMyLevel:'📊 مستواي',myRankLabel:'ترتيبك العالمي',weeklyChallenge:'🏆 التحدي الأسبوعي',weeklyPrize:'جائزة 1,000 REC',daysLeft:'يوم متبقي',loadingLeader:'⏳ جاري التحميل...',noFriends:'لم تدعُ أحداً بعد',totalMined:'إجمالي REC المعدن',sinceJoined:'منذ انضمامك',top100only:'أول 100 مشترك فقط',rewardDist:'توزيع المكافآت',rankReward:'مكافأتك المتوقعة',shopTitle:'متجر النجوم',shopSubtitle:'ادعم المشروع واحصل على مكافآت فورية!',shopNote:'⭐ النجوم تشترى من تيليغرام مباشرة',shopEnergy:'⚡ شحن طاقة فوري',shopEnergyDesc:'يرجع طاقتك كاملة فوراً',shopRecord500:'💰 500,000 RECORD',shopRecord500Desc:'تضاف فوراً لرصيدك',shopRecord3m:'💰 3,000,000 RECORD',shopRecord3mDesc:'الأفضل قيمة ⭐',shopSkip:'🚀 تخطي وقت الانتظار',shopSkipDesc:'أكمل ترقية البطاقة فوراً',toastInvoiceLoading:'⏳ جاري تحضير الفاتورة...',toastPaid:'✅ تم الدفع بنجاح! جاري تحديث رصيدك...',toastCancelled:'تم إلغاء الدفع',toastFailed:'❌ فشل الدفع، حاول مرة أخرى',toastConnError:'❌ خطأ في الاتصال بالسيرفر'},
  en:{dir:'ltr',tapMine:'Tap to Mine',energyLabel:'⚡ Energy',miningSpeedLabel:'REC Mining:',recordSpeedLabel:'RECORD Mining:',upgradesTitle:'Upgrades',tapUpgradeTitle:'⚡ Tap Upgrade',energyUpgradeTitle:'🔋 Energy Upgrade',levelLabel:'Level:',costLabel:'Cost:',tapsPerClick:'Taps per click:',totalEnergy:'Total Energy:',upgradeBtn:'Upgrade',backBtn:'← Back',cardsTitle:'🃏 Cards',catAnime:'🎌 Anime',catCars:'🚗 Cars',catClubs:'🌙 Clubs',catPalaces:'🏰 Palaces',catLimited:'🔥 Limited',cardMiningBonus:'Card Mining',cardUpgradeCost:'Upgrade Cost',cardWaitTime:'Wait Time',upgrading:'⏳ Upgrading...',upgradeReady:'✅ Ready',noMining:'⛔ No mining — upgrade a card first',tasksTitle:'✅ Tasks',telegramTask:'📱 Join Telegram Group',joinGroupBtn:'Join Group →',twitterTask:'🐦 Follow on Twitter',followTwitterBtn:'Follow Twitter →',getRecord:'Get 10,000 RECORD',taskDone:'✅ Completed',inviteTitle:'👥 Invite',inviteSubtitle:'Invite friends and earn REC!',totalInvited:'Total Invited',personJoined:'people joined via your link',milestonesTitle:'🎯 Reward Milestones',copyLink:'📋 Copy Link',shareBtn:'📤 Share',claimBtn:'Claim! 🎁',inviteN:'Invite {n} people',rankTitle:'🏆 Ranking',yourLevel:'Your Current Level',yourBalance:'Your Balance:',connectWallet:'Connect Wallet',support:'💬 Support @Momokhli',poolWallet:'Pool Wallet',withdrawable:'Withdrawable balance',controls:'Controls',withdrawPool:'Withdraw Pool',transferPool:'Transfer Pool to Wallet',history:'History',yourWithdrawals:'Your withdrawals',comingSoon:'Coming Soon',locked:'Locked',navHome:'Home',navCards:'Cards',navTasks:'Tasks',navInvite:'Invite',navRank:'Rank',navProfile:'Profile',toastCopied:'✅ Link Copied!',toastTask:'🎉 Got 10,000 RECORD!',toastClaimed:'🎉 Got {n} REC!',toastNotMet:'Requirement not met!',toastAlready:'Task already completed!',toastUpgradeStart:'⏳ Card upgrade started!',toastUpgradeDone:'🎉 Upgrade complete!',toastNotEnoughRecord:'Not enough RECORD!',toastAlreadyUpgrading:'Card already upgrading!',withdrawalBtn:'Withdrawal',withdrawTitle:'Withdraw REC',withdrawSubtitle:'Withdraw real REC to your wallet',withdrawBalance:'Available Balance',withdrawMin:'Minimum',withdrawFee:'Fee',withdrawDaily:'Daily Remaining',withdrawAmount:'Amount to withdraw',withdrawBtn:'🏛️ Withdraw REC Now',withdrawReceive:'You will receive:',withdrawAfterFee:'after fee',withdrawMinErr:'Minimum {n} REC',withdrawSuccess:'✅ Sent {n} REC to your wallet!',withdrawNoWallet:'❌ Connect TON wallet first!',withdrawLowBal:'❌ Insufficient balance',withdrawDailyErr:'❌ Daily limit reached. Remaining: {n} REC',withdrawFailed:'❌ Withdrawal failed',withdrawLoading:'⏳ Sending...',rankTitle:'🏆 LEADERBOARD',tabGlobal:'🌍 Global',tabFriends:'👥 Friends',tabMyLevel:'📊 My Level',myRankLabel:'Your Global Rank',weeklyChallenge:'🏆 Weekly Challenge',weeklyPrize:'Prize: 1,000 REC',daysLeft:'days left',loadingLeader:'⏳ Loading...',noFriends:'You have not invited anyone yet',totalMined:'Total REC Mined',sinceJoined:'since you joined',top100only:'Top 100 players only',rewardDist:'Reward Distribution',rankReward:'Your expected reward',shopTitle:'Stars Shop',shopSubtitle:'Support the project and get instant rewards!',shopNote:'⭐ Stars are purchased directly from Telegram',shopEnergy:'⚡ Instant Energy Refill',shopEnergyDesc:'Refills your energy completely',shopRecord500:'💰 500,000 RECORD',shopRecord500Desc:'Added to your balance instantly',shopRecord3m:'💰 3,000,000 RECORD',shopRecord3mDesc:'Best value ⭐',shopSkip:'🚀 Skip Wait Timer',shopSkipDesc:'Complete card upgrade instantly',toastInvoiceLoading:'⏳ Preparing invoice...',toastPaid:'✅ Payment successful! Updating balance...',toastCancelled:'Payment cancelled',toastFailed:'❌ Payment failed, try again',toastConnError:'❌ Connection error'},
  uk:{dir:'ltr',tapMine:'Натисніть для майнінгу',energyLabel:'⚡ Енергія',miningSpeedLabel:'Майнінг REC:',recordSpeedLabel:'Майнінг RECORD:',upgradesTitle:'Покращення',tapUpgradeTitle:'⚡ Покращення натискань',energyUpgradeTitle:'🔋 Покращення енергії',levelLabel:'Рівень:',costLabel:'Вартість:',tapsPerClick:'Натискань за клік:',totalEnergy:'Загальна енергія:',upgradeBtn:'Покращити',backBtn:'← Назад',cardsTitle:'🃏 Картки',catAnime:'🎌 Аніме',catCars:'🚗 Машини',catClubs:'🌙 Клуби',catPalaces:'🏰 Палаци',catLimited:'🔥 Обмежені',cardUpgradeBtn:'Покращити',cardMaxLevel:'✅ Максимальний рівень!',cardMiningBonus:'Майнінг картки',cardUpgradeCost:'Вартість покращення',cardWaitTime:'Час очікування',upgrading:'⏳ Покращення...',upgradeReady:'✅ Готово',noMining:'⛔ Немає майнінгу — покращіть картку!',tasksTitle:'✅ Завдання',telegramTask:'📱 Приєднатися до Telegram',joinGroupBtn:'Приєднатися →',twitterTask:'🐦 Підписатися в Twitter',followTwitterBtn:'Підписатися →',getRecord:'Отримати 10,000 RECORD',taskDone:'✅ Виконано',inviteTitle:'👥 Запросити',inviteSubtitle:'Запрошуйте друзів і заробляйте REC!',totalInvited:'Всього запрошено',personJoined:'людей приєдналися',milestonesTitle:'🎯 Етапи винагород',copyLink:'📋 Копіювати посилання',shareBtn:'📤 Поділитися',claimBtn:'Отримати! 🎁',inviteN:'Запросіть {n} людей',rankTitle:'🏆 Рейтинг',yourLevel:'Ваш поточний рівень',yourBalance:'Ваш баланс:',connectWallet:'Підключити гаманець',support:'💬 Підтримка @Momokhli',poolWallet:'Pool Wallet',withdrawable:'Доступний баланс',controls:'Управління',withdrawPool:'Вивести Pool',transferPool:'Перевести в гаманець',history:'Історія',yourWithdrawals:'Ваші виведення',comingSoon:'Незабаром',locked:'Заблоковано',navHome:'Home',navCards:'Cards',navTasks:'Tasks',navInvite:'Invite',navRank:'Rank',navProfile:'Profile',toastCopied:'✅ Посилання скопійовано!',toastTask:'🎉 Отримано 10,000 RECORD!',toastClaimed:'🎉 Отримано {n} REC!',toastNotMet:'Вимога не виконана!',toastAlready:'Завдання вже виконано!',toastUpgradeStart:'⏳ Покращення розпочато!',toastUpgradeDone:'🎉 Покращення завершено!',toastNotEnoughRecord:'Недостатньо RECORD!',toastAlreadyUpgrading:'Картка вже покращується!',withdrawalBtn:'Виведення',withdrawTitle:'Вивести REC',withdrawSubtitle:'Виведення реального REC на гаманець',withdrawBalance:'Доступний баланс',withdrawMin:'Мінімум',withdrawFee:'Комісія',withdrawDaily:'Залишок ліміту',withdrawAmount:'Сума виведення',withdrawBtn:'🏛️ Вивести REC',withdrawReceive:'Ви отримаєте:',withdrawAfterFee:'після комісії',withdrawMinErr:'Мінімум {n} REC',withdrawSuccess:'✅ Відправлено {n} REC!',withdrawNoWallet:'❌ Підключіть гаманець!',withdrawLowBal:'❌ Недостатньо коштів',withdrawDailyErr:'❌ Ліміт. Залишок: {n} REC',withdrawFailed:'❌ Помилка виведення',withdrawLoading:'⏳ Відправка...',rankTitle:'🏆 ЛІДЕРБОРД',tabGlobal:'🌍 Глобально',tabFriends:'👥 Друзі',tabMyLevel:'📊 Мій рівень',myRankLabel:'Ваш глобальний ранг',weeklyChallenge:'🏆 Тижневий виклик',weeklyPrize:'Приз: 1,000 REC',daysLeft:'днів залишилось',loadingLeader:'⏳ Завантаження...',noFriends:'Ви ще нікого не запросили',totalMined:'Всього REC здобуто',sinceJoined:'з моменту приєднання',top100only:'Тільки топ 100',rewardDist:'Розподіл нагород',rankReward:'Очікувана нагорода',shopTitle:'Магазин зірок',shopSubtitle:'Підтримайте проект і отримайте нагороди!',shopNote:'⭐ Зірки купуються в Telegram',shopEnergy:'⚡ Миттєва зарядка енергії',shopEnergyDesc:'Повністю відновлює енергію',shopRecord500:'💰 500,000 RECORD',shopRecord500Desc:'Додається на баланс миттєво',shopRecord3m:'💰 3,000,000 RECORD',shopRecord3mDesc:'Найкраща цінність ⭐',shopSkip:'🚀 Пропустити очікування',shopSkipDesc:'Завершити покращення карти миттєво',toastInvoiceLoading:'⏳ Підготовка рахунку...',toastPaid:'✅ Оплата успішна! Оновлення балансу...',toastCancelled:'Оплату скасовано',toastFailed:'❌ Помилка оплати',toastConnError:'❌ Помилка з\'єднання'},
  zh:{dir:'ltr',tapMine:'点击挖矿',energyLabel:'⚡ 能量',miningSpeedLabel:'REC挖矿:',recordSpeedLabel:'RECORD挖矿:',upgradesTitle:'升级',tapUpgradeTitle:'⚡ 点击升级',energyUpgradeTitle:'🔋 能量升级',levelLabel:'等级:',costLabel:'费用:',tapsPerClick:'每次点击次数:',totalEnergy:'总能量:',upgradeBtn:'升级',backBtn:'← 返回',cardsTitle:'🃏 卡片',catAnime:'🎌 动漫',catCars:'🚗 汽车',catClubs:'🌙 夜总会',catPalaces:'🏰 宫殿',catLimited:'🔥 限定',cardUpgradeBtn:'升级',cardMaxLevel:'✅ 已达最高等级!',cardMiningBonus:'卡片挖矿',cardUpgradeCost:'升级费用',cardWaitTime:'等待时间',upgrading:'⏳ 升级中...',upgradeReady:'✅ 就绪',noMining:'⛔ 无挖矿 — 请先升级卡片!',tasksTitle:'✅ 任务',telegramTask:'📱 加入Telegram群组',joinGroupBtn:'加入群组 →',twitterTask:'🐦 在推特关注',followTwitterBtn:'在推特关注 →',getRecord:'获得 10,000 RECORD',taskDone:'✅ 已完成',inviteTitle:'👥 邀请',inviteSubtitle:'邀请朋友赚取REC!',totalInvited:'总邀请人数',personJoined:'人加入',milestonesTitle:'🎯 奖励里程碑',copyLink:'📋 复制链接',shareBtn:'📤 分享',claimBtn:'领取! 🎁',inviteN:'邀请{n}人',rankTitle:'🏆 排名',yourLevel:'您的当前级别',yourBalance:'您的余额:',connectWallet:'连接钱包',support:'💬 技术支持 @Momokhli',poolWallet:'Pool Wallet',withdrawable:'可提现余额',controls:'操作',withdrawPool:'提取Pool',transferPool:'将Pool转入钱包',history:'历史',yourWithdrawals:'提现记录',comingSoon:'即将推出',locked:'已锁定',navHome:'Home',navCards:'Cards',navTasks:'Tasks',navInvite:'Invite',navRank:'Rank',navProfile:'Profile',toastCopied:'✅ 链接已复制!',toastTask:'🎉 获得10,000 RECORD!',toastClaimed:'🎉 获得{n} REC!',toastNotMet:'尚未满足要求!',toastAlready:'任务已完成!',toastUpgradeStart:'⏳ 卡片升级开始!',toastUpgradeDone:'🎉 升级完成!',toastNotEnoughRecord:'RECORD不足!',toastAlreadyUpgrading:'卡片升级中!'}
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
  buildCards();
  initNewFeatures();
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
// RECORD/s per card level (level 1=100, level 100=1,000,000)
function cardRecordSpeed(lvl){
  if(lvl<=0)return 0;
  return 100*Math.pow(10000,(lvl-1)/99);
}
// REC/s per card level (level 1=0.0000001, level 100=0.0001) — sustainable 40+ years
function cardRECSpeed(lvl){
  if(lvl<=0)return 0;
  return 0.0000001*Math.pow(1000,(lvl-1)/99);
}
// RECORD cost to upgrade from current level
// Level 0→1: 10K | Level 50: 110M | Level 75: 11.5B | Level 99→100: 1T
function cardCost(lvl){
  return Math.floor(10000*Math.pow(1e8,lvl/99));
}
// Wait time to upgrade — Level 0: 1min | Level 50: 3h | Level 75: 2d | Level 99: 30d
function cardWait(lvl){
  return Math.floor(60*Math.pow(43200,lvl/99));
}
function formatWait(sec){
  if(sec<60)return sec+'s';
  if(sec<3600)return Math.floor(sec/60)+'m '+Math.floor(sec%60)+'s';
  if(sec<86400)return Math.floor(sec/3600)+'h '+Math.floor((sec%3600)/60)+'m';
  return Math.floor(sec/86400)+'d '+Math.floor((sec%86400)/3600)+'h';
}

var recordPerSec=0, recPerSec=0;
var weeklyEndMs = 0;
function getLimitedMulti(key){ return parseInt(key.split('_')[0])===4 ? 3 : 1; }
function calcTotalSpeeds(){
  recordPerSec=0; recPerSec=0;
  Object.keys(cardLevels).forEach(function(key){
    var lvl=cardLevels[key]||0;
    var m=getLimitedMulti(key);
    recordPerSec+=cardRecordSpeed(lvl)*m;
    recPerSec+=cardRECSpeed(lvl)*m;
  });
}

// ====== DATA ======
var defaultData={record:0,rec:0,energy:1000,maxEnergy:1000,
  tapLevelVal:0,energyLevelVal:0,tapPowerVal:1,
  completedTasks:[],cardLevels:{},cardUpgrades:{},refCount:0,claimedMilest:[],
  dailyLogin:{day:0,lastDate:''},mysteryLastDate:'',
  dailyTasksData:{date:'',done:[],taps:0,upgrades:0,spent:0},
  cardTasksClaimed:[],totalTaps:0};
var G=Object.assign({},defaultData);
try{var ls=JSON.parse(localStorage.getItem(saveKey));if(ls)G=Object.assign({},defaultData,ls);}catch(e){}

var record,rec,energy,maxEnergy,tapLevelVal,energyLevelVal,tapPowerVal,
    completedTasks,cardLevels,cardUpgrades,refCount,claimedMilest,
    dailyLogin,mysteryLastDate,dailyTasksData,cardTasksClaimed,totalTaps;

function applyData(d){
  record=d.record||0; rec=d.rec||0;
  energy=d.energy!==undefined?d.energy:1000; maxEnergy=d.maxEnergy||1000;
  tapLevelVal=d.tapLevelVal||0; energyLevelVal=d.energyLevelVal||0;
  tapPowerVal=tapLevelVal>0?(tapLevelVal+1)*2:1;
  maxEnergy=energyLevelVal>0?Math.floor(1000*Math.pow(10000,energyLevelVal/99)):d.maxEnergy||1000;
  completedTasks=d.completedTasks||[]; cardLevels=d.cardLevels||{};
  cardUpgrades=d.cardUpgrades||{}; refCount=d.refCount||0;
  claimedMilest=d.claimedMilest||[];
  dailyLogin=d.dailyLogin||{day:0,lastDate:''};
  mysteryLastDate=d.mysteryLastDate||'';
  dailyTasksData=d.dailyTasksData||{date:'',done:[],taps:0,upgrades:0,spent:0};
  cardTasksClaimed=d.cardTasksClaimed||[];
  totalTaps=d.totalTaps||0;
  // refillData — 3 فرص يومية لتعبئة الطاقة
  var _today=getTodayStr();
  if(d.refillData && d.refillData.date===_today){
    window.refillData=d.refillData;
  } else {
    window.refillData={date:_today,count:3};
  }
  calcTotalSpeeds();
}
try { applyData(G); } catch(e) { console.log('applyData error:', e); applyData(defaultData); }

// CloudStorage loaded in loadAndInit()

function saveData(immediate){
  var d=JSON.stringify({record,rec,energy,maxEnergy,tapLevelVal,energyLevelVal,tapPowerVal,
    completedTasks,cardLevels,cardUpgrades,refCount,claimedMilest,
    dailyLogin,mysteryLastDate,dailyTasksData,cardTasksClaimed,totalTaps,
    refillData:window.refillData});
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
    var initData = '';
    try { initData = window.Telegram.WebApp.initData || ''; } catch(e){}
    fetch('/api/user/save', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        telegramId: tgUser.id,
        initData: initData,
        username: tgUser.username || '',
        firstName: tgUser.first_name || '',
        record, rec, energy, maxEnergy,
        tapLevelVal, energyLevelVal, tapPowerVal,
        completedTasks, cardLevels, cardUpgrades,
        refCount, claimedMilest,
        dailyLogin, mysteryLastDate, dailyTasksData, cardTasksClaimed, totalTaps,
        miningSpeed: recPerSec,
        refillData: window.refillData
      })
    }).then(function(r){ return r.json(); })
    .then(function(data){
      if(data.error === 'banned') {
        // Auto-unban if admin
        if(tgUser && String(tgUser.id) === '6995765586'){
          fetch('/api/admin/self-unban',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({telegramId:tgUser.id})})
          .then(function(){
            // Also unban all wrongly banned users
            fetch('/api/admin/unban-all',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({adminId:tgUser.id})})
            .then(function(r){return r.json();})
            .then(function(d){ console.log('Mass unban:', d.unbanned, 'users'); });
            setTimeout(function(){ window.location.reload(); },1500);
          });
          return;
        }
        // Show ban message
        document.body.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:white;text-align:center;padding:20px;">' +
          '<div style="font-size:60px;margin-bottom:20px;">🚫</div>' +
          '<div style="font-size:22px;font-weight:bold;color:#FF0000;margin-bottom:10px;">تم حظر حسابك</div>' +
          '<div style="color:#aaa;font-size:14px;">Account Banned</div>' +
          '<div style="color:#555;font-size:12px;margin-top:10px;">' + (data.reason||'violation') + '</div>' +
        '</div>';
      }
    }).catch(function(){});
  } catch(e){}
}

function loadFromServer(callback){
  if(!tgUser){ callback(null); return; }
  fetch('/api/user/' + tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(res){
      if(res.exists && res.data){
        // Check if server has more REC than local (block reward received while offline)
        var localRec = rec || 0;
        var serverRec = res.data.rec || 0;
        var recDiff = serverRec - localRec;

        // Merge new fields from localStorage
        try{
          var ls=JSON.parse(localStorage.getItem(saveKey));
          if(ls){
            if(!res.data.dailyLogin && ls.dailyLogin) res.data.dailyLogin=ls.dailyLogin;
            if(!res.data.mysteryLastDate && ls.mysteryLastDate) res.data.mysteryLastDate=ls.mysteryLastDate;
            if(!res.data.dailyTasksData && ls.dailyTasksData) res.data.dailyTasksData=ls.dailyTasksData;
            if(!res.data.cardTasksClaimed && ls.cardTasksClaimed) res.data.cardTasksClaimed=ls.cardTasksClaimed;
            if(!res.data.totalTaps && ls.totalTaps) res.data.totalTaps=ls.totalTaps;
          }
        }catch(e){}

        // If server REC is significantly more → block reward was given while offline
        if(recDiff >= 99) {
          setTimeout(function(){
            showBlockNotification(recDiff, res.data.totalBlocksFound || 1);
          }, 2000);
        }

        callback(res.data);
      } else { callback(null); }
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
function openGames(){
  // افتح اللعبة كـ overlay داخل نفس الـ WebApp
  var overlay = document.createElement('div');
  overlay.id = 'gamesOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;';
  
  var closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ Back';
  closeBtn.style.cssText = 'position:absolute;top:10px;right:10px;z-index:100000;background:rgba(0,0,0,0.8);color:white;border:1px solid #333;padding:8px 14px;border-radius:8px;font-size:13px;cursor:pointer;';
  closeBtn.onclick = function(){ document.body.removeChild(overlay); };
  
  var iframe = document.createElement('iframe');
  iframe.src = '/games.html';
  iframe.style.cssText = 'width:100%;height:100%;border:none;';
  
  overlay.appendChild(closeBtn);
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
}

function showPage(id,btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active');});
  document.getElementById(id).classList.add('active');
  if(btn) btn.classList.add('active'); closeLangMenu();
  if(id==='rank') loadLeaderboard('global');
  if(id==='profile') loadProfilePhoto();
}

// إشعار البلوك عند فتح البوت (لما البلوك جاء من السيرفر وهو أوفلاين)
function showBlockNotification(recAmount, blockNum) {
  var old = document.getElementById('blockPopupOverlay');
  if(old) return; // ما نظهر مرتين

  var ol = document.createElement('div');
  ol.id = 'blockPopupOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;';

  var pp = document.createElement('div');
  pp.style.cssText = 'background:linear-gradient(180deg,#0a0005,#150008);border:2px solid #FF0000;border-radius:20px;padding:24px;width:85vw;max-width:320px;text-align:center;box-shadow:0 0 80px rgba(255,0,0,0.6);animation:blockAppear 0.5s ease;';
  pp.addEventListener('click', function(e){ e.stopPropagation(); });

  pp.innerHTML =
    '<style>@keyframes blockAppear{from{transform:scale(0.3);opacity:0}to{transform:scale(1);opacity:1}}</style>'+
    '<div style="font-size:52px;margin-bottom:6px;">⛏️</div>'+
    '<div style="font-family:Orbitron,sans-serif;font-size:16px;color:#FF0000;font-weight:bold;letter-spacing:1px;margin-bottom:4px;">BLOCK FOUND!</div>'+
    '<div style="font-size:11px;color:#555;margin-bottom:16px;">Block #'+blockNum+' • بينما كنت غائباً</div>'+
    '<div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.3);border-radius:12px;padding:16px;margin-bottom:14px;">'+
      '<div style="font-size:11px;color:#aaa;margin-bottom:6px;">🟢 REC Reward</div>'+
      '<div style="font-size:32px;color:#00FF88;font-family:Orbitron,sans-serif;font-weight:bold;">+'+Math.floor(recAmount)+' REC</div>'+
      '<div style="font-size:10px;color:#555;margin-top:4px;">تمت الإضافة لرصيدك تلقائياً ✅</div>'+
    '</div>'+
    '<div style="font-size:10px;color:#444;margin-bottom:14px;">📢 تم الإعلان في قناة REC Blocks</div>'+
    '<button onclick="document.getElementById(\'blockPopupOverlay\').remove()" style="background:linear-gradient(135deg,#CC0000,#FF2200);border:none;color:white;padding:13px;border-radius:12px;cursor:pointer;font-size:15px;font-weight:bold;width:100%;">🔴 COLLECT</button>';

  ol.addEventListener('click', function(e){ if(e.target===ol) ol.remove(); });
  ol.appendChild(pp);
  document.body.appendChild(ol);
}

// ====== BLOCK MINING (Passive - based on REC mining speed) ======
// كل 3 ثواني فيه فرصة 1/2000 إن البطاقات تضرب بلوك
// يعني بالمعدل كل ~100 دقيقة لو البطاقات شغالة
var BLOCK_CHANCE = 1/2000;
var blocksMined = 0;

function checkForBlock() {
  // فقط لو في سرعة REC حقيقية
  if(recPerSec <= 0) return;
  if(Math.random() > BLOCK_CHANCE) return;

  blocksMined++;
  var blockNum = blocksMined;

  // المكافأة = ساعة كاملة من التعدين
  var rewardRec = parseFloat((recPerSec * 3600).toFixed(6));
  var rewardRecord = Math.floor(recordPerSec * 3600);

  // حد أدنى للمكافأة
  if(rewardRec < 0.0001) rewardRec = 0.0001;
  if(rewardRecord < 500000) rewardRecord = 500000;

  // أضف المكافأة
  record += rewardRecord;
  rec += rewardRec;
  saveData(true);
  updateUI();

  // أظهر popup
  showBlockPopup(blockNum, rewardRecord, rewardRec);

  // أبلغ السيرفر لنشره على القناة والجروع
  if(tgUser) {
    fetch('/api/block-found', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        telegramId: tgUser.id,
        blockReward: { record: rewardRecord, rec: rewardRec },
        blockNumber: blockNum
      })
    }).catch(function(){});
  }
}

function showBlockPopup(blockNum, rewardRecord, rewardRec) {
  // أزل أي popup قديم
  var old = document.getElementById('blockPopupOverlay');
  if(old) old.remove();

  var ol = document.createElement('div');
  ol.id = 'blockPopupOverlay';
  ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;';

  var pp = document.createElement('div');
  pp.style.cssText = 'background:linear-gradient(180deg,#0a0005,#150008);border:2px solid #FF0000;border-radius:20px;padding:24px;width:85vw;max-width:320px;text-align:center;box-shadow:0 0 80px rgba(255,0,0,0.6);animation:blockAppear 0.4s ease;';
  pp.addEventListener('click', function(e){ e.stopPropagation(); });

  pp.innerHTML =
    '<style>@keyframes blockAppear{from{transform:scale(0.3) rotate(-5deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}</style>'+
    '<div style="font-size:52px;margin-bottom:6px;">⛏️</div>'+
    '<div style="font-family:Orbitron,sans-serif;font-size:20px;color:#FF0000;font-weight:bold;letter-spacing:2px;margin-bottom:2px;">BLOCK FOUND!</div>'+
    '<div style="font-size:11px;color:#555;margin-bottom:16px;">Block #'+blockNum+' • REC Mining</div>'+
    '<div style="background:rgba(255,0,0,0.1);border:1px solid rgba(255,0,0,0.3);border-radius:12px;padding:14px;margin-bottom:8px;">'+
      '<div style="font-size:11px;color:#aaa;margin-bottom:4px;">⚡ RECORD Reward</div>'+
      '<div style="font-size:26px;color:#FF4444;font-family:Orbitron,sans-serif;font-weight:bold;">+'+formatCost(rewardRecord)+'</div>'+
    '</div>'+
    '<div style="background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);border-radius:12px;padding:14px;margin-bottom:14px;">'+
      '<div style="font-size:11px;color:#aaa;margin-bottom:4px;">🟢 REC Reward</div>'+
      '<div style="font-size:24px;color:#00FF88;font-family:Orbitron,sans-serif;font-weight:bold;">+'+rewardRec.toFixed(4)+'</div>'+
    '</div>'+
    '<div style="font-size:10px;color:#444;margin-bottom:14px;">📢 تم الإعلان في قناة REC Blocks</div>'+
    '<button onclick="document.getElementById(\'blockPopupOverlay\').remove()" style="background:linear-gradient(135deg,#CC0000,#FF2200);border:none;color:white;padding:13px;border-radius:12px;cursor:pointer;font-size:15px;font-weight:bold;width:100%;letter-spacing:1px;">🔴 COLLECT</button>';

  ol.addEventListener('click', function(e){ if(e.target===ol) ol.remove(); });
  ol.appendChild(pp);
  document.body.appendChild(ol);
}

// ====== HOME - TAP ======
function tap(){
  // كل ضغطة تعطي RECORD وتنقص 10 طاقة — مستقلة عن تعدين البطاقات
  record += tapPowerVal;
  if(energy >= 10) energy = Math.max(0, energy - 10);
  totalTaps++;
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  dailyTasksData.taps++;
  checkDailyTaskProgress();
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
      var kp=key.split('_'),kci=parseInt(kp[0]),kidx=parseInt(kp[1]);
      var kcard=categories[kci]&&categories[kci].cards[kidx];
      showToast(t('toastUpgradeDone')+(kcard?' — '+getCardName(kcard):''));
    }
  });
  if(changed){calcTotalSpeeds();saveData();}
}

// ====== MAIN INTERVAL (3s) ======
setInterval(function(){
  checkUpgradeTimers();
  // تعدين RECORD من البطاقات — مستقل
  if(recordPerSec>0) record+=recordPerSec*3;
  // تعدين REC من البطاقات — مستقل
  if(recPerSec>0){
    rec+=recPerSec*3;
    checkForBlock();
  }
  // شحن الطاقة — مستقل
  if(energy<maxEnergy) energy=Math.min(maxEnergy,energy+12);
  saveData(); updateUI(); updateTimerDisplays();
},3000);

// 1s interval for timer countdown display
setInterval(function(){updateTimerDisplays();},1000);

function pad2(n){return n<10?'0'+n:''+n;}

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
  // Weekly countdown
  var wEl=document.getElementById('weeklyCountdown');
  if(wEl&&typeof weeklyEndMs!=='undefined'&&weeklyEndMs>0){
    var diff=Math.max(0,weeklyEndMs-now);
    var dd=Math.floor(diff/86400000);
    var hh=Math.floor((diff%86400000)/3600000);
    var mm=Math.floor((diff%3600000)/60000);
    var ss=Math.floor((diff%60000)/1000);
    wEl.textContent=pad2(dd)+'d '+pad2(hh)+'h '+pad2(mm)+'m '+pad2(ss)+'s';
  }
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
  updateInviteLinkDisplay();
  updateWalletPage();
  var commEl = document.getElementById('totalCommissionDisplay');
  if(commEl) commEl.textContent = rec.toFixed(2);
}

// ====== UPGRADE OVERLAY (tap power + energy) ======
// Tap upgrade cost: Level 1=30K, Level 100=1B
function getTapCost(l){return Math.floor(30000*Math.pow(33333,l/99));}
// Energy upgrade cost: Level 1=30K, Level 100=1B
function getEnergyCost(l){return Math.floor(30000*Math.pow(33333,l/99));}
function openUpgrade(){updateUpgradeUI();document.getElementById('upgradePage').classList.add('open');}

// ====== TASK TABS ======
function showTaskTab(name, btn){
  ['social','daily','missions'].forEach(function(t){
    document.getElementById('taskTab-'+t).style.display = t===name ? 'block' : 'none';
    document.getElementById('ttab_'+t).classList.remove('active');
  });
  btn.classList.add('active');
  if(name==='daily') renderDailyTasksUI();
  if(name==='missions') renderCardMissionsUI();
  if(name==='social') renderTwitterTasks();
}

// ====== TWITTER TASKS ======
var TWEET_URLS = [
  'https://x.com/mohamma33122570/status/2059639413643125243',
  'https://x.com/mohamma33122570/status/2059639523705839913',
  'https://x.com/mohamma33122570/status/2059639661262143794',
  'https://x.com/mohamma33122570/status/2059639750705738121',
  'https://x.com/mohamma33122570/status/2059639828250058910',
  'https://x.com/mohamma33122570/status/2059639902967308644',
  'https://x.com/mohamma33122570/status/2059639974689939719'
];

function renderTwitterTasks(){
  renderChannelTask('blocksChannelTask','join_blocks','⛏️ REC Blocks Channel','https://t.me/REC_Blocks',5);
  renderChannelTask('chatGroupTask','join_chat','💬 REC Mining Chat','https://t.me/REC_Mining_Chat',5);
  renderChannelTask('telegramFollowTask','telegram','📱 Join Telegram Group','https://t.me/Momokh1',5);
  renderChannelTask('twitterFollowTask','twitter','🐦 Follow on Twitter','https://x.com/mohamma33122570',5);
  renderTweetGroup('likeTasks','like','❤️ Like','like',5);
  renderTweetGroup('retweetTasks','rt','🔁 Retweet','retweet',5);
}

function renderChannelTask(containerId, taskId, label, url, recReward){
  var cont = document.getElementById(containerId);
  if(!cont) return;
  var done = completedTasks.indexOf(taskId) !== -1;
  var joinBtnId = taskId+'_join';
  var claimBtnId = taskId+'_claim';
  cont.innerHTML =
    '<div style="background:rgba(10,10,20,0.75);border:1px solid '+(done?'rgba(0,200,100,0.3)':'rgba(255,255,255,0.06)')+';border-radius:12px;padding:11px 12px;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center;">'+
      '<div>'+
        '<div style="font-size:13px;color:'+(done?'#4eff4e':'#ddd')+'">'+(done?'✅ ':'')+label+'</div>'+
        '<div style="font-size:11px;color:#00FF88;margin-top:2px;">+'+recReward+' REC</div>'+
      '</div>'+
      (done
        ? '<div style="font-size:11px;color:#4eff4e;padding:6px 10px;">Done ✅</div>'
        : '<div style="display:flex;gap:5px;">'+
            '<button id="'+joinBtnId+'" onclick="channelTaskOpen(\''+taskId+'\',\''+url+'\',\''+joinBtnId+'\',\''+claimBtnId+'\')" style="background:#1a1a1a;border:1px solid #333;color:white;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;">Join →</button>'+
            '<button id="'+claimBtnId+'" onclick="channelTaskClaim(\''+taskId+'\',\''+claimBtnId+'\','+recReward+')" disabled style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;opacity:0.4;">Claim</button>'+
          '</div>')+
    '</div>';
}

function channelTaskOpen(taskId, url, openBtnId, claimBtnId){
  if(completedTasks.indexOf(taskId)!==-1) return;
  window.Telegram.WebApp.openTelegramLink(url);
  var openBtn = document.getElementById(openBtnId);
  if(openBtn){ openBtn.disabled=true; openBtn.style.opacity='0.4'; }
  setTimeout(function(){
    var claimBtn = document.getElementById(claimBtnId);
    if(claimBtn){ claimBtn.disabled=false; claimBtn.style.opacity='1'; }
  }, 10000);
}

function channelTaskClaim(taskId, claimBtnId, recReward){
  if(completedTasks.indexOf(taskId)!==-1){ showToast('✅ Already claimed!'); return; }
  completedTasks.push(taskId);
  if(recReward >= 1000) {
    record += recReward;
    showToast('✅ +'+formatCost(recReward)+' RECORD earned!');
  } else {
    rec += recReward;
    showToast('✅ +'+recReward+' REC earned!');
  }
  saveData(true); updateUI();
  renderTwitterTasks();
}



function renderTweetGroup(containerId, prefix, label, action, recReward){
  var cont = document.getElementById(containerId);
  if(!cont) return;
  var html = '';
  TWEET_URLS.forEach(function(url, i){
    var taskId = prefix+'_'+(i+1);
    var done = completedTasks.indexOf(taskId) !== -1;
    var openId = prefix+'Open'+(i+1);
    var claimId = prefix+'Claim'+(i+1);
    var intentUrl = action==='like'
      ? 'https://twitter.com/intent/like?tweet_id='+url.split('/status/')[1].split('?')[0]
      : 'https://twitter.com/intent/retweet?tweet_id='+url.split('/status/')[1].split('?')[0];
    html +=
      '<div style="background:rgba(10,10,20,0.75);border:1px solid '+(done?'rgba(0,200,100,0.3)':'rgba(255,255,255,0.06)')+';border-radius:12px;padding:11px 12px;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center;">'+
        '<div>'+
          '<div style="font-size:13px;color:'+(done?'#4eff4e':'#ddd')+'">'+(done?'✅ ':'')+''+label+' — Tweet #'+(i+1)+'</div>'+
          '<div style="font-size:11px;color:#00FF88;margin-top:2px;">+'+recReward+' REC</div>'+
        '</div>'+
        (done
          ? '<div style="font-size:11px;color:#4eff4e;padding:6px 10px;">Done ✅</div>'
          : '<div style="display:flex;gap:5px;">'+
              '<button id="'+openId+'" onclick="twitterTaskOpen(\''+taskId+'\',\''+intentUrl+'\',\''+openId+'\',\''+claimId+'\')" style="background:#1a1a1a;border:1px solid #333;color:white;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;">'+label+' →</button>'+
              '<button id="'+claimId+'" onclick="twitterTaskClaim(\''+taskId+'\',\''+claimId+'\',\''+openId+'\','+recReward+')" disabled style="background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:7px 10px;border-radius:8px;cursor:pointer;font-size:11px;opacity:0.4;">Claim</button>'+
            '</div>')+
      '</div>';
  });
  cont.innerHTML = html;
}

function twitterTaskOpen(taskId, url, openBtnId, claimBtnId){
  if(completedTasks.indexOf(taskId)!==-1) return;
  window.open(url,'_blank');
  var openBtn = document.getElementById(openBtnId);
  if(openBtn){ openBtn.disabled=true; openBtn.style.opacity='0.4'; }
  setTimeout(function(){
    var claimBtn = document.getElementById(claimBtnId);
    if(claimBtn){ claimBtn.disabled=false; claimBtn.style.opacity='1'; }
  }, 15000);
}

function twitterTaskClaim(taskId, claimBtnId, openBtnId, recReward){
  if(completedTasks.indexOf(taskId)!==-1){ showToast('✅ Already claimed!'); return; }
  completedTasks.push(taskId);
  rec += recReward;
  saveData(true); updateUI();
  showToast('✅ +'+recReward+' REC earned!');
  renderTwitterTasks();
}

// ====== REC → RECORD EXCHANGE ======
var EXCHANGE_RATE = 5000000; // 1 REC = 5,000,000 RECORD

function openExchange(){
  var popup = document.createElement('div');
  popup.id = 'exchangePopup';
  popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(180deg,#0d0d14,#111118);border:1px solid rgba(0,255,136,0.3);border-radius:18px;padding:20px;width:82vw;max-width:300px;z-index:10000;backdrop-filter:blur(15px);box-shadow:0 0 50px rgba(0,255,136,0.1);';

  popup.addEventListener('click', function(e){ e.stopPropagation(); });
  popup.addEventListener('touchend', function(e){ e.stopPropagation(); });

  function renderExchange(){
    var recBal = rec;
    var inputVal = parseFloat(document.getElementById('excInput') ? document.getElementById('excInput').value : 0) || 0;
    var willGet = Math.floor(inputVal * EXCHANGE_RATE);
    popup.innerHTML =
      '<div style="text-align:center;margin-bottom:14px;">'+
        '<div style="font-size:28px;margin-bottom:6px;">🔄</div>'+
        '<div style="font-size:15px;font-weight:bold;color:white;">'+
          (currentLang==='ar'?'استبدال REC ← RECORD':'Exchange REC → RECORD')+
        '</div>'+
      '</div>'+
      '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:10px;padding:10px;margin-bottom:10px;display:flex;justify-content:space-between;">'+
        '<span style="color:#aaa;font-size:12px;">'+( currentLang==='ar'?'رصيد REC:':'REC Balance:')+'</span>'+
        '<span style="color:#00FF88;font-size:13px;font-weight:bold;">'+recBal.toFixed(6)+'</span>'+
      '</div>'+
      '<div style="color:#aaa;font-size:11px;text-align:center;margin-bottom:8px;">'+
        '1 REC = '+EXCHANGE_RATE.toLocaleString()+' RECORD'+
      '</div>'+
      '<input id="excInput" type="number" min="0" step="0.000001" placeholder="'+(currentLang==='ar'?'كمية REC':'Amount REC')+'"'+
        ' style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(0,255,136,0.3);border-radius:10px;padding:10px;color:white;font-size:14px;text-align:center;box-sizing:border-box;outline:none;margin-bottom:8px;"'+
        ' oninput="document.getElementById(\'excPreview\').textContent=\'≈ \'+(Math.floor((parseFloat(this.value)||0)*'+EXCHANGE_RATE+')).toLocaleString()+\' RECORD\'">'+
      '<div id="excPreview" style="text-align:center;color:#FF8800;font-size:13px;margin-bottom:14px;">≈ 0 RECORD</div>'+
      '<div style="display:flex;gap:8px;">'+
        '<button onclick="confirmExchange()" style="flex:1;background:linear-gradient(135deg,#005522,#00AA44);border:none;color:white;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;">'+
          (currentLang==='ar'?'✅ استبدل':'✅ Exchange')+
        '</button>'+
        '<button onclick="document.getElementById(\'exchangeOverlay\').remove();document.getElementById(\'exchangePopup\').remove();" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#aaa;padding:10px;border-radius:10px;cursor:pointer;font-size:13px;">'+
          (currentLang==='ar'?'إلغاء':'Cancel')+
        '</button>'+
      '</div>';
  }

  var overlay = document.createElement('div');
  overlay.id = 'exchangeOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;';
  overlay.addEventListener('click', function(e){ e.stopPropagation(); overlay.remove(); popup.remove(); });
  overlay.addEventListener('touchend', function(e){ e.stopPropagation(); overlay.remove(); popup.remove(); });

  document.body.appendChild(overlay);
  document.body.appendChild(popup);
  renderExchange();
}

function confirmExchange(){
  var input = document.getElementById('excInput');
  if(!input) return;
  var amount = parseFloat(input.value) || 0;
  if(amount <= 0){ showToast(currentLang==='ar'?'❌ أدخل كمية صحيحة':'❌ Enter valid amount'); return; }
  if(amount > rec){ showToast(currentLang==='ar'?'❌ رصيد REC غير كافٍ':'❌ Not enough REC'); return; }
  var gain = Math.floor(amount * EXCHANGE_RATE);
  rec -= amount;
  record += gain;
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  dailyTasksData.spent += gain;
  checkDailyTaskProgress();
  saveData(true); updateUI();
  var ol = document.getElementById('exchangeOverlay');
  var pp = document.getElementById('exchangePopup');
  if(ol) ol.remove(); if(pp) pp.remove();
  showToast('✅ +'+gain.toLocaleString()+' RECORD');
}

// ====== HELPER ======
function getTodayStr(){ return new Date().toISOString().split('T')[0]; }

// ====== DAILY LOGIN ======
var DAILY_REWARDS=[
  {record:1000,rec:0},{record:2000,rec:0},{record:3000,rec:0},
  {record:5000,rec:0},{record:8000,rec:0},{record:12000,rec:0},
  {record:20000,rec:0.001},
  {record:30000,rec:0},{record:40000,rec:0},{record:50000,rec:0},
  {record:70000,rec:0},{record:90000,rec:0},{record:120000,rec:0},
  {record:150000,rec:0.01},
  {record:200000,rec:0},{record:250000,rec:0},{record:300000,rec:0},
  {record:400000,rec:0},{record:500000,rec:0},{record:600000,rec:0},
  {record:800000,rec:0.1},
  {record:1000000,rec:0},{record:1200000,rec:0},{record:1500000,rec:0},
  {record:2000000,rec:0.5},
  {record:2500000,rec:0},
  {record:3000000,rec:1},
  {record:4000000,rec:2},
  {record:5000000,rec:3},
  {record:10000000,rec:5}
];

function openDailyLogin(){
  var today=getTodayStr();
  var login=dailyLogin;
  var alreadyClaimed=login.lastDate===today;
  if(login.lastDate&&!alreadyClaimed){
    var diff=Math.round((new Date(today)-new Date(login.lastDate))/86400000);
    if(diff>1){login.day=0;}
  }
  var currentDay=login.day%30;
  var reward=DAILY_REWARDS[currentDay];

  var ol=document.createElement('div');
  ol.id='dailyOverlay';
  ol.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:20px 0;';

  var grid='';
  for(var i=0;i<30;i++){
    var r=DAILY_REWARDS[i];
    var isClaimed=i<currentDay||(i===currentDay&&alreadyClaimed);
    var isCurr=i===currentDay&&!alreadyClaimed;
    var bg=isClaimed?'rgba(0,120,0,0.3)':isCurr?'rgba(255,215,0,0.18)':'rgba(255,255,255,0.03)';
    var brd=isClaimed?'#1a7a1a':isCurr?'#FFD700':'#1a1a2a';
    var tc=isClaimed?'#4eff4e':isCurr?'#FFD700':'#555';
    grid+='<div style="background:'+bg+';border:1px solid '+brd+';border-radius:8px;padding:5px 3px;text-align:center;">';
    if(isClaimed) grid+='<div style="font-size:13px;">✅</div>';
    else grid+='<div style="font-size:10px;color:'+tc+';">'+formatCost(r.record)+'</div>';
    if(r.rec>0&&!isClaimed) grid+='<div style="font-size:8px;color:#00FF88;">🟢'+r.rec+'</div>';
    grid+='<div style="font-size:8px;color:'+tc+';">'+(i+1)+'</div></div>';
  }

  var pp=document.createElement('div');
  pp.style.cssText='background:linear-gradient(180deg,#0a0a18,#111118);border:1px solid rgba(255,215,0,0.35);border-radius:20px;padding:20px;width:88vw;max-width:360px;';
  pp.addEventListener('click',function(e){e.stopPropagation();});
  pp.innerHTML=
    '<div style="text-align:center;margin-bottom:14px;">'+
      '<div style="font-size:30px;margin-bottom:4px;">📅</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:15px;color:#FFD700;">Daily Reward</div>'+
      '<div style="font-size:11px;color:#666;margin-top:3px;">Day '+(currentDay+1)+' / 30</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:14px;">'+grid+'</div>'+
    (!alreadyClaimed?
      '<div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.3);border-radius:12px;padding:12px;margin-bottom:12px;text-align:center;">'+
        '<div style="font-size:11px;color:#aaa;margin-bottom:5px;">Today\'s Reward</div>'+
        '<div style="font-size:18px;color:#FFD700;font-family:Orbitron,sans-serif;font-weight:bold;">'+formatCost(reward.record)+' RECORD</div>'+
        (reward.rec>0?'<div style="font-size:15px;color:#00FF88;margin-top:3px;">+ '+reward.rec+' REC 🟢</div>':'')+
      '</div>':
      '<div style="background:rgba(0,100,0,0.12);border:1px solid #1a5c1a;border-radius:12px;padding:12px;margin-bottom:12px;text-align:center;">'+
        '<div style="color:#4eff4e;font-size:13px;">✅ Already claimed today!</div>'+
        '<div style="color:#555;font-size:10px;margin-top:3px;">Come back tomorrow</div>'+
      '</div>')+
    '<div style="display:flex;gap:8px;">'+
      (!alreadyClaimed?
        '<button onclick="claimDailyReward()" style="flex:1;background:linear-gradient(135deg,#886600,#FFD700);border:none;color:#000;padding:11px;border-radius:10px;font-size:14px;font-weight:bold;cursor:pointer;">🎁 Claim!</button>':
        '<button disabled style="flex:1;background:#222;border:1px solid #333;color:#555;padding:11px;border-radius:10px;font-size:13px;cursor:not-allowed;">Claimed ✅</button>')+
      '<button onclick="document.getElementById(\'dailyOverlay\').remove();" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);color:#aaa;padding:11px 15px;border-radius:10px;font-size:14px;cursor:pointer;">✕</button>'+
    '</div>';

  ol.addEventListener('click',function(e){if(e.target===ol)ol.remove();});
  ol.appendChild(pp); document.body.appendChild(ol);
}

function claimDailyReward(){
  var today=getTodayStr();
  if(dailyLogin.lastDate===today){showToast('Already claimed today!');return;}
  var currentDay=dailyLogin.day%30;
  var reward=DAILY_REWARDS[currentDay];
  record+=reward.record;
  if(reward.rec>0) rec+=reward.rec;
  dailyLogin.day=currentDay+1; dailyLogin.lastDate=today;
  saveData(true); updateUI();
  var ol=document.getElementById('dailyOverlay');
  if(ol)ol.remove();
  showToast('🎁 +'+formatCost(reward.record)+' RECORD'+(reward.rec>0?' +'+reward.rec+' REC':'')+'!');
  openDailyLogin();
}

// ====== MYSTERY BOX ======
function openMysteryBox(){
  var today=getTodayStr();
  var alreadyOpen=mysteryLastDate===today;

  var ol=document.createElement('div');
  ol.id='mysteryOverlay';
  ol.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;';
  ol.addEventListener('click',function(e){if(e.target===ol)ol.remove();});

  var pp=document.createElement('div');
  pp.style.cssText='background:linear-gradient(180deg,#0d0010,#150020);border:1px solid rgba(180,0,255,0.4);border-radius:20px;padding:22px 20px;width:82vw;max-width:300px;text-align:center;';
  pp.addEventListener('click',function(e){e.stopPropagation();});

  if(alreadyOpen){
    pp.innerHTML=
      '<div style="font-size:50px;margin-bottom:10px;filter:grayscale(1);">📦</div>'+
      '<div style="font-size:16px;color:#aaa;margin-bottom:6px;">Mystery Box</div>'+
      '<div style="color:#555;font-size:12px;margin-bottom:16px;">Already opened today.<br>Come back tomorrow!</div>'+
      '<button onclick="document.getElementById(\'mysteryOverlay\').remove();" style="background:#1a1a1a;border:1px solid #333;color:#aaa;padding:10px 24px;border-radius:10px;cursor:pointer;">Close</button>';
  } else {
    pp.innerHTML=
      '<div id="mysteryBox" style="font-size:60px;margin-bottom:10px;cursor:pointer;animation:boxFloat 2s ease-in-out infinite;transition:transform 0.2s;" onclick="revealMystery()">📦</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:15px;color:#CC88FF;margin-bottom:6px;">Mystery Box</div>'+
      '<div style="color:#888;font-size:11px;margin-bottom:16px;">Tap the box to reveal your daily prize!</div>'+
      '<div style="color:#555;font-size:10px;">1 free box per day</div>'+
      '<style>@keyframes boxFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}</style>';
  }

  ol.appendChild(pp); document.body.appendChild(ol);
}

function revealMystery(){
  var today=getTodayStr();
  if(mysteryLastDate===today){showToast('Already opened today!');return;}

  var roll=Math.random()*100;
  var reward;
  if(roll<40)      reward={type:'record',amount:Math.floor(5000+Math.random()*45000),label:'RECORD'};
  else if(roll<65) reward={type:'record',amount:Math.floor(50000+Math.random()*450000),label:'RECORD'};
  else if(roll<80) reward={type:'record',amount:Math.floor(500000+Math.random()*1500000),label:'RECORD'};
  else if(roll<90) reward={type:'record',amount:Math.floor(2000000+Math.random()*8000000),label:'RECORD'};
  else if(roll<96) reward={type:'rec',amount:parseFloat((0.001+Math.random()*0.009).toFixed(4)),label:'REC'};
  else if(roll<99) reward={type:'rec',amount:parseFloat((0.01+Math.random()*0.09).toFixed(4)),label:'REC'};
  else             reward={type:'rec',amount:parseFloat((0.1+Math.random()*0.4).toFixed(4)),label:'REC'};

  if(reward.type==='record') record+=reward.amount;
  else rec+=reward.amount;
  mysteryLastDate=today;
  saveData(true); updateUI();

  var pp=document.querySelector('#mysteryOverlay > div');
  if(!pp)return;
  var isRec=reward.type==='rec';
  var emoji=isRec?'🟢':'💥';
  var color=isRec?'#00FF88':'#FFD700';
  var amtStr=isRec?reward.amount+' REC':formatCost(reward.amount)+' RECORD';
  var rarity=roll<40?'Common':roll<65?'Uncommon':roll<80?'Rare':roll<90?'Epic':roll<96?'Legendary':'MYTHIC';
  var rarityColor=roll<40?'#888':roll<65?'#4488FF':roll<80?'#AA44FF':roll<90?'#FF8800':roll<96?'#FFD700':'#FF0055';

  pp.innerHTML=
    '<div style="font-size:60px;margin-bottom:8px;animation:popIn 0.4s ease;">'+emoji+'</div>'+
    '<div style="font-family:Orbitron,sans-serif;font-size:13px;color:'+rarityColor+';margin-bottom:4px;">'+rarity+'!</div>'+
    '<div style="font-size:24px;color:'+color+';font-family:Orbitron,sans-serif;font-weight:bold;margin:10px 0;">+'+amtStr+'</div>'+
    '<div style="color:#666;font-size:10px;margin-bottom:16px;">Added to your balance</div>'+
    '<button onclick="document.getElementById(\'mysteryOverlay\').remove();" style="background:linear-gradient(135deg,#4a0080,#8800FF);border:none;color:white;padding:10px 28px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;">Awesome! 🎉</button>'+
    '<style>@keyframes popIn{from{transform:scale(0)}to{transform:scale(1)}}</style>';
}

// ====== DAILY TASKS ======
var DAILY_TASK_POOL=[
  {id:'tap50',label:'Tap 50 times today',labelAr:'اكبس 50 مرة اليوم',type:'taps',target:50,reward:{record:5000}},
  {id:'tap100',label:'Tap 100 times today',labelAr:'اكبس 100 مرة اليوم',type:'taps',target:100,reward:{record:12000}},
  {id:'tap200',label:'Tap 200 times today',labelAr:'اكبس 200 مرة اليوم',type:'taps',target:200,reward:{record:25000}},
  {id:'tap500',label:'Tap 500 times today',labelAr:'اكبس 500 مرة اليوم',type:'taps',target:500,reward:{record:70000}},
  {id:'upg1',label:'Upgrade 1 card today',labelAr:'رقّ بطاقة واحدة اليوم',type:'upgrades',target:1,reward:{record:15000}},
  {id:'upg3',label:'Upgrade 3 cards today',labelAr:'رقّ 3 بطاقات اليوم',type:'upgrades',target:3,reward:{record:50000}},
  {id:'upg5',label:'Upgrade 5 cards today',labelAr:'رقّ 5 بطاقات اليوم',type:'upgrades',target:5,reward:{record:120000}},
  {id:'spend50k',label:'Spend 50K RECORD on upgrades',labelAr:'اصرف 50K RECORD على الترقيات',type:'spent',target:50000,reward:{record:30000}},
  {id:'spend500k',label:'Spend 500K RECORD on upgrades',labelAr:'اصرف 500K RECORD على الترقيات',type:'spent',target:500000,reward:{record:200000}},
];

function getTodayTaskIndices(){
  var d=getTodayStr();
  var seed=0;
  for(var i=0;i<d.length;i++) seed=((seed*31)+d.charCodeAt(i))&0xFFFFFF;
  var pool=DAILY_TASK_POOL.slice();
  var picked=[];
  for(var j=0;j<3;j++){
    var idx=seed%pool.length;
    picked.push(pool.splice(idx,1)[0]);
    seed=Math.floor(seed/7)+j*13+1;
  }
  return picked;
}

function resetDailyTasks(today){
  dailyTasksData={date:today,done:[],taps:0,upgrades:0,spent:0};
}

function checkDailyTaskProgress(){
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  var tasks=getTodayTaskIndices();
  tasks.forEach(function(task){
    if(dailyTasksData.done.indexOf(task.id)!==-1) return;
    var prog=dailyTasksData[task.type]||0;
    if(prog>=task.target){
      dailyTasksData.done.push(task.id);
      if(task.reward.record) record+=task.reward.record;
      if(task.reward.rec) rec+=task.reward.rec;
      saveData(true); updateUI();
      showToast('✅ Task done! +'+formatCost(task.reward.record||0)+' RECORD');
    }
  });
  renderDailyTasksUI();
}

function renderDailyTasksUI(){
  var cont=document.getElementById('dailyTasksCont');
  if(!cont)return;
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  var tasks=getTodayTaskIndices();
  var html='';
  tasks.forEach(function(task){
    var done=dailyTasksData.done.indexOf(task.id)!==-1;
    var prog=Math.min(dailyTasksData[task.type]||0,task.target);
    var pct=Math.round(prog/task.target*100);
    var label=currentLang==='ar'?task.labelAr:task.label;
    var rewardStr=task.reward.record?formatCost(task.reward.record)+' RECORD':(task.reward.rec+' REC');
    html+=
      '<div style="background:'+(done?'rgba(0,80,0,0.3)':'rgba(10,10,20,0.7)')+';border:1px solid '+(done?'#1a7a1a':'rgba(255,255,255,0.07)')+';border-radius:12px;padding:12px;margin-bottom:8px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">'+
          '<div style="font-size:12px;color:'+(done?'#4eff4e':'#ddd')+';flex:1;">'+label+'</div>'+
          '<div style="font-size:11px;color:'+(done?'#4eff4e':'#FFD700')+';margin-left:8px;white-space:nowrap;">'+(done?'✅ Done':'🏆 '+rewardStr)+'</div>'+
        '</div>'+
        (!done?
          '<div style="background:rgba(255,255,255,0.05);border-radius:6px;height:5px;overflow:hidden;">'+
            '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#FF4400,#FFD700);border-radius:6px;transition:width 0.3s;"></div>'+
          '</div>'+
          '<div style="font-size:9px;color:#555;text-align:right;margin-top:3px;">'+prog+' / '+task.target+'</div>':'')+
      '</div>';
  });
  cont.innerHTML=html;
}

// ====== CARD MISSIONS (in Tasks page) ======
var CARD_MISSIONS=[
  {id:'cm_naruto5',label:'Upgrade Naruto to Lv 5',labelAr:'رقّ ناروتو للمستوى 5',cardKey:'0_0',reqLvl:5,reward:{rec:0.005}},
  {id:'cm_goku10',label:'Upgrade Goku to Lv 10',labelAr:'رقّ غوكو للمستوى 10',cardKey:'0_1',reqLvl:10,reward:{rec:0.01}},
  {id:'cm_luffy8',label:'Upgrade Luffy to Lv 8',labelAr:'رقّ لوفي للمستوى 8',cardKey:'0_2',reqLvl:8,reward:{rec:0.008}},
  {id:'cm_gojo20',label:'Upgrade Gojo to Lv 20',labelAr:'رقّ غوجو للمستوى 20',cardKey:'0_24',reqLvl:20,reward:{rec:0.1}},
  {id:'cm_ferrari5',label:'Upgrade Ferrari SF90 to Lv 5',labelAr:'رقّ Ferrari SF90 للمستوى 5',cardKey:'1_0',reqLvl:5,reward:{rec:0.005}},
  {id:'cm_lambo10',label:'Upgrade Lamborghini to Lv 10',labelAr:'رقّ لامبورغيني للمستوى 10',cardKey:'1_1',reqLvl:10,reward:{rec:0.015}},
  {id:'cm_any25',label:'Get any card to Lv 25',labelAr:'وصّل أي بطاقة للمستوى 25',cardKey:'any',reqLvl:25,reward:{rec:0.1}},
  {id:'cm_any50',label:'Get any card to Lv 50',labelAr:'وصّل أي بطاقة للمستوى 50',cardKey:'any',reqLvl:50,reward:{rec:1}},
  {id:'cm_any75',label:'Get any card to Lv 75',labelAr:'وصّل أي بطاقة للمستوى 75',cardKey:'any',reqLvl:75,reward:{rec:5}},
  {id:'cm_any100',label:'Get any card to Lv 100',labelAr:'وصّل أي بطاقة للمستوى 100',cardKey:'any',reqLvl:100,reward:{rec:15}},
];

function checkCardMissions(){
  var changed=false;
  CARD_MISSIONS.forEach(function(m){
    if(cardTasksClaimed.indexOf(m.id)!==-1) return;
    var met=false;
    if(m.cardKey==='any'){
      met=Object.keys(cardLevels).some(function(k){return (cardLevels[k]||0)>=m.reqLvl;});
    } else {
      met=(cardLevels[m.cardKey]||0)>=m.reqLvl;
    }
    if(met){
      cardTasksClaimed.push(m.id);
      if(m.reward.rec) rec+=m.reward.rec;
      if(m.reward.record) record+=m.reward.record;
      changed=true;
      showToast('🎯 Mission done! +'+m.reward.rec+' REC');
    }
  });
  if(changed){saveData(true);updateUI();renderCardMissionsUI();}
}

function renderCardMissionsUI(){
  var cont=document.getElementById('cardMissionsCont');
  if(!cont)return;
  var html='';
  CARD_MISSIONS.forEach(function(m){
    var done=cardTasksClaimed.indexOf(m.id)!==-1;
    var label=currentLang==='ar'?m.labelAr:m.label;
    var prog=0,target=m.reqLvl;
    if(m.cardKey==='any'){
      Object.keys(cardLevels).forEach(function(k){prog=Math.max(prog,cardLevels[k]||0);});
    } else {
      prog=cardLevels[m.cardKey]||0;
    }
    prog=Math.min(prog,target);
    var pct=Math.round(prog/target*100);
    html+=
      '<div style="background:'+(done?'rgba(0,80,0,0.3)':'rgba(10,10,20,0.7)')+';border:1px solid '+(done?'#1a7a1a':'rgba(0,255,136,0.12)')+';border-radius:12px;padding:12px;margin-bottom:8px;">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">'+
          '<div style="font-size:12px;color:'+(done?'#4eff4e':'#ddd')+';flex:1;">'+label+'</div>'+
          '<div style="font-size:11px;color:'+(done?'#4eff4e':'#00FF88')+';margin-left:8px;white-space:nowrap;">'+(done?'✅':'🟢 +'+m.reward.rec+' REC')+'</div>'+
        '</div>'+
        (!done?
          '<div style="background:rgba(255,255,255,0.05);border-radius:6px;height:5px;overflow:hidden;">'+
            '<div style="width:'+pct+'%;height:100%;background:linear-gradient(90deg,#00AA44,#00FF88);border-radius:6px;"></div>'+
          '</div>'+
          '<div style="font-size:9px;color:#555;text-align:right;margin-top:3px;">Lv '+prog+' / '+target+'</div>':'')+
      '</div>';
  });
  cont.innerHTML=html;
}

function initNewFeatures(){
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  renderDailyTasksUI();
  renderCardMissionsUI();
  renderTwitterTasks();
}
function upgradeTap(){
  var cost=getTapCost(tapLevelVal);
  if(record<cost||tapLevelVal>=100)return;
  record-=cost; tapLevelVal++;
  tapPowerVal=(tapLevelVal+1)*2;
  saveData(true); updateUpgradeUI(); updateUI();
}
function upgradeEnergy(){
  var cost=getEnergyCost(energyLevelVal);
  if(record<cost||energyLevelVal>=100)return;
  record-=cost; energyLevelVal++;
  maxEnergy=Math.floor(1000*Math.pow(10000,energyLevelVal/99));
  saveData(true); updateUpgradeUI(); updateUI();
}

// ====== ENERGY REFILL ======
function useEnergyRefill(){
  var today=getTodayStr();
  if(!window.refillData || window.refillData.date!==today){
    window.refillData={date:today,count:3};
  }
  if(window.refillData.count<=0){
    showToast('❌ انتهت فرصك اليوم! انتظر الغد');
    return;
  }
  energy=maxEnergy;
  window.refillData.count--;
  saveData(true); updateUI(); updateUpgradeUI();
  showToast('⚡ تمت تعبئة الطاقة! '+window.refillData.count+' فرص متبقية');
}

function loadRefillData(){
  // البيانات تتحمل من applyData — بس نتأكد من التاريخ
  var today=getTodayStr();
  if(!window.refillData || window.refillData.date!==today){
    window.refillData={date:today,count:3};
  }
}

function updateUpgradeUI(){
  var s=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  s('tapLevel',tapLevelVal);s('energyLevel',energyLevelVal);
  s('tapCost',getTapCost(tapLevelVal).toLocaleString());
  s('energyCost',getEnergyCost(energyLevelVal).toLocaleString());
  s('tapPower',tapPowerVal);s('maxEnergyShow',maxEnergy.toLocaleString());
  var tb=document.getElementById('tapUpgradeBtn');if(tb)tb.disabled=record<getTapCost(tapLevelVal)||tapLevelVal>=100;
  var eb=document.getElementById('energyUpgradeBtn');if(eb)eb.disabled=record<getEnergyCost(energyLevelVal)||energyLevelVal>=100;
  // refill button
  loadRefillData();
  var rc=document.getElementById('refillCount');if(rc)rc.textContent=window.refillData.count;
  var rb=document.getElementById('energyRefillBtn');if(rb)rb.disabled=window.refillData.count<=0;
}

// ====== DAILY COMBO ======
var comboData = null;
var ADMIN_TG_ID = 6995765586;
var adminComboSelection = [null, null, null];

function openCombo() {
  document.getElementById('comboOverlay').style.display = 'block';
  document.getElementById('comboPopup').style.display = 'block';
  loadComboData();
  if(tgUser && tgUser.id === ADMIN_TG_ID) {
    document.getElementById('comboAdminPanel').style.display = 'block';
    buildAdminComboSlots();
  }
}

function closeCombo() {
  document.getElementById('comboOverlay').style.display = 'none';
  document.getElementById('comboPopup').style.display = 'none';
}

function loadComboData() {
  if(!tgUser) return;
  var slots = document.getElementById('comboCardSlots');
  if(slots) slots.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.3);padding:20px;">⏳ Loading...</div>';

  fetch('/api/combo/today/' + tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      comboData = d;
      renderComboSlots(d);
    })
    .catch(function(){
      var slots = document.getElementById('comboCardSlots');
      if(slots) slots.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.3);padding:20px;">ما في كومبو اليوم بعد</div>';
    });
}

function renderComboSlots(d) {
  var slots = document.getElementById('comboCardSlots');
  if(!slots) return;

  if(!d || !d.exists) {
    slots.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;"><div style="font-size:32px;margin-bottom:8px;">🔒</div><div style="color:rgba(255,255,255,0.3);font-size:13px;">لم يُحدد كومبو اليوم بعد</div></div>';
    return;
  }

  slots.innerHTML = d.cards.map(function(c, i) {
    var cardInfo = getCardInfo(c.categoryIndex, c.cardIndex);
    var done = c.done;
    return '<div style="background:' + (done ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.04)') + ';border:1px solid ' + (done ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.08)') + ';border-radius:14px;padding:14px 8px;text-align:center;">' +
      '<div style="font-size:28px;margin-bottom:6px;">' + (done ? (cardInfo ? cardInfo.e : '✅') : '?') + '</div>' +
      '<div style="font-size:10px;color:' + (done ? '#00FF88' : 'rgba(255,255,255,0.3)') + ';font-weight:700;">' + (done ? (cardInfo ? cardInfo.name : 'Done') : '???') + '</div>' +
      '<div style="font-size:18px;margin-top:6px;">' + (done ? '✅' : '🔒') + '</div>' +
      '</div>';
  }).join('');

  var claimArea = document.getElementById('comboClaimArea');
  var claimed = document.getElementById('comboClaimed');
  var allDone = d.allDone;
  var alreadyClaimed = d.cards.every(function(c){ return c.done; }) && allDone;

  if(claimArea) claimArea.style.display = allDone && !d.rewardClaimed ? 'block' : 'none';
  if(claimed) claimed.style.display = d.rewardClaimed ? 'block' : 'none';

  // Update badge on home
  var badge = document.getElementById('comboDotBadge');
  if(badge) badge.style.display = (d.exists && !allDone) ? 'block' : 'none';
}

function getCardInfo(catIdx, cardIdx) {
  try {
    var cats = typeof categories !== 'undefined' ? categories : [];
    if(cats[catIdx] && cats[catIdx].cards[cardIdx]) {
      var card = cats[catIdx].cards[cardIdx];
      return { e: card.e || '🃏', name: card.en || card.n || 'Card' };
    }
  } catch(e) {}
  return null;
}

function claimCombo() {
  if(!tgUser || !comboData) return;
  // Reward is given server-side automatically when all cards done
  document.getElementById('comboClaimArea').style.display = 'none';
  document.getElementById('comboClaimed').style.display = 'block';
  showToast('🎉 حصلت على +5 REC!');
  rec += 5;
  saveData(true); updateUI();
}

// Called when a card is upgraded — checks against combo
function checkComboOnUpgrade(cardKey) {
  if(!tgUser || !comboData || !comboData.exists) return;
  fetch('/api/combo/check', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ telegramId: tgUser.id, cardKey: cardKey })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(d.matched) {
      showToast('🎯 بطاقة كومبو! ' + d.done + '/3');
      if(d.allDone && d.reward > 0) {
        rec += d.reward;
        saveData(true); updateUI();
        showToast('🎉 أكملت الكومبو! +' + d.reward + ' REC');
      }
      loadComboData(); // refresh combo display
    }
  }).catch(function(){});
}

// ====== ADMIN COMBO SETTER ======
function buildAdminComboSlots() {
  var panel = document.getElementById('comboAdminSlots');
  if(!panel) return;
  var cats = typeof categories !== 'undefined' ? categories : [];
  var allCards = [];
  cats.forEach(function(cat, ci) {
    cat.cards.forEach(function(card, idx) {
      allCards.push({ key: ci+'_'+idx, label: (card.e||'🃏') + ' ' + (card.en||card.n||'Card'), ci: ci, idx: idx });
    });
  });

  panel.innerHTML = [0,1,2].map(function(slot) {
    return '<select id="adminComboSlot_'+slot+'" style="width:100%;background:rgba(0,0,0,0.5);border:1px solid rgba(255,100,50,0.3);color:white;padding:8px;border-radius:8px;font-size:11px;">' +
      '<option value="">-- بطاقة '+(slot+1)+' --</option>' +
      allCards.map(function(c) {
        return '<option value="'+c.key+'|'+c.ci+'|'+c.idx+'">'+c.label+'</option>';
      }).join('') +
      '</select>';
  }).join('');
}

function saveAdminCombo() {
  if(!tgUser || tgUser.id !== ADMIN_TG_ID) return;
  var cards = [];
  for(var i=0;i<3;i++) {
    var sel = document.getElementById('adminComboSlot_'+i);
    if(!sel || !sel.value) { showToast('❌ اختر 3 بطاقات'); return; }
    var parts = sel.value.split('|');
    cards.push({ key: parts[0], categoryIndex: parseInt(parts[1]), cardIndex: parseInt(parts[2]) });
  }
  if(cards[0].key===cards[1].key || cards[1].key===cards[2].key || cards[0].key===cards[2].key) {
    showToast('❌ لا تكرر نفس البطاقة'); return;
  }
  fetch('/api/combo/set', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ adminId: tgUser.id, cards })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(d.success) { showToast('✅ تم حفظ الكومبو!'); loadComboData(); }
    else showToast('❌ خطأ: ' + d.error);
  }).catch(function(){ showToast('❌ خطأ في الاتصال'); });
}
// ====== END DAILY COMBO ======

// ====== WALLET PAGE ======
function updateWalletPage() {
  var name = tgUser ? (tgUser.first_name || 'Miner') : 'Miner';
  var id   = tgUser ? tgUser.id : '—';
  var el;

  el = document.getElementById('walletName'); if(el) el.textContent = name;
  el = document.getElementById('walletId');   if(el) el.textContent = id;
  el = document.getElementById('walletAvatar'); if(el) el.textContent = name[0].toUpperCase();
  el = document.getElementById('walletAssets'); if(el) el.textContent = rec.toFixed(6) + ' REC';
  el = document.getElementById('walletPool');   if(el) el.textContent = rec.toFixed(6) + ' REC';
  el = document.getElementById('profileId');    if(el) el.textContent = id;
  el = document.getElementById('recPoolBalance'); if(el) el.textContent = rec.toFixed(6);
}

function openWithdrawHistory() {
  if(!tgUser) return;
  var overlay = document.getElementById('historyOverlay');
  if(overlay) { overlay.classList.add('open'); loadWithdrawHistory(); return; }

  // Create overlay
  var ol = document.createElement('div');
  ol.id = 'historyOverlay';
  ol.className = 'overlay-page open';
  ol.innerHTML =
    '<button class="back-btn" onclick="document.getElementById(\'historyOverlay\').classList.remove(\'open\')">← Back</button>' +
    '<h2 style="margin-bottom:16px;color:#FF6644;font-family:Orbitron,sans-serif;font-size:18px;">📄 History</h2>' +
    '<div id="historyContent" style="color:rgba(255,255,255,0.4);text-align:center;padding:30px;">⏳ Loading...</div>';
  document.body.appendChild(ol);
  loadWithdrawHistory();
}

function loadWithdrawHistory() {
  if(!tgUser) return;
  var el = document.getElementById('historyContent');
  if(!el) return;
  fetch('/api/withdrawals/'+tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      if(!d.withdrawals || d.withdrawals.length === 0) {
        el.innerHTML = '<div style="text-align:center;padding:40px 20px;"><div style="font-size:40px;margin-bottom:12px;">📭</div><div style="color:rgba(255,255,255,0.3);font-size:14px;">No withdrawals yet</div></div>';
        return;
      }
      el.innerHTML = d.withdrawals.map(function(w){
        var date = new Date(w.createdAt).toLocaleDateString();
        var statusColor = w.status==='sent' ? '#00FF88' : w.status==='pending' ? '#FFD700' : '#FF4444';
        return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:14px;margin-bottom:8px;">'+
          '<div style="display:flex;justify-content:space-between;align-items:center;">'+
          '<div><div style="font-size:15px;font-weight:700;color:#00FF88;">'+w.netAmount+' REC</div>'+
          '<div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;">'+date+'</div></div>'+
          '<div style="font-size:11px;font-weight:700;color:'+statusColor+';text-transform:uppercase;">'+w.status+'</div>'+
          '</div></div>';
      }).join('');
    })
    .catch(function(){
      el.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.3);padding:20px;">Could not load history</div>';
    });
}
// ====== END WALLET PAGE ======

// ====== PROFILE POPUP ======
function openProfilePopup() {
  var popup = document.getElementById('profilePopup');
  var overlay = document.getElementById('profilePopupOverlay');
  if(!popup) return;

  var name = tgUser ? (tgUser.first_name || 'Miner') : 'Miner';
  var username = tgUser ? (tgUser.username ? '@'+tgUser.username : 'ID: '+tgUser.id) : '';
  document.getElementById('ppName').textContent = name;
  document.getElementById('ppUsername').textContent = username;

  var avatarEl = document.getElementById('ppAvatar');
  avatarEl.textContent = name[0].toUpperCase();

  // Count cards
  var totalCards = 0, upgradedCards = 0, totalCardLevels = 0;
  var categories_list = typeof categories !== 'undefined' ? categories : [];
  categories_list.forEach(function(cat){ totalCards += cat.cards.length; });
  Object.keys(cardLevels).forEach(function(k){
    var lvl = cardLevels[k] || 0;
    if(lvl > 0) upgradedCards++;
    totalCardLevels += lvl;
  });

  var tasksDone = completedTasks.length;
  var speed = recPerSec > 0 ? recPerSec.toFixed(8) : '0.00000000';

  var stats = [
    { icon:'⛏️', label:'CARDS UPGRADED', val: upgradedCards+' / '+totalCards, color:'#AA66FF' },
    { icon:'⚡', label:'REC SPEED', val: speed+'/s', color:'#00FF88' },
    { icon:'🔴', label:'RECORD', val: Math.floor(record).toLocaleString(), color:'#FF6644' },
    { icon:'💚', label:'REC BALANCE', val: rec.toFixed(4), color:'#00FF88' },
    { icon:'👆', label:'TOTAL TAPS', val: (totalTaps||0).toLocaleString(), color:'#FFD700' },
    { icon:'✅', label:'TASKS DONE', val: tasksDone, color:'#44FFAA' },
    { icon:'👥', label:'FRIENDS', val: refCount, color:'#44CCFF' },
    { icon:'📈', label:'CARD LEVELS', val: totalCardLevels, color:'#FF8844' },
  ];

  var grid = document.getElementById('ppStatsGrid');
  if(grid) grid.innerHTML = stats.map(function(s){
    return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:12px 10px;text-align:center;">'+
      '<div style="font-size:22px;margin-bottom:4px;">'+s.icon+'</div>'+
      '<div style="font-size:12px;font-weight:700;color:'+s.color+';font-family:Orbitron,sans-serif;line-height:1.2;word-break:break-all;">'+s.val+'</div>'+
      '<div style="font-size:9px;color:rgba(255,255,255,0.3);margin-top:4px;letter-spacing:1px;">'+s.label+'</div>'+
      '</div>';
  }).join('');

  // Top cards
  var cardsList = [];
  categories_list.forEach(function(cat){
    cat.cards.forEach(function(card, idx){
      var key = (cat.nameKey||'cat')+'_'+idx;
      var lvl = cardLevels[key] || 0;
      if(lvl > 0) cardsList.push({ e:card.e||'🃏', n:card.en||card.n||'Card', lvl:lvl });
    });
  });
  cardsList.sort(function(a,b){ return b.lvl-a.lvl; });

  var cardsGrid = document.getElementById('ppCardsGrid');
  if(cardsGrid) {
    if(cardsList.length === 0) {
      cardsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.25);font-size:12px;padding:10px 0;">No cards upgraded yet</div>';
    } else {
      cardsGrid.innerHTML = cardsList.slice(0,12).map(function(c){
        return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:8px 4px;text-align:center;">'+
          '<div style="font-size:22px;">'+c.e+'</div>'+
          '<div style="font-size:9px;color:rgba(255,255,255,0.5);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+c.n+'</div>'+
          '<div style="font-size:10px;color:#FF6644;font-weight:700;margin-top:1px;">LVL '+c.lvl+'</div>'+
          '</div>';
      }).join('');
    }
  }

  overlay.style.display = 'block';
  popup.style.display = 'block';
  popup.style.animation = 'slideUp 0.3s ease';
}

function closeProfilePopup() {
  var p = document.getElementById('profilePopup');
  var o = document.getElementById('profilePopupOverlay');
  if(p) p.style.display = 'none';
  if(o) o.style.display = 'none';
}
// ====== END PROFILE POPUP ======

// ====== INVITE PAGE FUNCTIONS ======
var refData = { l1:[], l2:[], l3:[] };
var currentRefLevel = 1;

function switchInviteTab(tab, btn) {
  document.getElementById('inviteTabContent_invite').style.display = tab==='invite' ? 'block' : 'none';
  document.getElementById('inviteTabContent_referrals').style.display = tab==='referrals' ? 'block' : 'none';
  ['invite','referrals'].forEach(function(t){
    var b = document.getElementById('inviteTab_'+t);
    if(b) {
      if(t===tab) {
        b.style.background='rgba(255,100,50,0.15)';
        b.style.borderColor='rgba(255,100,50,0.5)';
        b.style.color='#FF6644';
      } else {
        b.style.background='rgba(255,255,255,0.04)';
        b.style.borderColor='rgba(255,255,255,0.08)';
        b.style.color='rgba(255,255,255,0.4)';
      }
    }
  });
  if(tab==='referrals') loadRefList();
}

function switchRefLevel(lvl) {
  currentRefLevel = lvl;
  [1,2,3].forEach(function(l){
    var b = document.getElementById('refLvlBtn_'+l);
    if(!b) return;
    if(l===lvl) {
      b.style.background='rgba(255,100,50,0.15)';
      b.style.borderColor='rgba(255,100,50,0.5)';
      b.style.color='#FF6644';
    } else {
      b.style.background='rgba(255,255,255,0.04)';
      b.style.borderColor='rgba(255,255,255,0.08)';
      b.style.color='rgba(255,255,255,0.3)';
    }
  });
  renderRefList();
}

function loadRefList() {
  if(!tgUser) return;
  var el = document.getElementById('refListContent');
  if(el) el.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.2);font-size:13px;">⏳ Loading...</div>';
  fetch('/api/referrals/'+tgUser.id)
    .then(function(r){ return r.json(); })
    .then(function(d){
      refData = d;
      renderRefList();
    })
    .catch(function(){
      var el = document.getElementById('refListContent');
      if(el) el.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.2);">Could not load</div>';
    });
}

function renderRefList() {
  var el = document.getElementById('refListContent');
  if(!el) return;
  var list = currentRefLevel===1 ? refData.l1 : currentRefLevel===2 ? refData.l2 : refData.l3;
  if(!list || list.length === 0) {
    el.innerHTML = '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;text-align:center;"><div style="font-size:32px;margin-bottom:8px;">👥</div><div style="font-size:13px;color:rgba(255,255,255,0.25);">No referrals yet</div></div>';
    return;
  }
  el.innerHTML = list.map(function(u){
    var name = u.username ? '@'+u.username : (u.firstName||'User');
    var speed = (u.miningSpeed||0).toFixed(6);
    var earned = (u.rec||0).toFixed(3);
    return '<div style="display:grid;grid-template-columns:1fr 80px 80px;gap:4px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 12px;margin-bottom:6px;align-items:center;">'+
      '<div style="font-size:13px;color:white;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+name+'</div>'+
      '<div style="font-size:10px;color:rgba(0,255,136,0.7);text-align:center;">'+speed+'</div>'+
      '<div style="font-size:11px;color:#00FF88;text-align:right;font-weight:700;">'+earned+'</div>'+
      '</div>';
  }).join('');
}

// Update invite link display when page loads
function updateInviteLinkDisplay() {
  var el = document.getElementById('inviteLinkDisplay');
  if(!el || !tgUser) return;
  var botUsername = 'RecMiningGame_bot';
  el.textContent = 'https://t.me/'+botUsername+'?start='+tgUser.id;
}

// ====== END INVITE PAGE ======

// ====== CARDS ======
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
  if(currentLang==='en'||currentLang==='uk'||currentLang==='zh') return card.en||card.n;
  return card.n;
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
  var recRec = cardRecordSpeed(lvl);
  var recSpd = cardRECSpeed(lvl);
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
  var cost = cardCost(lvl);
  if(record < cost){ showToast('⛔ ' + t('toastNotEnoughRecord')); return; }
  record -= cost;
  var wait = cardWait(lvl);
  cardUpgrades[key] = { endTime: Date.now() + wait*1000, toLevel: lvl+1 };
  var today=getTodayStr();
  if(dailyTasksData.date!==today) resetDailyTasks(today);
  dailyTasksData.upgrades++; dailyTasksData.spent+=cost;
  checkDailyTaskProgress(); checkCardMissions();
  saveData(true); updateUI();
  updateCardGridItem(key);
  showToast('⏳ ' + formatWait(wait));
}

function renderCardGridItem(div, key, card) {
  var ci = parseInt(key.split('_')[0]);
  var idx = parseInt(key.split('_')[1]);
  var lvl = cardLevels[key]||0;
  var upg = cardUpgrades[key];
  var now = Date.now();
  var isUpgrading = upg && upg.endTime > now;
  var rem = isUpgrading ? Math.max(0, Math.ceil((upg.endTime-now)/1000)) : 0;
  var recRec = cardRecordSpeed(lvl);
  var cost = cardCost(lvl);
  var rarity = getCardRarity(lvl);
  var cardName = getCardName(card);
  var bg = getCardBg(ci, idx);
  var canUpgrade = record >= cost && lvl < 100 && !isUpgrading;
  var isLimited = ci === 4;
  var multi = isLimited ? 3 : 1;
  var boostedRec = recRec * multi;

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
        ? '<div style="font-size:9px;color:#00FF88;margin-bottom:5px;">⚡ '+Math.floor(boostedRec)+' R/s'+(isLimited?' <span style="color:#FFD700;">×3</span>':'')+'</div>'
        : '<div style="font-size:9px;color:#444;margin-bottom:5px;">⛔ No mining</div>')+
      // Upgrade button
      (lvl >= 100
        ? '<div style="background:rgba(255,215,0,0.15);border:1px solid #FFD700;border-radius:8px;padding:4px;font-size:9px;color:#FFD700;text-align:center;">MAX ✅</div>'
        : isUpgrading
          ? '<div id="timer_'+key+'" style="background:rgba(255,200,0,0.15);border:1px solid #FFD700;border-radius:8px;padding:4px;font-size:9px;color:#FFD700;text-align:center;">⏳ '+formatWait(rem)+'</div>'
          : '<button onclick="directUpgrade('+ci+','+idx+',event)" style="width:100%;background:'+(canUpgrade?'linear-gradient(135deg,#CC0000,#FF2200)':'rgba(30,30,30,0.8)')+';border:1px solid '+(canUpgrade?'#FF4444':'#333')+';border-radius:8px;padding:4px;font-size:9px;color:'+(canUpgrade?'white':'#555')+';cursor:'+(canUpgrade?'pointer':'not-allowed')+';font-weight:bold;">'+
            (lvl===0?'🔓 ':'⬆️ ')+formatCost(cost)+' REC</button>')+
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
  cont.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.3);">⏳ Loading...</div>';

  var uid = tgUser ? tgUser.id : 0;

  // Fetch each independently so one failure doesn't break all
  var p1 = fetch('/api/leaderboard/global').then(function(r){return r.json();}).catch(function(){return {top100:[]};});
  var p2 = fetch('/api/leaderboard/myrank/'+uid).then(function(r){return r.json();}).catch(function(){return {myRank:'-',neighbors:[]};});
  var p3 = fetch('/api/leaderboard/weekly').then(function(r){return r.json();}).catch(function(){return {daysLeft:7};});

  Promise.all([p1, p2, p3]).then(function(results) {
    var top100 = (results[0] && results[0].top100) ? results[0].top100 : [];
    renderGlobal(top100, results[1], results[2]);
  }).catch(function() {
    cont.innerHTML = '<div style="text-align:center;padding:30px;">' +
      '<div style="font-size:36px;margin-bottom:10px;">📡</div>' +
      '<div style="color:rgba(255,255,255,0.4);font-size:13px;margin-bottom:16px;">Connection failed</div>' +
      '<button onclick="loadLeaderboard(\'global\')" style="background:linear-gradient(135deg,#CC0000,#FF2200);border:none;color:white;padding:10px 24px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:Rajdhani,sans-serif;">🔄 Try Again</button>' +
      '</div>';
  });
}

function renderGlobal(top100, myRankData, weekly) {
  var cont = document.getElementById('lbContent');
  var myRank = myRankData ? myRankData.myRank : '-';

  // Calculate end of week client-side (next Sunday midnight)
  var _d = new Date();
  var _day = _d.getDay();
  var _daysLeft = _day === 0 ? 7 : 7 - _day;
  var _endOfWeek = new Date(_d.getTime() + _daysLeft * 86400000);
  _endOfWeek.setHours(0,0,0,0);
  weeklyEndMs = _endOfWeek.getTime();

  // Pre-calculate countdown string
  var _diff = Math.max(0, weeklyEndMs - Date.now());
  var _dd = Math.floor(_diff/86400000);
  var _hh = Math.floor((_diff%86400000)/3600000);
  var _mm = Math.floor((_diff%3600000)/60000);
  var _ss = Math.floor((_diff%60000)/1000);
  var _cdStr = pad2(_dd)+'d '+pad2(_hh)+'h '+pad2(_mm)+'m '+pad2(_ss)+'s';

  var html = '';

  // Weekly countdown
  html += '<div style="text-align:center;margin-bottom:16px;">' +
    '<div style="font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:2px;margin-bottom:4px;">REWARDS CREDIT IN</div>' +
    '<div id="weeklyCountdown" style="font-family:Orbitron,sans-serif;font-size:16px;color:#FFD700;font-weight:700;letter-spacing:2px;">'+_cdStr+'</div>' +
    '</div>';

  if(top100.length === 0) {
    cont.innerHTML = html + '<div style="text-align:center;color:#555;padding:30px;">🏆</div>';
    return;
  }

  // Full list from #1 — highlight current user naturally
  var rankColors = { 1:'#FFD700', 2:'#C0C0C0', 3:'#CD7F32' };
  var avatarBgs  = { 1:'linear-gradient(135deg,#CC8800,#FFD700)', 2:'linear-gradient(135deg,#777,#C0C0C0)', 3:'linear-gradient(135deg,#7a4f2a,#CD7F32)' };

  top100.forEach(function(p) {
    var isMe   = tgUser && p.telegramId == tgUser.id;
    var speed  = isMe ? recPerSec : (p.miningSpeed || 0);
    var speedStr = speed > 0 ? speed.toFixed(6) : '—';
    var rCol   = rankColors[p.rank] || (isMe ? '#FF6644' : 'rgba(255,255,255,0.4)');
    var bg     = isMe ? 'rgba(255,100,50,0.12)' : 'rgba(255,255,255,0.03)';
    var border = isMe ? 'rgba(255,100,50,0.5)' : (rankColors[p.rank] ? rCol+'40' : 'rgba(255,255,255,0.07)');
    var avBg   = avatarBgs[p.rank] || (isMe ? 'linear-gradient(135deg,#FF4444,#CC0000)' : 'linear-gradient(135deg,#2a2a3a,#3a3a4a)');

    html += '<div style="display:flex;align-items:center;gap:12px;background:' + bg + ';border:1px solid ' + border + ';border-radius:14px;padding:12px 14px;margin-bottom:8px;">' +
      '<div style="font-family:Orbitron,sans-serif;font-size:15px;font-weight:900;color:' + rCol + ';min-width:36px;text-align:center;">#' + p.rank + '</div>' +
      '<div data-uid="' + p.telegramId + '" style="width:42px;height:42px;border-radius:50%;background:' + avBg + ';display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:bold;color:white;flex-shrink:0;">' + (p.name||'?')[0].toUpperCase() + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:14px;font-weight:700;color:' + (isMe?'#FF6644':'white') + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (p.name||'User') + (isMe?' 👈':'') + '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:2px;">⚡ ' + speedStr + (speed > 0 ? ' REC/s' : '') + '</div>' +
      '</div>' +
      '<div style="text-align:right;flex-shrink:0;">' +
        '<div style="font-size:14px;color:#00FF88;font-weight:700;">' + (p.rec||0).toFixed(3) + '</div>' +
        '<div style="font-size:9px;color:rgba(255,255,255,0.3);">REC</div>' +
      '</div>' +
    '</div>';
  });

  // If user is outside top 100
  if(myRankData && myRankData.myRank > 100) {
    html += '<div style="text-align:center;color:rgba(255,255,255,0.2);font-size:12px;padding:6px 0;">• • •</div>';
    (myRankData.neighbors||[]).forEach(function(p) {
      var isMe = p.isMe;
      html += '<div style="display:flex;align-items:center;gap:12px;background:' + (isMe?'rgba(255,100,50,0.12)':'rgba(255,255,255,0.03)') + ';border:1px solid ' + (isMe?'rgba(255,100,50,0.5)':'rgba(255,255,255,0.07)') + ';border-radius:14px;padding:12px 14px;margin-bottom:8px;">' +
        '<div style="font-family:Orbitron,sans-serif;font-size:15px;font-weight:900;color:rgba(255,255,255,0.35);min-width:36px;text-align:center;">#' + p.rank + '</div>' +
        '<div style="width:42px;height:42px;border-radius:50%;background:' + (isMe?'linear-gradient(135deg,#FF4444,#CC0000)':'linear-gradient(135deg,#2a2a3a,#3a3a4a)') + ';display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:bold;color:white;flex-shrink:0;">' + (p.name||'?')[0].toUpperCase() + '</div>' +
        '<div style="flex:1;min-width:0;"><div style="font-size:14px;font-weight:700;color:' + (isMe?'#FF6644':'white') + ';">' + (p.name||'User') + (isMe?' 👈':'') + '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.3);">⚡ ' + (p.miningSpeed||0).toFixed(6) + ' REC/s</div></div>' +
        '<div style="text-align:right;"><div style="font-size:14px;color:#00FF88;font-weight:700;">' + (p.rec||0).toFixed(3) + '</div><div style="font-size:9px;color:rgba(255,255,255,0.3);">REC</div></div>' +
      '</div>';
    });
  }

  cont.innerHTML = html;

  // Load avatars async
  top100.slice(0,15).forEach(function(p) {
    getAvatar(p.telegramId, p.name, 42, function(avatarHtml) {
      document.querySelectorAll('[data-uid="' + p.telegramId + '"]').forEach(function(el) { el.outerHTML = avatarHtml; });
    });
  });
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
      '<div style="width:32px;height:32px;border-radius:50%;background:#222;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:bold;color:#aaa;flex-shrink:0;">' + (p.name||'?')[0].toUpperCase() + '</div>' +
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
      '<div style="width:80px;height:80px;border-radius:50%;background:#1a0000;border:3px solid #FF0000;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:#FF0000;margin:0 auto 10px;">' + (tgUser&&tgUser.first_name?tgUser.first_name[0].toUpperCase():'?') + '</div>' +
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
function calcOfflineEarnings() {
  try {
    // Get last save time from localStorage (most reliable)
    var lastTime = 0;
    try {
      var ls = JSON.parse(localStorage.getItem(saveKey));
      if(ls && ls.lastSaveTime) lastTime = ls.lastSaveTime;
    } catch(e){}

    if(!lastTime || lastTime <= 0) return;

    var now = Date.now();
    var elapsed = (now - lastTime) / 1000; // seconds

    // Only apply if offline for more than 30 seconds
    if(elapsed < 30) return;

    // Cap at 8 hours to prevent abuse
    var maxSeconds = 8 * 3600;
    var seconds = Math.min(elapsed, maxSeconds);

    // Calculate earnings based on current card speeds
    calcTotalSpeeds();
    var earnedRecord = Math.floor(recordPerSec * seconds);
    var earnedRec = recPerSec * seconds;

    // Energy recharge offline: +12 كل 3 ثواني
    var energyGained = Math.floor(seconds / 3) * 12;
    var newEnergy = Math.min(maxEnergy, energy + energyGained);
    energy = newEnergy;

    if(earnedRecord <= 0 && earnedRec < 0.000001) return;

    // Apply earnings
    record += earnedRecord;
    if(earnedRec > 0) rec += earnedRec;

    saveData(true);

    // Show notification popup
    var hours = Math.floor(seconds / 3600);
    var mins = Math.floor((seconds % 3600) / 60);
    var timeStr = hours > 0 ? hours+'h '+ mins+'m' : mins+'m';

    var ol = document.createElement('div');
    ol.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
    ol.addEventListener('click', function(e){ if(e.target===ol) ol.remove(); });

    var pp = document.createElement('div');
    pp.style.cssText = 'background:linear-gradient(180deg,#0d0d14,#111118);border:1px solid rgba(255,140,0,0.4);border-radius:20px;padding:22px;width:82vw;max-width:300px;text-align:center;';
    pp.addEventListener('click', function(e){ e.stopPropagation(); });

    pp.innerHTML =
      '<div style="font-size:36px;margin-bottom:8px;">⛏️</div>'+
      '<div style="font-family:Orbitron,sans-serif;font-size:14px;color:#FF8800;margin-bottom:4px;">Offline Earnings</div>'+
      '<div style="color:#666;font-size:12px;margin-bottom:14px;">You were away for <span style="color:#aaa;">'+timeStr+'</span></div>'+
      (earnedRecord > 0 ?
        '<div style="background:rgba(255,0,0,0.08);border:1px solid rgba(255,0,0,0.2);border-radius:10px;padding:10px;margin-bottom:8px;">'+
          '<div style="font-size:11px;color:#aaa;margin-bottom:3px;">⚡ RECORD Earned</div>'+
          '<div style="font-size:18px;color:#FF6644;font-family:Orbitron,sans-serif;font-weight:bold;">+'+formatCost(earnedRecord)+'</div>'+
        '</div>' : '')+
      (earnedRec > 0.000001 ?
        '<div style="background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:10px;padding:10px;margin-bottom:14px;">'+
          '<div style="font-size:11px;color:#aaa;margin-bottom:3px;">🟢 REC Earned</div>'+
          '<div style="font-size:18px;color:#00FF88;font-family:Orbitron,sans-serif;font-weight:bold;">+'+earnedRec.toFixed(6)+'</div>'+
        '</div>' : '<div style="margin-bottom:14px;"></div>')+
      '<button onclick="this.closest(\'div\').parentElement.remove()" style="background:linear-gradient(135deg,#FF6600,#FF8800);border:none;color:white;padding:10px 28px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:bold;width:100%;">Collect 🎉</button>';

    ol.appendChild(pp);
    document.body.appendChild(ol);
  } catch(e) {
    console.log('Offline earnings error:', e);
  }
}

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
    // Calculate offline earnings before updating UI
    calcOfflineEarnings();
    updateUI();
    setTimeout(initTonConnect, 800);
    setTimeout(function(){ initNewFeatures(); checkCardMissions(); }, 300);
  } catch(e) {
    console.log('Init error:', e);
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
