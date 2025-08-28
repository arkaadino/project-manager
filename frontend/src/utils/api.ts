// utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Generic API fetch wrapper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token'); // atau dari cookies/context

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Dashboard API functions
export const dashboardApi = {
  // Get dashboard data
  getDashboard: () => 
    apiRequest<{
      stats: {
        activeProjects: number;
        inProgress: number;
        completed: number;
        teamMembers: number;
        activeProjectsChange: string;
        inProgressChange: string;
        completedChange: string;
        teamMembersChange: string;
      };
      projects: Array<{
        id: string;
        name: string;
        client: string;
        status: string;
        progress: number;
        deadline: string;
        team: string[];
        priority: string;
      }>;
      recentActivity: Array<{
        action: string;
        project: string;
        time: string;
        type: 'success' | 'warning' | 'info' | 'default';
      }>;
    }>('/dashboard'),

  // Get detailed stats
  getStats: () =>
    apiRequest<{
      overview: {
        totalProjects: number;
        inProgressProjects: number;
        completedProjects: number;
        teamMembers: number;
      };
      breakdown: {
        byStatus: {
          planning: number;
          inProgress: number;
          review: number;
          completed: number;
          onHold: number;
        };
        byPriority: {
          high: number;
        };
      };
      tasks: {
        total: number;
        completed: number;
        completionRate: number;
      };
      users: {
        total: number;
        teamMembers: number;
      };
    }>('/dashboard/stats'),
};

// Projects API functions
export const projectsApi = {
  // Get all projects
  getProjects: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }) => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    return apiRequest<{
      projects: Array<{
        id: string;
        name: string;
        client: string;
        status: string;
        progress: number;
        deadline: string;
        team: Array<{
          id: string;
          name: string;
          avatar: string;
          role: string;
        }>;
        priority: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/projects${queryString}`);
  },

  // Get single project
  getProject: (id: string) =>
    apiRequest<{
      project: {
        id: string;
        name: string;
        description: string;
        client: string;
        clientId: string;
        status: string;
        progress: number;
        deadline: string;
        priority: string;
        budget: number;
        team: Array<{
          id: string;
          name: string;
          avatar: string;
          role: string;
        }>;
        totalTasks: number;
        completedTasks: number;
        inProgressTasks: number;
        commentsCount: number;
        filesCount: number;
        tags: string[];
        requirements: string;
        deliverables: string;
        createdAt: string;
        updatedAt: string;
      };
    }>(`/projects/${id}`),
};

// Activities API functions  
export const activitiesApi = {
  // Get activities
  getActivities: (params?: {
    page?: number;
    limit?: number;
    projectId?: string;
    type?: string;
  }) => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';

    return apiRequest<{
      activities: Array<{
        id: string;
        title: string;
        description: string;
        type: string;
        user: {
          id: string;
          name: string;
          avatar: string;
          role: string;
        };
        projectName: string;
        timestamp: string;
        type_simplified: 'success' | 'warning' | 'info' | 'default';
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/activities${queryString}`);
  },
};

// Users API functions
export const usersApi = {
  // Get team members
  getTeamMembers: () =>
    apiRequest<{
      users: Array<{
        _id: string;
        username: string;
        firstName: string;
        lastName: string;
        role: string;
        avatar: string;
      }>;
    }>('/users/team'),

  // Get clients
  getClients: () =>
    apiRequest<{
      users: Array<{
        _id: string;
        username: string;
        firstName: string;
        lastName: string;
        avatar: string;
      }>;
    }>('/users/clients'),

  // Get current user profile
  getProfile: () =>
    apiRequest<{
      user: {
        _id: string;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        role: string;
        company: string;
        permissions: {
          canViewAllProjects: boolean;
          canCreateProjects: boolean;
          canEditProjects: boolean;
          canDeleteProjects: boolean;
          canViewTasks: boolean;
          canManageTasks: boolean;
          canViewTeamActivity: boolean;
        };
        lastLogin: string;
        createdAt: string;
        updatedAt: string;
      };
    }>('/auth/profile'), // assuming you have auth profile endpoint
};