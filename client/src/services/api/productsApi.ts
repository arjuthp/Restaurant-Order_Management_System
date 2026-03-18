import { apiClient } from './apiClient';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const productsApi = {
  getAll: () =>
    apiClient.get<Product[]>('/products'),

  getById: (id: string) =>
    apiClient.get<Product>(`/products/${id}`),

  getByCategory: (category: string) =>
    apiClient.get<Product[]>(`/products/category/${category}`),
};
