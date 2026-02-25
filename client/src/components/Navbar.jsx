import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🍽️ Restaurant
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/menu" className="navbar-link">Menu</Link>
          </li>
          
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <li>
                    <Link to="/cart" className="navbar-link">🛒 Cart</Link>
                  </li>
                  <li>
                    <Link to="/orders" className="navbar-link">My Orders</Link>
                  </li>
                </>
              )}
              
              {isAdmin && (
                <>
                  <li>
                    <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="navbar-link">Products</Link>
                  </li>
                  <li>
                    <Link to="/admin/orders" className="navbar-link">Orders</Link>
                  </li>
                </>
              )}
              
              <li>
                <span className="navbar-link">👤 {user?.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li>
                <Link to="/register" className="navbar-link">Register</Link>
              </li>
              <li>
                <Link to="/admin/login" className="navbar-link">Admin</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
