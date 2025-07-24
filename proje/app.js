const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const organizatorRoutes = require('./routes/organizatorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const speakerRoutes = require('./routes/speakerRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const authRoutes = require('./routes/authRoutes');

// Import database initialization
const initializeDatabase = require('./initDb');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/organizators', organizatorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Event Management API is running');
});

// Public test route
app.get('/api/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working properly',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Initialize database
  await initializeDatabase();
});

module.exports = app;
