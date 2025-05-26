import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TTask } from '@types';
import type { ReactNode } from 'react';

interface Props {
  task: TTask;
  children: ReactNode;
}

const SortableTask = ({ task, children }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group flex gap-2 items-start">
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
