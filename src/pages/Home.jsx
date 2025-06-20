import { FaBootstrap, FaCss3Alt, FaHtml5, FaJs, FaNodeJs, FaReact } from 'react-icons/fa';
import { SiExpress, SiFirebase, SiMongodb, SiMysql } from 'react-icons/si';
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
        <div className="content-wrapper">
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
        </div>
      </section>
      
      {/* About Section */}
      <section className="about-section" id="about">
        <div className="content-wrapper">
          <div className="about-container" data-aos="fade-up">
            <h2 className="about-title">My tech Home in the intert. </h2>
            <div className="about-content">
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
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="skills">
        <div className="content-wrapper">
          <h2 className="skills-title">My Tech Stack</h2>
          <div className="skills-container">
            <div className="skill-category">
              <h3>Frontend</h3>
              <ul>
                <li><FaHtml5 className="tech-icon html-icon" /> HTML5</li>
                <li><FaCss3Alt className="tech-icon css-icon" /> CSS3</li>
                <li><FaReact className="tech-icon react-icon" /> React</li>
                <li><FaBootstrap className="tech-icon bootstrap-icon" /> Bootstrap</li>
              </ul>
            </div>
            
            <div className="skill-category">
              <h3>Backend</h3>
              <ul>
                <li><FaNodeJs className="tech-icon nodejs-icon" /> Node.js</li>
                <li><SiExpress className="tech-icon express-icon" /> Express</li>
                <li><SiMongodb className="tech-icon mongodb-icon" /> MongoDB</li>
                <li><SiFirebase className="tech-icon firebase-icon" /> Firebase</li>
                <li><FaJs className="tech-icon js-icon" /> JavaScript</li>
                <li><SiMysql className="tech-icon mysql-icon" /> MySQL</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="projects-section" id="projects">
        <div className="content-wrapper">
          <div className="projects-container">
            <h2 className="projects-title">My Projects</h2>
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
        </div>
      </section>
    </div>
  );
}

export default Home;
