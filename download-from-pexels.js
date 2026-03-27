#!/usr/bin/env node

/**
 * Download images from Pexels API (no auth required for basic use)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, 'src', 'uploads', 'products');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Pexels API key (free tier)
const PEXELS_API_KEY = '563492ad6f91700001000001c4e7e3e5e4e04e5f9f5c5e5e5e5e5e5e';

const products = [
  { name: 'aloo-sadeko', search: 'potato salad' },
  { name: 'aloo-tama-bodi', search: 'curry vegetables' },
  { name: 'bbq-chicken-pizza', search: 'bbq chicken pizza' },
  { name: 'bbq-pork-ribs', search: 'bbq ribs' },
  { name: 'buff-choila', search: 'grilled meat' },
  { name: 'buff-momo', search: 'dumplings' },
  { name: 'caesar-salad', search: 'caesar salad' },
  { name: 'cheesecake', search: 'cheesecake' },
  { name: 'chicken-choila', search: 'grilled chicken' },
  { name: 'chicken-momo', search: 'dumplings steamed' },
  { name: 'chicken-wings', search: 'chicken wings' },
  { name: 'chocolate-lava-cake', search: 'chocolate cake' },
  { name: 'choila-pasta', search: 'pasta spicy' },
  { name: 'classic-beef-burger', search: 'beef burger' },
  { name: 'cold-coffee', search: 'iced coffee' },
  { name: 'dal-bhat-risotto', search: 'risotto' },
  { name: 'dal-bhat-set', search: 'rice curry meal' },
  { name: 'french-fries', search: 'french fries' },
  { name: 'fresh-juice', search: 'fruit juice' },
  { name: 'fried-momo', search: 'fried dumplings' },
  { name: 'grilled-chicken-sandwich', search: 'chicken sandwich' },
  { name: 'grilled-salmon-fillet', search: 'grilled salmon' },
  { name: 'gulab-jamun-with-ice-cream', search: 'dessert sweet' },
  { name: 'gundruk-soup', search: 'soup bowl' },
  { name: 'jhol-momo', search: 'soup dumplings' },
  { name: 'lassi', search: 'yogurt drink' },
  { name: 'loaded-fries', search: 'loaded fries' },
  { name: 'margherita-pizza', search: 'margherita pizza' },
  { name: 'masala-chai', search: 'tea cup' },
  { name: 'mineral-water', search: 'water bottle' },
  { name: 'momo-quesadilla', search: 'quesadilla' },
  { name: 'momo-soup-ramen', search: 'ramen noodles' },
  { name: 'nimbu-pani', search: 'lemonade' },
  { name: 'onion-rings', search: 'onion rings' },
  { name: 'sekuwa-platter', search: 'grilled meat skewers' },
  { name: 'sekuwa-tacos', search: 'tacos' },
  { name: 'sel-roti-with-achar', search: 'donut fried' },
  { name: 'sikarni', search: 'yogurt dessert' },
  { name: 'soft-drink', search: 'soda bottle' },
  { name: 'spaghetti-bolognese', search: 'spaghetti bolognese' },
  { name: 'spring-rolls', search: 'spring rolls' },
  { name: 'thakali-khana-set', search: 'rice meal platter' },
  { name: 'timur-pepper-chicken-burger', search: 'chicken burger' },
  { name: 'yomari', search: 'sweet dumpling' }
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

function searchPexels(query, perPage = 3) {
  return new Promise((resolve, reject) => {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
    
    const options = {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    };

    https.get(url, options, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        if (response.statusCode === 200) {
          const result = JSON.parse(data);
          resolve(result.photos || []);
        } else {
          reject(new Error(`API Error: ${response.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('\n🖼️  Downloading Images from Pexels\n');
  console.log('═'.repeat(60) + '\n');

  let totalDownloaded = 0;
  let totalFailed = 0;

  for (const product of products) {
    console.log(`\n📸 ${product.name}`);
    console.log(`   Search: "${product.search}"`);

    try {
      const photos = await searchPexels(product.search, 3);
      
      if (photos.length === 0) {
        console.log(`   ⚠️  No images found`);
        totalFailed += 3;
        continue;
      }

      for (let i = 0; i < Math.min(photos.length, 3); i++) {
        const imageUrl = photos[i].src.large;
        const filename = `${product.name}-${i + 1}.jpg`;
        const filepath = path.join(UPLOAD_DIR, filename);

        try {
          await downloadImage(imageUrl, filepath);
          console.log(`   ✅ ${filename}`);
          totalDownloaded++;
          await delay(500);
        } catch (err) {
          console.log(`   ❌ ${filename}: ${err.message}`);
          totalFailed++;
        }
      }
    } catch (err) {
      console.log(`   ❌ Search failed: ${err.message}`);
      totalFailed += 3;
    }
  }

  console.log('\n\n' + '═'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));
  console.log(`✅ Downloaded: ${totalDownloaded}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log('\n✨ Done!\n');
}

main();
