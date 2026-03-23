import { apiClient } from './apiClient';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRestaurantData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  description?: string;
}

export const restaurantApi = {
  /**
   * Get restaurant info (public)
   */
  async getRestaurantInfo(): Promise<Restaurant> {
    console.log('🏪 [RESTAURANT API] Fetching restaurant info');
    try {
      const response = await apiClient.get<ApiResponse<Restaurant>>('/restaurant');
      console.log('✅ [RESTAURANT API] Restaurant info fetched:', response.data.name);
      return response.data;
    } catch (error) {
      console.error('❌ [RESTAURANT API] Failed to fetch restaurant info');
      throw error;
    }
  },

  /**
   * Update restaurant info (admin only)
   */
  async updateRestaurantInfo(data: UpdateRestaurantData): Promise<Restaurant> {
    console.log('✏️ [RESTAURANT API] Updating restaurant info');
    try {
      const response = await apiClient.patch<ApiResponse<Restaurant>>('/restaurant', data);
      console.log('✅ [RESTAURANT API] Restaurant info updated');
      return response.data;
    } catch (error) {
      console.error('❌ [RESTAURANT API] Failed to update restaurant info');
      throw error;
    }
  },
};
