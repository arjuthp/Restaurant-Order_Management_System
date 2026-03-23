const mongoose = require('mongoose');
require('dotenv').config({ path: './src/.env' });

async function checkCart() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Cart = require('./src/models/cart.model');
    const User = require('./src/models/user.model');
    
    // Find user by email
    const user = await User.findOne({ email: 'thpanuska@gmail.com' });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('\n✅ User found:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user._id}`);
    
    // Find cart for this user
    const cart = await Cart.findOne({ user_id: user._id }).populate('items.product_id');
    
    if (!cart) {
      console.log('\n❌ No cart found for this user');
      console.log('   This is why order placement fails!');
    } else {
      console.log('\n✅ Cart found:');
      console.log(`   Cart ID: ${cart._id}`);
      console.log(`   Items count: ${cart.items.length}`);
      
      if (cart.items.length === 0) {
        console.log('\n⚠️  Cart exists but is EMPTY');
        console.log('   This is why order placement fails!');
      } else {
        console.log('\n   Items in cart:');
        cart.items.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.product_id?.name || 'Unknown'}`);
          console.log(`      - Quantity: ${item.quantity}`);
          console.log(`      - Unit Price: $${item.unit_price}`);
          console.log(`      - Product ID: ${item.product_id?._id || 'Missing'}`);
        });
      }
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCart();
