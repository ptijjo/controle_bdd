import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import { join } from 'path';

const testDbPath = join(process.cwd(), 'test.db');

let prisma: PrismaClient;

beforeAll(async () => {
  const sqlite = new Database(testDbPath);
  const adapter = new PrismaBetterSqlite3({ url: testDbPath });
  prisma = new PrismaClient({ adapter });

  // Créer le schéma de test manuellement
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "nom" TEXT NOT NULL,
      "prenom" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'agent',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
      "lockedUntil" DATETIME,
      "updatedAt" DATETIME NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "LoginAttempts" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "emailName" TEXT NOT NULL,
      "success" BOOLEAN NOT NULL,
      "ipAddress" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("emailName") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "IpBlock" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "ipAddress" TEXT NOT NULL UNIQUE,
      "failedAttempts" INTEGER NOT NULL DEFAULT 0,
      "blockedUntil" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `);
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Nettoyer la base de données avant chaque test
  try {
    await prisma.loginAttempts.deleteMany();
  } catch (error) {
    // Ignorer si la table n'existe pas encore
  }
  try {
    await prisma.ipBlock.deleteMany();
  } catch (error) {
    // Ignorer si la table n'existe pas encore
  }
  try {
    await prisma.user.deleteMany();
  } catch (error) {
    // Ignorer si la table n'existe pas encore
  }
});

export { prisma };
