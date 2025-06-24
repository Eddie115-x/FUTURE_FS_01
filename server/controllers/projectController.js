const Project = require('../models/Project');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new project
const createProject = async (req, res) => {
  try {
    const { title, description, imageUrl, projectUrl, githubUrl, technologies, featured } = req.body;
    
    // Find the highest order to place new project at the end
    const highestOrder = await Project.findOne().sort('-order');
    const order = highestOrder ? highestOrder.order + 1 : 1;
    
    const newProject = new Project({
      title,
      description,
      imageUrl,
      projectUrl,
      githubUrl,
      technologies,
      featured,
      order,
    });
    
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      id, 
      updates, 
      { new: true }
    );
    
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await Project.findByIdAndDelete(id);
    
    // Reorder remaining projects
    const remainingProjects = await Project.find({}).sort('order');
    for (let i = 0; i < remainingProjects.length; i++) {
      remainingProjects[i].order = i + 1;
      await remainingProjects[i].save();
    }
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Change project order
const reorderProjects = async (req, res) => {
  try {
    const { projectOrders } = req.body; // Array of { id, order }
    
    for (const item of projectOrders) {
      await Project.findByIdAndUpdate(item.id, { order: item.order });
    }
    
    const updatedProjects = await Project.find({}).sort('order');
    res.status(200).json(updatedProjects);
  } catch (error) {
    console.error('Error reordering projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
};
