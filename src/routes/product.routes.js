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


router.get('/', getAllProducts);
router.get('/:id', getProductById);

//admin only
router.post('/', authorize('admin'), createProduct);
router.patch('/:id', authorize('admin'), updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;
