const pool = require('../config/database');

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, u.user_name, u.user_surname, e.event_name, tt.ticket_type_name, tt.ticket_price
       FROM tickets t
       JOIN users u ON t.user_id = u.user_id
       JOIN events e ON t.event_id = e.event_id
       JOIN ticket_types tt ON t.ticket_type_id = tt.ticket_type_id`
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching tickets'
    });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      `SELECT t.*, u.user_name, u.user_surname, e.event_name, tt.ticket_type_name, tt.ticket_price
       FROM tickets t
       JOIN users u ON t.user_id = u.user_id
       JOIN events e ON t.event_id = e.event_id
       JOIN ticket_types tt ON t.ticket_type_id = tt.ticket_type_id
       WHERE t.ticket_id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching ticket'
    });
  }
};

// Create new ticket
exports.createTicket = async (req, res) => {
  try {
    const { user_id, event_id, ticket_type_id } = req.body;
    
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
      'SELECT event_id FROM events WHERE event_id = ?',
      [event_id]
    );
    
    if (existingEvent.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Event not found'
      });
    }
    
    // Check if ticket type exists
    const [existingTicketType] = await pool.query(
      'SELECT ticket_type_id FROM ticket_types WHERE ticket_type_id = ?',
      [ticket_type_id]
    );
    
    if (existingTicketType.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Ticket type not found'
      });
    }
    
    // Check if user is registered for this event
    const [existingAttendance] = await pool.query(
      'SELECT attendance_id FROM attendances WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    
    if (existingAttendance.length === 0) {
      // Register the user for the event first
      const today = new Date().toISOString().split('T')[0];
      await pool.query(
        'INSERT INTO attendances (user_id, event_id, attending_date) VALUES (?, ?, ?)',
        [user_id, event_id, today]
      );
    }
    
    // Check if user already has a ticket for this event
    const [existingTicket] = await pool.query(
      'SELECT ticket_id FROM tickets WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    );
    
    if (existingTicket.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User already has a ticket for this event'
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO tickets (user_id, event_id, ticket_type_id) VALUES (?, ?, ?)',
      [user_id, event_id, ticket_type_id]
    );
    
    // Get ticket type details
    const [ticketType] = await pool.query(
      'SELECT ticket_type_name, ticket_price FROM ticket_types WHERE ticket_type_id = ?',
      [ticket_type_id]
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Ticket created successfully',
      data: {
        ticket_id: result.insertId,
        user_id,
        event_id,
        ticket_type_id,
        ticket_type_name: ticketType[0].ticket_type_name,
        ticket_price: ticketType[0].ticket_price
      }
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    
    // Check if error is due to the trigger
    if (error.message && error.message.includes('Attendance limit exceeded')) {
      return res.status(400).json({
        status: 'error',
        message: 'Event has reached maximum attendance limit'
      });
    }
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Error creating ticket'
    });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if ticket exists
    const [existingTicket] = await pool.query(
      'SELECT ticket_id FROM tickets WHERE ticket_id = ?',
      [id]
    );
    
    if (existingTicket.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Ticket not found'
      });
    }
    
    await pool.query('DELETE FROM tickets WHERE ticket_id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error deleting ticket'
    });
  }
};

// Get ticket types
exports.getTicketTypes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ticket_types');
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching ticket types'
    });
  }
};

// Get user tickets
exports.getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ?',
      [userId]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    const [rows] = await pool.query(
      `SELECT t.ticket_id, e.event_id, e.event_name, e.event_date, e.event_time, 
              e.event_location, tt.ticket_type_name, tt.ticket_price
       FROM tickets t
       JOIN events e ON t.event_id = e.event_id
       JOIN ticket_types tt ON t.ticket_type_id = tt.ticket_type_id
       WHERE t.user_id = ?`,
      [userId]
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching user tickets'
    });
  }
};
