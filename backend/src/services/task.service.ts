import { Priority, Status } from '@prisma/client';
import { taskRepository, notificationRepository, auditLogRepository } from '../repositories';
import { CreateTaskInput, UpdateTaskInput } from '../dtos';
import { TaskFilterParams, TaskWithRelations, AuditAction } from '../types';

/**
 * Task Service
 * Handles business logic for task management
 */
export class TaskService {
  /**
   * Create a new task
   * @param data - Task creation data
   * @param creatorId - ID of the user creating the task
   * @returns Created task with relations
   */
  async createTask(
    data: CreateTaskInput,
    creatorId: string
  ): Promise<TaskWithRelations> {
    const task = await taskRepository.create({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      creatorId,
      assignedToId: data.assignedToId || null,
    });

    // Create audit log
    await auditLogRepository.create({
      action: AuditAction.CREATE,
      taskId: task.id,
      userId: creatorId,
    });

    // Create notification if assigned to someone
    if (data.assignedToId && data.assignedToId !== creatorId) {
      await notificationRepository.create({
        message: `You have been assigned to task: "${task.title}"`,
        type: 'TASK_ASSIGNED',
        userId: data.assignedToId,
        taskId: task.id,
      });
    }

    return task;
  }

  /**
   * Get a task by ID
   * @param taskId - Task ID
   * @returns Task with relations or null
   */
  async getTask(taskId: string): Promise<TaskWithRelations | null> {
    return taskRepository.findById(taskId);
  }

  /**
   * Get all tasks with filtering and pagination
   * @param params - Filter and pagination parameters
   * @returns Paginated tasks response
   */
  async getTasks(params: TaskFilterParams): Promise<{
    tasks: TaskWithRelations[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return taskRepository.findAll(params);
  }

  /**
   * Update a task
   * @param taskId - Task ID
   * @param data - Update data
   * @param userId - ID of the user updating the task
   * @returns Updated task with relations
   * @throws Error if task not found
   */
  async updateTask(
    taskId: string,
    data: UpdateTaskInput,
    userId: string
  ): Promise<{
    task: TaskWithRelations;
    changes: Array<{ field: string; oldValue: string; newValue: string }>;
    assigneeChanged: boolean;
    newAssigneeId?: string;
  }> {
    const existingTask = await taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const changes: Array<{ field: string; oldValue: string; newValue: string }> = [];
    let assigneeChanged = false;
    let newAssigneeId: string | undefined;

    // Track changes for audit log
    if (data.title && data.title !== existingTask.title) {
      changes.push({
        field: 'title',
        oldValue: existingTask.title,
        newValue: data.title,
      });
    }

    if (data.status && data.status !== existingTask.status) {
      changes.push({
        field: 'status',
        oldValue: existingTask.status,
        newValue: data.status,
      });
    }

    if (data.priority && data.priority !== existingTask.priority) {
      changes.push({
        field: 'priority',
        oldValue: existingTask.priority,
        newValue: data.priority,
      });
    }

    if (data.assignedToId !== undefined && data.assignedToId !== existingTask.assignedToId) {
      assigneeChanged = true;
      newAssigneeId = data.assignedToId || undefined;
      changes.push({
        field: 'assignedToId',
        oldValue: existingTask.assignedToId || 'Unassigned',
        newValue: data.assignedToId || 'Unassigned',
      });
    }

    // Update the task
    const task = await taskRepository.update(taskId, data);

    // Create audit logs for each change
    for (const change of changes) {
      await auditLogRepository.create({
        action: change.field === 'status' ? AuditAction.STATUS_CHANGE : AuditAction.UPDATE,
        field: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
        taskId,
        userId,
      });
    }

    // Create notification for new assignee
    if (assigneeChanged && newAssigneeId && newAssigneeId !== userId) {
      await notificationRepository.create({
        message: `You have been assigned to task: "${task.title}"`,
        type: 'TASK_ASSIGNED',
        userId: newAssigneeId,
        taskId,
      });
    }

    return { task, changes, assigneeChanged, newAssigneeId };
  }

  /**
   * Delete a task
   * @param taskId - Task ID
   * @param userId - ID of the user deleting the task
   * @throws Error if task not found or user is not the creator
   */
  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Only creator can delete the task
    if (task.creatorId !== userId) {
      throw new Error('Only the task creator can delete this task');
    }

    await taskRepository.delete(taskId);
  }

  /**
   * Get tasks assigned to a user
   * @param userId - User ID
   * @returns Array of tasks
   */
  async getAssignedTasks(userId: string): Promise<TaskWithRelations[]> {
    return taskRepository.findByAssignee(userId);
  }

  /**
   * Get tasks created by a user
   * @param userId - User ID
   * @returns Array of tasks
   */
  async getCreatedTasks(userId: string): Promise<TaskWithRelations[]> {
    return taskRepository.findByCreator(userId);
  }

  /**
   * Get overdue tasks for a user
   * @param userId - User ID
   * @returns Array of overdue tasks
   */
  async getOverdueTasks(userId: string): Promise<TaskWithRelations[]> {
    return taskRepository.findOverdue(userId);
  }

  /**
   * Get dashboard statistics for a user
   * @param userId - User ID
   * @returns Dashboard statistics
   */
  async getDashboardStats(userId: string): Promise<{
    assigned: number;
    created: number;
    overdue: number;
    completed: number;
    inProgress: number;
  }> {
    return taskRepository.getDashboardStats(userId);
  }

  /**
   * Get audit logs for a task
   * @param taskId - Task ID
   * @returns Array of audit logs
   */
  async getTaskAuditLogs(taskId: string) {
    return auditLogRepository.findByTask(taskId);
  }

  /**
   * Validate task creation data
   * This is exposed for testing purposes
   * @param data - Task creation data
   * @returns Validation result
   */
  validateTaskCreation(data: CreateTaskInput): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (data.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!data.dueDate) {
      errors.push('Due date is required');
    } else if (new Date(data.dueDate) < new Date()) {
      // Allow due dates in the past for flexibility, just warn
      // errors.push('Due date cannot be in the past');
    }

    if (data.priority && !Object.values(Priority).includes(data.priority)) {
      errors.push('Invalid priority value');
    }

    if (data.status && !Object.values(Status).includes(data.status)) {
      errors.push('Invalid status value');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const taskService = new TaskService();
export default taskService;
