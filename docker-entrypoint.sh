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

if [ "${RUN_MIGRATE:-true}" = "true" ]; then
  echo "Applying Prisma migrations..."
  npx prisma migrate deploy
fi

exec node dist/main.js
