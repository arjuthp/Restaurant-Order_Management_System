import { useState, FormEvent, useRef, useEffect } from 'react';
import { Product } from '@/services/api/productsApi';
import { categoriesApi, Category } from '@/services/api/categoriesApi';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import styles from './ProductForm.module.css';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  preSelectedCategoryId?: string | null;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
  quantity: number;
  low_stock_threshold: number;
  image_file?: File;
}

export const ProductForm = ({ product, onSubmit, onCancel, isLoading = false, preSelectedCategoryId }: ProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: typeof product?.category === 'object' ? product.category._id : product?.category || preSelectedCategoryId || '',
    image_url: product?.image_url || '',
    is_available: product?.is_available ?? true,
    quantity: product?.quantity || 0,
    low_stock_threshold: product?.low_stock_threshold || 10,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    // Description validation (optional but if provided, should have min length)
    if (formData.description && formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters if provided';
    }

    // Price validation
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    } else if (formData.price > 100000) {
      newErrors.price = 'Price seems too high. Please check the value';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a JPEG, PNG, or WebP image.';
    }

    // Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `File size (${sizeMB}MB) exceeds the maximum allowed size of 5MB.`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // Clear previous errors
    setFileError('');
    
    if (!file) {
      return;
    }

    // Validate the file
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Store the file in form data
    setFormData(prev => ({ ...prev, image_file: file }));
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFileError('');
    setFormData(prev => ({ ...prev, image_file: undefined, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (field: keyof ProductFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Product Name"
        type="text"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
        placeholder="Enter product name"
      />

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className={styles.textarea}
          rows={4}
          placeholder="Enter product description"
        />
        {errors.description && (
          <span className={styles.errorText}>{errors.description}</span>
        )}
      </div>

      <Input
        label="Price"
        type="number"
        value={formData.price}
        onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
        error={errors.price}
        required
        min="0"
        step="0.01"
        placeholder="0.00"
      />

      <Input
        label="Initial Quantity"
        type="number"
        value={formData.quantity}
        onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
        error={errors.quantity}
        required
        min="0"
        placeholder="0"
        helperText="Starting stock quantity for this product"
      />

      <Input
        label="Low Stock Threshold"
        type="number"
        value={formData.low_stock_threshold}
        onChange={(e) => handleChange('low_stock_threshold', parseInt(e.target.value) || 10)}
        error={errors.low_stock_threshold}
        required
        min="0"
        placeholder="10"
        helperText="Alert when stock falls below this number"
      />

      <div className={styles.formGroup}>
        <label htmlFor="category" className={styles.label}>
          Category <span className={styles.required}>*</span>
        </label>
        {isCategoriesLoading ? (
          <div className={styles.loadingText}>Loading categories...</div>
        ) : (
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`${styles.select} ${errors.category ? styles.error : ''}`}
            required
            disabled={categories.length === 0}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        {errors.category && (
          <span className={styles.errorText}>{errors.category}</span>
        )}
        {!isCategoriesLoading && categories.length === 0 && (
          <span className={styles.warningText}>
            No categories available. Please create categories first.
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image" className={styles.label}>
          Product Image
        </label>
        <input
          ref={fileInputRef}
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <div className={styles.fileInputHelper}>
          Accepted formats: JPEG, PNG, WebP (Max size: 5MB)
        </div>
        {fileError && (
          <span className={styles.errorText}>{fileError}</span>
        )}
        
        {imagePreview && (
          <div className={styles.imagePreviewContainer}>
            <img 
              src={imagePreview} 
              alt="Product preview" 
              className={styles.imagePreview}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleRemoveImage}
              className={styles.removeImageButton}
            >
              Remove Image
            </Button>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={(e) => handleChange('is_available', e.target.checked)}
            className={styles.checkbox}
          />
          <span>Available for order</span>
        </label>
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
