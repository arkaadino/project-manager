const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: {
    type: String,
    enum: ['admin', 'project_manager', 'designer', 'developer', 'client'],
    required: true
  },
  company: { type: String, default: '' },
  isClient: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  clientProjects: [{ type: Number }],
  permissions: {
    canViewAllProjects: { type: Boolean, default: false },
    canCreateProjects: { type: Boolean, default: false },
    canEditProjects: { type: Boolean, default: false },
    canDeleteProjects: { type: Boolean, default: false },
    canViewTasks: { type: Boolean, default: false },
    canManageTasks: { type: Boolean, default: false },
    canViewTeamActivity: { type: Boolean, default: false }
  },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
