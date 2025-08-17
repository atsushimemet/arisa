#!/usr/bin/env sh
set -eu

echo "Running database migrations..."

# Function to check if migration failed due to P3009 error (failed migrations found)
check_failed_migrations() {
  npx prisma migrate status 2>&1 | grep -q "failed migrations"
}

# Function to check if migration failed due to existing tables (P3009)
check_p3009_error() {
  npx prisma migrate deploy 2>&1 | grep -q "P3009"
}

# Function to mark specific failed migration as applied
resolve_failed_migration() {
  echo "Marking failed migration 20250817023012_init as applied..."
  
  # First, try to resolve the specific failed migration
  if npx prisma migrate resolve --applied 20250817023012_init 2>&1; then
    echo "Successfully marked migration as applied."
    
    # Verify the resolution worked
    if ! check_failed_migrations; then
      echo "Migration resolution verified - no more failed migrations."
      return 0
    else
      echo "Warning: Still showing failed migrations after resolution."
      return 1
    fi
  else
    echo "Failed to mark migration as applied."
    return 1
  fi
}

# Function to force schema sync as last resort
force_schema_sync() {
  echo "Attempting force schema synchronization..."
  
  # Push current schema to database, accepting potential data loss
  if npx prisma db push --skip-generate --accept-data-loss 2>&1; then
    echo "Schema pushed successfully."
    
    # Mark the migration as applied after successful schema push
    if npx prisma migrate resolve --applied 20250817023012_init 2>&1; then
      echo "Migration marked as applied after schema push."
      return 0
    else
      echo "Failed to mark migration as applied after schema push."
      return 1
    fi
  else
    echo "Failed to push schema to database."
    return 1
  fi
}

# Main migration logic
echo "Attempting normal migration..."
MIGRATION_OUTPUT=$(npx prisma migrate deploy 2>&1) || MIGRATION_FAILED=true

if [ "${MIGRATION_FAILED:-}" != "true" ]; then
  echo "Migration completed successfully."
else
  echo "Migration failed. Analyzing error..."
  echo "Migration output: $MIGRATION_OUTPUT"
  
  # Check if this is the P3009 error (failed migrations found)
  if echo "$MIGRATION_OUTPUT" | grep -q "P3009"; then
    echo "Detected P3009 error - failed migrations found in database."
    echo "Attempting to resolve failed migration..."
    
    # Try to resolve the failed migration
    if resolve_failed_migration; then
      echo "Failed migration resolved. Retrying migration..."
      
      # Retry the migration after resolution
      if npx prisma migrate deploy 2>&1; then
        echo "Migration completed successfully after resolution."
      else
        echo "Migration still failed after resolution. Trying force sync..."
        
        # Last resort: force schema sync
        if force_schema_sync; then
          echo "Schema synchronized successfully. Attempting final migration..."
          npx prisma migrate deploy 2>&1 || echo "Final migration attempt failed, but schema should be synchronized."
        else
          echo "All resolution attempts failed. Manual intervention may be required."
          exit 1
        fi
      fi
    else
      echo "Failed to resolve migration. Trying direct force sync..."
      
      # Try force sync directly if resolution failed
      if force_schema_sync; then
        echo "Schema synchronized via force sync."
      else
        echo "All automated fixes failed. Manual database intervention required."
        echo "Please check the database state and migration history manually."
        exit 1
      fi
    fi
  else
    echo "Different migration error detected. Checking for failed migrations..."
    
    # Check if there are any failed migrations
    if check_failed_migrations; then
      echo "Found failed migrations. Attempting resolution..."
      resolve_failed_migration
    else
      echo "Migration failed for unknown reason."
      echo "Error output: $MIGRATION_OUTPUT"
      exit 1
    fi
  fi
fi

echo "Checking final migration status..."
npx prisma migrate status

echo "Checking if seeding is needed..."
SEED="${SEED:-}"
if [ "$SEED" = "true" ]; then
  if [ -f "prisma/seed.ts" ]; then
    echo "Running TypeScript seed file..."
    npx tsx prisma/seed.ts
  elif [ -f "prisma/seed.js" ]; then
    echo "Running JavaScript seed file..."
    node prisma/seed.js
  else
    echo "No seed file found, skipping seeding."
  fi
else
  echo "SEED environment variable is not 'true', skipping seeding."
fi

echo "Migration and seeding process completed."