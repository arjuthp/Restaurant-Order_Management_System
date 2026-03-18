import { apiClient } from './apiClient';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user_id: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrderRequest {
  itemsToOrder?: Array<{
    product_id: string;
    quantity: number;
  }>;
  notes?: string;
}

export const ordersApi = {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('/orders', data);
  },

  /**
   * Get all orders for the current user
   */
  async getMyOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/orders');
  },

  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${orderId}/cancel`);
  },
};
