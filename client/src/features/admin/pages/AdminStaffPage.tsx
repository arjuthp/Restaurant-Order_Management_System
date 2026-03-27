import { useState, useEffect } from 'react';
import { staffApi, Staff, CreateStaffData, UpdateStaffData } from '@/services/api/staffApi';
import { rolesApi, Role } from '@/services/api/rolesApi';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Modal } from '@/shared/components/Modal';
import styles from './AdminStaffPage.module.css';

const AdminStaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  
  const [filters, setFilters] = useState({
    search: '',
    roleId: '',
    isActive: 'all',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [formData, setFormData] = useState<CreateStaffData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    roleId: '',
    employeeId: '',
    hireDate: '',
  });

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    loadStaff();
  }, [filters, pagination.currentPage]);

  const loadRoles = async () => {
    try {
      const data = await rolesApi.getAllRoles(true); // Only active roles
      console.log('Loaded roles:', data);
      setRoles(data);
    } catch (err: any) {
      console.error('Failed to load roles:', err);
    }
  };

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      const isActive = filters.isActive === 'all' ? undefined : filters.isActive === 'active';
      const response = await staffApi.getAllStaff({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: filters.search || undefined,
        roleId: filters.roleId || undefined,
        isActive,
      });
      setStaff(response.staff);
      setPagination(response.pagination);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load staff');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (staffMember?: Staff) => {
    // Reload roles to get the latest list
    loadRoles();
    
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        name: staffMember.name,
        email: staffMember.email,
        password: '', // Don't pre-fill password
        phone: staffMember.phone || '',
        roleId: staffMember.roleId._id,
        employeeId: staffMember.employeeId,
        hireDate: staffMember.hireDate.split('T')[0],
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        roleId: '',
        employeeId: '',
        hireDate: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      roleId: '',
      employeeId: '',
      hireDate: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const updateData: UpdateStaffData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          roleId: formData.roleId,
          employeeId: formData.employeeId || undefined,
          hireDate: formData.hireDate || undefined,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await staffApi.updateStaff(editingStaff._id, updateData);
        setSuccess('Staff updated successfully');
      } else {
        await staffApi.createStaff(formData);
        setSuccess('Staff created successfully');
      }
      handleCloseModal();
      loadStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleStatus = async (staffMember: Staff) => {
    try {
      await staffApi.toggleStaffStatus(staffMember._id, !staffMember.isActive);
      setSuccess(`Staff ${!staffMember.isActive ? 'activated' : 'deactivated'} successfully`);
      loadStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to toggle status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, currentPage: 1 });
    loadStaff();
  };

  if (isLoading && staff.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Staff Management</h1>
        <button className={styles.createButton} onClick={() => handleOpenModal()}>
          + Add Staff
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{pagination.totalItems}</div>
          <div className={styles.statLabel}>Total Staff</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{staff.filter(s => s.isActive).length}</div>
          <div className={styles.statLabel}>Active</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{staff.filter(s => !s.isActive).length}</div>
          <div className={styles.statLabel}>Inactive</div>
        </div>
      </div>

      <div className={styles.filters}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>

        <select
          value={filters.roleId}
          onChange={(e) => setFilters({ ...filters, roleId: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="">All Roles</option>
          {roles.map(role => (
            <option key={role._id} value={role._id}>{role.name}</option>
          ))}
        </select>

        <select
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Hire Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staffMember) => (
              <tr key={staffMember._id}>
                <td>{staffMember.employeeId}</td>
                <td>
                  <div className={styles.staffName}>{staffMember.name}</div>
                </td>
                <td>{staffMember.email}</td>
                <td>{staffMember.phone || '-'}</td>
                <td>
                  <span className={styles.roleBadge}>{staffMember.roleId.name}</span>
                </td>
                <td>{new Date(staffMember.hireDate).toLocaleDateString()}</td>
                <td>
                  <span className={staffMember.isActive ? styles.statusActive : styles.statusInactive}>
                    {staffMember.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleOpenModal(staffMember)}
                    >
                      Edit
                    </button>
                    <button
                      className={staffMember.isActive ? styles.deactivateButton : styles.activateButton}
                      onClick={() => handleToggleStatus(staffMember)}
                    >
                      {staffMember.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {staff.length === 0 && !error && (
        <div className={styles.emptyState}>
          <p>No staff found.</p>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            disabled={pagination.currentPage === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>
          <span className={styles.paginationInfo}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            disabled={pagination.currentPage === pagination.totalPages}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStaff ? 'Edit Staff' : 'Add Staff'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="john@restaurant.com"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password {!editingStaff && '*'}</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingStaff}
                placeholder={editingStaff ? 'Leave blank to keep current' : 'Min 6 characters'}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="roleId">Role *</label>
              <select
                id="roleId"
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                required
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role._id} value={role._id}>{role.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="employeeId">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="hireDate">Hire Date</label>
            <input
              type="date"
              id="hireDate"
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={handleCloseModal} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {editingStaff ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStaffPage;
