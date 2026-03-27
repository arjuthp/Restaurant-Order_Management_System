#!/usr/bin/env node

/**
 * Update Products with Local Image Paths
 * Maps downloaded images to products in database
 */

require('dotenv').config({ path: './src/.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Define Product schema inline
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: mongoose.Schema.Types.ObjectId,
  image_url: String,
  images: [String],
  is_available: Boolean,
  quantity: Number,
  low_stock_threshold: Number,
  track_inventory: Boolean,
  is_deleted: Boolean,
  deleted_at: Date
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const IMAGES_DIR = path.join(__dirname, 'src', 'uploads', 'products');

// Helper to slugify product names
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('\n📦 Updating Products with Local Image Paths\n');
  console.log('═══════════════════════════════════════════\n');

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Get all products
    const products = await Product.find({ is_deleted: false }).sort({ name: 1 });
    console.log(`📦 Found ${products.length} products in database\n`);

    let productsUpdated = 0;
    let productsSkipped = 0;

    for (const product of products) {
      const productSlug = slugify(product.name);
      console.log(`📸 Processing: ${product.name}`);
      console.log(`   Slug: ${productSlug}`);

      // Find all images for this product
      const imageFiles = fs.readdirSync(IMAGES_DIR)
        .filter(file => file.startsWith(productSlug) && /\.(jpg|jpeg|png)$/i.test(file))
        .sort();

      if (imageFiles.length === 0) {
        console.log(`   ⚠️  No images found\n`);
        productsSkipped++;
        continue;
      }

      console.log(`   Found ${imageFiles.length} images`);

      // Create image URLs (relative paths for serving)
      const imageUrls = imageFiles.map(file => `/uploads/products/${file}`);

      // Update product
      await Product.findByIdAndUpdate(product._id, {
        images: imageUrls,
        image_url: imageUrls[0] // Set first image as primary
      });

      console.log(`   ✅ Updated with ${imageUrls.length} images`);
      imageUrls.forEach((url, idx) => {
        console.log(`      ${idx + 1}. ${url}`);
      });
      console.log('');

      productsUpdated++;
    }

    // Summary
    console.log('\n' + '═'.repeat(50));
    console.log('📊 UPDATE SUMMARY');
    console.log('═'.repeat(50));
    console.log(`✅ Products updated: ${productsUpdated}`);
    console.log(`⚠️  Products skipped (no images): ${productsSkipped}`);
    console.log('\n✨ Done!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed\n');
  }
}

main();
