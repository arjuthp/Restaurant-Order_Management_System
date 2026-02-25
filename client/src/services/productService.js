import api from './api';

const productService = {
  // Get all products
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // Get single product
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product (admin)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export default productService;
