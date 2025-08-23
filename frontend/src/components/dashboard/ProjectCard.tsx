import React from 'react';
import { MoreVertical, Calendar, Folder } from 'lucide-react';

// Definisikan tipe Project
interface Project {
  id: number;
  name: string;
  client: string;
  status: 'In Progress' | 'Review' | 'Planning' | 'Completed' | string;
  progress: number;
  deadline: string;
  team: string[];
  priority: 'High' | 'Medium' | 'Low' | string;
}

// Definisikan props untuk ProjectCard
interface ProjectCardProps {
  project: Project;
  getStatusColor: (status: Project['status']) => string;
  getPriorityColor: (priority: Project['priority']) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, getStatusColor, getPriorityColor }) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 transition-all">
      {/* Header Project */}
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
        <button className="p-1 text-slate-400 hover:text-white">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Progress</span>
          <span className="text-sm text-white font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Deadline & Team */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-sm text-slate-400">{project.deadline}</span>
        </div>
        <div className="flex -space-x-2">
          {project.team.map((member: string, index: number) => (
            <div
              key={index}
              className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-slate-800 flex items-center justify-center"
            >
              <span className="text-xs text-white font-medium">{member}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status & Priority */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
          {project.priority}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
