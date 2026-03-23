import { apiClient } from './apiClient';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Reservation {
  _id: string;
  user: string | {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  table: string | {
    _id: string;
    tableNumber: number;
    capacity: number;
    location: string;
  };
  date: string;
  timeSlot: string;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  hasPreOrder: boolean;
  preOrder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  table: string;
  date: string;
  timeSlot: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface AvailabilityParams {
  date: string;
  timeSlot: string;
  numberOfGuests: number;
}

export interface AvailableTable {
  _id: string;
  tableNumber: number;
  capacity: number;
  location: string;
}

export const reservationsApi = {
  /**
   * Check table availability (public)
   */
  async checkAvailability(params: AvailabilityParams): Promise<AvailableTable[]> {
    console.log('🔍 [RESERVATIONS API] Checking availability:', params);
    try {
      const response = await apiClient.get<ApiResponse<AvailableTable[]>>('/reservations/availability', { params });
      console.log('✅ [RESERVATIONS API] Available tables:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATIONS API] Failed to check availability');
      throw error;
    }
  },

  /**
   * Create reservation (customer)
   */
  async createReservation(data: CreateReservationData): Promise<Reservation> {
    console.log('➕ [RESERVATIONS API] Creating reservation:', data);
    try {
      const response = await apiClient.post<ApiResponse<Reservation>>('/reservations', data);
      console.log('✅ [RESERVATIONS API] Reservation created:', response.data._id);
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATIONS API] Failed to create reservation');
      throw error;
    }
  },

  /**
   * Get my reservations (customer)
   */
  async getMyReservations(): Promise<Reservation[]> {
    console.log('📋 [RESERVATIONS API] Fetching my reservations');
    try {
      const response = await apiClient.get<ApiResponse<Reservation[]>>('/reservations/my-reservations');
      console.log('✅ [RESERVATIONS API] Reservations fetched:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATIONS API] Failed to fetch reservations');
      throw error;
    }
  },

  /**
   * Get reservation by ID (customer)
   */
  async getReservationById(id: string): Promise<Reservation> {
    console.log('🔍 [RESERVATIONS API] Fetching reservation:', id);
    try {
      const response = await apiClient.get<ApiResponse<Reservation>>(`/reservations/${id}`);
      console.log('✅ [RESERVATIONS API] Reservation fetched');
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATIONS API] Failed to fetch reservation');
      throw error;
    }
  },

  /**
   * Cancel reservation (customer)
   */
  async cancelReservation(id: string): Promise<Reservation> {
    console.log('❌ [RESERVATIONS API] Cancelling reservation:', id);
    try {
      const response = await apiClient.patch<ApiResponse<Reservation>>(`/reservations/${id}/cancel`);
      console.log('✅ [RESERVATIONS API] Reservation cancelled');
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATIONS API] Failed to cancel reservation');
      throw error;
    }
  },

  /**
   * Get all reservations (admin only)
   */
  async getAllReservations(): Promise<Reservation[]> {
    console.log('👨‍💼 [RESERVATIONS API] Fetching all reservations (admin)');
    try {
      const response = await apiClient.get<ApiResponse<Reservation[]>>('/reservations/admin/all');
      console.log('✅ [RESERVATIONS API] All reservations fetched:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATIONS API] Failed to fetch all reservations');
      throw error;
    }
  },

  /**
   * Update reservation status (admin only)
   */
  async updateReservationStatus(id: string, status: string): Promise<Reservation> {
    console.log('🔄 [RESERVATIONS API] Updating reservation status:', { id, status });
    try {
      const response = await apiClient.patch<ApiResponse<Reservation>>(`/reservations/admin/${id}/status`, { status });
      console.log('✅ [RESERVATIONS API] Reservation status updated');
      return response.data;
    } catch (error) {
      console.error('❌ [RESERVATIONS API] Failed to update reservation status');
      throw error;
    }
  },
};
