import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'left', marginBottom: '40px' }}>
                    <div>
                        <h3 style={{ color: 'var(--gold)', marginBottom: '20px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem' }}>🍽️</span> Antigravity Swad
                        </h3>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.8 }}>
                            Experience the extraordinary. Nepali Classics, Creative Fusion & Western Favorites, delivered with precision and passion.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--white)', marginBottom: '15px' }}>Explore</h4>
                        <ul style={{ listStyle: 'none', fontSize: '14px', padding: 0 }}>
                            <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></li>
                            <li style={{ marginBottom: '10px' }}><Link to="/menu" style={{ color: 'inherit', textDecoration: 'none' }}>Our Menu</Link></li>
                            <li style={{ marginBottom: '10px' }}><Link to="/orders" style={{ color: 'inherit', textDecoration: 'none' }}>Track Orders</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--white)', marginBottom: '15px' }}>Support</h4>
                        <ul style={{ listStyle: 'none', fontSize: '14px', padding: 0 }}>
                            <li style={{ marginBottom: '10px' }}>Help Center</li>
                            <li style={{ marginBottom: '10px' }}>Safety & Hygiene</li>
                            <li style={{ marginBottom: '10px' }}>Terms of Service</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--white)', marginBottom: '15px' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}>
                            <span style={{ cursor: 'pointer', transition: '0.3s' }} onMouseOver={e => e.target.style.transform = 'scale(1.2)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>📸</span>
                            <span style={{ cursor: 'pointer', transition: '0.3s' }} onMouseOver={e => e.target.style.transform = 'scale(1.2)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>📘</span>
                            <span style={{ cursor: 'pointer', transition: '0.3s' }} onMouseOver={e => e.target.style.transform = 'scale(1.2)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>🐦</span>
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', textAlign: 'center' }}>
                    <p>© {currentYear} Created with <span style={{ color: 'var(--orange)' }}>♥</span> by <strong>Arju Thapa</strong>. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
