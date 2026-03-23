const CartService = require('../service/cart.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const cartService = new CartService();

async function getCart(req, res){
    try{
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(successResponse(cart));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function addItemToCart(req, res){
    try{
        const {product_id, quantity} = req.body;

        if(!product_id || !quantity){
            return res.status(400).json(errorResponse('Product ID and quantity are required', 400));
        }
        const cart = await cartService.addItemtoCart(req.user.id, product_id, quantity);
        res.status(200).json(successResponse(cart, 'Item added to cart'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function updateItemQuantity(req, res){
    try{
        const { productId } = req.params;
        const {quantity } = req.body;

        if(quantity === undefined || quantity === null){
            return res.status(400).json(errorResponse('Quantity is required', 400));
        }
        const cart = await cartService.updateItemQuantity(req.user.id, productId, quantity);
        res.status(200).json(successResponse(cart, 'Cart updated'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function removeItemFromCart(req, res){
    try{
        const {productId} = req.params;
        const cart = await cartService.removeItemFromCart(req.user.id, productId);
        res.status(200).json(successResponse(cart, 'Item removed from cart'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function clearCart(req, res){
    try{
        const cart = await cartService.clearCart(req.user.id);
        res.status(200).json(successResponse(cart, 'Cart cleared'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
};
