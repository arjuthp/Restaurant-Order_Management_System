import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#2c3e50' }}>
          Welcome to Our Restaurant 🍽️
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
          Delicious Nepali, Fusion & Western Cuisine
        </p>

        {isAuthenticated ? (
          <div>
            <h2 style={{ marginBottom: '30px' }}>Hello, {user?.name}! 👋</h2>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
                Browse Menu
              </Link>
              {user?.role === 'customer' && (
                <>
                  <Link to="/cart" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
                    View Cart
                  </Link>
                  <Link to="/orders" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
                    My Orders
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/menu" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
              Browse Menu
            </Link>
            <Link to="/register" className="btn btn-success" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
              Login
            </Link>
          </div>
        )}

        <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🥟</div>
            <h3>Nepali Classics</h3>
            <p>Authentic momos, dal bhat, and traditional dishes</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌮</div>
            <h3>Fusion Delights</h3>
            <p>Creative fusion of Nepali and international flavors</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🍕</div>
            <h3>Western Favorites</h3>
            <p>Pizza, burgers, pasta and more</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
