const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/order.controller');
const { authorize } = require('../auth/auth.middlewares');

//customer routes
router.post('/', authorize('customer'), createOrder);
router.get('/', authorize('customer'), getMyOrders);
router.get('/:id', authorize('customer'), getOrderById);
router.delete('/:id', authorize('customer'), cancelOrder);

//Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.patch('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;