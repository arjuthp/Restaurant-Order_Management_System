# Category Filter Fix

## Problem

The category filter on the customer products page was not working. When users selected a category from the dropdown, no filtering occurred and all products were still displayed.

## Root Cause

**Mismatch between frontend and backend expectations:**

1. **Frontend behavior:**
   - Extracts category **names** from products: `product.category?.name`
   - Stores category names in state: `['Appetizers', 'Main Course', 'Desserts']`
   - Sends category **name** to API: `?category=Appetizers`

2. **Backend expectation:**
   - Product model has `category` field as ObjectId reference
   - Filter was trying to match: `filter.category = 'Appetizers'` (string)
   - But database has: `product.category = ObjectId("507f1f77bcf86cd799439011")`
   - **Result:** No match, filter fails silently

## Solution

Updated the backend to handle both category names and IDs:

### 1. Updated `src/utils/searchFilterHelper.js`

Made `buildProductFilters` async and added logic to:
- Check if the category parameter is a valid ObjectId
- If it's an ID, use it directly
- If it's a name, look up the category ID from the database
- Handle case where category name doesn't exist

```javascript
const Category = require('../models/category.model');

const buildProductFilters = async (queryParams) => {
    const filter = {
        is_deleted: false
    };
    
    // ... other filters ...
    
    // CATEGORY FILTER - Handle both name and ID
    if (queryParams.category && queryParams.category !== 'all') {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(queryParams.category)) {
            // It's an ID, use directly
            filter.category = queryParams.category;
        } else {
            // It's a name, look up the category ID
            const category = await Category.findOne({ 
                name: queryParams.category,
                is_deleted: false,
                is_active: true
            });
            
            if (category) {
                filter.category = category._id;
            } else {
                // Category not found, return filter that matches nothing
                filter.category = null;
            }
        }
    }
    
    return filter;
};
```

### 2. Updated `src/service/product.service.js`

Changed the call to `buildProductFilters` to await it since it's now async:

```javascript
async getAllProducts(queryParams = {}){
    // STEP 1: Build filter from query params (now async)
    const filter = await buildProductFilters(queryParams);
    console.log('MongoDB filter:', filter);
    
    // ... rest of the function ...
}
```

## How It Works Now

### Request Flow:

1. **User selects category:** "Nepali" from dropdown
2. **Frontend sends:** `GET /api/products?page=1&limit=12&category=Nepali`
3. **Backend receives:** `queryParams.category = "Nepali"`
4. **searchFilterHelper:**
   - Checks if "Nepali" is a valid ObjectId → No
   - Queries database: `Category.findOne({ name: "Nepali" })`
   - Finds category with ID: `ObjectId("507f1f77bcf86cd799439011")`
   - Sets filter: `filter.category = ObjectId("507f1f77bcf86cd799439011")`
5. **Product query:** `Product.find({ category: ObjectId("507f1f77bcf86cd799439011") })`
6. **Result:** Only products in "Nepali" category are returned

### Example API Calls:

**Before fix:**
```
GET /api/products?category=Nepali
→ Returns all products (filter ignored)
```

**After fix:**
```
GET /api/products?category=Nepali
→ Returns only Nepali category products

GET /api/products?category=507f1f77bcf86cd799439011
→ Also works with ObjectId (backward compatible)
```

## Benefits

1. **Backward Compatible:** Still works if category ID is sent
2. **User-Friendly:** Frontend can use human-readable category names
3. **Flexible:** Handles both name and ID filtering
4. **Robust:** Gracefully handles non-existent categories

## Testing

### Manual Testing:

1. **Navigate to products page:** `http://localhost:3000/products`
2. **Select a category** from the dropdown (e.g., "Nepali")
3. **Verify:** Only products from that category are displayed
4. **Check network tab:** Should see request like `products?page=1&limit=12&category=Nepali`
5. **Check response:** Should contain only filtered products
6. **Select "All Categories":** Should show all products again

### Test Cases:

```bash
# Test 1: Filter by category name
curl "http://localhost:5000/api/products?category=Nepali"
# Expected: Only Nepali products

# Test 2: Filter by category ID (backward compatibility)
curl "http://localhost:5000/api/products?category=507f1f77bcf86cd799439011"
# Expected: Products from that category

# Test 3: Non-existent category
curl "http://localhost:5000/api/products?category=NonExistent"
# Expected: Empty array (no products)

# Test 4: Combined filters
curl "http://localhost:5000/api/products?category=Nepali&available=true&search=chicken"
# Expected: Available Nepali products with "chicken" in name/description
```

## Files Modified

1. `src/utils/searchFilterHelper.js` - Made async, added category name lookup
2. `src/service/product.service.js` - Updated to await async filter builder

## Related Issues

This fix also applies to:
- Admin products page filtering
- Any other page that filters products by category

## Performance Considerations

- **Additional database query:** One extra query to look up category by name
- **Impact:** Minimal - category lookup is fast (indexed field)
- **Optimization:** Could cache category name→ID mappings if needed
- **Alternative:** Frontend could send category IDs instead of names (requires more changes)

## Future Improvements

1. **Cache category mappings** in memory to avoid repeated lookups
2. **Add category slug** for URL-friendly filtering
3. **Support multiple categories** with comma-separated values
4. **Add category hierarchy** filtering (parent/child categories)
