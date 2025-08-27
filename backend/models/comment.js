const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  projectId: { type: Number, required: true },
  author: {
    id: String,
    name: String,
    avatar: String,
    role: String
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isEdited: { type: Boolean, default: false },
  attachments: [{
    id: String,
    name: String,
    size: String,
    type: { type: String, enum: ['image', 'file'] },
    url: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
