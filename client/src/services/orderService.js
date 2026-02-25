import api from './api';

const orderService = {
  // Create order
  createOrder: async (notes = '') => {
    const response = await api.post('/orders', { notes });
    return response.data;
  },

  // Get my orders
  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get single order
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  // Get all orders (admin)
  getAllOrders: async () => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },

  // Update order status (admin)
  updateOrderStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
};

export default orderService;
