import { Router } from 'express';
import { authController } from '../controllers';
import { authenticate, validateBody } from '../middleware';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from '../dtos';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validateBody(RegisterDto),
  authController.register.bind(authController)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validateBody(LoginDto),
  authController.login.bind(authController)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getProfile.bind(authController));

/**
 * @route   PUT /api/v1/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/me',
  authenticate,
  validateBody(UpdateProfileDto),
  authController.updateProfile.bind(authController)
);

/**
 * @route   PUT /api/v1/auth/password
 * @desc    Change password
 * @access  Private
 */
router.put(
  '/password',
  authenticate,
  validateBody(ChangePasswordDto),
  authController.changePassword.bind(authController)
);

/**
 * @route   GET /api/v1/auth/users
 * @desc    Get all users (for task assignment)
 * @access  Private
 */
router.get('/users', authenticate, authController.getAllUsers.bind(authController));

export default router;
