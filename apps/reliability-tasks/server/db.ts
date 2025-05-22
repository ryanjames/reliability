import initSqlJs from 'sql.js';
import { writeFileSync, existsSync, readFileSync } from 'fs';

const SQL = await initSqlJs();
const DB_FILE = 'server/data.sqlite';

let db: InstanceType<typeof SQL.Database>;

if (existsSync(DB_FILE)) {
  const binary = readFileSync(DB_FILE);
  db = new SQL.Database(binary);
} else {
  db = new SQL.Database();
}

db.run(`PRAGMA foreign_keys = ON;`);

const res = db.exec(`SELECT name FROM sqlite_master WHERE type='table';`);
const existingTables = (res[0]?.values || []).flat() as string[];

const expectedTables = ['users', 'projects', 'tasks'];

for (const table of existingTables) {
  if (!expectedTables.includes(table)) {
    db.run(`DROP TABLE IF EXISTS ${table};`);
  }
}

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    project_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 3),
    due_date INTEGER,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );
`);

const data = db.export();
writeFileSync(DB_FILE, data);

export default db;
