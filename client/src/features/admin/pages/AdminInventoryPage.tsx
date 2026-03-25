import { useState, useEffect } from 'react';
import { productsApi, Product } from '@/services/api/productsApi';
import styles from './AdminInventoryPage.module.css';

const AdminInventoryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockData, setStockData] = useState({ quantity: 0, operation: 'add' as 'add' | 'set' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll();
      setProducts(response.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return 'out';
    if (product.quantity <= product.low_stock_threshold) return 'low';
    return 'good';
  };

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    const status = getStockStatus(product);
    if (filter === 'low') return status === 'low';
    if (filter === 'out') return status === 'out';
    return true;
  });

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;
    try {
      await productsApi.updateStock(
        selectedProduct._id,
        stockData.quantity,
        stockData.operation
      );
      setShowModal(false);
      setSelectedProduct(null);
      setStockData({ quantity: 0, operation: 'add' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock');
    }
  };

  const openStockModal = (product: Product) => {
    setSelectedProduct(product);
    setStockData({ quantity: 0, operation: 'add' });
    setShowModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Loading inventory...</div>;
  }

  const stats = {
    total: products.length,
    low: products.filter((p) => getStockStatus(p) === 'low').length,
    out: products.filter((p) => getStockStatus(p) === 'out').length,
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventory Management</h1>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Products</div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div className={`${styles.statCard} ${styles.warning}`}>
          <div className={styles.statLabel}>Low Stock</div>
          <div className={styles.statValue}>{stats.low}</div>
        </div>
        <div className={`${styles.statCard} ${styles.danger}`}>
          <div className={styles.statLabel}>Out of Stock</div>
          <div className={styles.statValue}>{stats.out}</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All Products
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'low' ? styles.active : ''}`}
          onClick={() => setFilter('low')}
        >
          Low Stock
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'out' ? styles.active : ''}`}
          onClick={() => setFilter('out')}
        >
          Out of Stock
        </button>
      </div>

      {/* Products Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);
              return (
                <tr key={product._id}>
                  <td className={styles.productCell}>
                    <div className={styles.productInfo}>
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className={styles.productImage} />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category?.name || 'Unknown'}</td>
                  <td>
                    <span className={`${styles.stockBadge} ${styles[status]}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>{product.low_stock_threshold}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[status]}`}>
                      {status === 'out' ? 'Out of Stock' : status === 'low' ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.updateBtn}
                      onClick={() => openStockModal(product)}
                    >
                      Update Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Update Modal */}
      {showModal && selectedProduct && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Update Stock: {selectedProduct.name}</h2>
            <p className={styles.currentStock}>Current Stock: {selectedProduct.quantity}</p>

            <div className={styles.formGroup}>
              <label>Operation</label>
              <select
                value={stockData.operation}
                onChange={(e) => setStockData({ ...stockData, operation: e.target.value as 'add' | 'set' })}
              >
                <option value="add">Add to Stock</option>
                <option value="set">Set Stock</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Quantity</label>
              <input
                type="number"
                min="0"
                value={stockData.quantity}
                onChange={(e) => setStockData({ ...stockData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className={styles.preview}>
              {stockData.operation === 'add' ? (
                <p>New Stock: {selectedProduct.quantity} + {stockData.quantity} = {selectedProduct.quantity + stockData.quantity}</p>
              ) : (
                <p>New Stock: {stockData.quantity}</p>
              )}
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleUpdateStock} className={styles.saveBtn}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryPage;
