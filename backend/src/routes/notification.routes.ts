import { Router } from 'express';
import { notificationController } from '../controllers';
import { authenticate } from '../middleware';

const router = Router();

/**
 * @route   GET /api/v1/notifications
 * @desc    Get all notifications for current user
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  notificationController.getAll.bind(notificationController)
);

/**
 * @route   GET /api/v1/notifications/count
 * @desc    Get unread notification count
 * @access  Private
 */
router.get(
  '/count',
  authenticate,
  notificationController.getUnreadCount.bind(notificationController)
);

/**
 * @route   PUT /api/v1/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put(
  '/read-all',
  authenticate,
  notificationController.markAllAsRead.bind(notificationController)
);

/**
 * @route   PUT /api/v1/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put(
  '/:id/read',
  authenticate,
  notificationController.markAsRead.bind(notificationController)
);

export default router;
