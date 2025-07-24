const pool = require('../config/database');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, user_name, user_surname, user_age, user_email, user_telephone, user_birthday FROM users'
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching users'
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      'SELECT user_id, user_name, user_surname, user_age, user_email, user_telephone, user_birthday FROM users WHERE user_id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching user'
    });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { user_name, user_surname, user_age, user_email, user_telephone, user_birthday } = req.body;
    
    // Debug log to see what's coming from the request
    console.log('Request body:', req.body);
    
    // Check if required fields are present
    if (!user_name || !user_email) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and email are required fields'
      });
    }
      // Check if email already exists
    const [existingUser] = await pool.query(
      'SELECT user_id FROM users WHERE user_email = ?',
      [user_email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }
    
    // Modifying the SQL query to explicitly not include user_id in the column list
    // This will allow MySQL to use the AUTO_INCREMENT feature properly
    const [result] = await pool.query(
      'INSERT INTO users SET ?', 
      { user_name, user_surname, user_age, user_email, user_telephone, user_birthday }
    );
    
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        user_id: result.insertId,
        user_name,
        user_surname,
        user_age,
        user_email,
        user_telephone,
        user_birthday
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error creating user'
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, user_surname, user_age, user_email, user_telephone, user_birthday } = req.body;
    
    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ?',
      [id]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Check if the email is already in use by another user
    if (user_email) {
      const [emailCheck] = await pool.query(
        'SELECT user_id FROM users WHERE user_email = ? AND user_id != ?',
        [user_email, id]
      );
      
      if (emailCheck.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use by another user'
        });
      }
    }
    
    await pool.query(
      'UPDATE users SET user_name = ?, user_surname = ?, user_age = ?, user_email = ?, user_telephone = ?, user_birthday = ? WHERE user_id = ?',
      [user_name, user_surname, user_age, user_email, user_telephone, user_birthday, id]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error updating user'
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ?',
      [id]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Check for related records in attendances and tickets
    const [attendances] = await pool.query(
      'SELECT attendance_id FROM attendances WHERE user_id = ?',
      [id]
    );
    
    const [tickets] = await pool.query(
      'SELECT ticket_id FROM tickets WHERE user_id = ?',
      [id]
    );
    
    // Delete login record if exists
    await pool.query('DELETE FROM login WHERE user_id = ?', [id]);
    
    // Delete related records
    if (attendances.length > 0) {
      await pool.query('DELETE FROM attendances WHERE user_id = ?', [id]);
    }
    
    if (tickets.length > 0) {
      await pool.query('DELETE FROM tickets WHERE user_id = ?', [id]);
    }
    
    // Delete user
    await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error deleting user'
    });
  }
};

// Get user's events
exports.getUserEvents = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT user_id FROM users WHERE user_id = ?',
      [id]
    );
    
    if (existingUser.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Get user's events from view
    const [rows] = await pool.query(
      'SELECT * FROM user_event_details_view WHERE user_id = ?',
      [id]
    );
    
    res.status(200).json({
      status: 'success',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching user events'
    });
  }
};
