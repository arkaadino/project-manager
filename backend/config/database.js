const mongoose = require('mongoose');

// Import models untuk memastikan mereka terdaftar
const Activity = require('../models/activity');
const Comment = require('../models/comment');
const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');

class DatabaseConnection {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      if (this.isConnected) {
        console.log('📡 Already connected to MongoDB');
        return;
      }

      console.log('🔗 Connecting to MongoDB...');
      
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "project-manager"
      });

      this.isConnected = true;

      console.log('✅ MongoDB connected successfully');
      console.log(`📁 Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);

      // Initialize models untuk memastikan schema dan indexes dibuat
      await this.initializeModels();

      // Setup connection event listeners
      this.setupEventListeners();

    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async initializeModels() {
    try {
      console.log('🏗️  Initializing models...');
      
      await Promise.all([
        Activity.init(),
        Comment.init(),
        Project.init(),
        Task.init(),
        User.init()
      ]);

      console.log('✅ All models initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing models:', error);
      throw error;
    }
  }

  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ Mongoose connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📡 Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('📡 Mongoose reconnected to MongoDB');
      this.isConnected = true;
    });
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('📡 Database connection closed');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
      throw error;
    }
  }

  getStatus() {
    const connection = mongoose.connection;
    const dbStatus = connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };

    return {
      status: statusMap[dbStatus],
      name: connection.db?.databaseName || 'unknown',
      host: connection.host || 'unknown',
      port: connection.port || 'unknown',
      readyState: dbStatus,
      isConnected: this.isConnected
    };
  }
}

// Export singleton instance
const dbConnection = new DatabaseConnection();
module.exports = dbConnection;