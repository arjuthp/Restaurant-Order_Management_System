const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartService {

    async getCart(userId){
        let cart = await Cart.findOne({user_id: userId}).populate('items.product_id');

        if(!cart){
            cart = await Cart.create({ user_id: userId,items: [] });
        }
        return cart;
    }

    async addItemtoCart(userId, productId, quantity){
        const product = await Product.findById(productId);
        if(!product){
            throw { status: 404, message: 'Product not found'};
        }
        if(!product.is_available){
            throw {status: 400, message: 'Product is not available'};
        }

    let cart = await Cart.findOne({user_id: userId});
    if(!cart){
        cart = await Cart.create({ user_id: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
        item => item.product_id.toString() === productId.toString()
    );
    if(existingItemIndex > -1){
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].unit_price = product.price * cart.items[existingItemIndex].quantity;
    }else{
        cart.items.push({
            product_id: productId,
            quantity: quantity,
            unit_price: product.price *quantity
        });
    }
    await cart.save();
    return await this.getCart(userId);
    }



    async updateItemQuantity(userId, productId, quantity){
        const cart = await this.getCart(userId);

        const itemIndex = cart.items.findIndex(
            item => item.product_id._id.toString() === productId
        );

        if(itemIndex === -1){
            throw {status: 404, message: 'Item not found in cart'};
        }

        if(quantity <= 0){
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
            const basePrice = cart.items[itemIndex].product_id.price;
            cart.items[itemIndex].unit_price = basePrice * quantity;
        }

        await cart.save();
        return await this.getCart(userId);
    }

    async removeItemFromCart(userId, productId){
        const cart = await this.getCart(userId);

        cart.items = cart.items.filter(
            item => item.product_id._id.toString() !== productId
        );
        await cart.save();
        return await Cart.findOne({user_id:userId}).populate('items.product_id');
    }

    async clearCart(userId){
        const cart = await Cart.findOne({user_id: userId});
        if(!cart){
            throw {status: 404, message: 'Cart not found'};
        }
        cart.items = [];
        await cart.save();
        return cart;
    }

}

module.exports = CartService;