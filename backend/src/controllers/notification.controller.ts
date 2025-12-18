import { Response } from 'express';
import { notificationService } from '../services';
import { AuthenticatedRequest } from '../types';

/**
 * Notification Controller
 * Handles HTTP requests for notification endpoints
 */
export class NotificationController {
  /**
   * Get all notifications for current user
   * GET /api/v1/notifications
   */
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const unreadOnly = req.query.unread === 'true';
      const notifications = await notificationService.getNotifications(
        req.user.id,
        unreadOnly
      );

      res.json({
        success: true,
        data: { notifications },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get notifications';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get unread notification count
   * GET /api/v1/notifications/count
   */
  async getUnreadCount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const count = await notificationService.getUnreadCount(req.user.id);

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get count';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Mark a notification as read
   * PUT /api/v1/notifications/:id/read
   */
  async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const notification = await notificationService.markAsRead(
        req.params.id,
        req.user.id
      );

      if (!notification) {
        res.status(404).json({
          success: false,
          error: 'Notification not found',
        });
        return;
      }

      res.json({
        success: true,
        data: { notification },
        message: 'Notification marked as read',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark as read';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Mark all notifications as read
   * PUT /api/v1/notifications/read-all
   */
  async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const count = await notificationService.markAllAsRead(req.user.id);

      res.json({
        success: true,
        data: { count },
        message: `${count} notifications marked as read`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark all as read';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}

export const notificationController = new NotificationController();
export default notificationController;
