import ProjectCard from '../components/ProjectCard';
import './Projects.css';

function Projects() {
  // Mock project data (in a real app, this might come from an API or a separate data file)
  const projects = [
    {
      id: 1,
      title: 'E-commerce Website',
      description: 'A fully responsive e-commerce website built with React, Redux, and Firebase. Features include user authentication, product filtering, cart functionality, and payment processing.',
      imageUrl: process.env.PUBLIC_URL + '/images/project1.jpg',
      projectUrl: 'https://project1.example.com',
      githubUrl: 'https://github.com/yourusername/project1'
    },
    {
      id: 2,
      title: 'Weather App',
      description: 'A weather application that fetches real-time weather data from OpenWeatherMap API. Users can search for weather information by city name or use geolocation to get local weather.',
      imageUrl: process.env.PUBLIC_URL + '/images/project2.jpg',
      projectUrl: 'https://project2.example.com',
      githubUrl: 'https://github.com/yourusername/project2'
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'A task management application built with React and Node.js. Features include task creation, categorization, due dates, and reminders.',
      imageUrl: process.env.PUBLIC_URL + '/images/project3.jpg',
      projectUrl: 'https://project3.example.com',
      githubUrl: 'https://github.com/yourusername/project3'
    },
    {
      id: 4,
      title: 'Recipe Finder',
      description: 'A web app that allows users to search for recipes based on ingredients they have. Built with React and integrated with a food recipe API.',
      imageUrl: process.env.PUBLIC_URL + '/images/project4.jpg',
      projectUrl: 'https://project4.example.com',
      githubUrl: 'https://github.com/yourusername/project4'
    }
  ];

  return (
    <div className="projects-container">
      <h1>My Projects</h1>
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
  );
}

export default Projects;
