import api from './api';

const cartService = {
  // Get cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (product_id, quantity) => {
    const response = await api.post('/cart/items', { product_id, quantity });
    return response.data;
  },

  // Update item quantity
  updateQuantity: async (productId, quantity) => {
    const response = await api.patch(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeItem: async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  }
};

export default cartService;
