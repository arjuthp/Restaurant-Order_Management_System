import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = (userRole: string) => {
    // Get the original URL from location state, if it exists
    const from = (location.state as any)?.from?.pathname || null;
    
    // If there's a stored URL, redirect there
    if (from && from !== '/auth') {
      navigate(from, { replace: true });
      return;
    }
    
    // Otherwise, redirect based on user role
    if (userRole === 'admin') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/products', { replace: true }); // Home page for customers is the products page
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        
        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}

        <div className={styles.toggle}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className={styles.link}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className={styles.link}>
                Sign in
              </button>
            </>
          )}
        </div>

        <div className={styles.adminLink}>
          <a href="/admin/login" className={styles.link}>
            🔐 Admin Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
