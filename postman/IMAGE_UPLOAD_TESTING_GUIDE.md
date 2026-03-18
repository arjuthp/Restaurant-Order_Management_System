# 🖼️ Product Image Upload - Postman Testing Guide

## 📦 What's Included

This collection tests all aspects of the product image upload feature:

✅ **Positive Tests** (should succeed):
- Create product WITH image (JPEG)
- Create product WITHOUT image
- Update product with new image
- Access uploaded image via URL
- Upload PNG format
- Upload WebP format

❌ **Negative Tests** (should fail gracefully):
- Upload invalid file type (PDF, TXT, etc.)
- Upload file larger than 5MB

## 🚀 Quick Start

### 1. Import Collection into Postman

**Option A: Import from file**
```
1. Open Postman
2. Click "Import" button (top left)
3. Select "postman/Product-Image-Upload-Tests.postman_collection.json"
4. Click "Import"
```

**Option B: Import from URL** (if hosted on GitHub)
```
1. Open Postman
2. Click "Import" → "Link"
3. Paste the raw GitHub URL
4. Click "Continue" → "Import"
```

### 2. Configure Environment Variables

The collection uses these variables (auto-configured):
- `baseUrl`: http://localhost:5000/api
- `adminToken`: Auto-set after login
- `productId`: Auto-set after creating product
- `imageUrl`: Auto-set after uploading image

**To change base URL:**
```
1. Click on collection name
2. Go to "Variables" tab
3. Change "baseUrl" value
4. Click "Save"
```

### 3. Prepare Test Images

Before running tests, prepare these files:

| Test | File Type | Size | Purpose |
|------|-----------|------|---------|
| Test 1 | JPEG/JPG | < 5MB | Valid upload |
| Test 5 | PDF/TXT | Any | Invalid type test |
| Test 6 | JPEG/PNG | > 5MB | Size limit test |
| Test 7 | PNG | < 5MB | PNG format test |
| Test 8 | WebP | < 5MB | WebP format test |

