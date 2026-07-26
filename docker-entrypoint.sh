#!/bin/sh
set -e

mkdir -p /data

# Prisma SQLite exige le scheme "file:". Coolify injecte parfois
# un chemin nu ou une valeur vide → P1013 (scheme not recognized).
DEFAULT_DB_URL="file:///data/db.sqlite"

if [ -z "${DATABASE_URL}" ] || [ "${DATABASE_URL}" = "undefined" ]; then
  export DATABASE_URL="${DEFAULT_DB_URL}"
  echo "DATABASE_URL absent → défaut ${DEFAULT_DB_URL}"
fi

case "${DATABASE_URL}" in
  file:*|prisma+*|postgresql:*|postgres:*)
    ;;
  *)
    export DATABASE_URL="file:${DATABASE_URL}"
    echo "DATABASE_URL sans scheme → préfixe file: appliqué"
    ;;
esac

# Marque comme "applied" les migrations en échec (P3009), typique
# après copie d'une SQLite locale dont le schéma est déjà à jour.
resolve_failed_migrations() {
  case "${DATABASE_URL}" in
    file:*)
      ;;
    *)
      return 0
      ;;
  esac

  node <<'NODE'
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const raw = process.env.DATABASE_URL || '';
let dbPath = raw.replace(/^file:/, '');
if (dbPath.startsWith('///')) dbPath = dbPath.slice(2);
else if (dbPath.startsWith('//')) dbPath = dbPath.slice(1);
if (!path.isAbsolute(dbPath)) dbPath = path.resolve(process.cwd(), dbPath);

if (!fs.existsSync(dbPath)) process.exit(0);

let Database;
try {
  Database = require('better-sqlite3');
} catch {
  process.exit(0);
}

const db = new Database(dbPath, { readonly: true });
const failed = db
  .prepare(
    `SELECT migration_name FROM _prisma_migrations
     WHERE finished_at IS NULL AND rolled_back_at IS NULL`,
  )
  .all();
db.close();

for (const row of failed) {
  const name = row.migration_name;
  console.log(`Resolving failed migration as applied: ${name}`);
  execSync(`npx prisma migrate resolve --applied "${name}"`, {
    stdio: 'inherit',
    env: process.env,
  });
}
NODE
}

if [ "${RUN_MIGRATE:-true}" = "true" ]; then
  echo "Applying Prisma migrations..."
  if ! npx prisma migrate deploy; then
    echo "migrate deploy a échoué — tentative de recovery P3009..."
    resolve_failed_migrations
    npx prisma migrate deploy
  fi
else
  echo "RUN_MIGRATE=false — migrations ignorées"
fi

exec node dist/main.js
