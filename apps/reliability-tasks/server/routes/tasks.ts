import { Hono } from 'hono';
import db from '../db';
import { persistDb } from '../utils/persistDb';

export const taskRoutes = new Hono();

taskRoutes.post('/tasks', async c => {
  const { title, description, priority, due_date, user_id, project_id } = await c.req.json();

  if (!title || !user_id || !project_id || !priority) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date, user_id, project_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.bind([title, description ?? '', priority, due_date ?? null, user_id, project_id]);
  stmt.step();
  stmt.free();

  persistDb();

  return c.json({ success: true });
});

taskRoutes.put('/tasks/:id', async c => {
  const id = Number(c.req.param('id'));
  const { title, description, priority, due_date, project_id } = await c.req.json();

  if (!title || !priority) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const stmt = db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, priority = ?, due_date = ?, project_id = ?
    WHERE id = ?
  `);
  const defaultProjectId = 1; // Inbox
  stmt.bind([
    title,
    description ?? '',
    priority,
    due_date ?? null,
    project_id ?? defaultProjectId,
    id,
  ]);
  stmt.step();
  stmt.free();

  persistDb();

  return c.json({ success: true });
});

taskRoutes.delete('/tasks/:id', c => {
  const id = Number(c.req.param('id'));
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.bind([id]);
  stmt.step();
  stmt.free();

  persistDb();

  return c.json({ success: true });
});
