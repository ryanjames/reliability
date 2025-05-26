import { useDeleteTask } from '@hooks/useDeleteTask';
import { useAddTask } from '@hooks/useAddTask';
import { useUpdateTask } from '@hooks/useUpdateTask';
import type { TTask } from '@types';
import { useState } from 'react';
import { toast } from 'sonner';

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
            toast.success(`Task "${payload.title}" updated`);
            setEditingTask(null);
          },
        },
      );
    } else {
      addTask.mutate(payload, {
        onSuccess: () => {
          toast.success(`Task "${payload.title}" created`);
          setEditingTask(null);
          options?.setAdding?.(false);
        },
      });
    }
  };

  const handleReorderTask = (task: Pick<TTask, 'id' | 'sort_order'>) => {
    updateTask.mutate(task, {
      onSuccess: () => {
        toast.success('Task order updated');
      },
    });
  };

  const handleDeleteTask = (task: TTask) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;

    deleteTask.mutate(
      { id: taskToDelete.id },
      {
        onSuccess: () => {
          toast.success(`Task "${taskToDelete.title}" deleted`);
          setTaskToDelete(null);
        },
      },
    );
  };

  const handleToggleComplete = (task: TTask, complete: boolean) => {
    updateTask.mutate(
      {
        id: task.id,
        complete,
      },
      {
        onSuccess: () => {
          toast.success(`Task "${task.title}" marked as ${complete ? 'complete' : 'incomplete'}`);
        },
      },
    );
  };

  return {
    handleSubmitTask,
    handleReorderTask,
    handleDeleteTask,
    confirmDeleteTask,
    editingTask,
    setEditingTask,
    taskToDelete,
    setTaskToDelete,
    deleteTask, // optional now, for more direct access if needed
    handleToggleComplete,
  };
}
