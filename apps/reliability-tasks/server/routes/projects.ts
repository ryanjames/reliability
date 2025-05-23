import { Hono } from 'hono';
import db from '../db';
import { persistDb } from '../utils/persistDb';

export const projectRoutes = new Hono();

// GET /projects?user_id=123
projectRoutes.get('/projects', c => {
  const userId = Number(c.req.query('user_id'));
  if (!userId) return c.json({ error: 'Missing user_id' }, 400);

  const stmt = db.prepare('SELECT * FROM projects WHERE user_id = ?');
  stmt.bind([userId]);

  const projects = [];
  while (stmt.step()) {
    const [id, user_id, title, is_inbox] = stmt.get() as [number, number, string, number];
    projects.push({ id, user_id, title, is_inbox });
  }
  stmt.free();

  return c.json(projects);
});

// POST /projects
projectRoutes.post('/projects', async c => {
  const { user_id, title } = await c.req.json();

  if (!user_id || !title) {
    return c.json({ error: 'Missing user_id or title' }, 400);
  }

  const stmt = db.prepare('INSERT INTO projects (user_id, title) VALUES (?, ?)');
  stmt.bind([user_id, title]);
  stmt.step();
  stmt.free();

  persistDb();

  return c.json({ success: true });
});

// PUT /projects/:id
projectRoutes.put('/projects/:id', async c => {
  const id = Number(c.req.param('id'));
  const { title } = await c.req.json();

  if (!title) return c.json({ error: 'Missing title' }, 400);

  const stmt = db.prepare('UPDATE projects SET title = ? WHERE id = ?');
  stmt.bind([title, id]);
  stmt.step();
  stmt.free();

  persistDb();

  return c.json({ success: true });
});

// DELETE /projects/:id
projectRoutes.delete('/projects/:id', c => {
  const id = Number(c.req.param('id'));

  const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
  stmt.bind([id]);
  stmt.step();
  stmt.free();

  persistDb();

  return c.json({ success: true });
});
