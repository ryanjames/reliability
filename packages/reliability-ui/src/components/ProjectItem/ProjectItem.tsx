import type { TProject } from '../../../types/project';
import { cn } from '../../utils/cn'; // optional classNames utility

interface ProjectItemProps {
  project: TProject;
  selectedProjectId: number | null;
  onSelectProject: (id: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isInbox?: boolean;
}

export default function ProjectItem({
  project,
  selectedProjectId,
  onSelectProject,
  onEdit,
  onDelete,
  isInbox = false,
}: ProjectItemProps) {
  const isSelected = selectedProjectId === project.id;

  return (
    <div className="flex justify-between items-center">
      <span
        onClick={() => onSelectProject(project.id)}
        className={cn(
          'cursor-pointer px-2 py-1 rounded',
          isSelected ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-gray-100',
        )}
      >
        {project.title}
      </span>

      {!isInbox && (
        <div className="space-x-2">
          {onEdit && (
            <button onClick={onEdit} className="text-blue-600">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="text-red-500">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
