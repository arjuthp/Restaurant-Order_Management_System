import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'customer' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      // Redirect based on role
      if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us for a premium dining experience</p>

        {error && <div className="error animate-fade-in">{error}</div>}

        <form onSubmit={handleSubmit} className="stagger">
          <div className="form-group animate-fade-in-up">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group animate-fade-in-up">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group animate-fade-in-up">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-row animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="+977"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Register As</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
                style={{ appearance: 'auto' }}
              >
                <option value="customer">Customer</option>
                <option value="admin">Restaurant Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group animate-fade-in-up">
            <label className="form-label">Delivery Address</label>
            <input
              type="text"
              name="address"
              placeholder="Where should we deliver?"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full animate-fade-in-up" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? (
              <>
                <div className="spinner-sm" style={{ marginRight: '10px', display: 'inline-block' }}></div>
                Creating Account...
              </>
            ) : 'Register Now'}
          </button>
        </form>

        <p className="auth-footer animate-fade-in" style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600', color: 'var(--gold-dark)' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
