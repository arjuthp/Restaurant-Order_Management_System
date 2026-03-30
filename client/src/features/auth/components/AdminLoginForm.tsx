import { useState, FormEvent, useEffect } from 'react';
import { authApi } from '@/services/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { PasswordInput } from '@/shared/components/PasswordInput';
import styles from './AuthForm.module.css';

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export const AdminLoginForm = ({ onSuccess }: AdminLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Load remembered email and password on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedAdminEmail');
    const rememberedPassword = localStorage.getItem('rememberedAdminPassword');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
    if (rememberedPassword) {
      setPassword(rememberedPassword);
    }
  }, []);

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.adminLogin({ email, password });
      
      // Verify the user has admin role
      if (response.data.user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        setIsLoading(false);
        return;
      }
      
      setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);
      
      // Save email and password if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedAdminEmail', email);
        localStorage.setItem('rememberedAdminPassword', password);
      } else {
        localStorage.removeItem('rememberedAdminEmail');
        localStorage.removeItem('rememberedAdminPassword');
      }
      
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="Admin Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) validateEmail(e.target.value);
        }}
        onBlur={() => validateEmail(email)}
        error={emailError}
        required
        autoComplete="email"
        placeholder="admin@restaurant.com"
      />

      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) validatePassword(e.target.value);
        }}
        onBlur={() => validatePassword(password)}
        error={passwordError}
        required
        autoComplete="current-password"
        placeholder="••••••••"
      />

      <div className={styles.rememberSection}>
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor="rememberMe" className={styles.checkboxLabel}>
          Remember me
        </label>
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        Sign In as Admin
      </Button>
    </form>
  );
};
