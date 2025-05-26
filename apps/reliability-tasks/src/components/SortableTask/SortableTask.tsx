import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TTask } from '@types';
import type { ReactNode } from 'react';
import { cn } from '@reliability-ui';

interface Props {
  task: TTask;
  children: ReactNode;
  activeTaskId: number | null; // 👈 passed in
}

const SortableTask = ({ task, children, activeTaskId }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: task.id === activeTaskId ? 0 : 1, // 👈 hide the original during drag
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('group flex gap-2 items-start mt-4', {
        'pointer-events-none': isDragging,
      })}
    >
      <div
        {...attributes}
        {...listeners}
        className="opacity-0 group-hover:opacity-100 cursor-move text-gray-400 group-hover:text-gray-600 select-none transition"
      >
        ⠿
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default SortableTask;
