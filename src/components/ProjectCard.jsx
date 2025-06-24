import './ProjectCard.css';

function ProjectCard({ title, description, imageUrl, projectUrl, githubUrl }) {
  return (
    <div className="project-card">
      <div className="project-image">
        {imageUrl && imageUrl.startsWith('http') ? (
          <img src={imageUrl} alt={title} loading="lazy" />
        ) : (
          <img src={`${process.env.PUBLIC_URL}/assets/${imageUrl}`} alt={title} loading="lazy" />
        )}
      </div>
      <div className="project-info">
        <h3>{title}</h3>
        <p className="project-description">{description}</p>
        <div className="project-links">
          {projectUrl && (
            <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              Demo
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="github-link">
              <span className="github-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </span>
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
