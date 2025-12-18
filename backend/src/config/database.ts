import { PrismaClient } from '@prisma/client';
import config from './index';

/**
 * Prisma client singleton instance
 * Ensures only one connection to the database throughout the application
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.isDevelopment ? ['query', 'info', 'warn', 'error'] : ['error'],
  });

if (!config.isProduction) {
  globalForPrisma.prisma = prisma;
}

/**
 * Connect to the database
 * @returns Promise that resolves when connected
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

/**
 * Disconnect from the database
 * @returns Promise that resolves when disconnected
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('📤 Database disconnected');
}

export default prisma;
