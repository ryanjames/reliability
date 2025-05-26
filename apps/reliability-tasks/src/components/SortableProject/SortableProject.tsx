// components/SortableProject.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

interface Props {
  id: number;
  children: ReactNode;
  className?: string;
}

const SortableProject = ({ id, children, className }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${className} flex group items-center px-2`}>
      <div
        {...attributes}
        {...listeners}
        className="cursor-move pb-1 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity select-none"
      >
        ⠿
      </div>
      {children}
    </div>
  );
};

export default SortableProject;
