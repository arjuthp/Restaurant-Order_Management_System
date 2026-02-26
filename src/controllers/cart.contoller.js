const CartService = require('../service/cart.service');

const cartService = new CartService();

async function getCart(req, res){
    try{
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(cart);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function addItemToCart(req, res){
    try{
        const {product_id, quantity} = req.body;

        if(!product_id || !quantity){
            return res.status(400).json({message: 'Product ID and quantity are required'});
        }
        const cart = await cartService.addItemtoCart(req.user.id, product_id, quantity);
        res.status(200).json(cart);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function updateItemQuantity(req, res){
    try{
        const { productId } = req.params;
        const {quantity } = req.body;

        if(quantity === undefined || quantity === null){
            return res.status(400).json({message: 'Quantity is required'});
        }
        const cart = await cartService.updateItemQuantity(req.user.id, productId, quantity);
        res.status(200).json(cart);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function removeItemFromCart(req, res){
    try{
        const {productId} = req.params;
        const cart = await cartService.removeItemFromCart(req.user.id, productId);
        res.status(200).json(cart);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function clearCart(req, res){
    try{
        const cart = await cartService.clearCart(req.user.id);
        res.status(200).json({message: 'Cart cleared', cart});
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

module.exports = {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
};
