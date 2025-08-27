const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Import models untuk checking
const Activity = require('../models/activity');
const Comment = require('../models/comment');
const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');

// Main API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Project Management API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.db?.databaseName || 'unknown'
    }
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      status: statusMap[dbStatus],
      name: mongoose.connection.db?.databaseName || 'unknown',
      host: mongoose.connection.host || 'unknown'
    },
    models: {
      Activity: !!Activity,
      Comment: !!Comment, 
      Project: !!Project,
      Task: !!Task,
      User: !!User
    }
  });
});

// Database test endpoint
router.get('/db-test', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const stats = {
      users: await User.countDocuments(),
      projects: await Project.countDocuments(), 
      tasks: await Task.countDocuments(),
      comments: await Comment.countDocuments(),
      activities: await Activity.countDocuments()
    };
    
    res.json({
      database: mongoose.connection.db.databaseName,
      collections: collections.map(c => c.name),
      documentCounts: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database status endpoint
router.get('/db-status', (req, res) => {
  const connection = mongoose.connection;
  const dbStatus = connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected', 
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: statusMap[dbStatus],
    name: connection.db?.databaseName || 'unknown',
    host: connection.host || 'unknown',
    port: connection.port || 'unknown',
    readyState: dbStatus,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;