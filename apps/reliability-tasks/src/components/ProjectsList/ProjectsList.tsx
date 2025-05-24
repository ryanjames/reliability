import { useState } from 'react';
import { useAuthStore } from '@store/useAuthStore';
import { useProjects } from '@hooks/useProjects';
import { useAddProject } from '@hooks/useAddProject';
import { useUpdateProject } from '@hooks/useUpdateProject';
import { useDeleteProject } from '@hooks/useDeleteProject';
import { Dialog } from '@reliability-ui';
import type { TProject } from '@types';
import { toast } from 'sonner';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableProject from '../SortableProject';

interface ProjectsProps {
  onSelectProject: (id: number) => void;
  selectedProjectId: number | null;
}

const ProjectsList = ({ onSelectProject, selectedProjectId }: ProjectsProps) => {
  const user = useAuthStore(state => state.user);
  const userId = user?.id;
  const enabled = !!userId;

  const { data: projects, isLoading, error } = useProjects(userId!, { enabled });
  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<TProject | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAdd = () => {
    if (!user || !editTitle.trim()) return;
    const maxSort = (projects ?? []).filter(p => !p.is_inbox).length;
    addProject.mutate(
      { title: editTitle.trim(), user_id: user.id, is_inbox: 0, sort_order: maxSort },
      {
        onSuccess: () => {
          toast.success(`Project "${editTitle.trim()}" added`);
          setEditTitle('');
          setAdding(false);
        },
      },
    );
  };

  const handleUpdate = (id: number) => {
    if (!user || !editTitle.trim() || !projects) return;

    const original = projects.find(p => p.id === id);
    if (!original) return;

    updateProject.mutate(
      {
        id,
        title: editTitle.trim(),
        user_id: user.id,
        is_inbox: original.is_inbox,
        sort_order: original.sort_order,
      },
      {
        onSuccess: () => {
          toast.success(`Project "${editTitle.trim()}" updated`);
          setEditingId(null);
          setEditTitle('');
        },
      },
    );
  };

  const confirmDelete = () => {
    if (projectToDelete !== null) {
      deleteProject.mutate(
        { id: projectToDelete.id },
        {
          onSuccess: () => toast.success(`Project "${projectToDelete.title}" deleted`),
        },
      );
      setProjectToDelete(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!projects) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const otherProjects = projects.filter(p => p.is_inbox === 0);
    const oldIndex = otherProjects.findIndex(p => p.id === active.id);
    const newIndex = otherProjects.findIndex(p => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(otherProjects, oldIndex, newIndex);
    reordered.forEach((project, index) => {
      updateProject.mutate({
        ...project,
        sort_order: index,
      });
    });
  };

  if (!user) return null;

  const inboxProject = projects?.find(p => p.is_inbox === 1);
  const otherProjects = (projects ?? []).filter(p => p.is_inbox === 0);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>

      {isLoading && <p>Loading projects...</p>}
      {error && <p className="text-red-600">{(error as Error).message}</p>}

      {projects && (
        <ul className="space-y-2">
          {inboxProject && (
            <li className="flex justify-between items-center">
              <span
                onClick={() => onSelectProject(inboxProject.id)}
                className={`cursor-pointer px-2 py-1 rounded ${
                  selectedProjectId === inboxProject.id
                    ? 'bg-blue-100 text-blue-800 font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                {inboxProject.title}
              </span>
            </li>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={otherProjects.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {otherProjects.map(project => (
                <SortableProject key={project.id} id={project.id}>
                  <li className="flex justify-between items-center">
                    {editingId === project.id ? (
                      <>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleUpdate(project.id);
                            }
                          }}
                          className="border px-2 py-1 w-full"
                        />
                        <button
                          onClick={() => handleUpdate(project.id)}
                          className="bg-green-600 text-white px-3 py-1 ml-2 rounded"
                        >
                          Save
                        </button>
                        <button onClick={handleCancel} className="text-gray-600 px-3 py-1 ml-2">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          onClick={() => onSelectProject(project.id)}
                          className={`cursor-pointer px-2 py-1 rounded ${
                            selectedProjectId === project.id
                              ? 'bg-blue-100 text-blue-800 font-semibold'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {project.title}
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => {
                              setEditingId(project.id);
                              setEditTitle(project.title);
                            }}
                            className="text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setProjectToDelete(project);
                              setConfirmOpen(true);
                            }}
                            className="text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                </SortableProject>
              ))}
            </SortableContext>
          </DndContext>
        </ul>
      )}

      {adding ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAdd();
          }}
          className="flex gap-2 mb-4"
        >
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="New project title"
            className="border px-3 py-2 w-full"
            autoFocus
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setAdding(false);
              setEditTitle('');
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 mb-4 rounded"
        >
          ➕ Add Project
        </button>
      )}

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDelete}
        title={`Delete ${projectToDelete?.title}?`}
        description="This project will be permanently removed."
      />
    </div>
  );
};

export default ProjectsList;
