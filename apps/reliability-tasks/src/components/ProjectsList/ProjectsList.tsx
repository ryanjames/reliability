import { useState } from 'react';
import { useAuthStore } from '@store/useAuthStore';
import { useProjects } from '@hooks/useProjects';
import { useAddProject } from '@hooks/useAddProject';
import { useUpdateProject } from '@hooks/useUpdateProject';
import { useDeleteProject } from '@hooks/useDeleteProject';
import { Dialog, Input, ProjectForm, ProjectItem, SubmitCancel } from '@reliability-ui';
import { cva, cn } from '@reliability-ui'; // adjust to your actual path
import type { TProject } from '@reliability-ui';
import { toast } from 'sonner';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableProject from '../SortableProject';

interface ProjectsProps {
  onSelectProject: (id: number) => void;
  selectedProjectId: number | null;
}

const projectWrapperVariants = cva('group transition-colors m-0 pt-1.5 pb-0.5', {
  variants: {
    selected: {
      true: 'bg-paperSelected',
      false: '',
    },
    isInbox: {
      true: 'py-2 pl-1.5',
      false: '',
    },
  },
});

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

  const handleUpdate = (id: number, title: string) => {
    if (!user || !title.trim() || !projects) return;

    const original = projects.find(p => p.id === id);
    if (!original) return;

    updateProject.mutate(
      {
        id,
        title: title.trim(),
        user_id: user.id,
        is_inbox: original.is_inbox,
        sort_order: original.sort_order,
      },
      {
        onSuccess: () => {
          toast.success(`Project "${title.trim()}" updated`);
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
    <>
      <h2 className="pl-6 text-xs tracking-widest uppercase font-bold opacity-50">Projects</h2>

      {isLoading && <p>Loading projects...</p>}
      {error && <p className="text-red-600">{(error as Error).message}</p>}

      {projects && (
        <div className="space-y-2">
          {inboxProject && (
            <div
              className={cn(
                projectWrapperVariants({
                  selected: selectedProjectId === inboxProject.id,
                  isInbox: true,
                }),
              )}
            >
              <ProjectItem
                project={inboxProject}
                selectedProjectId={selectedProjectId}
                onSelectProject={onSelectProject}
                isInbox
              />
            </div>
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
              {otherProjects.map(project => {
                const isSelected = selectedProjectId === project.id;

                return (
                  <SortableProject
                    key={project.id}
                    id={project.id}
                    className={cn(projectWrapperVariants({ selected: isSelected, isInbox: false }))}
                  >
                    {editingId === project.id ? (
                      <ProjectForm
                        initialTitle={project.title}
                        onSubmit={title => handleUpdate(project.id, title)}
                        onCancel={handleCancel}
                      />
                    ) : (
                      <ProjectItem
                        project={project}
                        selectedProjectId={selectedProjectId}
                        onSelectProject={onSelectProject}
                        onEdit={() => {
                          setEditingId(project.id);
                          setEditTitle(project.title);
                        }}
                        onDelete={() => {
                          setProjectToDelete(project);
                          setConfirmOpen(true);
                        }}
                      />
                    )}
                  </SortableProject>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {adding ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAdd();
          }}
          className="flex gap-2 pl-6 pt-2 pr-2"
        >
          <Input
            type="text"
            display="inline"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            placeholder="New project title"
            autoFocus
          />
          {/* ⬇️ Swap these */}
          <SubmitCancel
            title={editTitle}
            initialTitle=""
            onSubmit={() => handleAdd()}
            onCancel={() => {
              setAdding(false);
              setEditTitle('');
            }}
          />
        </form>
      ) : (
        <div
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-sm ml-5 mt-2 cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.36714 7.61479H12.6684C12.8099 7.61479 12.9876 7.78599 12.9985 7.94254C13.0093 8.0991 12.8756 8.38444 12.7071 8.38444H8.36714V12.7131C8.36714 12.8203 8.15381 12.9931 8.0371 13.0008C7.92039 13.0085 7.63441 12.872 7.63441 12.7517V8.38521H3.33313C3.31226 8.38521 3.12831 8.29575 3.10048 8.27107C2.8887 8.08136 3.03942 7.61556 3.29448 7.61556H7.63441V3.24755C7.63441 3.14807 7.85856 3.00462 7.96599 3C8.0827 2.99537 8.36791 3.1257 8.36791 3.24755V7.61402L8.36714 7.61479Z"
              fill="#000000"
            />
          </svg>
          <span className="inline-block">Add Project</span>
        </div>
      )}

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDelete}
        title={`Delete ${projectToDelete?.title}?`}
        description="This project will be permanently removed."
      />
    </>
  );
};

export default ProjectsList;
