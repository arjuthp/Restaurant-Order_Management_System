// API Helper Functions

// Make authenticated API call
async function apiCall(endpoint, options = {}) {
    const token = getAccessToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// User API
const UserAPI = {
    async getProfile() {
        return await apiCall(API_ENDPOINTS.GET_PROFILE);
    },

    async updateProfile(data) {
        return await apiCall(API_ENDPOINTS.UPDATE_PROFILE, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    async deleteAccount() {
        return await apiCall(API_ENDPOINTS.DELETE_ACCOUNT, {
            method: 'DELETE'
        });
    },

    async getAllUsers() {
        return await apiCall(API_ENDPOINTS.GET_ALL_USERS);
    }
};

// Product API (placeholder for future implementation)
const ProductAPI = {
    async getAll() {
        // TODO: Implement when backend is ready
        return [];
    },

    async getById(id) {
        // TODO: Implement when backend is ready
        return null;
    },

    async create(data) {
        // TODO: Implement when backend is ready
        return null;
    },

    async update(id, data) {
        // TODO: Implement when backend is ready
        return null;
    },

    async delete(id) {
        // TODO: Implement when backend is ready
        return null;
    }
};

// Cart API (placeholder for future implementation)
const CartAPI = {
    async get() {
        // TODO: Implement when backend is ready
        return { items: [] };
    },

    async addItem(productId, quantity) {
        // TODO: Implement when backend is ready
        return null;
    },

    async updateItem(productId, quantity) {
        // TODO: Implement when backend is ready
        return null;
    },

    async removeItem(productId) {
        // TODO: Implement when backend is ready
        return null;
    },

    async clear() {
        // TODO: Implement when backend is ready
        return null;
    }
};

// Order API (placeholder for future implementation)
const OrderAPI = {
    async create() {
        // TODO: Implement when backend is ready
        return null;
    },

    async getMyOrders() {
        // TODO: Implement when backend is ready
        return [];
    },

    async getById(id) {
        // TODO: Implement when backend is ready
        return null;
    },

    async getAll() {
        // TODO: Implement when backend is ready
        return [];
    },

    async updateStatus(id, status) {
        // TODO: Implement when backend is ready
        return null;
    },

    async cancel(id) {
        // TODO: Implement when backend is ready
        return null;
    }
};
