import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

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

interface MiniKanbanProps {
  tasks: Task[];
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  projects: Array<{
    id: number;
    name: string;
    client: string;
  }>;
  onTaskStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

export const MiniKanban = ({ tasks, currentUser, projects, onTaskStatusChange }: MiniKanbanProps) => {
  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: Task['status'];
    switch (task.status) {
      case 'todo':
        newStatus = 'in_progress';
        break;
      case 'in_progress':
        newStatus = 'review';
        break;
      case 'review':
        newStatus = 'completed';
        break;
      default:
        return;
    }
    
    onTaskStatusChange(taskId, newStatus);
  };

  const getNextStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'Start Task';
      case 'in_progress':
        return 'Send to Review';
      case 'review':
        return 'Mark Complete';
      default:
        return '';
    }
  };

  const getProjectInfo = (projectId: number) => {
    return projects.find(p => p.id === projectId);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'review':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate && t.status === 'completed');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: tasksByStatus.todo,
      color: 'border-slate-500',
      bgColor: 'bg-slate-500/10'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      tasks: tasksByStatus.in_progress,
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'review',
      title: 'Review',
      tasks: tasksByStatus.review,
      color: 'border-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: tasksByStatus.completed,
      color: 'border-green-500',
      bgColor: 'bg-green-500/10'
    }
  ];

  // Render individual task card
  const renderTaskCard = (task: Task) => {
    const projectInfo = getProjectInfo(task.projectId);
    
    return (
    <Card className="bg-slate-700/40 border-slate-600 hover:border-slate-500 transition-all duration-200 mb-4 pt-2">
        <div className="pt-2 px-4 pb-4">
          {/* Project Info */}
          {projectInfo && (
            <div className="flex flex-col mb-3 pb-2 border-b border-slate-600 mt-0">
              <span className="text-xl text-white truncate font-bold">
                {projectInfo.client}
              </span>
              <span className="text-sm text-white truncate">
                {projectInfo.name}
              </span>
            </div>
          )}

          {/* Task Header with Action Button */}
          <div className="flex items-start gap-3 mb-3">
            {task.status !== 'completed' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTaskComplete(task.id)}
                className={`h-7 px-3 text-xs border transition-colors flex-shrink-0 ${
                  task.status === 'todo' 
                    ? 'bg-blue-500/30 text-white hover:bg-blue-500/10 hover:bg-blue-500/50 hover:text-white' 
                    : task.status === 'in_progress'
                    ? 'bg-orange-500/30 text-white hover:bg-orange-500/10 hover:bg-orange-500/50 hover:text-white'
                    : 'bg-green-500/30 text-white hover:bg-green-500/10 hover:bg-green-500/50 hover:text-white'
                }`}
              >
                {getNextStatusText(task.status)}
              </Button>
            )}
            <div className="flex-1 min-w-0">
              <h4 className={`text-1xl font-medium leading-tight mb-1 ${
                task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'
              }`}>
                {task.title}
              </h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
              </div>
            </div>
          </div>

          {/* Task Description */}
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            {task.description}
          </p>

          {/* Progress Bar (only for in-progress tasks) */}
          {task.status === 'in_progress' && task.progress > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Progress</span>
                <span className="text-xs text-slate-300 font-medium">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2 bg-slate-600" />
            </div>
          )}

          {/* Task Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-600">
            <div className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-400' : 'text-slate-400'} flex items-center gap-1`}>
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </div>
            <div className="text-xs text-slate-500">
              Updated {formatDate(task.updatedAt)}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header Section */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">My Tasks</h2>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              {tasks.length} tasks
            </Badge>
          </div>

          {/* Task Summary Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-700/30 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-slate-300">
                {tasksByStatus.todo.length}
              </div>
              <div className="text-xs text-slate-500">To Do</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-blue-400">
                {tasksByStatus.in_progress.length}
              </div>
              <div className="text-xs text-slate-500">Active</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-orange-400">
                {tasksByStatus.review.length}
              </div>
              <div className="text-xs text-slate-500">Review</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-green-400">
                {tasksByStatus.completed.length}
              </div>
              <div className="text-xs text-slate-500">Done</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Kanban Sections - Each section contains all tasks of that status */}
      {columns.map((column) => (
        <div key={column.id} className="w-full">
          {/* Section Header */}
          <div className={`${column.bgColor} rounded-t-lg border-t-2 ${column.color} p-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {getStatusIcon(column.id as Task['status'])}
                {column.title}
              </h3>
              <Badge className="bg-slate-800/50 text-slate-300 border-slate-600">
                {column.tasks.length}
              </Badge>
            </div>
            {column.tasks.length > 0 && (
              <p className="text-sm text-slate-300 mt-2">
                {column.tasks.length} task{column.tasks.length !== 1 ? 's' : ''} in this section
              </p>
            )}
          </div>

          {/* Tasks Container */}
          <div className="bg-slate-800/30 rounded-b-lg border-x border-b border-slate-700 min-h-[100px]">
            {column.tasks.length > 0 ? (
              <div className="p-4 space-y-0">
                {column.tasks.map(renderTaskCard)}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-slate-500 text-sm mb-2">
                  No {column.title.toLowerCase()} tasks
                </div>
                <div className="text-xs text-slate-600">
                  Tasks will appear here when they reach this status
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Quick Stats Footer */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <div className="p-4">
          <div className="text-sm font-medium text-slate-300 mb-3">Quick Stats</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Overdue:</span>
              <span className="text-red-400 font-medium">
                {tasks.filter(t => isOverdue(t.dueDate)).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">This Week:</span>
              <span className="text-cyan-400 font-medium">
                {tasks.filter(t => {
                  const taskDate = new Date(t.dueDate);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return taskDate >= today && taskDate <= weekFromNow;
                }).length}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Demo component with sample data
const MiniKanbanDemo = () => {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      projectId: 1,
      title: 'Create color palette variations',
      description: 'Develop 3 different color schemes for the brand identity project. This includes primary, secondary, and accent colors.',
      assignedTo: ['user1'],
      status: 'in_progress',
      progress: 60,
      dueDate: '2025-08-28',
      priority: 'high',
      createdAt: '2025-08-20',
      updatedAt: '2025-08-26'
    },
    {
      id: '2',
      projectId: 2,
      title: 'Typography selection and guidelines',
      description: 'Review final website typography designs and create comprehensive style guidelines for the development team.',
      assignedTo: ['user1'],
      status: 'review',
      progress: 100,
      dueDate: '2025-08-29',
      priority: 'high',
      createdAt: '2025-08-22',
      updatedAt: '2025-08-26'
    },
    {
      id: '3',
      projectId: 1,
      title: 'Logo design finalization',
      description: 'Complete the final logo design iterations and prepare all necessary file formats for client delivery.',
      assignedTo: ['user1'],
      status: 'todo',
      progress: 0,
      dueDate: '2025-08-30',
      priority: 'medium',
      createdAt: '2025-08-25',
      updatedAt: '2025-08-25'
    },
    {
      id: '4',
      projectId: 2,
      title: 'Website mockup review',
      description: 'Final review of homepage and key landing page mockups before development phase.',
      assignedTo: ['user1'],
      status: 'completed',
      progress: 100,
      dueDate: '2025-08-25',
      priority: 'low',
      createdAt: '2025-08-20',
      updatedAt: '2025-08-24'
    }
  ]);

  const projects = [
    { id: 1, name: 'Brand Identity Design', client: 'Acme Corp' },
    { id: 2, name: 'Website Redesign', client: 'Tech Solutions' }
  ];

  const currentUser = {
    id: 'user1',
    name: 'John Doe',
    avatar: '/avatar.jpg',
    role: 'Designer'
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <MiniKanban 
        tasks={tasks}
        currentUser={currentUser}
        projects={projects}
        onTaskStatusChange={handleTaskStatusChange}
      />
    </div>
  );
};

export default MiniKanbanDemo;