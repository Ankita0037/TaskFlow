import { RegisterDto, LoginDto, CreateTaskDto, UpdateTaskDto } from '../../dtos';
import { Priority, Status } from '@prisma/client';

/**
 * Unit Tests for DTO Validation
 * Tests Zod schema validation for input data
 */

describe('DTO Validation', () => {
  describe('RegisterDto', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      };

      const result = RegisterDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123',
        name: 'Test User',
      };

      const result = RegisterDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
      };

      const result = RegisterDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = RegisterDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'A',
      };

      const result = RegisterDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('LoginDto', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = LoginDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const invalidData = {
        email: '',
        password: 'anypassword',
      };

      const result = LoginDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = LoginDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('CreateTaskDto', () => {
    it('should validate correct task creation data', () => {
      const validData = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2025-12-31T00:00:00.000Z',
        priority: 'HIGH',
        status: 'TODO',
      };

      const result = CreateTaskDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject title exceeding 100 characters', () => {
      const invalidData = {
        title: 'A'.repeat(101),
        description: 'This is a test task',
        dueDate: '2025-12-31T00:00:00.000Z',
        priority: 'HIGH',
        status: 'TODO',
      };

      const result = CreateTaskDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const invalidData = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: 'not-a-date',
        priority: 'HIGH',
        status: 'TODO',
      };

      const result = CreateTaskDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid priority value', () => {
      const invalidData = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2025-12-31T00:00:00.000Z',
        priority: 'INVALID',
        status: 'TODO',
      };

      const result = CreateTaskDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept optional assignedToId', () => {
      const validData = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2025-12-31T00:00:00.000Z',
        priority: 'MEDIUM',
        status: 'TODO',
        assignedToId: 'user-id-123',
      };

      const result = CreateTaskDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should use default values when not provided', () => {
      const minimalData = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: '2025-12-31T00:00:00.000Z',
      };

      const result = CreateTaskDto.safeParse(minimalData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe(Priority.MEDIUM);
        expect(result.data.status).toBe(Status.TODO);
      }
    });
  });

  describe('UpdateTaskDto', () => {
    it('should validate partial update data', () => {
      const validData = {
        status: 'IN_PROGRESS',
      };

      const result = UpdateTaskDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate complete update data', () => {
      const validData = {
        title: 'Updated Task',
        description: 'Updated description',
        dueDate: '2025-12-31T00:00:00.000Z',
        priority: 'URGENT',
        status: 'REVIEW',
        assignedToId: 'new-user-id',
      };

      const result = UpdateTaskDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should allow null assignedToId to unassign task', () => {
      const validData = {
        assignedToId: null,
      };

      const result = UpdateTaskDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate empty object (no updates)', () => {
      const validData = {};

      const result = UpdateTaskDto.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
