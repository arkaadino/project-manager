// DashboardPage.tsx - Fixed version
import { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle, Folder } from 'lucide-react';
import { dashboardApi } from '@/utils/dashboardApi';
import type { DashboardData } from '@/types';

// Import Components
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Card, CardContent } from '@/components/ui/card';

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getDashboard();
      
      // Transform the API response to match DashboardData interface
      const completeData: DashboardData = {
        stats: [
          { 
            label: 'Active Projects', 
            value: data.stats.activeProjects.toString(), 
            change: data.stats.activeProjectsChange,
            icon: Folder,
            color: 'from-blue-500 to-cyan-500'
          },
          { 
            label: 'In Progress', 
            value: data.stats.inProgress.toString(), 
            change: data.stats.inProgressChange,
            icon: Clock,
            color: 'from-purple-500 to-pink-500'
          },
          { 
            label: 'Completed', 
            value: data.stats.completed.toString(), 
            change: data.stats.completedChange,
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500'
          },
          { 
            label: 'Team Members', 
            value: data.stats.teamMembers.toString(), 
            change: data.stats.teamMembersChange,
            icon: Users,
            color: 'from-yellow-500 to-orange-500'
          }
        ],
        projects: data.projects.map(project => ({
          ...project,
          id: typeof project.id === 'string' ? parseInt(project.id) : project.id,
          status: project.status as "In Progress" | "Completed" | "Review" | "Planning" | "On Hold",
          priority: (["High", "Medium", "Low"].includes(project.priority)
            ? project.priority
            : "Medium") as "High" | "Medium" | "Low", // fallback biar aman
          team: project.team.map((memberName: string, index: number) => ({
            id: index.toString(),
            userId: "",
            name: memberName,
            projectId: project.id.toString(),
            role: "Member",
            joinedAt: new Date().toISOString(),
            user: {
              _id: "",
              username: memberName.toLowerCase().replace(/\s+/g, "_"),
              email: "",
              firstName: memberName,
              lastName: "",
              avatar: "",
              role: "team",
              company: "",
              isClient: false,
              isActive: true,
              clientProjects: [],
              permissions: {
                canViewAllProjects: false,
                canCreateProjects: false,
                canEditProjects: false,
                canDeleteProjects: false,
                canViewTasks: false,
                canManageTasks: false,
                canViewTeamActivity: false,
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            avatar: ""
          }))
        })),
        activities: data.recentActivity || [],
        notifications: []
      };
      
      setDashboardData(completeData);
      
      setDashboardData(completeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboard();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/30 border-slate-700/50 p-8">
          <CardContent className="text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button 
              onClick={fetchDashboard}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/30 border-slate-700/50 p-8">
          <CardContent className="text-center">
            <p className="text-slate-400">No dashboard data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use the stats data directly since it already has all required properties
  const statsData = dashboardData.stats;

  const handleQuickAction = (action: string) => {
    console.log('Quick action clicked:', action);
    // Handle quick actions here
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
              <button 
                onClick={fetchDashboard}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Refresh
              </button>
            </div>
            
            <div className="space-y-6">
              {dashboardData.projects.length === 0 ? (
                <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/50">
                  <CardContent className="p-8 text-center">
                    <Folder className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No active projects</p>
                  </CardContent>
                </Card>
              ) : (
                dashboardData.projects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ActivityFeed activities={dashboardData.activities} />
            <QuickActions onActionClick={handleQuickAction} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;