const pool = require('./config/database');

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    console.log('Checking database connection...');
    
    // Test database connection
    const [result] = await pool.query('SELECT 1');
    
    if (result[0]['1'] === 1) {
      console.log('Database connection successful!');
      console.log('Event Management API is ready to use.');
      console.log('Server is running on port', process.env.PORT || 3000);
    } else {
      console.error('Database connection failed');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = initializeDatabase;
