/***
 * PURPOSE=> creates order from user's cart, clears cart after order creation
 * INPUTS(params)=> userId, notes (optional)
 * checks=> cart existence, cart not empty, product availability
 * actions=> get populated cart, calculate total, create order, clear cart, return populated order
 * o/p=> created order object with populated product details
 */

//REQUEST DETAILS:
//Method: POST, Route: POST /api/orders/create
//Body: { notes: "string" (optional) }
//Headers: Authorization: "Bearer token"
//Params: none, Auth: required (userId from req.user.id)

//Check 1: Cart Existence & Not Empty
//Action => Cart.findOne().populate() + check items.length
//If fail => throw {status: 400, message: 'Cart is empty'}

const Cart = require('../models/Cart');
const Order = require('../models/Order');

async function createOrderService(userId, itemsToOrder= null, notes = null) {
   const cart = await Cart.findOne({user_id: userId}).populate('items.product_id')
}