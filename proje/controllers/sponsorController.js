const pool = require('../config/database');

// Get all sponsors
exports.getAllSponsors = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, e.event_name
       FROM event_sponsors s
       JOIN events e ON s.event_id = e.event_id`
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching sponsors'
    });
  }
};

// Get sponsor by ID
exports.getSponsorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      `SELECT s.*, e.event_name
       FROM event_sponsors s
       JOIN events e ON s.event_id = e.event_id
       WHERE s.sponsor_id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Sponsor not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching sponsor'
    });
  }
};

// Create new sponsor
exports.createSponsor = async (req, res) => {
  try {
    const { event_id, sponsor_name, sponsor_surname } = req.body;
    
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
    
    const [result] = await pool.query(
      'INSERT INTO event_sponsors (event_id, sponsor_name, sponsor_surname) VALUES (?, ?, ?)',
      [event_id, sponsor_name, sponsor_surname]
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Sponsor added successfully',
      data: {
        sponsor_id: result.insertId,
        event_id,
        sponsor_name,
        sponsor_surname
      }
    });
  } catch (error) {
    console.error('Error creating sponsor:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error adding sponsor'
    });
  }
};

// Update sponsor
exports.updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_id, sponsor_name, sponsor_surname } = req.body;
    
    // Check if sponsor exists
    const [existingSponsor] = await pool.query(
      'SELECT sponsor_id FROM event_sponsors WHERE sponsor_id = ?',
      [id]
    );
    
    if (existingSponsor.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Sponsor not found'
      });
    }
    
    // Check if event exists if provided
    if (event_id) {
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
    }
    
    await pool.query(
      'UPDATE event_sponsors SET event_id = ?, sponsor_name = ?, sponsor_surname = ? WHERE sponsor_id = ?',
      [event_id, sponsor_name, sponsor_surname, id]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Sponsor updated successfully'
    });
  } catch (error) {
    console.error('Error updating sponsor:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error updating sponsor'
    });
  }
};

// Delete sponsor
exports.deleteSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if sponsor exists
    const [existingSponsor] = await pool.query(
      'SELECT sponsor_id FROM event_sponsors WHERE sponsor_id = ?',
      [id]
    );
    
    if (existingSponsor.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Sponsor not found'
      });
    }
    
    await pool.query('DELETE FROM event_sponsors WHERE sponsor_id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: 'Sponsor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error deleting sponsor'
    });
  }
};
