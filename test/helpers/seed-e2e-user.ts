import * as bcrypt from 'bcrypt';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient, Role } from '../../src/generated/prisma/client.js';
import { E2E_SEEDER_EMAIL, E2E_SEEDER_PASSWORD } from './e2e-env';

/** Crée le compte e2e une fois après migration (évite le seeder au démarrage de chaque app). */
export async function seedE2eUser(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL manquant pour seed e2e');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url }),
  });

  try {
    await prisma.$connect();
    const email = E2E_SEEDER_EMAIL;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return;
    }

    const hashed = await bcrypt.hash(E2E_SEEDER_PASSWORD, 4);
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        nom: 'Controleur',
        prenom: 'Seeder',
        role: Role.controleur,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
