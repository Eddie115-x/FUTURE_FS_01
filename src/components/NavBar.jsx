import { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import ThemeToggle from './ThemeToggle';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
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
    </nav>
  );
}

export default NavBar;
