import prisma from '../config/database';
import { Task, Priority, Status, Prisma } from '@prisma/client';
import { TaskFilterParams, TaskWithRelations } from '../types';

/**
 * Task Repository
 * Handles all database operations related to tasks
 */
export class TaskRepository {
  /**
   * Default include options for task queries
   */
  private readonly defaultInclude = {
    creator: {
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    assignedTo: {
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  };

  /**
   * Find a task by ID with related user data
   * @param id - Task ID
   * @returns Task with relations or null
   */
  async findById(id: string): Promise<TaskWithRelations | null> {
    return prisma.task.findUnique({
      where: { id },
      include: this.defaultInclude,
    }) as Promise<TaskWithRelations | null>;
  }

  /**
   * Get all tasks with filtering, sorting, and pagination
   * @param params - Filter and pagination parameters
   * @returns Object with tasks array and total count
   */
  async findAll(params: TaskFilterParams): Promise<{
    tasks: TaskWithRelations[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      assignedToId,
      creatorId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      overdue,
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TaskWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (creatorId) {
      where.creatorId = creatorId;
    }

    if (overdue) {
      where.dueDate = { lt: new Date() };
      where.status = { not: Status.COMPLETED };
    }

    // Build order by
    const orderBy: Prisma.TaskOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute queries in parallel
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: this.defaultInclude,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks: tasks as TaskWithRelations[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Create a new task
   * @param data - Task creation data
   * @returns Created task with relations
   */
  async create(data: {
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
    creatorId: string;
    assignedToId?: string | null;
  }): Promise<TaskWithRelations> {
    return prisma.task.create({
      data,
      include: this.defaultInclude,
    }) as Promise<TaskWithRelations>;
  }

  /**
   * Update an existing task
   * @param id - Task ID
   * @param data - Data to update
   * @returns Updated task with relations
   */
  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      dueDate: Date;
      priority: Priority;
      status: Status;
      assignedToId: string | null;
    }>
  ): Promise<TaskWithRelations> {
    return prisma.task.update({
      where: { id },
      data,
      include: this.defaultInclude,
    }) as Promise<TaskWithRelations>;
  }

  /**
   * Delete a task
   * @param id - Task ID
   * @returns Deleted task
   */
  async delete(id: string): Promise<Task> {
    // First delete related audit logs
    await prisma.auditLog.deleteMany({
      where: { taskId: id },
    });

    return prisma.task.delete({
      where: { id },
    });
  }

  /**
   * Get tasks assigned to a specific user
   * @param userId - User ID
   * @returns Array of tasks
   */
  async findByAssignee(userId: string): Promise<TaskWithRelations[]> {
    return prisma.task.findMany({
      where: { assignedToId: userId },
      include: this.defaultInclude,
      orderBy: { dueDate: 'asc' },
    }) as Promise<TaskWithRelations[]>;
  }

  /**
   * Get tasks created by a specific user
   * @param userId - User ID
   * @returns Array of tasks
   */
  async findByCreator(userId: string): Promise<TaskWithRelations[]> {
    return prisma.task.findMany({
      where: { creatorId: userId },
      include: this.defaultInclude,
      orderBy: { createdAt: 'desc' },
    }) as Promise<TaskWithRelations[]>;
  }

  /**
   * Get overdue tasks for a user
   * @param userId - User ID
   * @returns Array of overdue tasks
   */
  async findOverdue(userId: string): Promise<TaskWithRelations[]> {
    return prisma.task.findMany({
      where: {
        OR: [{ assignedToId: userId }, { creatorId: userId }],
        dueDate: { lt: new Date() },
        status: { not: Status.COMPLETED },
      },
      include: this.defaultInclude,
      orderBy: { dueDate: 'asc' },
    }) as Promise<TaskWithRelations[]>;
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
    const now = new Date();

    const [assigned, created, overdue, completed, inProgress] = await Promise.all([
      prisma.task.count({
        where: { assignedToId: userId },
      }),
      prisma.task.count({
        where: { creatorId: userId },
      }),
      prisma.task.count({
        where: {
          OR: [{ assignedToId: userId }, { creatorId: userId }],
          dueDate: { lt: now },
          status: { not: Status.COMPLETED },
        },
      }),
      prisma.task.count({
        where: {
          OR: [{ assignedToId: userId }, { creatorId: userId }],
          status: Status.COMPLETED,
        },
      }),
      prisma.task.count({
        where: {
          OR: [{ assignedToId: userId }, { creatorId: userId }],
          status: Status.IN_PROGRESS,
        },
      }),
    ]);

    return { assigned, created, overdue, completed, inProgress };
  }
}

export const taskRepository = new TaskRepository();
export default taskRepository;
