import { apiClient } from './apiClient';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMetadata;
  message?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  image_url: string | null;
  images: string[];
  quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  is_available: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  pagination: PaginationMetadata;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  images?: string[];
  is_available: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image_url?: string;
  images?: string[];
  is_available?: boolean;
}

export const productsApi = {
  getAll: async (params?: { search?: string; category?: string; available?: boolean; page?: number; limit?: number }): Promise<PaginatedProductsResponse> => {
    console.log('🍽️  [PRODUCTS API] Fetching products:', params);
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products', { params });
      console.log('✅ [PRODUCTS API] Products fetched:', {
        count: response.data.length,
        page: response.pagination?.currentPage,
        total: response.pagination?.totalItems
      });
      return {
        products: response.data,
        pagination: response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data.length,
          itemsPerPage: response.data.length,
        },
      };
    } catch (error) {
      console.error('❌ [PRODUCTS API] Failed to fetch products');
      throw error;
    }
  },

  getById: async (id: string): Promise<Product> => {
    console.log('🔍 [PRODUCTS API] Fetching product:', id);
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      console.log('✅ [PRODUCTS API] Product fetched:', response.data.name);
      return response.data;
    } catch (error) {
      console.error('❌ [PRODUCTS API] Failed to fetch product');
      throw error;
    }
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    console.log('📂 [PRODUCTS API] Fetching products by category:', category);
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(`/products/category/${category}`);
      console.log('✅ [PRODUCTS API] Products fetched:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ [PRODUCTS API] Failed to fetch products by category');
      throw error;
    }
  },

  create: async (data: CreateProductData): Promise<Product> => {
    console.log('➕ [PRODUCTS API] Creating product:', data.name);
    try {
      const response = await apiClient.post<ApiResponse<Product>>('/products', data);
      console.log('✅ [PRODUCTS API] Product created:', response.data._id);
      return response.data;
    } catch (error) {
      console.error('❌ [PRODUCTS API] Failed to create product');
      throw error;
    }
  },

  createWithImage: (formData: FormData) => {
    console.log('➕ [PRODUCTS API] Creating product with image');
    return apiClient.postFormData<Product>('/products', formData);
  },

  update: async (id: string, data: UpdateProductData): Promise<Product> => {
    console.log('✏️  [PRODUCTS API] Updating product:', id);
    try {
      const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data);
      console.log('✅ [PRODUCTS API] Product updated');
      return response.data;
    } catch (error) {
      console.error('❌ [PRODUCTS API] Failed to update product');
      throw error;
    }
  },

  updateWithImage: (id: string, formData: FormData) => {
    console.log('✏️  [PRODUCTS API] Updating product with image:', id);
    return apiClient.patchFormData<Product>(`/products/${id}`, formData);
  },

  delete: async (id: string): Promise<void> => {
    console.log('🗑️  [PRODUCTS API] Deleting product:', id);
    try {
      await apiClient.delete<ApiResponse<null>>(`/products/${id}`);
      console.log('✅ [PRODUCTS API] Product deleted');
    } catch (error) {
      console.error('❌ [PRODUCTS API] Failed to delete product');
      throw error;
    }
  },

  updateStock: async (id: string, quantity: number, operation: 'add' | 'set' = 'add'): Promise<Product> => {
    console.log('📦 [PRODUCTS API] Updating stock:', { id, quantity, operation });
    try {
      const response = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/stock`, {
        quantity,
        operation
      });
      console.log('✅ [PRODUCTS API] Stock updated');
      return response.data;
    } catch (error) {
      console.error('❌ [PRODUCTS API] Failed to update stock');
      throw error;
    }
  },
};
