import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import ThemeToggle from './ThemeToggle';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setShowLogin(false);
        setEmail('');
        setPassword('');
        setLoginError('');
        navigate('/admin');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (err) {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      {/* Add overlay for mobile menu when it's open */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
      <div className="navbar-inner">
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <img src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Adrian Obadiah Logo" className="logo-image" />
            <span className="logo-slogan">ADRIAN OBADIAH</span>
          </Link>
        </div>
        <div className="navbar-actions">
          <ThemeToggle />
          {/* User Icon */}
          <button className="user-icon-btn" onClick={() => setShowLogin(true)} title="Admin Login">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/></svg>
          </button>
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className={`hamburger-bar ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-bar ${isMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-bar ${isMenuOpen ? 'open' : ''}`}></div>
          </div>
        </div>
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>Articles</Link></li>
          <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li><Link to="/changelog" onClick={() => setIsMenuOpen(false)}>Change Log</Link></li>
        </ul>
      </div>
      {/* Login Modal */}
      {showLogin && (
        <div className="login-modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {loginError && <div className="login-error">{loginError}</div>}
              <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
              <button type="button" className="login-cancel" onClick={() => setShowLogin(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
