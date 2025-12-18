import { Request } from 'express';
import { Priority, Status } from '@prisma/client';

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * JWT Payload structure
 */
export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * User response type (without password)
 */
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task with related user information
 */
export interface TaskWithRelations {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  assignedToId: string | null;
  creator: UserResponse;
  assignedTo: UserResponse | null;
}

/**
 * Notification type
 */
export interface NotificationResponse {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  userId: string;
  taskId: string | null;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Task filter parameters
 */
export interface TaskFilterParams extends PaginationParams {
  status?: Status;
  priority?: Priority;
  assignedToId?: string;
  creatorId?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
  overdue?: boolean;
}

/**
 * Socket events
 */
export enum SocketEvents {
  TASK_CREATED = 'task:created',
  TASK_UPDATED = 'task:updated',
  TASK_DELETED = 'task:deleted',
  TASK_ASSIGNED = 'task:assigned',
  NOTIFICATION_NEW = 'notification:new',
  USER_JOINED = 'user:joined',
  USER_LEFT = 'user:left',
}

/**
 * Audit log action types
 */
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ASSIGN = 'ASSIGN',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

export { Priority, Status };
