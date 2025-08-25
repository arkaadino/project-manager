import type { LucideIcon } from 'lucide-react';

// Project Types
export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'In Progress' | 'Review' | 'Planning' | 'Completed' | 'On Hold';
  progress: number;
  deadline: string;
  team: string[];
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
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'designer' | 'client';
  status: 'active' | 'inactive';
  createdAt: string;
}

// Team Types
export interface TeamMember {
  id: string;
  userId: string;
  projectId: string;
  role: string;
  joinedAt: string;
  user: User;
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