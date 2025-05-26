import EditDelete from '../EditDelete';

interface TaskProps {
  title: string;
  description: string | undefined;
  priority: number;
  dueDate?: string;
  complete: boolean;
  onToggleComplete: (checked: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
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
}: TaskProps) => {
  return (
    <div className="flex justify-between items-start gap-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={complete}
          onChange={e => onToggleComplete(e.target.checked)}
          className="mt-1 cursor-pointer"
        />
        <div className={complete ? 'opacity-50 line-through' : ''}>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-600">{description}</div>
          <div className="text-xs text-gray-500">
            Priority: {priority} | Due: {dueDate ?? 'None'}
          </div>
        </div>
      </div>
      {!complete && (
        <div className="space-x-2">
          <EditDelete onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}
    </div>
  );
};

export default TaskItem;
