// ============================================
// REC Cameras - NFT Batch Minter
// Add this file to your project root
// Then add the route below to bot.js
// ============================================

const { TonClient, WalletContractV4, internal, toNano, beginCell, Address } = require('@ton/ton');
const { mnemonicToPrivateKey } = require('@ton/crypto');
const axios = require('axios');

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const COLLECTION_ADDRESS = 'EQC_gZR0JaGya8i_P9Lj4VZyfK3pnU5sYp9sJJpVUALYVhoV';
const PINATA_API_KEY     = process.env.PINATA_API_KEY    || '';
const PINATA_SECRET      = process.env.PINATA_SECRET     || '';
const TON_MNEMONIC       = process.env.TON_MNEMONIC      || ''; // 24 words
const TONCENTER_API_KEY  = process.env.TONCENTER_API_KEY || '';

// ─── NFT TYPES ────────────────────────────────────────────────────────────────
// Already minted manually: Crystal(1), Neon(1), Shadow(1), Inferno(1) = index 0-3
// New minting starts at index 4
const NFT_TYPES = [
  {
    name: 'Crystal',
    imageCID: 'bafkreidnvzqtchhhm4a4y4oyzewwdav63tz2farry24npm4in5axnpuy3a',
    description: 'Forged from pure crystal. The rarest REC Camera ever created. Holders get ×10 Mining Speed in REC Mining Bot.',
    attributes: [
      { trait_type: 'Boost',  value: '×10 Mining Speed' },
      { trait_type: 'Rarity', value: 'Mythic' },
      { trait_type: 'Type',   value: 'Crystal Camera' }
    ],
    boost: 10,
    count: 50
  },
  {
    name: 'Inferno',
    imageCID: 'bafybeicf65yugcyej7any6hhpwjh2jkcr4gdfffyne47vgbh6awaxfsxnm',
    description: 'Born from fire. The Inferno Camera burns through limits. Holders get ×5 Mining Speed in REC Mining Bot.',
    attributes: [
      { trait_type: 'Boost',  value: '×5 Mining Speed' },
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Type',   value: 'Inferno Camera' }
    ],
    boost: 5,
    count: 50
  },
  {
    name: 'Shadow',
    imageCID: 'bafkreieoi22ey7tnb7je46ejiojwnyay3xtw4vocbefx74csbn7lgpp7yu',
    description: 'Silent and powerful. The Shadow camera operates in the dark, mining REC around the clock. Holders get ×3 Mining Speed in REC Mining Bot.',
    attributes: [
      { trait_type: 'Boost',  value: '×3 Mining Speed' },
      { trait_type: 'Rarity', value: 'Uncommon' },
      { trait_type: 'Type',   value: 'Shadow Camera' }
    ],
    boost: 3,
    count: 50
  },
  {
    name: 'Neon',
    imageCID: 'bafkreidaiud3b34n53hhxdryygo7ob2ox3i62fzbbwjqt6yjad326ayyda',
    description: 'The entry point to the REC universe. Connect your camera, start mining. Holders get ×4 Mining Speed in REC Mining Bot.',
    attributes: [
      { trait_type: 'Boost',  value: '×4 Mining Speed' },
      { trait_type: 'Rarity', value: 'Rare' },
      { trait_type: 'Type',   value: 'Neon Camera' }
    ],
    boost: 4,
    count: 50
  }
];

// ─── UPLOAD METADATA TO PINATA ───────────────────────────────────────────────
async function uploadMetadata(metadata) {
  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    metadata,
    {
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET,
        'Content-Type': 'application/json'
      }
    }
  );
  return res.data.IpfsHash; // CID
}

// ─── MINT ONE NFT ON TON ─────────────────────────────────────────────────────
async function mintNFT(client, wallet, keyPair, itemIndex, metadataCID, ownerAddress) {
  const metadataUrl = `https://ipfs.io/ipfs/${metadataCID}`;

  // NFT content cell (off-chain URL)
  const nftContent = beginCell()
    .storeUint(0x01, 8) // off-chain
    .storeStringTail(metadataUrl)
    .endCell();

  // NFT item init data
  const nftItemData = beginCell()
    .storeAddress(Address.parse(ownerAddress))
    .storeRef(nftContent)
    .endCell();

  // Mint message body
  const mintBody = beginCell()
    .storeUint(1, 32)           // op: deploy_nft_item
    .storeUint(Date.now(), 64)  // query_id
    .storeUint(itemIndex, 64)   // item index
    .storeCoins(toNano('0.05')) // amount for NFT storage
    .storeRef(nftItemData)
    .endCell();

  const seqno = await wallet.getSeqno();

  await wallet.sendTransfer({
    secretKey: keyPair.secretKey,
    seqno,
    messages: [
      internal({
        to: Address.parse(COLLECTION_ADDRESS),
        value: toNano('0.07'), // 0.05 for NFT + 0.02 for fees
        body: mintBody
      })
    ]
  });

  // Wait 15 seconds between mints to avoid overload
  await new Promise(r => setTimeout(r, 15000));
}

// ─── MAIN MINT FUNCTION ───────────────────────────────────────────────────────
async function mintAllNFTs(log) {
  if (!TON_MNEMONIC) return { error: 'TON_MNEMONIC not set in Render env vars' };
  if (!PINATA_API_KEY) return { error: 'PINATA_API_KEY not set' };
  if (!PINATA_SECRET) return { error: 'PINATA_SECRET not set' };

  // Connect to TON
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: TONCENTER_API_KEY
  });

  // Load wallet
  const mnemonicArray = TON_MNEMONIC.trim().split(' ');
  const keyPair = await mnemonicToPrivateKey(mnemonicArray);
  const wallet = client.open(
    WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 })
  );
  const ownerAddress = wallet.address.toString({ bounceable: false });
  log(`✅ Wallet loaded: ${ownerAddress}`);

  let itemIndex = 4; // Start after 4 manually created NFTs
  let totalMinted = 0;
  const results = [];

  for (const nftType of NFT_TYPES) {
    log(`\n🎯 Minting ${nftType.count}x ${nftType.name} Camera...`);

    for (let i = 1; i <= nftType.count; i++) {
      try {
        // 1. Create metadata JSON
        const metadata = {
          name: `REC Camera: ${nftType.name} #${i}`,
          description: nftType.description,
          image: `https://ipfs.io/ipfs/${nftType.imageCID}`,
          attributes: nftType.attributes
        };

        // 2. Upload to Pinata
        const metadataCID = await uploadMetadata(metadata);
        log(`  [${i}/${nftType.count}] Metadata uploaded: ${metadataCID}`);

        // 3. Mint on TON
        await mintNFT(client, wallet, keyPair, itemIndex, metadataCID, ownerAddress);
        log(`  [${i}/${nftType.count}] ✅ Minted index #${itemIndex}`);

        itemIndex++;
        totalMinted++;
        results.push({ index: itemIndex - 1, type: nftType.name, number: i });

      } catch (err) {
        log(`  ❌ Error at ${nftType.name} #${i}: ${err.message}`);
        results.push({ index: itemIndex, type: nftType.name, number: i, error: err.message });
        itemIndex++;
      }
    }
  }

  return { success: true, totalMinted, results };
}

module.exports = { mintAllNFTs };
