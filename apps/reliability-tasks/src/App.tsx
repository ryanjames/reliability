import { useState } from 'react';
import AuthForm from './components/AuthForm';
import { useAuthStore } from '@store/useAuthStore';
import { useTasks } from '@hooks/useTasks';
import { useAddTask } from '@hooks/useAddTask';
import { Dialog } from '@reliability-ui';
import { useDeleteTask } from '@hooks/useDeleteTask';
import { toast } from 'sonner';

export default function App() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const { data: tasks, isLoading, error } = useTasks();

  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3>(1);
  const [dueDate, setDueDate] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const addTask = useAddTask();
  const deleteTask = useDeleteTask();

  const handleLogout = () => {
    if (user) toast(`Logged out ${user.name} (${user.email})`);
    logout();
  };

  const handleDelete = (id: number) => {
    setTaskToDelete(id);
    setOpen(true);
  };

  const confirm = () => {
    if (taskToDelete !== null) {
      deleteTask.mutate({ id: taskToDelete });
      setTaskToDelete(null);
    }
  };

  const handleAdd = () => {
    if (!user) return;
    addTask.mutate({
      title,
      description,
      priority,
      due_date: dueDate ? new Date(dueDate).getTime() : null,
      project_id: 1,
      user_id: user.id,
    });
    setTitle('');
    setDescription('');
    setPriority(1);
    setDueDate('');
    setAdding(false);
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
                  <li key={task.id} className="flex justify-between items-start border-b pb-2">
                    <div>
                      <div className="font-semibold">{task.title}</div>
                      <div className="text-sm text-gray-600">{task.description}</div>
                      <div className="text-xs text-gray-500">
                        Priority: {task.priority} | Due:{' '}
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'None'}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(task.id)} className="text-sm text-red-500">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <Dialog
                open={open}
                onOpenChange={setOpen}
                onConfirm={confirm}
                title="Delete Task?"
                description="This task will be permanently removed."
              />
            </>
          )}

          {adding ? (
            <div className="mt-6 space-y-2">
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                className="border px-3 py-2 w-full"
              />
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                className="border px-3 py-2 w-full"
              />
              <select
                value={priority}
                onChange={e => setPriority(Number(e.target.value) as 1 | 2 | 3)}
                className="border px-3 py-2 w-full"
              >
                <option value={1}>High</option>
                <option value={2}>Medium</option>
                <option value={3}>Low</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="border px-3 py-2 w-full"
              />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
                  Save Task
                </button>
                <button onClick={() => setAdding(false)} className="bg-gray-300 px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </div>
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
    </main>
  );
}
