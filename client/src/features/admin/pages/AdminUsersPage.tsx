import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi, User } from '@/services/api/usersApi';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatDateTime } from '@/shared/utils/formatters';
import styles from './AdminUsersPage.module.css';

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await usersApi.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const filteredUsers = roleFilter === 'all'
    ? users
    : users.filter(u => u.role === roleFilter);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Users Management</h1>
        <div className={styles.filters}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{users.length}</div>
          <div className={styles.statLabel}>Total Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{users.filter(u => u.role === 'customer').length}</div>
          <div className={styles.statLabel}>Customers</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{users.filter(u => u.role === 'admin').length}</div>
          <div className={styles.statLabel}>Admins</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className={styles.userName}>{user.name}</div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <span className={user.role === 'admin' ? styles.roleAdmin : styles.roleCustomer}>
                    {user.role}
                  </span>
                </td>
                <td>{user.createdAt ? formatDateTime(user.createdAt) : '-'}</td>
                <td>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleViewUser(user._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && !error && (
        <div className={styles.emptyState}>
          <p>No users found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
