import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TProject } from '@reliability-ui';

export function useAddProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Omit<TProject, 'id'>) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error('Failed to add project');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
