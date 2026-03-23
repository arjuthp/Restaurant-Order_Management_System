import { useEffect, useState } from 'react';
import { usersApi, User, UpdateProfileData } from '@/services/api/usersApi';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { useAuthStore } from '@/store/authStore';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    phone: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { setAuth, user: authUser, accessToken, refreshToken } = useAuthStore();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await usersApi.getMyProfile();
      setUser(userData);
      // Pre-fill form data
      setFormData({
        name: userData.name,
        phone: userData.phone || '',
        address: userData.address || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
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
    // Reset form data to current user data
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Phone validation (optional, but if provided must be valid)
    if (formData.phone && formData.phone.trim() !== '') {
      const phoneRegex = /^\d{10}$/;
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = 'Phone must be 10 digits';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
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

      // Prepare data - only send non-empty values
      const updateData: UpdateProfileData = {
        name: formData.name?.trim() || '',
      };

      if (formData.phone && formData.phone.trim() !== '') {
        updateData.phone = formData.phone.trim();
      }

      if (formData.address && formData.address.trim() !== '') {
        updateData.address = formData.address.trim();
      }

      const response = await usersApi.updateMyProfile(updateData);
      
      // Update local user state
      setUser(response);
      
      // Update auth store with new user data
      if (authUser && accessToken && refreshToken) {
        setAuth(
          {
            id: response.id || response._id, // Backend returns 'id'
            name: response.name,
            email: response.email,
            role: response.role,
          },
          accessToken,
          refreshToken
        );
      }

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Reload page to update all components with new name
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={fetchUserProfile}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        {!isEditing && <Button variant="primary" onClick={handleEditClick}>Edit Profile</Button>}
      </div>

      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      {isEditing ? (
        <div className={styles.card}>
          <form onSubmit={handleSubmit}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Edit Personal Information</h2>
              
              <div className={styles.formGrid}>
                <Input
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                  required
                  placeholder="Enter your name"
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed"
                />

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                  placeholder="10 digit phone number"
                  helperText="Optional - 10 digits"
                />

                <Input
                  label="Address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={formErrors.address}
                  placeholder="Enter your address"
                  helperText="Optional"
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
              <Button
                type="submit"
                variant="primary"
                disabled={updateLoading}
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.card}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>{user.name}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{user.email}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Phone</span>
                <span className={styles.value}>
                  {user.phone || 'Not provided'}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Address</span>
                <span className={styles.value}>
                  {user.address || 'Not provided'}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Role</span>
                <span className={`${styles.badge} ${styles[user.role]}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Details</h2>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Member Since</span>
                <span className={styles.value}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>Last Updated</span>
                <span className={styles.value}>
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
