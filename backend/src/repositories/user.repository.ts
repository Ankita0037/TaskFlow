import prisma from '../config/database';
import { User } from '@prisma/client';

/**
 * User Repository
 * Handles all database operations related to users
 */
export class UserRepository {
  /**
   * Find a user by their email address
   * @param email - User's email address
   * @returns User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by their ID
   * @param id - User's ID
   * @returns User or null if not found
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   * @param data - User creation data
   * @returns Created user
   */
  async create(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update a user's profile
   * @param id - User's ID
   * @param data - Data to update
   * @returns Updated user
   */
  async update(
    id: string,
    data: Partial<{ email: string; name: string; password: string }>
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Get all users (for task assignment dropdown)
   * @returns Array of users without passwords
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Check if email is already taken by another user
   * @param email - Email to check
   * @param excludeUserId - User ID to exclude from check
   * @returns Boolean indicating if email is taken
   */
  async isEmailTaken(email: string, excludeUserId?: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        NOT: excludeUserId ? { id: excludeUserId } : undefined,
      },
    });
    return !!user;
  }
}

export const userRepository = new UserRepository();
export default userRepository;
