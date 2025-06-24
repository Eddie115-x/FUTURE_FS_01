import { useEffect, useState } from 'react';
import { FaCss3Alt, FaHtml5, FaJs, FaNodeJs, FaReact } from 'react-icons/fa';
import { SiExpress, SiFirebase, SiMysql } from 'react-icons/si';
import ProjectCard from '../components/ProjectCard';
import '../pages/About.css';
import '../pages/Projects.css';
import supabase from '../supabase';
import './Home.css';

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Check if table exists first
        const { error: tableError } = await supabase
          .from('projects')
          .select('count')
          .limit(1);
        
        if (tableError) {
          if (tableError.code === '42P01') { // PostgreSQL error code for undefined_table
            setError(
              'The projects table does not exist yet. Please run the SQL setup script.'
            );
            setProjects([]);
            return;
          }
          throw tableError;
        }
        
        // Fetch published projects from Supabase
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('published', true)  // Only fetch published projects
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map Supabase field names to what ProjectCard expects
        const formattedProjects = (data || []).map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          imageUrl: project.image_url,
          projectUrl: project.live_url,
          githubUrl: project.github_url
        }));
        
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
        
        // Use fallback project data if API fails
        setProjects([
          {
            id: 1,
            title: 'E-Portfolio Website',
            description: 'A fully responsive personal e-portfolio website built with React, css, html, java.',
            imageUrl: process.env.PUBLIC_URL + '/assets/project-1.png',
            projectUrl: 'https://project1.example.com',
            githubUrl: 'https://github.com/yourusername/project1'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <div className="home-container">
      {/* Personal Profile */}
      <section className="Personal_Profile" id="home">
        <div className="content-wrapper">
          <div className="profile-container">
            <img src={process.env.PUBLIC_URL + "/assets/profile-pic.png"} alt="Profile" className="profile-pic" />
          </div>
          <div className="hero-content">
            <div className="hero-text">
              <h1>Halo wantok, I'm Adrian</h1>
              <h2>Full Stack Developer</h2>
              <p>I build responsive websites and web applications.</p>
              <a
                  href={process.env.PUBLIC_URL + "/assets/cv doc.pdf"}
                  download
                  className="download-cv-btn"
                >
                  Download My CV
                </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="about-section" id="about">
        <div className="content-wrapper">
          <div className="about-container" data-aos="fade-up">
            <h2 className="about-title">My tech Home in the internet. </h2>
            <div className="about-content">
              <div className="about-text-image-container">
                <div className="about-text">
                  <p>
                    My journey into tech wasn't straightforward. I started out as a pure science student in high school,
                    unsure of what path to follow after graduation. Everything changed after Year 12 when I discovered coding —
                    and I haven't looked back since. Today, I'm a third-year Software Engineering student at the University of the South Pacific in Laucala, Fiji.
                    Over the past two years, I've worked on various academic and personal projects, including mobile applications and websites.
                    Every challenge has been a learning curve — and this portfolio is proof that I'm moving in the right direction.
                  </p>
                </div>
                <div className="about-profile-container">
                  <img src={process.env.PUBLIC_URL + "/assets/about-me.png"} alt="Profile" className="about-profile-pic" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section className="skills">
        <div className="content-wrapper">
          <h2 className="skills-title">Tools I'm proficient in</h2>
          <div className="skills-container">
            <div className="skill-category">
              <h3>Frontend</h3>
              <ul>
                <li><FaHtml5 className="tech-icon html-icon" /> HTML5</li>
                <li><FaCss3Alt className="tech-icon css-icon" /> CSS3</li>
                <li><FaReact className="tech-icon react-icon" /> React</li>
              </ul>
            </div>
            
            <div className="skill-category">
              <h3>Backend</h3>
              <ul>
                <li><FaNodeJs className="tech-icon nodejs-icon" /> Node.js</li>
                <li><SiExpress className="tech-icon express-icon" /> Express</li>
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
              {loading ? (
                <p>Loading projects...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : (
                projects.map(project => (
                  <ProjectCard 
                    key={project._id || project.id}
                    title={project.title}
                    description={project.description}
                    imageUrl={project.imageUrl}
                    projectUrl={project.projectUrl}
                    githubUrl={project.githubUrl}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
