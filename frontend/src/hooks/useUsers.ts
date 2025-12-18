import useSWR from 'swr';
import { authApi } from '../lib/api';
import { User } from '../types';

/**
 * Hook for fetching all users (for task assignment)
 */
export function useUsers() {
  const { data, error, isLoading } = useSWR(
    'users',
    async () => {
      const response = await authApi.getUsers();
      return response.data.data.users as User[];
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    users: data || [],
    isLoading,
    isError: error,
  };
}
