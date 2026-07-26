#!/bin/sh
set -e

mkdir -p /data

if [ "${RUN_MIGRATE:-true}" = "true" ]; then
  echo "Applying Prisma migrations..."
  npx prisma migrate deploy
fi

exec node dist/main.js
