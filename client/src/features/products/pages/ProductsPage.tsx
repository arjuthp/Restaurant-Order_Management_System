import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi, Product } from '@/services/api/productsApi';
import { useCartStore } from '@/store/cartStore';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button } from '@/shared/components/Button';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsApi.getAll();
      // Filter out deleted products
      const activeProducts = response.filter((product) => !product.is_deleted);
      setProducts(activeProducts);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍽️</div>
          <h2 className={styles.emptyTitle}>No Products Available</h2>
          <p className={styles.emptyText}>
            Check back later for delicious menu items!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Menu</h1>
      
      <div className={styles.grid}>
        {products.map((product) => (
          <div
            key={product._id}
            className={`${styles.card} ${!product.is_available ? styles.unavailable : ''}`}
          >
            <div 
              className={styles.imageContainer}
              onClick={() => handleProductClick(product._id)}
              style={{ cursor: 'pointer' }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder}>
                  <span className={styles.placeholderIcon}>🍽️</span>
                </div>
              )}
              {!product.is_available && (
                <div className={styles.unavailableBadge}>Unavailable</div>
              )}
            </div>
            
            <div className={styles.content}>
              <div 
                className={styles.header}
                onClick={() => handleProductClick(product._id)}
                style={{ cursor: 'pointer' }}
              >
                <h3 className={styles.name}>{product.name}</h3>
                <span className={styles.category}>{product.category}</span>
              </div>
              
              <p className={styles.description}>
                {product.description || 'No description available'}
              </p>
              
              <div className={styles.footer}>
                <span className={styles.price}>${product.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.is_available}
                >
                  {product.is_available ? 'Add to Cart' : 'Unavailable'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
