import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TTask } from '@types';

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Partial<TTask> & { user_id: number; project_id: number }) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error('Failed to add task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
