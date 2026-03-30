# Kaha CDN Upload Feature - Complete Implementation

## Overview
The Kaha CDN upload feature allows admins to upload product images directly to the external CDN at `https://dev.kaha.com.np/main/api/v3/uploads/array` and manage image URLs through a clean UI interface.

## Features

### 1. File Upload to Kaha CDN
- Select multiple image files (JPEG, PNG, WebP)
- Upload directly from browser to Kaha API
- Real-time upload progress tracking
- Automatic URL extraction and storage

### 2. Manual URL Input
- Paste Kaha CDN URLs directly
- Press Enter or click "Add URL" button
- Instant validation and preview

### 3. Image Gallery Management
- View all product images with thumbnails
- Set any image as the main product image
- Remove images individually
- Visual indicator for main image

## User Flow

### Adding Images via Upload

1. Admin clicks "Add Product" or "Edit Product"
2. In the form, scroll to "Upload Product Images to Kaha CDN" section
3. Click file input and select one or more images
4. Selected files appear in a list showing filename and size
5. Click "Upload to Kaha CDN" button
6. Progress shows: "Uploading 1 of 3: image.jpg..."
7. On success, CDN URLs are automatically added to the image gallery below
8. First uploaded image becomes the main image if none exists

### Adding Images via URL

1. Scroll to "Image URLs (Kaha CDN)" section
2. Paste a Kaha CDN URL in the input field
3. Press Enter or click "Add URL"
4. Image appears in the gallery with thumbnail preview
5. Can set as main image or remove

### Managing Images

1. View all images in the "Images (X)" gallery
2. Each image shows:
   - Thumbnail preview
   - Truncated URL
   - "Main Image" badge (if applicable)
   - "Set as Main" button (for non-main images)
   - "Remove" button
3. Click "Set as Main" to change the main product image
4. Click "Remove" to delete an image from the product

## Technical Implementation

### API Endpoint
- **URL**: `https://dev.kaha.com.np/main/api/v3/uploads/array`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Request Body**: FormData with files appended as 'files'
- **Response Format**:
```json
{
  "fileUrls": [
    {
      "fileUrl": "https://compressedv2.s3.ap-south-1.amazonaws.com/..."
    }
  ]
}
```

### Data Structure

#### ProductFormData Interface
```typescript
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;        // Main image URL
  images?: string[];        // Array of all image URLs
  is_available: boolean;
  quantity: number;
  low_stock_threshold: number;
  image_file?: File;
}
```

#### Product Model
```typescript
export interface Product {
  _id: string;
  name: string;
  // ... other fields
  image_url: string | null;  // Main image
  images: string[];          // All images
}
```

### Key Functions

#### handleFileChange
- Validates selected files (type, size)
- Stores files in `selectedFiles` state
- Shows file list with names and sizes

#### handleUploadToKaha
- Uploads each file to Kaha API sequentially
- Shows progress for each file
- Extracts CDN URLs from response
- Adds URLs to `formData.images` array
- Sets first URL as `formData.image_url` if empty
- Clears selected files after upload

#### handleAddImageUrl
- Validates URL format (must start with http:// or https://)
- Adds URL to `formData.images` array
- Sets as main image if none exists
- Clears input field

#### handleSetAsMainImage
- Updates `formData.image_url` to selected URL
- Updates UI to show new main image badge

#### handleRemoveImageFromArray
- Removes image from `formData.images` array
- If removed image was main, sets first remaining image as main

### File Validation
- **Allowed Types**: image/jpeg, image/png, image/webp
- **Max Size**: 5MB per file
- **Max Images**: No hard limit (previously 10 suggested)

### UI Components

#### File Upload Section
```tsx
<div className={styles.fileUploadSection}>
  <input type="file" multiple accept="image/jpeg,image/png,image/webp" />
  <div className={styles.selectedFilesInfo}>
    <ul className={styles.fileList}>
      {/* File list */}
    </ul>
    <Button onClick={handleUploadToKaha}>Upload to Kaha CDN</Button>
  </div>
</div>
```

#### URL Input Section
```tsx
<div className={styles.imageUrlInput}>
  <Input 
    value={newImageUrl}
    onChange={(e) => setNewImageUrl(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && handleAddImageUrl()}
  />
  <Button onClick={handleAddImageUrl}>Add URL</Button>
</div>
```

#### Image Gallery
```tsx
<div className={styles.imageUrlsList}>
  {formData.images.map((url, index) => (
    <div className={styles.imageUrlItem}>
      <img src={url} className={styles.imageThumbnail} />
      <div className={styles.imageUrlInfo}>
        <div className={styles.imageUrlText}>{url}</div>
        {formData.image_url === url && <span>Main Image</span>}
      </div>
      <div className={styles.imageUrlActions}>
        <Button onClick={() => handleSetAsMainImage(url)}>Set as Main</Button>
        <Button onClick={() => handleRemoveImageFromArray(index)}>Remove</Button>
      </div>
    </div>
  ))}
</div>
```

## Files Modified

### Frontend
- `client/src/features/admin/components/ProductForm.tsx`
  - Complete rewrite of image handling logic
  - Added Kaha upload functionality
  - Added manual URL input
  - Added image gallery management

- `client/src/features/admin/components/ProductForm.module.css`
  - Added styles for file upload section
  - Added styles for URL input
  - Added styles for image gallery
  - Added responsive styles

- `client/src/features/admin/pages/AdminProductsPage.tsx`
  - Simplified form submission (no FormData needed)
  - Sends `images` array directly in JSON

- `client/src/services/api/productsApi.ts`
  - Added `images?: string[]` to CreateProductData
  - Added `images?: string[]` to UpdateProductData

## Error Handling

### Upload Errors
- Network failures: Shows error message with details
- Invalid response: Shows "No URL returned" error
- Partial failures: Shows success count + failed files

### Validation Errors
- Invalid file type: "Invalid file type. Please upload a JPEG, PNG, or WebP image."
- File too large: "File size (X MB) exceeds the maximum allowed size of 5MB."
- Invalid URL: "Please enter a valid URL starting with http:// or https://"

## CORS Considerations
- Uploads are made directly from browser to dev.kaha.com.np
- CORS must be enabled on the Kaha API
- If CORS issues occur, may need backend proxy route

## Testing Checklist
- [x] Build successful
- [ ] Select single image file
- [ ] Select multiple image files
- [ ] Upload to Kaha CDN
- [ ] Verify CDN URLs returned
- [ ] Add URL manually
- [ ] View image gallery
- [ ] Set image as main
- [ ] Remove image
- [ ] Create product with images
- [ ] Update product with images
- [ ] Verify images persist after save

## Status
✅ Implementation Complete
✅ Build Successful
✅ TypeScript Errors Fixed
⏳ Ready for Testing with Kaha API

