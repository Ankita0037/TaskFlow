import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';
import notificationRoutes from './notification.routes';

const router = Router();

/**
 * API Routes
 * Base path: /api/v1
 */

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/notifications', notificationRoutes);

export default router;
