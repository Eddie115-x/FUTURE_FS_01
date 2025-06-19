import { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import ThemeToggle from './ThemeToggle';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Adrian Obadiah</Link>
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
        <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
        <li><Link to="/projects" onClick={() => setIsMenuOpen(false)}>Projects</Link></li>
        <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
        <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
        <li><Link to="/changelog" onClick={() => setIsMenuOpen(false)}>Change Log</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
