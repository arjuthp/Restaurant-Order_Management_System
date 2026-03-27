#!/usr/bin/env node

/**
 * Download Product Images - No Authentication Required
 * Uses Lorem Picsum and Foodish API (no API key needed)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, 'src', 'uploads', 'products');
const IMAGES_PER_PRODUCT = 3;

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Product list with image dimensions
const products = [
  // Nepali
  'chicken-momo', 'buff-momo', 'fried-momo', 'jhol-momo',
  'dal-bhat-set', 'thakali-khana-set', 'chicken-choila', 'buff-choila',
  'sekuwa-platter', 'aloo-tama-bodi', 'gundruk-soup', 'sel-roti-with-achar',
  // Fusion
  'momo-quesadilla', 'sekuwa-tacos', 'choila-pasta',
  'dal-bhat-risotto', 'timur-pepper-chicken-burger', 'momo-soup-ramen',
  // Western
  'margherita-pizza', 'bbq-chicken-pizza', 'classic-beef-burger',
  'grilled-chicken-sandwich', 'spaghetti-bolognese', 'grilled-salmon-fillet',
  'bbq-pork-ribs', 'caesar-salad',
  // Snacks
  'french-fries', 'loaded-fries', 'chicken-wings',
  'onion-rings', 'aloo-sadeko', 'spring-rolls',
  // Desserts
  'chocolate-lava-cake', 'sikarni', 'yomari',
  'cheesecake', 'gulab-jamun-with-ice-cream',
  // Drinks
  'lassi', 'nimbu-pani', 'masala-chai',
  'cold-coffee', 'fresh-juice', 'soft-drink', 'mineral-water'
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
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

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    });

    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function downloadFoodishImage(productSlug, imageNum) {
  const filepath = path.join(UPLOAD_DIR, `${productSlug}-${imageNum}.jpg`);
  
  // Use Foodish API - returns random food images
  const url = 'https://foodish-api.com/api/';
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', chunk => data += chunk);
      
      response.on('end', async () => {
        try {
          const json = JSON.parse(data);
          if (json.image) {
            await downloadImage(json.image, filepath);
            resolve(filepath);
          } else {
            reject(new Error('No image URL'));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function downloadPlaceholderImage(productSlug, imageNum) {
  // Fallback: Use Lorem Picsum for food-styled placeholder
  const width = 800;
  const height = 600;
  const seed = `${productSlug}-${imageNum}`;
  const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  const filepath = path.join(UPLOAD_DIR, `${productSlug}-${imageNum}.jpg`);
  
  await downloadImage(url, filepath);
  return filepath;
}

async function main() {
  console.log('\n🖼️  Downloading Product Images (No Auth Required)\n');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`📁 Saving to: ${UPLOAD_DIR}\n`);
  console.log(`📊 Products: ${products.length}`);
  console.log(`📊 Images per product: ${IMAGES_PER_PRODUCT}`);
  console.log(`📊 Total images: ${products.length * IMAGES_PER_PRODUCT}\n`);
  console.log('Starting download...\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] ${product}`);

    for (let imgNum = 1; imgNum <= IMAGES_PER_PRODUCT; imgNum++) {
      try {
        // Try Foodish API first (real food images)
        await downloadFoodishImage(product, imgNum);
        process.stdout.write(`  ✅ Image ${imgNum} `);
        successCount++;
        await delay(500); // Rate limiting
      } catch (err) {
        try {
          // Fallback to placeholder
          await downloadPlaceholderImage(product, imgNum);
          process.stdout.write(`  ⚠️  Image ${imgNum} (placeholder) `);
          successCount++;
        } catch (err2) {
          process.stdout.write(`  ❌ Image ${imgNum} failed `);
          failCount++;
        }
      }
    }
    console.log(''); // New line after each product
  }

  console.log('\n' + '═'.repeat(50));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(50));
  console.log(`✅ Successfully downloaded: ${successCount} images`);
  console.log(`❌ Failed: ${failCount} images`);
  console.log(`📁 Location: ${UPLOAD_DIR}`);
  console.log('\n✨ Done!\n');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
