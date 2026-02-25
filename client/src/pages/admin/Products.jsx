import { useState, useEffect } from 'react';
import productService from '../../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    is_available: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, formData);
      } else {
        await productService.createProduct(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '', is_available: true });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      is_available: product.is_available
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', is_available: true });
  };

  const filteredProducts = products.filter(product => {
    const search = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(search) ||
           product.category.toLowerCase().includes(search) ||
           product.description?.toLowerCase().includes(search);
  });

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>🍽️ Manage Products</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            + Add Product
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {/* Search Bar */}
      {!showForm && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="🔍 Search products by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
                className="form-input"
                style={{ fontSize: '1rem', padding: '12px', paddingRight: '40px', width: '100%' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#999',
                    padding: '0 5px'
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={() => {/* Search is already real-time */}}
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap' }}
            >
              Search
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                <option value="Nepali">Nepali</option>
                <option value="Fusion">Fusion</option>
                <option value="Western">Western</option>
                <option value="Snacks">Snacks</option>
                <option value="Desserts">Desserts</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                />
                Available
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredProducts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>No products match your search</p>
          </div>
        ) : (
          filteredProducts.map(product => (
          <div key={product._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{product.name}</h3>
              <p style={{ color: '#666' }}>{product.category} - Rs. {product.price}</p>
              <p style={{ fontSize: '0.9rem', color: '#999' }}>{product.description}</p>
              <span style={{ 
                display: 'inline-block',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                background: product.is_available ? '#d4edda' : '#f8d7da',
                color: product.is_available ? '#155724' : '#721c24'
              }}>
                {product.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(product)} className="btn btn-secondary">
                Edit
              </button>
              <button onClick={() => handleDelete(product._id)} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
};

export default Products;
