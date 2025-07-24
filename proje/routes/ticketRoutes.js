const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticate } = require('../middleware/auth');

// Get all tickets
router.get('/', authenticate, ticketController.getAllTickets);

// Get ticket by ID
router.get('/:id', authenticate, ticketController.getTicketById);

// Create new ticket
router.post('/', authenticate, ticketController.createTicket);

// Delete ticket
router.delete('/:id', authenticate, ticketController.deleteTicket);

// Get ticket types
router.get('/types', ticketController.getTicketTypes);

// Get user tickets
router.get('/user/:userId', authenticate, ticketController.getUserTickets);

module.exports = router;
