interface TaskProps {
  title: string;
  description: string | undefined;
  priority: number;
  dueDate?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function Task({
  title,
  description,
  priority,
  dueDate,
  onEdit,
  onDelete,
}: TaskProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
        <div className="text-xs text-gray-500">
          Priority: {priority} | Due: {dueDate ?? 'None'}
        </div>
      </div>
      <div className="space-x-2">
        {onEdit && (
          <button onClick={onEdit} className="text-sm text-blue-600">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-sm text-red-500">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
