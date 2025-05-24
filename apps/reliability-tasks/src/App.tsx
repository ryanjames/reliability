import { useState, useEffect, useMemo } from 'react';
import AuthForm from './components/AuthForm';
import { useAuthStore } from '@store/useAuthStore';
import { useTasks } from '@hooks/useTasks';
import { useAddTask } from '@hooks/useAddTask';
import { useUpdateTask } from '@hooks/useUpdateTask';
import { useProjects } from '@hooks/useProjects';
import { Dialog } from '@reliability-ui';
import { useDeleteTask } from '@hooks/useDeleteTask';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableTask from './components/SortableTask';

import TaskForm from './components/TaskForm';
import { toast } from 'sonner';
import type { TTask } from '@types';
import Projects from './components/Projects';

export default function App() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const userId = user?.id ?? 0;
  const { data: projects } = useProjects(userId, { enabled: !!user?.id });

  const { data: tasks, isLoading, error } = useTasks();

  const [adding, setAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<TTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TTask | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

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

  useEffect(() => {
    if (inboxProjectId && selectedProjectId === null) {
      setSelectedProjectId(inboxProjectId);
    }
  }, [inboxProjectId, selectedProjectId]);

  const filteredTasks = tasks?.filter(task => task.project_id === selectedProjectId);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    if (!filteredTasks) return; // early exit

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex(t => t.id === active.id);
    const newIndex = filteredTasks.findIndex(t => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(filteredTasks, oldIndex, newIndex);

    reordered.forEach((task, index) => {
      updateTask.mutate({ id: task.id, sort_order: index });
    });
  };

  if (!user) {
    return <AuthForm />;
  }

  if (selectedProjectId === null) {
    return <p>Loading your workspace...</p>;
  }

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
        <>
          <div className="space-y-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredTasks.map(task => (
                  <SortableTask key={task.id} task={task}>
                    {editingTask?.id === task.id ? (
                      <TaskForm
                        initialTask={task}
                        onSubmit={handleSubmitTask}
                        onCancel={handleCancel}
                        submitLabel="Update Task"
                        projects={projects ?? []}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{task.title}</div>
                          <div className="text-sm text-gray-600">{task.description}</div>
                          <div className="text-xs text-gray-500">
                            Priority: {task.priority} | Due:{' '}
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'None'}
                          </div>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="text-sm text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task)}
                            className="text-sm text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </SortableTask>
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            onConfirm={confirm}
            title={`Delete ${taskToDelete?.title}?`}
            description="This task will be permanently removed."
          />
        </>
      )}

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
      <Projects onSelectProject={setSelectedProjectId} selectedProjectId={selectedProjectId} />
    </main>
  );
}
