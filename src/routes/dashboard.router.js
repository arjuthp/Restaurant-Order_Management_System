const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { authorize } = require('../auth/auth.middlewares');

// Admin only - get dashboard statistics
router.get('/stats', authorize('admin'), getDashboardStats);

module.exports = router;
