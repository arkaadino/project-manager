const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  projectId: { type: Number, required: true },
  taskId: { type: String },
  type: {
    type: String,
    enum: ['task_created', 'task_completed', 'task_assigned', 'status_changed', 'comment_added', 'login', 'file_uploaded'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  user: {
    id: String,
    name: String,
    avatar: String,
    role: String
  },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    oldValue: String,
    newValue: String,
    fileName: String
  },
  projectName: { type: String, default: '' },
  action: { type: String, default: '' },
  time: { type: String, default: '' },
  type_simplified: {
    type: String,
    enum: ['success', 'warning', 'info', 'default'],
    default: 'default'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
