const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user or organizator based on user_type
exports.register = async (req, res) => {
  try {
    const { user_type } = req.body;
    if (!user_type) {
      return res.status(400).json({
        status: 'error',
        message: 'User type is required'
      });
    }

    if (user_type === 'normal') {
      const { user_name, user_surname, user_age, user_email, user_telephone, user_birthday, password } = req.body;
      if (!user_name || !user_surname || !user_email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Name, surname, email and password are required'
        });
      }

      // Check if email already exists in users
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

      await pool.query('START TRANSACTION');
      try {
        // Insert user record
        const [userResult] = await pool.query(
          'INSERT INTO users (user_name, user_surname, user_age, user_email, user_telephone, user_birthday) VALUES (?, ?, ?, ?, ?, ?)',
          [user_name, user_surname, user_age, user_email, user_telephone, user_birthday]
        );
        const userId = userResult.insertId;

        // Hash password and insert login record
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await pool.query(
          'INSERT INTO login (user_id, password_hash) VALUES (?, ?)',
          [userId, hashedPassword]
        );

        await pool.query('COMMIT');

        const token = jwt.sign(
          { id: userId, email: user_email, name: user_name, user_type },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return res.status(201).json({
          status: 'success',
          message: 'User registered successfully',
          data: {
            user_id: userId,
            user_name,
            user_email,
            token
          }
        });
      } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
      }
    } else if (user_type === 'organizator') {
      const { organizator_name, organizator_surname, organizator_email, organizator_telephone, organization_location, password } = req.body;
      if (!organizator_name || !organizator_surname || !organizator_email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Name, surname, email and password are required for organizator'
        });
      }

      // Check if email already exists in organizators
      const [existingOrg] = await pool.query(
        'SELECT organizator_id FROM organizators WHERE organizator_email = ?',
        [organizator_email]
      );
      if (existingOrg.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already in use'
        });
      }

      await pool.query('START TRANSACTION');
      try {
        // Insert organizator record
        const [orgResult] = await pool.query(
          'INSERT INTO organizators SET ?',
          { organizator_name, organizator_surname, organizator_email, organizator_telephone, organization_location }
        );
        const organizatorId = orgResult.insertId;

        // Hash password and insert organizator login record into org_login table
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await pool.query(
          'INSERT INTO org_login SET ?',
          { organizator_id: organizatorId, password_hash: hashedPassword }
        );

        await pool.query('COMMIT');

        const token = jwt.sign(
          { id: organizatorId, email: organizator_email, name: organizator_name, user_type },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return res.status(201).json({
          status: 'success',
          message: 'Organizator registered successfully',
          data: {
            organizator_id: organizatorId,
            organizator_name,
            organizator_email,
            token
          }
        });
      } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
      }
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user type'
      });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error registering user'
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, user_type } = req.body;
    
    if (!email || !password || !user_type) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, password and user type are required'
      });
    }
    
    let user;
    
    if (user_type === 'normal') {
      // Query for normal users
      const [users] = await pool.query(
        'SELECT u.user_id, u.user_name, u.user_email, l.password_hash FROM users u JOIN login l ON u.user_id = l.user_id WHERE u.user_email = ?',
        [email]
      );
      
      if (users.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }
      
      user = users[0];
      
    } else if (user_type === 'organizator') {
      // Query for organizators
      const [orgs] = await pool.query(
        'SELECT o.organizator_id AS user_id, o.organizator_name AS user_name, o.organizator_email AS user_email, l.password_hash FROM organizators o JOIN org_login l ON o.organizator_id = l.organizator_id WHERE o.organizator_email = ?',
        [email]
      );
      
      if (orgs.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }
      
      user = orgs[0];
      
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user type'
      });
    }
    
    // Check if password is correct
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.user_id, email: user.user_email, name: user.user_name, user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        id: user.user_id,
        name: user.user_name,
        email: user.user_email,
        token
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error logging in'
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Check if current password and new password are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password and new password are required'
      });
    }
    
    // Get current password hash
    const [users] = await pool.query(
      'SELECT password_hash FROM login WHERE user_id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    const currentPasswordHash = users[0].password_hash;
    
    // Check if current password is correct
    const isValidPassword = await bcrypt.compare(currentPassword, currentPasswordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await pool.query(
      'UPDATE login SET password_hash = ? WHERE user_id = ?',
      [newPasswordHash, userId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error changing password'
    });
  }
};
