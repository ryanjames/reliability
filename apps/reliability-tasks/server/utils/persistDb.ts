// server/utils/persist.ts
import { writeFileSync } from 'fs';
import db from '../db';

let timeout: NodeJS.Timeout | null = null;

export function persistDb(debounceMs = 100) {
  if (timeout) clearTimeout(timeout);

  timeout = setTimeout(() => {
    const data = db.export();
    writeFileSync('server/data.sqlite', data);
    timeout = null;
  }, debounceMs);
}
