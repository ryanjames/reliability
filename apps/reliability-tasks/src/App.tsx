import { useState } from 'react';
import AuthForm from './components/AuthForm';
import { useAuthStore } from '@store/useAuthStore';
import { useTasks } from '@hooks/useTasks';
import { useAddTask } from '@hooks/useAddTask';
import { useUpdateTask } from '@hooks/useUpdateTask';
import { Dialog } from '@reliability-ui';
import { useDeleteTask } from '@hooks/useDeleteTask';
import TaskForm from './components/TaskForm';
import { toast } from 'sonner';
import type { TTask } from '@types';
import Projects from './components/Projects/Projects';

export default function App() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const { data: tasks, isLoading, error } = useTasks();

  const [adding, setAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<TTask | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TTask | null>(null);
  const [open, setOpen] = useState(false);

  const addTask = useAddTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

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
    if (!user) return;

    const payload = {
      ...data,
      user_id: user.id,
      project_id: 1,
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

  return (
    <main className="p-8">
      {!user ? (
        <AuthForm />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
              Log out
            </button>
          </div>

          {isLoading && <p>Loading tasks...</p>}
          {error && <p className="text-red-600">{(error as Error).message}</p>}

          {tasks && (
            <>
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li key={task.id} className="border-b pb-2">
                    {editingTask?.id === task.id ? (
                      <TaskForm
                        initialTask={task}
                        onSubmit={handleSubmitTask}
                        onCancel={handleCancel}
                        submitLabel="Update Task"
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
                  </li>
                ))}
              </ul>
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
            <TaskForm onSubmit={handleSubmitTask} onCancel={handleCancel} submitLabel="Save Task" />
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            >
              ➕ Add task
            </button>
          )}
        </>
      )}
      <Projects />
    </main>
  );
}
