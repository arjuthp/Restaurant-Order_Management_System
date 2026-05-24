import { useState, useEffect } from 'react';
import reservationService from '../../services/reservationService';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reservationService.getAllReservations();
      setReservations(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setError('');
      await reservationService.updateReservationStatus(id, newStatus);
      setSuccess(`Reservation status updated to ${newStatus}`);
      fetchReservations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444',
      'no-show': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const statuses = ['All', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'];

  const getNextStatuses = (current) => {
    const transitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled', 'no-show'],
      completed: [],
      cancelled: [],
      'no-show': []
    };
    return transitions[current] || [];
  };

  const filteredReservations = reservations.filter(res => {
    const matchesStatus = filterStatus === 'All' || res.status === filterStatus;

    const search = searchQuery.toLowerCase();
    const customerName = res.user?.name?.toLowerCase() || '';
    const customerEmail = res.user?.email?.toLowerCase() || '';
    const tableNum = res.table?.tableNumber?.toString() || '';
    const matchesSearch = !search ||
      customerName.includes(search) ||
      customerEmail.includes(search) ||
      tableNum.includes(search);

    const matchesDate = !filterDate || (res.date && res.date.startsWith(filterDate));

    return matchesStatus && matchesSearch && matchesDate;
  });

  if (loading) return <div className="loading">Loading reservations...</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>📋 Manage Reservations</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#d1fae5', color: '#059669', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          {success}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search by customer name, email, or table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ fontSize: '1rem', padding: '12px', width: '100%' }}
          />
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="form-input"
          style={{ width: 'auto' }}
        />
        {(searchQuery || filterDate) && (
          <button
            onClick={() => { setSearchQuery(''); setFilterDate(''); }}
            className="btn btn-secondary"
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ marginBottom: '15px', color: '#666' }}>
        Showing {filteredReservations.length} of {reservations.length} reservations
      </div>

      {filteredReservations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>{searchQuery || filterStatus !== 'All' || filterDate ? 'No reservations match your filters' : 'No reservations found'}</p>
        </div>
      ) : (
        filteredReservations.map(reservation => (
          <div key={reservation._id} className="card" style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>Table #{reservation.table?.tableNumber || 'N/A'}</h3>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'white',
                    background: getStatusColor(reservation.status)
                  }}>
                    {reservation.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem', color: '#555' }}>
                  <p><strong>Date:</strong> {formatDate(reservation.date)}</p>
                  <p><strong>Time:</strong> {reservation.timeSlot}</p>
                  <p><strong>Guests:</strong> {reservation.numberOfGuests}</p>
                  <p><strong>Duration:</strong> {reservation.duration} min</p>
                  <p><strong>Customer:</strong> {reservation.user?.name || 'Unknown'}</p>
                  <p><strong>Email:</strong> {reservation.user?.email || 'N/A'}</p>
                  {reservation.contactPhone && (
                    <p><strong>Phone:</strong> {reservation.contactPhone}</p>
                  )}
                  {reservation.table?.location && (
                    <p><strong>Location:</strong> {reservation.table.location}</p>
                  )}
                </div>

                {reservation.specialRequests && (
                  <div style={{ marginTop: '10px', background: '#f5f5f5', padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem' }}>
                    <strong>Special Requests:</strong> {reservation.specialRequests}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                {getNextStatuses(reservation.status).map(nextStatus => (
                  <button
                    key={nextStatus}
                    onClick={() => updateStatus(reservation._id, nextStatus)}
                    className="btn btn-secondary"
                    style={{
                      fontSize: '0.8rem',
                      padding: '6px 14px',
                      color: getStatusColor(nextStatus),
                      borderColor: getStatusColor(nextStatus)
                    }}
                  >
                    Mark {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Reservations;
