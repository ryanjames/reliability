// packages/reliability-ui/src/components/TaskForm.tsx

import { useEffect, useState } from 'react';

interface TaskFormProps {
  initialTask?: {
    id?: number;
    title?: string;
    description?: string;
    priority?: 1 | 2 | 3;
    due_date?: number | string;
    project_id?: number;
  };
  onSubmit: (task: {
    title: string;
    description: string;
    priority: 1 | 2 | 3;
    due_date?: number;
    project_id: number;
  }) => void;
  submitLabel?: string;
  onCancel?: () => void;
  projects: { id: number; title: string; is_inbox: number }[];
}

export default function TaskForm({
  initialTask,
  onSubmit,
  submitLabel = 'Save',
  onCancel,
  projects,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<1 | 2 | 3>(initialTask?.priority ?? 1);
  const [dueDate, setDueDate] = useState(
    initialTask?.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '',
  );
  const [projectId, setProjectId] = useState(() => {
    if (initialTask?.project_id) return initialTask.project_id;
    const inbox = projects.find(p => p.is_inbox === 1);
    return inbox?.id ?? projects[0]?.id ?? 1;
  });

  useEffect(() => {
    if (!initialTask?.id) return;
    setTitle(initialTask.title ?? '');
    setDescription(initialTask.description ?? '');
    setPriority(initialTask.priority ?? 1);
    setDueDate(
      initialTask.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '',
    );
    setProjectId(prev => initialTask.project_id ?? prev);
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      due_date: dueDate ? Date.parse(dueDate) : undefined,
      project_id: projectId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border px-3 py-2 w-full"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="border px-3 py-2 w-full"
      />
      <select
        value={priority}
        onChange={e => setPriority(Number(e.target.value) as 1 | 2 | 3)}
        className="border px-3 py-2 w-full"
      >
        <option value={1}>Low</option>
        <option value={2}>Medium</option>
        <option value={3}>High</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        className="border px-3 py-2 w-full"
      />
      <select
        value={projectId}
        onChange={e => setProjectId(Number(e.target.value))}
        className="border px-3 py-2 w-full"
      >
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
