import { useEffect } from 'react';
import EditDelete from '../EditDelete';
import Checkbox from '../Checkbox';

interface TaskProps {
  title: string;
  description: string | undefined;
  priority?: 1 | 2 | 3;
  dueDate?: string | number;
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

  // Parse the date
  let parsedDate = null;
  if (dueDate) {
    if (typeof dueDate === 'number') {
      parsedDate = new Date(dueDate);
    } else if (typeof dueDate === 'string') {
      parsedDate = new Date(dueDate + ' 00:00:00'); // Force local timezone
    }
  }

  // Get today's date
  const today = new Date();

  // Normalize both dates to start of day in LOCAL time
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let taskDateStart = null;
  if (parsedDate) {
    taskDateStart = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  }

  // Calculate tomorrow
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  // Compare
  const isToday = taskDateStart?.getTime() === todayStart.getTime();
  const isTomorrow = taskDateStart?.getTime() === tomorrowStart.getTime();

  // Use these variables in your JSX:
  const normalizedRaw = taskDateStart;
  const formattedDate = taskDateStart?.toLocaleDateString();
  return (
    <div className="group flex justify-between items-start gap-4 pb-4 border-b border-gray-200">
      <div className="flex items-start gap-2">
        <Checkbox
          checked={complete}
          onCheckedChange={checked => onToggleComplete(Boolean(checked))}
          priority={priority}
          className="mt-1 cursor-pointer"
        />
        <div className={complete ? 'opacity-50 line-through' : ''}>
          <div className="text-sm mt-0.5 font-semibold">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            {normalizedRaw ? (
              <span className={normalizedRaw < today ? 'text-red-600 font-medium' : ''}>
                {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : formattedDate}
              </span>
            ) : (
              <span className="text-gray-400">No due date</span>
            )}
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
