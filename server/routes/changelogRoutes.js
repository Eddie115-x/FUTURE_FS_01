const express = require('express');
const { 
  getPublishedChangelogs,
  getAllChangelogs,
  getChangelogById,
  createChangelog,
  updateChangelog,
  deleteChangelog,
} = require('../controllers/changelogController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/published', getPublishedChangelogs);

// Admin routes
router.get('/', protect, admin, getAllChangelogs);
router.get('/:id', protect, admin, getChangelogById);
router.post('/', protect, admin, createChangelog);
router.put('/:id', protect, admin, updateChangelog);
router.delete('/:id', protect, admin, deleteChangelog);

module.exports = router;
