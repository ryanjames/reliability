// components/SortableTask.tsx
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
    <div ref={setNodeRef} style={style} className="group bg-white p-2 rounded shadow">
      <div
        {...attributes}
        {...listeners}
        className="cursor-move text-gray-400 group-hover:text-gray-600 select-none"
      >
        ⠿
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SortableTask;
