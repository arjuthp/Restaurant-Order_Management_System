import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi, Product } from '@/services/api/productsApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatCurrency } from '@/shared/utils/formatters';
import styles from './AdminProductDetailPage.module.css';

const AdminProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const data = await productsApi.getById(productId);
      setProduct(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/products');
  };

  const handleEdit = () => {
    navigate('/admin/products', { state: { editProductId: id } });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error || 'Product not found'}</p>
          <Button onClick={handleBack}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="secondary" onClick={handleBack}>
          ← Back to Products
        </Button>
        <Button variant="primary" onClick={handleEdit}>
          Edit Product
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                className={styles.productImage}
              />
              {product.images.length > 1 && (
                <div className={styles.thumbnailGrid}>
                  {product.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className={styles.thumbnail}
                    />
                  ))}
                </div>
              )}
            </>
          ) : product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{product.name}</h1>
            <span
              className={`${styles.badge} ${
                product.is_available ? styles.badgeAvailable : styles.badgeUnavailable
              }`}
            >
              {product.is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <div className={styles.price}>{formatCurrency(product.price)}</div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Category</span>
              <span className={styles.infoValue}>{product.category?.name || 'N/A'}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Product ID</span>
              <span className={styles.infoValue}>#{product._id.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetailPage;
