// routes/dashboard.js
const express = require('express');
const Project = require('../models/project');
const Activity = require('../models/activity');
const User = require('../models/user');
const Task = require('../models/task');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// GET /api/dashboard - Get dashboard data
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Build project filter based on user role
    let projectFilter = {};
    if (userRole === 'client') {
      projectFilter.clientId = userId.toString();
    } else if (userRole === 'team') {
      projectFilter['team.id'] = userId.toString();
    }
    // Admin can see all projects

    // Get projects
    const projects = await Project.find(projectFilter)
      .sort({ updatedAt: -1 })
      .limit(10);

    // Get stats
    const totalProjects = await Project.countDocuments(projectFilter);
    const inProgressProjects = await Project.countDocuments({
      ...projectFilter,
      status: 'In Progress'
    });
    const completedProjects = await Project.countDocuments({
      ...projectFilter,
      status: 'Completed'
    });
    const teamMembers = await User.countDocuments({ 
      role: { $in: ['admin', 'team'] }, 
      isActive: true 
    });

    // Get recent activities
    const activities = await Activity.find(
      userRole === 'client' 
        ? { 'user.id': userId.toString() }
        : {} // Team and admin see all activities
    )
      .sort({ createdAt: -1 })
      .limit(10);

    // Format projects for frontend
    const formattedProjects = projects.map(project => ({
      id: project._id,
      name: project.name,
      client: project.client,
      status: project.status,
      progress: project.progress,
      deadline: project.deadline,
      team: project.team.map(member => member.name || member.id),
      priority: project.priority
    }));

    // Format activities for frontend
    const formattedActivities = activities.map(activity => ({
      action: activity.title || activity.action,
      project: activity.projectName,
      time: formatTimeAgo(activity.createdAt),
      type: activity.type_simplified || 'default'
    }));

    // Calculate stats changes (you might want to implement proper comparison logic)
    const statsData = {
      activeProjects: totalProjects,
      inProgress: inProgressProjects,
      completed: completedProjects,
      teamMembers: teamMembers,
      activeProjectsChange: '+2 this week', // Implement proper calculation
      inProgressChange: '3 due soon', // Implement proper calculation
      completedChange: '+5 this month', // Implement proper calculation
      teamMembersChange: '2 new members' // Implement proper calculation
    };

    res.json({
      stats: statsData,
      projects: formattedProjects,
      recentActivity: formattedActivities
    });

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/dashboard/stats - Get detailed stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Build filter
    let projectFilter = {};
    if (userRole === 'client') {
      projectFilter.clientId = userId.toString();
    } else if (userRole === 'team') {
      projectFilter['team.id'] = userId.toString();
    }

    // Get various counts
    const [
      totalProjects,
      inProgressProjects,
      completedProjects,
      onHoldProjects,
      planningProjects,
      reviewProjects,
      highPriorityProjects,
      totalTasks,
      completedTasks,
      teamMembers,
      activeUsers
    ] = await Promise.all([
      Project.countDocuments(projectFilter),
      Project.countDocuments({ ...projectFilter, status: 'In Progress' }),
      Project.countDocuments({ ...projectFilter, status: 'Completed' }),
      Project.countDocuments({ ...projectFilter, status: 'On Hold' }),
      Project.countDocuments({ ...projectFilter, status: 'Planning' }),
      Project.countDocuments({ ...projectFilter, status: 'Review' }),
      Project.countDocuments({ ...projectFilter, priority: 'High' }),
      Task.countDocuments({}),
      Task.countDocuments({ status: 'completed' }),
      User.countDocuments({ role: { $in: ['admin', 'team'] }, isActive: true }),
      User.countDocuments({ isActive: true })
    ]);

    res.json({
      overview: {
        totalProjects,
        inProgressProjects,
        completedProjects,
        teamMembers
      },
      breakdown: {
        byStatus: {
          planning: planningProjects,
          inProgress: inProgressProjects,
          review: reviewProjects,
          completed: completedProjects,
          onHold: onHoldProjects
        },
        byPriority: {
          high: highPriorityProjects,
          // Add medium and low if needed
        }
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      users: {
        total: activeUsers,
        teamMembers
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
    return 'Just now';
  }
}

module.exports = router;