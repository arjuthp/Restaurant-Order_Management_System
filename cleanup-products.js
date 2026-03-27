require('dotenv').config({ path: './src/.env' });
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  image_url: String,
  is_deleted: Boolean
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Products to KEEP (16 products with Kaha URLs)
const productsToKeep = [
  'Aloo Sadeko',
  'Aloo Tama Bodi',
  'BBQ Chicken Pizza',
  'BBQ Pork Ribs',
  'Buff Choila',
  'Buff Momo',
  'Caesar Salad',
  'Cheesecake',
  'Chicken Choila',
  'Chicken Momo',
  'Chicken Wings',
  'Chocolate Lava Cake',
  'Choila Pasta',
  'Classic Beef Burger',
  'Cold Coffee',
  'Dal Bhat Risotto'
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // Get all products
  const allProducts = await Product.find({ is_deleted: false });
  console.log(`📊 Total products in DB: ${allProducts.length}\n`);

  // Find products to delete
  const productsToDelete = allProducts.filter(p => !productsToKeep.includes(p.name));
  
  console.log(`🗑️  Products to DELETE (${productsToDelete.length}):`);
  productsToDelete.forEach(p => console.log(`   - ${p.name}`));
  
  console.log(`\n✅ Products to KEEP (${productsToKeep.length}):`);
  productsToKeep.forEach(name => console.log(`   - ${name}`));

  // Delete products not in the keep list
  const result = await Product.deleteMany({ 
    name: { $nin: productsToKeep },
    is_deleted: false 
  });

  console.log(`\n✨ Deleted ${result.deletedCount} products`);
  
  // Verify
  const remainingProducts = await Product.find({ is_deleted: false });
  console.log(`✅ Remaining products: ${remainingProducts.length}\n`);

  await mongoose.connection.close();
}

main();
