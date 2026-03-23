const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    createPreOrderForReservation
} = require('../controllers/order.controller');
const { authorize } = require('../auth/auth.middlewares');
const { validateCreateOrder, validateUpdateOrderStatus } = require('../validators/order.validator');

// IMPORTANT: Admin routes with specific paths MUST come before parameterized routes
// Otherwise /:id will match /admin/all and treat "admin" as an ID

//Admin routes - These must come FIRST
router.get('/admin/all', authorize('admin'), getAllOrders);
router.get('/admin/:id', authorize('admin'), getOrderById);
router.patch('/:id/status', authorize('admin'), validateUpdateOrderStatus, updateOrderStatus);

//Customer routes - These come AFTER admin routes
router.post('/', authorize('customer'), validateCreateOrder, createOrder);
router.post('/pre-order/:reservationId', authorize('customer'), createPreOrderForReservation);
router.get('/', authorize('customer'), getMyOrders);
router.get('/:id', authorize('customer'), getOrderById);
router.delete('/:id', authorize('customer'), cancelOrder);

module.exports = router;