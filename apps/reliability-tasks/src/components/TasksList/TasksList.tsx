import { useEffect } from 'react';
import type { TTask } from '@types';
import type { TProject } from '@reliability-ui';
import { AddAction } from '@reliability-ui';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
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
  onToggleComplete: (task: TTask, complete: boolean) => void;
  adding: boolean;
  setAdding: (adding: boolean) => void;
  onCancelAdd: () => void;
}

export default function TaskList({
  tasks,
  projects,
  onSubmitTask,
  onEditTask,
  onDeleteTask,
  inboxProjectId,
  editingTask,
  onReorderTask,
  selectedProjectId,
  onToggleComplete,
  adding,
  setAdding,
  onCancelAdd,
}: TaskListProps) {
  const SHOW_COMPLETED_TOGGLE_KEY = 'showCompletedTasks';

  const sensors = useSensors(useSensor(PointerSensor));

  const [activeTask, setActiveTask] = useState<TTask | null>(null);

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

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const activeTasks = tasks.filter(task => !task.complete);
  const completedTasks = tasks.filter(task => task.complete);

  const [showCompleted, setShowCompleted] = useState(() => {
    const saved = localStorage.getItem(SHOW_COMPLETED_TOGGLE_KEY);
    return saved === null ? false : saved === 'true';
  });

  const handleToggleCompleted = () => {
    const next = !showCompleted;
    setShowCompleted(next);
    localStorage.setItem(SHOW_COMPLETED_TOGGLE_KEY, String(next));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingTask) onEditTask(null);
        if (adding) onCancelAdd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingTask, adding, onEditTask, onCancelAdd]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="pl-4.5 text-xl font-semibold">
          {selectedProject?.title ?? 'Unnamed Project'}
        </h2>
        {completedTasks.length > 0 && (
          <button onClick={handleToggleCompleted} className="text-sm text-blue-600 hover:underline">
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
        )}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={event => {
          const task = activeTasks.find(t => t.id === event.active.id);
          if (task) setActiveTask(task);
        }}
        onDragEnd={event => {
          handleDragEnd(event);
          setActiveTask(null);
        }}
        onDragCancel={() => setActiveTask(null)}
      >
        <DragOverlay>
          {activeTask && (
            <div className="w-full">
              <TaskItem
                title={activeTask.title}
                description={activeTask.description}
                priority={activeTask.priority}
                dueDate={
                  activeTask.due_date
                    ? new Date(activeTask.due_date).toLocaleDateString()
                    : undefined
                }
                complete={activeTask.complete}
                onToggleComplete={() => {}}
              />
            </div>
          )}
        </DragOverlay>
        <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {activeTasks.map(task => (
            <SortableTask
              key={task.id}
              task={task}
              activeTaskId={activeTask?.id ?? null}
              hideHandle={editingTask?.id === task.id} // 👈 pass prop
            >
              {editingTask?.id === task.id ? (
                <TaskForm
                  initialTask={{
                    ...task,
                    due_date: task.due_date ?? undefined,
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
                  complete={task.complete}
                  onToggleComplete={checked => onToggleComplete(task, checked)}
                  onEdit={() => {
                    setAdding(false);
                    onEditTask(task);
                  }}
                  onDelete={() => onDeleteTask(task)}
                  onCancelEdit={() => onEditTask(null)}
                />
              )}
            </SortableTask>
          ))}
        </SortableContext>
      </DndContext>

      {adding ? (
        <TaskForm
          initialTask={{ project_id: selectedProjectId ?? inboxProjectId ?? undefined }}
          onSubmit={onSubmitTask}
          onCancel={onCancelAdd}
          submitLabel="Add Task"
          projects={projects}
        />
      ) : (
        <div className="mt-6">
          <AddAction
            label="Add Task"
            onClick={() => {
              onEditTask(null);
              setAdding(true);
            }}
            className="ml-5 mt-2"
          />
        </div>
      )}

      {showCompleted && completedTasks.length > 0 && (
        <div className="mt-8 ml-4.5 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Completed</h3>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <TaskItem
                key={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                dueDate={task.due_date ? new Date(task.due_date).toLocaleDateString() : undefined}
                complete={task.complete}
                onToggleComplete={checked => onToggleComplete(task, checked)}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
                onCancelEdit={() => onEditTask(null)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
