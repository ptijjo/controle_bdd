import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import Database from "better-sqlite3";
import path from "path";
import { existsSync, mkdirSync } from "fs";

// Dans Prisma 7, il faut utiliser un adapter pour SQLite
// L'URL de la base de données vient de prisma.config.ts via DATABASE_URL ou directement
function getConnectionString(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== "") {
    return envUrl;
  }
  // Chemin par défaut : depuis src/utils vers prisma/dev.db
  return "file:../../prisma/dev.db";
}

const connectionString = getConnectionString();

// Créer l'adapter SQLite
// Enlever le préfixe "file:" pour better-sqlite3
if (!connectionString || typeof connectionString !== 'string') {
  throw new Error(`DATABASE_URL is not properly configured. Got: ${typeof connectionString}`);
}

let dbPath = connectionString.replace("file:", "");

// Si le chemin est relatif (commence par ../), le résoudre depuis la racine du projet
if (dbPath.startsWith("../")) {
  // Le chemin dans prisma.config.ts est relatif depuis src/prisma/schema.prisma
  // Donc ../../prisma/dev.db depuis src/prisma devient prisma/dev.db depuis la racine
  dbPath = dbPath.replace(/^\.\.\/\.\.\//, "");
}

// Résoudre le chemin depuis le répertoire de travail (racine du projet)
const resolvedPath = path.resolve(process.cwd(), dbPath);

// S'assurer que le répertoire parent existe
const dbDir = path.dirname(resolvedPath);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Créer l'instance Database
const sqlite = new Database(resolvedPath);

// Dans Prisma 7.2.0, l'adapter peut être créé avec l'instance Database
// ou avec l'URL directement. Essayons avec l'instance Database d'abord.
const adapter = new PrismaBetterSqlite3({ url: resolvedPath });

// Créer le client Prisma avec l'adapter
const prisma = new PrismaClient({
  adapter: adapter,
});

export default prisma;
