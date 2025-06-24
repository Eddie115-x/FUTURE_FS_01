const express = require('express');
const { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject, 
  reorderProjects 
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin routes
router.post('/', protect, admin, createProject);
router.put('/:id', protect, admin, updateProject);
router.delete('/:id', protect, admin, deleteProject);
router.post('/reorder', protect, admin, reorderProjects);

module.exports = router;
