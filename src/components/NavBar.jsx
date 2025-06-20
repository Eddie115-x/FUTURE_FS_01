import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';
import ThemeToggle from './ThemeToggle';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    
    // If we're on the home page, scroll to the section
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're not on the home page, navigate to home and then scroll
      // We'll need to add a small delay to allow the page to load
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <img src="/assets/logo.png" alt="Adrian Obadiah Logo" className="logo-image" />
          <span className="logo-slogan">Edz Digicraft</span>
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
        <li><a href="#about" onClick={() => scrollToSection('about')}>About</a></li>
        <li><a href="#projects" onClick={() => scrollToSection('projects')}>Projects</a></li>
        <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
        <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
        <li><Link to="/changelog" onClick={() => setIsMenuOpen(false)}>Change Log</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
