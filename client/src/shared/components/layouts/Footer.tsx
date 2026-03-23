import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.heading}>Restaurant App</h3>
            <p className={styles.description}>
              Delicious food delivered to your table or home.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.subheading}>Quick Links</h4>
            <nav className={styles.links} aria-label="Footer navigation">
              <Link to="/products" className={styles.link}>
                Menu
              </Link>
              <Link to="/orders" className={styles.link}>
                Orders
              </Link>
              <Link to="/profile" className={styles.link}>
                Profile
              </Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.subheading}>Contact</h4>
            <div className={styles.contact}>
              <p>Email: info@restaurant.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} Restaurant App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
