import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-eyebrow">✨ Exquisite Dining Experience</div>
            <h1 className="hero-title">
              Taste the <span className="highlight">Extraordinary</span> at Antigravity Swad
            </h1>
            <p className="hero-subtitle">
              Embark on a culinary journey where authentic Nepali traditions meet modern fusion.
              Fresh ingredients, masterful techniques, and a passion for perfection in every bite.
            </p>

            <div className="hero-actions">
              <Link to="/menu" className="btn btn-primary btn-lg">
                Explore Our Menu
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline btn-lg" style={{ color: 'var(--white)', borderColor: 'rgba(255,255,255,0.3)' }}>
                  Join the Club
                </Link>
              )}
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="hero-stat-number">4.9/5</div>
                <div className="hero-stat-label">Guest Rating</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-number">20+</div>
                <div className="hero-stat-label">Expert Chefs</div>
              </div>
              <div className="hero-stat-item">
                <div className="hero-stat-number">100%</div>
                <div className="hero-stat-label">Fresh Ingredients</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-card-stack">
              <div className="hero-dish-card">
                <div className="hero-dish-emoji">🥟</div>
                <div className="hero-dish-info">
                  <div className="hero-dish-name">Signature MoMo</div>
                  <div className="hero-dish-price">Rs. 450</div>
                </div>
              </div>
              <div className="hero-dish-card">
                <div className="hero-dish-emoji">🍱</div>
                <div className="hero-dish-info">
                  <div className="hero-dish-name">Royal Thakali</div>
                  <div className="hero-dish-price">Rs. 850</div>
                </div>
              </div>
            </div>
            <div className="hero-card-stack" style={{ marginTop: '40px' }}>
              <div className="hero-dish-card">
                <div className="hero-dish-emoji">🍕</div>
                <div className="hero-dish-info">
                  <div className="hero-dish-name">Artisan Pizza</div>
                  <div className="hero-dish-price">Rs. 720</div>
                </div>
              </div>
              <div className="hero-dish-card">
                <div className="hero-dish-emoji">🍰</div>
                <div className="hero-dish-info">
                  <div className="hero-dish-name">Fusion Dessert</div>
                  <div className="hero-dish-price">Rs. 380</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Personal Greeting for Logged-in Users */}
        {isAuthenticated && (
          <motion.section
            className="greeting-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="greeting-text">
              <h2>Welcome back, {user?.name}! 👋</h2>
              <p>Ready to discover something extraordinary today?</p>
            </div>
            <div className="greeting-actions">
              <Link to="/orders" className="btn btn-secondary">View My Orders</Link>
              <Link to="/cart" className="btn btn-primary">Go to Cart</Link>
            </div>
          </motion.section>
        )}

        {/* Features Section */}
        <section className="features-section">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="section-title">Why Choose Antigravity Swad?</h2>
            <p className="section-subtitle">The standard for premium dining and delivery</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Authentic Taste</h3>
              <p>Traditional recipes passed down through generations, preserved in their purest form.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Delivery</h3>
              <p>Get your favorite dishes delivered to your doorstep while they are still steaming hot.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Premium Quality</h3>
              <p>We source only the finest ingredients from local farmers and international suppliers.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
