require('dotenv').config({ path: './src/.env' });
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  image_url: String,
  is_deleted: Boolean,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // Get all products with Kaha URLs (without populate to avoid schema error)
  const products = await Product.find({ is_deleted: false }).sort({ name: 1 });
  
  console.log(`📊 Total products: ${products.length}\n`);
  
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name}`);
    console.log(`   Main image: ${product.image_url?.substring(0, 80)}...`);
    console.log(`   Images array: ${product.images?.length || 0} images`);
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, i) => {
        console.log(`      [${i + 1}] ${img.substring(0, 80)}...`);
      });
    }
    console.log('');
  });

  await mongoose.connection.close();
}

main();
