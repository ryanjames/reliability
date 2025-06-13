import { Hono } from 'hono';
import db from '../db';
import { persistDb } from '../utils/persistDb';

export const taskRoutes = new Hono();

taskRoutes.post('/tasks', async c => {
  const { title, description, priority, due_date, user_id, project_id, complete } =
    await c.req.json();

  const getMaxOrderStmt = db.prepare(`
    SELECT MAX(sort_order) as max_order FROM tasks WHERE user_id = ? AND project_id = ?
  `);
  getMaxOrderStmt.bind([user_id, project_id]);

  let nextSortOrder = 0;

  if (getMaxOrderStmt.step()) {
    const row = getMaxOrderStmt.get() as [number | null];
    const max = row?.[0] as number | null;
    nextSortOrder = typeof max === 'number' ? max + 1 : 0;
  }

  getMaxOrderStmt.free();

  if (!title || !user_id || !project_id || !priority) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date, user_id, project_id, sort_order, complete)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.bind([
    title,
    description ?? '',
    priority,
    due_date ?? null,
    user_id,
    project_id,
    nextSortOrder,
    complete ?? false,
  ]);
  stmt.step();
  stmt.free();

  persistDb();

  return c.json({ success: true });
});

taskRoutes.put('/tasks/:id', async c => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();

  const allowedFields = [
    'title',
    'description',
    'priority',
    'due_date',
    'project_id',
    'sort_order',
    'complete',
  ];
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const field of allowedFields) {
    if (field in body) {
      fields.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (fields.length === 0) {
    return c.json({ error: 'No valid fields to update' }, 400);
  }

  const stmt = db.prepare(`
    UPDATE tasks
    SET ${fields.join(', ')}
    WHERE id = ?
  `);
  stmt.bind([...values, id]);
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
