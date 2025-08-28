import type { LucideIcon } from 'lucide-react';

// ===== USER TYPES =====
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: 'admin' | 'team' | 'client';
  company: string;
  isClient: boolean;
  isActive: boolean;
  clientProjects: string[];
  permissions: {
    canViewAllProjects: boolean;
    canCreateProjects: boolean;
    canEditProjects: boolean;
    canDeleteProjects: boolean;
    canViewTasks: boolean;
    canManageTasks: boolean;
    canViewTeamActivity: boolean;
  };
  lastLogin?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'team' | 'client';
  company?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'team' | 'client';
  isActive?: boolean;
  password?: string;
  company?: string;
}

export interface UserResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}

export interface TeamMemberSimple {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ClientSimple {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

// ===== PROJECT TYPES =====
export type ProjectStatus = 'In Progress' | 'Review' | 'Planning' | 'Completed' | 'On Hold';
export type ProjectPriority = 'High' | 'Medium' | 'Low';

export interface Project {
  id: number;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  deadline: string;
  team: TeamMember[];
  priority: ProjectPriority;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawProject {
  id: number | string;
  name: string;
  status: string;
  priority: string;
  team: string[];
  client?: string;
  progress?: number;
  deadline?: string;
}

export interface ProjectFormData {
  name: string;
  client: string;
  description: string;
  deadline: string;
  priority: Project['priority'];
  teamMembers: string[];
}

// ===== TEAM TYPES =====
export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  projectId: string;
  role: string;
  joinedAt: string;
  user: User;
  avatar: string;
}

// ===== ACTIVITY TYPES =====
export interface ActivityItem {
  id?: string;
  action: string;
  project: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'default';
  userId?: string;
  metadata?: Record<string, number>;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: string;
}

// ===== STATS TYPES =====
export interface StatsData {
  icon: LucideIcon;
  label: string;
  value: string;
  change: number;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

// ===== NOTIFICATION TYPES =====
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ===== MESSAGE TYPES =====
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  projectId?: string;
  type: 'text' | 'file' | 'image';
  timestamp: string;
  readAt?: string;
}

// ===== NAVIGATION TYPES =====
export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// ===== DASHBOARD TYPES =====
export interface DashboardData {
  stats: StatsData[];
  projects: Project[];
  activities: ActivityItem[];
  notifications: Notification[];
}

export interface RawDashboardResponse {
  stats: {
    activeProjects: number;
    activeProjectsChange: number;
    inProgress: number;
    inProgressChange: number;
    completed: number;
    completedChange: number;
    teamMembers: number;
    teamMembersChange: number;
  };
  projects: RawProject[];
  recentActivity: Activity[];
}

// ===== HELPER FUNCTIONS =====
export const getFullName = (user: User | TeamMemberSimple | ClientSimple): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

export const getRoleDisplay = (role: string): string => {
  switch (role) {
    case 'admin': return 'Administrator';
    case 'team': return 'Team Member';
    case 'client': return 'Client';
    default: return role;
  }
};

export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'team': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'client': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};