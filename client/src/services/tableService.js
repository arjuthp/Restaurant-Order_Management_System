import api from './api';

const tableService = {
  getAllTables: async () => {
    const response = await api.get('/tables');
    return response.data;
  },

  getTableById: async (id) => {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  createTable: async (tableData) => {
    const response = await api.post('/tables', tableData);
    return response.data;
  },

  updateTable: async (id, tableData) => {
    const response = await api.put(`/tables/${id}`, tableData);
    return response.data;
  },

  deleteTable: async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  }
};

export default tableService;
