const multer = require('multer'); //import multer library //=> multer handles multipart/form-data
const path = require('path'); // node path import garxa for file handling

//configure storage
const storage = multer.diskStorage({ //tells where to and how to save files 
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/products/')); // Save to src/uploads/products/
    },
    filename: function (req, file, cb){
        //generates unique filename : timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
    }
});

//File Filter - only accept JPEG, PNG, WebP
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
    }
};

//multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

//export middleware
//middleware for single image upload
const uploadProductImage = upload.single('image');

//Error handling middleware for multer errors
const handleUploadError = (err, req, res, next) => {
    if(err instanceof multer.MulterError){
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({
                success: false,  // ← Fixed typo here!
                error: {
                    message: 'File size exceeds 5MB limit',
                    status: 400
                }
            });
        }
        return res.status(400).json({
            success: false,
            error: {
                message: err.message,
                status: 400
            }
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            error: {
                message: err.message,
                status: 400
            }
        });
    }
    next();
};

module.exports = {
    uploadProductImage,
    handleUploadError
};
