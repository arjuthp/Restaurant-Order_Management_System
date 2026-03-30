import { apiClient } from './apiClient';

export interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  opening_hours?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRestaurantData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  opening_hours?: string;
}

export const restaurantApi = {
  // Get restaurant info (public)
  getRestaurantInfo: async (): Promise<Restaurant> => {
    const response: any = await apiClient.get('/restaurant');
    return response.data;
  },

  // Update restaurant info (admin only)
  updateRestaurantInfo: async (data: UpdateRestaurantData): Promise<Restaurant> => {
    const response: any = await apiClient.patch('/restaurant', data);
    return response.data;
  },
};
