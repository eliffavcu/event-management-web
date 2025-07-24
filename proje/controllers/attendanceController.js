const pool = require('../config/database');

// Get all attendances
exports.getAllAttendances = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.user_name, u.user_surname, e.event_name
       FROM attendances a
       JOIN users u ON a.user_id = u.user_id
       JOIN events e ON a.event_id = e.event_id`
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching attendances:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching attendances'
    });
  }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      `SELECT a.*, u.user_name, u.user_surname, e.event_name
       FROM attendances a
       JOIN users u ON a.user_id = u.user_id
       JOIN events e ON a.event_id = e.event_id
       WHERE a.attendance_id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Attendance record not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching attendance'
    });
  }
};

// Create new attendance (register for an event)
exports.createAttendance = async (req, res) => {
  try {
    const { user_id, event_id, attending_date } = req.body;
    
    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ?',
      [user_id]
    );
    
    if (existingUser.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Check if event exists
    const [existingEvent] = await pool.query(
      'SELECT event_id, limit_for_attendance FROM events WHERE event_id = ?',
      [event_id]
    );
    
    if (existingEvent.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Check if user is already registered for this event
    const [existingAttendance] = await pool.query(
      'SELECT attendance_id FROM attendances WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    
    if (existingAttendance.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already registered for this event'
      });
    }
    
    // Check if event has reached attendance limit
    const [currentAttendees] = await pool.query(
      'SELECT COUNT(*) as count FROM attendances WHERE event_id = ?',
      [event_id]
    );
    
    if (currentAttendees[0].count >= existingEvent[0].limit_for_attendance) {
      return res.status(400).json({
        status: 'error',
        message: 'Event has reached maximum attendance limit'
      });
    }      // Set attending date to current date if not provided
    const attendingDate = attending_date || new Date().toISOString().split('T')[0];
    
    // Using the SET syntax for easier and safer insertion
    const [result] = await pool.query(
      'INSERT INTO attendances SET ?',
      { user_id, event_id, attending_date: attendingDate }
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Successfully registered for the event',
      data: {
        attendance_id: result.insertId,
        user_id,
        event_id,
        attending_date: attendingDate
      }
    });
  } catch (error) {
    console.error('Error creating attendance:', error);
    
    // Check if error is due to the trigger
    if (error.message && error.message.includes('Attendance limit exceeded')) {
      return res.status(400).json({
        status: 'error',
        message: 'Event has reached maximum attendance limit'
      });
    }
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Error registering for the event'
    });
  }
};

// Delete attendance (cancel registration)
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if attendance exists
    const [existingAttendance] = await pool.query(
      'SELECT attendance_id FROM attendances WHERE attendance_id = ?',
      [id]
    );
    
    if (existingAttendance.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Attendance record not found'
      });
    }
    
    await pool.query('DELETE FROM attendances WHERE attendance_id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: 'Event registration canceled successfully'
    });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error canceling registration'
    });
  }
};
