import { TaskService } from '../../services/task.service';
import { Priority, Status } from '@prisma/client';

/**
 * Unit Tests for Task Service
 * Tests critical business logic for task management
 */

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
  });

  describe('validateTaskCreation', () => {
    /**
     * Test 1: Valid task data should pass validation
     */
    it('should validate a task with all required fields', () => {
      const validTask = {
        title: 'Test Task',
        description: 'This is a test task description',
        dueDate: new Date('2025-12-31'),
        priority: Priority.HIGH,
        status: Status.TODO,
      };

      const result = taskService.validateTaskCreation(validTask);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    /**
     * Test 2: Missing title should fail validation
     */
    it('should fail validation when title is missing', () => {
      const invalidTask = {
        title: '',
        description: 'This is a test task description',
        dueDate: new Date('2025-12-31'),
        priority: Priority.MEDIUM,
        status: Status.TODO,
      };

      const result = taskService.validateTaskCreation(invalidTask);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    /**
     * Test 3: Title exceeding max length should fail validation
     */
    it('should fail validation when title exceeds 100 characters', () => {
      const longTitle = 'A'.repeat(101);
      const invalidTask = {
        title: longTitle,
        description: 'This is a test task description',
        dueDate: new Date('2025-12-31'),
        priority: Priority.LOW,
        status: Status.TODO,
      };

      const result = taskService.validateTaskCreation(invalidTask);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title must be less than 100 characters');
    });

    /**
     * Test 4: Missing description should fail validation
     */
    it('should fail validation when description is missing', () => {
      const invalidTask = {
        title: 'Test Task',
        description: '',
        dueDate: new Date('2025-12-31'),
        priority: Priority.URGENT,
        status: Status.IN_PROGRESS,
      };

      const result = taskService.validateTaskCreation(invalidTask);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is required');
    });

    /**
     * Test 5: Valid task with default values should pass
     */
    it('should validate a task with minimum required fields', () => {
      const minimalTask = {
        title: 'Minimal Task',
        description: 'Minimal description',
        dueDate: new Date('2025-06-15'),
        priority: Priority.MEDIUM,
        status: Status.TODO,
      };

      const result = taskService.validateTaskCreation(minimalTask);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    /**
     * Test 6: Multiple validation errors should be reported
     */
    it('should report multiple validation errors', () => {
      const invalidTask = {
        title: '',
        description: '',
        dueDate: null as any,
        priority: Priority.HIGH,
        status: Status.TODO,
      };

      const result = taskService.validateTaskCreation(invalidTask);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(result.errors).toContain('Title is required');
      expect(result.errors).toContain('Description is required');
    });

    /**
     * Test 7: Whitespace-only title should fail validation
     */
    it('should fail validation when title is whitespace only', () => {
      const invalidTask = {
        title: '   ',
        description: 'Valid description',
        dueDate: new Date('2025-12-31'),
        priority: Priority.MEDIUM,
        status: Status.TODO,
      };

      const result = taskService.validateTaskCreation(invalidTask);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required');
    });

    /**
     * Test 8: All priority values should be valid
     */
    it('should accept all valid priority values', () => {
      const priorities = [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT];

      priorities.forEach((priority) => {
        const task = {
          title: 'Test Task',
          description: 'Test description',
          dueDate: new Date('2025-12-31'),
          priority,
          status: Status.TODO,
        };

        const result = taskService.validateTaskCreation(task);
        expect(result.isValid).toBe(true);
      });
    });

    /**
     * Test 9: All status values should be valid
     */
    it('should accept all valid status values', () => {
      const statuses = [Status.TODO, Status.IN_PROGRESS, Status.REVIEW, Status.COMPLETED];

      statuses.forEach((status) => {
        const task = {
          title: 'Test Task',
          description: 'Test description',
          dueDate: new Date('2025-12-31'),
          priority: Priority.MEDIUM,
          status,
        };

        const result = taskService.validateTaskCreation(task);
        expect(result.isValid).toBe(true);
      });
    });
  });
});
