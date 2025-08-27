const mongoose = require('mongoose');
const Activity = require('../models/activity'); // model activity kamu
const Comment = require('../models/comment');
const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');
require('dotenv').config();

// 1. Connect ke database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');

  // 2. Pastikan model terdaftar
  return Activity.init(); // memastikan index & schema dibuat
  return Comment.init();
  return Project.init();
  return Task.init();
  return User.init();
})
.then(() => {
  console.log(
    '✅ Activity model is ready',
    '✅ Comment model is ready',
    '✅ Project model is ready',
    '✅ Task model is ready',
    '✅ User model is ready',
  );
})
.catch(err => {
  console.error('❌ Error:', err);
})
.finally(() => {
  mongoose.connection.close();
});
