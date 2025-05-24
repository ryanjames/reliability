import { useState, useEffect, useMemo } from 'react';
import AuthForm from './components/AuthForm';
import { useAuthStore } from '@store/useAuthStore';
import { useTasks } from '@hooks/useTasks';
import { useAddTask } from '@hooks/useAddTask';
import { useUpdateTask } from '@hooks/useUpdateTask';
import { useProjects } from '@hooks/useProjects';
import { useDeleteTask } from '@hooks/useDeleteTask';
import { toast } from 'sonner';
import { Dialog } from '@reliability-ui';
import TaskForm from './components/TaskForm';
import type { TTask } from '@types';

import ProjectsList from './components/ProjectsList';
import TasksList from './components/TasksList';

export default function App() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const userId = user?.id ?? 0;
  const { data: projects } = useProjects(userId, { enabled: !!user?.id });
  const { data: tasks, isLoading, error } = useTasks();

  const queryParams = new URLSearchParams(window.location.search);
  const projectParam = queryParams.get('project');

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    projectParam !== null && !Number.isNaN(Number(projectParam)) ? Number(projectParam) : null,
  );

  const [adding, setAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<TTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TTask | null>(null);
  const [open, setOpen] = useState(false);

  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const inboxProjectId = useMemo(() => {
    return projects?.find(p => p.user_id === user?.id && p.is_inbox === 1)?.id ?? null;
  }, [projects, user?.id]);

  const handleLogout = () => {
    if (user) toast(`Logged out ${user.name} (${user.email})`);
    logout();
  };

  const handleDelete = (task: TTask) => {
    setTaskToDelete(task);
    setOpen(true);
  };

  const confirm = () => {
    if (taskToDelete) {
      deleteTask.mutate({ id: taskToDelete.id });
      setTaskToDelete(null);
    }
  };

  const handleSubmitTask = (data: Partial<TTask>) => {
    if (!user || selectedProjectId == null) return;

    const payload = {
      ...data,
      user_id: user.id,
      project_id: data.project_id ?? inboxProjectId ?? selectedProjectId,
    };

    if (editingTask?.id) {
      updateTask.mutate({ id: editingTask.id, ...payload });
      setEditingTask(null);
    } else {
      addTask.mutate(payload);
      setAdding(false);
    }
  };

  const handleCancel = () => {
    setAdding(false);
    setEditingTask(null);
  };

  const handleReorderTask = (task: Pick<TTask, 'id' | 'sort_order'>) => {
    updateTask.mutate(task);
  };

  const handleSelectProject = (projectId: number) => {
    setSelectedProjectId(projectId);
    const isInbox = projects?.find(p => p.id === projectId)?.is_inbox === 1;
    const url = isInbox ? '/' : `/?project=${projectId}`;
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    if (inboxProjectId && selectedProjectId === null) {
      setSelectedProjectId(inboxProjectId);
    }
  }, [inboxProjectId, selectedProjectId]);

  const filteredTasks = tasks?.filter(task => task.project_id === selectedProjectId);

  if (!user) return <AuthForm />;
  if (selectedProjectId === null) return <p>Loading your workspace...</p>;

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <span>{user.name}</span>
        <span>{user.email}</span>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Log out
        </button>
      </div>

      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="text-red-600">{(error as Error).message}</p>}

      {filteredTasks && (
        <TasksList
          tasks={filteredTasks}
          projects={projects ?? []}
          selectedProjectId={selectedProjectId}
          inboxProjectId={inboxProjectId}
          onSubmitTask={handleSubmitTask}
          onEditTask={setEditingTask}
          onDeleteTask={handleDelete}
          editingTask={editingTask}
          onReorderTask={handleReorderTask}
        />
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={confirm}
        title={`Delete ${taskToDelete?.title}?`}
        description="This task will be permanently removed."
      />

      {adding ? (
        <TaskForm
          initialTask={{ project_id: selectedProjectId ?? inboxProjectId ?? undefined }}
          onSubmit={handleSubmitTask}
          onCancel={handleCancel}
          submitLabel="Save Task"
          projects={projects ?? []}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add task
        </button>
      )}

      <ProjectsList onSelectProject={handleSelectProject} selectedProjectId={selectedProjectId} />
    </main>
  );
}
