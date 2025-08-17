#!/usr/bin/env sh
set -eu

echo "Running database migrations..."

# Try to run migrations, and if it fails due to existing tables, resolve the conflict
if ! npx prisma migrate deploy 2>&1; then
  echo "Migration failed. Checking if it's due to existing tables..."
  
  # Check migration status to see if there are failed migrations
  if npx prisma migrate status | grep -q "failed migrations"; then
    echo "Found failed migrations. Attempting to resolve by marking init migration as applied..."
    
    # Mark the failed init migration as applied since tables already exist
    npx prisma migrate resolve --applied 20250817023012_init
    
    echo "Migration marked as applied. Running migrations again..."
    npx prisma migrate deploy
  else
    echo "Migration failed for unknown reason. Exiting."
    exit 1
  fi
fi

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