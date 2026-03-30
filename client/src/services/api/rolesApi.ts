import { apiClient } from './apiClient';

export interface Role {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export const rolesApi = {
  // Get all roles
  getAllRoles: async (isActive?: boolean): Promise<Role[]> => {
    const params = isActive !== undefined ? { isActive } : {};
    const response: any = await apiClient.get('/roles', { params });
    // Handle both response.data.data and response.data formats
    return response.data || response;
  },

  // Get role by ID
  getRoleById: async (id: string): Promise<Role> => {
    const response: any = await apiClient.get(`/roles/${id}`);
    return response.data || response;
  },

  // Create role
  createRole: async (data: CreateRoleData): Promise<Role> => {
    const response: any = await apiClient.post('/roles', data);
    return response.data || response;
  },

  // Update role
  updateRole: async (id: string, data: UpdateRoleData): Promise<Role> => {
    const response: any = await apiClient.put(`/roles/${id}`, data);
    return response.data || response;
  },

  // Toggle role status
  toggleRoleStatus: async (id: string, isActive: boolean): Promise<Role> => {
    const response: any = await apiClient.patch(`/roles/${id}/status`, { isActive });
    return response.data || response;
  },
};
