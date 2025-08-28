import { Calendar, Folder, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import type { Project, TeamMember } from '@/types';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export const ProjectCard = ({ project, className = "" }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30';
      case 'Review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30';
      case 'Planning': return 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30';
      case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30';
      case 'On Hold': return 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-400 hover:bg-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 hover:bg-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={`bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/50 transition-all ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Folder size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{project.name}</h3>
              <p className="text-sm text-slate-400">{project.client}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
            <MoreVertical size={16} />
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progress</span>
            <span className="text-sm text-white font-medium">{project.progress}%</span>
          </div>
          <Progress 
            value={project.progress} 
            className="h-2 bg-slate-700/50"
          />
        </div>

        {/* Date & Team */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            <span className="text-sm text-slate-400">{formatDate(project.deadline)}</span>
          </div>
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member: TeamMember, index) => (
              <Avatar key={member.id || index} className="w-6 h-6 border-2 border-slate-800">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {member.name ? member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '?'}
                    </span>
                  </div>
                )}
              </Avatar>
            ))}
            {project.team.length > 3 && (
              <Avatar className="w-6 h-6 border-2 border-slate-800">
                <div className="w-full h-full bg-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">+{project.team.length - 3}</span>
                </div>
              </Avatar>
            )}
          </div>
        </div>

        {/* Status & Priority */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline"
            className={getStatusColor(project.status)}
          >
            {project.status}
          </Badge>
          <Badge 
            variant="secondary"
            className={getPriorityColor(project.priority)}
          >
            {project.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
