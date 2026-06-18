// ====== NFT PAGE ======

var NFT_DATA = [
  {
    id: 'shadow',
    name: 'REC Camera: Shadow',
    rarity: 'Uncommon',
    rarityColor: '#66CC66',
    rarityBg: 'rgba(100,200,100,0.12)',
    boost: '×3',
    price: '3',
    description: 'Silent and powerful. The Shadow camera operates in the dark, mining REC around the clock.',
    image: 'https://ipfs.io/ipfs/bafkreieoi22ey7tnb7je46ejiojwnyay3xtw4vocbefx74csbn7lgpp7yu',
    url: 'https://getgems.io/collection/EQC_gZR0JaGya8i_P9Lj4VZyfK3pnU5sYp9sJJpVUALYVhoV/EQAPhUrnqedcEe7RNJiIxkey21_z-So9xO12jDBffinbCPX-'
  },
  {
    id: 'neon',
    name: 'REC Camera: Neon',
    rarity: 'Rare',
    rarityColor: '#6699FF',
    rarityBg: 'rgba(100,100,255,0.12)',
    boost: '×4',
    price: '2',
    description: 'The entry point to the REC universe. Connect your camera, start mining.',
    image: 'https://ipfs.io/ipfs/bafkreidaiud3b34n53hhxdryygo7ob2ox3i62fzbbwjqt6yjad326ayyda',
    url: 'https://getgems.io/collection/EQC_gZR0JaGya8i_P9Lj4VZyfK3pnU5sYp9sJJpVUALYVhoV/EQBNpwBS0LTwprDCuMtcfdeFdm_urAtkSZjJoyrmYfV2DqCo'
  },
  {
    id: 'inferno',
    name: 'REC Camera: Inferno',
    rarity: 'Legendary',
    rarityColor: '#FFAA00',
    rarityBg: 'rgba(255,165,0,0.12)',
    boost: '×5',
    price: '5',
    description: 'Born from fire. The Inferno Camera burns through limits and mines at legendary speed.',
    image: 'https://ipfs.io/ipfs/bafybeicf65yugcyej7any6hhpwjh2jkcr4gdfffyne47vgbh6awaxfsxnm',
    url: 'https://getgems.io/collection/EQC_gZR0JaGya8i_P9Lj4VZyfK3pnU5sYp9sJJpVUALYVhoV/EQDLk0aUz0ZocdD1M2KjVOmxTBvl1XibXBTei9PAO4_pGI4g'
  },
  {
    id: 'crystal',
    name: 'REC Camera: Crystal',
    rarity: 'Mythic',
    rarityColor: '#CC44FF',
    rarityBg: 'rgba(200,0,255,0.12)',
    boost: '×10',
    price: '18',
    description: 'Forged from pure crystal. The rarest REC Camera ever created.',
    image: 'https://ipfs.io/ipfs/bafkreidnvzqtchhhm4a4y4oyzewwdav63tz2farry24npm4in5axnpuy3a',
    url: 'https://getgems.io/collection/EQC_gZR0JaGya8i_P9Lj4VZyfK3pnU5sYp9sJJpVUALYVhoV/EQBFw_-3113QQFrST0roZMYbjtgER8RchlbmIH7Y0bPTt8PD'
  }
];

var COLLECTION_URL = 'https://getgems.io/collection/EQC_gZR0JaGya8i_P9Lj4VZyfK3pnU5sYp9sJJpVUALYVhoV';
var TONCENTER_API = 'https://toncenter.com/api/v2/getAddressBalance';

