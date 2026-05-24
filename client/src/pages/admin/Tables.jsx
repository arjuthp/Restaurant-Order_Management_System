import { useState, useEffect } from 'react';
import tableService from '../../services/tableService';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    location: '',
    status: 'active'
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await tableService.getAllTables();
      setTables(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ tableNumber: '', capacity: '', location: '', status: 'active' });
    setEditingTable(null);
    setShowForm(false);
  };

  const handleEdit = (table) => {
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      location: table.location || '',
      status: table.status
    });
    setEditingTable(table);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity),
        location: formData.location,
        status: formData.status
      };

      if (editingTable) {
        await tableService.updateTable(editingTable._id, payload);
        setSuccess('Table updated successfully');
      } else {
        await tableService.createTable(payload);
        setSuccess('Table created successfully');
      }
      resetForm();
      fetchTables();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save table');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;
    try {
      await tableService.deleteTable(id);
      setSuccess('Table deleted successfully');
      fetchTables();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete table');
    }
  };

  if (loading) return <div className="loading">Loading tables...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🪑 Manage Tables</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ Add Table'}
        </button>
      </div>

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

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>{editingTable ? 'Edit Table' : 'Add New Table'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label className="form-label">Table Number *</label>
                <input
                  type="number"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="form-label">Capacity *</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Window, Patio, Main Hall"
                />
              </div>
              <div>
                <label className="form-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingTable ? 'Update Table' : 'Create Table'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {tables.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>No tables yet</h2>
          <p style={{ color: '#666' }}>Add tables to enable reservations</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={thStyle}>Table #</th>
                <th style={thStyle}>Capacity</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.map(table => (
                <tr key={table._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}><strong>#{table.tableNumber}</strong></td>
                  <td style={tdStyle}>{table.capacity} seats</td>
                  <td style={tdStyle}>{table.location || '-'}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'white',
                      background: table.status === 'active' ? '#10b981' : '#6b7280'
                    }}>
                      {table.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(table)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(table._id)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 12px', color: '#dc2626' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px', background: '#f8f9fa' }}>
        <h3 style={{ marginBottom: '10px' }}>Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Total Tables</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{tables.length}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Active</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
              {tables.filter(t => t.status === 'active').length}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Total Capacity</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>
              {tables.reduce((sum, t) => sum + t.capacity, 0)} seats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const thStyle = { textAlign: 'left', padding: '12px 16px', fontWeight: '600', fontSize: '0.9rem' };
const tdStyle = { padding: '12px 16px', fontSize: '0.9rem' };

export default Tables;
