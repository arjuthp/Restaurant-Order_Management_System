import { useEffect, useState } from 'react';
import { productsApi, Product } from '@/services/api/productsApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Modal } from '@/shared/components/Modal';
import { Toast } from '@/shared/components/Toast';
import { ProductForm, ProductFormData } from '../components/ProductForm';
import styles from './AdminProductsPage.module.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productsApi.getAll();
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
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      if (editingProduct) {
        // Update existing product
        // Check if there's an image file to upload
        if (data.image_file) {
          // Create FormData for multipart/form-data
          const formData = new FormData();
          
          // Append file and other product fields
          formData.append('image', data.image_file);
          formData.append('name', data.name);
          formData.append('description', data.description);
          formData.append('price', data.price.toString());
          formData.append('category', data.category);
          formData.append('is_available', data.is_available.toString());
          
          // Call PATCH /api/products/:id with FormData
          await productsApi.updateWithImage(editingProduct._id, formData);
        } else {
          // No image file, use regular JSON API
          await productsApi.update(editingProduct._id, {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            image_url: data.image_url || undefined,
            is_available: data.is_available,
          });
        }
        
        // Show success message
        setToast({ message: 'Product updated successfully!', type: 'success' });
      } else {
        // Create new product
        // Check if there's an image file to upload
        if (data.image_file) {
          // Create FormData for multipart/form-data
          const formData = new FormData();
          
          // Append file and other product fields
          formData.append('image', data.image_file);
          formData.append('name', data.name);
          formData.append('description', data.description);
          formData.append('price', data.price.toString());
          formData.append('category', data.category);
          formData.append('is_available', data.is_available.toString());
          
          // Call POST /api/products with FormData
          await productsApi.createWithImage(formData);
        } else {
          // No image file, use regular JSON API
          await productsApi.create({
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            image_url: data.image_url || undefined,
            is_available: data.is_available,
          });
        }
        
        // Show success message
        setToast({ message: 'Product created successfully!', type: 'success' });
      }
      
      // Close modal
      handleCloseModal();
      
      // Refresh product list
      await fetchProducts();
    } catch (err: any) {
      // Handle upload errors
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

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No products found. Add your first product to get started.</p>
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
              {products.map((product) => (
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
                  <td className={styles.categoryCell}>{product.category}</td>
                  <td className={styles.priceCell}>{formatPrice(product.price)}</td>
                  <td>{getAvailabilityBadge(product.is_available)}</td>
                  <td>
                    <div className={styles.actions}>
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
