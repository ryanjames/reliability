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

  const hash = await bcrypt.hash(password, 10);

  const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  stmt.bind([name, email, hash]);
  stmt.step();
  stmt.free();

  // Get the new user's ID
  const idStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  idStmt.bind([email]);
  idStmt.step();
  const [userId] = idStmt.get() as [number];
  idStmt.free();

  // Create "Inbox" project for this user
  const inboxStmt = db.prepare('INSERT INTO projects (user_id, title, is_inbox) VALUES (?, ?, 1)');
  inboxStmt.bind([userId, 'Inbox']);
  inboxStmt.step();
  inboxStmt.free();

  persistDb();

  return c.json({ success: true, userId, name, email });
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
