import useSWR, { mutate } from 'swr';
import { useEffect, useCallback } from 'react';
import { taskApi } from '../lib/api';
import { Task, TaskFilters, PaginatedResponse, DashboardData } from '../types';

/**
 * Fetcher function for tasks
 */
const tasksFetcher = async (_key: string, params?: TaskFilters) => {
  const queryParams: Record<string, string | number | boolean> = {};
  if (params?.status) queryParams.status = params.status;
  if (params?.priority) queryParams.priority = params.priority;
  if (params?.sortBy) queryParams.sortBy = params.sortBy;
  if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  const response = await taskApi.getAll(queryParams);
  return response.data.data as PaginatedResponse<Task>;
};

/**
 * Hook for fetching tasks with filtering and pagination
 */
export function useTasks(filters?: TaskFilters) {
  const key = ['tasks', JSON.stringify(filters)];
  
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    key,
    () => tasksFetcher('/tasks', filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  // Listen for real-time updates
  useEffect(() => {
    const handleTaskCreated = () => revalidate();
    const handleTaskUpdated = () => revalidate();
    const handleTaskDeleted = () => revalidate();

    window.addEventListener('task:created', handleTaskCreated);
    window.addEventListener('task:updated', handleTaskUpdated);
    window.addEventListener('task:deleted', handleTaskDeleted);

    return () => {
      window.removeEventListener('task:created', handleTaskCreated);
      window.removeEventListener('task:updated', handleTaskUpdated);
      window.removeEventListener('task:deleted', handleTaskDeleted);
    };
  }, [revalidate]);

  return {
    tasks: data?.tasks || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError: error,
    mutate: revalidate,
  };
}

/**
 * Hook for fetching a single task
 */
export function useTask(taskId: string | null) {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    taskId ? ['task', taskId] : null,
    async () => {
      const response = await taskApi.getOne(taskId!);
      return response.data.data.task as Task;
    },
    {
      revalidateOnFocus: false,
    }
  );

  // Listen for real-time updates
  useEffect(() => {
    if (!taskId) return;

    const handleTaskUpdated = (event: CustomEvent) => {
      if (event.detail?.task?.id === taskId) {
        revalidate();
      }
    };

    window.addEventListener('task:updated', handleTaskUpdated as EventListener);

    return () => {
      window.removeEventListener('task:updated', handleTaskUpdated as EventListener);
    };
  }, [taskId, revalidate]);

  return {
    task: data,
    isLoading,
    isError: error,
    mutate: revalidate,
  };
}

/**
 * Hook for fetching dashboard data
 */
export function useDashboard() {
  const { data, error, isLoading, mutate: revalidate } = useSWR(
    'dashboard',
    async () => {
      const response = await taskApi.getDashboard();
      return response.data.data as DashboardData;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
    }
  );

  // Listen for real-time updates
  useEffect(() => {
    const handleUpdate = () => revalidate();

    window.addEventListener('task:created', handleUpdate);
    window.addEventListener('task:updated', handleUpdate);
    window.addEventListener('task:deleted', handleUpdate);

    return () => {
      window.removeEventListener('task:created', handleUpdate);
      window.removeEventListener('task:updated', handleUpdate);
      window.removeEventListener('task:deleted', handleUpdate);
    };
  }, [revalidate]);

  return {
    dashboard: data,
    stats: data?.stats,
    assignedTasks: data?.assigned || [],
    createdTasks: data?.created || [],
    overdueTasks: data?.overdue || [],
    isLoading,
    isError: error,
    mutate: revalidate,
  };
}

/**
 * Task mutation helpers with optimistic updates
 */
export function useTaskMutations() {
  const createTask = useCallback(async (taskData: Parameters<typeof taskApi.create>[0]) => {
    const response = await taskApi.create(taskData);
    // Revalidate all task-related caches
    mutate((key) => Array.isArray(key) && key[0] === 'tasks', undefined, { revalidate: true });
    mutate('dashboard', undefined, { revalidate: true });
    return response.data.data.task as Task;
  }, []);

  const updateTask = useCallback(async (taskId: string, taskData: Parameters<typeof taskApi.update>[1]) => {
    // Optimistic update
    mutate(
      ['task', taskId],
      (current: Task | undefined) => {
        if (!current) return current;
        return { ...current, ...taskData } as Task;
      },
      false
    );

    try {
      const response = await taskApi.update(taskId, taskData);
      // Revalidate all task-related caches
      mutate((key) => Array.isArray(key) && key[0] === 'tasks', undefined, { revalidate: true });
      mutate('dashboard', undefined, { revalidate: true });
      return response.data.data.task as Task;
    } catch (error) {
      // Revert optimistic update on error
      mutate(['task', taskId]);
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    await taskApi.delete(taskId);
    // Revalidate all task-related caches
    mutate((key) => Array.isArray(key) && key[0] === 'tasks', undefined, { revalidate: true });
    mutate('dashboard', undefined, { revalidate: true });
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
  };
}
