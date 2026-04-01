import { apiClient } from './apiClient';

export interface DashboardStats {
  products: {
    total: number;
    available: number;
    outOfStock: number;
  };
  orders: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    statusBreakdown: Array<{ _id: string; count: number }>;
  };
  carts: {
    activeCarts: number;
    totalCartItems: number;
  };
  users: {
    totalUsers: number;
    activeCustomers: number;
  };
  categories: Array<{ category: string; count: number }>;
  recentActivity: Array<{
    _id: string;
    total_price: number;
    status: string;
    createdAt: string;
    user_id: {
      name: string;
      email: string;
    };
  }>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },
};
