import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Hi, I'm Adrian Obadiah</h1>
            <h2>Frontend Developer</h2>
            <p>I build responsive websites and web applications.</p>
            <div className="hero-buttons">
              <a href="#projects" className="btn primary-btn">View My Work</a>
              <a href="/contact" className="btn secondary-btn">Contact Me</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/profile-pic.png" alt="Profile" className="floating-profile" />
          </div>
        </div>
      </section>
      
      <section className="featured-projects" id="projects">
        <h2>Featured Projects</h2>
        <p>Here are some of my recent works</p>
        {/* ProjectCard components will be imported and displayed here */}
      </section>
      
      <section className="skills">
        <h2>My Skills</h2>
        <div className="skills-container">
          <div className="skill-category">
            <h3>Frontend</h3>
            <ul>
              <li>HTML5</li>
              <li>CSS3</li>
              <li>JavaScript</li>
              <li>React</li>
              <li>Bootstrap</li>
            </ul>
          </div>
          
          <div className="skill-category">
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express</li>
              <li>MongoDB</li>
              <li>Firebase</li>
            </ul>
          </div>
          
          <div className="skill-category">
            <h3>Tools</h3>
            <ul>
              <li>Git</li>
              <li>VS Code</li>
              <li>Figma</li>
              <li>Adobe XD</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
