import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp, Clock, Users, CheckCircle, AlertCircle, FileText, Activity } from 'lucide-react';

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

interface ProjectActivityCardsProps {
  projects: Project[];
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
}

export const ProjectActivityCards = ({ projects, currentUser }: ProjectActivityCardsProps) => {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [expandedLogs, setExpandedLogs] = useState<number[]>([]);

  const toggleProject = (projectId: number) => {
    setExpandedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleFullLog = (projectId: number) => {
    setExpandedLogs(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'task_created':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'task_assigned':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'status_changed':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'comment_added':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Review':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Planning':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Project Activities</h2>
        <div className="text-sm text-slate-400">
          {projects.length} active projects
        </div>
      </div>

      {projects.map((project) => {
        const isExpanded = expandedProjects.includes(project.id);
        const isLogExpanded = expandedLogs.includes(project.id);
        
        return (
          <Card
            key={project.id}
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300"
          >
            <div className="p-6">
              {/* Project Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {project.name}
                    </h3>
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    Client: {project.client}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleProject(project.id)}
                  className="text-slate-400 hover:text-white"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {project.totalTasks}
                  </div>
                  <div className="text-xs text-slate-400">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {project.completedTasks}
                  </div>
                  <div className="text-xs text-slate-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {project.inProgressTasks}
                  </div>
                  <div className="text-xs text-slate-400">In Progress</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Overall Progress</span>
                  <span className="text-sm font-medium text-white">
                    {Math.round(project.progress)}%
                  </span>
                </div>
                <Progress 
                  value={project.progress} 
                  className="h-2 bg-slate-700"
                />
              </div>

              {/* Team Avatars */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Team:</span>
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 4).map((member, index) => (
                      <Avatar key={member.id} className="w-8 h-8 border-2 border-slate-800">
                        <AvatarFallback className="bg-slate-600 text-white text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800 flex items-center justify-center">
                        <span className="text-xs text-white">
                          +{project.team.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-slate-300">
                    Recent Activities
                  </h4>
                  
                  {project.recentActivities.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFullLog(project.id)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 h-6 px-2"
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      {isLogExpanded ? 'Hide Full Log' : 'View Full Log'}
                    </Button>
                  )}
                </div>

                {isLogExpanded ? (
                  /* Full Activity Log */
                  <ScrollArea className="max-h-80">
                    <div className="space-y-2 pr-2">
                      {project.recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white mb-1">
                              {activity.title}
                            </p>
                            <p className="text-xs text-slate-400 mb-2">
                              {activity.description}
                            </p>
                            
                            {/* Metadata untuk status changes */}
                            {activity.metadata && (activity.metadata.oldValue || activity.metadata.newValue) && (
                              <div className="text-xs text-slate-500 mb-2">
                                {activity.metadata.oldValue && activity.metadata.newValue && (
                                  <>
                                    <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                                      {activity.metadata.oldValue}
                                    </span>
                                    <span className="mx-1">→</span>
                                    <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                                      {activity.metadata.newValue}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="bg-slate-600 text-white text-xs">
                                    {activity.user.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-slate-400">
                                  {activity.user.name} • {activity.user.role}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500">
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  /* Preview Activities */
                  <>
                    {project.recentActivities.slice(0, isExpanded ? undefined : 2).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white mb-1">
                            {activity.title}
                          </p>
                          <p className="text-xs text-slate-400 mb-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="bg-slate-600 text-white text-xs">
                                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-slate-400">
                                {activity.user.name}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {!isExpanded && project.recentActivities.length > 2 && (
                      <button
                        onClick={() => toggleProject(project.id)}
                        className="w-full text-sm text-cyan-400 hover:text-cyan-300 py-2"
                      >
                        Show {project.recentActivities.length - 2} more activities
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};