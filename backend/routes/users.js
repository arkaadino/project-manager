const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Assuming you have User model
const { authMiddleware } = require('../middleware/auth'); // Your auth middleware
const router = express.Router();

// GET /api/users - Get all users with pagination and filters
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Only admin can see all users, others can only see basic info
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view users' });
    }

    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    // Search in username, firstName, lastName, email
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(filter)
      .select('-password') // Never send password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/team - Get team members (simplified for project assignment)
router.get('/team', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ 
      role: { $in: ['admin', 'team'] },
      isActive: true 
    })
      .select('_id username firstName lastName role')
      .sort({ firstName: 1, lastName: 1 });

    res.json({ users });
  } catch (error) {
    console.error('Get team users error:', error);
    res.status(500).json({ error: 'Failed to fetch team users' });
  }
});

// GET /api/users/clients - Get clients (simplified for project assignment)
router.get('/clients', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ 
      role: 'client',
      isActive: true 
    })
      .select('_id username firstName lastName')
      .sort({ firstName: 1, lastName: 1 });

    res.json({ users });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Users can only see their own profile, admin can see all
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this user' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create new user (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Only admin can create users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to create users' });
    }

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      role = 'client'
    } = req.body;

    // Validation
    if (!username || !email || !password || !firstName) {
      return res.status(400).json({ 
        error: 'Username, email, password, and first name are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      user: userResponse,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Users can only update their own profile, admin can update all
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    const {
      username,
      email,
      firstName,
      lastName,
      role,
      isActive,
      password
    } = req.body;

    // Check if username/email is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Only admin can change role and isActive status
    if ((role !== undefined || isActive !== undefined) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to change role or active status' });
    }

    // Update fields
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (role !== undefined && req.user.role === 'admin') user.role = role;
    if (isActive !== undefined && req.user.role === 'admin') user.isActive = isActive;

    // Update password if provided
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Only admin can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete users' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// PATCH /api/users/:id/toggle-status - Toggle user active status (Admin only)
router.patch('/:id/toggle-status', authMiddleware, async (req, res) => {
  try {
    // Only admin can toggle user status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to toggle user status' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ error: 'Cannot toggle your own status' });
    }

    user.isActive = !user.isActive;
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

module.exports = router;