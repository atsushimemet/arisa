#!/usr/bin/env sh
set -eu

echo "Running database migrations..."
npx prisma migrate deploy

echo "Checking if seeding is needed..."
SEED="${SEED:-}"
if [ "$SEED" = "true" ]; then
  if [ -f "prisma/seed.ts" ]; then
    npx tsx prisma/seed.ts
  elif [ -f "prisma/seed.js" ]; then
    node prisma/seed.js
  else
    echo "No seed file found, skipping."
  fi
else
  echo "SEED is not 'true', skipping."
fi