const express = require('express');
const router = express.Router();
const {
    createStaff,
    getAllStaff,
    getStaffById,
    updateStaff,
    toggleStaffStatus
} = require('../controllers/staff.controller');
const { authorize } = require('../auth/auth.middlewares');

// All routes require admin authorization
router.post('/', authorize('admin'), createStaff);
router.get('/', authorize('admin'), getAllStaff);
router.get('/:id', authorize('admin'), getStaffById);
router.put('/:id', authorize('admin'), updateStaff);
router.patch('/:id/status', authorize('admin'), toggleStaffStatus);

module.exports = router;
