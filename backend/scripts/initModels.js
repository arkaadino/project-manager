const mongoose = require('mongoose');
const dbConnection = require('../config/database');
const Activity = require('../models/activity');
const Comment = require('../models/comment');
const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');
require('dotenv').config();

async function initializeModels() {
  try {
    // Connect to database using our database module
    await dbConnection.connect();

    // Check collections and document counts
    console.log('📊 Checking database status...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('📁 Existing collections:', collectionNames);

    // Count documents in each collection
    const stats = {
      users: await User.countDocuments(),
      projects: await Project.countDocuments(),
      tasks: await Task.countDocuments(),
      comments: await Comment.countDocuments(),
      activities: await Activity.countDocuments()
    };

    console.log('📈 Document counts:');
    console.log(`   👥 Users: ${stats.users}`);
    console.log(`   📁 Projects: ${stats.projects}`);
    console.log(`   📋 Tasks: ${stats.tasks}`);
    console.log(`   💬 Comments: ${stats.comments}`);
    console.log(`   📝 Activities: ${stats.activities}`);

    // Optional: Create sample admin user if no users exist
    if (stats.users === 0) {
      console.log('👤 No users found. You might want to create an admin user.');
      console.log('   Example: POST /api/auth/register with admin role');
    }

    console.log('🎉 Model initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during model initialization:', error);
    throw error;
  } finally {
    // Close connection
    await dbConnection.disconnect();
  }
}

// Jalankan jika file ini dieksekusi langsung
if (require.main === module) {
  initializeModels()
    .then(() => {
      console.log('✨ All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = initializeModels;