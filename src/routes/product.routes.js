const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');
const { authorize } = require('../auth/auth.middlewares');
const { uploadProductImage, handleUploadError } = require('../middlewares/upload.middleware');


router.get('/', getAllProducts);
router.get('/:id', getProductById);
//admin only

router.post('/', authorize('admin'), uploadProductImage, handleUploadError, createProduct);
router.patch('/:id', authorize('admin'), uploadProductImage, handleUploadError, updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;
