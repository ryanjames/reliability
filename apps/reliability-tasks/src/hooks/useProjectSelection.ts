import { useEffect, useState, useMemo } from 'react';
import { useProjects } from '@hooks/useProjects';

export function useProjectSelection(userId: number | null) {
  const { data: projects } = useProjects(userId ?? 0, { enabled: !!userId });
  const inboxProjectId = useMemo(
    () => projects?.find(p => p.user_id === userId && p.is_inbox === 1)?.id ?? null,
    [projects, userId],
  );

  const queryParams = new URLSearchParams(window.location.search);
  const initialProjectParam = queryParams.get('project');
  const initialSelectedProjectId =
    initialProjectParam !== null && !Number.isNaN(Number(initialProjectParam))
      ? Number(initialProjectParam)
      : null;

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    initialSelectedProjectId,
  );

  useEffect(() => {
    if (inboxProjectId && selectedProjectId === null) {
      setSelectedProjectId(inboxProjectId);
    }
  }, [inboxProjectId, selectedProjectId]);

  const handleSelectProject = (projectId: number) => {
    setSelectedProjectId(projectId);
    const isInbox = projects?.find(p => p.id === projectId)?.is_inbox === 1;
    const url = isInbox ? '/' : `/?project=${projectId}`;
    window.history.pushState({}, '', url);
  };

  return { projects, inboxProjectId, selectedProjectId, handleSelectProject };
}
