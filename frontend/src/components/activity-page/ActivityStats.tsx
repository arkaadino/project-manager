import { TrendingUp, CheckCircle, FolderOpen, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ActivityStatsProps {
  stats: {
    totalTasks: number;
    completedToday: number;
    activeProjects: number;
    teamMembers: number;
  };
}

export const ActivityStats = ({ stats }: ActivityStatsProps) => {
  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400"
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: FolderOpen,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400"
    },
    {
      title: "Team Members",
      value: stats.teamMembers,
      icon: Users,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card 
            key={index}
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-6 hover:bg-slate-800/70 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
              
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            
            {/* Progress indicator or trend (optional) */}
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center text-sm">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color} mr-2`}></div>
                <span className="text-slate-400">
                  {stat.title === "Completed Today" && "tasks finished"}
                  {stat.title === "Total Tasks" && "across all projects"}
                  {stat.title === "Active Projects" && "in progress"}
                  {stat.title === "Team Members" && "collaborating"}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};