import { apiClient } from './apiClient';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  location: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableData {
  tableNumber: number;
  capacity: number;
  location: string;
  isAvailable?: boolean;
}

export interface UpdateTableData {
  tableNumber?: number;
  capacity?: number;
  location?: string;
  isAvailable?: boolean;
}

export const tablesApi = {
  /**
   * Get all tables (public)
   */
  async getAllTables(): Promise<Table[]> {
    console.log('🪑 [TABLES API] Fetching all tables');
    try {
      const response = await apiClient.get<ApiResponse<Table[]>>('/tables');
      console.log('✅ [TABLES API] Tables fetched:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ [TABLES API] Failed to fetch tables');
      throw error;
    }
  },

  /**
   * Get table by ID (public)
   */
  async getTableById(id: string): Promise<Table> {
    console.log('🔍 [TABLES API] Fetching table:', id);
    try {
      const response = await apiClient.get<ApiResponse<Table>>(`/tables/${id}`);
      console.log('✅ [TABLES API] Table fetched:', response.data.tableNumber);
      return response.data;
    } catch (error) {
      console.error('❌ [TABLES API] Failed to fetch table');
      throw error;
    }
  },

  /**
   * Create table (admin only)
   */
  async createTable(data: CreateTableData): Promise<Table> {
    console.log('➕ [TABLES API] Creating table:', data.tableNumber);
    try {
      const response = await apiClient.post<ApiResponse<Table>>('/tables', data);
      console.log('✅ [TABLES API] Table created:', response.data._id);
      return response.data;
    } catch (error) {
      console.error('❌ [TABLES API] Failed to create table');
      throw error;
    }
  },

  /**
   * Update table (admin only)
   */
  async updateTable(id: string, data: UpdateTableData): Promise<Table> {
    console.log('✏️ [TABLES API] Updating table:', id);
    try {
      const response = await apiClient.put<ApiResponse<Table>>(`/tables/${id}`, data);
      console.log('✅ [TABLES API] Table updated');
      return response.data;
    } catch (error) {
      console.error('❌ [TABLES API] Failed to update table');
      throw error;
    }
  },

  /**
   * Delete table (admin only)
   */
  async deleteTable(id: string): Promise<void> {
    console.log('🗑️ [TABLES API] Deleting table:', id);
    try {
      await apiClient.delete<ApiResponse<null>>(`/tables/${id}`);
      console.log('✅ [TABLES API] Table deleted');
    } catch (error) {
      console.error('❌ [TABLES API] Failed to delete table');
      throw error;
    }
  },
};
