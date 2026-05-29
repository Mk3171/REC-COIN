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
  ar: {
    dir:'rtl',
    // Navigation
    navHome:'الرئيسية', navCards:'البطاقات', navTasks:'المهام',
    navInvite:'الدعوة', navRank:'الترتيب', navProfile:'الملف',
    navGames:'ألعاب', navWallet:'محفظة',
    // Side buttons
    sideDaily:'يومي', sideRank:'رتبة', sideGames:'ألعاب',
    sideCombo:'كومبو', sideUpgrade:'ترقية', sideShop:'متجر',
    // Quick grid
    qbTasks:'المهام', qbExchange:'تبادل', qbSwap:'تبديل',
    // Home
    tapMine:'اضغط للتعدين', energyLabel:'⚡ الطاقة',
    // Upgrades
    upgradesTitle:'الترقيات', tapUpgradeTitle:'⚡ ترقية الكبسات',
    energyUpgradeTitle:'🔋 ترقية الطاقة', levelLabel:'المستوى:',
    costLabel:'التكلفة:', tapsPerClick:'كبسات لكل ضغطة:',
    totalEnergy:'الطاقة الكلية:', upgradeBtn:'ترقية', backBtn:'← رجوع',
    energyRefillTitle:'⚡ شحن الطاقة', energyRefillDesc:'اشحن طاقتك فوراً',
    remainingToday:'المتبقي اليوم:', refillEnergyBtn:'⚡ شحن الطاقة',
    // Cards
    cardsTitle:'🃏 البطاقات', catAnime:'🎌 أنمي', catCars:'🚗 سيارات',
    catClubs:'🌙 ملاهي', catPalaces:'🏰 قصور', catLimited:'🔥 محدود',
    cardLevel:'المستوى', cardUpgradeBtn:'ترقية', cardMaxLevel:'✅ الحد الأقصى!',
    cardMiningBonus:'تعدين البطاقة', cardUpgradeCost:'تكلفة الترقية',
    cardWaitTime:'وقت الانتظار', upgrading:'⏳ جاري الترقية...',
    upgradeReady:'✅ جاهز', noMining:'⛔ لا تعدين — رقّ بطاقة أولاً',
    miningSpeedLabel:'تعدين REC:', recordSpeedLabel:'تعدين RECORD:',
    // Tasks
    tasksTitle:'✅ المهام', telegramTask:'📱 انضم لقروب تيليغرام',
    joinGroupBtn:'انضم للقروب ←', twitterTask:'🐦 تابع على تويتر',
    followTwitterBtn:'تابع على تويتر ←', getRecord:'احصل على 10,000 RECORD',
    taskDone:'✅ تم الإنجاز',
    // Daily reward
    dailyRewardTitle:'المكافأة اليومية', dailyDay:'اليوم {n} / 30',
    dailyClaimed:'تم الاستلام اليوم ✅', dailyComeBack:'عد غداً',
    dailyClaimBtn:'✅ استلم', dailyClaimNow:'احصل على المكافأة 🎁',
    // Mystery box
    mysteryTitle:'📦 صندوق المفاجآت',
    mysterySubtitle:'مجاناً يومياً — اكسب RECORD أو REC!',
    mysteryOpenBtn:'فتح 🎲',
    mysteryAlready:'تم الفتح اليوم — عد غداً!',
    mysteryYouGot:'حصلت على:',
    // Invite
    inviteTitle:'👥 الدعوة', inviteSubtitle:'ادعُ أصدقاءك واربح REC!',
    totalInvited:'إجمالي المدعوين', personJoined:'شخص انضم',
    milestonesTitle:'🎯 مراحل المكافآت', copyLink:'📋 نسخ الرابط',
    shareBtn:'📤 مشاركة', claimBtn:'احصل! 🎁', inviteN:'ادعُ {n} شخص',
    partnerProgram:'برنامج الشركاء',
    partnerDesc:'ادعُ أصدقاء واكسب عمولة REC من تعدينهم.',
    commissionRates:'معدلات العمولة', typeLabel:'النوع',
    miningLabel:'⛏️ تعدين', blockLabel:'🏆 بلوك',
    recEarned:'REC المكتسب', friendsLabel:'الأصدقاء',
    rewardMilestones:'🎯 مراحل المكافآت',
    // Rank
    rankTitle:'🏆 المتصدرون', tabGlobal:'🌍 عالمي',
    tabFriends:'👥 أصدقاء', tabMyLevel:'📊 مستواي',
    myRankLabel:'ترتيبك العالمي', weeklyChallenge:'🏆 التحدي الأسبوعي',
    weeklyPrize:'جائزة 1,000 REC', daysLeft:'يوم متبقي',
    loadingLeader:'⏳ جاري التحميل...', noFriends:'لم تدعُ أحداً بعد',
    totalMined:'إجمالي REC المعدن', sinceJoined:'منذ انضمامك',
    top100only:'أول 100 مشترك', rewardDist:'توزيع المكافآت',
    rankReward:'مكافأتك المتوقعة',
    // Shop
    shopTitle:'متجر النجوم',
    shopSubtitle:'ادعم المشروع واحصل على مكافآت فورية!',
    shopNote:'⭐ النجوم تشترى من تيليغرام مباشرة',
    shopEnergy:'⚡ شحن طاقة فوري', shopEnergyDesc:'يرجع طاقتك كاملة فوراً',
    shopRecord500:'💰 500,000 RECORD', shopRecord500Desc:'تضاف فوراً لرصيدك',
    shopRecord3m:'💰 3,000,000 RECORD', shopRecord3mDesc:'الأفضل قيمة ⭐',
    shopSkip:'🚀 تخطي وقت الانتظار', shopSkipDesc:'أكمل ترقية البطاقة فوراً',
    // Wallet
    connectWallet:'ربط المحفظة', walletTitle:'المحفظة', walletId:'المعرف',
    walletAssets:'الأصول', poolWallet:'Pool Wallet',
    withdrawable:'الرصيد المتاح للسحب', walletControls:'الإجراءات',
    withdrawPool:'سحب Pool', transferPool:'تحويل Pool للمحفظة',
    history:'السجل', yourWithdrawals:'عمليات السحب',
    walletOpen:'فتح ←', walletSoon:'🔒 قريباً',
    withdrawTitle:'سحب REC', withdrawSubtitle:'سحب REC الحقيقية لمحفظتك',
    withdrawBalance:'الرصيد المتاح', withdrawMin:'الحد الأدنى',
    withdrawFee:'الرسوم', withdrawDaily:'الحد اليومي المتبقي',
    withdrawAmount:'الكمية المراد سحبها', withdrawBtn:'🏛️ سحب REC الآن',
    withdrawReceive:'ستصلك:', withdrawAfterFee:'بعد خصم الرسوم',
    withdrawMin:'الحد الأدنى {n} REC',
    withdrawSuccess:'✅ تم إرسال {n} REC!', withdrawNoWallet:'❌ ربط محفظة TON أولاً!',
    withdrawLowBal:'❌ رصيدك غير كافٍ',
    withdrawDailyErr:'❌ وصلت الحد اليومي. تبقى: {n} REC',
    withdrawFailed:'❌ فشل السحب', withdrawLoading:'⏳ جاري الإرسال...',
    withdrawalBtn:'سحب',
    // Combo
    comboTitle:'🎯 كومبو يومي',
    comboSubtitle:'رقّ الثلاث بطاقات اليومية واحصل على مكافأة!',
    comboReward:'المكافأة اليومية', comboClaim:'احصل على +5 REC 🎉',
    comboClaimed:'✅ تم استلام المكافأة اليوم!',
    comboLocked:'لم يُحدد كومبو اليوم',
    comboAdmin:'اختر بطاقات الكومبو - ADMIN',
    comboSave:'💾 حفظ الكومبو اليومي',
    // Profile
    ppCardsUpgraded:'البطاقات المرقاة', ppRecSpeed:'سرعة REC',
    ppRecord:'RECORD', ppRecBalance:'رصيد REC',
    ppTotalTaps:'إجمالي الضغطات', ppTasksDone:'المهام المنجزة',
    ppFriends:'الأصدقاء', ppCardLevels:'مستويات البطاقات',
    ppNoCards:'لا توجد بطاقات مرقاة بعد',
    // Side menu
    menuSupport:'الدعم الفني', menuNews:'الأخبار',
    menuNewsDesc:'التحديثات والإعلانات', menuChat:'الدردشة',
    menuChatDesc:'دردشة المجتمع', menuPayouts:'المدفوعات',
    menuFaq:'الأسئلة الشائعة والشروط', menuFaqDesc:'القواعد والشروط',
    support:'💬 الدعم الفني @Momokhli', comingSoon:'قريباً', locked:'مقفول',
    // Toasts
    toastCopied:'✅ تم نسخ الرابط!', toastTask:'🎉 حصلت على 10,000 RECORD!',
    toastClaimed:'🎉 حصلت على {n} REC!', toastNotMet:'لم تكمل المتطلب بعد!',
    toastAlready:'أنجزت هذه المهمة مسبقاً!',
    toastUpgradeStart:'⏳ بدأت ترقية البطاقة!',
    toastUpgradeDone:'🎉 تمت الترقية!',
    toastNotEnoughRecord:'رصيد RECORD غير كافٍ!',
    toastAlreadyUpgrading:'البطاقة قيد الترقية!',
    toastInvoiceLoading:'⏳ جاري تحضير الفاتورة...',
    toastPaid:'✅ تم الدفع! جاري تحديث رصيدك...',
    toastCancelled:'تم إلغاء الدفع',
    toastFailed:'❌ فشل الدفع، حاول مرة أخرى',
    toastConnError:'❌ خطأ في الاتصال',
    // REC info
    recInfoTitle:'⚡ عملة REC',
    recInfoSub:'كيف تجمع REC وكيف تزيد سرعة تعدينك',
    recAutoMining:'التعدين التلقائي', recYourSpeed:'سرعتك الحالية:',
    recCardUpgrade:'ترقية البطاقات',
    recCardUpgradeDesc:'كل ترقية تزيد سرعة REC. البطاقات المحدودة ×3 سرعة.',
    recNormalCard:'بطاقة عادية ×1', recLimitedCard:'بطاقة محدودة ⭐ ×3',
    recBlocks:'البلوكات', recBlocksDesc:'كل ضغطة لديك فرصة لمكافأة REC كبيرة!',
    recDailyCombo:'الكومبو اليومي',
    recDailyComboDesc:'رقّ ٣ بطاقات سرية يومياً واحصل على +5 REC.',
    recReferrals:'الإحالات',
    recReferralsDesc:'ادعُ أصدقاءك واكسب عمولة من تعدينهم:',
    recTasks:'المهام', recTasksDesc:'أكمل المهام للحصول على REC إضافية.',
    recSpeedTip:'💡 نصيحة لزيادة السرعة',
    recTip1:'رقّ البطاقات المحدودة أولاً (×3 سرعة)',
    recTip2:'ارفع مستوى البطاقات العالية باستمرار',
    recTip3:'أكمل الكومبو اليومي كل يوم',
    recTip4:'ادعُ أصدقاء للحصول على عمولة مستمرة',
    recAutoMiningDesc:'بطاقات التعدين تعطيك REC تلقائياً كل ثانية.',
    // RECORD info
    recordInfoTitle:'🔴 عملة RECORD',
    recordInfoSub:'كيف تجمع RECORD وما هو دورها',
    recordWhat:'ما هي عملة RECORD؟', recordWhatSub:'عملة التعدين الأساسية',
    recordWhatDesc:'RECORD هي العملة الرئيسية. تُستخدم لترقية البطاقات. رصيدك:',
    recordTapping:'الضغط على الدائرة', recordTappingSub:'الطريقة الأسرع',
    recordTappingDesc:'كل ضغطة على الدائرة تعطيك RECORD. زد Tap Power للحصول على أكثر.',
    recordTapPower:'ترقية Tap Power', recordMorePerTap:'↑ RECORD/ضغطة',
    recordEnergyUp:'ترقية Energy', recordMoreTaps:'↑ ضغطات أكثر',
    recordAutoMining:'التعدين التلقائي', recordAutoSub:'مستمر 24/7',
    recordAutoDesc:'البطاقات تعدّن RECORD تلقائياً حتى وأنت غير متصل.',
    recordYourSpeed:'سرعتك:', recordMystery:'Mystery Box',
    recordMysterySub:'مجاناً كل يوم',
    recordMysteryDesc:'افتح صندوق المفاجآت اليومي مجاناً من قسم Tasks.',
    recordEnergyRefill:'إعادة شحن الطاقة',
    recordEnergyRefillSub:'مرتان يومياً مجاناً',
    recordEnergyRefillDesc:'إعادة شحن طاقتك مرتين يومياً مجاناً.',
    recordHowSpend:'💡 كيف تستخدم RECORD؟',
    recordSpend1:'🃏 ترقية بطاقات التعدين لزيادة سرعة REC',
    recordSpend2:'⬆️ رفع مستوى Tap Power للحصول على أكثر',
    recordSpend3:'⚡ توسيع سعة الطاقة لضغطات أكثر',
    recordSpend4:'⭐ شراء بطاقات محدودة من المتجر',
    yourLevel:'مستواك الحالي', yourBalance:'رصيدك:'
  },

  en: {
    dir:'ltr',
    navHome:'Home', navCards:'Cards', navTasks:'Tasks',
    navInvite:'Invite', navRank:'Rank', navProfile:'Profile',
    navGames:'Games', navWallet:'Wallet',
    sideDaily:'Daily', sideRank:'Rank', sideGames:'Games',
    sideCombo:'Combo', sideUpgrade:'Upgrade', sideShop:'Shop',
    qbTasks:'Tasks', qbExchange:'Exchange', qbSwap:'Swap',
    tapMine:'Tap to Mine', energyLabel:'⚡ Energy',
    upgradesTitle:'Upgrades', tapUpgradeTitle:'⚡ Tap Upgrade',
    energyUpgradeTitle:'🔋 Energy Upgrade', levelLabel:'Level:',
    costLabel:'Cost:', tapsPerClick:'Taps per click:',
    totalEnergy:'Total Energy:', upgradeBtn:'Upgrade', backBtn:'← Back',
    energyRefillTitle:'Energy Refill ⚡', energyRefillDesc:'Instantly refill your energy',
    remainingToday:'Remaining today:', refillEnergyBtn:'Refill Energy ⚡',
    cardsTitle:'🃏 Cards', catAnime:'🎌 Anime', catCars:'🚗 Cars',
    catClubs:'🌙 Clubs', catPalaces:'🏰 Palaces', catLimited:'🔥 Limited',
    cardLevel:'Level', cardUpgradeBtn:'Upgrade', cardMaxLevel:'✅ Max level!',
    cardMiningBonus:'Card Mining', cardUpgradeCost:'Upgrade Cost',
    cardWaitTime:'Wait Time', upgrading:'⏳ Upgrading...',
    upgradeReady:'✅ Ready', noMining:'⛔ No mining — upgrade a card first',
    miningSpeedLabel:'REC Mining:', recordSpeedLabel:'RECORD Mining:',
    tasksTitle:'✅ Tasks', telegramTask:'📱 Join Telegram Group',
    joinGroupBtn:'Join Group →', twitterTask:'🐦 Follow on Twitter',
    followTwitterBtn:'Follow Twitter →', getRecord:'Get 10,000 RECORD',
    taskDone:'✅ Completed',
    dailyRewardTitle:'Daily Reward', dailyDay:'Day {n} / 30',
    dailyClaimed:'Already claimed today ✅', dailyComeBack:'Come back tomorrow',
    dailyClaimBtn:'✅ Claimed', dailyClaimNow:'Claim Reward 🎁',
    mysteryTitle:'📦 Mystery Box',
    mysterySubtitle:'Free daily — win RECORD or REC!',
    mysteryOpenBtn:'Open 🎲',
    mysteryAlready:'Already opened today — come back tomorrow!',
    mysteryYouGot:'You got:',
    inviteTitle:'👥 Invite', inviteSubtitle:'Invite friends and earn REC!',
    totalInvited:'Total Invited', personJoined:'people joined',
    milestonesTitle:'🎯 Reward Milestones', copyLink:'📋 Copy Link',
    shareBtn:'📤 Share', claimBtn:'Claim! 🎁', inviteN:'Invite {n} people',
    partnerProgram:'PARTNER PROGRAM',
    partnerDesc:'Invite friends & earn REC from their mining and blocks.',
    commissionRates:'COMMISSION RATES', typeLabel:'TYPE',
    miningLabel:'⛏️ Mining', blockLabel:'🏆 Block',
    recEarned:'REC EARNED', friendsLabel:'FRIENDS',
    rewardMilestones:'🎯 REWARD MILESTONES',
    rankTitle:'🏆 LEADERBOARD', tabGlobal:'🌍 Global',
    tabFriends:'👥 Friends', tabMyLevel:'📊 My Level',
    myRankLabel:'Your Global Rank', weeklyChallenge:'🏆 Weekly Challenge',
    weeklyPrize:'Prize: 1,000 REC', daysLeft:'days left',
    loadingLeader:'⏳ Loading...', noFriends:'You have not invited anyone yet',
    totalMined:'Total REC Mined', sinceJoined:'since you joined',
    top100only:'Top 100 players only', rewardDist:'Reward Distribution',
    rankReward:'Your expected reward',
    shopTitle:'Stars Shop',
    shopSubtitle:'Support the project and get instant rewards!',
    shopNote:'⭐ Stars are purchased directly from Telegram',
    shopEnergy:'⚡ Instant Energy Refill', shopEnergyDesc:'Refills your energy completely',
    shopRecord500:'💰 500,000 RECORD', shopRecord500Desc:'Added instantly',
    shopRecord3m:'💰 3,000,000 RECORD', shopRecord3mDesc:'Best value ⭐',
    shopSkip:'🚀 Skip Wait Timer', shopSkipDesc:'Complete card upgrade instantly',
    connectWallet:'Connect Wallet', walletTitle:'Wallet', walletId:'ID',
    walletAssets:'Assets', poolWallet:'Pool Wallet',
    withdrawable:'Withdrawable balance', walletControls:'CONTROLS',
    withdrawPool:'Withdraw Pool', transferPool:'Transfer Pool to Wallet',
    history:'History', yourWithdrawals:'Your withdrawals',
    walletOpen:'Open →', walletSoon:'🔒 SOON',
    withdrawTitle:'Withdraw REC', withdrawSubtitle:'Withdraw real REC to your wallet',
    withdrawBalance:'Available Balance', withdrawMin:'Minimum',
    withdrawFee:'Fee', withdrawDaily:'Daily Remaining',
    withdrawAmount:'Amount to withdraw', withdrawBtn:'🏛️ Withdraw REC Now',
    withdrawReceive:'You will receive:', withdrawAfterFee:'after fee',
    withdrawSuccess:'✅ Sent {n} REC!', withdrawNoWallet:'❌ Connect TON wallet first!',
    withdrawLowBal:'❌ Insufficient balance',
    withdrawDailyErr:'❌ Daily limit reached. Remaining: {n} REC',
    withdrawFailed:'❌ Withdrawal failed', withdrawLoading:'⏳ Sending...',
    withdrawalBtn:'Withdrawal',
    comboTitle:'🎯 Daily Combo',
    comboSubtitle:'Upgrade the 3 daily cards and get a reward!',
    comboReward:'Daily Reward', comboClaim:'Claim +5 REC 🎉',
    comboClaimed:'✅ Reward claimed today!',
    comboLocked:'No combo set today',
    comboAdmin:'Choose Combo Cards - ADMIN',
    comboSave:'💾 Save Daily Combo',
    ppCardsUpgraded:'CARDS UPGRADED', ppRecSpeed:'REC SPEED',
    ppRecord:'RECORD', ppRecBalance:'REC BALANCE',
    ppTotalTaps:'TOTAL TAPS', ppTasksDone:'TASKS DONE',
    ppFriends:'FRIENDS', ppCardLevels:'CARD LEVELS',
    ppNoCards:'No cards upgraded yet',
    menuSupport:'Support', menuNews:'News',
    menuNewsDesc:'Updates & Announcements', menuChat:'Chat',
    menuChatDesc:'Community Chat', menuPayouts:'Payouts',
    menuFaq:'FAQ & Terms', menuFaqDesc:'Rules & Conditions',
    support:'💬 Support @Momokhli', comingSoon:'Coming Soon', locked:'Locked',
    toastCopied:'✅ Link Copied!', toastTask:'🎉 Got 10,000 RECORD!',
    toastClaimed:'🎉 Got {n} REC!', toastNotMet:'Requirement not met!',
    toastAlready:'Task already completed!',
    toastUpgradeStart:'⏳ Card upgrade started!',
    toastUpgradeDone:'🎉 Upgrade complete!',
    toastNotEnoughRecord:'Not enough RECORD!',
    toastAlreadyUpgrading:'Card already upgrading!',
    toastInvoiceLoading:'⏳ Preparing invoice...',
    toastPaid:'✅ Payment successful! Updating balance...',
    toastCancelled:'Payment cancelled',
    toastFailed:'❌ Payment failed, try again',
    toastConnError:'❌ Connection error',
    recInfoTitle:'⚡ REC Token',
    recInfoSub:'How to earn REC and increase mining speed',
    recAutoMining:'Auto Mining', recYourSpeed:'Your current speed:',
    recCardUpgrade:'Card Upgrades',
    recCardUpgradeDesc:'Each upgrade increases REC speed. Limited cards give ×3.',
    recNormalCard:'Normal Card ×1', recLimitedCard:'Limited Card ⭐ ×3',
    recBlocks:'Blocks', recBlocksDesc:'Every tap has a chance for a big REC block reward!',
    recDailyCombo:'Daily Combo',
    recDailyComboDesc:'Upgrade 3 secret daily cards and get +5 REC.',
    recReferrals:'Referrals',
    recReferralsDesc:'Invite friends and earn commission from their mining:',
    recTasks:'Tasks', recTasksDesc:'Complete tasks for extra REC.',
    recSpeedTip:'💡 Speed Increase Tips',
    recTip1:'Upgrade limited cards first (×3 speed)',
    recTip2:'Keep upgrading high-level cards',
    recTip3:'Complete daily combo every day',
    recTip4:'Invite friends for continuous commission',
    recAutoMiningDesc:'Mining cards give you REC automatically every second.',
    recordInfoTitle:'🔴 RECORD Token',
    recordInfoSub:'How to earn RECORD and its role',
    recordWhat:'What is RECORD?', recordWhatSub:'The main mining currency',
    recordWhatDesc:'RECORD is the main in-game currency for upgrading cards. Your balance:',
    recordTapping:'Tapping the Circle', recordTappingSub:'The fastest method',
    recordTappingDesc:'Each tap gives RECORD. More Tap Power = more per tap.',
    recordTapPower:'Upgrade Tap Power', recordMorePerTap:'↑ RECORD/tap',
    recordEnergyUp:'Upgrade Energy', recordMoreTaps:'↑ More taps',
    recordAutoMining:'Auto Mining', recordAutoSub:'Continuous 24/7',
    recordAutoDesc:'Cards mine RECORD automatically even when offline.',
    recordYourSpeed:'Your speed:', recordMystery:'Mystery Box',
    recordMysterySub:'Free every day',
    recordMysteryDesc:'Open the free daily mystery box from Tasks.',
    recordEnergyRefill:'Energy Refill',
    recordEnergyRefillSub:'Twice a day for free',
    recordEnergyRefillDesc:'When energy runs out, refill it twice daily for free.',
    recordHowSpend:'💡 How to use RECORD?',
    recordSpend1:'🃏 Upgrade mining cards to increase REC speed',
    recordSpend2:'⬆️ Upgrade Tap Power for more per tap',
    recordSpend3:'⚡ Expand energy capacity for more taps',
    recordSpend4:'⭐ Buy limited cards from the shop',
    yourLevel:'Your Current Level', yourBalance:'Your Balance:'
  },

  ru: {
    dir:'ltr',
    navHome:'Главная', navCards:'Карты', navTasks:'Задания',
    navInvite:'Пригласить', navRank:'Рейтинг', navProfile:'Профиль',
    navGames:'Игры', navWallet:'Кошелёк',
    sideDaily:'Ежедневно', sideRank:'Рейтинг', sideGames:'Игры',
    sideCombo:'Комбо', sideUpgrade:'Улучшить', sideShop:'Магазин',
    qbTasks:'Задания', qbExchange:'Обмен', qbSwap:'Своп',
    tapMine:'Нажмите для майнинга', energyLabel:'⚡ Энергия',
    upgradesTitle:'Улучшения', tapUpgradeTitle:'⚡ Улучшение кликов',
    energyUpgradeTitle:'🔋 Улучшение энергии', levelLabel:'Уровень:',
    costLabel:'Стоимость:', tapsPerClick:'Кликов за нажатие:',
    totalEnergy:'Общая энергия:', upgradeBtn:'Улучшить', backBtn:'← Назад',
    energyRefillTitle:'Зарядка энергии ⚡', energyRefillDesc:'Мгновенно восстановить энергию',
    remainingToday:'Осталось сегодня:', refillEnergyBtn:'Зарядить энергию ⚡',
    cardsTitle:'🃏 Карточки', catAnime:'🎌 Аниме', catCars:'🚗 Машины',
    catClubs:'🌙 Клубы', catPalaces:'🏰 Дворцы', catLimited:'🔥 Лимит',
    cardLevel:'Уровень', cardUpgradeBtn:'Улучшить', cardMaxLevel:'✅ Максимальный уровень!',
    cardMiningBonus:'Майнинг карты', cardUpgradeCost:'Стоимость улучшения',
    cardWaitTime:'Время ожидания', upgrading:'⏳ Улучшение...',
    upgradeReady:'✅ Готово', noMining:'⛔ Нет майнинга — улучшите карту!',
    miningSpeedLabel:'Майнинг REC:', recordSpeedLabel:'Майнинг RECORD:',
    tasksTitle:'✅ Задания', telegramTask:'📱 Присоединиться к Telegram',
    joinGroupBtn:'Вступить →', twitterTask:'🐦 Подписаться в Twitter',
    followTwitterBtn:'Подписаться →', getRecord:'Получить 10,000 RECORD',
    taskDone:'✅ Выполнено',
    dailyRewardTitle:'Ежедневная награда', dailyDay:'День {n} / 30',
    dailyClaimed:'Уже получено сегодня ✅', dailyComeBack:'Возвращайтесь завтра',
    dailyClaimBtn:'✅ Получено', dailyClaimNow:'Получить награду 🎁',
    mysteryTitle:'📦 Таинственная коробка',
    mysterySubtitle:'Бесплатно ежедневно — выиграйте RECORD или REC!',
    mysteryOpenBtn:'Открыть 🎲',
    mysteryAlready:'Уже открыто сегодня — вернитесь завтра!',
    mysteryYouGot:'Вы получили:',
    inviteTitle:'👥 Приглашение', inviteSubtitle:'Приглашайте друзей и зарабатывайте REC!',
    totalInvited:'Всего приглашено', personJoined:'человек присоединились',
    milestonesTitle:'🎯 Этапы наград', copyLink:'📋 Копировать ссылку',
    shareBtn:'📤 Поделиться', claimBtn:'Получить! 🎁', inviteN:'Пригласить {n} человек',
    partnerProgram:'ПАРТНЁРСКАЯ ПРОГРАММА',
    partnerDesc:'Приглашай друзей и зарабатывай REC от их майнинга.',
    commissionRates:'СТАВКИ КОМИССИИ', typeLabel:'ТИП',
    miningLabel:'⛏️ Майнинг', blockLabel:'🏆 Блок',
    recEarned:'ЗАРАБОТАНО REC', friendsLabel:'ДРУЗЬЯ',
    rewardMilestones:'🎯 ЭТАПЫ НАГРАД',
    rankTitle:'🏆 ЛИДЕРБОРД', tabGlobal:'🌍 Глобально',
    tabFriends:'👥 Друзья', tabMyLevel:'📊 Мой уровень',
    myRankLabel:'Ваш глобальный ранг', weeklyChallenge:'🏆 Недельный вызов',
    weeklyPrize:'Приз: 1,000 REC', daysLeft:'дней осталось',
    loadingLeader:'⏳ Загрузка...', noFriends:'Вы ещё никого не пригласили',
    totalMined:'Всего добыто REC', sinceJoined:'с момента входа',
    top100only:'Только топ 100', rewardDist:'Распределение наград',
    rankReward:'Ожидаемая награда',
    shopTitle:'Магазин звёзд',
    shopSubtitle:'Поддержите проект и получите награды!',
    shopNote:'⭐ Звёзды покупаются в Telegram',
    shopEnergy:'⚡ Мгновенная зарядка', shopEnergyDesc:'Полностью восстанавливает энергию',
    shopRecord500:'💰 500,000 RECORD', shopRecord500Desc:'Добавляется мгновенно',
    shopRecord3m:'💰 3,000,000 RECORD', shopRecord3mDesc:'Лучшая ценность ⭐',
    shopSkip:'🚀 Пропустить ожидание', shopSkipDesc:'Завершить улучшение мгновенно',
    connectWallet:'Подключить кошелёк', walletTitle:'Кошелёк', walletId:'ID',
    walletAssets:'Активы', poolWallet:'Pool кошелёк',
    withdrawable:'Доступный баланс', walletControls:'УПРАВЛЕНИЕ',
    withdrawPool:'Вывести Pool', transferPool:'Перевести в кошелёк',
    history:'История', yourWithdrawals:'Ваши выводы',
    walletOpen:'Открыть →', walletSoon:'🔒 СКОРО',
    withdrawTitle:'Вывести REC', withdrawSubtitle:'Вывод REC на кошелёк',
    withdrawBalance:'Доступный баланс', withdrawMin:'Минимум',
    withdrawFee:'Комиссия', withdrawDaily:'Остаток лимита',
    withdrawAmount:'Сумма вывода', withdrawBtn:'🏛️ Вывести REC',
    withdrawReceive:'Вы получите:', withdrawAfterFee:'после комиссии',
    withdrawSuccess:'✅ Отправлено {n} REC!', withdrawNoWallet:'❌ Подключите кошелёк!',
    withdrawLowBal:'❌ Недостаточно средств',
    withdrawDailyErr:'❌ Лимит. Остаток: {n} REC',
    withdrawFailed:'❌ Ошибка вывода', withdrawLoading:'⏳ Отправка...',
    withdrawalBtn:'Вывод',
    comboTitle:'🎯 Ежедневное Комбо',
    comboSubtitle:'Улучши 3 ежедневные карты и получи награду!',
    comboReward:'Ежедневная награда', comboClaim:'Получить +5 REC 🎉',
    comboClaimed:'✅ Награда получена сегодня!',
    comboLocked:'Комбо не установлено',
    comboAdmin:'Выбрать карты Комбо - ADMIN',
    comboSave:'💾 Сохранить Комбо',
    ppCardsUpgraded:'УЛУЧШЕННЫХ КАРТ', ppRecSpeed:'СКОРОСТЬ REC',
    ppRecord:'RECORD', ppRecBalance:'БАЛАНС REC',
    ppTotalTaps:'ВСЕГО НАЖАТИЙ', ppTasksDone:'ЗАДАНИЙ ВЫПОЛНЕНО',
    ppFriends:'ДРУЗЬЯ', ppCardLevels:'УРОВНИ КАРТ',
    ppNoCards:'Карточки ещё не улучшены',
    menuSupport:'Поддержка', menuNews:'Новости',
    menuNewsDesc:'Обновления и объявления', menuChat:'Чат',
    menuChatDesc:'Чат сообщества', menuPayouts:'Выплаты',
    menuFaq:'FAQ и Условия', menuFaqDesc:'Правила и условия',
    support:'💬 Поддержка @Momokhli', comingSoon:'Скоро', locked:'Заблокировано',
    toastCopied:'✅ Ссылка скопирована!', toastTask:'🎉 Получено 10,000 RECORD!',
    toastClaimed:'🎉 Получено {n} REC!', toastNotMet:'Требование не выполнено!',
    toastAlready:'Задание уже выполнено!',
    toastUpgradeStart:'⏳ Улучшение карты начато!',
    toastUpgradeDone:'🎉 Улучшение завершено!',
    toastNotEnoughRecord:'Недостаточно RECORD!',
    toastAlreadyUpgrading:'Карта уже улучшается!',
    toastInvoiceLoading:'⏳ Подготовка счёта...',
    toastPaid:'✅ Оплата успешна!',
    toastCancelled:'Оплата отменена', toastFailed:'❌ Ошибка оплаты',
    toastConnError:'❌ Ошибка соединения',
    recInfoTitle:'⚡ Токен REC', recInfoSub:'Как зарабатывать REC и увеличивать скорость майнинга',
    recAutoMining:'Автоматический майнинг', recYourSpeed:'Ваша текущая скорость:',
    recCardUpgrade:'Улучшение карточек',
    recCardUpgradeDesc:'Каждое улучшение увеличивает скорость REC. Лимитные карты ×3.',
    recNormalCard:'Обычная карта ×1', recLimitedCard:'Лимитная карта ⭐ ×3',
    recBlocks:'Блоки', recBlocksDesc:'Каждое нажатие даёт шанс на большую награду REC!',
    recDailyCombo:'Ежедневное комбо',
    recDailyComboDesc:'Улучшите 3 секретные карточки дня и получите +5 REC.',
    recReferrals:'Рефералы', recReferralsDesc:'Приглашайте друзей и зарабатывайте комиссию:',
    recTasks:'Задания', recTasksDesc:'Выполняйте задания для получения REC.',
    recSpeedTip:'💡 Советы по увеличению скорости',
    recTip1:'Сначала улучшайте лимитные карты (×3 скорость)',
    recTip2:'Продолжайте улучшать карточки высокого уровня',
    recTip3:'Выполняйте ежедневное комбо каждый день',
    recTip4:'Приглашайте друзей для непрерывной комиссии',
    recAutoMiningDesc:'Карточки майнинга автоматически дают REC каждую секунду.',
    recordInfoTitle:'🔴 Токен RECORD', recordInfoSub:'Как зарабатывать RECORD и её роль',
    recordWhat:'Что такое RECORD?', recordWhatSub:'Основная валюта майнинга',
    recordWhatDesc:'RECORD — основная игровая валюта для улучшения карточек. Ваш баланс:',
    recordTapping:'Нажатие на круг', recordTappingSub:'Самый быстрый метод',
    recordTappingDesc:'Каждое нажатие даёт RECORD. Улучшите Tap Power для большего.',
    recordTapPower:'Улучшить Tap Power', recordMorePerTap:'↑ RECORD/нажатие',
    recordEnergyUp:'Улучшить Energy', recordMoreTaps:'↑ Больше нажатий',
    recordAutoMining:'Автоматический майнинг', recordAutoSub:'Непрерывно 24/7',
    recordAutoDesc:'Карточки автоматически добывают RECORD даже оффлайн.',
    recordYourSpeed:'Ваша скорость:', recordMystery:'Таинственная коробка',
    recordMysterySub:'Бесплатно каждый день',
    recordMysteryDesc:'Откройте бесплатную ежедневную коробку из раздела Tasks.',
    recordEnergyRefill:'Зарядка энергии', recordEnergyRefillSub:'Дважды в день бесплатно',
    recordEnergyRefillDesc:'Когда энергия заканчивается, восстановите её дважды в день.',
    recordHowSpend:'💡 Как использовать RECORD?',
    recordSpend1:'🃏 Улучшение карточек майнинга для увеличения REC',
    recordSpend2:'⬆️ Улучшение Tap Power', recordSpend3:'⚡ Расширение ёмкости энергии',
    recordSpend4:'⭐ Покупка лимитных карточек в магазине',
    yourLevel:'Ваш текущий уровень', yourBalance:'Ваш баланс:'
  },

  uk: {
    dir:'ltr',
    navHome:'Головна', navCards:'Картки', navTasks:'Завдання',
    navInvite:'Запросити', navRank:'Рейтинг', navProfile:'Профіль',
    navGames:'Ігри', navWallet:'Гаманець',
    sideDaily:'Щодня', sideRank:'Рейтинг', sideGames:'Ігри',
    sideCombo:'Комбо', sideUpgrade:'Покращити', sideShop:'Магазин',
    qbTasks:'Завдання', qbExchange:'Обмін', qbSwap:'Своп',
    tapMine:'Натисніть для майнінгу', energyLabel:'⚡ Енергія',
    upgradesTitle:'Покращення', tapUpgradeTitle:'⚡ Покращення натискань',
    energyUpgradeTitle:'🔋 Покращення енергії', levelLabel:'Рівень:',
    costLabel:'Вартість:', tapsPerClick:'Натискань за клік:',
    totalEnergy:'Загальна енергія:', upgradeBtn:'Покращити', backBtn:'← Назад',
    energyRefillTitle:'Зарядка енергії ⚡', energyRefillDesc:'Миттєво відновити енергію',
    remainingToday:'Залишилось сьогодні:', refillEnergyBtn:'Зарядити енергію ⚡',
    cardsTitle:'🃏 Картки', catAnime:'🎌 Аніме', catCars:'🚗 Машини',
    catClubs:'🌙 Клуби', catPalaces:'🏰 Палаци', catLimited:'🔥 Обмежені',
    cardLevel:'Рівень', cardUpgradeBtn:'Покращити', cardMaxLevel:'✅ Максимальний рівень!',
    cardMiningBonus:'Майнінг картки', cardUpgradeCost:'Вартість покращення',
    cardWaitTime:'Час очікування', upgrading:'⏳ Покращення...',
    upgradeReady:'✅ Готово', noMining:'⛔ Немає майнінгу — покращіть картку!',
    miningSpeedLabel:'Майнінг REC:', recordSpeedLabel:'Майнінг RECORD:',
    tasksTitle:'✅ Завдання', telegramTask:'📱 Приєднатися до Telegram',
    joinGroupBtn:'Приєднатися →', twitterTask:'🐦 Підписатися в Twitter',
    followTwitterBtn:'Підписатися →', getRecord:'Отримати 10,000 RECORD',
    taskDone:'✅ Виконано',
    dailyRewardTitle:'Щоденна нагорода', dailyDay:'День {n} / 30',
    dailyClaimed:'Вже отримано сьогодні ✅', dailyComeBack:'Повертайтесь завтра',
    dailyClaimBtn:'✅ Отримано', dailyClaimNow:'Отримати нагороду 🎁',
    mysteryTitle:'📦 Таємнича скринька',
    mysterySubtitle:'Безкоштовно щодня — виграйте RECORD або REC!',
    mysteryOpenBtn:'Відкрити 🎲',
    mysteryAlready:'Вже відкрито сьогодні — повертайтесь завтра!',
    mysteryYouGot:'Ви отримали:',
    inviteTitle:'👥 Запросити', inviteSubtitle:'Запрошуйте друзів і заробляйте REC!',
    totalInvited:'Всього запрошено', personJoined:'людей приєдналися',
    milestonesTitle:'🎯 Етапи винагород', copyLink:'📋 Копіювати посилання',
    shareBtn:'📤 Поділитися', claimBtn:'Отримати! 🎁', inviteN:'Запросіть {n} людей',
    partnerProgram:'ПАРТНЕРСЬКА ПРОГРАМА',
    partnerDesc:'Запрошуй друзів та заробляй REC від їх майнінгу.',
    commissionRates:'СТАВКИ КОМІСІЇ', typeLabel:'ТИП',
    miningLabel:'⛏️ Майнінг', blockLabel:'🏆 Блок',
    recEarned:'ЗАРОБЛЕНО REC', friendsLabel:'ДРУЗІ',
    rewardMilestones:'🎯 ЕТАПИ НАГОРОД',
    rankTitle:'🏆 ЛІДЕРБОРД', tabGlobal:'🌍 Глобально',
    tabFriends:'👥 Друзі', tabMyLevel:'📊 Мій рівень',
    myRankLabel:'Ваш глобальний ранг', weeklyChallenge:'🏆 Тижневий виклик',
    weeklyPrize:'Приз: 1,000 REC', daysLeft:'днів залишилось',
    loadingLeader:'⏳ Завантаження...', noFriends:'Ви ще нікого не запросили',
    totalMined:'Всього REC здобуто', sinceJoined:'з моменту приєднання',
    top100only:'Тільки топ 100', rewardDist:'Розподіл нагород',
    rankReward:'Очікувана нагорода',
    shopTitle:'Магазин зірок', shopSubtitle:'Підтримайте проект і отримайте нагороди!',
    shopNote:'⭐ Зірки купуються в Telegram',
    shopEnergy:'⚡ Миттєва зарядка', shopEnergyDesc:'Повністю відновлює енергію',
    shopRecord500:'💰 500,000 RECORD', shopRecord500Desc:'Додається миттєво',
    shopRecord3m:'💰 3,000,000 RECORD', shopRecord3mDesc:'Найкраща цінність ⭐',
    shopSkip:'🚀 Пропустити очікування', shopSkipDesc:'Завершити покращення миттєво',
    connectWallet:'Підключити гаманець', walletTitle:'Гаманець', walletId:'ID',
    walletAssets:'Активи', poolWallet:'Pool гаманець',
    withdrawable:'Доступний баланс', walletControls:'УПРАВЛІННЯ',
    withdrawPool:'Вивести Pool', transferPool:'Перевести в гаманець',
    history:'Історія', yourWithdrawals:'Ваші виведення',
    walletOpen:'Відкрити →', walletSoon:'🔒 СКОРО',
    withdrawTitle:'Вивести REC', withdrawSubtitle:'Виведення REC на гаманець',
    withdrawBalance:'Доступний баланс', withdrawMin:'Мінімум',
    withdrawFee:'Комісія', withdrawDaily:'Залишок ліміту',
    withdrawAmount:'Сума виведення', withdrawBtn:'🏛️ Вивести REC',
    withdrawReceive:'Ви отримаєте:', withdrawAfterFee:'після комісії',
    withdrawSuccess:'✅ Відправлено {n} REC!', withdrawNoWallet:'❌ Підключіть гаманець!',
    withdrawLowBal:'❌ Недостатньо коштів',
    withdrawDailyErr:'❌ Ліміт. Залишок: {n} REC',
    withdrawFailed:'❌ Помилка виведення', withdrawLoading:'⏳ Відправка...',
    withdrawalBtn:'Виведення',
    comboTitle:'🎯 Щоденне Комбо',
    comboSubtitle:'Покращи 3 щоденні карти та отримай нагороду!',
    comboReward:'Щоденна нагорода', comboClaim:'Отримати +5 REC 🎉',
    comboClaimed:'✅ Нагороду отримано сьогодні!',
    comboLocked:'Комбо не встановлено',
    comboAdmin:'Вибрати карти Комбо - ADMIN',
    comboSave:'💾 Зберегти Комбо',
    ppCardsUpgraded:'ПОКРАЩЕНИХ КАРТ', ppRecSpeed:'ШВИДКІСТЬ REC',
    ppRecord:'RECORD', ppRecBalance:'БАЛАНС REC',
    ppTotalTaps:'ВСЬОГО НАТИСКАНЬ', ppTasksDone:'ЗАВДАНЬ ВИКОНАНО',
    ppFriends:'ДРУЗІ', ppCardLevels:'РІВНІ КАРТ',
    ppNoCards:'Картки ще не покращені',
    menuSupport:'Підтримка', menuNews:'Новини',
    menuNewsDesc:'Оновлення та оголошення', menuChat:'Чат',
    menuChatDesc:'Чат спільноти', menuPayouts:'Виплати',
    menuFaq:'FAQ та Умови', menuFaqDesc:'Правила та умови',
    support:'💬 Підтримка @Momokhli', comingSoon:'Незабаром', locked:'Заблоковано',
    toastCopied:'✅ Посилання скопійовано!', toastTask:'🎉 Отримано 10,000 RECORD!',
    toastClaimed:'🎉 Отримано {n} REC!', toastNotMet:'Вимога не виконана!',
    toastAlready:'Завдання вже виконано!',
    toastUpgradeStart:'⏳ Покращення розпочато!',
    toastUpgradeDone:'🎉 Покращення завершено!',
    toastNotEnoughRecord:'Недостатньо RECORD!',
    toastAlreadyUpgrading:'Картка вже покращується!',
    toastInvoiceLoading:'⏳ Підготовка рахунку...',
    toastPaid:'✅ Оплата успішна!',
    toastCancelled:'Оплату скасовано', toastFailed:'❌ Помилка оплати',
    toastConnError:'❌ Помилка зʼєднання',
    recInfoTitle:'⚡ Токен REC', recInfoSub:'Як заробляти REC та збільшувати швидкість',
    recAutoMining:'Автоматичний майнінг', recYourSpeed:'Ваша поточна швидкість:',
    recCardUpgrade:'Покращення карточок',
    recCardUpgradeDesc:'Кожне покращення збільшує швидкість REC. Лімітні картки ×3.',
    recNormalCard:'Звичайна картка ×1', recLimitedCard:'Лімітна картка ⭐ ×3',
    recBlocks:'Блоки', recBlocksDesc:'Кожне натискання дає шанс на велику нагороду REC!',
    recDailyCombo:'Щоденне комбо',
    recDailyComboDesc:'Покращте 3 секретні картки дня та отримайте +5 REC.',
    recReferrals:'Реферали', recReferralsDesc:'Запрошуйте друзів та заробляйте комісію:',
    recTasks:'Завдання', recTasksDesc:'Виконуйте завдання для отримання REC.',
    recSpeedTip:'💡 Поради щодо збільшення швидкості',
    recTip1:'Спочатку покращуйте лімітні картки (×3 швидкість)',
    recTip2:'Продовжуйте покращувати картки високого рівня',
    recTip3:'Щодня виконуйте щоденне комбо',
    recTip4:'Запрошуйте друзів для постійної комісії',
    recAutoMiningDesc:'Картки майнінгу автоматично дають REC кожну секунду.',
    recordInfoTitle:'🔴 Токен RECORD', recordInfoSub:'Як заробляти RECORD та її роль',
    recordWhat:'Що таке RECORD?', recordWhatSub:'Основна валюта майнінгу',
    recordWhatDesc:'RECORD — основна ігрова валюта для покращення карточок. Ваш баланс:',
    recordTapping:'Натискання на коло', recordTappingSub:'Найшвидший метод',
    recordTappingDesc:'Кожне натискання дає RECORD. Покращте Tap Power для більшого.',
    recordTapPower:'Покращити Tap Power', recordMorePerTap:'↑ RECORD/натискання',
    recordEnergyUp:'Покращити Energy', recordMoreTaps:'↑ Більше натискань',
    recordAutoMining:'Автоматичний майнінг', recordAutoSub:'Безперервно 24/7',
    recordAutoDesc:'Картки автоматично добувають RECORD навіть офлайн.',
    recordYourSpeed:'Ваша швидкість:', recordMystery:'Таємнича скринька',
    recordMysterySub:'Безкоштовно щодня',
    recordMysteryDesc:'Відкрийте безкоштовну щоденну скриньку з розділу Tasks.',
    recordEnergyRefill:'Зарядка енергії', recordEnergyRefillSub:'Двічі на день безкоштовно',
    recordEnergyRefillDesc:'Коли енергія закінчується, поповніть її двічі на день.',
    recordHowSpend:'💡 Як використовувати RECORD?',
    recordSpend1:'🃏 Покращення карточок для збільшення REC',
    recordSpend2:'⬆️ Покращення Tap Power', recordSpend3:'⚡ Розширення ємності енергії',
    recordSpend4:'⭐ Купівля лімітних карточок у магазині',
    yourLevel:'Ваш поточний рівень', yourBalance:'Ваш баланс:'
  },

  pt: {
    dir:'ltr',
    navHome:'Início', navCards:'Cartas', navTasks:'Tarefas',
    navInvite:'Convidar', navRank:'Ranking', navProfile:'Perfil',
    navGames:'Jogos', navWallet:'Carteira',
    sideDaily:'Diário', sideRank:'Ranking', sideGames:'Jogos',
    sideCombo:'Combo', sideUpgrade:'Melhorar', sideShop:'Loja',
    qbTasks:'Tarefas', qbExchange:'Câmbio', qbSwap:'Trocar',
    tapMine:'Toque para Minerar', energyLabel:'⚡ Energia',
    upgradesTitle:'Melhorias', tapUpgradeTitle:'⚡ Melhoria de Toque',
    energyUpgradeTitle:'🔋 Melhoria de Energia', levelLabel:'Nível:',
    costLabel:'Custo:', tapsPerClick:'Toques por clique:',
    totalEnergy:'Energia Total:', upgradeBtn:'Melhorar', backBtn:'← Voltar',
    energyRefillTitle:'Recarga de Energia ⚡', energyRefillDesc:'Recarregue sua energia instantaneamente',
    remainingToday:'Restante hoje:', refillEnergyBtn:'Recarregar Energia ⚡',
    cardsTitle:'🃏 Cartas', catAnime:'🎌 Anime', catCars:'🚗 Carros',
    catClubs:'🌙 Clubes', catPalaces:'🏰 Palácios', catLimited:'🔥 Limitado',
    cardLevel:'Nível', cardUpgradeBtn:'Melhorar', cardMaxLevel:'✅ Nível máximo!',
    cardMiningBonus:'Mineração da Carta', cardUpgradeCost:'Custo de Melhoria',
    cardWaitTime:'Tempo de Espera', upgrading:'⏳ Melhorando...',
    upgradeReady:'✅ Pronto', noMining:'⛔ Sem mineração — melhore uma carta!',
    miningSpeedLabel:'Mineração REC:', recordSpeedLabel:'Mineração RECORD:',
    tasksTitle:'✅ Tarefas', telegramTask:'📱 Entrar no Grupo Telegram',
    joinGroupBtn:'Entrar →', twitterTask:'🐦 Seguir no Twitter',
    followTwitterBtn:'Seguir →', getRecord:'Obter 10.000 RECORD',
    taskDone:'✅ Concluído',
    dailyRewardTitle:'Recompensa Diária', dailyDay:'Dia {n} / 30',
    dailyClaimed:'Já reivindicado hoje ✅', dailyComeBack:'Volte amanhã',
    dailyClaimBtn:'✅ Reivindicado', dailyClaimNow:'Reivindicar Recompensa 🎁',
    mysteryTitle:'📦 Caixa Misteriosa',
    mysterySubtitle:'Grátis diariamente — ganhe RECORD ou REC!',
    mysteryOpenBtn:'Abrir 🎲',
    mysteryAlready:'Já aberto hoje — volte amanhã!',
    mysteryYouGot:'Você ganhou:',
    inviteTitle:'👥 Convidar', inviteSubtitle:'Convide amigos e ganhe REC!',
    totalInvited:'Total Convidado', personJoined:'pessoas se juntaram',
    milestonesTitle:'🎯 Marcos de Recompensa', copyLink:'📋 Copiar Link',
    shareBtn:'📤 Compartilhar', claimBtn:'Reivindicar! 🎁', inviteN:'Convide {n} pessoas',
    partnerProgram:'PROGRAMA PARCEIRO',
    partnerDesc:'Convide amigos e ganhe REC da mineração deles.',
    commissionRates:'TAXAS DE COMISSÃO', typeLabel:'TIPO',
    miningLabel:'⛏️ Mineração', blockLabel:'🏆 Bloco',
    recEarned:'REC GANHO', friendsLabel:'AMIGOS',
    rewardMilestones:'🎯 MARCOS DE RECOMPENSA',
    rankTitle:'🏆 PLACAR', tabGlobal:'🌍 Global',
    tabFriends:'👥 Amigos', tabMyLevel:'📊 Meu Nível',
    myRankLabel:'Sua Posição Global', weeklyChallenge:'🏆 Desafio Semanal',
    weeklyPrize:'Prêmio: 1.000 REC', daysLeft:'dias restantes',
    loadingLeader:'⏳ Carregando...', noFriends:'Você ainda não convidou ninguém',
    totalMined:'Total de REC Minerado', sinceJoined:'desde que entrou',
    top100only:'Apenas top 100', rewardDist:'Distribuição de Recompensas',
    rankReward:'Recompensa esperada',
    shopTitle:'Loja de Estrelas', shopSubtitle:'Apoie o projeto e ganhe recompensas!',
    shopNote:'⭐ Estrelas compradas no Telegram',
    shopEnergy:'⚡ Recarga Instantânea', shopEnergyDesc:'Recarrega sua energia completamente',
    shopRecord500:'💰 500.000 RECORD', shopRecord500Desc:'Adicionado instantaneamente',
    shopRecord3m:'💰 3.000.000 RECORD', shopRecord3mDesc:'Melhor valor ⭐',
    shopSkip:'🚀 Pular Temporizador', shopSkipDesc:'Conclua melhoria instantaneamente',
    connectWallet:'Conectar Carteira', walletTitle:'Carteira', walletId:'ID',
    walletAssets:'Ativos', poolWallet:'Carteira Pool',
    withdrawable:'Saldo disponível', walletControls:'CONTROLES',
    withdrawPool:'Retirar Pool', transferPool:'Transferir Pool para Carteira',
    history:'Histórico', yourWithdrawals:'Seus saques',
    walletOpen:'Abrir →', walletSoon:'🔒 EM BREVE',
    withdrawTitle:'Sacar REC', withdrawSubtitle:'Saque REC para sua carteira',
    withdrawBalance:'Saldo Disponível', withdrawMin:'Mínimo',
    withdrawFee:'Taxa', withdrawDaily:'Limite Diário Restante',
    withdrawAmount:'Valor a sacar', withdrawBtn:'🏛️ Sacar REC Agora',
    withdrawReceive:'Você receberá:', withdrawAfterFee:'após taxa',
    withdrawSuccess:'✅ Enviado {n} REC!', withdrawNoWallet:'❌ Conecte carteira TON!',
    withdrawLowBal:'❌ Saldo insuficiente',
    withdrawDailyErr:'❌ Limite atingido. Restante: {n} REC',
    withdrawFailed:'❌ Falha no saque', withdrawLoading:'⏳ Enviando...',
    withdrawalBtn:'Saque',
    comboTitle:'🎯 Combo Diário',
    comboSubtitle:'Melhore as 3 cartas diárias e ganhe uma recompensa!',
    comboReward:'Recompensa Diária', comboClaim:'Reivindicar +5 REC 🎉',
    comboClaimed:'✅ Recompensa reivindicada hoje!',
    comboLocked:'Nenhum combo hoje',
    comboAdmin:'Escolher Cartas do Combo - ADMIN',
    comboSave:'💾 Salvar Combo Diário',
    ppCardsUpgraded:'CARTAS MELHORADAS', ppRecSpeed:'VELOCIDADE REC',
    ppRecord:'RECORD', ppRecBalance:'SALDO REC',
    ppTotalTaps:'TOTAL DE TOQUES', ppTasksDone:'TAREFAS FEITAS',
    ppFriends:'AMIGOS', ppCardLevels:'NÍVEIS DAS CARTAS',
    ppNoCards:'Nenhuma carta melhorada',
    menuSupport:'Suporte', menuNews:'Notícias',
    menuNewsDesc:'Atualizações e Anúncios', menuChat:'Chat',
    menuChatDesc:'Chat da Comunidade', menuPayouts:'Pagamentos',
    menuFaq:'FAQ e Termos', menuFaqDesc:'Regras e Condições',
    support:'💬 Suporte @Momokhli', comingSoon:'Em breve', locked:'Bloqueado',
    toastCopied:'✅ Link copiado!', toastTask:'🎉 Obteve 10.000 RECORD!',
    toastClaimed:'🎉 Obteve {n} REC!', toastNotMet:'Requisito não atendido!',
    toastAlready:'Tarefa já concluída!',
    toastUpgradeStart:'⏳ Melhoria iniciada!', toastUpgradeDone:'🎉 Melhoria concluída!',
    toastNotEnoughRecord:'RECORD insuficiente!',
    toastAlreadyUpgrading:'Carta já sendo melhorada!',
    toastInvoiceLoading:'⏳ Preparando fatura...',
    toastPaid:'✅ Pagamento bem-sucedido!',
    toastCancelled:'Pagamento cancelado', toastFailed:'❌ Falha no pagamento',
    toastConnError:'❌ Erro de conexão',
    recInfoTitle:'⚡ Token REC', recInfoSub:'Como ganhar REC e aumentar a velocidade',
    recAutoMining:'Mineração Automática', recYourSpeed:'Sua velocidade atual:',
    recCardUpgrade:'Melhorias de Cartas',
    recCardUpgradeDesc:'Cada melhoria aumenta a velocidade de REC. Cartas limitadas ×3.',
    recNormalCard:'Carta Normal ×1', recLimitedCard:'Carta Limitada ⭐ ×3',
    recBlocks:'Blocos', recBlocksDesc:'Cada toque tem chance de grande recompensa de REC!',
    recDailyCombo:'Combo Diário',
    recDailyComboDesc:'Melhore 3 cartas secretas diárias e ganhe +5 REC.',
    recReferrals:'Referências', recReferralsDesc:'Convide amigos e ganhe comissão:',
    recTasks:'Tarefas', recTasksDesc:'Complete tarefas para ganhar REC extra.',
    recSpeedTip:'💡 Dicas para Aumentar a Velocidade',
    recTip1:'Melhore cartas limitadas primeiro (×3 velocidade)',
    recTip2:'Continue melhorando cartas de alto nível',
    recTip3:'Complete o combo diário todos os dias',
    recTip4:'Convide amigos para comissão contínua',
    recAutoMiningDesc:'Cartas de mineração dão REC automaticamente a cada segundo.',
    recordInfoTitle:'🔴 Token RECORD', recordInfoSub:'Como ganhar RECORD e seu papel',
    recordWhat:'O que é RECORD?', recordWhatSub:'A moeda principal de mineração',
    recordWhatDesc:'RECORD é a moeda principal para melhorar cartas. Seu saldo:',
    recordTapping:'Tocando o Círculo', recordTappingSub:'O método mais rápido',
    recordTappingDesc:'Cada toque dá RECORD. Mais Tap Power = mais por toque.',
    recordTapPower:'Melhorar Tap Power', recordMorePerTap:'↑ RECORD/toque',
    recordEnergyUp:'Melhorar Energia', recordMoreTaps:'↑ Mais toques',
    recordAutoMining:'Mineração Automática', recordAutoSub:'Contínuo 24/7',
    recordAutoDesc:'Cartas mineram RECORD automaticamente mesmo offline.',
    recordYourSpeed:'Sua velocidade:', recordMystery:'Caixa Misteriosa',
    recordMysterySub:'Grátis todo dia',
    recordMysteryDesc:'Abra a caixa misteriosa diária gratuita em Tasks.',
    recordEnergyRefill:'Recarga de Energia', recordEnergyRefillSub:'Duas vezes por dia grátis',
    recordEnergyRefillDesc:'Quando a energia acabar, recarregue duas vezes por dia.',
    recordHowSpend:'💡 Como usar RECORD?',
    recordSpend1:'🃏 Melhorar cartas de mineração', recordSpend2:'⬆️ Melhorar Tap Power',
    recordSpend3:'⚡ Expandir capacidade de energia', recordSpend4:'⭐ Comprar cartas limitadas',
    yourLevel:'Seu Nível Atual', yourBalance:'Seu Saldo:'
  },

  es: {
    dir:'ltr',
    navHome:'Inicio', navCards:'Tarjetas', navTasks:'Tareas',
    navInvite:'Invitar', navRank:'Ranking', navProfile:'Perfil',
    navGames:'Juegos', navWallet:'Billetera',
    sideDaily:'Diario', sideRank:'Ranking', sideGames:'Juegos',
    sideCombo:'Combo', sideUpgrade:'Mejorar', sideShop:'Tienda',
    qbTasks:'Tareas', qbExchange:'Intercambio', qbSwap:'Swap',
    tapMine:'Toca para Minar', energyLabel:'⚡ Energía',
    upgradesTitle:'Mejoras', tapUpgradeTitle:'⚡ Mejora de Toque',
    energyUpgradeTitle:'🔋 Mejora de Energía', levelLabel:'Nivel:',
    costLabel:'Costo:', tapsPerClick:'Toques por clic:',
    totalEnergy:'Energía Total:', upgradeBtn:'Mejorar', backBtn:'← Atrás',
    energyRefillTitle:'Recarga de Energía ⚡', energyRefillDesc:'Recarga tu energía al instante',
    remainingToday:'Restante hoy:', refillEnergyBtn:'Recargar Energía ⚡',
    cardsTitle:'🃏 Tarjetas', catAnime:'🎌 Anime', catCars:'🚗 Coches',
    catClubs:'🌙 Clubes', catPalaces:'🏰 Palacios', catLimited:'🔥 Limitado',
    cardLevel:'Nivel', cardUpgradeBtn:'Mejorar', cardMaxLevel:'✅ ¡Nivel máximo!',
    cardMiningBonus:'Minería de Tarjeta', cardUpgradeCost:'Costo de Mejora',
    cardWaitTime:'Tiempo de Espera', upgrading:'⏳ Mejorando...',
    upgradeReady:'✅ Listo', noMining:'⛔ Sin minería — ¡mejora una tarjeta!',
    miningSpeedLabel:'Minería REC:', recordSpeedLabel:'Minería RECORD:',
    tasksTitle:'✅ Tareas', telegramTask:'📱 Unirse al Grupo Telegram',
    joinGroupBtn:'Unirse →', twitterTask:'🐦 Seguir en Twitter',
    followTwitterBtn:'Seguir →', getRecord:'Obtener 10,000 RECORD',
    taskDone:'✅ Completado',
    dailyRewardTitle:'Recompensa Diaria', dailyDay:'Día {n} / 30',
    dailyClaimed:'Ya reclamado hoy ✅', dailyComeBack:'Vuelve mañana',
    dailyClaimBtn:'✅ Reclamado', dailyClaimNow:'Reclamar Recompensa 🎁',
    mysteryTitle:'📦 Caja Misteriosa',
    mysterySubtitle:'¡Gratis diariamente — gana RECORD o REC!',
    mysteryOpenBtn:'Abrir 🎲',
    mysteryAlready:'¡Ya abierto hoy — vuelve mañana!',
    mysteryYouGot:'Obtuviste:',
    inviteTitle:'👥 Invitar', inviteSubtitle:'¡Invita amigos y gana REC!',
    totalInvited:'Total Invitado', personJoined:'personas se unieron',
    milestonesTitle:'🎯 Hitos de Recompensa', copyLink:'📋 Copiar Enlace',
    shareBtn:'📤 Compartir', claimBtn:'¡Reclamar! 🎁', inviteN:'Invita a {n} personas',
    partnerProgram:'PROGRAMA DE SOCIOS',
    partnerDesc:'Invita amigos y gana REC de su minería.',
    commissionRates:'TASAS DE COMISIÓN', typeLabel:'TIPO',
    miningLabel:'⛏️ Minería', blockLabel:'🏆 Bloque',
    recEarned:'REC GANADO', friendsLabel:'AMIGOS',
    rewardMilestones:'🎯 HITOS DE RECOMPENSA',
    rankTitle:'🏆 CLASIFICACIÓN', tabGlobal:'🌍 Global',
    tabFriends:'👥 Amigos', tabMyLevel:'📊 Mi Nivel',
    myRankLabel:'Tu Rango Global', weeklyChallenge:'🏆 Desafío Semanal',
    weeklyPrize:'Premio: 1,000 REC', daysLeft:'días restantes',
    loadingLeader:'⏳ Cargando...', noFriends:'Aún no has invitado a nadie',
    totalMined:'Total REC Minado', sinceJoined:'desde que entró',
    top100only:'Solo top 100', rewardDist:'Distribución de Recompensas',
    rankReward:'Recompensa esperada',
    shopTitle:'Tienda de Estrellas', shopSubtitle:'¡Apoya el proyecto y obtén recompensas!',
    shopNote:'⭐ Estrellas compradas en Telegram',
    shopEnergy:'⚡ Recarga Instantánea', shopEnergyDesc:'Recarga tu energía completamente',
    shopRecord500:'💰 500,000 RECORD', shopRecord500Desc:'Añadido instantáneamente',
    shopRecord3m:'💰 3,000,000 RECORD', shopRecord3mDesc:'Mejor valor ⭐',
    shopSkip:'🚀 Saltar Temporizador', shopSkipDesc:'Completar mejora instantáneamente',
    connectWallet:'Conectar Billetera', walletTitle:'Billetera', walletId:'ID',
    walletAssets:'Activos', poolWallet:'Billetera Pool',
    withdrawable:'Saldo disponible', walletControls:'CONTROLES',
    withdrawPool:'Retirar Pool', transferPool:'Transferir Pool a Billetera',
    history:'Historial', yourWithdrawals:'Tus retiros',
    walletOpen:'Abrir →', walletSoon:'🔒 PRONTO',
    withdrawTitle:'Retirar REC', withdrawSubtitle:'Retira REC a tu billetera',
    withdrawBalance:'Saldo Disponible', withdrawMin:'Mínimo',
    withdrawFee:'Tarifa', withdrawDaily:'Límite Diario Restante',
    withdrawAmount:'Cantidad a retirar', withdrawBtn:'🏛️ Retirar REC Ahora',
    withdrawReceive:'Recibirás:', withdrawAfterFee:'después de tarifa',
    withdrawSuccess:'✅ ¡Enviado {n} REC!', withdrawNoWallet:'❌ ¡Conecta billetera TON!',
    withdrawLowBal:'❌ Saldo insuficiente',
    withdrawDailyErr:'❌ Límite alcanzado. Restante: {n} REC',
    withdrawFailed:'❌ Error en retiro', withdrawLoading:'⏳ Enviando...',
    withdrawalBtn:'Retiro',
    comboTitle:'🎯 Combo Diario',
    comboSubtitle:'¡Mejora las 3 cartas diarias y obtén una recompensa!',
    comboReward:'Recompensa Diaria', comboClaim:'Reclamar +5 REC 🎉',
    comboClaimed:'✅ ¡Recompensa reclamada hoy!',
    comboLocked:'Sin combo hoy',
    comboAdmin:'Elegir Cartas del Combo - ADMIN',
    comboSave:'💾 Guardar Combo Diario',
    ppCardsUpgraded:'TARJETAS MEJORADAS', ppRecSpeed:'VELOCIDAD REC',
    ppRecord:'RECORD', ppRecBalance:'BALANCE REC',
    ppTotalTaps:'TOTAL DE TOQUES', ppTasksDone:'TAREAS HECHAS',
    ppFriends:'AMIGOS', ppCardLevels:'NIVELES DE TARJETAS',
    ppNoCards:'Sin tarjetas mejoradas aún',
    menuSupport:'Soporte', menuNews:'Noticias',
    menuNewsDesc:'Actualizaciones y Anuncios', menuChat:'Chat',
    menuChatDesc:'Chat de la Comunidad', menuPayouts:'Pagos',
    menuFaq:'FAQ y Términos', menuFaqDesc:'Reglas y Condiciones',
    support:'💬 Soporte @Momokhli', comingSoon:'Próximamente', locked:'Bloqueado',
    toastCopied:'✅ ¡Enlace copiado!', toastTask:'🎉 ¡Obtuviste 10,000 RECORD!',
    toastClaimed:'🎉 ¡Obtuviste {n} REC!', toastNotMet:'¡Requisito no cumplido!',
    toastAlready:'¡Tarea ya completada!',
    toastUpgradeStart:'⏳ ¡Mejora iniciada!', toastUpgradeDone:'🎉 ¡Mejora completada!',
    toastNotEnoughRecord:'¡RECORD insuficiente!',
    toastAlreadyUpgrading:'¡Tarjeta ya mejorándose!',
    toastInvoiceLoading:'⏳ Preparando factura...',
    toastPaid:'✅ ¡Pago exitoso!',
    toastCancelled:'Pago cancelado', toastFailed:'❌ Error en el pago',
    toastConnError:'❌ Error de conexión',
    recInfoTitle:'⚡ Token REC', recInfoSub:'Cómo ganar REC y aumentar la velocidad',
    recAutoMining:'Minería Automática', recYourSpeed:'Tu velocidad actual:',
    recCardUpgrade:'Mejoras de Tarjetas',
    recCardUpgradeDesc:'Cada mejora aumenta la velocidad de REC. Cartas limitadas ×3.',
    recNormalCard:'Tarjeta Normal ×1', recLimitedCard:'Tarjeta Limitada ⭐ ×3',
    recBlocks:'Bloques', recBlocksDesc:'¡Cada toque tiene oportunidad de gran recompensa REC!',
    recDailyCombo:'Combo Diario',
    recDailyComboDesc:'Mejora 3 tarjetas secretas diarias y obtén +5 REC.',
    recReferrals:'Referencias', recReferralsDesc:'Invita amigos y gana comisión:',
    recTasks:'Tareas', recTasksDesc:'Completa tareas para ganar REC extra.',
    recSpeedTip:'💡 Consejos para Aumentar la Velocidad',
    recTip1:'Mejora cartas limitadas primero (×3 velocidad)',
    recTip2:'Continúa mejorando cartas de alto nivel',
    recTip3:'Completa el combo diario cada día',
    recTip4:'Invita amigos para comisión continua',
    recAutoMiningDesc:'Las cartas de minería dan REC automáticamente cada segundo.',
    recordInfoTitle:'🔴 Token RECORD', recordInfoSub:'Cómo ganar RECORD y su rol',
    recordWhat:'¿Qué es RECORD?', recordWhatSub:'La moneda principal de minería',
    recordWhatDesc:'RECORD es la moneda principal para mejorar tarjetas. Tu saldo:',
    recordTapping:'Tocando el Círculo', recordTappingSub:'El método más rápido',
    recordTappingDesc:'Cada toque da RECORD. Más Tap Power = más por toque.',
    recordTapPower:'Mejorar Tap Power', recordMorePerTap:'↑ RECORD/toque',
    recordEnergyUp:'Mejorar Energía', recordMoreTaps:'↑ Más toques',
    recordAutoMining:'Minería Automática', recordAutoSub:'Continuo 24/7',
    recordAutoDesc:'Las tarjetas minan RECORD automáticamente incluso offline.',
    recordYourSpeed:'Tu velocidad:', recordMystery:'Caja Misteriosa',
    recordMysterySub:'Gratis cada día',
    recordMysteryDesc:'Abre la caja misteriosa diaria gratuita en Tasks.',
    recordEnergyRefill:'Recarga de Energía', recordEnergyRefillSub:'Dos veces al día gratis',
    recordEnergyRefillDesc:'Cuando se acaba la energía, recárgala dos veces al día.',
    recordHowSpend:'💡 ¿Cómo usar RECORD?',
    recordSpend1:'🃏 Mejorar tarjetas de minería', recordSpend2:'⬆️ Mejorar Tap Power',
    recordSpend3:'⚡ Expandir capacidad de energía', recordSpend4:'⭐ Comprar tarjetas limitadas',
    yourLevel:'Tu Nivel Actual', yourBalance:'Tu Saldo:'
  },

  tr: {
    dir:'ltr',
    navHome:'Ana Sayfa', navCards:'Kartlar', navTasks:'Görevler',
    navInvite:'Davet Et', navRank:'Sıralama', navProfile:'Profil',
    navGames:'Oyunlar', navWallet:'Cüzdan',
    sideDaily:'Günlük', sideRank:'Sıralama', sideGames:'Oyunlar',
    sideCombo:'Kombo', sideUpgrade:'Yükselt', sideShop:'Mağaza',
    qbTasks:'Görevler', qbExchange:'Borsa', qbSwap:'Takas',
    tapMine:'Madencilik İçin Dokun', energyLabel:'⚡ Enerji',
    upgradesTitle:'Yükseltmeler', tapUpgradeTitle:'⚡ Dokunma Yükseltmesi',
    energyUpgradeTitle:'🔋 Enerji Yükseltmesi', levelLabel:'Seviye:',
    costLabel:'Maliyet:', tapsPerClick:'Tıklama başına dokunuş:',
    totalEnergy:'Toplam Enerji:', upgradeBtn:'Yükselt', backBtn:'← Geri',
    energyRefillTitle:'Enerji Şarjı ⚡', energyRefillDesc:'Enerjini anında doldur',
    remainingToday:'Bugün kalan:', refillEnergyBtn:'Enerji Şarj Et ⚡',
    cardsTitle:'🃏 Kartlar', catAnime:'🎌 Anime', catCars:'🚗 Arabalar',
    catClubs:'🌙 Kulüpler', catPalaces:'🏰 Saraylar', catLimited:'🔥 Sınırlı',
    cardLevel:'Seviye', cardUpgradeBtn:'Yükselt', cardMaxLevel:'✅ Maksimum seviye!',
    cardMiningBonus:'Kart Madenciliği', cardUpgradeCost:'Yükseltme Maliyeti',
    cardWaitTime:'Bekleme Süresi', upgrading:'⏳ Yükseltiliyor...',
    upgradeReady:'✅ Hazır', noMining:'⛔ Madencilik yok — önce bir kart yükselt!',
    miningSpeedLabel:'REC Madenciliği:', recordSpeedLabel:'RECORD Madenciliği:',
    tasksTitle:'✅ Görevler', telegramTask:'📱 Telegram Grubuna Katıl',
    joinGroupBtn:'Katıl →', twitterTask:"🐦 Twitter'da Takip Et",
    followTwitterBtn:'Takip Et →', getRecord:'10.000 RECORD Al',
    taskDone:'✅ Tamamlandı',
    dailyRewardTitle:'Günlük Ödül', dailyDay:'Gün {n} / 30',
    dailyClaimed:'Bugün alındı ✅', dailyComeBack:'Yarın gelin',
    dailyClaimBtn:'✅ Alındı', dailyClaimNow:'Ödülü Al 🎁',
    mysteryTitle:'📦 Gizemli Kutu',
    mysterySubtitle:'Her gün ücretsiz — RECORD veya REC kazan!',
    mysteryOpenBtn:'Aç 🎲',
    mysteryAlready:'Bugün zaten açıldı — yarın gel!',
    mysteryYouGot:'Aldınız:',
    inviteTitle:'👥 Davet Et', inviteSubtitle:'Arkadaşlarını davet et ve REC kazan!',
    totalInvited:'Toplam Davet', personJoined:'kişi katıldı',
    milestonesTitle:'🎯 Ödül Dönüm Noktaları', copyLink:'📋 Bağlantıyı Kopyala',
    shareBtn:'📤 Paylaş', claimBtn:'Al! 🎁', inviteN:'{n} kişi davet et',
    partnerProgram:'ORTAK PROGRAMI',
    partnerDesc:'Arkadaşlarını davet et ve madenciliklerinden REC kazan.',
    commissionRates:'KOMİSYON ORANLARI', typeLabel:'TÜR',
    miningLabel:'⛏️ Madencilik', blockLabel:'🏆 Blok',
    recEarned:'KAZANILAN REC', friendsLabel:'ARKADAŞLAR',
    rewardMilestones:'🎯 ÖDÜL AŞAMALARI',
    rankTitle:'🏆 LIDERBOARD', tabGlobal:'🌍 Global',
    tabFriends:'👥 Arkadaşlar', tabMyLevel:'📊 Seviyem',
    myRankLabel:'Global Sıralamanız', weeklyChallenge:'🏆 Haftalık Meydan Okuma',
    weeklyPrize:'Ödül: 1.000 REC', daysLeft:'gün kaldı',
    loadingLeader:'⏳ Yükleniyor...', noFriends:'Henüz kimseyi davet etmediniz',
    totalMined:'Toplam Kazılan REC', sinceJoined:'katıldığından beri',
    top100only:'Yalnızca ilk 100', rewardDist:'Ödül Dağılımı',
    rankReward:'Beklenen ödül',
    shopTitle:'Yıldız Mağazası', shopSubtitle:'Projeyi destekle ve ödül kazan!',
    shopNote:"⭐ Yıldızlar Telegram'dan satın alınır",
    shopEnergy:'⚡ Anlık Şarj', shopEnergyDesc:'Enerjini tamamen doldurur',
    shopRecord500:'💰 500.000 RECORD', shopRecord500Desc:'Bakiyeye anında eklenir',
    shopRecord3m:'💰 3.000.000 RECORD', shopRecord3mDesc:'En iyi değer ⭐',
    shopSkip:'🚀 Beklemeyi Atla', shopSkipDesc:'Kart yükseltmesini anında tamamla',
    connectWallet:'Cüzdan Bağla', walletTitle:'Cüzdan', walletId:'ID',
    walletAssets:'Varlıklar', poolWallet:'Pool Cüzdan',
    withdrawable:'Çekilebilir bakiye', walletControls:'KONTROLLER',
    withdrawPool:'Pool Çek', transferPool:"Pool'u Cüzdana Transfer Et",
    history:'Geçmiş', yourWithdrawals:'Çekimleriniz',
    walletOpen:'Aç →', walletSoon:'🔒 YAKINDA',
    withdrawTitle:'REC Çek', withdrawSubtitle:"REC'i cüzdanına çek",
    withdrawBalance:'Kullanılabilir Bakiye', withdrawMin:'Minimum',
    withdrawFee:'Ücret', withdrawDaily:'Günlük Kalan Limit',
    withdrawAmount:'Çekilecek Miktar', withdrawBtn:'🏛️ REC Çek',
    withdrawReceive:'Alacaksınız:', withdrawAfterFee:'ücret sonrası',
    withdrawSuccess:'✅ {n} REC gönderildi!', withdrawNoWallet:'❌ TON cüzdanı bağlayın!',
    withdrawLowBal:'❌ Yetersiz bakiye',
    withdrawDailyErr:'❌ Günlük limit. Kalan: {n} REC',
    withdrawFailed:'❌ Çekim başarısız', withdrawLoading:'⏳ Gönderiliyor...',
    withdrawalBtn:'Çekim',
    comboTitle:'🎯 Günlük Kombo',
    comboSubtitle:'3 günlük kartı yükselt ve ödül kazan!',
    comboReward:'Günlük Ödül', comboClaim:'+5 REC Al 🎉',
    comboClaimed:'✅ Bugün ödül alındı!',
    comboLocked:'Bugün kombo yok',
    comboAdmin:'Kombo Kartlarını Seç - ADMIN',
    comboSave:'💾 Günlük Komboyu Kaydet',
    ppCardsUpgraded:'YÜKSELTİLEN KART', ppRecSpeed:'REC HIZI',
    ppRecord:'RECORD', ppRecBalance:'REC BAKİYE',
    ppTotalTaps:'TOPLAM DOKUNUŞ', ppTasksDone:'TAMAMLANAN GÖREV',
    ppFriends:'ARKADAŞLAR', ppCardLevels:'KART SEVİYELERİ',
    ppNoCards:'Henüz yükseltilmiş kart yok',
    menuSupport:'Destek', menuNews:'Haberler',
    menuNewsDesc:'Güncellemeler ve Duyurular', menuChat:'Sohbet',
    menuChatDesc:'Topluluk Sohbeti', menuPayouts:'Ödemeler',
    menuFaq:'SSS ve Koşullar', menuFaqDesc:'Kurallar ve Koşullar',
    support:'💬 Destek @Momokhli', comingSoon:'Yakında', locked:'Kilitli',
    toastCopied:'✅ Bağlantı kopyalandı!', toastTask:'🎉 10.000 RECORD kazandın!',
    toastClaimed:'🎉 {n} REC kazandın!', toastNotMet:'Gereksinim karşılanmadı!',
    toastAlready:'Görev zaten tamamlandı!',
    toastUpgradeStart:'⏳ Kart yükseltmesi başladı!',
    toastUpgradeDone:'🎉 Yükseltme tamamlandı!',
    toastNotEnoughRecord:'Yetersiz RECORD!',
    toastAlreadyUpgrading:'Kart zaten yükseltiliyor!',
    toastInvoiceLoading:'⏳ Fatura hazırlanıyor...',
    toastPaid:'✅ Ödeme başarılı!',
    toastCancelled:'Ödeme iptal edildi', toastFailed:'❌ Ödeme başarısız',
    toastConnError:'❌ Bağlantı hatası',
    recInfoTitle:'⚡ REC Tokeni', recInfoSub:'REC nasıl kazanılır ve madencilik hızı nasıl artırılır',
    recAutoMining:'Otomatik Madencilik', recYourSpeed:'Mevcut hızınız:',
    recCardUpgrade:'Kart Yükseltmeleri',
    recCardUpgradeDesc:'Her yükseltme REC hızını artırır. Sınırlı kartlar ×3.',
    recNormalCard:'Normal Kart ×1', recLimitedCard:'Sınırlı Kart ⭐ ×3',
    recBlocks:'Bloklar', recBlocksDesc:'Her dokunuşun büyük bir REC ödülü kazanma şansı var!',
    recDailyCombo:'Günlük Kombo',
    recDailyComboDesc:'3 günlük gizli kartı yükselt ve +5 REC kazan.',
    recReferrals:'Referanslar', recReferralsDesc:'Arkadaşlarını davet et ve komisyon kazan:',
    recTasks:'Görevler', recTasksDesc:'Ekstra REC için görevleri tamamla.',
    recSpeedTip:'💡 Hız Artırma İpuçları',
    recTip1:'Önce sınırlı kartları yükselt (×3 hız)',
    recTip2:'Yüksek seviyeli kartları yükseltmeye devam et',
    recTip3:'Her gün günlük komboyu tamamla',
    recTip4:'Sürekli komisyon için arkadaşlarını davet et',
    recAutoMiningDesc:'Madencilik kartları her saniye otomatik olarak REC verir.',
    recordInfoTitle:'🔴 RECORD Tokeni', recordInfoSub:'RECORD nasıl kazanılır ve rolü',
    recordWhat:'RECORD nedir?', recordWhatSub:'Ana madencilik para birimi',
    recordWhatDesc:'RECORD, kartları yükseltmek için ana para birimidir. Bakiyeniz:',
    recordTapping:'Daireye Dokunma', recordTappingSub:'En hızlı yöntem',
    recordTappingDesc:'Her dokunuş RECORD verir. Daha fazlası için Tap Power yükselt.',
    recordTapPower:'Tap Power Yükselt', recordMorePerTap:'↑ RECORD/dokunuş',
    recordEnergyUp:'Enerji Yükselt', recordMoreTaps:'↑ Daha fazla dokunuş',
    recordAutoMining:'Otomatik Madencilik', recordAutoSub:'Sürekli 24/7',
    recordAutoDesc:'Kartlar çevrimdışıyken bile otomatik RECORD kazandırır.',
    recordYourSpeed:'Hızınız:', recordMystery:'Gizemli Kutu',
    recordMysterySub:'Her gün ücretsiz',
    recordMysteryDesc:"Tasks bölümünden ücretsiz günlük gizemli kutuyu aç.",
    recordEnergyRefill:'Enerji Şarjı', recordEnergyRefillSub:'Günde iki kez ücretsiz',
    recordEnergyRefillDesc:'Enerjin bittiğinde günde iki kez ücretsiz doldurabilirsin.',
    recordHowSpend:'💡 RECORD nasıl kullanılır?',
    recordSpend1:'🃏 Madencilik kartlarını yükselt', recordSpend2:'⬆️ Tap Power yükselt',
    recordSpend3:'⚡ Enerji kapasitesini genişlet', recordSpend4:'⭐ Sınırlı kartlar satın al',
    yourLevel:'Mevcut Seviyeniz', yourBalance:'Bakiyeniz:'
  },

  vi: {
    dir:'ltr',
    navHome:'Trang chủ', navCards:'Thẻ bài', navTasks:'Nhiệm vụ',
    navInvite:'Mời bạn', navRank:'Xếp hạng', navProfile:'Hồ sơ',
    navGames:'Trò chơi', navWallet:'Ví',
    sideDaily:'Hàng ngày', sideRank:'Xếp hạng', sideGames:'Trò chơi',
    sideCombo:'Combo', sideUpgrade:'Nâng cấp', sideShop:'Cửa hàng',
    qbTasks:'Nhiệm vụ', qbExchange:'Đổi', qbSwap:'Hoán đổi',
    tapMine:'Nhấn để Khai Thác', energyLabel:'⚡ Năng lượng',
    upgradesTitle:'Nâng cấp', tapUpgradeTitle:'⚡ Nâng cấp chạm',
    energyUpgradeTitle:'🔋 Nâng cấp năng lượng', levelLabel:'Cấp độ:',
    costLabel:'Chi phí:', tapsPerClick:'Lần chạm mỗi cú nhấp:',
    totalEnergy:'Tổng năng lượng:', upgradeBtn:'Nâng cấp', backBtn:'← Quay lại',
    energyRefillTitle:'Nạp Năng Lượng ⚡', energyRefillDesc:'Nạp đầy năng lượng ngay lập tức',
    remainingToday:'Còn lại hôm nay:', refillEnergyBtn:'Nạp Năng Lượng ⚡',
    cardsTitle:'🃏 Thẻ bài', catAnime:'🎌 Anime', catCars:'🚗 Xe hơi',
    catClubs:'🌙 Câu lạc bộ', catPalaces:'🏰 Cung điện', catLimited:'🔥 Giới hạn',
    cardLevel:'Cấp độ', cardUpgradeBtn:'Nâng cấp', cardMaxLevel:'✅ Cấp độ tối đa!',
    cardMiningBonus:'Khai thác thẻ', cardUpgradeCost:'Chi phí nâng cấp',
    cardWaitTime:'Thời gian chờ', upgrading:'⏳ Đang nâng cấp...',
    upgradeReady:'✅ Sẵn sàng', noMining:'⛔ Không có khai thác — nâng cấp thẻ trước!',
    miningSpeedLabel:'Khai thác REC:', recordSpeedLabel:'Khai thác RECORD:',
    tasksTitle:'✅ Nhiệm vụ', telegramTask:'📱 Tham gia nhóm Telegram',
    joinGroupBtn:'Tham gia →', twitterTask:'🐦 Theo dõi Twitter',
    followTwitterBtn:'Theo dõi →', getRecord:'Nhận 10,000 RECORD',
    taskDone:'✅ Hoàn thành',
    dailyRewardTitle:'Phần Thưởng Hàng Ngày', dailyDay:'Ngày {n} / 30',
    dailyClaimed:'Đã nhận hôm nay ✅', dailyComeBack:'Quay lại ngày mai',
    dailyClaimBtn:'✅ Đã nhận', dailyClaimNow:'Nhận Phần Thưởng 🎁',
    mysteryTitle:'📦 Hộp Bí Ẩn',
    mysterySubtitle:'Miễn phí hàng ngày — thắng RECORD hoặc REC!',
    mysteryOpenBtn:'Mở 🎲',
    mysteryAlready:'Đã mở hôm nay — quay lại ngày mai!',
    mysteryYouGot:'Bạn nhận được:',
    inviteTitle:'👥 Mời bạn bè', inviteSubtitle:'Mời bạn bè và kiếm REC!',
    totalInvited:'Tổng số đã mời', personJoined:'người đã tham gia',
    milestonesTitle:'🎯 Cột mốc phần thưởng', copyLink:'📋 Sao chép liên kết',
    shareBtn:'📤 Chia sẻ', claimBtn:'Nhận! 🎁', inviteN:'Mời {n} người',
    partnerProgram:'CHƯƠNG TRÌNH ĐỐI TÁC',
    partnerDesc:'Mời bạn bè và kiếm REC từ việc khai thác của họ.',
    commissionRates:'TỶ LỆ HOA HỒNG', typeLabel:'LOẠI',
    miningLabel:'⛏️ Khai thác', blockLabel:'🏆 Khối',
    recEarned:'REC KIẾM ĐƯỢC', friendsLabel:'BẠN BÈ',
    rewardMilestones:'🎯 CỘT MỐC PHẦN THƯỞNG',
    rankTitle:'🏆 BẢNG XẾP HẠNG', tabGlobal:'🌍 Toàn cầu',
    tabFriends:'👥 Bạn bè', tabMyLevel:'📊 Cấp độ của tôi',
    myRankLabel:'Thứ hạng toàn cầu', weeklyChallenge:'🏆 Thách thức hàng tuần',
    weeklyPrize:'Giải thưởng: 1,000 REC', daysLeft:'ngày còn lại',
    loadingLeader:'⏳ Đang tải...', noFriends:'Bạn chưa mời ai',
    totalMined:'Tổng REC đã đào', sinceJoined:'kể từ khi tham gia',
    top100only:'Chỉ top 100', rewardDist:'Phân phối phần thưởng',
    rankReward:'Phần thưởng dự kiến',
    shopTitle:'Cửa hàng Sao', shopSubtitle:'Ủng hộ dự án và nhận phần thưởng!',
    shopNote:'⭐ Sao mua trực tiếp từ Telegram',
    shopEnergy:'⚡ Nạp Ngay', shopEnergyDesc:'Khôi phục đầy đủ năng lượng',
    shopRecord500:'💰 500,000 RECORD', shopRecord500Desc:'Thêm ngay vào số dư',
    shopRecord3m:'💰 3,000,000 RECORD', shopRecord3mDesc:'Giá trị tốt nhất ⭐',
    shopSkip:'🚀 Bỏ qua thời gian chờ', shopSkipDesc:'Hoàn thành nâng cấp thẻ ngay',
    connectWallet:'Kết nối Ví', walletTitle:'Ví', walletId:'ID',
    walletAssets:'Tài sản', poolWallet:'Ví Pool',
    withdrawable:'Số dư có thể rút', walletControls:'ĐIỀU KHIỂN',
    withdrawPool:'Rút Pool', transferPool:'Chuyển Pool vào Ví',
    history:'Lịch sử', yourWithdrawals:'Lịch sử rút tiền',
    walletOpen:'Mở →', walletSoon:'🔒 SẮP CÓ',
    withdrawTitle:'Rút REC', withdrawSubtitle:'Rút REC vào ví của bạn',
    withdrawBalance:'Số dư khả dụng', withdrawMin:'Tối thiểu',
    withdrawFee:'Phí', withdrawDaily:'Hạn mức ngày còn lại',
    withdrawAmount:'Số tiền rút', withdrawBtn:'🏛️ Rút REC Ngay',
    withdrawReceive:'Bạn sẽ nhận:', withdrawAfterFee:'sau phí',
    withdrawSuccess:'✅ Đã gửi {n} REC!', withdrawNoWallet:'❌ Kết nối ví TON trước!',
    withdrawLowBal:'❌ Số dư không đủ',
    withdrawDailyErr:'❌ Đạt giới hạn ngày. Còn lại: {n} REC',
    withdrawFailed:'❌ Rút tiền thất bại', withdrawLoading:'⏳ Đang gửi...',
    withdrawalBtn:'Rút tiền',
    comboTitle:'🎯 Combo Hàng Ngày',
    comboSubtitle:'Nâng cấp 3 thẻ hàng ngày và nhận phần thưởng!',
    comboReward:'Phần thưởng hàng ngày', comboClaim:'Nhận +5 REC 🎉',
    comboClaimed:'✅ Đã nhận phần thưởng hôm nay!',
    comboLocked:'Chưa có combo hôm nay',
    comboAdmin:'Chọn thẻ Combo - ADMIN',
    comboSave:'💾 Lưu Combo Hàng Ngày',
    ppCardsUpgraded:'THẺ NÂNG CẤP', ppRecSpeed:'TỐC ĐỘ REC',
    ppRecord:'RECORD', ppRecBalance:'SỐ DƯ REC',
    ppTotalTaps:'TỔNG LẦN NHẤN', ppTasksDone:'NHIỆM VỤ HOÀN THÀNH',
    ppFriends:'BẠN BÈ', ppCardLevels:'CẤP ĐỘ THẺ',
    ppNoCards:'Chưa có thẻ nào được nâng cấp',
    menuSupport:'Hỗ trợ', menuNews:'Tin tức',
    menuNewsDesc:'Cập nhật & Thông báo', menuChat:'Trò chuyện',
    menuChatDesc:'Trò chuyện cộng đồng', menuPayouts:'Thanh toán',
    menuFaq:'FAQ & Điều khoản', menuFaqDesc:'Quy tắc & Điều kiện',
    support:'💬 Hỗ trợ @Momokhli', comingSoon:'Sắp có', locked:'Đã khóa',
    toastCopied:'✅ Đã sao chép liên kết!', toastTask:'🎉 Nhận được 10,000 RECORD!',
    toastClaimed:'🎉 Nhận được {n} REC!', toastNotMet:'Yêu cầu chưa đáp ứng!',
    toastAlready:'Nhiệm vụ đã hoàn thành!',
    toastUpgradeStart:'⏳ Bắt đầu nâng cấp thẻ!',
    toastUpgradeDone:'🎉 Nâng cấp hoàn thành!',
    toastNotEnoughRecord:'Không đủ RECORD!',
    toastAlreadyUpgrading:'Thẻ đang được nâng cấp!',
    toastInvoiceLoading:'⏳ Đang chuẩn bị hóa đơn...',
    toastPaid:'✅ Thanh toán thành công!',
    toastCancelled:'Đã hủy thanh toán', toastFailed:'❌ Thanh toán thất bại',
    toastConnError:'❌ Lỗi kết nối',
    recInfoTitle:'⚡ Token REC', recInfoSub:'Cách kiếm REC và tăng tốc độ khai thác',
    recAutoMining:'Khai thác tự động', recYourSpeed:'Tốc độ hiện tại của bạn:',
    recCardUpgrade:'Nâng cấp thẻ',
    recCardUpgradeDesc:'Mỗi lần nâng cấp tăng tốc độ REC. Thẻ giới hạn ×3.',
    recNormalCard:'Thẻ thường ×1', recLimitedCard:'Thẻ giới hạn ⭐ ×3',
    recBlocks:'Khối', recBlocksDesc:'Mỗi lần nhấn có cơ hội nhận phần thưởng REC lớn!',
    recDailyCombo:'Combo Hàng Ngày',
    recDailyComboDesc:'Nâng cấp 3 thẻ bí mật hàng ngày và nhận +5 REC.',
    recReferrals:'Giới thiệu', recReferralsDesc:'Mời bạn bè và kiếm hoa hồng:',
    recTasks:'Nhiệm vụ', recTasksDesc:'Hoàn thành nhiệm vụ để nhận REC thêm.',
    recSpeedTip:'💡 Mẹo tăng tốc độ',
    recTip1:'Nâng cấp thẻ giới hạn trước (×3 tốc độ)',
    recTip2:'Tiếp tục nâng cấp thẻ cấp cao',
    recTip3:'Hoàn thành combo hàng ngày mỗi ngày',
    recTip4:'Mời bạn bè để có hoa hồng liên tục',
    recAutoMiningDesc:'Thẻ khai thác tự động cho bạn REC mỗi giây.',
    recordInfoTitle:'🔴 Token RECORD', recordInfoSub:'Cách kiếm RECORD và vai trò của nó',
    recordWhat:'RECORD là gì?', recordWhatSub:'Tiền tệ khai thác chính',
    recordWhatDesc:'RECORD là tiền tệ chính để nâng cấp thẻ. Số dư của bạn:',
    recordTapping:'Nhấn vào vòng tròn', recordTappingSub:'Phương pháp nhanh nhất',
    recordTappingDesc:'Mỗi lần nhấn cho RECORD. Nhiều Tap Power = nhiều hơn mỗi lần.',
    recordTapPower:'Nâng cấp Tap Power', recordMorePerTap:'↑ RECORD/lần nhấn',
    recordEnergyUp:'Nâng cấp năng lượng', recordMoreTaps:'↑ Nhiều lần nhấn hơn',
    recordAutoMining:'Khai thác tự động', recordAutoSub:'Liên tục 24/7',
    recordAutoDesc:'Thẻ tự động khai thác RECORD ngay cả khi offline.',
    recordYourSpeed:'Tốc độ của bạn:', recordMystery:'Hộp Bí Ẩn',
    recordMysterySub:'Miễn phí mỗi ngày',
    recordMysteryDesc:'Mở hộp bí ẩn miễn phí hàng ngày từ Tasks.',
    recordEnergyRefill:'Nạp năng lượng', recordEnergyRefillSub:'Miễn phí hai lần mỗi ngày',
    recordEnergyRefillDesc:'Khi năng lượng hết, nạp lại miễn phí hai lần mỗi ngày.',
    recordHowSpend:'💡 Cách sử dụng RECORD?',
    recordSpend1:'🃏 Nâng cấp thẻ khai thác', recordSpend2:'⬆️ Nâng cấp Tap Power',
    recordSpend3:'⚡ Mở rộng dung lượng năng lượng', recordSpend4:'⭐ Mua thẻ giới hạn',
    yourLevel:'Cấp độ hiện tại', yourBalance:'Số dư:'
  },

  zh: {
    dir:'ltr',
    navHome:'首页', navCards:'卡片', navTasks:'任务',
    navInvite:'邀请', navRank:'排名', navProfile:'个人',
    navGames:'游戏', navWallet:'钱包',
    sideDaily:'每日', sideRank:'排名', sideGames:'游戏',
    sideCombo:'组合', sideUpgrade:'升级', sideShop:'商店',
    qbTasks:'任务', qbExchange:'兑换', qbSwap:'交换',
    tapMine:'点击挖矿', energyLabel:'⚡ 能量',
    upgradesTitle:'升级', tapUpgradeTitle:'⚡ 点击升级',
    energyUpgradeTitle:'🔋 能量升级', levelLabel:'等级:',
    costLabel:'费用:', tapsPerClick:'每次点击次数:',
    totalEnergy:'总能量:', upgradeBtn:'升级', backBtn:'← 返回',
    energyRefillTitle:'能量充值 ⚡', energyRefillDesc:'立即补充能量',
    remainingToday:'今日剩余:', refillEnergyBtn:'充能 ⚡',
    cardsTitle:'🃏 卡片', catAnime:'🎌 动漫', catCars:'🚗 汽车',
    catClubs:'🌙 夜总会', catPalaces:'🏰 宫殿', catLimited:'🔥 限定',
    cardLevel:'等级', cardUpgradeBtn:'升级', cardMaxLevel:'✅ 已达最高等级!',
    cardMiningBonus:'卡片挖矿', cardUpgradeCost:'升级费用',
    cardWaitTime:'等待时间', upgrading:'⏳ 升级中...',
    upgradeReady:'✅ 就绪', noMining:'⛔ 无挖矿 — 请先升级卡片!',
    miningSpeedLabel:'REC挖矿:', recordSpeedLabel:'RECORD挖矿:',
    tasksTitle:'✅ 任务', telegramTask:'📱 加入Telegram群组',
    joinGroupBtn:'加入群组 →', twitterTask:'🐦 在推特关注',
    followTwitterBtn:'在推特关注 →', getRecord:'获得 10,000 RECORD',
    taskDone:'✅ 已完成',
    dailyRewardTitle:'每日奖励', dailyDay:'第 {n} 天 / 30',
    dailyClaimed:'今天已领取 ✅', dailyComeBack:'明天再来',
    dailyClaimBtn:'✅ 已领取', dailyClaimNow:'领取奖励 🎁',
    mysteryTitle:'📦 神秘箱',
    mysterySubtitle:'每天免费——赢得RECORD或REC！',
    mysteryOpenBtn:'开启 🎲',
    mysteryAlready:'今天已开启——明天再来！',
    mysteryYouGot:'您获得了:',
    inviteTitle:'👥 邀请', inviteSubtitle:'邀请朋友赚取REC!',
    totalInvited:'总邀请人数', personJoined:'人加入',
    milestonesTitle:'🎯 奖励里程碑', copyLink:'📋 复制链接',
    shareBtn:'📤 分享', claimBtn:'领取! 🎁', inviteN:'邀请{n}人',
    partnerProgram:'合作伙伴计划',
    partnerDesc:'邀请朋友，从他们的挖矿中赚取REC。',
    commissionRates:'佣金率', typeLabel:'类型',
    miningLabel:'⛏️ 挖矿', blockLabel:'🏆 区块',
    recEarned:'已赚取REC', friendsLabel:'朋友',
    rewardMilestones:'🎯 奖励里程碑',
    rankTitle:'🏆 排行榜', tabGlobal:'🌍 全球',
    tabFriends:'👥 好友', tabMyLevel:'📊 我的等级',
    myRankLabel:'您的全球排名', weeklyChallenge:'🏆 每周挑战',
    weeklyPrize:'奖励: 1,000 REC', daysLeft:'天剩余',
    loadingLeader:'⏳ 加载中...', noFriends:'您还没有邀请任何人',
    totalMined:'已挖REC总量', sinceJoined:'自加入以来',
    top100only:'仅前100名', rewardDist:'奖励分配',
    rankReward:'预计奖励',
    shopTitle:'星星商店', shopSubtitle:'支持项目并获得即时奖励!',
    shopNote:'⭐ 星星直接从Telegram购买',
    shopEnergy:'⚡ 即时充能', shopEnergyDesc:'完全补充您的能量',
    shopRecord500:'💰 500,000 RECORD', shopRecord500Desc:'立即添加到余额',
    shopRecord3m:'💰 3,000,000 RECORD', shopRecord3mDesc:'最佳价值 ⭐',
    shopSkip:'🚀 跳过等待时间', shopSkipDesc:'立即完成卡片升级',
    connectWallet:'连接钱包', walletTitle:'钱包', walletId:'ID',
    walletAssets:'资产', poolWallet:'Pool钱包',
    withdrawable:'可提现余额', walletControls:'操作',
    withdrawPool:'提取Pool', transferPool:'将Pool转入钱包',
    history:'历史', yourWithdrawals:'提现记录',
    walletOpen:'打开 →', walletSoon:'🔒 即将',
    withdrawTitle:'提取REC', withdrawSubtitle:'提取真实REC到钱包',
    withdrawBalance:'可用余额', withdrawMin:'最低',
    withdrawFee:'手续费', withdrawDaily:'今日剩余额度',
    withdrawAmount:'提现金额', withdrawBtn:'🏛️ 立即提取REC',
    withdrawReceive:'您将收到:', withdrawAfterFee:'扣除手续费后',
    withdrawSuccess:'✅ 已发送{n} REC!', withdrawNoWallet:'❌ 请先连接TON钱包!',
    withdrawLowBal:'❌ 余额不足',
    withdrawDailyErr:'❌ 已达日限额。剩余: {n} REC',
    withdrawFailed:'❌ 提现失败', withdrawLoading:'⏳ 发送中...',
    withdrawalBtn:'提现',
    comboTitle:'🎯 每日组合',
    comboSubtitle:'升级3张每日卡片并获得奖励！',
    comboReward:'每日奖励', comboClaim:'领取 +5 REC 🎉',
    comboClaimed:'✅ 今天已领取奖励！',
    comboLocked:'今天没有组合',
    comboAdmin:'选择组合卡片 - ADMIN',
    comboSave:'💾 保存每日组合',
    ppCardsUpgraded:'已升级卡片', ppRecSpeed:'REC速度',
    ppRecord:'RECORD', ppRecBalance:'REC余额',
    ppTotalTaps:'总点击', ppTasksDone:'已完成任务',
    ppFriends:'朋友', ppCardLevels:'卡片等级',
    ppNoCards:'还没有升级任何卡片',
    menuSupport:'支持', menuNews:'新闻',
    menuNewsDesc:'更新和公告', menuChat:'聊天',
    menuChatDesc:'社区聊天', menuPayouts:'支付',
    menuFaq:'FAQ和条款', menuFaqDesc:'规则和条件',
    support:'💬 技术支持 @Momokhli', comingSoon:'即将推出', locked:'已锁定',
    toastCopied:'✅ 链接已复制!', toastTask:'🎉 获得10,000 RECORD!',
    toastClaimed:'🎉 获得{n} REC!', toastNotMet:'尚未满足要求!',
    toastAlready:'任务已完成!',
    toastUpgradeStart:'⏳ 卡片升级开始!', toastUpgradeDone:'🎉 升级完成!',
    toastNotEnoughRecord:'RECORD不足!',
    toastAlreadyUpgrading:'卡片升级中!',
    toastInvoiceLoading:'⏳ 准备发票...',
    toastPaid:'✅ 支付成功!',
    toastCancelled:'已取消支付', toastFailed:'❌ 支付失败',
    toastConnError:'❌ 连接错误',
    recInfoTitle:'⚡ REC代币', recInfoSub:'如何赚取REC并提高挖矿速度',
    recAutoMining:'自动挖矿', recYourSpeed:'您当前速度:',
    recCardUpgrade:'卡片升级',
    recCardUpgradeDesc:'每次升级提高REC速度。限定卡×3。',
    recNormalCard:'普通卡 ×1', recLimitedCard:'限定卡 ⭐ ×3',
    recBlocks:'区块', recBlocksDesc:'每次点击都有机会获得大量REC奖励！',
    recDailyCombo:'每日组合',
    recDailyComboDesc:'升级3张每日秘密卡片，获得+5 REC。',
    recReferrals:'推荐', recReferralsDesc:'邀请朋友，从他们的挖矿中赚取佣金:',
    recTasks:'任务', recTasksDesc:'完成任务以获得额外REC。',
    recSpeedTip:'💡 提速建议',
    recTip1:'先升级限定卡（×3速度）',
    recTip2:'持续升级高级卡片',
    recTip3:'每天完成每日组合',
    recTip4:'邀请朋友获得持续佣金',
    recAutoMiningDesc:'挖矿卡每秒自动给你REC。',
    recordInfoTitle:'🔴 RECORD代币', recordInfoSub:'如何赚取RECORD及其作用',
    recordWhat:'什么是RECORD?', recordWhatSub:'主要挖矿货币',
    recordWhatDesc:'RECORD是用于升级卡片的主要货币。您的余额:',
    recordTapping:'点击圆圈', recordTappingSub:'最快的方法',
    recordTappingDesc:'每次点击获得RECORD。更多Tap Power = 每次更多。',
    recordTapPower:'升级Tap Power', recordMorePerTap:'↑ RECORD/次',
    recordEnergyUp:'升级能量', recordMoreTaps:'↑ 更多点击',
    recordAutoMining:'自动挖矿', recordAutoSub:'连续24/7',
    recordAutoDesc:'即使离线，卡片也会自动挖掘RECORD。',
    recordYourSpeed:'您的速度:', recordMystery:'神秘箱',
    recordMysterySub:'每天免费',
    recordMysteryDesc:'从Tasks部分免费打开每日神秘箱。',
    recordEnergyRefill:'能量充值', recordEnergyRefillSub:'每天两次免费',
    recordEnergyRefillDesc:'当能量耗尽时，每天可以免费充值两次。',
    recordHowSpend:'💡 如何使用RECORD?',
    recordSpend1:'🃏 升级挖矿卡片', recordSpend2:'⬆️ 升级点击力量',
    recordSpend3:'⚡ 扩展能量容量', recordSpend4:'⭐ 从商店购买限定卡',
    yourLevel:'您的当前级别', yourBalance:'您的余额:'
  }
};

