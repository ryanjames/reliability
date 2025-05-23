// hooks/useTasks.ts
import { useQuery } from '@tanstack/react-query';
import type { TTask } from '@types';

export function useTasks() {
  return useQuery<TTask[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });
}
