const express = require('express');
const {
  getPublishedPosts,
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/published', getPublishedPosts);
router.get('/post/:slug', getPostBySlug);

// Admin routes
router.get('/', protect, admin, getAllPosts);
router.post('/', protect, admin, createPost);
router.put('/:id', protect, admin, updatePost);
router.delete('/:id', protect, admin, deletePost);

module.exports = router;
