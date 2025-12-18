import { Router } from 'express';
import { taskController } from '../controllers';
import { authenticate, validateBody, validateParams } from '../middleware';
import { CreateTaskDto, UpdateTaskDto, TaskIdDto } from '../dtos';

const router = Router();

/**
 * @route   GET /api/v1/tasks/dashboard
 * @desc    Get dashboard data for current user
 * @access  Private
 */
router.get(
  '/dashboard',
  authenticate,
  taskController.getDashboard.bind(taskController)
);

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validateBody(CreateTaskDto),
  taskController.create.bind(taskController)
);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks with filtering and pagination
 * @access  Private
 */
router.get('/', authenticate, taskController.getAll.bind(taskController));

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  validateParams(TaskIdDto),
  taskController.getOne.bind(taskController)
);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  validateParams(TaskIdDto),
  validateBody(UpdateTaskDto),
  taskController.update.bind(taskController)
);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete(
  '/:id',
  authenticate,
  validateParams(TaskIdDto),
  taskController.delete.bind(taskController)
);

/**
 * @route   GET /api/v1/tasks/:id/audit
 * @desc    Get audit logs for a task
 * @access  Private
 */
router.get(
  '/:id/audit',
  authenticate,
  validateParams(TaskIdDto),
  taskController.getAuditLogs.bind(taskController)
);

export default router;
