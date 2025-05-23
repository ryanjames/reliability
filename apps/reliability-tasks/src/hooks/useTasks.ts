import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@store/useAuthStore';
import type { TTask } from '@types';

export function useTasks() {
  const user = useAuthStore(state => state.user);

  return useQuery<TTask[]>({
    queryKey: ['tasks', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await fetch(`/api/tasks?userId=${user!.id}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });
}
