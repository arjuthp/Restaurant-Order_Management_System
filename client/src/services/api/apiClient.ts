import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '@/shared/config/env';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🌐 [API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params
        });
        
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔑 [API REQUEST] Auth token attached');
        } else {
          console.warn('⚠️  [API REQUEST] No auth token found');
        }
        return config;
      },
      (error) => {
        console.error('❌ [API REQUEST] Request setup failed:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ [API RESPONSE] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        return response;
      },
      async (error) => {
        // Log detailed error information to console
        console.error(`❌ [API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });

        const originalRequest = error.config;

        // Handle 401 and retry with refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('🔄 [API AUTH] 401 detected, attempting token refresh...');
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              console.error('❌ [API AUTH] No refresh token available');
              throw new Error('No refresh token');
            }

            console.log('🔄 [API AUTH] Refreshing access token...');
            const response = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            console.log('✅ [API AUTH] Token refreshed successfully');

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            console.log('🔄 [API AUTH] Retrying original request...');
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error('❌ [API AUTH] Token refresh failed:', refreshError);
            console.log('🚪 [API AUTH] Redirecting to login...');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async postFormData<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T }> = await this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Call the progress callback if provided
          if (config?.onUploadProgress) {
            config.onUploadProgress(progressEvent);
          }
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      },
    });
    return response.data.data;
  }

  async patchFormData<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T }> = await this.client.patch(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Call the progress callback if provided
          if (config?.onUploadProgress) {
            config.onUploadProgress(progressEvent);
          }
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      },
    });
    return response.data.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
