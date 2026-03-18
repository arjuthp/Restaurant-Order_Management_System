import { useNavigate, useLocation } from 'react-router-dom';
import { AdminLoginForm } from '../components/AdminLoginForm';
import styles from './AdminLoginPage.module.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('AdminLoginPage loaded!'); // Debug log

  const handleSuccess = () => {
    // Get the original URL from location state, if it exists
    const from = (location.state as any)?.from?.pathname || null;
    
    // If there's a stored URL and it's an admin route, redirect there
    if (from && from.startsWith('/admin') && from !== '/admin/login') {
      navigate(from, { replace: true });
      return;
    }
    
    // Otherwise, redirect to admin dashboard
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔐</span>
          </div>
          <h1 className={styles.title}>Admin Portal</h1>
          <p className={styles.subtitle}>Sign in to manage your restaurant</p>
        </div>
        
        <AdminLoginForm onSuccess={handleSuccess} />

        <div className={styles.footer}>
          <a href="/auth" className={styles.link}>
            ← Back to Customer Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
