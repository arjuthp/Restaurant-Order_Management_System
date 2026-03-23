import { apiClient } from './apiClient';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

interface OrderItem {
  product_id: string | Product;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  _id: string;
  user_id: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  notes?: string;
  orderType?: 'dine-in' | 'takeout' | 'delivery';
  subtotal?: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrderRequest {
  itemsToOrder?: string[]; // Array of product IDs to order (if not provided, orders all cart items)
  notes?: string;
}

interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: PaginationMetadata;
}

interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const ordersApi = {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    console.log('📦 [ORDERS API] Creating order:', data);
    try {
      const response = await apiClient.post<{ success: boolean; data: Order }>('/orders', data);
      console.log('✅ [ORDERS API] Order created successfully:', {
        orderId: response.data._id,
        totalPrice: response.data.total_price,
        itemCount: response.data.items.length
      });
      return response.data;
    } catch (error) {
      console.error('❌ [ORDERS API] Failed to create order');
      throw error;
    }
  },

  /**
   * Get all orders for the current user with pagination
   */
  async getMyOrders(params?: OrdersQueryParams): Promise<{ orders: Order[]; pagination: PaginationMetadata }> {
    console.log('📋 [ORDERS API] Fetching my orders:', params);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<PaginatedResponse<Order[]>>(url);
      console.log('✅ [ORDERS API] Orders fetched:', {
        count: response.data.length,
        page: response.pagination.currentPage,
        total: response.pagination.totalItems
      });
      return {
        orders: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('❌ [ORDERS API] Failed to fetch orders');
      throw error;
    }
  },

  /**
   * Get a specific order by ID (customer)
   */
  async getOrderById(orderId: string): Promise<Order> {
    console.log('🔍 [ORDERS API] Fetching order:', orderId);
    try {
      const response = await apiClient.get<{ success: boolean; data: Order }>(`/orders/${orderId}`);
      console.log('✅ [ORDERS API] Order fetched:', {
        orderId: response.data._id,
        status: response.data.status
      });
      return response.data;
    } catch (error) {
      console.error('❌ [ORDERS API] Failed to fetch order');
      throw error;
    }
  },

  /**
   * Get a specific order by ID (admin)
   */
  async getOrderByIdAdmin(orderId: string): Promise<Order> {
    console.log('🔍 [ORDERS API] Fetching order (admin):', orderId);
    try {
      const response = await apiClient.get<{ success: boolean; data: Order }>(`/orders/admin/${orderId}`);
      console.log('✅ [ORDERS API] Order fetched (admin):', {
        orderId: response.data._id,
        status: response.data.status
      });
      return response.data;
    } catch (error) {
      console.error('❌ [ORDERS API] Failed to fetch order (admin)');
      throw error;
    }
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<Order> {
    console.log('❌ [ORDERS API] Cancelling order:', orderId);
    try {
      const response = await apiClient.patch<{ success: boolean; data: Order }>(`/orders/${orderId}/cancel`);
      console.log('✅ [ORDERS API] Order cancelled successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [ORDERS API] Failed to cancel order');
      throw error;
    }
  },

  /**
   * Get all orders (admin only) with pagination
   */
  async getAllOrders(params?: OrdersQueryParams): Promise<{ orders: Order[]; pagination: PaginationMetadata }> {
    console.log('👨‍💼 [ORDERS API] Fetching all orders (admin):', params);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const url = `/orders/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<PaginatedResponse<Order[]>>(url);
      console.log('✅ [ORDERS API] All orders fetched:', {
        count: response.data.length,
        page: response.pagination.currentPage,
        total: response.pagination.totalItems
      });
      return {
        orders: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('❌ [ORDERS API] Failed to fetch all orders');
      throw error;
    }
  },

  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    console.log('🔄 [ORDERS API] Updating order status:', { orderId, status });
    try {
      const response = await apiClient.patch<{ success: boolean; data: Order }>(`/orders/${orderId}/status`, { status });
      console.log('✅ [ORDERS API] Order status updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [ORDERS API] Failed to update order status');
      throw error;
    }
  },
};
