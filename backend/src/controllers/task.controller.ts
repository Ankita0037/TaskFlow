import { Response } from 'express';
import { taskService } from '../services';
import { AuthenticatedRequest, TaskFilterParams } from '../types';

/**
 * Task Controller
 * Handles HTTP requests for task endpoints
 */
export class TaskController {
  /**
   * Create a new task
   * POST /api/v1/tasks
   */
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const task = await taskService.createTask(req.body, req.user.id);

      // Emit socket event (handled by socket handler)
      const io = req.app.get('io');
      if (io) {
        io.emit('task:created', task);
        
        // If assigned to someone, emit notification
        if (task.assignedToId && task.assignedToId !== req.user.id) {
          io.to(`user:${task.assignedToId}`).emit('notification:new', {
            type: 'TASK_ASSIGNED',
            message: `You have been assigned to task: "${task.title}"`,
            taskId: task.id,
          });
        }
      }

      res.status(201).json({
        success: true,
        data: { task },
        message: 'Task created successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get all tasks with filtering
   * GET /api/v1/tasks
   */
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const params: TaskFilterParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        status: req.query.status as any,
        priority: req.query.priority as any,
        assignedToId: req.query.assignedToId as string,
        creatorId: req.query.creatorId as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        overdue: req.query.overdue === 'true',
      };

      const result = await taskService.getTasks(params);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get tasks';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get a single task by ID
   * GET /api/v1/tasks/:id
   */
  async getOne(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const task = await taskService.getTask(req.params.id);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found',
        });
        return;
      }

      res.json({
        success: true,
        data: { task },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get task';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Update a task
   * PUT /api/v1/tasks/:id
   */
  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const { task, changes, assigneeChanged, newAssigneeId } =
        await taskService.updateTask(req.params.id, req.body, req.user.id);

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.emit('task:updated', { task, changes });

        // If assignee changed, emit notification to new assignee
        if (assigneeChanged && newAssigneeId && newAssigneeId !== req.user.id) {
          io.to(`user:${newAssigneeId}`).emit('notification:new', {
            type: 'TASK_ASSIGNED',
            message: `You have been assigned to task: "${task.title}"`,
            taskId: task.id,
          });
        }
      }

      res.json({
        success: true,
        data: { task },
        message: 'Task updated successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task';
      const status = message.includes('not found') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Delete a task
   * DELETE /api/v1/tasks/:id
   */
  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      await taskService.deleteTask(req.params.id, req.user.id);

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.emit('task:deleted', { taskId: req.params.id });
      }

      res.json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      const status = message.includes('not found')
        ? 404
        : message.includes('creator')
        ? 403
        : 400;
      res.status(status).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get dashboard data
   * GET /api/v1/tasks/dashboard
   */
  async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const [stats, assigned, created, overdue] = await Promise.all([
        taskService.getDashboardStats(req.user.id),
        taskService.getAssignedTasks(req.user.id),
        taskService.getCreatedTasks(req.user.id),
        taskService.getOverdueTasks(req.user.id),
      ]);

      res.json({
        success: true,
        data: {
          stats,
          assigned,
          created,
          overdue,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get dashboard';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get audit logs for a task
   * GET /api/v1/tasks/:id/audit
   */
  async getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const logs = await taskService.getTaskAuditLogs(req.params.id);

      res.json({
        success: true,
        data: { logs },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get audit logs';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}

export const taskController = new TaskController();
export default taskController;
