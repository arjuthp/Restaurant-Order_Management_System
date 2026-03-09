const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, getMyProfile, updateMyProfile, deleteMyAccount } = require('../controllers/user.controller');
const { authorize } = require('../auth/auth.middlewares');

// Profile routes (accessible by both customer and admin)
router.get('/me', authorize('customer', 'admin'), getMyProfile);
router.patch('/me', authorize('customer', 'admin'), updateMyProfile);
router.delete('/me', authorize('customer', 'admin'), deleteMyAccount);

// Admin routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);

module.exports = router;