import { useEffect, useState } from 'react';
import { FaCss3Alt, FaHtml5, FaJava, FaPython, FaReact } from 'react-icons/fa';
import { SiCplusplus, SiDotnet, SiMysql, SiSpringboot, SiSupabase } from 'react-icons/si';
import { TbBrandJavascript } from 'react-icons/tb';
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
            githubUrl: 'https://github.com/Eddie115-x/project1'
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
      </section>      {/* Skills Section */}
      <section className="skills" id="skills">
        <div className="content-wrapper">
          <h2 className="skills-title">Current Tech Stack</h2>
          <div className="tech-icons-container">
            <div className="tech-icons-grid">
              <div className="tech-icon-item" title="HTML5">
                <FaHtml5 className="tech-icon html-icon" aria-label="HTML5" />
              </div>
              <div className="tech-icon-item" title="CSS3">
                <FaCss3Alt className="tech-icon css-icon" aria-label="CSS3" />
              </div>
              <div className="tech-icon-item" title="JavaScript">
                <TbBrandJavascript className="tech-icon js-icon" aria-label="JavaScript" />
              </div>
              <div className="tech-icon-item" title="React">
                <FaReact className="tech-icon react-icon" aria-label="React" />
              </div>
              <div className="tech-icon-item" title="Supabase">
                <SiSupabase className="tech-icon supabase-icon" aria-label="Supabase" />
              </div>
              <div className="tech-icon-item" title="Java">
                <FaJava className="tech-icon java-icon" aria-label="Java" />
              </div>
              <div className="tech-icon-item" title="MySQL">
                <SiMysql className="tech-icon mysql-icon" aria-label="MySQL" />
              </div>
              <div className="tech-icon-item" title="C++">
                <SiCplusplus className="tech-icon cpp-icon" aria-label="C++" />
              </div>
              <div className="tech-icon-item" title=".NET">
                <SiDotnet className="tech-icon dotnet-icon" aria-label=".NET" />
              </div>
              <div className="tech-icon-item" title="Spring Boot">
                <SiSpringboot className="tech-icon spring-icon" aria-label="Spring Boot" />
              </div>
              <div className="tech-icon-item" title="Python">
                <FaPython className="tech-icon python-icon" aria-label="Python" />
              </div>
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
