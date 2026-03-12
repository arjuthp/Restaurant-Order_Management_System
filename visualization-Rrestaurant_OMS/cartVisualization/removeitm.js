/***
 * PURPOSE=> removes specific item from user's cart completely
 * INPUTS(params)=> userId, productId
 * checks=> cart existence, item existence in cart
 * actions=> get cart, filter out specific item, save cart, return updated cart with populated products
 * o/p=> updated cart object without the removed item
 */

//REQUEST DETAILS:
//Method: DELETE, Route: DELETE /api/cart/item/:productId
//Body: none, Headers: Authorization: "Bearer token"
//Params: productId (from URL), Auth: required

//Check 1: Cart Existence => this.getCart(userId)
//Check 2: Item Existence => filter() removes if exists

const Cart = require('../models/Cart');

async function removeItemFromCartService(userId, productId) {
    //SECTION 1: Get cart
    const cart = await this.getCart(userId);

    //SECTION 2: Filter out item
    cart.items = cart.items.filter(
        item => item.product_id._id.toString() !== productId
    );

    //SECTION 3: Save changes
    await cart.save();

    //SECTION 4: Return populated cart
    //WHY: cart.save() persists changes, findOne().populate() returns fresh cart with full product details
    return await Cart.findOne({user_id: userId}).populate('items.product_id');
}

module.exports = { removeItemFromCartService };