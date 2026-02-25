const express = require('express');
const router = express.Router();
const {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
} = require('../controllers/cart.contoller');
const { authorize } = require('../auth/auth.middlewares');

//all cart routes are customer only
router.get('/', authorize('customer'), getCart);
router.post('/items', authorize('customer'), addItemToCart);
router.patch('/items/:productId', authorize('customer'), updateItemQuantity);
router.delete('/items/:productId', authorize('customer'), removeItemFromCart);
router.delete('/', authorize('customer'), clearCart);

module.exports = router;
