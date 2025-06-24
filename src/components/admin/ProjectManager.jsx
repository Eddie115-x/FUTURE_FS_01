import { useEffect, useState } from 'react';
import { FaEdit, FaGithub, FaTrash } from 'react-icons/fa';
import supabase from '../../supabase';
import './ProjectManager.css';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [currentProject, setCurrentProject] = useState({
    id: null,
    title: '',
    description: '',
    github_url: '',
    live_url: '',
    technologies: '',
    image_url: '',
    featured: false,
    order_index: 0,
    published: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

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
            'The projects table does not exist yet. Please run the SQL setup script from server/config/supabase-setup.sql in your Supabase SQL editor.'
          );
          setProjects([]);
          return;
        }
        throw tableError;
      }
      
      // If table exists, fetch projects
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(
        'Failed to fetch projects. Please check your Supabase configuration and ensure the database tables are set up correctly.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject({ ...currentProject, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = currentProject.image_url;
      
      // If there's a new file, upload it to Supabase Storage
      if (file) {
        // Generate a unique file name based on timestamp and original name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `projects/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }
      
      const projectData = {
        title: currentProject.title,
        description: currentProject.description,
        github_url: currentProject.github_url,
        technologies: currentProject.technologies.split(',').map(tech => tech.trim()),
        image_url: imageUrl,
        featured: currentProject.featured,
        order_index: currentProject.order_index || 0,
        published: currentProject.published
      };
      
      let result;
      if (isEditing) {
        // Update existing project
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', currentProject.id);
      } else {
        // Insert new project
        result = await supabase
          .from('projects')
          .insert([projectData]);
      }
      
      if (result.error) throw result.error;
      
      // Reset form and refresh projects
      resetForm();
      fetchProjects();
      
    } catch (error) {
      console.error('Error saving project:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (project) => {
    // Convert technologies array back to comma-separated string for editing
    const techString = Array.isArray(project.technologies) 
      ? project.technologies.join(', ')
      : project.technologies || '';
    
    setCurrentProject({
      ...project,
      technologies: techString
    });
    setIsEditing(true);
    
    // Set preview if there's an image
    if (project.image_url) {
      setFilePreview(project.image_url);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Refresh projects
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        setError(error.message);
      }
    }
  };
  
  const handleTogglePublish = async (project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ published: !project.published })
        .eq('id', project.id);
      
      if (error) throw error;
      
      // Refresh projects
      fetchProjects();
    } catch (error) {
      console.error('Error toggling project publish status:', error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setCurrentProject({
      id: null,
      title: '',
      description: '',
      github_url: '',
      live_url: '',
      technologies: '',
      image_url: '',
      featured: false,
      order_index: 0,
      published: true
    });
    setIsEditing(false);
    setFile(null);
    setFilePreview(null);
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="project-manager">
      <h2>{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
      
      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          {error.includes('table does not exist') && (
            <div className="setup-instructions">
              <h4>Setup Instructions:</h4>
              <ol>
                <li>Open your Supabase project dashboard</li>
                <li>Go to the SQL Editor</li>
                <li>Copy the contents of <code>server/config/supabase-setup.sql</code></li>
                <li>Paste and run the SQL script in the Supabase SQL Editor</li>
                <li>Return to this page and refresh</li>
              </ol>
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={currentProject.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={currentProject.description}
            onChange={handleInputChange}
            required
            rows={4}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="github_url">GitHub URL</label>
          <div className="input-with-icon">
            <FaGithub className="input-icon" />
            <input
              type="url"
              id="github_url"
              name="github_url"
              value={currentProject.github_url}
              onChange={handleInputChange}
              placeholder="https://github.com/Eddie115-x/repo"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="technologies">Technologies Used</label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            value={currentProject.technologies}
            onChange={handleInputChange}
            placeholder="React, Node.js, MongoDB (comma separated)"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="order_index">Display Order</label>
          <input
            type="number"
            id="order_index"
            name="order_index"
            value={currentProject.order_index}
            onChange={handleInputChange}
            min="0"
            step="1"
          />
          <small className="helper-text">Lower numbers will display first</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Project GIF/Image</label>
          <input
            type="file"
            id="image"
            accept="image/gif,image/jpeg,image/png"
            onChange={handleFileChange}
          />
          {filePreview && (
            <div className="image-preview">
              <img src={filePreview} alt="Preview" />
            </div>
          )}
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={currentProject.published}
              onChange={(e) => setCurrentProject({
                ...currentProject,
                published: e.target.checked
              })}
            />
            Publish on Home/Projects pages
          </label>
          <small className="helper-text">When checked, this project will be visible on the Home and Projects pages</small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Saving...' : (isEditing ? 'Update Project' : 'Add Project')}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <h2>Your Projects</h2>
      <div className="projects-list">
        {projects.length === 0 ? (
          <p>No projects found. Create your first project!</p>
        ) : (
          projects.map(project => (
            <div key={project.id} className="project-card">
              {project.image_url && (
                <div className="project-image">
                  <img src={project.image_url} alt={project.title} />
                </div>
              )}                <div className="project-details">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`status-badge ${project.published ? 'published' : 'unpublished'}`}>
                    {project.published ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                
                <div className="project-technologies">
                  <strong>Technologies:</strong>
                  <div className="tech-tags">
                    {Array.isArray(project.technologies) ? (
                      project.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                      ))
                    ) : (
                      <span className="tech-tag">{project.technologies}</span>
                    )}
                  </div>
                </div>
                
                <div className="project-actions">
                  <button 
                    onClick={() => handleEdit(project)}
                    className="btn btn-edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="btn btn-delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button 
                    onClick={() => handleTogglePublish(project)}
                    className={`btn ${project.published ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {project.published ? 'Unpublish' : 'Publish'}
                  </button>
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-github"
                    >
                      <FaGithub /> View on GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManager;
