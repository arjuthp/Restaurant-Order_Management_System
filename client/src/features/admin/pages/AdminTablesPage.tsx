import { useState, useEffect } from 'react';
import { tablesApi, Table, CreateTableData } from '@/services/api/tablesApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/components/Input';
import { Toast } from '@/shared/components/Toast';
import styles from './AdminTablesPage.module.css';

const AdminTablesPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState<CreateTableData>({
    tableNumber: 0,
    capacity: 2,
    location: '',
    isAvailable: true,
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setIsLoading(true);
      const data = await tablesApi.getAllTables();
      setTables(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load tables');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (table?: Table) => {
    if (table) {
      setEditingTable(table);
      setFormData({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        location: table.location,
        isAvailable: table.isAvailable,
      });
    } else {
      setEditingTable(null);
      setFormData({
        tableNumber: 0,
        capacity: 2,
        location: '',
        isAvailable: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await tablesApi.updateTable(editingTable._id, formData);
        setToast({ message: 'Table updated successfully', type: 'success' });
      } else {
        await tablesApi.createTable(formData);
        setToast({ message: 'Table created successfully', type: 'success' });
      }
      handleCloseModal();
      loadTables();
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error?.message || 'Failed to save table',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    
    try {
      await tablesApi.deleteTable(id);
      setToast({ message: 'Table deleted successfully', type: 'success' });
      loadTables();
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error?.message || 'Failed to delete table',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tables Management</h1>
        <Button onClick={() => handleOpenModal()}>Add New Table</Button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableGrid}>
        {tables.map((table) => (
          <div key={table._id} className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3>Table {table.tableNumber}</h3>
              <span className={table.isAvailable ? styles.available : styles.unavailable}>
                {table.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className={styles.tableDetails}>
              <p><strong>Capacity:</strong> {table.capacity} guests</p>
              <p><strong>Location:</strong> {table.location}</p>
            </div>
            <div className={styles.tableActions}>
              <Button variant="secondary" onClick={() => handleOpenModal(table)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(table._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && !error && (
        <div className={styles.emptyState}>
          <p>No tables found. Add your first table to get started.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTable ? 'Edit Table' : 'Add New Table'}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Table Number"
            type="number"
            value={formData.tableNumber}
            onChange={(e) => setFormData({ ...formData, tableNumber: parseInt(e.target.value) })}
            required
            min={1}
          />
          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
            min={1}
            max={20}
          />
          <Input
            label="Location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            placeholder="e.g., Main Hall, Patio, Window Side"
          />
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              />
              Available for reservations
            </label>
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTable ? 'Update Table' : 'Create Table'}
            </Button>
          </div>
        </form>
      </Modal>

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

export default AdminTablesPage;
