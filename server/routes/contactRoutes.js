const express = require('express');
const { submitContactForm, getContactMessages, updateMessageStatus, deleteMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/', submitContactForm);

// Admin routes
router.get('/', protect, admin, getContactMessages);
router.put('/:id', protect, admin, updateMessageStatus);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
