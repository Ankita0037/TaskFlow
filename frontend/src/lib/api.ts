import axios, { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * API Base URL
 */
const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Request interceptor to add auth token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Generic API request function
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await api.request<T>(config);
  return response.data;
}

/**
 * Auth API endpoints
 */
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
  
  getProfile: () => api.get('/auth/me'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put('/auth/me', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
  
  getUsers: () => api.get('/auth/users'),
};

/**
 * Task API endpoints
 */
export const taskApi = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    api.get('/tasks', { params }),
  
  getOne: (id: string) => api.get(`/tasks/${id}`),
  
  create: (data: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status?: string;
    assignedToId?: string | null;
  }) => api.post('/tasks', data),
  
  update: (id: string, data: {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    status?: string;
    assignedToId?: string | null;
  }) => api.put(`/tasks/${id}`, data),
  
  delete: (id: string) => api.delete(`/tasks/${id}`),
  
  getDashboard: () => api.get('/tasks/dashboard'),
  
  getAuditLogs: (id: string) => api.get(`/tasks/${id}/audit`),
};

/**
 * Notification API endpoints
 */
export const notificationApi = {
  getAll: (unread?: boolean) =>
    api.get('/notifications', { params: { unread } }),
  
  getUnreadCount: () => api.get('/notifications/count'),
  
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api;
