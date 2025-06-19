import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Adrian Oxley Obadiah. All rights reserved.</p>
        <div className="social-links">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <img src="/assets/github.png" alt="GitHub" className="footer-social-icon" />
          </a>
          <a href="https://www.linkedin.com/in/adrian-obadiah-5682822ba/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/linkedin.png" alt="LinkedIn" className="footer-social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
