export interface TTask {
  id: number;
  project_id: number;
  user_id: number;
  title: string;
  description?: string;
  priority: 1 | 2 | 3;
  due_date: number | null;
  sort_order: number;
}
