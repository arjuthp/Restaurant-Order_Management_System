import api from './api';

const restaurantService = {
  getRestaurantInfo: async () => {
    const response = await api.get('/restaurant');
    return response.data;
  },

  updateRestaurantInfo: async (updateData) => {
    const response = await api.patch('/restaurant', updateData);
    return response.data;
  }
};

export default restaurantService;
