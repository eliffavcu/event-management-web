const express = require('express');
const router = express.Router();
const organizatorController = require('../controllers/organizatorController');
const { authenticate } = require('../middleware/auth');

// Get all organizators
router.get('/', organizatorController.getAllOrganizators);

// Get organizator by ID
router.get('/:id', organizatorController.getOrganizatorById);

// Create new organizator
router.post('/', authenticate, organizatorController.createOrganizator);

// Update organizator
router.put('/:id', authenticate, organizatorController.updateOrganizator);

// Delete organizator
router.delete('/:id', authenticate, organizatorController.deleteOrganizator);

// Get organizator's events
router.get('/:id/events', organizatorController.getOrganizatorEvents);

module.exports = router;
