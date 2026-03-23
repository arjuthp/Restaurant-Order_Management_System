import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi, Product, PaginationMetadata } from '@/services/api/productsApi';
import { useCartStore } from '@/store/cartStore';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button } from '@/shared/components/Button';
import { Pagination } from '@/shared/components/Pagination';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const addItem = useCartStore((state) => state.addItem);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedCategory, showOnlyAvailable]);

  useEffect(() => {
    loadProducts();
  }, [debouncedSearchQuery, selectedCategory, showOnlyAvailable, currentPage]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const params: { 
        search?: string; 
        category?: string; 
        available?: boolean;
        page?: number;
        limit?: number;
      } = {
        page: currentPage,
        limit: 12,
      };
      
      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }
      
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      
      if (showOnlyAvailable) {
        params.available = true;
      }
      
      const response = await productsApi.getAll(params);
      
      // Filter out deleted products
      const activeProducts = response.products.filter((product) => !product.is_deleted);
      setProducts(activeProducts);
      setPagination(response.pagination);
      
      // Extract unique categories from all products (only on first load or when filters change)
      if (currentPage === 1) {
        const uniqueCategories = Array.from(
          new Set(activeProducts.map((product) => product.category))
        ).sort();
        setCategories(uniqueCategories);
      }
      
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
      });
      // Success - item added to cart (both local and backend)
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      // Item is still added locally, sync will happen on checkout
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <h1 className={styles.title}>Our Menu</h1>
        
        {/* Search and Filter Bar */}
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={styles.clearButton}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className={styles.categoryFilter}>
              <label htmlFor="category-select" className={styles.filterLabel}>
                Category:
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`${styles.categorySelect} ${selectedCategory !== 'all' ? styles.activeFilter : ''}`}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Availability Filter */}
          <div className={styles.availabilityFilter}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Show only available</span>
            </label>
          </div>
        </div>
        
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            {debouncedSearchQuery || selectedCategory !== 'all' || showOnlyAvailable ? '🔍' : '🍽️'}
          </div>
          <h2 className={styles.emptyTitle}>
            {debouncedSearchQuery || selectedCategory !== 'all' || showOnlyAvailable ? 'No Results Found' : 'No Products Available'}
          </h2>
          <p className={styles.emptyText}>
            {debouncedSearchQuery || selectedCategory !== 'all' || showOnlyAvailable
              ? `No products match your filters. Try adjusting your search or category.`
              : 'Check back later for delicious menu items!'}
          </p>
          {(debouncedSearchQuery || selectedCategory !== 'all' || showOnlyAvailable) && (
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShowOnlyAvailable(false);
              }} 
              style={{ marginTop: '1rem' }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Menu</h1>
      
      {/* Search and Filter Bar */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={styles.clearButton}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className={styles.categoryFilter}>
            <label htmlFor="category-select" className={styles.filterLabel}>
              Category:
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`${styles.categorySelect} ${selectedCategory !== 'all' ? styles.activeFilter : ''}`}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Availability Filter */}
        <div className={styles.availabilityFilter}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              className={styles.checkbox}
            />
            <span>Show only available</span>
          </label>
        </div>
      </div>
      
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

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductsPage;
