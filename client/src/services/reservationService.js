import api from './api';

const reservationService = {
  checkAvailability: async (date, timeSlot, numberOfGuests) => {
    const response = await api.get('/reservations/availability', {
      params: { date, timeSlot, numberOfGuests }
    });
    return response.data;
  },

  createReservation: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get('/reservations/my-reservations');
    return response.data;
  },

  getReservationById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  cancelReservation: async (id) => {
    const response = await api.patch(`/reservations/${id}/cancel`);
    return response.data;
  },

  getAllReservations: async (filters = {}) => {
    const response = await api.get('/reservations/admin/all', { params: filters });
    return response.data;
  },

  updateReservationStatus: async (id, status) => {
    const response = await api.patch(`/reservations/admin/${id}/status`, { status });
    return response.data;
  }
};

export default reservationService;
