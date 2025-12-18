import dotenv from 'dotenv';

dotenv.config();

/**
 * Application configuration object
 * Centralizes all environment variables and configuration settings
 */
export const config = {
  /** Server port number */
  port: parseInt(process.env.PORT || '5000', 10),
  
  /** Current environment (development, production, test) */
  nodeEnv: process.env.NODE_ENV || 'development',
  
  /** Database connection URL */
  databaseUrl: process.env.DATABASE_URL || '',
  
  /** JWT configuration */
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  /** Frontend URL for CORS */
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  /** Check if running in production */
  isProduction: process.env.NODE_ENV === 'production',
  
  /** Check if running in development */
  isDevelopment: process.env.NODE_ENV === 'development',
  
  /** Check if running in test */
  isTest: process.env.NODE_ENV === 'test',
};

export default config;
