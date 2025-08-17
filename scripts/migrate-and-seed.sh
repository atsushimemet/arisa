#!/usr/bin/env sh
set -eu

echo "Running database migrations..."

# Function to check if migration failed due to existing tables
check_migration_status() {
  npx prisma migrate status 2>&1 | grep -q "failed migrations"
}

# Function to mark failed migration as applied
resolve_failed_migration() {
  echo "Marking failed migration as applied..."
  npx prisma migrate resolve --applied 20250817023012_init
  
  # Verify the resolution was successful
  if ! npx prisma migrate status 2>&1 | grep -q "failed migrations"; then
    echo "Migration successfully marked as applied."
    return 0
  else
    echo "Failed to mark migration as applied."
    return 1
  fi
}

# First attempt: Try normal migration
echo "Attempting normal migration..."
if npx prisma migrate deploy 2>&1; then
  echo "Migration completed successfully."
else
  echo "Migration failed. Checking status..."
  
  # Check if it's a failed migration issue
  if check_migration_status; then
    echo "Found failed migrations. Attempting to resolve..."
    
    # Try to resolve the failed migration
    if resolve_failed_migration; then
      echo "Running migrations again after resolution..."
      if npx prisma migrate deploy 2>&1; then
        echo "Migration completed successfully after resolution."
      else
        echo "Migration still failed after resolution. Trying alternative approach..."
        
        # Alternative: Push schema directly and then resolve
        echo "Pushing schema to database..."
        npx prisma db push --skip-generate --accept-data-loss
        
        echo "Marking migration as applied after schema push..."
        npx prisma migrate resolve --applied 20250817023012_init
        
        echo "Final migration attempt..."
        npx prisma migrate deploy
      fi
    else
      echo "Failed to resolve migration. Trying schema push approach..."
      npx prisma db push --skip-generate --accept-data-loss
      npx prisma migrate resolve --applied 20250817023012_init
    fi
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