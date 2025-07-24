const pool = require('../config/database');

// Get all organizators
exports.getAllOrganizators = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM organizators'
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching organizators:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching organizators'
    });
  }
};

// Get organizator by ID
exports.getOrganizatorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM organizators WHERE organizator_id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Organizator not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching organizator:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching organizator'
    });
  }
};

// Create new organizator
exports.createOrganizator = async (req, res) => {
  try {
    const { organizator_name, organizator_surname, organizator_email, organizator_telephone, organization_location } = req.body;
    
    // Check if email already exists
    const [existingOrganizator] = await pool.query(
      'SELECT organizator_id FROM organizators WHERE organizator_email = ?',
      [organizator_email]
    );
      if (existingOrganizator.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }
    
    // Using the SET syntax for easier and safer insertion
    const [result] = await pool.query(
      'INSERT INTO organizators SET ?',
      { organizator_name, organizator_surname, organizator_email, organizator_telephone, organization_location }
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Organizator created successfully',
      data: {
        organizator_id: result.insertId,
        organizator_name,
        organizator_surname,
        organizator_email,
        organizator_telephone,
        organization_location
  
      }
    });
  } catch (error) {
    console.error('Error creating organizator:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error creating organizator'
    });
  }
};

// Update organizator
exports.updateOrganizator = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizator_name, organizator_surname, organizator_email, organizator_telephone, organization_location } = req.body;
    
    // Check if organizator exists
    const [existingOrganizator] = await pool.query(
      'SELECT organizator_id FROM organizators WHERE organizator_id = ?',
      [id]
    );
    
    if (existingOrganizator.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Organizator not found'
      });
    }
    
    // Check if the email is already in use by another organizator
    if (organizator_email) {
      const [emailCheck] = await pool.query(
        'SELECT organizator_id FROM organizators WHERE organizator_email = ? AND organizator_id != ?',
        [organizator_email, id]
      );
      
      if (emailCheck.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use by another organizator'
        });
      }
    }
    
    await pool.query(
      'UPDATE organizators SET organizator_name = ?, organizator_surname = ?, organizator_email = ?, organizator_telephone = ?, organization_location = ? WHERE organizator_id = ?',
      [organizator_name, organizator_surname, organizator_email, organizator_telephone, organization_location, id]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Organizator updated successfully'
    });
  } catch (error) {
    console.error('Error updating organizator:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error updating organizator'
    });
  }
};

// Delete organizator
exports.deleteOrganizator = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if organizator exists
    const [existingOrganizator] = await pool.query(
      'SELECT organizator_id FROM organizators WHERE organizator_id = ?',
      [id]
    );
    
    if (existingOrganizator.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Organizator not found'
      });
    }
    
    // Check for related records in events
    const [events] = await pool.query(
      'SELECT event_id FROM events WHERE organizator_id = ?',
      [id]
    );
    
    if (events.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete organizator with associated events'
      });
    }
    
    // Delete organizator
    await pool.query('DELETE FROM organizators WHERE organizator_id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: 'Organizator deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organizator:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error deleting organizator'
    });
  }
};

// Get organizator's events
exports.getOrganizatorEvents = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if organizator exists
    const [existingOrganizator] = await pool.query(
      'SELECT organizator_id FROM organizators WHERE organizator_id = ?',
      [id]
    );
    
    if (existingOrganizator.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Organizator not found'
      });
    }
    
    // Get organizator's events
    const [rows] = await pool.query(
      `SELECT e.*, et.event_type_name 
       FROM events e
       JOIN event_types et ON e.event_type_id = et.event_type_id
       WHERE e.organizator_id = ?`,
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching organizator events:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching organizator events'
    });
  }
};
