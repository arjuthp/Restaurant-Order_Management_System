# Complete Kaha CDN Image Upload Guide

## ✅ What's Implemented

You can now upload product images directly from the admin UI to Kaha CDN!

## How It Works

### Upload Flow:
1. Admin selects image files in the UI
2. Files are uploaded directly from browser to Kaha API (one by one)
3. Kaha returns CDN URLs for each image
4. Frontend adds URLs to product's images array
5. Admin saves the product with the new image URLs

**Note:** Upload happens directly from browser to Kaha CDN, not through the backend. This is because Kaha API is only accessible from browsers, not from Node.js/command line.
1. Admin goes to Products page
2. Clicks "Edit" on a product
3. Selects multiple image files (up to 10)
4. Clicks "Upload to Kaha CDN"
5. Images are uploaded and URLs are automatically added
6. Admin can set which image is the main display image
7. Clicks "Update Product" to save

## Step-by-Step Usage

### 1. Login to Admin Panel
```
http://localhost:3000/admin/login
```

### 2. Navigate to Products
- Click "Products" in the sidebar
- Find the product you want to add images to
- Click "Edit"

### 3. Upload Images
- Scroll to "Upload Product Images to Kaha CDN" section
- Click "Choose Files" and select 1-10 images
- Supported formats: JPEG, PNG, WebP
- Max size per file: 5MB
- Click "Upload to Kaha CDN" button
- Watch the progress indicator (shows "Uploading 1 of 3: filename.jpg...")
- Wait for all uploads to complete
- Success message shows how many images were uploaded

### 4. Manage Images
- Uploaded images appear in the "Image URLs (Kaha CDN)" section below
- Each image shows a thumbnail preview
- Click "Set as Main" to choose the primary display image
- Click "Remove" to delete an image from the array
- The main image has a gold "MAIN IMAGE" badge

### 5. Save Product
- Click "Update Product" button
- Images are saved to the database
- Product now displays with Kaha CDN images

## API Endpoints

### Upload Multiple Images
```
POST /api/upload/kaha/multiple
Content-Type: multipart/form-data

Body:
- images: File[] (up to 10 files)

Response:
{
  "success": true,
  "message": "Successfully uploaded 3 of 3 images",
  "data": {
    "urls": [
      "https://compressedv2.s3.ap-south-1.amazonaws.com/...",
      "https://compressedv2.s3.ap-south-1.amazonaws.com/...",
      "https://compressedv2.s3.ap-south-1.amazonaws.com/..."
    ],
    "errors": [] // Any files that failed
  }
}
```

### Upload Single Image
```
POST /api/upload/kaha/single
Content-Type: multipart/form-data

Body:
- image: File

Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://compressedv2.s3.ap-south-1.amazonaws.com/..."
  }
}
```

## Features

### ✅ Multiple File Upload
- Select and upload up to 10 images at once
- Progress indicator shows current file being uploaded
- Shows file names and sizes before upload
- Uploads happen sequentially (one at a time)

### ✅ Direct Browser to Kaha Upload
- No backend proxy needed
- Uploads directly from browser to Kaha CDN
- Works around network restrictions
- Fast and reliable

### ✅ Image Management
- Visual thumbnail previews
- Set main display image
- Remove individual images
- See which image is currently the main one

### ✅ Error Handling
- File size validation (max 5MB)
- File type validation (JPEG, PNG, WebP only)
- Upload error messages
- Partial success handling (some files succeed, some fail)

### ✅ User Experience
- Loading states during upload
- Clear success/error messages
- File list preview before upload
- Responsive design

## Current Product Status

### ✅ 16 Products with Kaha CDN URLs
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

### 🔄 27 Products Still Need Images
Use the new upload feature to add images for these products!

## Technical Details

### Backend Dependencies
- `multer`: File upload handling
- `form-data`: FormData for Kaha API
- `axios`: HTTP client for Kaha API
- `fs`: File system operations

### File Storage
- Temporary files stored in `temp/` directory
- Automatically deleted after upload
- Not committed to git (in .gitignore)

### Kaha API Integration
- Endpoint: `https://dev.kaha.com.np/main/api/v3/uploads/array`
- Method: POST with multipart/form-data
- Returns: Array of file URLs
- Timeout: 30 seconds per upload

### Security
- File type validation
- File size limits
- Temporary file cleanup
- Error handling for failed uploads

## Troubleshooting

### Upload Fails
- Check if backend is running on port 5000
- Verify Kaha API is accessible
- Check file size (must be under 5MB)
- Ensure file format is JPEG, PNG, or WebP

### Images Don't Display
- Verify URLs start with https://
- Check browser console for errors
- Ensure product was saved after adding images

### Slow Uploads
- Kaha API can be slow for large files
- Upload fewer images at once
- Check internet connection

## Next Steps

1. Upload images for remaining 27 products
2. Delete test products (abcd, coffee, Cheese burger)
3. Verify all images display correctly in frontend
4. Test image gallery on product detail pages

## Benefits Over Manual Upload

❌ Old Way:
1. Go to Swagger UI
2. Upload images manually
3. Copy URLs from response
4. Paste URLs in admin UI
5. Repeat for each product

✅ New Way:
1. Select files in admin UI
2. Click upload button
3. Done!

Much faster and easier! 🎉
