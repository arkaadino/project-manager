const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  projectId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedTo: [{ type: String }],
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'review', 'completed'],
    default: 'todo'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  dueDate: { type: String, required: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  projectName: { type: String, default: '' },
  clientName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
