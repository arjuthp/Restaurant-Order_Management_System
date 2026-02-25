require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product.model');

const menuItems = [
  // ======= NEPALI CLASSICS =======
  { 
    name: 'Chicken Momo', 
    category: 'Nepali', 
    price: 280, 
    description: 'Steamed dumplings filled with spiced chicken, served with tomato achar', 
    is_available: true 
  },
  { 
    name: 'Buff Momo', 
    category: 'Nepali', 
    price: 260, 
    description: 'Traditional steamed buffalo dumplings with sesame achar', 
    is_available: true 
  },
  { 
    name: 'Fried Momo', 
    category: 'Nepali', 
    price: 300, 
    description: 'Crispy fried momos with spicy dipping sauce', 
    is_available: true 
  },
  { 
    name: 'Jhol Momo', 
    category: 'Nepali', 
    price: 320, 
    description: 'Steamed momos served in a rich spicy tomato soup broth', 
    is_available: true 
  },
  { 
    name: 'Dal Bhat Set', 
    category: 'Nepali', 
    price: 350, 
    description: 'Traditional lentil soup, steamed rice, seasonal vegetables, pickle and papad', 
    is_available: true 
  },
  { 
    name: 'Thakali Khana Set', 
    category: 'Nepali', 
    price: 450, 
    description: 'Authentic Thakali style meal with dal, bhat, mutton curry, gundruk, and achar', 
    is_available: true 
  },
  { 
    name: 'Chicken Choila', 
    category: 'Nepali', 
    price: 320, 
    description: 'Grilled spiced chicken tossed with mustard oil, garlic, ginger and green chilli', 
    is_available: true 
  },
  { 
    name: 'Buff Choila', 
    category: 'Nepali', 
    price: 300, 
    description: 'Newari style spiced buffalo meat with mustard oil and spices', 
    is_available: true 
  },
  { 
    name: 'Sekuwa Platter', 
    category: 'Nepali', 
    price: 550, 
    description: 'Grilled marinated chicken, lamb and buff skewers served with achar and salad', 
    is_available: true 
  },
  { 
    name: 'Aloo Tama Bodi', 
    category: 'Nepali', 
    price: 280, 
    description: 'Traditional Nepali curry with potato, bamboo shoots and black eyed beans', 
    is_available: true 
  },
  { 
    name: 'Gundruk Soup', 
    category: 'Nepali', 
    price: 180, 
    description: 'Fermented leafy greens cooked into a hearty traditional soup', 
    is_available: true 
  },
  { 
    name: 'Sel Roti with Achar', 
    category: 'Nepali', 
    price: 200, 
    description: 'Crispy traditional rice flour donuts served with tomato and radish achar', 
    is_available: true 
  },

  // ======= FUSION ITEMS =======
  { 
    name: 'Momo Quesadilla', 
    category: 'Fusion', 
    price: 420, 
    description: 'Momo filling stuffed inside a crispy tortilla with cheese and achar mayo', 
    is_available: true 
  },
  { 
    name: 'Sekuwa Tacos', 
    category: 'Fusion', 
    price: 450, 
    description: 'Nepali sekuwa style grilled meat in soft tacos with timur slaw and mint chutney', 
    is_available: true 
  },
  { 
    name: 'Choila Pasta', 
    category: 'Fusion', 
    price: 400, 
    description: 'Penne pasta tossed in Newari style choila spices with grilled chicken', 
    is_available: true 
  },
  { 
    name: 'Dal Bhat Risotto', 
    category: 'Fusion', 
    price: 480, 
    description: 'Italian risotto inspired by dal bhat flavors with lentil broth and ghee', 
    is_available: true 
  },
  { 
    name: 'Timur Pepper Chicken Burger', 
    category: 'Fusion', 
    price: 420, 
    description: 'Crispy chicken burger marinated in Szechuan timur pepper with achar coleslaw', 
    is_available: true 
  },
  { 
    name: 'Momo Soup Ramen', 
    category: 'Fusion', 
    price: 450, 
    description: 'Japanese style ramen broth with Nepali momos, soft boiled egg and bok choy', 
    is_available: true 
  },

  // ======= WESTERN MAINS =======
  { 
    name: 'Margherita Pizza', 
    category: 'Western', 
    price: 550, 
    description: 'Classic wood fired pizza with tomato sauce, fresh mozzarella and basil', 
    is_available: true 
  },
  { 
    name: 'BBQ Chicken Pizza', 
    category: 'Western', 
    price: 650, 
    description: 'Smoky BBQ sauce, grilled chicken, red onion and cheddar cheese', 
    is_available: true 
  },
  { 
    name: 'Classic Beef Burger', 
    category: 'Western', 
    price: 480, 
    description: 'Juicy beef patty with lettuce, tomato, pickles, cheddar and special sauce', 
    is_available: true 
  },
  { 
    name: 'Grilled Chicken Sandwich', 
    category: 'Western', 
    price: 420, 
    description: 'Grilled chicken breast with avocado, lettuce, tomato in a toasted bun', 
    is_available: true 
  },
  { 
    name: 'Spaghetti Bolognese', 
    category: 'Western', 
    price: 500, 
    description: 'Slow cooked beef and tomato ragu over al dente spaghetti with parmesan', 
    is_available: true 
  },
  { 
    name: 'Grilled Salmon Fillet', 
    category: 'Western', 
    price: 750, 
    description: 'Norwegian salmon with lemon butter sauce, roasted vegetables and mashed potato', 
    is_available: true 
  },
  { 
    name: 'BBQ Pork Ribs', 
    category: 'Western', 
    price: 850, 
    description: 'Slow cooked pork ribs glazed in smoky BBQ sauce with coleslaw and fries', 
    is_available: true 
  },
  { 
    name: 'Caesar Salad', 
    category: 'Western', 
    price: 320, 
    description: 'Crispy romaine, parmesan, croutons and house made Caesar dressing', 
    is_available: true 
  },

  // ======= SNACKS & STARTERS =======
  { 
    name: 'French Fries', 
    category: 'Snacks', 
    price: 180, 
    description: 'Crispy golden fries with ketchup and mayo', 
    is_available: true 
  },
  { 
    name: 'Loaded Fries', 
    category: 'Snacks', 
    price: 280, 
    description: 'Fries topped with melted cheese, jalapenos, sour cream and spring onion', 
    is_available: true 
  },
  { 
    name: 'Chicken Wings', 
    category: 'Snacks', 
    price: 380, 
    description: '6 pieces crispy wings with your choice of BBQ, buffalo or garlic butter sauce', 
    is_available: true 
  },
  { 
    name: 'Onion Rings', 
    category: 'Snacks', 
    price: 200, 
    description: 'Beer battered crispy onion rings with ranch dipping sauce', 
    is_available: true 
  },
  { 
    name: 'Aloo Sadeko', 
    category: 'Snacks', 
    price: 180, 
    description: 'Spiced boiled potatoes with mustard oil, green chilli, coriander and lemon', 
    is_available: true 
  },
  { 
    name: 'Spring Rolls', 
    category: 'Snacks', 
    price: 220, 
    description: 'Crispy vegetable spring rolls with sweet chilli sauce', 
    is_available: true 
  },

  // ======= DESSERTS =======
  { 
    name: 'Chocolate Lava Cake', 
    category: 'Desserts', 
    price: 320, 
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream', 
    is_available: true 
  },
  { 
    name: 'Sikarni', 
    category: 'Desserts', 
    price: 220, 
    description: 'Traditional Nepali strained yogurt dessert with cardamom, nuts and saffron', 
    is_available: true 
  },
  { 
    name: 'Yomari', 
    category: 'Desserts', 
    price: 250, 
    description: 'Steamed rice flour dumplings filled with sweet chaku and sesame', 
    is_available: true 
  },
  { 
    name: 'Cheesecake', 
    category: 'Desserts', 
    price: 350, 
    description: 'Creamy New York style cheesecake with berry compote', 
    is_available: true 
  },
  { 
    name: 'Gulab Jamun with Ice Cream', 
    category: 'Desserts', 
    price: 280, 
    description: 'Soft warm gulab jamun served alongside a scoop of vanilla ice cream', 
    is_available: true 
  },

  // ======= DRINKS =======
  { 
    name: 'Lassi', 
    category: 'Drinks', 
    price: 150, 
    description: 'Chilled yogurt drink, available in sweet, salty or mango', 
    is_available: true 
  },
  { 
    name: 'Nimbu Pani', 
    category: 'Drinks', 
    price: 120, 
    description: 'Fresh lemonade with mint and a hint of black salt', 
    is_available: true 
  },
  { 
    name: 'Masala Chai', 
    category: 'Drinks', 
    price: 100, 
    description: 'Spiced milk tea with ginger, cardamom and cinnamon', 
    is_available: true 
  },
  { 
    name: 'Cold Coffee', 
    category: 'Drinks', 
    price: 220, 
    description: 'Blended iced coffee with milk and a touch of sweetness', 
    is_available: true 
  },
  { 
    name: 'Fresh Juice', 
    category: 'Drinks', 
    price: 180, 
    description: 'Seasonal fresh pressed juice — orange, watermelon or pineapple', 
    is_available: true 
  },
  { 
    name: 'Soft Drink', 
    category: 'Drinks', 
    price: 80, 
    description: 'Coke, Sprite, Fanta or local Nepali soda', 
    is_available: true 
  },
  { 
    name: 'Mineral Water', 
    category: 'Drinks', 
    price: 60, 
    description: 'Chilled 500ml bottled water', 
    is_available: true 
  },
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB...');

    // Clear existing products (optional - comment out if you want to keep existing)
    await Product.deleteMany();
    console.log('🗑️  Old products cleared...');

    // Insert menu items
    await Product.insertMany(menuItems);
    console.log(`✅ ${menuItems.length} products seeded successfully!`);

    // Close connection
    mongoose.connection.close();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    mongoose.connection.close();
  }
}

// Run the seed function
seedProducts();
