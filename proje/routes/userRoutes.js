const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create new user
router.post('/', userController.createUser);

// Update user
router.put('/:id', authenticate, userController.updateUser);

// Delete user
router.delete('/:id', authenticate, userController.deleteUser);

// Get user's events
router.get('/:id/events', authenticate, userController.getUserEvents);

module.exports = router;
