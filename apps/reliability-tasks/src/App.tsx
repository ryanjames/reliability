import { useTasks } from '@hooks/useTasks';
import AuthForm from './components/AuthForm';
import type { TTask } from '@types';

export default function App() {
  const { data: tasks, error, isLoading } = useTasks();

  return (
    <main className="p-8">
      <AuthForm />
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="text-red-600">{(error as Error).message}</p>}
      {tasks && (
        <ul className="mt-4 list-disc pl-5">
          {tasks.map((task: TTask) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
