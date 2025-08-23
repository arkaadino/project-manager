import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  Users, 
  CheckCircle, 
  Folder,
  Filter
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import StatsCard from '../components/dashboard/StatsCard';
import ProjectCard from '../components/dashboard/ProjectCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import QuickActions from '../components/dashboard/QuickActions';




// Main Dashboard Component
const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const projects = [
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
  ];

  const recentActivity = [
    { action: "Brief submitted successfully", project: "Brand Identity Design", time: "2 hours ago", type: "success" },
    { action: "Revision tracking enabled", project: "Website Redesign", time: "4 hours ago", type: "info" },
    { action: "Timeline updated", project: "Social Media Campaign", time: "1 day ago", type: "warning" },
    { action: "Client feedback received", project: "Brand Identity Design", time: "2 days ago", type: "success" }
  ];

  const statsData = [
    { icon: Folder, label: 'Active Projects', value: '12', change: '+2 this week', color: 'from-blue-500 to-cyan-500' },
    { icon: Clock, label: 'In Progress', value: '8', change: '3 due soon', color: 'from-purple-500 to-pink-500' },
    { icon: CheckCircle, label: 'Completed', value: '24', change: '+5 this month', color: 'from-green-500 to-emerald-500' },
    { icon: Users, label: 'Team Members', value: '16', change: '2 new members', color: 'from-yellow-500 to-orange-500' }
  ];

  const getStatusColor = (status: 'In Progress' | 'Review' | 'Planning' | 'Completed' | string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Planning': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low' | string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="ml-64 p-6">
        <Header />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Active Projects</h2>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white">
                  <Filter size={16} />
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2">
                  <Plus size={16} />
                  New Project
                </button>
              </div>
            </div>
            
            <div className="grid gap-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ActivityFeed activities={recentActivity} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;