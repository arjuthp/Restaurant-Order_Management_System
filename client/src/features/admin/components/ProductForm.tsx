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
  images?: string[];
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
    images: product?.images || [],
    is_available: product?.is_available ?? true,
    quantity: product?.quantity || 0,
    low_stock_threshold: product?.low_stock_threshold || 10,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);
  const [fileError, setFileError] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingToKaha, setIsUploadingToKaha] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
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
    const files = e.target.files;
    
    // Clear previous errors
    setFileError('');
    
    if (!files || files.length === 0) {
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    Array.from(files).forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setFileError(errors.join('; '));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Store selected files
    setSelectedFiles(validFiles);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFileError('');
    setFormData(prev => ({ ...prev, image_file: undefined, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = newImageUrl.trim();
    if (!trimmedUrl) return;

    // Validate URL format
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      setFileError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    const currentImages = formData.images || [];
    
    // Add to images array
    setFormData(prev => ({
      ...prev,
      images: [...currentImages, trimmedUrl],
      // Set as main image if no main image exists
      image_url: prev.image_url || trimmedUrl
    }));

    // Clear input
    setNewImageUrl('');
    setFileError('');
  };

  const handleRemoveImageFromArray = (index: number) => {
    const currentImages = formData.images || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      images: newImages,
      // If we removed the main image, set the first remaining image as main
      image_url: prev.image_url === currentImages[index] 
        ? (newImages[0] || '') 
        : prev.image_url
    }));
  };

  const handleSetAsMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }));
  };

  const handleUploadToKaha = async () => {
    if (selectedFiles.length === 0) {
      setFileError('Please select files first');
      return;
    }

    try {
      setIsUploadingToKaha(true);
      setFileError('');
      setUploadProgress('');

      const uploadedUrls: string[] = [];
      const errors: string[] = [];

      // Upload each file directly to Kaha from browser
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(`Uploading ${i + 1} of ${selectedFiles.length}: ${file.name}...`);

        try {
          const uploadFormData = new FormData();
          uploadFormData.append('files', file);

          // Upload directly to Kaha API from browser
          const response = await fetch('https://dev.kaha.com.np/main/api/v3/uploads/array', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const result = await response.json();

          // Extract fileUrl from response
          if (result.fileUrls && result.fileUrls.length > 0) {
            uploadedUrls.push(result.fileUrls[0].fileUrl);
          } else {
            errors.push(`${file.name}: No URL returned`);
          }
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          errors.push(`${file.name}: ${error.message}`);
        }
      }

      setUploadProgress('');

      if (uploadedUrls.length === 0) {
        throw new Error('Failed to upload any images');
      }

      // Add uploaded URLs to images array
      const currentImages = formData.images || [];
      
      setFormData(prev => ({
        ...prev,
        images: [...currentImages, ...uploadedUrls],
        // Set first uploaded image as main if no main image exists
        image_url: prev.image_url || uploadedUrls[0]
      }));

      // Clear selected files
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Show result message
      if (errors.length > 0) {
        setFileError(`✅ Uploaded ${uploadedUrls.length} of ${selectedFiles.length} images. Failed: ${errors.join('; ')}`);
      } else {
        // Clear error to show success in green
        setTimeout(() => setFileError(''), 3000); // Clear after 3 seconds
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      setFileError(error.message || 'Failed to upload images to Kaha CDN');
      setUploadProgress('');
    } finally {
      setIsUploadingToKaha(false);
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
          Upload Product Images to Kaha CDN
        </label>
        <div className={styles.fileUploadSection}>
          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={styles.fileInput}
            multiple
          />
          <div className={styles.fileInputHelper}>
            Select up to 10 images (JPEG, PNG, WebP - Max 5MB each)
          </div>
          
          {selectedFiles.length > 0 && (
            <div className={styles.selectedFilesInfo}>
              <strong>{selectedFiles.length} file(s) selected:</strong>
              <ul className={styles.fileList}>
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
              {uploadProgress && (
                <div className={styles.uploadProgress}>{uploadProgress}</div>
              )}
              <Button
                type="button"
                onClick={handleUploadToKaha}
                disabled={isUploadingToKaha}
                isLoading={isUploadingToKaha}
              >
                {isUploadingToKaha ? 'Uploading to Kaha CDN...' : 'Upload to Kaha CDN'}
              </Button>
            </div>
          )}
        </div>
        {fileError && (
          <span className={styles.errorText}>{fileError}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="imageUrls" className={styles.label}>
          Image URLs (Kaha CDN)
        </label>
        <div className={styles.imageUrlInput}>
          <Input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://compressedv2.s3.ap-south-1.amazonaws.com/..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddImageUrl();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddImageUrl}
            disabled={!newImageUrl.trim()}
          >
            Add URL
          </Button>
        </div>
        <div className={styles.fileInputHelper}>
          Add Kaha CDN image URLs. Press Enter or click Add URL.
        </div>

        {formData.images && formData.images.length > 0 && (
          <div className={styles.imageUrlsList}>
            <div className={styles.imagesHeader}>
              <strong>Images ({formData.images.length}):</strong>
            </div>
            {formData.images.map((url, index) => (
              <div key={index} className={styles.imageUrlItem}>
                <img 
                  src={url} 
                  alt={`Product ${index + 1}`} 
                  className={styles.imageThumbnail}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3E✕%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className={styles.imageUrlInfo}>
                  <div className={styles.imageUrlText} title={url}>
                    {url.substring(0, 60)}...
                  </div>
                  {formData.image_url === url && (
                    <span className={styles.mainImageBadge}>Main Image</span>
                  )}
                </div>
                <div className={styles.imageUrlActions}>
                  {formData.image_url !== url && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetAsMainImage(url)}
                    >
                      Set as Main
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRemoveImageFromArray(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
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
