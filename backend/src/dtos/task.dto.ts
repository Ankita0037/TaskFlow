import { z } from 'zod';
import { Priority, Status } from '@prisma/client';

/**
 * Create Task DTO - validates task creation input
 */
export const CreateTaskDto = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be less than 5000 characters'),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .transform((val) => new Date(val)),
  priority: z
    .nativeEnum(Priority)
    .default(Priority.MEDIUM),
  status: z
    .nativeEnum(Status)
    .default(Status.TODO),
  assignedToId: z
    .string()
    .optional()
    .nullable(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;

/**
 * Update Task DTO - validates task update input
 */
export const UpdateTaskDto = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be less than 5000 characters')
    .optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
    .transform((val) => new Date(val))
    .optional(),
  priority: z
    .nativeEnum(Priority)
    .optional(),
  status: z
    .nativeEnum(Status)
    .optional(),
  assignedToId: z
    .string()
    .optional()
    .nullable(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;

/**
 * Task Query DTO - validates task query/filter parameters
 */
export const TaskQueryDto = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).default(1))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100).default(10))
    .optional(),
  status: z
    .nativeEnum(Status)
    .optional(),
  priority: z
    .nativeEnum(Priority)
    .optional(),
  assignedToId: z
    .string()
    .optional(),
  creatorId: z
    .string()
    .optional(),
  sortBy: z
    .enum(['dueDate', 'createdAt', 'priority', 'status'])
    .default('createdAt')
    .optional(),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc')
    .optional(),
  overdue: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

export type TaskQueryInput = z.infer<typeof TaskQueryDto>;

/**
 * Task ID Parameter DTO
 */
export const TaskIdDto = z.object({
  id: z
    .string()
    .min(1, 'Task ID is required'),
});

export type TaskIdInput = z.infer<typeof TaskIdDto>;
