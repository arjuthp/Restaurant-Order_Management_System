import { apiClient } from './apiClient';
import { Role } from './rolesApi';

export interface Staff {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  roleId: Role;
  employeeId: string;
  hireDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  roleId: string;
  employeeId?: string;
  hireDate?: string;
}

export interface UpdateStaffData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  roleId?: string;
  employeeId?: string;
  hireDate?: string;
}

export interface StaffFilters {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface StaffResponse {
  staff: Staff[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const staffApi = {
  // Get all staff
  getAllStaff: async (filters?: StaffFilters): Promise<StaffResponse> => {
    const response: any = await apiClient.get('/admin/staff', { params: filters });
    // Handle response format
    const data = response.data || response;
    return {
      staff: data,
      pagination: response.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: Array.isArray(data) ? data.length : 0,
        itemsPerPage: 10,
      },
    };
  },

  // Get staff by ID
  getStaffById: async (id: string): Promise<Staff> => {
    const response: any = await apiClient.get(`/admin/staff/${id}`);
    return response.data || response;
  },

  // Create staff
  createStaff: async (data: CreateStaffData): Promise<Staff> => {
    const response: any = await apiClient.post('/admin/staff', data);
    return response.data || response;
  },

  // Update staff
  updateStaff: async (id: string, data: UpdateStaffData): Promise<Staff> => {
    const response: any = await apiClient.put(`/admin/staff/${id}`, data);
    return response.data || response;
  },

  // Toggle staff status
  toggleStaffStatus: async (id: string, isActive: boolean): Promise<Staff> => {
    const response: any = await apiClient.patch(`/admin/staff/${id}/status`, { isActive });
    return response.data || response;
  },
};
