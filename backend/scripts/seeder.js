// ===== SCRIPTS/SEED.JS (Database Seeder) =====
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/user');
const Project = require('../models/project');
const Task = require('../models/task');
const Comment = require('../models/comment');
const Activity = require('../models/activity');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Comment.deleteMany({});
    await Activity.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Users
    const users = [
      {
        id: 'admin1',
        name: 'John Admin',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin',
        isClient: false,
        permissions: {
          canViewAllProjects: true,
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: true,
          canViewTasks: true,
          canManageTasks: true,
          canViewTeamActivity: true
        }
      },
      {
        id: 'client1',
        name: 'Sarah Johnson',
        email: 'sarah@acmecorp.com',
        password: 'client123',
        role: 'client',
        company: 'Acme Corp',
        isClient: true,
        clientProjects: [1, 3],
        permissions: {
          canViewAllProjects: false,
          canCreateProjects: false,
          canEditProjects: false,
          canDeleteProjects: false,
          canViewTasks: false,
          canManageTasks: false,
          canViewTeamActivity: false
        }
      },
      {
        id: 'designer1',
        name: 'Mike Designer',
        email: 'mike@company.com',
        password: 'designer123',
        role: 'designer',
        isClient: false,
        permissions: {
          canViewAllProjects: false,
          canCreateProjects: false,
          canEditProjects: false,
          canDeleteProjects: false,
          canViewTasks: true,
          canManageTasks: true,
          canViewTeamActivity: true
        }
      }
    ];

    await User.insertMany(users);
    console.log('👥 Created users');

    // Create Projects
    const projects = [
      {
        id: 1,
        name: 'Acme Corp Brand Identity',
        description: 'Complete brand identity design for Acme Corp',
        client: 'Sarah Johnson',
        clientId: 'client1',
        status: 'In Progress',
        progress: 60,
        deadline: '2025-09-15',
        priority: 'High',
        budget: 15000,
        team: [
          { id: 'admin1', name: 'John Admin', avatar: '', role: 'admin' },
          { id: 'designer1', name: 'Mike Designer', avatar: '', role: 'designer' }
        ],
        totalTasks: 3,
        completedTasks: 1,
        inProgressTasks: 2,
        tags: ['branding', 'design', 'identity'],
        requirements: 'Modern, clean brand identity with logo, color palette, and typography',
        deliverables: 'Logo files, brand guidelines, business card design'
      },
      {
        id: 2,
        name: 'Website Development',
        description: 'E-commerce website development',
        client: 'Tech Solutions',
        clientId: 'client2',
        status: 'Planning',
        progress: 10,
        deadline: '2025-10-30',
        priority: 'Medium',
        budget: 25000,
        team: [
          { id: 'admin1', name: 'John Admin', avatar: '', role: 'admin' }
        ],
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
      }
    ];

    await Project.insertMany(projects);
    console.log('🏗️  Created projects');

    // Create Tasks
    const tasks = [
      {
        id: 'task1',
        projectId: 1,
        title: 'Create color palette variations',
        description: 'Develop 3 different color schemes for the brand identity',
        assignedTo: ['designer1'],
        status: 'in_progress',
        progress: 60,
        dueDate: '2025-08-28',
        priority: 'high',
        projectName: 'Acme Corp Brand Identity',
        clientName: 'Sarah Johnson'
      },
      {
        id: 'task2',
        projectId: 1,
        title: 'Logo design concepts',
        description: 'Create 5 different logo concepts',
        assignedTo: ['designer1'],
        status: 'completed',
        progress: 100,
        dueDate: '2025-08-25',
        priority: 'high',
        projectName: 'Acme Corp Brand Identity',
        clientName: 'Sarah Johnson'
      }
    ];

    await Task.insertMany(tasks);
    console.log('✅ Created tasks');

    console.log('🎉 Seeding completed successfully!');
    console.log('📋 Test accounts:');
    console.log('   Admin: admin@company.com / admin123');
    console.log('   Client: sarah@acmecorp.com / client123');
    console.log('   Designer: mike@company.com / designer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();

