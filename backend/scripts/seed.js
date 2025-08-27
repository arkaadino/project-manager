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
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "project-manager"
    });
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Comment.deleteMany({});
    await Activity.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Users (sesuai schema user.js)
    const users = [
      {
        username: 'admin1',
        email: 'admin@company.com',
        password: 'admin123',
        firstName: 'John',
        lastName: 'Admin',
        avatar: '',
        role: 'admin',
        company: 'Tech Company',
        isClient: false,
        isActive: true,
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
        username: 'client1',
        email: 'sarah@acmecorp.com',
        password: 'client123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatar: '',
        role: 'client',
        company: 'Acme Corp',
        isClient: true,
        isActive: true,
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
        username: 'designer1',
        email: 'mike@company.com',
        password: 'designer123',
        firstName: 'Mike',
        lastName: 'Designer',
        avatar: '',
        role: 'team', // role hanya: admin, team, client
        company: 'Tech Company',
        isClient: false,
        isActive: true,
        permissions: {
          canViewAllProjects: false,
          canCreateProjects: false,
          canEditProjects: true,
          canDeleteProjects: false,
          canViewTasks: true,
          canManageTasks: true,
          canViewTeamActivity: true
        }
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Created users');

    // Create Projects (sesuai schema project.js)
    const projects = [
      {
        name: 'Acme Corp Brand Identity',
        description: 'Complete brand identity design for Acme Corp',
        client: 'Sarah Johnson',
        clientId: createdUsers[1]._id.toString(), // ObjectId dari user client
        status: 'In Progress', // enum: Planning, In Progress, Review, Completed, On Hold
        progress: 60,
        deadline: '2025-09-15',
        priority: 'High', // enum: Low, Medium, High
        budget: 15000,
        team: [
          { 
            id: createdUsers[0]._id.toString(), 
            name: 'John Admin', 
            avatar: '', 
            role: 'admin' 
          },
          { 
            id: createdUsers[2]._id.toString(), 
            name: 'Mike Designer', 
            avatar: '', 
            role: 'team' 
          }
        ],
        totalTasks: 3,
        completedTasks: 1,
        inProgressTasks: 2,
        commentsCount: 0,
        filesCount: 0,
        tags: ['branding', 'design', 'identity'],
        requirements: 'Modern, clean brand identity with logo, color palette, and typography',
        deliverables: 'Logo files, brand guidelines, business card design'
      },
      {
        name: 'Website Development',
        description: 'E-commerce website development',
        client: 'Tech Solutions',
        clientId: createdUsers[1]._id.toString(),
        status: 'Planning',
        progress: 10,
        deadline: '2025-10-30',
        priority: 'Medium',
        budget: 25000,
        team: [
          { 
            id: createdUsers[0]._id.toString(), 
            name: 'John Admin', 
            avatar: '', 
            role: 'admin' 
          }
        ],
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        commentsCount: 0,
        filesCount: 0,
        tags: ['web', 'development', 'ecommerce']
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log('🏗️  Created projects');

    // Create Tasks (sesuai schema task.js)
    const tasks = [
      {
        projectId: 1, // Number, bukan ObjectId
        title: 'Create color palette variations',
        description: 'Develop 3 different color schemes for the brand identity',
        assignedTo: [createdUsers[2]._id.toString()], // Array of String
        status: 'in_progress', // enum: todo, in_progress, review, completed
        progress: 60,
        dueDate: '2025-08-28',
        priority: 'high', // enum: low, medium, high
        projectName: 'Acme Corp Brand Identity',
        clientName: 'Sarah Johnson'
      },
      {
        projectId: 1,
        title: 'Logo design concepts',
        description: 'Create 5 different logo concepts',
        assignedTo: [createdUsers[2]._id.toString()],
        status: 'completed',
        progress: 100,
        dueDate: '2025-08-25',
        priority: 'high',
        projectName: 'Acme Corp Brand Identity',
        clientName: 'Sarah Johnson'
      },
      {
        projectId: 1,
        title: 'Brand guidelines document',
        description: 'Create comprehensive brand guidelines',
        assignedTo: [createdUsers[2]._id.toString()],
        status: 'todo',
        progress: 0,
        dueDate: '2025-09-10',
        priority: 'medium',
        projectName: 'Acme Corp Brand Identity',
        clientName: 'Sarah Johnson'
      }
    ];

    await Task.insertMany(tasks);
    console.log('✅ Created tasks');

    // Create Sample Comments (sesuai schema comment.js)
    const comments = [
      {
        projectId: 1,
        author: {
          id: createdUsers[1]._id.toString(),
          name: 'Sarah Johnson',
          avatar: '',
          role: 'client'
        },
        content: 'The logo concepts look great! Can we try a version with blue color scheme?',
        attachments: []
      },
      {
        projectId: 1,
        author: {
          id: createdUsers[2]._id.toString(),
          name: 'Mike Designer',
          avatar: '',
          role: 'team'
        },
        content: 'Thanks for the feedback! I\'ll prepare blue variations by tomorrow.',
        attachments: []
      }
    ];

    await Comment.insertMany(comments);
    console.log('💬 Created comments');

    // Create Sample Activities (sesuai schema activity.js)
    const activities = [
      {
        projectId: 1,
        taskId: 'task2',
        type: 'task_completed',
        title: 'Task Completed',
        description: 'Logo design concepts task has been completed',
        user: {
          id: createdUsers[2]._id.toString(),
          name: 'Mike Designer',
          avatar: '',
          role: 'team'
        },
        metadata: {
          oldValue: 'in_progress',
          newValue: 'completed'
        },
        projectName: 'Acme Corp Brand Identity',
        action: 'completed task',
        time: '2 hours ago',
        type_simplified: 'success'
      },
      {
        projectId: 1,
        type: 'comment_added',
        title: 'New Comment',
        description: 'New comment added to project',
        user: {
          id: createdUsers[1]._id.toString(),
          name: 'Sarah Johnson',
          avatar: '',
          role: 'client'
        },
        projectName: 'Acme Corp Brand Identity',
        action: 'added comment',
        time: '1 hour ago',
        type_simplified: 'info'
      }
    ];

    await Activity.insertMany(activities);
    console.log('📝 Created activities');

    // Update clientProjects in user (menggunakan ObjectId)
    await User.findByIdAndUpdate(createdUsers[1]._id, {
      clientProjects: [createdProjects[0]._id, createdProjects[1]._id]
    });

    console.log('🎉 Seeding completed successfully!');
    console.log('📊 Database Statistics:');
    console.log(`   👥 Users: ${await User.countDocuments()}`);
    console.log(`   📁 Projects: ${await Project.countDocuments()}`);
    console.log(`   📋 Tasks: ${await Task.countDocuments()}`);
    console.log(`   💬 Comments: ${await Comment.countDocuments()}`);
    console.log(`   📝 Activities: ${await Activity.countDocuments()}`);
    console.log('');
    console.log('🔑 Test accounts:');
    console.log('   Admin: admin@company.com / admin123');
    console.log('   Client: sarah@acmecorp.com / client123');
    console.log('   Team: mike@company.com / designer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();