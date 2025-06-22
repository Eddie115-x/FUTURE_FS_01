import "./ChangeLog.css";

const ChangeLog = () => {
  return (
    <div className="change-log-container">
      <header className="change-log-header">
        <h1>Change Log</h1>
        <p className="description">
          The website will be going through several iterations as I slowly build out all the pages.
          This change log provides information on each new iteration or release of the website
          by outlining the changes made and new aspects of the website to check out.
        </p>
      </header>

      <section className="change-log-table">
        <div className="table-header">
          <div>Version</div>
          <div>Date</div>
          <div>Features</div>
        </div>
        <div className="table-row">
          <div><strong>1.0</strong></div>
          <div>Launch Date: June 22, 2025</div>
          <div>
            <ul>
              <li><strong>Initial Website Launch:</strong> React-based personal portfolio with responsive design</li>
              <li><strong>Core Architecture:</strong>
                <ul>
                  <li>React 18 with React Router DOM for page navigation</li>
                  <li>CSS custom properties for theming (light/dark mode)</li>
                  <li>Component-based architecture for maintainability</li>
                  <li>GitHub Pages deployment with proper asset path handling</li>
                </ul>
              </li>
              <li><strong>Key Features:</strong>
                <ul>
                  <li>Responsive design that works on all screen sizes (mobile to desktop)</li>
                  <li>Dark/light theme toggle with persistent state</li>
                  <li>Optimized image loading and component rendering</li>
                  <li>Smooth scrolling navigation</li>
                  <li>Accessibility considerations in UI elements</li>
                </ul>
              </li>
              <li><strong>Content Sections:</strong>
                <ul>
                  <li>Personal Profile section with profile and introduction</li>
                  <li>About section with bio and downloadable CV</li>
                  <li>Tech Stack visualization with organized categories (Frontend, Backend, Tools)</li>
                  <li>Projects showcase with interactive cards</li>
                  <li>Blog section (placeholder for future content)</li>
                  <li>Contact information with form and social links</li>
                </ul>
              </li>
              <li><strong>Technical Implementations:</strong>
                <ul>
                  <li>React Context API for state management</li>
                  <li>CSS Grid and Flexbox for modern layouts</li>
                  <li>Dynamic content rendering using component props</li>
                  <li>React Icons integration for tech stack visualization</li>
                  <li>Mobile-first responsive design principles</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChangeLog;
