import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { userRepository } from '../repositories';
import { RegisterInput, LoginInput, UpdateProfileInput } from '../dtos';
import { JWTPayload, UserResponse } from '../types';
import config from '../config';

/**
 * Authentication Service
 * Handles user authentication, registration, and profile management
 */
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  /**
   * Register a new user
   * @param data - Registration data
   * @returns Created user (without password) and JWT token
   * @throws Error if email already exists
   */
  async register(data: RegisterInput): Promise<{
    user: UserResponse;
    token: string;
  }> {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Authenticate a user
   * @param data - Login credentials
   * @returns User (without password) and JWT token
   * @throws Error if credentials are invalid
   */
  async login(data: LoginInput): Promise<{
    user: UserResponse;
    token: string;
  }> {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Get user profile by ID
   * @param userId - User ID
   * @returns User profile
   * @throws Error if user not found
   */
  async getProfile(userId: string): Promise<UserResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param data - Profile update data
   * @returns Updated user profile
   * @throws Error if user not found or email taken
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<UserResponse> {
    // Check if email is taken (if updating email)
    if (data.email) {
      const isTaken = await userRepository.isEmailTaken(data.email, userId);
      if (isTaken) {
        throw new Error('Email already in use');
      }
    }

    const user = await userRepository.update(userId, data);
    return this.sanitizeUser(user);
  }

  /**
   * Change user password
   * @param userId - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @throws Error if current password is incorrect
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await userRepository.update(userId, { password: hashedPassword });
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token
   * @returns Decoded payload
   * @throws Error if token is invalid
   */
  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get all users (for task assignment)
   * @returns Array of users
   */
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await userRepository.findAll();
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  }

  /**
   * Generate JWT token for user
   * @param user - User object
   * @returns JWT token
   */
  private generateToken(user: User): string {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Remove sensitive data from user object
   * @param user - User with password
   * @returns User without password
   */
  private sanitizeUser(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export const authService = new AuthService();
export default authService;
