import * as path from 'node:path';

const projectRoot = path.resolve(__dirname, '../..');

/** Variables d’environnement pour les tests e2e (base SQLite dédiée). */
export function applyE2eEnv(): void {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = `file:${path.join(projectRoot, 'prisma', 'e2e.sqlite')}`;
  process.env.PORT = '0';
  process.env.ORIGIN = 'http://localhost:3000';
  process.env.CREDENTIALS = 'true';

  process.env.ACCESS_TOKEN_SECRET = 'e2e-access-token-secret';
  process.env.REFRESH_TOKEN_SECRET = 'e2e-refresh-token-secret';
  process.env.SECRET_KEY_INVITATION = 'e2e-invitation-secret';
  process.env.ACCESS_TOKEN_EXPIRES_SEC = '900';
  process.env.REFRESH_TOKEN_EXPIRES_SEC = '604800';
  process.env.INVITATION_TOKEN_EXPIRES_SEC = '86400';
  process.env.LOGIN_IP_FAIL_BEFORE_BLOCK = '3';
  process.env.LOGIN_IP_BLOCK_MINUTES = '30';
  process.env.LOGIN_FAIL_BEFORE_ACCOUNT_LOCK = '3';
  process.env.LOGIN_ACCOUNT_LOCK_MINUTES = '30';

  process.env.EMAIL_SEEDER = 'e2e-admin@test.local';
  process.env.PASSWORD_SEEDER = 'E2ePassword123!';
  process.env.SALT_ROUNDS = '4';

  process.env.MJ_APIKEY_PUBLIC = 'e2e-mailjet-public';
  process.env.MJ_APIKEY_PRIVATE = 'e2e-mailjet-private';
  process.env.EMAIL = 'noreply@e2e.test.local';
  process.env.Marin = 'chef-secteur@e2e.test.local';
  process.env.FRONT_END = 'http://localhost:3000/enregistrement';

  process.env.THROTTLE_LIMIT = '10000';
  process.env.THROTTLE_TTL_MS = '60000';
}

export function getE2eDbPath(): string {
  return path.join(projectRoot, 'prisma', 'e2e.sqlite');
}

export const E2E_SEEDER_EMAIL = 'e2e-admin@test.local';
export const E2E_SEEDER_PASSWORD = 'E2ePassword123!';
