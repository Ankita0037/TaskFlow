/**
 * Type definitions for the Task Manager application
 */

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

// Task types
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  assignedToId: string | null;
  creator: User;
  assignedTo: User | null;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status?: Status;
  assignedToId?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status?: Status;
  assignedToId?: string | null;
}

// Notification types
export interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  userId: string;
  taskId: string | null;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  tasks: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard types
export interface DashboardStats {
  assigned: number;
  created: number;
  overdue: number;
  completed: number;
  inProgress: number;
}

export interface DashboardData {
  stats: DashboardStats;
  assigned: Task[];
  created: Task[];
  overdue: Task[];
}

// Filter types
export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Audit log types
export interface AuditLog {
  id: string;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
  taskId: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
}
