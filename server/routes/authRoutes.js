const express = require('express');
const { login, register, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin routes
router.post('/register', protect, admin, register);

module.exports = router;
