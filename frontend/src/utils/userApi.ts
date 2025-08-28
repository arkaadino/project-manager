// utils/userApi.ts
import type { 
  User, 
  UserResponse, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserFilters,
  TeamMemberSimple,
  ClientSimple 
} from '@/types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      error: response.status === 404 ? 'Resource not found' : 'Network error occurred' 
    }));
    throw new Error(error.error || error.message || 'Something went wrong');
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Get all users with pagination and filters
export const getUsers = async (filters: UserFilters = {}): Promise<UserResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.role && filters.role !== 'all') queryParams.append('role', filters.role);
  if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());

  const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

// Get team members (for project assignment)
export const getTeamMembers = async (): Promise<{ users: TeamMemberSimple[] }> => {
  const response = await fetch(`${API_BASE_URL}/users/team`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

// Get clients (for project assignment)
export const getClients = async (): Promise<{ users: ClientSimple[] }> => {
  const response = await fetch(`${API_BASE_URL}/users/clients`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

// Get single user by ID
export const getUserById = async (id: string): Promise<{ user: User }> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

// Create new user
export const createUser = async (userData: CreateUserRequest): Promise<{ user: User; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

// Update user
export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<{ user: User; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

// Delete user
export const deleteUser = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

// Toggle user active status
export const toggleUserStatus = async (id: string): Promise<{ user: User; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}/toggle-status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

// Helper function to validate user data
export const validateUserData = (userData: CreateUserRequest | UpdateUserRequest): string[] => {
  const errors: string[] = [];

  if ('username' in userData && userData.username && userData.username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if ('email' in userData && userData.email && !isValidEmail(userData.email)) {
    errors.push('Please enter a valid email address');
  }

  if ('password' in userData && userData.password && userData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if ('firstName' in userData && userData.firstName && userData.firstName.length < 2) {
    errors.push('First name must be at least 2 characters long');
  }

  return errors;
};

// Helper function to validate email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to format API errors
export const formatApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};