import './Footer.css';

function Footer() {
  return (
    <footer className="footer nav-footer">
      <div className="footer-content">
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Adrian Oxley Obadiah. All rights reserved.</p>
        </div>
        <div className="social-links socials">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <img src={process.env.PUBLIC_URL + "/assets/github.png"} alt="GitHub" className="footer-social-icon" />
          </a>
          <a href="https://www.linkedin.com/in/adrian-obadiah-5682822ba/" target="_blank" rel="noopener noreferrer">
            <img src={process.env.PUBLIC_URL + "/assets/linkedin.png"} alt="LinkedIn" className="footer-social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
