const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock
} = require('../controllers/product.controller');
const { authorize } = require('../auth/auth.middlewares');
const { uploadProductImage, uploadProductImages, handleUploadError } = require('../middlewares/upload.middleware');

const { validateCreateProduct, validateUpdateProduct } = require('../validators/product.validator');


router.get('/', getAllProducts);
router.get('/:id', getProductById);
//admin only

router.post('/', authorize('admin'), uploadProductImages, handleUploadError, validateCreateProduct, createProduct);
router.patch('/:id', authorize('admin'), uploadProductImages, handleUploadError, validateUpdateProduct, updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

router.patch('/:id/stock', authorize('admin'), updateProductStock);
module.exports = router;
