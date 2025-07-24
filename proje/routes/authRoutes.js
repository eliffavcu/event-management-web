const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Change password
router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;
