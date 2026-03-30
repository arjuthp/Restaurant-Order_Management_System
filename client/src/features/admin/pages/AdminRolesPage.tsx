import { useState, useEffect } from 'react';
import { rolesApi, Role, CreateRoleData } from '@/services/api/rolesApi';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { formatDateTime } from '@/shared/utils/formatters';
import styles from './AdminRolesPage.module.css';

const AdminRolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [filterActive, setFilterActive] = useState<string>('all');

  const [formData, setFormData] = useState<CreateRoleData>({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadRoles();
  }, [filterActive]);

  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const isActive = filterActive === 'all' ? undefined : filterActive === 'active';
      const data = await rolesApi.getAllRoles(isActive);
      setRoles(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load roles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description,
      });
    } else {
      setEditingRole(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await rolesApi.updateRole(editingRole._id, formData);
        setSuccess('Role updated successfully');
      } else {
        await rolesApi.createRole(formData);
        setSuccess('Role created successfully');
      }
      handleCloseModal();
      loadRoles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleStatus = async (role: Role) => {
    try {
      await rolesApi.toggleRoleStatus(role._id, !role.isActive);
      setSuccess(`Role ${!role.isActive ? 'activated' : 'deactivated'} successfully`);
      loadRoles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to toggle status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredRoles = roles;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Role Management</h1>
        <div className={styles.headerActions}>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Roles</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            + Create Role
          </Button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{roles.length}</div>
          <div className={styles.statLabel}>Total Roles</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{roles.filter(r => r.isActive).length}</div>
          <div className={styles.statLabel}>Active</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{roles.filter(r => !r.isActive).length}</div>
          <div className={styles.statLabel}>Inactive</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role._id}>
                <td>
                  <div className={styles.roleName}>{role.name}</div>
                </td>
                <td>{role.description}</td>
                <td>
                  <span className={role.isActive ? styles.statusActive : styles.statusInactive}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{formatDateTime(role.createdAt)}</td>
                <td>
                  <div className={styles.actions}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenModal(role)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={role.isActive ? 'danger' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleStatus(role)}
                    >
                      {role.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRoles.length === 0 && !error && (
        <div className={styles.emptyState}>
          <p>No roles found.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRole ? 'Edit Role' : 'Create Role'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Role Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Waiter, Chef, Manager"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the role"
              rows={3}
            />
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingRole ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRolesPage;
