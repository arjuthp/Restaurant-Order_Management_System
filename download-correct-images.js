#!/usr/bin/env node

/**
 * Download CORRECT images from Unsplash API
 * Requires Unsplash API key
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Get your FREE API key from: https://unsplash.com/developers
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_KEY_HERE';
const UPLOAD_DIR = path.join(__dirname, 'src', 'uploads', 'products');

// Ensure directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Product list with CORRECT search terms
const products = [
  { name: 'aloo-sadeko', search: 'nepali potato salad spicy' },
  { name: 'aloo-tama-bodi', search: 'nepali curry bamboo shoots' },
  { name: 'bbq-chicken-pizza', search: 'bbq chicken pizza' },
  { name: 'bbq-pork-ribs', search: 'bbq pork ribs' },
  { name: 'buff-choila', search: 'grilled meat spicy nepali' },
  { name: 'buff-momo', search: 'momo dumplings steamed' },
  { name: 'caesar-salad', search: 'caesar salad' },
  { name: 'cheesecake', search: 'cheesecake slice' },
  { name: 'chicken-choila', search: 'grilled chicken spicy' },
  { name: 'chicken-momo', search: 'chicken dumplings momo' },
  { name: 'chicken-wings', search: 'chicken wings buffalo' },
  { name: 'chocolate-lava-cake', search: 'chocolate lava cake molten' },
  { name: 'choila-pasta', search: 'spicy pasta' },
  { name: 'classic-beef-burger', search: 'beef burger cheeseburger' },
  { name: 'cold-coffee', search: 'iced coffee cold brew' },
  { name: 'dal-bhat-risotto', search: 'creamy risotto' },
  { name: 'dal-bhat-set', search: 'dal bhat nepali thali' },
  { name: 'french-fries', search: 'french fries crispy' },
  { name: 'fresh-juice', search: 'fresh fruit juice' },
  { name: 'fried-momo', search: 'fried dumplings crispy' },
  { name: 'grilled-chicken-sandwich', search: 'grilled chicken sandwich' },
  { name: 'grilled-salmon-fillet', search: 'grilled salmon fillet' },
  { name: 'gulab-jamun-with-ice-cream', search: 'gulab jamun dessert' },
  { name: 'gundruk-soup', search: 'nepali soup traditional' },
  { name: 'jhol-momo', search: 'momo soup jhol' },
  { name: 'lassi', search: 'lassi mango yogurt drink' },
  { name: 'loaded-fries', search: 'loaded fries cheese' },
  { name: 'margherita-pizza', search: 'margherita pizza' },
  { name: 'masala-chai', search: 'masala chai tea' },
  { name: 'mineral-water', search: 'water bottle mineral' },
  { name: 'momo-quesadilla', search: 'quesadilla cheese' },
  { name: 'momo-soup-ramen', search: 'ramen noodle soup' },
  { name: 'nimbu-pani', search: 'lemonade fresh' },
  { name: 'onion-rings', search: 'onion rings crispy' },
  { name: 'sekuwa-platter', search: 'grilled meat skewers' },
  { name: 'sekuwa-tacos', search: 'grilled meat tacos' },
  { name: 'sel-roti-with-achar', search: 'nepali rice donut' },
  { name: 'sikarni', search: 'yogurt dessert sweet' },
  { name: 'soft-drink', search: 'soda bottles drinks' },
  { name: 'spaghetti-bolognese', search: 'spaghetti bolognese' },
  { name: 'spring-rolls', search: 'spring rolls crispy' },
  { name: 'thakali-khana-set', search: 'nepali food platter' },
  { name: 'timur-pepper-chicken-burger', search: 'spicy chicken burger' },
  { name: 'yomari', search: 'sweet dumpling nepali' }
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

function searchUnsplash(query, count = 3) {
  return new Promise((resolve, reject) => {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
    
    const options = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    };

    https.get(url, options, (response) => {
      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => {
        if (response.statusCode === 200) {
          const result = JSON.parse(data);
          resolve(result.results || []);
        } else {
          reject(new Error(`API Error: ${response.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('\n🖼️  Downloading CORRECT Images from Unsplash\n');
  console.log('═'.repeat(60) + '\n');

  if (UNSPLASH_ACCESS_KEY === 'YOUR_KEY_HERE') {
    console.log('❌ Please set UNSPLASH_ACCESS_KEY\n');
    console.log('Get FREE key from: https://unsplash.com/developers\n');
    console.log('Then run:');
    console.log('export UNSPLASH_ACCESS_KEY="your_key_here"');
    console.log('node download-correct-images.js\n');
    process.exit(1);
  }

  let totalDownloaded = 0;
  let totalFailed = 0;

  for (const product of products) {
    console.log(`\n📸 ${product.name}`);
    console.log(`   Search: "${product.search}"`);

    try {
      const images = await searchUnsplash(product.search, 3);
      
      if (images.length === 0) {
        console.log(`   ⚠️  No images found`);
        totalFailed += 3;
        continue;
      }

      for (let i = 0; i < Math.min(images.length, 3); i++) {
        const imageUrl = images[i].urls.regular;
        const filename = `${product.name}-${i + 1}.jpg`;
        const filepath = path.join(UPLOAD_DIR, filename);

        try {
          await downloadImage(imageUrl, filepath);
          console.log(`   ✅ ${filename}`);
          totalDownloaded++;
          await delay(1000);
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
