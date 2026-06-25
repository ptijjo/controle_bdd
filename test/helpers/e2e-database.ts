import { execSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import * as path from 'node:path';
import { applyE2eEnv, getE2eDbPath } from './e2e-env';
import { seedE2eUser } from './seed-e2e-user';

const projectRoot = path.resolve(__dirname, '../..');

/** Réinitialise la base SQLite e2e, applique les migrations et crée le compte de test. */
export async function resetE2eDatabase(): Promise<void> {
  applyE2eEnv();
  const dbPath = getE2eDbPath();
  if (existsSync(dbPath)) {
    unlinkSync(dbPath);
  }
  execSync('npx prisma migrate deploy', {
    cwd: projectRoot,
    env: process.env,
    stdio: 'pipe',
  });
  await seedE2eUser();
}
