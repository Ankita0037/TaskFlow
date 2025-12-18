import { notificationRepository } from '../repositories';
import { NotificationResponse } from '../types';

/**
 * Notification Service
 * Handles business logic for notifications
 */
export class NotificationService {
  /**
   * Get all notifications for a user
   * @param userId - User ID
   * @param unreadOnly - Only get unread notifications
   * @returns Array of notifications
   */
  async getNotifications(
    userId: string,
    unreadOnly = false
  ): Promise<NotificationResponse[]> {
    const notifications = await notificationRepository.findByUser(
      userId,
      unreadOnly
    );
    return notifications.map((n) => ({
      id: n.id,
      message: n.message,
      type: n.type,
      read: n.read,
      createdAt: n.createdAt,
      userId: n.userId,
      taskId: n.taskId,
    }));
  }

  /**
   * Mark a notification as read
   * @param notificationId - Notification ID
   * @param userId - User ID
   * @returns Updated notification
   */
  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<NotificationResponse | null> {
    const notification = await notificationRepository.markAsRead(
      notificationId,
      userId
    );
    if (!notification) return null;
    
    return {
      id: notification.id,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
      userId: notification.userId,
      taskId: notification.taskId,
    };
  }

  /**
   * Mark all notifications as read for a user
   * @param userId - User ID
   * @returns Count of updated notifications
   */
  async markAllAsRead(userId: string): Promise<number> {
    return notificationRepository.markAllAsRead(userId);
  }

  /**
   * Get unread notification count for a user
   * @param userId - User ID
   * @returns Unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.getUnreadCount(userId);
  }

  /**
   * Create a notification
   * @param data - Notification data
   * @returns Created notification
   */
  async createNotification(data: {
    message: string;
    type: string;
    userId: string;
    taskId?: string;
  }): Promise<NotificationResponse> {
    const notification = await notificationRepository.create(data);
    return {
      id: notification.id,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
      userId: notification.userId,
      taskId: notification.taskId,
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
