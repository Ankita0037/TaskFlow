import useSWR, { mutate } from 'swr';
import { useEffect, useCallback } from 'react';
import { notificationApi } from '../lib/api';
import { Notification } from '../types';

/**
 * Hook for fetching notifications
 */
export function useNotifications(unreadOnly = false) {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    ['notifications', unreadOnly],
    async () => {
      const response = await notificationApi.getAll(unreadOnly);
      return response.data.data.notifications as Notification[];
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = () => revalidate();

    window.addEventListener('notification:new', handleNewNotification);

    return () => {
      window.removeEventListener('notification:new', handleNewNotification);
    };
  }, [revalidate]);

  return {
    notifications: data || [],
    isLoading,
    isError: error,
    mutate: revalidate,
  };
}

/**
 * Hook for unread notification count
 */
export function useUnreadCount() {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    'notifications-count',
    async () => {
      const response = await notificationApi.getUnreadCount();
      return response.data.data.count as number;
    },
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = () => revalidate();

    window.addEventListener('notification:new', handleNewNotification);

    return () => {
      window.removeEventListener('notification:new', handleNewNotification);
    };
  }, [revalidate]);

  return {
    count: data || 0,
    isLoading,
    isError: error,
    mutate: revalidate,
  };
}

/**
 * Notification mutation helpers
 */
export function useNotificationMutations() {
  const markAsRead = useCallback(async (notificationId: string) => {
    await notificationApi.markAsRead(notificationId);
    // Revalidate notifications
    mutate((key) => Array.isArray(key) && key[0] === 'notifications', undefined, { revalidate: true });
    mutate('notifications-count', undefined, { revalidate: true });
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationApi.markAllAsRead();
    // Revalidate notifications
    mutate((key) => Array.isArray(key) && key[0] === 'notifications', undefined, { revalidate: true });
    mutate('notifications-count', 0, false);
  }, []);

  return {
    markAsRead,
    markAllAsRead,
  };
}
