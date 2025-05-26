// components/TaskList.tsx
import type { TTask } from '@types';
import type { TProject } from '@reliability-ui';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableTask from '../SortableTask';
import { TaskItem, TaskForm } from '@reliability-ui';

interface TaskListProps {
  tasks: TTask[];
  projects: TProject[];
  selectedProjectId: number;
  inboxProjectId: number | null;
  onSubmitTask: (data: Partial<TTask>) => void;
  onEditTask: (task: TTask | null) => void;
  onDeleteTask: (task: TTask) => void;
  editingTask: TTask | null;
  onReorderTask: (task: Pick<TTask, 'id' | 'sort_order'>) => void;
}

export default function TaskList({
  tasks,
  projects,
  onSubmitTask,
  onEditTask,
  onDeleteTask,
  editingTask,
  onReorderTask,
}: TaskListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(tasks, oldIndex, newIndex);

    reordered.forEach((task, index) => {
      onReorderTask({ id: task.id, sort_order: index });
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <SortableTask key={task.id} task={task}>
            {editingTask?.id === task.id ? (
              <TaskForm
                initialTask={{
                  ...task,
                  due_date: task.due_date ?? undefined, // convert null to undefined
                }}
                onSubmit={onSubmitTask}
                onCancel={() => onEditTask(null)}
                submitLabel="Update Task"
                projects={projects}
              />
            ) : (
              <TaskItem
                title={task.title}
                description={task.description}
                priority={task.priority}
                dueDate={task.due_date ? new Date(task.due_date).toLocaleDateString() : undefined}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            )}
          </SortableTask>
        ))}
      </SortableContext>
    </DndContext>
  );
}
