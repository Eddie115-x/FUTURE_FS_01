const express = require('express');
const { submitContactForm, getContactMessages, updateMessageStatus, deleteMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/', submitContactForm);

// Handle OPTIONS requests (for CORS preflight)
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

// Admin routes
router.get('/', protect, admin, getContactMessages);
router.put('/:id', protect, admin, updateMessageStatus);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
