import { useState, FormEvent } from 'react';
import { authApi } from '@/services/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import styles from './AuthForm.module.css';

interface RegisterFormProps {
  onSuccess: (userRole: string) => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

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
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    // Phone is optional, but if provided must be valid
    if (!phone) {
      setPhoneError('');
      return true;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      setPhoneError('Phone must be 10 digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateAddress = (address: string): boolean => {
    // Address is optional
    if (!address) {
      setAddressError('');
      return true;
    }
    if (address.trim().length < 5) {
      setAddressError('Address must be at least 5 characters');
      return false;
    }
    setAddressError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneValid = validatePhone(phone);
    const isAddressValid = validateAddress(address);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isPhoneValid || !isAddressValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({ 
        name: name.trim(), 
        email: email.trim(), 
        password,
        phone: phone.replace(/[\s\-\(\)]/g, '') || undefined,
        address: address.trim() || undefined
      });
      setAuth(response.user, response.accessToken, response.refreshToken);
      onSuccess(response.user.role);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      // Check for duplicate email error
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exist')) {
        setError('An account with this email already exists. Please use a different email or sign in.');
      } else {
        setError(errorMessage);
      }
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
        type="text"
        label="Full Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) validateName(e.target.value);
        }}
        onBlur={() => validateName(name)}
        error={nameError}
        required
        autoComplete="name"
        placeholder="John Doe"
      />

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) validateEmail(e.target.value);
        }}
        onBlur={() => validateEmail(email)}
        error={emailError}
        required
        autoComplete="email"
        placeholder="you@example.com"
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
        autoComplete="new-password"
        placeholder="••••••••"
        helperText="At least 6 characters"
      />

      <Input
        type="tel"
        label="Phone Number (Optional)"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          if (phoneError) validatePhone(e.target.value);
        }}
        onBlur={() => validatePhone(phone)}
        error={phoneError}
        autoComplete="tel"
        placeholder="1234567890"
        helperText="10 digits"
      />

      <Input
        type="text"
        label="Address (Optional)"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          if (addressError) validateAddress(e.target.value);
        }}
        onBlur={() => validateAddress(address)}
        error={addressError}
        autoComplete="street-address"
        placeholder="123 Main St, City, State"
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  );
};
