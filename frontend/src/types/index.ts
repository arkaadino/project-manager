import type { LucideIcon } from 'lucide-react';

// Project Types
export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'In Progress' | 'Review' | 'Planning' | 'Completed' | 'On Hold';
  progress: number;
  deadline: string;
  team: TeamMember[];
  priority: 'High' | 'Medium' | 'Low';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Activity Types
export interface ActivityItem {
  id?: string;
  action: string;
  project: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'default';
  userId?: string;
  metadata?: Record<string, number>;
}

// Stats Types
export interface StatsData {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

// User Types
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

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
}

// Helper function to get full name
export const getFullName = (user: User | TeamMemberSimple | ClientSimple): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

// Helper function to get display role
export const getRoleDisplay = (role: string): string => {
  switch (role) {
    case 'admin': return 'Administrator';
    case 'team': return 'Team Member';
    case 'client': return 'Client';
    default: return role;
  }
};

// Helper function to get role color
export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'team': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'client': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};
// Team Types
export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  projectId: string;
  role: string;
  joinedAt: string;
  user: User;
  avatar?: string;
}

// Message Types
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

// Navigation Types
export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

// API Response Types
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

// Form Types
export interface ProjectFormData {
  name: string;
  client: string;
  description: string;
  deadline: string;
  priority: Project['priority'];
  teamMembers: string[];
}

// Dashboard Types
export interface DashboardData {
  stats: StatsData[];
  projects: Project[];
  activities: ActivityItem[];
  notifications: Notification[];
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}