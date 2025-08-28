import type {
  DashboardData,
  Project,
  TeamMember,
  RawDashboardResponse,
  RawProject,
  ActivityItem,
} from "@/types";
import { Folder, Clock, CheckCircle, Users } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const raw: RawDashboardResponse = await response.json();

    return {
      stats: [
        {
          label: "Active Projects",
          value: raw.stats.activeProjects.toString(),
          change: raw.stats.activeProjectsChange, // Now correctly typed as number
          icon: Folder,
          color: "from-blue-500 to-cyan-500",
        },
        {
          label: "In Progress",
          value: raw.stats.inProgress.toString(),
          change: raw.stats.inProgressChange, // Now correctly typed as number
          icon: Clock,
          color: "from-purple-500 to-pink-500",
        },
        {
          label: "Completed",
          value: raw.stats.completed.toString(),
          change: raw.stats.completedChange, // Now correctly typed as number
          icon: CheckCircle,
          color: "from-green-500 to-emerald-500",
        },
        {
          label: "Team Members",
          value: raw.stats.teamMembers.toString(),
          change: raw.stats.teamMembersChange, // Now correctly typed as number
          icon: Users,
          color: "from-yellow-500 to-orange-500",
        },
      ],
      projects: raw.projects.map((p: RawProject): Project => ({
        id: Number(p.id),
        name: p.name,
        client: p.client || "Unknown Client", // Add missing client property
        status: (["In Progress", "Completed", "Review", "Planning", "On Hold"].includes(
          p.status
        )
          ? p.status
          : "Planning") as Project["status"],
        priority: (["High", "Medium", "Low"].includes(p.priority)
          ? p.priority
          : "Medium") as Project["priority"],
        progress: p.progress || 0, // Add missing progress property
        deadline: p.deadline || new Date().toISOString(), // Add missing deadline property
        team: (p.team || []).map(
          (name: string, i: number): TeamMember => ({
            id: `${i}`,
            userId: "",
            name,
            projectId: p.id.toString(),
            role: "Member",
            joinedAt: new Date().toISOString(),
            user: {
              _id: "",
              username: name.toLowerCase().replace(/\s+/g, "_"),
              email: "",
              firstName: name,
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
            avatar: "",
          })
        ),
      })),
      // Transform Activity[] to ActivityItem[]
      activities: raw.recentActivity.map((activity): ActivityItem => ({
        id: activity.id,
        action: activity.message,
        project: "General", // Default project name since it's not in Activity
        time: activity.timestamp,
        type: "info" as const, // Default type since it's not in Activity
        userId: undefined,
        metadata: undefined,
      })),
      notifications: [],
    };
  },
};