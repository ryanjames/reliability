import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import db from '../db';
import { persistDb } from '../utils/persistDb';

export const authRoutes = new Hono();

/**
 * POST /auth/check
 * Checks if a user with the given email exists
 */
authRoutes.post('/auth/check', async c => {
  const { email } = await c.req.json();

  const stmt = db.prepare('SELECT 1 FROM users WHERE email = ?');
  stmt.bind([email]);
  const exists = stmt.step();
  stmt.free();

  return c.json({ exists });
});

/**
 * POST /auth/register
 * Registers a new user with name, email, and password
 */
authRoutes.post('/auth/register', async c => {
  const { name, email, password } = await c.req.json();

  // Check if user already exists
  const check = db.prepare('SELECT 1 FROM users WHERE email = ?');
  check.bind([email]);
  const exists = check.step();
  check.free();

  if (exists) {
    return c.json({ error: 'User already exists' }, 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insert = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  insert.bind([name, email, hashedPassword]);
  insert.step();
  insert.free();

  persistDb();

  // Fetch full user record for return
  const userStmt = db.prepare('SELECT id, name, email FROM users WHERE email = ?');
  userStmt.bind([email]);
  userStmt.step();
  const [id, userName, userEmail] = userStmt.get() as [number, string, string];
  userStmt.free();

  return c.json({ success: true, userId: id, name: userName, email: userEmail });
});

/**
 * POST /auth/login
 * Logs in an existing user with email and password
 */
authRoutes.post('/auth/login', async c => {
  const { email, password } = await c.req.json();

  const stmt = db.prepare('SELECT id, name, email, password FROM users WHERE email = ?');
  stmt.bind([email]);

  if (!stmt.step()) return c.json({ error: 'Invalid credentials' }, 401);

  const [id, name, userEmail, hashedPassword] = stmt.get() as [number, string, string, string];
  stmt.free();

  const passwordValid = await bcrypt.compare(password, hashedPassword);
  if (!passwordValid) return c.json({ error: 'Invalid credentials' }, 401);

  return c.json({ success: true, userId: id, name, email: userEmail });
});
