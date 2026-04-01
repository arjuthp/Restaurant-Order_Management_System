require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product.model');
const Category = require('./models/category.model');

// Step 1: Define Categories
const categories = [
  { 
    name: 'Nepali',
    slug: 'nepali',
    description: 'Traditional Nepali cuisine and authentic local dishes' 
  },
  { 
    name: 'Fusion',
    slug: 'fusion',
    description: 'Creative fusion dishes blending Nepali and international flavors' 
  },
  { 
    name: 'Western',
    slug: 'western',
    description: 'Classic Western dishes including pizza, pasta, burgers and more' 
  },
  { 
    name: 'Snacks',
    slug: 'snacks',
    description: 'Light bites, appetizers and finger foods' 
  },
  { 
    name: 'Desserts',
    slug: 'desserts',
    description: 'Sweet treats and traditional desserts' 
  },
  { 
    name: 'Drinks',
    slug: 'drinks',
    description: 'Beverages including traditional drinks, juices and soft drinks' 
  },
];

// Step 2: Define Products (will be linked to categories after creation)
const getProductsData = (categoryMap) => [
  // ======= NEPALI CLASSICS =======
  { 
    name: 'Chicken Momo', 
    category: categoryMap['Nepali'], 
    price: 280, 
    description: 'Steamed dumplings filled with spiced chicken, served with tomato achar', 
    is_available: true,
    quantity: 50,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Buff Momo', 
    category: categoryMap['Nepali'], 
    price: 260, 
    description: 'Traditional steamed buffalo dumplings with sesame achar', 
    is_available: true,
    quantity: 50,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Fried Momo', 
    category: categoryMap['Nepali'], 
    price: 300, 
    description: 'Crispy fried momos with spicy dipping sauce', 
    is_available: true,
    quantity: 40,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Jhol Momo', 
    category: categoryMap['Nepali'], 
    price: 320, 
    description: 'Steamed momos served in a rich spicy tomato soup broth', 
    is_available: true,
    quantity: 35,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Dal Bhat Set', 
    category: categoryMap['Nepali'], 
    price: 350, 
    description: 'Traditional lentil soup, steamed rice, seasonal vegetables, pickle and papad', 
    is_available: true,
    quantity: 100,
    low_stock_threshold: 20,
    track_inventory: true
  },
  { 
    name: 'Thakali Khana Set', 
    category: categoryMap['Nepali'], 
    price: 450, 
    description: 'Authentic Thakali style meal with dal, bhat, mutton curry, gundruk, and achar', 
    is_available: true,
    quantity: 30,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Chicken Choila', 
    category: categoryMap['Nepali'], 
    price: 320, 
    description: 'Grilled spiced chicken tossed with mustard oil, garlic, ginger and green chilli', 
    is_available: true,
    quantity: 40,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Buff Choila', 
    category: categoryMap['Nepali'], 
    price: 300, 
    description: 'Newari style spiced buffalo meat with mustard oil and spices', 
    is_available: true,
    quantity: 35,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Sekuwa Platter', 
    category: categoryMap['Nepali'], 
    price: 550, 
    description: 'Grilled marinated chicken, lamb and buff skewers served with achar and salad', 
    is_available: true,
    quantity: 25,
    low_stock_threshold: 8,
    track_inventory: true
  },
  { 
    name: 'Aloo Tama Bodi', 
    category: categoryMap['Nepali'], 
    price: 280, 
    description: 'Traditional Nepali curry with potato, bamboo shoots and black eyed beans', 
    is_available: true,
    quantity: 50,
    low_stock_threshold: 15,
    track_inventory: true
  },
  { 
    name: 'Gundruk Soup', 
    category: categoryMap['Nepali'], 
    price: 180, 
    description: 'Fermented leafy greens cooked into a hearty traditional soup', 
    is_available: true,
    quantity: 60,
    low_stock_threshold: 15,
    track_inventory: true
  },
  { 
    name: 'Sel Roti with Achar', 
    category: categoryMap['Nepali'], 
    price: 200, 
    description: 'Crispy traditional rice flour donuts served with tomato and radish achar', 
    is_available: true,
    quantity: 40,
    low_stock_threshold: 10,
    track_inventory: true
  },

  // ======= FUSION ITEMS =======
  { 
    name: 'Momo Quesadilla', 
    category: categoryMap['Fusion'], 
    price: 420, 
    description: 'Momo filling stuffed inside a crispy tortilla with cheese and achar mayo', 
    is_available: true,
    quantity: 30,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Sekuwa Tacos', 
    category: categoryMap['Fusion'], 
    price: 450, 
    description: 'Nepali sekuwa style grilled meat in soft tacos with timur slaw and mint chutney', 
    is_available: true,
    quantity: 25,
    low_stock_threshold: 8,
    track_inventory: true
  },
  { 
    name: 'Choila Pasta', 
    category: categoryMap['Fusion'], 
    price: 400, 
    description: 'Penne pasta tossed in Newari style choila spices with grilled chicken', 
    is_available: true,
    quantity: 35,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Dal Bhat Risotto', 
    category: categoryMap['Fusion'], 
    price: 480, 
    description: 'Italian risotto inspired by dal bhat flavors with lentil broth and ghee', 
    is_available: true,
    quantity: 20,
    low_stock_threshold: 8,
    track_inventory: true
  },
  { 
    name: 'Timur Pepper Chicken Burger', 
    category: categoryMap['Fusion'], 
    price: 420, 
    description: 'Crispy chicken burger marinated in Szechuan timur pepper with achar coleslaw', 
    is_available: true,
    quantity: 30,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Momo Soup Ramen', 
    category: categoryMap['Fusion'], 
    price: 450, 
    description: 'Japanese style ramen broth with Nepali momos, soft boiled egg and bok choy', 
    is_available: true,
    quantity: 25,
    low_stock_threshold: 8,
    track_inventory: true
  },

  // ======= WESTERN MAINS =======
  { 
    name: 'Margherita Pizza', 
    category: categoryMap['Western'], 
    price: 550, 
    description: 'Classic wood fired pizza with tomato sauce, fresh mozzarella and basil', 
    is_available: true,
    quantity: 40,
    low_stock_threshold: 12,
    track_inventory: true
  },
  { 
    name: 'BBQ Chicken Pizza', 
    category: categoryMap['Western'], 
    price: 650, 
    description: 'Smoky BBQ sauce, grilled chicken, red onion and cheddar cheese', 
    is_available: true,
    quantity: 35,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Classic Beef Burger', 
    category: categoryMap['Western'], 
    price: 480, 
    description: 'Juicy beef patty with lettuce, tomato, pickles, cheddar and special sauce', 
    is_available: true,
    quantity: 45,
    low_stock_threshold: 12,
    track_inventory: true
  },
  { 
    name: 'Grilled Chicken Sandwich', 
    category: categoryMap['Western'], 
    price: 420, 
    description: 'Grilled chicken breast with avocado, lettuce, tomato in a toasted bun', 
    is_available: true,
    quantity: 40,
    low_stock_threshold: 12,
    track_inventory: true
  },
  { 
    name: 'Spaghetti Bolognese', 
    category: categoryMap['Western'], 
    price: 500, 
    description: 'Slow cooked beef and tomato ragu over al dente spaghetti with parmesan', 
    is_available: true,
    quantity: 35,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Grilled Salmon Fillet', 
    category: categoryMap['Western'], 
    price: 750, 
    description: 'Norwegian salmon with lemon butter sauce, roasted vegetables and mashed potato', 
    is_available: true,
    quantity: 20,
    low_stock_threshold: 5,
    track_inventory: true
  },
  { 
    name: 'BBQ Pork Ribs', 
    category: categoryMap['Western'], 
    price: 850, 
    description: 'Slow cooked pork ribs glazed in smoky BBQ sauce with coleslaw and fries', 
    is_available: true,
    quantity: 15,
    low_stock_threshold: 5,
    track_inventory: true
  },
  { 
    name: 'Caesar Salad', 
    category: categoryMap['Western'], 
    price: 320, 
    description: 'Crispy romaine, parmesan, croutons and house made Caesar dressing', 
    is_available: true,
    quantity: 50,
    low_stock_threshold: 15,
    track_inventory: true
  },

  // ======= SNACKS & STARTERS =======
  { 
    name: 'French Fries', 
    category: categoryMap['Snacks'], 
    price: 180, 
    description: 'Crispy golden fries with ketchup and mayo', 
    is_available: true,
    quantity: 100,
    low_stock_threshold: 25,
    track_inventory: true
  },
  { 
    name: 'Loaded Fries', 
    category: categoryMap['Snacks'], 
    price: 280, 
    description: 'Fries topped with melted cheese, jalapenos, sour cream and spring onion', 
    is_available: true,
    quantity: 60,
    low_stock_threshold: 15,
    track_inventory: true
  },
  { 
    name: 'Chicken Wings', 
    category: categoryMap['Snacks'], 
    price: 380, 
    description: '6 pieces crispy wings with your choice of BBQ, buffalo or garlic butter sauce', 
    is_available: true,
    quantity: 50,
    low_stock_threshold: 15,
    track_inventory: true
  },
  { 
    name: 'Onion Rings', 
    category: categoryMap['Snacks'], 
    price: 200, 
    description: 'Beer battered crispy onion rings with ranch dipping sauce', 
    is_available: true,
    quantity: 70,
    low_stock_threshold: 20,
    track_inventory: true
  },
  { 
    name: 'Aloo Sadeko', 
    category: categoryMap['Snacks'], 
    price: 180, 
    description: 'Spiced boiled potatoes with mustard oil, green chilli, coriander and lemon', 
    is_available: true,
    quantity: 80,
    low_stock_threshold: 20,
    track_inventory: true
  },
  { 
    name: 'Spring Rolls', 
    category: categoryMap['Snacks'], 
    price: 220, 
    description: 'Crispy vegetable spring rolls with sweet chilli sauce', 
    is_available: true,
    quantity: 60,
    low_stock_threshold: 15,
    track_inventory: true
  },

  // ======= DESSERTS =======
  { 
    name: 'Chocolate Lava Cake', 
    category: categoryMap['Desserts'], 
    price: 320, 
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream', 
    is_available: true,
    quantity: 30,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Sikarni', 
    category: categoryMap['Desserts'], 
    price: 220, 
    description: 'Traditional Nepali strained yogurt dessert with cardamom, nuts and saffron', 
    is_available: true,
    quantity: 40,
    low_stock_threshold: 12,
    track_inventory: true
  },
  { 
    name: 'Yomari', 
    category: categoryMap['Desserts'], 
    price: 250, 
    description: 'Steamed rice flour dumplings filled with sweet chaku and sesame', 
    is_available: true,
    quantity: 35,
    low_stock_threshold: 10,
    track_inventory: true
  },
  { 
    name: 'Cheesecake', 
    category: categoryMap['Desserts'], 
    price: 350, 
    description: 'Creamy New York style cheesecake with berry compote', 
    is_available: true,
    quantity: 25,
    low_stock_threshold: 8,
    track_inventory: true
  },
  { 
    name: 'Gulab Jamun with Ice Cream', 
    category: categoryMap['Desserts'], 
    price: 280, 
    description: 'Soft warm gulab jamun served alongside a scoop of vanilla ice cream', 
    is_available: true,
    quantity: 40,
    low_stock_threshold: 12,
    track_inventory: true
  },

  // ======= DRINKS =======
  { 
    name: 'Lassi', 
    category: categoryMap['Drinks'], 
    price: 150, 
    description: 'Chilled yogurt drink, available in sweet, salty or mango', 
    is_available: true,
    quantity: 100,
    low_stock_threshold: 25,
    track_inventory: true
  },
  { 
    name: 'Nimbu Pani', 
    category: categoryMap['Drinks'], 
    price: 120, 
    description: 'Fresh lemonade with mint and a hint of black salt', 
    is_available: true,
    quantity: 120,
    low_stock_threshold: 30,
    track_inventory: true
  },
  { 
    name: 'Masala Chai', 
    category: categoryMap['Drinks'], 
    price: 100, 
    description: 'Spiced milk tea with ginger, cardamom and cinnamon', 
    is_available: true,
    quantity: 150,
    low_stock_threshold: 40,
    track_inventory: true
  },
  { 
    name: 'Cold Coffee', 
    category: categoryMap['Drinks'], 
    price: 220, 
    description: 'Blended iced coffee with milk and a touch of sweetness', 
    is_available: true,
    quantity: 80,
    low_stock_threshold: 20,
    track_inventory: true
  },
  { 
    name: 'Fresh Juice', 
    category: categoryMap['Drinks'], 
    price: 180, 
    description: 'Seasonal fresh pressed juice — orange, watermelon or pineapple', 
    is_available: true,
    quantity: 90,
    low_stock_threshold: 25,
    track_inventory: true
  },
  { 
    name: 'Soft Drink', 
    category: categoryMap['Drinks'], 
    price: 80, 
    description: 'Coke, Sprite, Fanta or local Nepali soda', 
    is_available: true,
    quantity: 200,
    low_stock_threshold: 50,
    track_inventory: true
  },
  { 
    name: 'Mineral Water', 
    category: categoryMap['Drinks'], 
    price: 60, 
    description: 'Chilled 500ml bottled water', 
    is_available: true,
    quantity: 300,
    low_stock_threshold: 75,
    track_inventory: true
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // ========== STEP 1: Clear existing data ==========
    console.log('\n🗑️  Clearing existing data...');
    await Product.deleteMany({});
    console.log('   ✓ Products cleared');
    await Category.deleteMany({});
    console.log('   ✓ Categories cleared');

    // ========== STEP 2: Create Categories ==========
    console.log('\n📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`   [OK] ${createdCategories.length} categories created`);

    // Create a map of category names to their ObjectIds
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Display created categories
    console.log('\n[CATEGORIES] Category IDs:');
    createdCategories.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat._id}`);
    });

    // ========== STEP 3: Create Products with Category References ==========
    console.log('\n[PRODUCTS] Creating products with category references...');
    const productsData = getProductsData(categoryMap);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`   ✓ ${createdProducts.length} products created`);

    // Display product count by category
    console.log('\n[STATS] Products by category:');
    for (const [categoryName, categoryId] of Object.entries(categoryMap)) {
      const count = createdProducts.filter(p => p.category.toString() === categoryId.toString()).length;
      console.log(`   - ${categoryName}: ${count} products`);
    }

    // ========== STEP 4: Verify Data ==========
    console.log('\n[VERIFY] Verifying data...');
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ is_available: true });
    
    console.log(`   ✓ Total categories: ${totalCategories}`);
    console.log(`   ✓ Total products: ${totalProducts}`);
    console.log(`   ✓ Active products: ${activeProducts}`);

    // Test populate
    console.log('\n🧪 Testing populate...');
    const sampleProduct = await Product.findOne().populate('category', 'name slug');
    if (sampleProduct) {
      console.log(`   ✓ Sample product: "${sampleProduct.name}"`);
      console.log(`   ✓ Category: ${sampleProduct.category.name} (${sampleProduct.category._id})`);
      console.log(`   ✓ Slug: ${sampleProduct.category.slug}`);
    }

    // Close connection
    console.log('\n[SUCCESS] Database seeding completed successfully!');
    console.log('[DONE] Closing database connection...\n');
    mongoose.connection.close();

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
