import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import db from './db';
import { authRoutes } from './routes/auth';
import { taskRoutes } from './routes/tasks';
import { projectRoutes } from './routes/projects';
import type { TTask } from '@types';

const app = new Hono();

app.get('/api/tasks', c => {
  const userId = Number(c.req.query('userId'));
  if (!userId) return c.json({ error: 'Missing userId' }, 400);

  try {
    const result = db.exec(`SELECT * FROM tasks WHERE user_id = ${userId}`);
    if (!result.length) return c.json([]);

    const { values } = result[0];
    const tasks: TTask[] = values.map(row => ({
      id: row[0] as number,
      project_id: row[1] as number,
      user_id: row[2] as number,
      title: row[3] as string,
      description: row[4] as string,
      priority: row[5] as 1 | 2 | 3,
      due_date: row[6] as number | null,
    }));

    return c.json(tasks);
  } catch (err) {
    console.error('Error in GET /api/tasks:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.route('/api', authRoutes);
app.notFound(c => c.json({ error: 'Not found' }, 404));

app.route('/api', taskRoutes);
app.route('/api', projectRoutes);

serve({ fetch: app.fetch, port: 8787 });

console.log('Server running at http://localhost:8787');
