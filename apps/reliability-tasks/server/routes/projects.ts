import { Hono } from 'hono';
import db from '../db';
import { persistDb } from '../utils/persistDb';
import { toast } from 'sonner';

export const projectRoutes = new Hono();

// GET /projects?user_id=123
projectRoutes.get('/projects', c => {
  const userId = Number(c.req.query('user_id'));
  if (!userId) return c.json({ error: 'Missing user_id' }, 400);

  const stmt = db.prepare(`
    SELECT id, user_id, title, is_inbox, sort_order
    FROM projects
    WHERE user_id = ?
    ORDER BY is_inbox DESC, sort_order ASC
  `);
  stmt.bind([userId]);

  const projects = [];
  while (stmt.step()) {
    const [id, user_id, title, is_inbox, sort_order] = stmt.get() as [
      number,
      number,
      string,
      number,
      number,
    ];
    projects.push({ id, user_id, title, is_inbox, sort_order });
  }
  stmt.free();

  return c.json(projects);
});

// POST /projects
projectRoutes.post('/projects', async c => {
  const { user_id, title, is_inbox = 0 } = await c.req.json();

  if (!user_id || !title) {
    return c.json({ error: 'Missing user_id or title' }, 400);
  }

  const getMaxOrderStmt = db.prepare(`
    SELECT MAX(sort_order) as max_order FROM projects WHERE user_id = ? AND is_inbox = 0
  `);
  getMaxOrderStmt.bind([user_id]);

  let nextSortOrder = 0;
  if (getMaxOrderStmt.step()) {
    const row = getMaxOrderStmt.get() as [number | null];
    const max = row?.[0];
    nextSortOrder = typeof max === 'number' ? max + 1 : 0;
  }
  getMaxOrderStmt.free();

  const stmt = db.prepare(`
    INSERT INTO projects (user_id, title, is_inbox, sort_order)
    VALUES (?, ?, ?, ?)
  `);
  stmt.bind([user_id, title, is_inbox, nextSortOrder]);
  stmt.step();
  stmt.free();

  toast.success(`Project "${title}" created`);
  persistDb();

  return c.json({ success: true });
});

// PUT /projects/:id
projectRoutes.put('/projects/:id', async c => {
  const id = Number(c.req.param('id'));
  const { title, sort_order } = await c.req.json();

  const stmt = db.prepare(`
    UPDATE projects SET title = COALESCE(?, title), sort_order = COALESCE(?, sort_order)
    WHERE id = ?
  `);
  stmt.bind([title ?? null, sort_order ?? null, id]);
  stmt.step();
  stmt.free();

  toast.success(`Project "${title}" updated`);
  persistDb();

  return c.json({ success: true });
});

// DELETE /projects/:id
projectRoutes.delete('/projects/:id', c => {
  const id = Number(c.req.param('id'));

  // Fetch the project title first
  const selectStmt = db.prepare('SELECT title FROM projects WHERE id = ?');
  selectStmt.bind([id]);
  let title: string | null = null;
  if (selectStmt.step()) {
    const row = selectStmt.get() as [string];
    title = row?.[0];
  }
  selectStmt.free();

  if (!title) {
    return c.json({ error: 'Project not found' }, 404);
  }

  // Now delete the project
  const deleteStmt = db.prepare('DELETE FROM projects WHERE id = ?');
  deleteStmt.bind([id]);
  deleteStmt.step();
  deleteStmt.free();

  persistDb();

  // Respond with the deleted title so you can toast it on the client
  return c.json({ success: true, title });
});
