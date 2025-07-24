const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakerController');
const { authenticate } = require('../middleware/auth');

// Get all speakers
router.get('/', speakerController.getAllSpeakers);

// Get speaker by ID
router.get('/:id', speakerController.getSpeakerById);

// Create new speaker
router.post('/', authenticate, speakerController.createSpeaker);

// Update speaker
router.put('/:id', authenticate, speakerController.updateSpeaker);

// Delete speaker
router.delete('/:id', authenticate, speakerController.deleteSpeaker);

module.exports = router;
