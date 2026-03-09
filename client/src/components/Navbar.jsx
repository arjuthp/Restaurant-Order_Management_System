import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="navbar-brand-icon">AS</div>
          <span>Antigravity <span className="brand-suffix">Swad</span></span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li>
            <Link to="/menu" className={`navbar-link ${isActive('/menu') ? 'active' : ''}`} onClick={closeMenu}>
              <span className="link-icon">🍽️</span> Menu
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <li>
                    <Link to="/cart" className={`navbar-link ${isActive('/cart') ? 'active' : ''}`} onClick={closeMenu}>
                      <div className="cart-link-wrapper" style={{ position: 'relative' }}>
                        <span className="link-icon">🛒</span> Cart
                        {cartCount > 0 && (
                          <span className="cart-badge animate-fade-in" style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-12px',
                            background: 'var(--orange)',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}>
                            {cartCount}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className={`navbar-link ${isActive('/orders') ? 'active' : ''}`} onClick={closeMenu}>
                      <span className="link-icon">Box</span> Orders
                    </Link>
                  </li>
                </>
              )}

              {isAdmin && (
                <>
                  <li>
                    <Link to="/admin/dashboard" className={`navbar-link ${isActive('/admin/dashboard') ? 'active' : ''}`} onClick={closeMenu}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className={`navbar-link ${isActive('/admin/products') ? 'active' : ''}`} onClick={closeMenu}>
                      Products
                    </Link>
                  </li>
                </>
              )}

              <li className="navbar-divider"></li>

              <li className="navbar-user-item">
                <div className="navbar-user">
                  <div className="navbar-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span>{user?.name}</span>
                </div>
              </li>

              <li>
                <button onClick={handleLogout} className="navbar-link logout-btn" style={{ color: 'var(--orange)' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="navbar-link" onClick={closeMenu}>Login</Link>
              </li>
              <li>
                <Link to="/register" className="navbar-link" onClick={closeMenu}>Register</Link>
              </li>
              <li className="navbar-divider"></li>
              <li>
                <Link to="/admin/login" className="navbar-link admin-link" onClick={closeMenu}>Admin</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
