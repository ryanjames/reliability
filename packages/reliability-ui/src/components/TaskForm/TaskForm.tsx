import Input from '../Input';
import { useEffect, useState } from 'react';
import SelectField, { Select } from '../SelectField';
import Textarea from '../Textarea';
import DatePicker from '../DatePicker';
import Button from '../Button';

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
  const [dueDate, setDueDate] = useState<number | ''>(
    typeof initialTask?.due_date === 'number' ? initialTask.due_date : '',
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

    if (initialTask.due_date) {
      const date = new Date(initialTask.due_date);
      const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
      setDueDate(utcMidnight);
    } else {
      setDueDate('');
    }

    setProjectId(prev => initialTask.project_id ?? prev);
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      due_date: dueDate || undefined, // already a UTC timestamp or ''
      project_id: projectId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper flex flex-col gap-3 border-1 border-gray-200 p-4 rounded space-y-2"
    >
      <Input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New project title"
        autoFocus
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">Due</span>
          <DatePicker
            value={
              typeof dueDate === 'number'
                ? new Date(dueDate)
                : dueDate
                  ? new Date(dueDate)
                  : undefined
            }
            onChange={date => {
              if (date) {
                const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                setDueDate(localMidnight.getTime());
              }
            }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">Priority</span>
          <SelectField
            value={priority.toString()}
            onValueChange={val => setPriority(Number(val) as 1 | 2 | 3)}
          >
            <Select.Item value="1">Low</Select.Item>
            <Select.Item value="2">Medium</Select.Item>
            <Select.Item value="3">High</Select.Item>
          </SelectField>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">Project</span>
          <SelectField
            value={projectId.toString()}
            onValueChange={val => setProjectId(Number(val))}
          >
            {projects.map(project => (
              <Select.Item key={project.id} value={project.id.toString()}>
                {project.title}
              </Select.Item>
            ))}
          </SelectField>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" size="sm">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button intent="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
