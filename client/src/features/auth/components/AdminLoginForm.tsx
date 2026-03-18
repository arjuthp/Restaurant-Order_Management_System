import { useState, FormEvent } from 'react';
import { authApi } from '@/services/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import styles from './AuthForm.module.css';

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export const AdminLoginForm = ({ onSuccess }: AdminLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

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
      if (response.user.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        setIsLoading(false);
        return;
      }
      
      setAuth(response.user, response.accessToken, response.refreshToken);
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
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

      <Input
        type="password"
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

      <Button type="submit" fullWidth isLoading={isLoading}>
        Sign In as Admin
      </Button>
    </form>
  );
};
