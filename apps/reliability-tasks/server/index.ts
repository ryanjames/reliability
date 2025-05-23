import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import db from './db';
import { authRoutes } from './routes/auth';
import type { TTask } from '@types';

const app = new Hono();

app.get('/api/tasks', c => {
  try {
    const stmt = db.prepare('SELECT * FROM tasks');
    const tasks: TTask[] = [];

    while (stmt.step()) {
      const row = stmt.get() as TTask;
      tasks.push(row);
    }

    stmt.free();
    return c.json(tasks);
  } catch (err) {
    console.error('Error in GET /api/tasks:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.route('/api', authRoutes);
app.notFound(c => c.json({ error: 'Not found' }, 404));

// ✅ Modern usage of `serve()` with correct options
serve({ fetch: app.fetch, port: 8787 });

console.log('Server running at http://localhost:8787');
