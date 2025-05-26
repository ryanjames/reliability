import { cn } from '../../utils/cn';
import { cva } from 'class-variance-authority';
import type { TProject } from '../../../types/project';
import EditDelete from '../EditDelete';

const projectTitleVariants = cva('flex-1 text-sm cursor-pointer font-semibold', {
  variants: {
    isInbox: {
      true: 'ml-3 pl-1.5',
      false: '',
    },
  },
});

interface ProjectItemProps {
  project: TProject;
  selectedProjectId: number | null;
  onSelectProject: (id: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isInbox?: boolean;
}

const ProjectItem = ({
  project,
  onSelectProject,
  onEdit,
  onDelete,
  isInbox = false,
}: ProjectItemProps) => {
  return (
    <div className="flex justify-between group flex-1">
      <span
        className={cn(projectTitleVariants({ isInbox }))}
        onClick={() => onSelectProject(project.id)}
      >
        {project.title}
      </span>

      {!isInbox && (
        <div className="space-x-2 opacity-0 group-hover:opacity-100">
          <EditDelete onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}
    </div>
  );
};

export default ProjectItem;
