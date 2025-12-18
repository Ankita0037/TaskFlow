import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  subscribeToTask: (taskId: string) => void;
  unsubscribeFromTask: (taskId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Handle real-time task updates
    newSocket.on('task:created', (task) => {
      console.log('📋 Task created:', task);
      // Trigger SWR revalidation via custom event
      window.dispatchEvent(new CustomEvent('task:created', { detail: task }));
    });

    newSocket.on('task:updated', (data) => {
      console.log('📋 Task updated:', data);
      window.dispatchEvent(new CustomEvent('task:updated', { detail: data }));
    });

    newSocket.on('task:deleted', (data) => {
      console.log('📋 Task deleted:', data);
      window.dispatchEvent(new CustomEvent('task:deleted', { detail: data }));
    });

    // Handle notifications
    newSocket.on('notification:new', (notification) => {
      console.log('🔔 New notification:', notification);
      toast.success(notification.message, {
        duration: 5000,
        icon: '🔔',
      });
      window.dispatchEvent(new CustomEvent('notification:new', { detail: notification }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  // Subscribe to task updates
  const subscribeToTask = useCallback((taskId: string) => {
    if (socket && isConnected) {
      socket.emit('task:subscribe', taskId);
    }
  }, [socket, isConnected]);

  // Unsubscribe from task updates
  const unsubscribeFromTask = useCallback((taskId: string) => {
    if (socket && isConnected) {
      socket.emit('task:unsubscribe', taskId);
    }
  }, [socket, isConnected]);

  const value: SocketContextType = {
    socket,
    isConnected,
    subscribeToTask,
    unsubscribeFromTask,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;
