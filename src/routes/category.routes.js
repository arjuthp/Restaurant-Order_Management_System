const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
    getCategoryProducts
} = require('../controllers/category.controller');
const { authorize } = require('../auth/auth.middlewares');

// Public routes
router.get('/', getAllCategories);
router.get('/:id/products', getCategoryProducts);  // Must come before /:id
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', authorize('admin'), createCategory);
router.patch('/:id', authorize('admin'), updateCategory);
router.patch('/:id/toggle', authorize('admin'), toggleCategoryStatus);
router.delete('/:id', authorize('admin'), deleteCategory);

module.exports = router;
