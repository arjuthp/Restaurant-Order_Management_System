const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

// Configure multer for temporary file storage
const upload = multer({ 
  dest: 'temp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Upload multiple images to Kaha CDN
router.post('/kaha/multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedUrls = [];
    const errors = [];

    // Upload each file to Kaha API
    for (const file of req.files) {
      try {
        const formData = new FormData();
        formData.append('files', fs.createReadStream(file.path), {
          filename: file.originalname,
          contentType: file.mimetype
        });

        // Upload to Kaha API
        const response = await axios.post(
          'https://dev.kaha.com.np/main/api/v3/uploads/array',
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              'accept': '*/*'
            },
            timeout: 30000 // 30 second timeout
          }
        );

        // Extract fileUrl from response
        if (response.data && response.data.fileUrls && response.data.fileUrls.length > 0) {
          const fileUrl = response.data.fileUrls[0].fileUrl;
          uploadedUrls.push(fileUrl);
        } else {
          errors.push({ file: file.originalname, error: 'No URL returned from Kaha' });
        }

        // Clean up temp file
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error(`Error uploading ${file.originalname} to Kaha:`, error.message);
        errors.push({ 
          file: file.originalname, 
          error: error.response?.data?.message || error.message 
        });
        
        // Clean up temp file even on error
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      }
    }

    // Return results
    if (uploadedUrls.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload any images to Kaha CDN',
        errors
      });
    }

    res.json({
      success: true,
      message: `Successfully uploaded ${uploadedUrls.length} of ${req.files.length} images`,
      data: {
        urls: uploadedUrls,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up any remaining temp files
    if (req.files) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// Upload single image to Kaha CDN
router.post('/kaha/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const formData = new FormData();
    formData.append('files', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Upload to Kaha API
    const response = await axios.post(
      'https://dev.kaha.com.np/main/api/v3/uploads/array',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'accept': '*/*'
        },
        timeout: 30000
      }
    );

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    // Extract fileUrl from response
    if (response.data && response.data.fileUrls && response.data.fileUrls.length > 0) {
      const fileUrl = response.data.fileUrls[0].fileUrl;
      
      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: fileUrl
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'No URL returned from Kaha CDN'
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up temp file
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload image to Kaha CDN',
      error: error.response?.data?.message || error.message
    });
  }
});

module.exports = router;