**Quick way to get test images:**
- Use any photos from your computer
- Download free images from [Unsplash](https://unsplash.com) or [Pexels](https://pexels.com)
- For large file test: Use an image editor to save at high resolution

## 📋 Running the Tests

### Option 1: Run All Tests (Recommended)

```
1. Click on collection name "🖼️ Product Image Upload Tests"
2. Click "Run" button (top right)
3. Select all tests
4. Click "Run Product Image Upload Tests"
5. Watch the results!
```

**⚠️ Important:** You'll need to manually select image files for each test that requires file upload.

### Option 2: Run Tests Individually

**Step-by-step execution:**

#### Step 1: Login as Admin
```
Request: "🔐 Setup - Login as Admin"
Action: Click "Send"
Result: adminToken is automatically saved
```

#### Step 2: Create Product with Image
```
Request: "✅ Test 1: Create Product WITH Image (JPEG)"
Action: 
  1. Click "Body" tab
  2. Find "image" field
  3. Click "Select Files"
  4. Choose a JPEG image (< 5MB)
  5. Click "Send"
Result: Product created, productId and imageUrl saved
```

#### Step 3: Create Product without Image
```
Request: "✅ Test 2: Create Product WITHOUT Image"
Action: Click "Send" (no file selection needed)
Result: Product created with null image_url
```

#### Step 4: Update Product with New Image
```
Request: "✅ Test 3: Update Product - Add Image"
Action:
  1. Select a DIFFERENT image file
  2. Click "Send"
Result: Product updated with new image URL
```

#### Step 5: Verify Image Access
```
Request: "✅ Test 4: Access Uploaded Image"
Action: Click "Send"
Result: Image file is returned (you can see it in Postman)
```

#### Step 6: Test Invalid File Type
```
Request: "❌ Test 5: Upload Invalid File Type (PDF)"
Action:
  1. Select a PDF or TXT file
  2. Click "Send"
Result: 400 error with "Invalid file type" message
```

#### Step 7: Test File Too Large
```
Request: "❌ Test 6: Upload File Too Large (>5MB)"
Action:
  1. Select an image > 5MB
  2. Click "Send"
Result: 400 error with "File size exceeds 5MB limit" message
```

#### Step 8: Test PNG Format
```
Request: "✅ Test 7: Multiple Image Formats (PNG)"
Action:
  1. Select a PNG image
  2. Click "Send"
Result: Product created with .png image
```

#### Step 9: Test WebP Format
```
Request: "✅ Test 8: Multiple Image Formats (WebP)"
Action:
  1. Select a WebP image
  2. Click "Send"
Result: Product created with .webp image
```

#### Step 10: Cleanup
```
Request: "🧹 Cleanup: Delete Test Product"
Action: Click "Send"
Result: Test product is deleted (soft delete)
```

## 🔍 Understanding Test Results

### ✅ Successful Test Response

**Test 1: Create Product WITH Image**
```json
{
  "_id": "65f1234567890abcdef",
  "name": "Test Pizza with Image",
  "price": 15.99,
  "category": "Pizza",
  "description": "Delicious test pizza with uploaded image",
  "image_url": "/uploads/products/pizza-1710777600000-847362910.jpg",
  "is_available": true,
  "is_deleted": false,
  "createdAt": "2024-03-18T10:30:00.000Z",
  "updatedAt": "2024-03-18T10:30:00.000Z"
}
```

**Key Points:**
- ✅ `image_url` field is present
- ✅ URL format: `/uploads/products/{filename}-{timestamp}-{random}.{ext}`
- ✅ Status code: 201 Created

### ❌ Failed Test Response (Expected)

**Test 5: Invalid File Type**
```json
{
  "success": false,
  "error": {
    "message": "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
    "status": 400
  }
}
```

**Key Points:**
- ✅ `success: false` indicates error
- ✅ Clear error message
- ✅ Status code: 400 Bad Request

**Test 6: File Too Large**
```json
{
  "success": false,
  "error": {
    "message": "File size exceeds 5MB limit",
    "status": 400
  }
}
```

## 🐛 Troubleshooting

### Problem: "adminToken is not set"

**Solution:**
```
1. Run "🔐 Setup - Login as Admin" first
2. Check if admin user exists in database
3. Verify credentials in request body
```

### Problem: "Cannot read property '_id' of undefined"

**Solution:**
```
1. Run tests in order (Test 1 before Test 3)
2. Check if Test 1 succeeded
3. Verify productId is saved in collection variables
```

### Problem: "404 Not Found" when accessing image

**Solution:**
```
1. Check if server is running
2. Verify static file serving is configured in app.js
3. Check if uploads/products/ directory exists
4. Verify image file was actually saved
```

### Problem: "Unauthorized" error

**Solution:**
```
1. Run login request first
2. Check if token is saved in collection variables
3. Verify token hasn't expired
4. Check if user has admin role
```

### Problem: File upload doesn't work

**Solution:**
```
1. Verify multer is installed: npm list multer
2. Check if uploads/products/ directory exists
3. Verify middleware is added to routes
4. Check server logs for errors
5. Ensure Content-Type is multipart/form-data (automatic in Postman)
```

## 📊 Test Coverage Summary

| Feature | Test Count | Status |
|---------|------------|--------|
| Create with image | 3 tests | ✅ JPEG, PNG, WebP |
| Create without image | 1 test | ✅ |
| Update with image | 1 test | ✅ |
| Image accessibility | 1 test | ✅ |
| Invalid file type | 1 test | ❌ (expected) |
| File size limit | 1 test | ❌ (expected) |
| **Total** | **8 tests** | **6 pass, 2 fail (expected)** |

## 🎯 Acceptance Criteria Verification

This test suite verifies all acceptance criteria from Story 1.1.1:

- ✅ **1.1.1** Admin can upload image files (JPEG, PNG, WebP) up to 5MB
- ✅ **1.1.2** Uploaded images are stored in `/uploads/products/` directory
- ✅ **1.1.3** Image URL is returned in response after successful upload
- ✅ **1.1.4** Only authenticated admins can upload images
- ✅ **1.1.5** Invalid file types are rejected with clear error message
- ✅ **1.1.6** Uploaded images are accessible via `/uploads/products/{filename}`

## 📝 Manual Verification Steps

After running automated tests, verify manually:

### 1. Check File System
```bash
cd src/uploads/products/
ls -lh
```
**Expected:** See uploaded image files with timestamps

### 2. Check File Sizes
```bash
du -h src/uploads/products/*
```
**Expected:** All files < 5MB

### 3. Access Image in Browser
```
http://localhost:5000/uploads/products/pizza-1710777600000-847362910.jpg
```
**Expected:** Image displays in browser

### 4. Check Database
```javascript
// In MongoDB shell or Compass
db.products.find({ image_url: { $ne: null } })
```
**Expected:** Products have image_url field with correct path

## 🔄 Continuous Testing

### Run Tests After Code Changes

**When to run:**
- After modifying upload middleware
- After changing file validation logic
- After updating product controller
- After modifying routes
- Before committing code
- Before deploying to production

### Automated Testing (Optional)

Use Newman (Postman CLI) for automated testing:

```bash
# Install Newman
npm install -g newman

# Run collection
newman run postman/Product-Image-Upload-Tests.postman_collection.json

# Run with environment
newman run postman/Product-Image-Upload-Tests.postman_collection.json \
  --env-var "baseUrl=http://localhost:5000/api"

# Generate HTML report
newman run postman/Product-Image-Upload-Tests.postman_collection.json \
  --reporters cli,html \
  --reporter-html-export test-results.html
```

## 📚 Additional Resources

- [Multer Documentation](https://github.com/expressjs/multer)
- [Postman File Upload Guide](https://learning.postman.com/docs/sending-requests/requests/#uploading-files)
- [Express Static Files](https://expressjs.com/en/starter/static-files.html)

## ✅ Next Steps

After all tests pass:

1. ✅ Mark task 1.1.1 as complete
2. ✅ Update .gitignore to exclude uploads/
3. ✅ Document API endpoint in README
4. ✅ Move to next task (1.1.2 - already verified)
5. ✅ Continue with frontend implementation

---

**Happy Testing! 🎉**

If you encounter any issues, check the troubleshooting section or review the server logs for detailed error messages.
