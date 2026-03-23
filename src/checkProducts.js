require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product.model');

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...\n');

    const products = await Product.find().sort({ category: 1, name: 1 });
    
    console.log(`📦 Total Products in Database: ${products.length}\n`);
    
    // Group by category
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    // Display by category
    Object.keys(categories).sort().forEach(category => {
      console.log(`\n🍽️  ${category.toUpperCase()} (${categories[category].length} items)`);
      console.log('─'.repeat(60));
      categories[category].forEach(product => {
        const status = product.is_available ? '✅' : '❌';
        console.log(`${status} ${product.name.padEnd(35)} Rs. ${product.price}`);
      });
    });

    console.log('\n' + '═'.repeat(60));
    console.log(`✅ Total: ${products.length} products found in database`);
    console.log('═'.repeat(60) + '\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error checking products:', error);
    mongoose.connection.close();
  }
}

checkProducts();
