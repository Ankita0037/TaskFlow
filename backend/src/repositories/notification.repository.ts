import prisma from '../config/database';
import { Notification } from '@prisma/client';

/**
 * Notification Repository
 * Handles all database operations related to notifications
 */
export class NotificationRepository {
  /**
   * Create a new notification
   * @param data - Notification creation data
   * @returns Created notification
   */
  async create(data: {
    message: string;
    type: string;
    userId: string;
    taskId?: string;
  }): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  /**
   * Get all notifications for a user
   * @param userId - User ID
   * @param unreadOnly - Only get unread notifications
   * @returns Array of notifications
   */
  async findByUser(
    userId: string,
    unreadOnly = false
  ): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 notifications
    });
  }

  /**
   * Mark a notification as read
   * @param id - Notification ID
   * @param userId - User ID (for security check)
   * @returns Updated notification
   */
  async markAsRead(id: string, userId: string): Promise<Notification | null> {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    }).then(() => prisma.notification.findUnique({ where: { id } }));
  }

  /**
   * Mark all notifications as read for a user
   * @param userId - User ID
   * @returns Count of updated notifications
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return result.count;
  }

  /**
   * Get unread notification count for a user
   * @param userId - User ID
   * @returns Unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  }

  /**
   * Delete old notifications (cleanup)
   * @param daysOld - Delete notifications older than this many days
   * @returns Count of deleted notifications
   */
  async deleteOld(daysOld = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        read: true,
      },
    });
    return result.count;
  }
}

export const notificationRepository = new NotificationRepository();
export default notificationRepository;
