const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');

// Get all events
router.get('/', eventController.getAllEvents);

// Get event by ID
router.get('/:id', eventController.getEventById);

// Create new event
router.post('/', authenticate, eventController.createEvent);

// Update event
router.put('/:id', authenticate, eventController.updateEvent);

// Delete event
router.delete('/:id', authenticate, eventController.deleteEvent);

// Get event types
router.get('/types', eventController.getEventTypes);

// Get event full information
router.get('/:id/full-info', eventController.getEventFullInfo);

// Get event attendees
router.get('/:id/attendees', authenticate, eventController.getEventAttendees);

// Get event speakers
router.get('/:id/speakers', eventController.getEventSpeakers);

// Get event sponsors
router.get('/:id/sponsors', eventController.getEventSponsors);

module.exports = router;
