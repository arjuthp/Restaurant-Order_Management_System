import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi, Product } from '@/services/api/productsApi';
import { useCartStore } from '@/store/cartStore';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button } from '@/shared/components/Button';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await productsApi.getById(productId);
      setProduct(response);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product && product.is_available) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image_url: product.image_url,
      });
      // Optional: Show success message or navigate
      navigate('/products');
    }
  };

  const handleBack = () => {
    navigate('/products');
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || 'Product not found'}
        </div>
        <Button onClick={handleBack} variant="secondary">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button onClick={handleBack} variant="secondary" className={styles.backButton}>
        ← Back to Products
      </Button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
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
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.header}>
            <h1 className={styles.name}>{product.name}</h1>
            {product.is_available ? (
              <span className={styles.availableBadge}>Available</span>
            ) : (
              <span className={styles.unavailableBadge}>Unavailable</span>
            )}
          </div>

          <div className={styles.meta}>
            <span className={styles.category}>{product.category}</span>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          </div>

          <p className={styles.description}>
            {product.description || 'No description available'}
          </p>

          <div className={styles.actions}>
            <div className={styles.quantitySelector}>
              <label className={styles.quantityLabel}>Quantity:</label>
              <div className={styles.quantityControls}>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!product.is_available}
              size="lg"
              className={styles.addToCartButton}
            >
              {product.is_available ? 'Add to Cart' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
