const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, getMyProfile, updateMyProfile, deleteMyAccount } = require('../controllers/user.controller');
const { authorize } = require('../auth/auth.middlewares');

// Customer routes (specific routes FIRST)
router.get('/me', authorize('customer'), getMyProfile);
router.patch('/me', authorize('customer'), updateMyProfile);
router.delete('/me', authorize('customer'), deleteMyAccount);

// Admin routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);

module.exports = router;