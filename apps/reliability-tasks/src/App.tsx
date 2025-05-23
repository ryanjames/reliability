import AuthForm from './components/AuthForm';
import { useAuthStore } from '@store/useAuthStore';
import { useTasks } from '@hooks/useTasks';
import type { TTask } from '@types';
import { toast } from 'sonner';

export default function App() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const { data: tasks, isLoading, error } = useTasks();

  const handleLogout = () => {
    if (user) {
      toast(`Logged out ${user.name} (${user.email})`);
    }
    logout();
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
            <ul className="mt-4 list-disc pl-5">
              {tasks.map((task: TTask) => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
