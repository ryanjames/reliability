import { useDeleteTask } from '@hooks/useDeleteTask';
import { useAddTask } from '@hooks/useAddTask';
import { useUpdateTask } from '@hooks/useUpdateTask';
import type { TTask } from '@types';
import { useState } from 'react';

export function useTaskHandlers(
  userId: number,
  inboxProjectId: number | null,
  selectedProjectId: number | null,
  options?: {
    setAdding?: (adding: boolean) => void;
  },
) {
  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [editingTask, setEditingTask] = useState<TTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TTask | null>(null);

  const handleSubmitTask = (data: Partial<TTask>) => {
    if (!userId || selectedProjectId == null) return;

    const payload = {
      ...data,
      user_id: userId,
      project_id: data.project_id ?? inboxProjectId ?? selectedProjectId,
    };

    if (editingTask?.id) {
      updateTask.mutate(
        { id: editingTask.id, ...payload },
        {
          onSuccess: () => {
            setEditingTask(null);
          },
        },
      );
    } else {
      addTask.mutate(payload, {
        onSuccess: () => {
          setEditingTask(null);
          options?.setAdding?.(false); // ✅ Close the form
        },
      });
    }
  };

  const handleReorderTask = (task: Pick<TTask, 'id' | 'sort_order'>) => {
    updateTask.mutate(task);
  };

  const handleDeleteTask = (task: TTask) => {
    setTaskToDelete(task);
  };

  return {
    handleSubmitTask,
    handleReorderTask,
    handleDeleteTask,
    editingTask,
    setEditingTask,
    taskToDelete,
    setTaskToDelete,
    deleteTask,
  };
}
