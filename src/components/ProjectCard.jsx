import './ProjectCard.css';

function ProjectCard({ title, description, imageUrl, projectUrl, githubUrl }) {
  return (
    <div className="project-card">
      <div className="project-image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="project-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="project-links">
          {projectUrl && (
            <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="project-link">
              View Project
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="github-link">
              GitHub Repo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
