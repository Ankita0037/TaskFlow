import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { authService } from '../services';
import config from '../config';

/**
 * Connected users map
 * Maps user ID to socket ID(s)
 */
const connectedUsers = new Map<string, Set<string>>();

/**
 * Socket.io event handlers
 */
export class SocketHandler {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.frontendUrl,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  /**
   * Get the Socket.io server instance
   */
  getIO(): Server {
    return this.io;
  }

  /**
   * Setup authentication middleware
   */
  private setupMiddleware(): void {
    this.io.use(async (socket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decoded = authService.verifyToken(token);
        socket.data.user = decoded;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  /**
   * Setup event handlers for socket connections
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.user?.id;
      console.log(`🔌 User connected: ${userId} (socket: ${socket.id})`);

      if (userId) {
        // Add user to connected users map
        if (!connectedUsers.has(userId)) {
          connectedUsers.set(userId, new Set());
        }
        connectedUsers.get(userId)?.add(socket.id);

        // Join user's personal room for notifications
        socket.join(`user:${userId}`);

        // Broadcast user joined (optional)
        socket.broadcast.emit('user:joined', {
          userId,
          timestamp: new Date().toISOString(),
        });
      }

      // Handle task subscription (join task room)
      socket.on('task:subscribe', (taskId: string) => {
        socket.join(`task:${taskId}`);
        console.log(`📋 User ${userId} subscribed to task: ${taskId}`);
      });

      // Handle task unsubscription
      socket.on('task:unsubscribe', (taskId: string) => {
        socket.leave(`task:${taskId}`);
        console.log(`📋 User ${userId} unsubscribed from task: ${taskId}`);
      });

      // Handle typing indicator (optional feature)
      socket.on('task:typing', (data: { taskId: string; isTyping: boolean }) => {
        socket.to(`task:${data.taskId}`).emit('task:userTyping', {
          userId,
          userName: socket.data.user?.name,
          isTyping: data.isTyping,
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${userId} (socket: ${socket.id})`);

        if (userId) {
          // Remove socket from connected users
          const userSockets = connectedUsers.get(userId);
          if (userSockets) {
            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
              connectedUsers.delete(userId);
            }
          }

          // Broadcast user left (optional)
          socket.broadcast.emit('user:left', {
            userId,
            timestamp: new Date().toISOString(),
          });
        }
      });
    });
  }

  /**
   * Emit event to a specific user
   * @param userId - User ID to emit to
   * @param event - Event name
   * @param data - Event data
   */
  emitToUser(userId: string, event: string, data: unknown): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Emit event to all connected clients
   * @param event - Event name
   * @param data - Event data
   */
  broadcast(event: string, data: unknown): void {
    this.io.emit(event, data);
  }

  /**
   * Check if a user is currently connected
   * @param userId - User ID to check
   * @returns Boolean indicating connection status
   */
  isUserOnline(userId: string): boolean {
    return connectedUsers.has(userId) && connectedUsers.get(userId)!.size > 0;
  }

  /**
   * Get count of online users
   * @returns Number of online users
   */
  getOnlineUserCount(): number {
    return connectedUsers.size;
  }
}

let socketHandler: SocketHandler | null = null;

/**
 * Initialize Socket.io with HTTP server
 * @param httpServer - HTTP server instance
 * @returns SocketHandler instance
 */
export function initializeSocket(httpServer: HttpServer): SocketHandler {
  socketHandler = new SocketHandler(httpServer);
  return socketHandler;
}

/**
 * Get the socket handler instance
 * @returns SocketHandler instance or null if not initialized
 */
export function getSocketHandler(): SocketHandler | null {
  return socketHandler;
}

export { socketHandler };
