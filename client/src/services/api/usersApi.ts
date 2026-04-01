import { apiClient } from './apiClient';

export interface User {
  _id: string;
  id?: string; // Backend returns 'id' instead of '_id'
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: 'customer' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const usersApi = {
  getMyProfile: async (): Promise<User> => {
    console.log('👤 [USERS API] Fetching my profile');
    try {
      const response = await apiClient.get<ApiResponse<User>>('/users/me');
      console.log('✅ [USERS API] Profile fetched:', {
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
      // Normalize id to _id for consistency
      return {
        ...response.data,
        _id: response.data.id || response.data._id,
      };
    } catch (error) {
      console.error('❌ [USERS API] Failed to fetch profile');
      throw error;
    }
  },

  updateMyProfile: async (data: UpdateProfileData): Promise<User> => {
    console.log('✏️  [USERS API] Updating profile:', data);
    try {
      const response = await apiClient.patch<ApiResponse<User>>('/users/me', data);
      console.log('✅ [USERS API] Profile updated');
      // Normalize id to _id for consistency
      return {
        ...response.data,
        _id: response.data.id || response.data._id,
      };
    } catch (error) {
      console.error('❌ [USERS API] Failed to update profile');
      throw error;
    }
  },

  deleteMyAccount: async (): Promise<void> => {
    console.log('🗑️  [USERS API] Deleting account');
    try {
      await apiClient.delete<ApiResponse<any>>('/users/me');
      console.log('✅ [USERS API] Account deleted successfully');
    } catch (error) {
      console.error('❌ [USERS API] Failed to delete account');
      throw error;
    }
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async (page: number = 1, limit: number = 10): Promise<User[]> => {
    console.log('👨‍💼 [USERS API] Fetching all users (admin)');
    try {
      const response = await apiClient.get<ApiResponse<User[]>>(`/users?page=${page}&limit=${limit}`);
      console.log('✅ [USERS API] All users fetched:', response.data.length);
      // Normalize id to _id for consistency
      const normalizedUsers = response.data.map(user => ({
        ...user,
        _id: user.id || user._id,
      }));
      return normalizedUsers;
    } catch (error) {
      console.error('❌ [USERS API] Failed to fetch all users');
      throw error;
    }
  },

  /**
   * Get user by ID (admin only)
   */
  getUserById: async (userId: string): Promise<User> => {
    console.log('🔍 [USERS API] Fetching user:', userId);
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`);
      console.log('✅ [USERS API] User fetched:', response.data.name);
      // Normalize id to _id for consistency
      return {
        ...response.data,
        _id: response.data.id || response.data._id,
      };
    } catch (error) {
      console.error('❌ [USERS API] Failed to fetch user');
      throw error;
    }
  },
};
