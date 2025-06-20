import ProjectCard from '../components/ProjectCard';
import '../pages/About.css';
import '../pages/Projects.css';
import './Home.css';

function Home() {
  // Project data from Projects component
  const projects = [
    {
      id: 1,
      title: 'E-Portfolio Website',
      description: 'A fully responsive personal e-portfolio website built with React, css, html, java. Features include .',
      imageUrl: '/assets/project-1.png',
      projectUrl: 'https://project1.example.com',
      githubUrl: 'https://github.com/yourusername/project1'
    },
    {
      id: 2,
      title: 'Weather App',
      description: 'A weather application that fetches real-time weather data from OpenWeatherMap API. Users can search for weather information by city name or use geolocation to get local weather.',
      imageUrl: '/assets/project-2.png',
      projectUrl: 'https://project2.example.com',
      githubUrl: 'https://github.com/yourusername/project2'
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'A task management application built with React and Node.js. Features include task creation, categorization, due dates, and reminders.',
      imageUrl: '/assets/project-3.png',
      projectUrl: 'https://project3.example.com',
      githubUrl: 'https://github.com/yourusername/project3'
    }
  ];

  return (
    <div className="home-container">
      {/* Personal Profile */}
      <section className="Personal_Profile" id="home">
        <div className="profile-container">
          <img src="/assets/profile-pic.png" alt="Profile" className="profile-pic" />
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Hi, I'm Adrian Obadiah</h1>
            <h2>Full Stack Developer</h2>
            <p>I build responsive websites and web applications.</p>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-container" data-aos="fade-up">
          <h2 className="about-title">Get to know me more...</h2>
          <div className="about-content">
            <img
              src="/assets/about-pic.png"
              alt="Profile"
              className="about-image"
            />
            <div className="about-text">
              <p>
                My journey into tech wasn't straightforward. I started out as a pure science student in high school,
                unsure of what path to follow after graduation. Everything changed after Year 12 when I discovered coding —
                and I haven't looked back since. Today, I'm a third-year Software Engineering student at the University of the South Pacific in Laucala, Fiji.
                Over the past two years, I've worked on various academic and personal projects, including mobile applications and websites.
                Every challenge has been a learning curve — and this portfolio is proof that I'm moving in the right direction.
              </p>
              <a
                href="/assets/cv doc.pdf"
                download
                className="download-cv-btn"
              >
                Download My CV
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="skills">
        <h2>Tech Stack</h2>
        <div className="skills-container">
          <div className="skill-category">
            <h3>Frontend</h3>
            <ul>
              <li>HTML5</li>
              <li>CSS3</li>
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
              <li>JavaScript</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="projects-section" id="projects">
        <div className="projects-container">
          <h2>My Projects</h2>
          <p className="projects-intro">Here's a collection of my recent work. Each project demonstrates different skills and technologies.</p>
          
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard 
                key={project.id}
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl}
                projectUrl={project.projectUrl}
                githubUrl={project.githubUrl}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
