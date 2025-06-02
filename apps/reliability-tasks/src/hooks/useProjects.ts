import { useQuery } from '@tanstack/react-query';
import type { TProject } from '@reliability-ui';

export function useProjects(userId: number, options?: { enabled?: boolean }) {
  return useQuery<TProject[]>({
    queryKey: ['projects', userId],
    queryFn: async () => {
      const res = await fetch(`/api/projects?user_id=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    enabled: options?.enabled,
  });
}
