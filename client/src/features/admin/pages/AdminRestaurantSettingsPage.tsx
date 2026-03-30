import { useEffect, useState } from 'react';
import { restaurantApi, Restaurant, UpdateRestaurantData } from '@/services/api/restaurantApi';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import styles from './AdminRestaurantSettingsPage.module.css';

const AdminRestaurantSettingsPage = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateRestaurantData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    opening_hours: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const fetchRestaurantInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantApi.getRestaurantInfo();
      setRestaurant(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        address: data.address,
        phone: data.phone,
        opening_hours: data.opening_hours || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load restaurant information');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSuccessMessage(null);
    setFormErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormErrors({});
    setSuccessMessage(null);
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        description: restaurant.description || '',
        address: restaurant.address,
        phone: restaurant.phone,
        opening_hours: restaurant.opening_hours || '',
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Restaurant name is required';
    }

    if (!formData.address || formData.address.trim() === '') {
      errors.address = 'Address is required';
    }

    if (!formData.phone || formData.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setUpdateLoading(true);
      setError(null);
      setSuccessMessage(null);

      const updateData: UpdateRestaurantData = {
        name: formData.name?.trim(),
        address: formData.address?.trim(),
        phone: formData.phone?.trim(),
      };

      if (formData.description && formData.description.trim() !== '') {
        updateData.description = formData.description.trim();
      }

      if (formData.opening_hours && formData.opening_hours.trim() !== '') {
        updateData.opening_hours = formData.opening_hours.trim();
      }

      const response = await restaurantApi.updateRestaurantInfo(updateData);
      setRestaurant(response);
      setSuccessMessage('Restaurant information updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update restaurant information');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && !restaurant) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={fetchRestaurantInfo}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Restaurant Settings</h1>
          <p className={styles.subtitle}>Manage your restaurant information</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={handleEditClick}>
            Edit Information
          </Button>
        )}
      </div>

      {successMessage && (
        <div className={styles.successMessage}>
          ✓ {successMessage}
        </div>
      )}

      {error && restaurant && (
        <div className={styles.errorMessage}>
          ⚠ {error}
        </div>
      )}

      {isEditing ? (
        <div className={styles.card}>
          <form onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>

              <div className={styles.formGrid}>
                <Input
                  label="Restaurant Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                  required
                  placeholder="Enter restaurant name"
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter restaurant description (optional)"
                  className={styles.textarea}
                  rows={4}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  className={styles.textarea}
                  rows={3}
                  required
                />
                {formErrors.address && (
                  <span className={styles.errorText}>{formErrors.address}</span>
                )}
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Opening Hours</label>
                <textarea
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM (optional)"
                  className={styles.textarea}
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
                disabled={updateLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={updateLoading}>
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Restaurant Name</span>
                <span className={styles.value}>{restaurant.name}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Phone Number</span>
                <span className={styles.value}>{restaurant.phone}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Description</span>
                <span className={styles.value}>
                  {restaurant.description || 'Not provided'}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Address</span>
                <span className={styles.value}>{restaurant.address}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Opening Hours</span>
                <span className={styles.value}>
                  {restaurant.opening_hours || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>System Information</h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Created At</span>
                <span className={styles.value}>
                  {new Date(restaurant.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Last Updated</span>
                <span className={styles.value}>
                  {new Date(restaurant.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurantSettingsPage;
