import { apiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      phone?: string;
      address?: string;
    };
  };
  message?: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    console.log('🔐 [AUTH API] Attempting login:', { email: credentials.email });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      console.log('✅ [AUTH API] Login successful:', {
        user: response.data.user.name,
        role: response.data.user.role
      });
      return response;
    } catch (error) {
      console.error('❌ [AUTH API] Login failed');
      throw error;
    }
  },

  adminLogin: async (credentials: LoginCredentials) => {
    console.log('🔐 [AUTH API] Attempting admin login:', { email: credentials.email });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/admin/login', credentials);
      console.log('✅ [AUTH API] Admin login successful:', {
        user: response.data.user.name,
        role: response.data.user.role
      });
      return response;
    } catch (error) {
      console.error('❌ [AUTH API] Admin login failed');
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    console.log('📝 [AUTH API] Attempting registration:', { 
      name: data.name, 
      email: data.email 
    });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      console.log('✅ [AUTH API] Registration successful:', {
        user: response.data.user.name
      });
      return response;
    } catch (error) {
      console.error('❌ [AUTH API] Registration failed');
      throw error;
    }
  },

  logout: async (refreshToken: string) => {
    console.log('🚪 [AUTH API] Attempting logout');
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/logout', { refreshToken });
      console.log('✅ [AUTH API] Logout successful');
      return response;
    } catch (error) {
      console.error('❌ [AUTH API] Logout failed');
      throw error;
    }
  },

  refreshToken: async (refreshToken: string) => {
    console.log('🔄 [AUTH API] Refreshing token');
    try {
      const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
      console.log('✅ [AUTH API] Token refresh successful');
      return response;
    } catch (error) {
      console.error('❌ [AUTH API] Token refresh failed');
      throw error;
    }
  },
};
