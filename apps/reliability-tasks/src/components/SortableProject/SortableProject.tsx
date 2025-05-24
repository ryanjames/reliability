import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

interface Props {
  id: number;
  children: ReactNode;
}

const SortableProject = ({ id, children }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex group items-center">
      <div
        {...attributes}
        {...listeners}
        className="cursor-move w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity select-none"
      >
        ⠿
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default SortableProject;
