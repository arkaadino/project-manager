import { useState } from 'react';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ActivityStats } from '@/components/activity-page/ActivityStats';
import { ProjectActivityCards } from '@/components/activity-page/ProjectActivityCards';
import { MiniKanban } from '@/components/activity-page/MiniKanban';

interface Task {
  id: string;
  projectId: number;
  title: string;
  description: string;
  assignedTo: string[];
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  progress: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  projectId: number;
  taskId?: string;
  type: 'task_created' | 'task_completed' | 'task_assigned' | 'status_changed' | 'comment_added' | 'login' | 'file_uploaded';
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  timestamp: string;
  metadata?: {
    oldValue?: string;
    newValue?: string;
    fileName?: string;
  };
}

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  team: Array<{ id: string; name: string; avatar: string; role: string; }>;
  recentActivities: Activity[];
  progress: number;
}

export const ActivityPage = () => {
  const currentUser = {
    id: "1",
    name: "John Doe",
    avatar: "",
    role: "Senior Designer"
  };

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Brand Identity Design",
      client: "TechCorp Inc.",
      status: "In Progress",
      totalTasks: 8,
      completedTasks: 3,
      inProgressTasks: 2,
      progress: 37.5,
      team: [
        { id: "1", name: "John Doe", avatar: "", role: "Designer" },
        { id: "2", name: "Sarah Miller", avatar: "", role: "UI Designer" },
        { id: "3", name: "Alex Lee", avatar: "", role: "Developer" }
      ],
      recentActivities: [
        {
          id: "a1",
          projectId: 1,
          taskId: "t1",
          type: "task_completed",
          title: "Logo concepts completed",
          description: "Finished initial logo concepts and ready for review",
          user: { id: "1", name: "John Doe", avatar: "", role: "Designer" },
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
        },
        {
          id: "a2",
          projectId: 1,
          taskId: "t2",
          type: "status_changed",
          title: "Brand guidelines moved to review",
          description: "Task status changed from In Progress to Review",
          user: { id: "2", name: "Sarah Miller", avatar: "", role: "UI Designer" },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          metadata: { oldValue: "In Progress", newValue: "Review" }
        }
      ]
    },
    {
      id: 2,
      name: "Website Redesign",
      client: "StartupXYZ",
      status: "Review",
      totalTasks: 12,
      completedTasks: 10,
      inProgressTasks: 1,
      progress: 83.3,
      team: [
        { id: "3", name: "Alex Lee", avatar: "", role: "Developer" },
        { id: "4", name: "Rachel Kim", avatar: "", role: "Project Manager" }
      ],
      recentActivities: [
        {
          id: "a3",
          projectId: 2,
          taskId: "t3",
          type: "task_assigned",
          title: "Final testing assigned",
          description: "QA testing task assigned to Alex Lee",
          user: { id: "4", name: "Rachel Kim", avatar: "", role: "Project Manager" },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
        }
      ]
    },
    {
      id: 3,
      name: "Social Media Campaign",
      client: "Fashion Brand",
      status: "Planning",
      totalTasks: 6,
      completedTasks: 1,
      inProgressTasks: 3,
      progress: 16.7,
      team: [
        { id: "2", name: "Sarah Miller", avatar: "", role: "UI Designer" },
        { id: "5", name: "Mike Wilson", avatar: "", role: "Creative Director" }
      ],
      recentActivities: [
        {
          id: "a4",
          projectId: 3,
          type: "task_created",
          title: "New content calendar task created",
          description: "Created task for Q4 content calendar planning",
          user: { id: "5", name: "Mike Wilson", avatar: "", role: "Creative Director" },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6 hours ago
        }
      ]
    }
  ]);

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    setMyTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus, 
            progress: newStatus === 'completed' ? 100 : task.progress,
            updatedAt: new Date().toISOString() 
          }
        : task
    ));

    if (newStatus === 'completed') {
      const task = myTasks.find(t => t.id === taskId);
      if (task) {
        const projectIndex = projects.findIndex(p => p.id === task.projectId);
        if (projectIndex !== -1) {
          setProjects(prev => {
            const updatedProjects = [...prev];
            updatedProjects[projectIndex] = {
              ...updatedProjects[projectIndex],
              completedTasks: updatedProjects[projectIndex].completedTasks + 1,
              progress: Math.round(((updatedProjects[projectIndex].completedTasks + 1) / updatedProjects[projectIndex].totalTasks) * 100),
              recentActivities: [
                {
                  id: `a${Date.now()}`,
                  projectId: task.projectId,
                  taskId: task.id,
                  type: 'task_completed',
                  title: `Task "${task.title}" completed`,
                  description: `Task has been marked as completed by ${currentUser.name}`,
                  user: currentUser,
                  timestamp: new Date().toISOString()
                },
                ...updatedProjects[projectIndex].recentActivities
              ]
            };
            return updatedProjects;
          });
        }
      }
    }
  };

  const [myTasks, setMyTasks] = useState<Task[]>([
    {
      id: "t1",
      projectId: 1,
      title: "Create color palette variations",
      description: "Develop 3 different color schemes for the brand identity",
      assignedTo: ["1"],
      status: "in_progress",
      progress: 60,
      dueDate: "2025-08-28",
      priority: "high",
      createdAt: "2025-08-25T09:00:00Z",
      updatedAt: "2025-08-26T10:30:00Z"
    },
    {
      id: "t2",
      projectId: 1,
      title: "Typography selection",
      description: "Choose primary and secondary fonts for brand guidelines",
      assignedTo: ["1"],
      status: "todo",
      progress: 0,
      dueDate: "2025-08-29",
      priority: "medium",
      createdAt: "2025-08-25T09:00:00Z",
      updatedAt: "2025-08-25T09:00:00Z"
    },
    {
      id: "t3",
      projectId: 2,
      title: "Review final designs",
      description: "Review and approve final website designs before development",
      assignedTo: ["1"],
      status: "review",
      progress: 90,
      dueDate: "2025-08-27",
      priority: "high",
      createdAt: "2025-08-20T14:00:00Z",
      updatedAt: "2025-08-26T08:00:00Z"
    }
  ]);

  const stats = {
    totalTasks: projects.reduce((sum, project) => sum + project.totalTasks, 0),
    completedToday: projects.reduce((sum, project) => {
      const todayActivities = project.recentActivities.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        const today = new Date();
        return activityDate.toDateString() === today.toDateString() && 
               activity.type === 'task_completed';
      });
      return sum + todayActivities.length;
    }, 0),
    activeProjects: projects.filter(p => p.status === 'In Progress').length,
    teamMembers: new Set(projects.flatMap(p => p.team.map(t => t.id))).size
  };

  const projectsForKanban = projects.map(p => ({
    id: p.id,
    name: p.name,
    client: p.client
  }));

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />
      
      <div className="ml-64 p-6">
        <Header 
          title="Activity Dashboard"
          description="Monitor project activities and track team progress in real-time"
        />
        
        <div className="space-y-6">
          {/* Stats Bar */}
          <ActivityStats stats={stats} />
          
          {/* Main Content - Project Cards & Mini Kanban */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Project Activity Cards - Takes 2/3 width */}
            <div className="xl:col-span-2">
              <ProjectActivityCards 
                projects={projects} 
                currentUser={currentUser}
              />
            </div>
            
            {/* Mini Kanban - Takes 1/3 width */}
            <div className="xl:col-span-1">
              <MiniKanban 
                tasks={myTasks.filter(task => 
                  task.assignedTo.includes(currentUser.id)
                )}
                currentUser={currentUser}
                projects={projectsForKanban}
                onTaskStatusChange={handleTaskStatusChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;