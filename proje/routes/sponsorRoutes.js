const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');
const { authenticate } = require('../middleware/auth');

// Get all sponsors
router.get('/', sponsorController.getAllSponsors);

// Get sponsor by ID
router.get('/:id', sponsorController.getSponsorById);

// Create new sponsor
router.post('/', authenticate, sponsorController.createSponsor);

// Update sponsor
router.put('/:id', authenticate, sponsorController.updateSponsor);

// Delete sponsor
router.delete('/:id', authenticate, sponsorController.deleteSponsor);

module.exports = router;
