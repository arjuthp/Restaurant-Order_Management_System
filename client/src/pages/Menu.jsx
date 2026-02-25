import { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem' }}>
        Our Menu 🍽️
      </h1>

      {/* Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
              className="form-input"
              style={{ fontSize: '1.1rem', padding: '12px', paddingRight: '40px', width: '100%' }}
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
            style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
          No products available
        </p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
