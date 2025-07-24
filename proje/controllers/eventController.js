const pool = require('../config/database');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, et.event_type_name 
       FROM events e
       JOIN event_types et ON e.event_type_id = et.event_type_id`
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching events'
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      `SELECT e.*, et.event_type_name 
       FROM events e
       JOIN event_types et ON e.event_type_id = et.event_type_id
       WHERE e.event_id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching event'
    });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { 
      event_name, 
      event_date, 
      event_time, 
      event_location, 
      event_type_id, 
      limit_for_attendance, 
      organizator_id 
    } = req.body;
    
    // Check if organizator exists
    const [existingOrganizator] = await pool.query(
      'SELECT organizator_id FROM organizators WHERE organizator_id = ?',
      [organizator_id]
    );
    
    if (existingOrganizator.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Organizator not found'
      });
    }
    
    // Check if event type exists
    const [existingEventType] = await pool.query(
      'SELECT event_type_id FROM event_types WHERE event_type_id = ?',
      [event_type_id]
    );
      if (existingEventType.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Event type not found'
      });
    }
      // Using the SET syntax for easier and safer insertion
    const [result] = await pool.query(
      'INSERT INTO events SET ?',
      { 
        event_name, 
        event_date, 
        event_time, 
        event_location, 
        event_type_id, 
        limit_for_attendance, 
        organizator_id 
      }
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: {
        event_id: result.insertId,
        event_name,
        event_date,
        event_time,
        event_location,
        event_type_id,
        limit_for_attendance,
        organizator_id
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error creating event'
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      event_name, 
      event_date, 
      event_time, 
      event_location, 
      event_type_id, 
      limit_for_attendance, 
      organizator_id 
    } = req.body;
    
    // Check if event exists
    const [existingEvent] = await pool.query(
      'SELECT event_id FROM events WHERE event_id = ?',
      [id]
    );
    
    if (existingEvent.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Check if organizator exists if provided
    if (organizator_id) {
      const [existingOrganizator] = await pool.query(
        'SELECT organizator_id FROM organizators WHERE organizator_id = ?',
        [organizator_id]
      );
      
      if (existingOrganizator.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Organizator not found'
        });
      }
    }
    
    // Check if event type exists if provided
    if (event_type_id) {
      const [existingEventType] = await pool.query(
        'SELECT event_type_id FROM event_types WHERE event_type_id = ?',
        [event_type_id]
      );
      
      if (existingEventType.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Event type not found'
        });
      }
    }
    
    // Check current number of attendees if limit_for_attendance is being reduced
    if (limit_for_attendance) {
      const [currentAttendees] = await pool.query(
        'SELECT COUNT(*) as count FROM attendances WHERE event_id = ?',
        [id]
      );
      
      if (currentAttendees[0].count > limit_for_attendance) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot reduce attendance limit below current number of attendees'
        });
      }
    }
    
    await pool.query(
      `UPDATE events 
       SET event_name = ?, event_date = ?, event_time = ?, event_location = ?, 
           event_type_id = ?, limit_for_attendance = ?, organizator_id = ? 
       WHERE event_id = ?`,
      [event_name, event_date, event_time, event_location, event_type_id, limit_for_attendance, organizator_id, id]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error updating event'
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if event exists
    const [existingEvent] = await pool.query(
      'SELECT event_id FROM events WHERE event_id = ?',
      [id]
    );
    
    if (existingEvent.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Begin transaction
    await pool.query('START TRANSACTION');
    
    try {
      // Delete related records
      await pool.query('DELETE FROM event_speakers WHERE event_id = ?', [id]);
      await pool.query('DELETE FROM event_sponsors WHERE event_id = ?', [id]);
      await pool.query('DELETE FROM tickets WHERE event_id = ?', [id]);
      await pool.query('DELETE FROM attendances WHERE event_id = ?', [id]);
      
      // Delete event
      await pool.query('DELETE FROM events WHERE event_id = ?', [id]);
      
      // Commit transaction
      await pool.query('COMMIT');
      
      res.status(200).json({
        status: 'success',
        message: 'Event and all related records deleted successfully'
      });
    } catch (error) {
      // Rollback transaction in case of error
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error deleting event'
    });
  }
};

// Get event types
exports.getEventTypes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM event_types');
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching event types:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching event types'
    });
  }
};

// Get event full information
exports.getEventFullInfo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if event exists
    const [eventExists] = await pool.query(
      'SELECT event_id FROM events WHERE event_id = ?',
      [id]
    );
    
    if (eventExists.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Get event full info from view
    const [rows] = await pool.query(
      'SELECT * FROM event_full_info_view WHERE event_id = ?',
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching event full info:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching event full info'
    });
  }
};

// Get event attendees
exports.getEventAttendees = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if event exists
    const [eventExists] = await pool.query(
      'SELECT event_id FROM events WHERE event_id = ?',
      [id]
    );
    
    if (eventExists.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Get event attendees
    const [rows] = await pool.query(
      `SELECT u.user_id, u.user_name, u.user_surname, u.user_email, a.attending_date
       FROM users u
       JOIN attendances a ON u.user_id = a.user_id
       WHERE a.event_id = ?`,
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching event attendees'
    });
  }
};

// Get event speakers
exports.getEventSpeakers = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if event exists
    const [eventExists] = await pool.query(
      'SELECT event_id FROM events WHERE event_id = ?',
      [id]
    );
    
    if (eventExists.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Get event speakers
    const [rows] = await pool.query(
      'SELECT * FROM event_speakers WHERE event_id = ?',
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching event speakers:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching event speakers'
    });
  }
};

// Get event sponsors
exports.getEventSponsors = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if event exists
    const [eventExists] = await pool.query(
      'SELECT event_id FROM events WHERE event_id = ?',
      [id]
    );
    
    if (eventExists.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Get event sponsors
    const [rows] = await pool.query(
      'SELECT * FROM event_sponsors WHERE event_id = ?',
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching event sponsors:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching event sponsors'
    });
  }
};
