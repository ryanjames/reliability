import EditDelete from '../EditDelete';

interface TaskProps {
  title: string;
  description: string | undefined;
  priority: number;
  dueDate?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskItem = ({ title, description, priority, dueDate, onEdit, onDelete }: TaskProps) => {
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
        <EditDelete onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default TaskItem;
