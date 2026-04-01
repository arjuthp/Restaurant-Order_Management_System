import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { productsApi, Product } from '@/services/api/productsApi';
import { categoriesApi } from '@/services/api/categoriesApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Modal } from '@/shared/components/Modal';
import { Toast } from '@/shared/components/Toast';
import { Pagination } from '@/shared/components/Pagination';
import { ProductForm, ProductFormData } from '../components/ProductForm';
import styles from './AdminProductsPage.module.css';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [preSelectedCategoryId, setPreSelectedCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    // Check if category filter is in URL
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }

    // Check if we should open add product modal with pre-selected category
    const state = location.state as any;
    if (state?.addProduct && state?.preSelectedCategoryId) {
      setPreSelectedCategoryId(state.preSelectedCategoryId);
      setIsModalOpen(true);
      // Clear the state to prevent reopening on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchQuery, selectedCategory, availabilityFilter]);

  useEffect(() => {
    applyPagination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredProducts, currentPage]);

  const fetchCategories = async () => {
    try {
      const allCategories = await categoriesApi.getAll();
      const categoryNames = allCategories.map((c) => c.name).sort();
      setCategories(categoryNames);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productsApi.getAll({ limit: 100 });
      setProducts(response.products);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to load products. Please try again.';
      setError(errorMessage);
      console.error('Error fetching products:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category?.name === selectedCategory);
    }

    // Availability filter
    if (availabilityFilter === 'available') {
      filtered = filtered.filter((product) => product.is_available);
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter((product) => !product.is_available);
    }

    setFilteredProducts(filtered);
    // Reset to first page when filters change (only if not already on page 1)
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const applyPagination = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getAvailabilityBadge = (isAvailable: boolean) => {
    return (
      <span
        className={`${styles.badge} ${
          isAvailable ? styles.badgeAvailable : styles.badgeUnavailable
        }`}
      >
        {isAvailable ? 'Available' : 'Unavailable'}
      </span>
    );
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setPreSelectedCategoryId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setPreSelectedCategoryId(null);
    setIsModalOpen(true);
  };

  const handleViewDetails = (productId: string) => {
    navigate(`/admin/products/${productId}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setPreSelectedCategoryId(null);
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      if (editingProduct) {
        // Update existing product - just send the data with images array
        await productsApi.update(editingProduct._id, {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          image_url: data.image_url || undefined,
          images: data.images || [],
          is_available: data.is_available,
        });
        
        setToast({ message: 'Product updated successfully!', type: 'success' });
      } else {
        // Create new product - just send the data with images array
        await productsApi.create({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          image_url: data.image_url || undefined,
          images: data.images || [],
          is_available: data.is_available,
        });
        
        setToast({ message: 'Product created successfully!', type: 'success' });
      }
      
      handleCloseModal();
      await fetchProducts();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error?.message || `Failed to ${editingProduct ? 'update' : 'create'} product. Please try again.`;
      setToast({ message: errorMessage, type: 'error' });
      console.error('Error submitting form:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteConfirmation = (product: Product) => {
    setDeleteConfirmation({ isOpen: true, product });
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, product: null });
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirmation.product) return;

    try {
      setIsDeleting(true);
      
      // Call DELETE /api/products/:id
      await productsApi.delete(deleteConfirmation.product._id);
      
      // Remove product from list immediately
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== deleteConfirmation.product!._id)
      );
      
      // Show success message
      setToast({ message: 'Product deleted successfully!', type: 'success' });
      
      // Close confirmation dialog
      handleCloseDeleteConfirmation();
    } catch (err: any) {
      // Handle errors and show error messages
      const errorMessage = err?.response?.data?.message || 'Failed to delete product. Please try again.';
      setToast({ message: errorMessage, type: 'error' });
      console.error('Error deleting product:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={fetchProducts}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className={styles.header}>
        <h1 className={styles.title}>Products Management</h1>
        <Button variant="primary" onClick={handleOpenAddModal}>Add Product</Button>
      </div>

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {isLoading ? (
        <div className={styles.container}>
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.empty}>
          <p>
            {searchQuery || selectedCategory !== 'all' || availabilityFilter !== 'all'
              ? 'No products match your filters. Try adjusting your search.'
              : 'No products found. Add your first product to get started.'}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className={styles.imageCell}>
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.imagePlaceholder}>
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={styles.nameCell}>{product.name}</td>
                  <td className={styles.categoryCell}>{product.category?.name || 'Unknown'}</td>
                  <td className={styles.priceCell}>{formatPrice(product.price)}</td>
                  <td>{getAvailabilityBadge(product.is_available)}</td>
                  <td>
                    <div className={styles.actions}>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleViewDetails(product._id)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleOpenEditModal(product)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleOpenDeleteConfirmation(product)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
          preSelectedCategoryId={preSelectedCategoryId}
        />
      </Modal>

      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCloseDeleteConfirmation}
        title="Delete Product"
        size="sm"
      >
        <div className={styles.deleteConfirmation}>
          <p className={styles.deleteMessage}>
            Are you sure you want to delete "{deleteConfirmation.product?.name}"?
          </p>
          <p className={styles.deleteWarning}>
            This action cannot be undone.
          </p>
          <div className={styles.deleteActions}>
            <Button
              variant="secondary"
              onClick={handleCloseDeleteConfirmation}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteProduct}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
