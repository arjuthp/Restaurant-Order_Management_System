/***
 * PURPOSE=>adds item to cart , u
 * pdate quqnatity
 * 
 * inputs=> userid=> req.user.id(auth), productId, quantity=> req.body
 * checks=> Product existsnce 
 * -product availability
 * -cart existence
 * item existence in cart already ? or need to be added
 * 
 * Actions=> find product, validate availabitly of product, find/create cart,update/add item , save
 * updated cart
 */ 
/***
 * PURPOSE=>adds item to cart , update quantity
 * 
 * inputs=> userid=> req.user.id(auth), productId, quantity=> req.body
 * checks=> Product existence 
 * -product availability
 * -cart existence
 * item existence in cart already ? or need to be added
 * 
 * Actions=> find product, validate availability of product, find/create cart,update/add item , save
 * updated cart
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');

//COMBINED FUNCTION: Both controller and service logic in one
async function addItemtoCart(req, res) {
    try {
        //Extract from request
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        //Check 1: Product existence
        const product = await Product.findById(productId);
        if(!product) {
            throw { status: 404, message: 'Product not found'};
        }

        //Check 2: Product availability
        if(!product.is_available) {
            throw {status: 400, message: 'Product is not available'};
        }

        //Check 3: Cart existence
        let cart = await Cart.findOne({user_id: userId});
        if(!cart) {
            cart = await Cart.create({ user_id: userId, items: [] });
        }

        //Check 4: Item existence in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product_id.toString() === productId.toString()
        );
        
        //Action: Update existing or add new item
        if(existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].total_price = product.price * cart.items[existingItemIndex].quantity;
        } else {
            cart.items.push({
                product_id: productId,
                quantity: quantity,
                total_price: product.price * quantity
            });
        }
        
        //Save and return response
        await cart.save();
        res.status(200).json(cart);
        
    } catch(error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
}

module.exports = { addItemtoCart };