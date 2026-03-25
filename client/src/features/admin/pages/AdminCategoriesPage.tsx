import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesApi, Category, CategoryWithProducts } from '@/services/api/categoriesApi';
import { productsApi } from '@/services/api/productsApi';
import styles from './AdminCategoriesPage.module.css';

const AdminCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<CategoryWithProducts | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
    fetchProductCounts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getAll(true); // Include inactive categories for admin
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductCounts = async () => {
    try {
      const response = await productsApi.getAll({ limit: 100 });
      const counts: Record<string, number> = {};
      
      response.products.forEach((product) => {
        const categoryName = product.category?.name;
        if (categoryName) {
          counts[categoryName] = (counts[categoryName] || 0) + 1;
        }
      });
      
      setProductCounts(counts);
    } catch (error) {
      console.error('Failed to fetch product counts:', error);
    }
  };

  const handleViewProducts = async (categoryId: string) => {
    try {
      setLoadingProducts(true);
      setShowProductsModal(true);
      const data = await categoriesApi.getCategoryProducts(categoryId);
      setSelectedCategoryProducts(data);
    } catch (error) {
      console.error('Failed to fetch category products:', error);
      alert('Failed to fetch products for this category');
      setShowProductsModal(false);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory._id, formData);
      } else {
        await categoriesApi.create(formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoriesApi.delete(id);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await categoriesApi.toggleStatus(id);
      fetchCategories();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading categories...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories Management</h1>
        <button
          className={styles.addButton}
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            setShowModal(true);
          }}
        >
          + Add Category
        </button>
      </div>

      <div className={styles.grid}>
        {categories.map((category) => (
          <div key={category._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.categoryName}>{category.name}</h3>
              <span className={`${styles.status} ${category.is_active ? styles.active : styles.inactive}`}>
                {category.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {category.description && (
              <p className={styles.description}>{category.description}</p>
            )}
            <div className={styles.productCount}>
              {productCounts[category.name] || 0} products
            </div>
            <div className={styles.actions}>
              <button 
                onClick={() => handleViewProducts(category._id)} 
                className={styles.viewBtn}
              >
                View Products
              </button>
              <button onClick={() => handleEdit(category)} className={styles.editBtn}>
                Edit
              </button>
              <button
                onClick={() => handleToggleStatus(category._id)}
                className={styles.toggleBtn}
              >
                {category.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => handleDelete(category._id)} className={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProductsModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2>
                {selectedCategoryProducts?.category.name} - Products
              </h2>
              <button 
                className={styles.closeBtn}
                onClick={() => {
                  setShowProductsModal(false);
                  setSelectedCategoryProducts(null);
                }}
              >
                ×
              </button>
            </div>
            
            {loadingProducts ? (
              <div className={styles.loading}>Loading products...</div>
            ) : (
              <>
                <div className={styles.productsModalHeader}>
                  <p className={styles.productCount}>
                    Total: {selectedCategoryProducts?.count || 0} products
                  </p>
                  <button
                    className={styles.addProductBtn}
                    onClick={() => {
                      setShowProductsModal(false);
                      const categoryId = selectedCategoryProducts?.category._id;
                      setSelectedCategoryProducts(null);
                      setTimeout(() => {
                        navigate('/admin/products', { 
                          state: { 
                            addProduct: true, 
                            preSelectedCategoryId: categoryId 
                          } 
                        });
                      }, 100);
                    }}
                  >
                    + Add Product to {selectedCategoryProducts?.category.name}
                  </button>
                </div>
                
                {selectedCategoryProducts && selectedCategoryProducts.products.length > 0 ? (
                  <div className={styles.productsList}>
                    {selectedCategoryProducts.products.map((product: any) => (
                      <div key={product._id} className={styles.productItem}>
                        <div className={styles.productInfo}>
                          <h4>{product.name}</h4>
                          <p className={styles.productPrice}>Rs. {product.price}</p>
                          <p className={styles.productStock}>
                            Stock: {product.quantity} | 
                            Status: {product.is_available ? ' Available' : ' Unavailable'}
                          </p>
                        </div>
                        <button
                          className={styles.viewDetailsBtn}
                          onClick={() => {
                            setShowProductsModal(false);
                            setSelectedCategoryProducts(null);
                            setTimeout(() => {
                              navigate(`/admin/products/${product._id}`);
                            }, 100);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noProducts}>No products in this category</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
