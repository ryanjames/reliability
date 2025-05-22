import { createServer } from 'http';
import db from './db';

const server = createServer((req, res) => {
  if (req.url === '/api/tasks' && req.method === 'GET') {
    const stmt = db.prepare('SELECT * FROM tasks');
    const tasks: unknown[] = [];

    while (stmt.step()) {
      tasks.push(stmt.get());
    }

    stmt.free();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(8787, () => {
  console.log('Server running at http://localhost:8787');
});
