import prisma from '../config/database';
import { AuditLog } from '@prisma/client';

/**
 * Audit Log Repository
 * Handles all database operations related to audit logs (bonus feature)
 */
export class AuditLogRepository {
  /**
   * Create a new audit log entry
   * @param data - Audit log creation data
   * @returns Created audit log
   */
  async create(data: {
    action: string;
    field?: string;
    oldValue?: string;
    newValue?: string;
    taskId: string;
    userId: string;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data,
    });
  }

  /**
   * Get all audit logs for a task
   * @param taskId - Task ID
   * @returns Array of audit logs with user info
   */
  async findByTask(taskId: string): Promise<(AuditLog & { user: { name: string; email: string } })[]> {
    return prisma.auditLog.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get recent audit logs for a user's tasks
   * @param userId - User ID
   * @param limit - Maximum number of logs to return
   * @returns Array of audit logs
   */
  async findRecentByUser(userId: string, limit = 20): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: {
        OR: [
          { userId },
          { task: { creatorId: userId } },
          { task: { assignedToId: userId } },
        ],
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const auditLogRepository = new AuditLogRepository();
export default auditLogRepository;
