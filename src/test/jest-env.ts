/** Avant tout import de @config (JWT, etc.) et de Prisma (écrase chaînes vides venant du .env) */
if (!process.env.SECRET_KEY?.trim()) {
  process.env.SECRET_KEY = 'jest-test-secret-key-at-least-32-characters-long!';
}
if (!process.env.SECRET_KEY_INVITATION?.trim()) {
  process.env.SECRET_KEY_INVITATION = 'jest-test-invitation-secret-32-chars-min!';
}
if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = 'file:./test.db';
}
/** Aligné sur les attentes des tests sécurité / auth (évite undefined → pas de verrouillage) */
if (!process.env.NUMBER_OF_FAIL_BEFORE_LOCK?.trim()) {
  process.env.NUMBER_OF_FAIL_BEFORE_LOCK = '5';
}
if (!process.env.TIME_LOCK?.trim()) {
  process.env.TIME_LOCK = '30';
}