function renderNFTPage() {
  var isConnected = typeof tonConnect !== 'undefined' && tonConnect && tonConnect.connected;
  var walletAddr = '';
  if (isConnected && tonConnect.account) walletAddr = rawToFriendly(tonConnect.account.address);
  var shortAddr = walletAddr ? walletAddr.slice(0,6)+'...'+walletAddr.slice(-4) : '';

  var html = '<div style="padding:0 0 20px;">';

  // Top bar
  html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px 10px;">';
  html += '<div style="font-family:Orbitron,sans-serif;font-size:16px;font-weight:700;color:#fff;letter-spacing:2px;">📷 NFT</div>';
  if (isConnected) {
    html += '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">';
    html += '<div style="font-size:11px;color:#00FF88;font-weight:700;">'+shortAddr+'</div>';
    html += '<div style="font-size:10px;color:rgba(255,255,255,0.35);" id="nft-ton-balance">loading...</div>';
    html += '</div>';
  } else {
    html += '<button onclick="connectWalletNFT()" style="background:linear-gradient(135deg,#1144AA,#4B9EFF);border:none;color:white;padding:8px 16px;border-radius:20px;cursor:pointer;font-size:12px;font-weight:700;font-family:Rajdhani,sans-serif;">Connect Wallet</button>';
  }
  html += '</div>';

  // Stats bar
  html += '<div style="display:flex;padding:10px 16px;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);margin-bottom:2px;">';
  html += '<div style="flex:1;text-align:center;"><div style="font-family:Orbitron,sans-serif;font-size:12px;font-weight:700;">4</div><div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:2px;">items</div></div>';
  html += '<div style="flex:1;text-align:center;"><div style="font-family:Orbitron,sans-serif;font-size:12px;font-weight:700;">2 TON</div><div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:2px;">floor price</div></div>';
  html += '<div style="flex:1;text-align:center;"><div style="font-family:Orbitron,sans-serif;font-size:12px;font-weight:700;">×3–×10</div><div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:2px;">mining boost</div></div>';
  html += '</div>';

  // Grid
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,0.06);margin-top:1px;">';
  NFT_DATA.forEach(function(nft) {
    html += '<div onclick="openNFTDetail(\''+nft.id+'\')" style="background:#0d0d0d;cursor:pointer;" ontouchstart="this.style.opacity=0.75" ontouchend="this.style.opacity=1">';
    html += '<img src="'+nft.image+'" style="width:100%;aspect-ratio:1/1;object-fit:cover;display:block;" alt="'+nft.name+'">';
    html += '<div style="padding:10px 10px 12px;">';
    html += '<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-bottom:3px;">REC Cameras</div>';
    html += '<div style="display:inline-block;font-size:9px;padding:2px 8px;border-radius:20px;font-weight:700;margin-bottom:5px;background:'+nft.rarityBg+';color:'+nft.rarityColor+';border:1px solid '+nft.rarityColor+'44;">'+nft.rarity+'</div>';
    html += '<div style="font-size:13px;font-weight:600;color:#fff;margin-bottom:6px;line-height:1.2;">'+nft.name+'</div>';
    html += '<div style="display:flex;align-items:center;gap:5px;">';
    html += '<div style="width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#0088cc,#00aeff);display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;font-weight:900;">◆</div>';
    html += '<span style="font-family:Orbitron,sans-serif;font-size:13px;font-weight:700;">'+nft.price+'</span>';
    html += '</div>';
    html += '</div></div>';
  });
  html += '</div>';

  // Collection link
  html += '<div onclick="openCollectionStore()" style="margin:14px 16px 0;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px 16px;cursor:pointer;">';
  html += '<div><div style="font-size:14px;font-weight:700;color:#fff;">🏪 REC Cameras Store</div><div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px;">View full collection on Getgems</div></div>';
  html += '<div style="color:rgba(255,255,255,0.4);font-size:18px;">›</div>';
  html += '</div>';

  html += '</div>';

  document.getElementById('nftPageContent').innerHTML = html;

  // Load TON balance if connected
  if (isConnected && walletAddr) loadTonBalance(walletAddr);
}

function loadTonBalance(addr) {
  var apiKey = '';
  try { apiKey = typeof TONCENTER_KEY !== 'undefined' ? TONCENTER_KEY : ''; } catch(e) {}
  fetch('https://toncenter.com/api/v2/getAddressBalance?address='+addr+(apiKey?'&api_key='+apiKey:''))
    .then(function(r){ return r.json(); })
    .then(function(data) {
      var el = document.getElementById('nft-ton-balance');
      if (!el) return;
      if (data && data.result) {
        var ton = (parseInt(data.result) / 1e9).toFixed(2);
        el.textContent = ton + ' TON';
      }
    }).catch(function(){});
}

