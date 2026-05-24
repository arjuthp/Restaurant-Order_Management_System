import { useState, useEffect } from 'react';
import reservationService from '../services/reservationService';

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00'
];

const DURATION_OPTIONS = [
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' }
];

const Reservations = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [reservations, setReservations] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchDate, setSearchDate] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [searchGuests, setSearchGuests] = useState(2);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedTable, setSelectedTable] = useState(null);
  const [duration, setDuration] = useState(120);
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    if (activeTab === 'my') {
      fetchMyReservations();
    }
  }, [activeTab]);

  const fetchMyReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reservationService.getMyReservations();
      setReservations(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (e) => {
    e.preventDefault();
    if (!searchDate || !searchTime || !searchGuests) {
      setError('Please fill in all search fields');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSelectedTable(null);
      const data = await reservationService.checkAvailability(searchDate, searchTime, searchGuests);
      setAvailableTables(data.data || []);
      setHasSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedTable || !contactPhone) {
      setError('Please select a table and provide a contact phone');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await reservationService.createReservation({
        table: selectedTable._id,
        date: searchDate,
        timeSlot: searchTime,
        numberOfGuests: parseInt(searchGuests),
        duration,
        specialRequests,
        contactPhone
      });
      setSuccess('Reservation created successfully!');
      setSelectedTable(null);
      setSpecialRequests('');
      setContactPhone('');
      setHasSearched(false);
      setAvailableTables([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await reservationService.cancelReservation(id);
      fetchMyReservations();
      setSuccess('Reservation cancelled successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation');
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

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>🪑 Table Reservations</h1>

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

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('book')}
          className={`btn ${activeTab === 'book' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Book a Table
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`btn ${activeTab === 'my' ? 'btn-primary' : 'btn-secondary'}`}
        >
          My Reservations
        </button>
      </div>

      {activeTab === 'book' && (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Find Available Tables</h2>
            <form onSubmit={checkAvailability}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => { setSearchDate(e.target.value); setHasSearched(false); }}
                    min={getTodayString()}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Time</label>
                  <select
                    value={searchTime}
                    onChange={(e) => { setSearchTime(e.target.value); setHasSearched(false); }}
                    className="form-input"
                    required
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Guests</label>
                  <input
                    type="number"
                    value={searchGuests}
                    onChange={(e) => { setSearchGuests(e.target.value); setHasSearched(false); }}
                    min="1"
                    max="20"
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : 'Check Availability'}
              </button>
            </form>
          </div>

          {hasSearched && (
            <div>
              {availableTables.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                  <h3>No tables available</h3>
                  <p style={{ color: '#666' }}>Try a different date, time, or party size.</p>
                </div>
              ) : (
                <div>
                  <h3 style={{ marginBottom: '15px' }}>
                    {availableTables.length} table{availableTables.length !== 1 ? 's' : ''} available
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    {availableTables.map(table => (
                      <div
                        key={table._id}
                        className="card"
                        onClick={() => setSelectedTable(table)}
                        style={{
                          cursor: 'pointer',
                          border: selectedTable?._id === table._id ? '2px solid var(--orange)' : '2px solid transparent',
                          transition: 'border-color 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4>Table #{table.tableNumber}</h4>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                              Capacity: {table.capacity} guests
                            </p>
                            {table.location && (
                              <p style={{ color: '#888', fontSize: '0.85rem' }}>
                                Location: {table.location}
                              </p>
                            )}
                          </div>
                          {selectedTable?._id === table._id && (
                            <span style={{ color: 'var(--orange)', fontSize: '1.5rem' }}>&#10003;</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedTable && (
                    <div className="card">
                      <h3 style={{ marginBottom: '20px' }}>Complete Your Booking</h3>
                      <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                        <p><strong>Table #{selectedTable.tableNumber}</strong> | {selectedTable.location} | Capacity: {selectedTable.capacity}</p>
                        <p>{formatDate(searchDate)} at {searchTime} | {searchGuests} guest{searchGuests > 1 ? 's' : ''}</p>
                      </div>
                      <form onSubmit={handleBooking}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                          <div>
                            <label className="form-label">Duration</label>
                            <select
                              value={duration}
                              onChange={(e) => setDuration(parseInt(e.target.value))}
                              className="form-input"
                            >
                              {DURATION_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="form-label">Contact Phone *</label>
                            <input
                              type="tel"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="form-input"
                              placeholder="+977-XXXXXXXXXX"
                              required
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label className="form-label">Special Requests (optional)</label>
                          <textarea
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            className="form-input"
                            rows="3"
                            placeholder="Birthday celebration, high chair needed, dietary requirements..."
                          />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                          {loading ? 'Booking...' : 'Confirm Reservation'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'my' && (
        <div>
          {loading ? (
            <div className="loading">Loading reservations...</div>
          ) : reservations.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h2>No reservations yet</h2>
              <p style={{ color: '#666' }}>Book a table to get started!</p>
              <button onClick={() => setActiveTab('book')} className="btn btn-primary" style={{ marginTop: '15px' }}>
                Book a Table
              </button>
            </div>
          ) : (
            reservations.map(reservation => (
              <div key={reservation._id} className="card" style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ marginBottom: '8px' }}>
                      Table #{reservation.table?.tableNumber || 'N/A'}
                      {reservation.table?.location && (
                        <span style={{ color: '#888', fontWeight: 'normal', fontSize: '0.9rem' }}> - {reservation.table.location}</span>
                      )}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '4px' }}>
                      {formatDate(reservation.date)} at {reservation.timeSlot}
                    </p>
                    <p style={{ color: '#666', marginBottom: '4px' }}>
                      {reservation.numberOfGuests} guest{reservation.numberOfGuests !== 1 ? 's' : ''} | Duration: {reservation.duration} min
                    </p>
                    {reservation.specialRequests && (
                      <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '8px' }}>
                        <strong>Note:</strong> {reservation.specialRequests}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'white',
                      background: getStatusColor(reservation.status)
                    }}>
                      {reservation.status.toUpperCase()}
                    </span>
                    {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                      <div style={{ marginTop: '10px' }}>
                        <button
                          onClick={() => cancelReservation(reservation._id)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '6px 16px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Reservations;
