import { useEffect } from 'react';
import EditDelete from '../EditDelete';
import Checkbox from '../Checkbox';

interface TaskProps {
  title: string;
  description: string | undefined;
  priority: number;
  dueDate?: string;
  complete: boolean;
  onToggleComplete: (checked: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancelEdit?: () => void;
}

const TaskItem = ({
  title,
  description,
  priority,
  dueDate,
  complete,
  onToggleComplete,
  onEdit,
  onDelete,
  onCancelEdit,
}: TaskProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancelEdit?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancelEdit]);

  return (
    <div className="group flex justify-between items-start gap-4">
      <div className="flex items-start gap-2">
        <Checkbox
          checked={complete}
          onCheckedChange={checked => onToggleComplete(Boolean(checked))}
          className="mt-1 cursor-pointer"
        />
        <div className={complete ? 'opacity-50 line-through' : ''}>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
          <div className="text-xs text-gray-500">
            Priority: {priority} | Due: {dueDate ?? 'None'}
          </div>
        </div>
      </div>
      {!complete && (
        <div className="space-x-2 opacity-0 group-hover:opacity-100 transition">
          <EditDelete onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}
    </div>
  );
};

export default TaskItem;
