import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

// Utiliser une base de données de test séparée
const TEST_DATABASE_URL = 'file:./test.db';

let prisma: PrismaClient;

// Nettoyer la base de données de test si elle existe
if (existsSync('./test.db')) {
  try {
    unlinkSync('./test.db');
  } catch (error) {
    // Ignorer les erreurs de suppression
  }
}

beforeAll(async () => {
  // Créer une nouvelle instance Prisma pour les tests
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: TEST_DATABASE_URL,
      },
    },
  });

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
  // Nettoyer la base de données de test après tous les tests
  if (existsSync('./test.db')) {
    try {
      unlinkSync('./test.db');
    } catch (error) {
      // Ignorer les erreurs de suppression
    }
  }
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