function openNFTDetail(id) {
  var nft = NFT_DATA.find(function(n){ return n.id === id; });
  if (!nft) return;

  var html = '';
  // Back button
  html += '<div style="display:flex;align-items:center;gap:10px;padding:14px 16px 0;">';
  html += '<div onclick="closeNFTDetail()" style="cursor:pointer;padding:6px;"><span style="font-size:20px;color:rgba(255,255,255,0.7);">‹</span></div>';
  html += '<div style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.7);">'+nft.name+'</div>';
  html += '</div>';

  // Image
  html += '<img src="'+nft.image+'" style="width:100%;aspect-ratio:1/1;object-fit:cover;display:block;margin-top:10px;" alt="'+nft.name+'">';

  // Info
  html += '<div style="padding:16px;">';

  // Name + Rarity
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
  html += '<div style="font-family:Orbitron,sans-serif;font-size:16px;font-weight:700;color:#fff;">'+nft.name+'</div>';
  html += '<div style="font-size:10px;padding:3px 10px;border-radius:20px;font-weight:700;background:'+nft.rarityBg+';color:'+nft.rarityColor+';border:1px solid '+nft.rarityColor+'44;">'+nft.rarity+'</div>';
  html += '</div>';

  // Price
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">';
  html += '<div style="width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,#0088cc,#00aeff);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:900;">◆</div>';
  html += '<span style="font-family:Orbitron,sans-serif;font-size:22px;font-weight:900;color:#fff;">'+nft.price+' TON</span>';
  html += '</div>';

  // Description
  html += '<div style="font-size:13px;color:rgba(255,255,255,0.55);line-height:1.5;margin-bottom:16px;">'+nft.description+'</div>';

  // Attributes
  html += '<div style="font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:2px;margin-bottom:10px;">ATTRIBUTES</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">';

  var attrs = [
    { label:'Type', value:nft.name.replace('REC Camera: ','') },
    { label:'Rarity', value:nft.rarity },
    { label:'Boost', value:nft.boost+' Mining Speed' },
    { label:'Collection', value:'REC Cameras' }
  ];
  attrs.forEach(function(a) {
    html += '<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px;text-align:center;">';
    html += '<div style="font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:4px;">'+a.label+'</div>';
    html += '<div style="font-size:13px;font-weight:700;color:'+nft.rarityColor+';">'+a.value+'</div>';
    html += '</div>';
  });
  html += '</div>';

  // Buy button
  html += '<button onclick="buyNFT(\''+nft.id+'\')" style="width:100%;padding:16px;background:linear-gradient(135deg,#CC0000,#FF3300);border:none;border-radius:14px;color:#fff;font-family:Orbitron,sans-serif;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:1px;margin-bottom:10px;">🛒 BUY NOW · '+nft.price+' TON</button>';

  html += '</div>';

  document.getElementById('nftDetailContent').innerHTML = html;
  document.getElementById('nftDetail').style.display = 'block';
  document.getElementById('nftPageContent').style.display = 'none';
}

function closeNFTDetail() {
  document.getElementById('nftDetail').style.display = 'none';
  document.getElementById('nftPageContent').style.display = 'block';
}

function buyNFT(id) {
  var nft = NFT_DATA.find(function(n){ return n.id === id; });
  if (!nft) return;
  if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    window.Telegram.WebApp.openLink(nft.url);
  } else {
    window.open(nft.url, '_blank');
  }
}

function openCollectionStore() {
  if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    window.Telegram.WebApp.openLink(COLLECTION_URL);
  } else {
    window.open(COLLECTION_URL, '_blank');
  }
}

function connectWalletNFT() {
  connectWallet();
  // Listen for wallet connection and refresh page
  var checkInterval = setInterval(function() {
    if (typeof tonConnect !== 'undefined' && tonConnect && tonConnect.connected) {
      clearInterval(checkInterval);
      setTimeout(function(){ renderNFTPage(); }, 500);
    }
  }, 500);
  // Stop checking after 30 seconds
  setTimeout(function(){ clearInterval(checkInterval); }, 30000);
}

function openNFTPage() {
  showPage('nft', null);
  renderNFTPage();
}
