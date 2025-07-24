const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/auth');

// Get all attendances
router.get('/', authenticate, attendanceController.getAllAttendances);

// Get attendance by ID
router.get('/:id', authenticate, attendanceController.getAttendanceById);

// Create new attendance (register for an event)
router.post('/', authenticate, attendanceController.createAttendance);

// Delete attendance (cancel registration)
router.delete('/:id', authenticate, attendanceController.deleteAttendance);

module.exports = router;
