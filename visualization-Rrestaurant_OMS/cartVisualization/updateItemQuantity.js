const CartService = require('../service/cart.service');
const cartService = new CartService();

async function updateItemQuantity(req, res) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ message: 'Quantity is required' });
    }
    
    const cart = await cartService.updateItemQuantity(req.user.id, productId, quantity);
    res.status(200).json(cart);
  } catch(error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
}

module.exports = { updateItemQuantity };
