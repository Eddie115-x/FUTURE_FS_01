import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import supabase from '../supabase';
import './Projects.css';

function Projects() {
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
        }          // If table exists, fetch published projects only
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('published', true)  // Only fetch published projects
          .order('order_index', { ascending: true })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  return (
    <div className="projects-container">
      <h1>My Projects</h1>
      <p className="projects-intro">Here's a collection of my recent work. Each project demonstrates different skills and technologies.</p>
      
      <div className="projects-main-card">
        <div className="projects-header">
          <h2>Featured Projects</h2>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="empty-state">
            <p>No projects found. Check back later!</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="projects-grid">
            {projects.map(project => (
              <div className="project-item" key={project.id}>
                <ProjectCard 
                  title={project.title}
                  description={project.description}
                  imageUrl={project.image_url} // Using Supabase image_url field
                  projectUrl={project.live_url} // Using project URL if available
                  githubUrl={project.github_url} // Using GitHub URL from Supabase
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
