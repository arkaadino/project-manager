// ===== SERVER.JS (Main Entry Point) =====
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

// Import configurations and modules
const dbConnection = require('./config/database');
const setupMiddleware = require('./middleware/middleware');
const { authMiddleware } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');
// const userRoutes = require('./routes/users');
// const projectRoutes = require('./routes/projects');
// const taskRoutes = require('./routes/tasks');

const app = express();

// Setup middleware
setupMiddleware(app);

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/', healthRoutes);              // Health check routes
app.use('/api/auth', authRoutes);        // Authentication routes

// Protected routes (uncomment when ready)
// app.use('/api/users', authMiddleware, userRoutes);
// app.use('/api/projects', authMiddleware, projectRoutes);
// app.use('/api/tasks', authMiddleware, taskRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ 
      error: `${field} already exists`,
      timestamp: new Date().toISOString()
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token expired',
      timestamp: new Date().toISOString()
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database first
    await dbConnection.connect();
    
    // Then start the server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 DB test: http://localhost:${PORT}/db-test`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = (signal) => {
      console.log(`${signal} received, shutting down gracefully`);
      server.close(async () => {
        try {
          await dbConnection.disconnect();
          console.log('✨ Process terminated gracefully');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    return server;
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
if (require.main === module) {
  startServer();
}

module.exports = app;