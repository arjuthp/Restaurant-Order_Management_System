import { apiClient } from './apiClient';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithProducts {
  category: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  };
  products: any[];
  count: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const categoriesApi = {
  // Get all categories
  getAll: async (includeInactive: boolean = false): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories', {
      params: { includeInactive }
    });
    return response.data;
  },

  // Get single category
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  // Create category
  create: async (data: { name: string; description?: string }): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  // Update category
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  // Toggle category status
  toggleStatus: async (id: string): Promise<Category> => {
    const response = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}/toggle`);
    return response.data;
  },

  // Get products by category
  getCategoryProducts: async (id: string): Promise<CategoryWithProducts> => {
    const response = await apiClient.get<ApiResponse<CategoryWithProducts>>(`/categories/${id}/products`);
    return response.data;
  },
};
