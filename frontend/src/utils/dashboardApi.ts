import type {
  DashboardData,
  Project,
  TeamMember,
  RawDashboardResponse,
  RawProject,
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
          change: raw.stats.activeProjectsChange,
          icon: Folder,
          color: "from-blue-500 to-cyan-500",
        },
        {
          label: "In Progress",
          value: raw.stats.inProgress.toString(),
          change: raw.stats.inProgressChange,
          icon: Clock,
          color: "from-purple-500 to-pink-500",
        },
        {
          label: "Completed",
          value: raw.stats.completed.toString(),
          change: raw.stats.completedChange,
          icon: CheckCircle,
          color: "from-green-500 to-emerald-500",
        },
        {
          label: "Team Members",
          value: raw.stats.teamMembers.toString(),
          change: raw.stats.teamMembersChange,
          icon: Users,
          color: "from-yellow-500 to-orange-500",
        },
      ],
      projects: raw.projects.map((p: RawProject): Project => ({
        ...p,
        id: Number(p.id),
        status: (["In Progress", "Completed", "Review", "Planning", "On Hold"].includes(
          p.status
        )
          ? p.status
          : "Planning") as Project["status"],
        priority: (["High", "Medium", "Low"].includes(p.priority)
          ? p.priority
          : "Medium") as Project["priority"],
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
      activities: raw.recentActivity, // udah cocok ke Activity[]
      notifications: [],
    };
  },
};
