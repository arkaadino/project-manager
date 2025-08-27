// utils/auth.ts
import type { LoginData, RegisterData, AuthResponse, User } from '../types/auth';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function untuk handle response
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
};

// Login
export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });
  
  const data = await handleResponse(response);
  
  // Simpan token ke localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('isAuthenticated', 'true');
  
  return data;
};

// Register
export const register = async (registerData: RegisterData): Promise<AuthResponse> => {
  // Validasi password match
  if (registerData.password !== registerData.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  // Extract nama dari input (split by space)
  const nameParts = registerData.firstName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || registerData.lastName;

  const payload = {
    username: registerData.username,
    email: registerData.email,
    password: registerData.password,
    firstName,
    lastName,
    role: registerData.role,
  };

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  const data = await handleResponse(response);
  
  // Simpan token ke localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('isAuthenticated', 'true');
  
  return data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await handleResponse(response);
  return data.user;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
  window.location.href = '/landing';
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Get token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};