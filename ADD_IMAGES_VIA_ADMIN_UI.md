# Adding Kaha CDN Image URLs via Admin UI

## Overview
You can now add Kaha CDN image URLs directly from the admin product edit form without needing to upload images through Swagger or scripts.

## How to Use

### Step 1: Upload Images to Kaha via Swagger
1. Go to: https://dev.kaha.com.np/main/api/v3/docs#/Uploads/UploadsController_multipleFilesUpload
2. Click "Try it out"
3. Upload 3 images for a product
4. Copy the response URLs (use `fileUrl`, NOT `fileUrlWithBlurHash`)

### Step 2: Add URLs in Admin UI
1. Login to admin panel: http://localhost:3000/admin/login
2. Go to Products page
3. Click "Edit" on any product
4. Scroll to "Image URLs (Kaha CDN)" section
5. Paste each Kaha CDN URL and click "Add URL" (or press Enter)
6. Repeat for all 3 images
7. Click "Set as Main" on the image you want as the primary display image
8. Click "Update Product"

## Features

### Image URL Management
- **Add Multiple URLs**: Paste Kaha CDN URLs one at a time
- **Preview Thumbnails**: See small previews of each image
- **Set Main Image**: Choose which image displays as the primary product image
- **Remove Images**: Delete individual images from the array
- **Validation**: URLs must start with http:// or https://

### Visual Indicators
- Main image is marked with a gold "MAIN IMAGE" badge
- Thumbnails show 60x60px previews
- Failed images show a placeholder

## Current Status

### ✅ Products with Kaha CDN URLs (16)
1. Aloo Sadeko
2. Aloo Tama Bodi
3. BBQ Chicken Pizza
4. BBQ Pork Ribs
5. Buff Choila
6. Buff Momo
7. Caesar Salad
8. Cheesecake
9. Chicken Choila
10. Chicken Momo
11. Chicken Wings
12. Chocolate Lava Cake
13. Choila Pasta
14. Classic Beef Burger
15. Cold Coffee
16. Dal Bhat Risotto

### 🔄 Products Needing Kaha URLs (27)
1. Dal Bhat Set
2. Fried Momo
3. French Fries
4. Fresh Juice
5. Grilled Chicken Sandwich
6. Grilled Salmon Fillet
7. Gulab Jamun with Ice Cream
8. Gundruk Soup
9. Jhol Momo
10. Lassi
11. Loaded Fries
12. Margherita Pizza
13. Masala Chai
14. Mineral Water
15. Momo Quesadilla
16. Momo Soup Ramen
17. Nimbu Pani
18. Onion Rings
19. Sekuwa Platter
20. Sekuwa Tacos
21. Sel Roti with Achar
22. Sikarni
23. Soft Drink
24. Spaghetti Bolognese
25. Spring Rolls
26. Thakali Khana Set
27. Timur Pepper Chicken Burger
28. Yomari

### ⚠️ Extra Products to Delete (3)
- Cheese burger (no images)
- abcd (no images)
- coffee (no images)

## Workflow for Remaining Products

For each product:
1. Upload 3 images via Swagger (batch upload supported)
2. Copy the 3 URLs from response
3. Edit product in admin UI
4. Paste all 3 URLs
5. Set first image as main
6. Save

## Example Kaha CDN URL Format
```
https://compressedv2.s3.ap-south-1.amazonaws.com/4c384f78792c7e6d25672d703d7752532d6f57542532567361656276_1774595866999
```

## Benefits
- No need for scripts or command line
- Visual interface for managing images
- Can update products individually as you upload images
- See immediate preview of images
- Easy to fix mistakes or swap images
