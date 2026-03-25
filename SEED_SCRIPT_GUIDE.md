# Seed Script Guide - Categories & Products

**File:** `src/seedCategoriesAndProducts.js`

---

## 🎯 WHAT IT DOES

This script will:
1. ✅ Delete all existing products
2. ✅ Delete all existing categories
3. ✅ Create 6 new categories (Nepali, Fusion, Western, Snacks, Desserts, Drinks)
4. ✅ Create 47 products with proper ObjectId category references
5. ✅ Add inventory tracking (quantity, low_stock_threshold)
6. ✅ Verify everything works with populate test

---

## 🚀 HOW TO RUN

### Step 1: Make sure your .env is configured
```bash
# src/.env should have:
MONGO_URI=mongodb://localhost:27017/your_database_name
```

### Step 2: Run the seed script
```bash
cd src
node seedCategoriesAndProducts.js
```

### Step 3: Check the output
You should see:
```
✅ Connected to MongoDB...

🗑️  Clearing existing data...
   ✓ Products cleared
   ✓ Categories cleared

📁 Creating categories...
   ✓ 6 categories created

📋 Category IDs:
   - Nepali: 673abc123...
   - Fusion: 673def456...
   - Western: 673ghi789...
   - Snacks: 673jkl012...
   - Desserts: 673mno345...
   - Drinks: 673pqr678...

🍽️  Creating products with category references...
   ✓ 47 products created

📊 Products by category:
   - Nepali: 12 products
   - Fusion: 6 products
   - Western: 8 products
   - Snacks: 6 products
   - Desserts: 5 products
   - Drinks: 7 products

🔍 Verifying data...
   ✓ Total categories: 6
   ✓ Total products: 47
   ✓ Active products: 47

🧪 Testing populate...
   ✓ Sample product: "Chicken Momo"
   ✓ Category: Nepali (673abc123...)
   ✓ Slug: nepali

✅ Database seeding completed successfully!
👋 Closing database connection...
```

---

## 📊 WHAT GETS CREATED

### Categories (6):
1. **Nepali** - Traditional Nepali cuisine
2. **Fusion** - Creative fusion dishes
3. **Western** - Pizza, pasta, burgers
4. **Snacks** - Appetizers and finger foods
5. **Desserts** - Sweet treats
6. **Drinks** - Beverages

### Products (47):
- **Nepali:** 12 items (Momos, Dal Bhat, Choila, Sekuwa, etc.)
- **Fusion:** 6 items (Momo Quesadilla, Sekuwa Tacos, etc.)
- **Western:** 8 items (Pizza, Burgers, Pasta, etc.)
- **Snacks:** 6 items (Fries, Wings, Spring Rolls, etc.)
- **Desserts:** 5 items (Lava Cake, Sikarni, Cheesecake, etc.)
- **Drinks:** 7 items (Lassi, Chai, Coffee, Juice, etc.)

### Each Product Has:
- ✅ Name
- ✅ Description
- ✅ Price (in NPR)
- ✅ Category (ObjectId reference)
- ✅ Quantity (inventory)
- ✅ Low stock threshold
- ✅ Track inventory enabled
- ✅ Available status

---

## 🔄 RUNNING MULTIPLE TIMES

You can run this script multiple times safely:
- It clears old data first
- Creates fresh categories and products
- No duplicate issues

---

## ⚠️ IMPORTANT NOTES

### This Script Will DELETE:
- ❌ All existing products
- ❌ All existing categories

### This Script Will NOT Delete:
- ✅ Users
- ✅ Orders
- ✅ Carts
- ✅ Reservations
- ✅ Tables

### After Running:
- ✅ All products will have proper ObjectId category references
- ✅ Frontend will display category names correctly
- ✅ Category filters will work
- ✅ Dashboard stats will show category names
- ✅ Inventory tracking will be enabled

---

## 🧪 TESTING AFTER SEEDING

### 1. Test Backend API:
```bash
# Get all products (should populate categories)
curl http://localhost:5000/api/products

# Get all categories
curl http://localhost:5000/api/categories

# Get dashboard stats
curl http://localhost:5000/api/dashboard/stats
```

### 2. Test Frontend:
1. Go to Products page
2. Verify all products show category names (not IDs)
3. Test category filter dropdown
4. Go to Admin → Products
5. Click "Add Product"
6. Verify category dropdown shows: Nepali, Fusion, Western, etc.

---

## 🎨 CUSTOMIZING THE SCRIPT

### Add More Categories:
```javascript
const categories = [
  { name: 'Nepali', description: '...' },
  { name: 'Fusion', description: '...' },
  { name: 'Your New Category', description: 'Description here' },  // ← Add here
];
```

### Add More Products:
```javascript
const getProductsData = (categoryMap) => [
  // ... existing products ...
  { 
    name: 'Your New Product', 
    category: categoryMap['Nepali'],  // ← Use category name
    price: 299, 
    description: 'Description here',
    is_available: true,
    quantity: 50,
    low_stock_threshold: 10,
    track_inventory: true
  },
];
```

### Change Inventory Levels:
Edit the `quantity` and `low_stock_threshold` values in the products array.

---

## 🚨 TROUBLESHOOTING

### Error: "Cannot connect to MongoDB"
- Check your `MONGO_URI` in `.env`
- Make sure MongoDB is running
- Verify database name is correct

### Error: "Category not found"
- The script creates categories first, then products
- If you see this error, check the category names match exactly

### Products show "Unknown" category
- Run the seed script again
- Make sure backend is using the new code with populate()

---

## ✅ SUCCESS CHECKLIST

After running the script:
- [ ] Script completed without errors
- [ ] Saw "47 products created" message
- [ ] Saw "6 categories created" message
- [ ] Sample product test passed
- [ ] Backend API returns products with category objects
- [ ] Frontend displays category names (not IDs)
- [ ] Category dropdown in product form shows categories
- [ ] Dashboard shows category stats with names

---

## 🎉 YOU'RE DONE!

Your database now has:
- ✅ 6 categories with proper slugs
- ✅ 47 products with ObjectId references
- ✅ Inventory tracking enabled
- ✅ Everything ready for testing

**Next:** Start your servers and test the full flow! 🚀
