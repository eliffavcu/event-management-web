const pool = require('../config/database');

// Get all speakers
exports.getAllSpeakers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, e.event_name
       FROM event_speakers s
       JOIN events e ON s.event_id = e.event_id`
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching speakers:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching speakers'
    });
  }
};

// Get speaker by ID
exports.getSpeakerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      `SELECT s.*, e.event_name
       FROM event_speakers s
       JOIN events e ON s.event_id = e.event_id
       WHERE s.speaker_id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Speaker not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching speaker:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching speaker'
    });
  }
};

// Create new speaker
exports.createSpeaker = async (req, res) => {
  try {
    const { event_id, speaker_name, speaker_surname } = req.body;
    
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
      'INSERT INTO event_speakers (event_id, speaker_name, speaker_surname) VALUES (?, ?, ?)',
      [event_id, speaker_name, speaker_surname]
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Speaker added successfully',
      data: {
        speaker_id: result.insertId,
        event_id,
        speaker_name,
        speaker_surname
      }
    });
  } catch (error) {
    console.error('Error creating speaker:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error adding speaker'
    });
  }
};

// Update speaker
exports.updateSpeaker = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_id, speaker_name, speaker_surname } = req.body;
    
    // Check if speaker exists
    const [existingSpeaker] = await pool.query(
      'SELECT speaker_id FROM event_speakers WHERE speaker_id = ?',
      [id]
    );
    
    if (existingSpeaker.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Speaker not found'
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
      'UPDATE event_speakers SET event_id = ?, speaker_name = ?, speaker_surname = ? WHERE speaker_id = ?',
      [event_id, speaker_name, speaker_surname, id]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Speaker updated successfully'
    });
  } catch (error) {
    console.error('Error updating speaker:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error updating speaker'
    });
  }
};

// Delete speaker
exports.deleteSpeaker = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if speaker exists
    const [existingSpeaker] = await pool.query(
      'SELECT speaker_id FROM event_speakers WHERE speaker_id = ?',
      [id]
    );
    
    if (existingSpeaker.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Speaker not found'
      });
    }
    
    await pool.query('DELETE FROM event_speakers WHERE speaker_id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: 'Speaker deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting speaker:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error deleting speaker'
    });
  }
};