var currentLang='ar';
try{var sl=localStorage.getItem('lang_'+saveKey);if(sl&&T[sl])currentLang=sl;}catch(e){}

function t(key,params){
  var tr=T[currentLang]||T.ar;
  var s=tr[key]!==undefined?tr[key]:(T.en[key]||T.ar[key]||key);
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
  return Math.floor(10000*Math.pow(1e10,lvl/99));
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
  dailyTasksData:{date:'',done:[],taps:0,upgrades:0,spent:0,sideDaily:'每日',sideRank:'排名',sideGames:'游戏',sideCombo:'组合',sideUpgrade:'升级',sideShop:'商店',navGames:'游戏',navWallet:'钱包',qbTasks:'任务',qbExchange:'兑换',qbSwap:'交换',recordLabel:'记录',recLabel:'REC',energyFull:'满能量',walletTitle:'钱包',walletId:'ID',comboTitle:'每日组合',comboSubtitle:'升级3张每日卡片并获得奖励！',comboReward:'每日奖励',comboClaim:'领取 +5 REC 🎉',comboClaimed:'✅ 今天已领取奖励！'},
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

// ====== REC INFO POPUP ======
function openRECInfo() {
  var ol = document.getElementById('recInfoOverlay');
  var pp = document.getElementById('recInfoPopup');
  if(!ol || !pp) return;

  pp.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<div style="font-size:17px;font-weight:900;color:#00FF88;font-family:Orbitron,sans-serif;">' + t('recInfoTitle') + '</div>' +
      '<div onclick="closeRECInfo()" style="width:30px;height:30px;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.4);font-size:13px;">✕</div>' +
    '</div>' +
    '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:20px;">' + t('recInfoSub') + '</div>' +

    _infoCard('#00FF88','⛏️', t('recAutoMining'), t('recAutoMining'),
      t('recAutoMiningDesc') + '<div style="margin-top:6px;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;font-family:Orbitron,sans-serif;font-size:10px;color:#00FF88;">' +
      t('recYourSpeed') + ' ' + recPerSec.toFixed(8) + ' REC/s</div>') +

    _infoCard('#AA66FF','🃏', t('recCardUpgrade'), t('recCardUpgrade'),
      t('recCardUpgradeDesc') +
      '<div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t('recNormalCard') + '</div><div style="font-size:12px;color:#AA66FF;font-weight:700;">×1</div></div>' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t('recLimitedCard') + '</div><div style="font-size:12px;color:#FFD700;font-weight:700;">×3</div></div>' +
      '</div>') +

    _infoCard('#FF6644','🏆', t('recBlocks'), '', t('recBlocksDesc')) +
    _infoCard('#FFD700','🎯', t('recDailyCombo'), '+5 REC', t('recDailyComboDesc')) +

    _infoCard('#44CCFF','👥', t('recReferrals'), '',
      t('recReferralsDesc') +
      '<div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:9px;color:rgba(255,255,255,0.3);">L1</div><div style="font-size:14px;color:#00FF88;font-weight:700;">8%</div></div>' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:9px;color:rgba(255,255,255,0.3);">L2</div><div style="font-size:14px;color:#44CCFF;font-weight:700;">2%</div></div>' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:9px;color:rgba(255,255,255,0.3);">L3</div><div style="font-size:14px;color:#AA66FF;font-weight:700;">1%</div></div>' +
      '</div>') +

    _infoCard('#FF66AA','✅', t('recTasks'), '', t('recTasksDesc')) +

    '<div style="background:rgba(255,200,0,0.08);border:1px solid rgba(255,200,0,0.25);border-radius:14px;padding:14px;">' +
      '<div style="font-size:12px;font-weight:700;color:#FFD700;margin-bottom:8px;">' + t('recSpeedTip') + '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.7;">١. ' + t('recTip1') + '<br>٢. ' + t('recTip2') + '<br>٣. ' + t('recTip3') + '<br>٤. ' + t('recTip4') + '</div>' +
    '</div>';

  ol.style.display = 'block';
  pp.style.display = 'block';
}

function closeRECInfo() {
  var ol = document.getElementById('recInfoOverlay');
  var pp = document.getElementById('recInfoPopup');
  if(ol) ol.style.display = 'none';
  if(pp) pp.style.display = 'none';
}

function openRECORDInfo() {
  var ol = document.getElementById('recordInfoOverlay');
  var pp = document.getElementById('recordInfoPopup');
  if(!ol || !pp) return;

  pp.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
      '<div style="font-size:17px;font-weight:900;color:#FF6644;font-family:Orbitron,sans-serif;">' + t('recordInfoTitle') + '</div>' +
      '<div onclick="closeRECORDInfo()" style="width:30px;height:30px;background:rgba(255,255,255,0.08);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.4);font-size:13px;">✕</div>' +
    '</div>' +
    '<div style="font-size:11px;color:rgba(255,255,255,0.3);margin-bottom:20px;">' + t('recordInfoSub') + '</div>' +

    _infoCard('#FF6644','🔴', t('recordWhat'), t('recordWhatSub'),
      t('recordWhatDesc') +
      '<div style="margin-top:6px;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;font-family:Orbitron,sans-serif;font-size:10px;color:#FF6644;">' +
      Math.floor(record).toLocaleString() + ' RECORD</div>') +

    _infoCard('#FF9933','👆', t('recordTapping'), t('recordTappingSub'),
      t('recordTappingDesc') +
      '<div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px;">' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t('recordTapPower') + '</div><div style="font-size:12px;color:#FF9933;font-weight:700;">' + t('recordMorePerTap') + '</div></div>' +
        '<div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:8px;text-align:center;"><div style="font-size:10px;color:rgba(255,255,255,0.3);">' + t('recordEnergyUp') + '</div><div style="font-size:12px;color:#FF9933;font-weight:700;">' + t('recordMoreTaps') + '</div></div>' +
      '</div>') +

    _infoCard('#FFD700','⚙️', t('recordAutoMining'), t('recordAutoSub'),
      t('recordAutoDesc') +
      '<div style="margin-top:6px;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;font-family:Orbitron,sans-serif;font-size:10px;color:#FFD700;">' +
      t('recordYourSpeed') + ' ' + recordPerSec.toFixed(8) + ' REC/s</div>') +

    _infoCard('#AA66FF','📦', t('recordMystery'), t('recordMysterySub'), t('recordMysteryDesc')) +
    _infoCard('#00CC66','⚡', t('recordEnergyRefill'), t('recordEnergyRefillSub'), t('recordEnergyRefillDesc')) +

    '<div style="background:rgba(255,215,0,0.06);border:1px solid rgba(255,215,0,0.2);border-radius:14px;padding:14px;">' +
      '<div style="font-size:12px;font-weight:700;color:#FFD700;margin-bottom:8px;">' + t('recordHowSpend') + '</div>' +
      '<div style="font-size:11px;color:rgba(255,255,255,0.5);line-height:1.7;">' +
        t('recordSpend1') + '<br>' + t('recordSpend2') + '<br>' + t('recordSpend3') + '<br>' + t('recordSpend4') +
      '</div>' +
    '</div>';

  ol.style.display = 'block';
  pp.style.display = 'block';
}

function closeRECORDInfo() {
  var ol = document.getElementById('recordInfoOverlay');
  var pp = document.getElementById('recordInfoPopup');
  if(ol) ol.style.display = 'none';
  if(pp) pp.style.display = 'none';
}

// Helper: build info card
function _infoCard(color, icon, title, sub, body) {
  return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px;margin-bottom:10px;">' +
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">' +
      '<div style="font-size:26px;">' + icon + '</div>' +
      '<div><div style="font-size:14px;font-weight:700;color:' + color + ';">' + title + '</div>' +
      (sub ? '<div style="font-size:10px;color:rgba(255,255,255,0.4);">' + sub + '</div>' : '') +
      '</div></div>' +
    '<div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">' + body + '</div>' +
  '</div>';
}
// ====== END INFO POPUPS ======

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
  if(claimArea) claimArea.style.display = (d.allDone && !d.rewardClaimed) ? 'block' : 'none';
  if(claimed) claimed.style.display = d.rewardClaimed ? 'block' : 'none';

  // Update badge on home
  var badge = document.getElementById('comboDotBadge');
  if(badge) badge.style.display = (d.exists && !d.allDone) ? 'block' : 'none';
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
  if(!tgUser) { showToast('❌ No tgUser'); return; }
  if(String(tgUser.id) !== String(ADMIN_TG_ID)) { showToast('❌ Not admin: '+tgUser.id); return; }
  var cards = [];
  for(var i=0;i<3;i++) {
    var sel = document.getElementById('adminComboSlot_'+i);
    if(!sel) { showToast('❌ Select '+i+' not found'); return; }
    if(!sel.value) { showToast('❌ اختر بطاقة '+(i+1)); return; }
    var parts = sel.value.split('|');
    if(parts.length < 3) { showToast('❌ قيمة خاطئة: '+sel.value); return; }
    cards.push({ key: parts[0], categoryIndex: parseInt(parts[1]), cardIndex: parseInt(parts[2]) });
  }
  if(cards[0].key===cards[1].key || cards[1].key===cards[2].key || cards[0].key===cards[2].key) {
    showToast('❌ لا تكرر نفس البطاقة'); return;
  }
  showToast('⏳ جاري الحفظ...');
  fetch('/api/combo/set', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ adminId: parseInt(tgUser.id), cards })
  }).then(function(r){ return r.json(); })
  .then(function(d){
    if(d.success) { showToast('✅ تم حفظ الكومبو! ' + d.date); loadComboData(); }
    else showToast('❌ ' + JSON.stringify(d));
  }).catch(function(e){ showToast('❌ Fetch error: '+e.message); });
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
    { icon:'⛏️', label:t('ppCardsUpgraded'), val: upgradedCards+' / '+totalCards, color:'#AA66FF' },
    { icon:'⚡', label:t('ppRecSpeed'), val: speed+'/s', color:'#00FF88' },
    { icon:'🔴', label:t('ppRecord'), val: Math.floor(record).toLocaleString(), color:'#FF6644' },
    { icon:'💚', label:t('ppRecBalance'), val: rec.toFixed(4), color:'#00FF88' },
    { icon:'👆', label:t('ppTotalTaps'), val: (totalTaps||0).toLocaleString(), color:'#FFD700' },
    { icon:'✅', label:t('ppTasksDone'), val: tasksDone, color:'#44FFAA' },
    { icon:'👥', label:t('friendsLabel'), val: refCount, color:'#44CCFF' },
    { icon:'📈', label:t('ppCardLevels'), val: totalCardLevels, color:'#FF8844' },
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
