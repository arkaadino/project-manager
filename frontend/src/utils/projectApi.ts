const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong');
  return data;
};

// Get all projects
export const getProjects = async (params?: Record<string, string>): Promise<any> => {
  const token = localStorage.getItem('token');
  const query = params ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`${API_BASE_URL}/projects${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Get single project
export const getProject = async (id: string): Promise<any> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
