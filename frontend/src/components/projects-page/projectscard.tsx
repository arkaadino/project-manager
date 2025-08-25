import { 
  Calendar, 
  Users, 
  MessageCircle, 
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Paperclip,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Project {
  id: number;
  name: string;
  client: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'On Hold';
  progress: number;
  deadline: string;
  team: Array<{ id: string; name: string; avatar: string; }>;
  priority: 'Low' | 'Medium' | 'High';
  description: string;
  budget: number;
  commentsCount: number;
  filesCount: number;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  onViewComments: (projectId: number) => void;
  onEdit: (projectId: number) => void;
  onDelete: (projectId: number) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'In Progress':
      return <Clock className="w-4 h-4 text-blue-500" />;
    case 'Review':
      return <Eye className="w-4 h-4 text-purple-500" />;
    case 'On Hold':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'In Progress':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Review':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'On Hold':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Planning':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Medium':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Low':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const ProjectCard = ({ project, onViewComments, onEdit }: ProjectCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(budget);
  };

  const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'Completed';

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {project.name}
            </h3>
            {project.priority === 'High' && (
              <Star className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-slate-400 text-sm mb-2">Client: {project.client}</p>
          <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status & Priority */}
      <div className="flex items-center gap-3 mb-4">
        <Badge className={`flex items-center gap-1.5 ${getStatusColor(project.status)}`}>
          {getStatusIcon(project.status)}
          {project.status}
        </Badge>
        <Badge variant="outline" className={getPriorityColor(project.priority)}>
          {project.priority}
        </Badge>
        {isOverdue && (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Overdue
          </Badge>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progress</span>
          <span className="text-sm font-medium text-white">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>

      {/* Team */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Team Members</span>
        </div>
        <div className="flex items-center gap-2">
          {project.team.slice(0, 3).map((member) => (
            <Avatar key={member.id} className="w-8 h-8 border-2 border-slate-700">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
          {project.team.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
              <span className="text-xs text-slate-300">+{project.team.length - 3}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className={isOverdue ? 'text-red-400' : ''}>
              {formatDate(project.deadline)}
            </span>
          </div>
          <div className="text-cyan-400 font-medium">
            {formatBudget(project.budget)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewComments(project.id)}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            {project.commentsCount}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <Paperclip className="w-4 h-4 mr-1" />
            {project.filesCount}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project.id)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition-opacity"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};