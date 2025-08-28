const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

const requireClientAccess = (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId;

  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.role === 'client') {
    if (!req.user.clientProjects.includes(projectId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
  }

  next();
};

const requireTeamAccess = (req, res, next) => {
  const activityId = req.params.activityId || req.body.activityId;

  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.role === 'team') {
    if (!req.user.teamActivities.includes(activityId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
  }

  next();
};


module.exports = { authMiddleware, requireRole, requireClientAccess, requireTeamAccess };
