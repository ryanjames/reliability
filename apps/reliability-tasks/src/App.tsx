import { useState } from 'react';
import AuthForm from './components/AuthForm';
import { useTasks } from '@hooks/useTasks';
import { Dialog } from '@reliability-ui';
import { TaskForm } from '@reliability-ui';
import { useSession } from '@hooks/useSession';
import { useProjectSelection } from '@hooks/useProjectSelection';
import { useTaskHandlers } from '@hooks/useTaskHandlers';

import ProjectsList from './components/ProjectsList';
import TasksList from './components/TasksList';

export default function App() {
  const { user, handleLogout } = useSession();
  const { data: tasks, isLoading, error } = useTasks();

  const [adding, setAdding] = useState(false);

  const { projects, inboxProjectId, selectedProjectId, handleSelectProject } = useProjectSelection(
    user?.id ?? null,
  );

  const handleCancel = () => {
    setAdding(false);
    setEditingTask(null);
  };

  const userId = user?.id ?? 0;

  const {
    handleSubmitTask,
    handleDeleteTask,
    handleReorderTask,
    editingTask,
    setEditingTask,
    taskToDelete,
    setTaskToDelete,
    deleteTask,
  } = useTaskHandlers(userId, inboxProjectId, selectedProjectId, { setAdding });

  const filteredTasks = tasks?.filter(task => task.project_id === selectedProjectId);

  if (!user) return <AuthForm />;
  if (selectedProjectId === null) return <p>Loading your workspace...</p>;

  return (
    <main className="flex">
      <div className="w-xs relative pt-5">
        <ProjectsList onSelectProject={handleSelectProject} selectedProjectId={selectedProjectId} />
        <div className="absolute bottom-0 p-5 box-border flex w-full left-0">
          <div className="flex flex-col flex-1 text-xs align-bottom">
            <span>{user.name}</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-end">
            <span
              className="text-xs cursor-pointer inline-block p-2 border-1 border-gray-300 rounded hover:border-gray-400 transition duration-100"
              onClick={handleLogout}
            >
              Log out
            </span>
          </div>
        </div>
      </div>

      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="text-red-600">{(error as Error).message}</p>}

      <div className="flex-1 bg-white h-screen p-8 box-border border-l-1 border-gray-100">
        {filteredTasks && (
          <TasksList
            tasks={filteredTasks}
            projects={projects ?? []}
            selectedProjectId={selectedProjectId}
            inboxProjectId={inboxProjectId}
            onSubmitTask={handleSubmitTask}
            onEditTask={setEditingTask}
            onDeleteTask={handleDeleteTask}
            editingTask={editingTask}
            onReorderTask={handleReorderTask}
          />
        )}
        <Dialog
          open={taskToDelete !== null}
          onOpenChange={open => {
            if (!open) setTaskToDelete(null);
          }}
          onConfirm={() => {
            if (taskToDelete) {
              deleteTask.mutate({ id: taskToDelete.id });
              setTaskToDelete(null);
            }
          }}
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
      </div>
    </main>
  );
}
