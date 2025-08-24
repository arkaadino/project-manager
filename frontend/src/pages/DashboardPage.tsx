import { useState } from 'react';
import { Plus, Filter, Clock, Users, CheckCircle, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import Components
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';

// Types
interface Project {
  id: number;
  name: string;
  client: string;
  status: string;
  progress: number;
  deadline: string;
  team: string[];
  priority: string;
}

interface ActivityItem {
  action: string;
  project: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'default';
}

export const DashboardPage = () => {
  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: "Brand Identity Design",
      client: "TechCorp Inc.",
      status: "In Progress",
      progress: 75,
      deadline: "2025-09-15",
      team: ["JD", "SM", "AL"],
      priority: "High"
    },
    {
      id: 2,
      name: "Website Redesign",
      client: "StartupXYZ",
      status: "Review",
      progress: 90,
      deadline: "2025-09-08",
      team: ["AL", "RK"],
      priority: "Medium"
    },
    {
      id: 3,
      name: "Social Media Campaign",
      client: "Fashion Brand",
      status: "Planning",
      progress: 25,
      deadline: "2025-09-30",
      team: ["SM", "JD", "MK"],
      priority: "Low"
    }
  ]);

  const [recentActivity] = useState<ActivityItem[]>([
    { action: "Brief submitted successfully", project: "Brand Identity Design", time: "2 hours ago", type: "success" },
    { action: "Revision tracking enabled", project: "Website Redesign", time: "4 hours ago", type: "info" },
    { action: "Timeline updated", project: "Social Media Campaign", time: "1 day ago", type: "warning" },
    { action: "Client feedback received", project: "Brand Identity Design", time: "2 days ago", type: "success" }
  ]);

  const statsData = [
    { 
      icon: Folder, 
      label: 'Active Projects', 
      value: '12', 
      change: '+2 this week', 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: Clock, 
      label: 'In Progress', 
      value: '8', 
      change: '3 due soon', 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: CheckCircle, 
      label: 'Completed', 
      value: '24', 
      change: '+5 this month', 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      icon: Users, 
      label: 'Team Members', 
      value: '16', 
      change: '2 new members', 
      color: 'from-yellow-500 to-orange-500' 
    }
  ];

  const handleQuickAction = (action: string) => {
    console.log('Quick action clicked:', action);
    // Handle quick actions here
  };

  const handleNewProject = () => {
    console.log('New project clicked');
    // Navigate to new project form or open modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />
      
      <div className="ml-64 p-6">
        <Header 
          title="Project Dashboard"
          description="Manage your creative projects efficiently"
        />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard 
              key={index} 
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              color={stat.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Projects</h2>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                  <Filter size={16} />
                </Button>
                <Button 
                  onClick={handleNewProject}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus size={16} className="mr-2" />
                  New Project
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ActivityFeed activities={recentActivity} />
            <QuickActions onActionClick={handleQuickAction} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;