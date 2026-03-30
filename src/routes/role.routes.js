const express = require('express');
const router = express.Router();
const {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    toggleRoleStatus
} = require('../controllers/role.controller');
const { authorize } = require('../auth/auth.middlewares');

// All routes require admin authorization
router.post('/', authorize('admin'), createRole);
router.get('/', authorize('admin'), getAllRoles);
router.get('/:id', authorize('admin'), getRoleById);
router.put('/:id', authorize('admin'), updateRole);
router.patch('/:id/status', authorize('admin'), toggleRoleStatus);

module.exports = router;
