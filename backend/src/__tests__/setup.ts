/**
 * Jest Test Setup
 * Runs before all tests
 */

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DATABASE_URL = 'mongodb://localhost:27017/taskmanager_test';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Global test timeout
jest.setTimeout(10000);

// Clean up after all tests
afterAll(async () => {
  // Add cleanup logic if needed
});
