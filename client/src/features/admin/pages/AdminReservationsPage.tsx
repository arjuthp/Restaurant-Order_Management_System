import { useState, useEffect } from 'react';
import { reservationsApi, Reservation } from '@/services/api/reservationsApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Toast } from '@/shared/components/Toast';
import { Select } from '@/shared/components/Select';
import { formatDateTime } from '@/shared/utils/formatters';
import styles from './AdminReservationsPage.module.css';

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const data = await reservationsApi.getAllReservations();
      setReservations(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load reservations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await reservationsApi.updateReservationStatus(id, newStatus);
      setToast({ message: 'Reservation status updated', type: 'success' });
      loadReservations();
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error?.message || 'Failed to update status',
        type: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'cancelled':
        return styles.statusCancelled;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusDefault;
    }
  };

  const getValidNextStatuses = (currentStatus: string): string[] => {
    switch (currentStatus) {
      case 'pending':
        return ['confirmed', 'cancelled'];
      case 'confirmed':
        return ['completed', 'cancelled'];
      case 'completed':
      case 'cancelled':
        return [];
      default:
        return [];
    }
  };

  const filteredReservations = statusFilter === 'all'
    ? reservations
    : reservations.filter(r => r.status === statusFilter);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reservations Management</h1>
        <div className={styles.filters}>
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
            className={styles.filterSelect}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.reservationsList}>
        {filteredReservations.map((reservation) => {
          const user = typeof reservation.user === 'object' ? reservation.user : null;
          const table = typeof reservation.table === 'object' ? reservation.table : null;
          const validStatuses = getValidNextStatuses(reservation.status);

          return (
            <div key={reservation._id} className={styles.reservationCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{user?.name || 'Unknown User'}</h3>
                  <p className={styles.email}>{user?.email}</p>
                </div>
                <span className={getStatusBadgeClass(reservation.status)}>
                  {reservation.status}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Table:</span>
                    <span className={styles.value}>
                      {table ? `Table ${table.tableNumber} (${table.location})` : 'N/A'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Date:</span>
                    <span className={styles.value}>{formatDateTime(reservation.date)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Time:</span>
                    <span className={styles.value}>{reservation.timeSlot}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Guests:</span>
                    <span className={styles.value}>{reservation.numberOfGuests}</span>
                  </div>
                  {user?.phone && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Phone:</span>
                      <span className={styles.value}>{user.phone}</span>
                    </div>
                  )}
                  {reservation.hasPreOrder && (
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Pre-order:</span>
                      <span className={styles.value}>✅ Yes</span>
                    </div>
                  )}
                </div>

                {reservation.specialRequests && (
                  <div className={styles.specialRequests}>
                    <strong>Special Requests:</strong>
                    <p>{reservation.specialRequests}</p>
                  </div>
                )}
              </div>

              {validStatuses.length > 0 && (
                <div className={styles.cardActions}>
                  {validStatuses.map((status) => (
                    <Button
                      key={status}
                      variant={status === 'cancelled' ? 'danger' : 'secondary'}
                      onClick={() => handleStatusUpdate(reservation._id, status)}
                      disabled={updatingId === reservation._id}
                    >
                      {updatingId === reservation._id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        `Mark as ${status}`
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredReservations.length === 0 && !error && (
        <div className={styles.emptyState}>
          <p>No reservations found.</p>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminReservationsPage;
