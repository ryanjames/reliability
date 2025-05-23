import { useState, useEffect } from 'react';
import type { TTask } from '@types';

interface TaskFormProps {
  initialTask?: Partial<TTask>;
  onSubmit: (task: Partial<TTask>) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function TaskForm({
  initialTask,
  onSubmit,
  submitLabel = 'Save',
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState(initialTask?.description ?? '');
  const [priority, setPriority] = useState<1 | 2 | 3>(initialTask?.priority ?? 1);
  const [dueDate, setDueDate] = useState(
    initialTask?.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '',
  );

  useEffect(() => {
    if (!initialTask?.id) return; // Only reinitialize if editing an existing task
    setTitle(initialTask.title ?? '');
    setDescription(initialTask.description ?? '');
    setPriority(initialTask.priority ?? 1);
    setDueDate(
      initialTask.due_date ? new Date(initialTask.due_date).toISOString().split('T')[0] : '',
    );
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      due_date: dueDate ? new Date(dueDate).getTime() : undefined,
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
