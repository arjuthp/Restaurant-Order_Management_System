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

const { validateCreateProduct, validateUpdateProduct } = require('../validators/product.validator');


router.get('/', getAllProducts);
router.get('/:id', getProductById);
//admin only

router.post('/', authorize('admin'), uploadProductImage, handleUploadError, validateCreateProduct, createProduct);
router.patch('/:id', authorize('admin'), uploadProductImage, handleUploadError, validateUpdateProduct, updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;
