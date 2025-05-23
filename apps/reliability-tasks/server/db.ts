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

// -- Schema Definitions --
const schema: Record<string, { createSQL: string; columns: string[] }> = {
  users: {
    createSQL: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `,
    columns: ['id', 'name', 'email', 'password'],
  },
  projects: {
    createSQL: `
      CREATE TABLE projects (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `,
    columns: ['id', 'user_id', 'title'],
  },
  tasks: {
    createSQL: `
      CREATE TABLE tasks (
        id INTEGER PRIMARY KEY,
        project_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 3),
        due_date INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `,
    columns: ['id', 'project_id', 'user_id', 'title', 'description', 'priority', 'due_date'],
  },
};

// -- Existing Tables --
const tableRes = db.exec(`SELECT name FROM sqlite_master WHERE type='table';`);
const existingTables = (tableRes[0]?.values || []).flat() as string[];

// -- Remove unexpected tables --
for (const table of existingTables) {
  if (!schema[table]) {
    db.run(`DROP TABLE IF EXISTS ${table};`);
  }
}

// -- Sync each expected table --
for (const [table, { createSQL, columns }] of Object.entries(schema)) {
  const exists = existingTables.includes(table);

  if (!exists) {
    db.run(createSQL);
    continue;
  }

  // Check if columns match
  const colRes = db.exec(`PRAGMA table_info(${table});`);
  const existingCols = (colRes[0]?.values || []).map(row => row[1]) as string[];
  const sortedExisting = [...existingCols].sort().join(',');
  const sortedExpected = [...columns].sort().join(',');

  if (sortedExisting === sortedExpected) continue;

  // Schema mismatch — rename and recreate
  const temp = `__old_${table}`;
  db.run(`ALTER TABLE ${table} RENAME TO ${temp};`);
  db.run(createSQL);

  const commonCols = columns.filter(c => existingCols.includes(c));
  const colList = commonCols.join(', ');
  try {
    db.run(`INSERT INTO ${table} (${colList}) SELECT ${colList} FROM ${temp};`);
  } catch (err: unknown) {
    console.warn(`⚠️ Failed to migrate data for table '${table}':`, err);
  }

  db.run(`DROP TABLE ${temp};`);
}

const data = db.export();
writeFileSync(DB_FILE, data);

export default db;
