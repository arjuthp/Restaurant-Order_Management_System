/***
 * PURPOSE=> updates item quantity in cart, removes item if quantity is 0 or less
 * INPUTS(params)=> userId, productId, quantity
 * checks=> cart existence, item existence in cart, quantity validation
 * actions=> get cart, find item, update quantity or remove item, save cart, return updated cart
 * o/p=> updated cart object
 */

//CODE SECTION 1: Get user's cart
//PURPOSE: Retrieve or create the user's shopping cart
//METHOD: Calls this.getCart() which handles cart creation if none exists
const cart = await this.getCart(userId);

//CODE SECTION 2: Find specific item in cart
//PURPOSE: Locate the product to update within the cart's items array
//METHOD: findIndex() searches array by comparing product IDs
const itemIndex = cart.items.findIndex(
    item => item.product_id._id.toString() === productId
);

//CODE SECTION 3: Validate item exists
//PURPOSE: Ensure the product is actually in the cart before updating
//METHOD: Check if findIndex returned -1 (not found)
if(itemIndex === -1) {
    throw {status: 404, message: 'Item not found in cart'};
}

//CODE SECTION 4: Handle quantity update or removal
//PURPOSE: Either update quantity or remove item based on quantity value
//METHOD: Conditional logic - if quantity <= 0 remove, else update
if(quantity <= 0) {
    //SUB-SECTION: Remove item from cart
    //METHOD: splice() removes 1 element at itemIndex position
    cart.items.splice(itemIndex, 1);
} else {
    //SUB-SECTION: Update existing item
    //METHOD 1: Direct property assignment for quantity
    cart.items[itemIndex].quantity = quantity;
    
    //METHOD 2: Extract base price from populated product
    //PURPOSE: Get single unit price from product document
    const basePrice = cart.items[itemIndex].product_id.price;
    
    //METHOD 3: Recalculate total price
    //PURPOSE: Update total cost for new quantity
    cart.items[itemIndex].total_price = basePrice * quantity;
}

//CODE SECTION 5: Save changes and return
//PURPOSE: Persist cart changes to database and return updated cart
//METHOD: Mongoose save() method
await cart.save();
return cart;