const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  client: { type: String, required: true },
  clientId: { type: String, required: true },
  status: {
    type: String,
    enum: ['Planning', 'In Progress', 'Review', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  deadline: { type: String, required: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  budget: { type: Number, default: 0 },
  team: [{
    id: String,
    name: String,
    avatar: String,
    role: String
  }],
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  inProgressTasks: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  filesCount: { type: Number, default: 0 },
  tags: [String],
  requirements: { type: String, default: '' },
  deliverables: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);

