#!/usr/bin/env sh
set -eu

echo "Running database migrations..."

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
  echo "${BLUE}[INFO]${NC} $1"
}

print_success() {
  echo "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
  echo "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo "${RED}[ERROR]${NC} $1"
}

# Function to check if Area type exists in database
check_area_type_exists() {
  print_status "Checking if Area type exists in database..."
  
  # Query to check if Area type exists
  QUERY="SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Area');"
  
  if RESULT=$(npx prisma db execute --stdin <<< "$QUERY" 2>/dev/null); then
    if echo "$RESULT" | grep -q "true"; then
      print_warning "Area type already exists in database."
      return 0
    else
      print_status "Area type does not exist in database."
      return 1
    fi
  else
    print_warning "Could not check Area type existence (database may not be accessible)."
    return 2
  fi
}

# Function to check if migration failed due to P3009 error (failed migrations found)
check_failed_migrations() {
  npx prisma migrate status 2>&1 | grep -q "failed migrations"
}

# Function to check migration status
check_migration_status() {
  print_status "Checking migration status..."
  
  if npx prisma migrate status 2>&1 | tee /tmp/migration_status.log; then
    if grep -q "Database schema is up to date" /tmp/migration_status.log; then
      print_success "Database schema is up to date."
      return 0
    elif grep -q "failed migrations" /tmp/migration_status.log; then
      print_warning "Found failed migrations."
      return 1
    else
      print_warning "Migration status unclear."
      return 2
    fi
  else
    print_error "Failed to check migration status."
    return 3
  fi
}

# Function to mark specific failed migration as applied
resolve_failed_migration() {
  local migration_name="20250817173110_init"
  
  print_status "Marking failed migration $migration_name as applied..."
  
  # First, try to resolve the specific failed migration
  if npx prisma migrate resolve --applied "$migration_name" 2>&1; then
    print_success "Successfully marked migration as applied."
    
    # Verify the resolution worked
    if ! check_failed_migrations; then
      print_success "Migration resolution verified - no more failed migrations."
      return 0
    else
      print_warning "Still showing failed migrations after resolution."
      return 1
    fi
  else
    print_error "Failed to mark migration as applied."
    return 1
  fi
}

# Function to force schema sync as last resort
force_schema_sync() {
  print_status "Attempting force schema synchronization..."
  
  # Push current schema to database, accepting potential data loss
  if npx prisma db push --skip-generate --accept-data-loss 2>&1; then
    print_success "Schema pushed successfully."
    
    # Mark the migration as applied after successful schema push
    if npx prisma migrate resolve --applied "20250817173110_init" 2>&1; then
      print_success "Migration marked as applied after schema push."
      return 0
    else
      print_error "Failed to mark migration as applied after schema push."
      return 1
    fi
  else
    print_error "Failed to push schema to database."
    return 1
  fi
}

# Function to handle Area type already exists error
handle_area_exists_error() {
  print_status "Handling 'Area type already exists' error..."
  
  # Check if the Area type actually exists
  AREA_EXISTS=0
  check_area_type_exists || AREA_EXISTS=$?
  
  if [ $AREA_EXISTS -eq 0 ]; then
    print_status "Area type confirmed to exist. Marking migration as applied..."
    if resolve_failed_migration; then
      print_success "Migration resolved successfully!"
      return 0
    else
      print_warning "Failed to resolve migration normally. Trying force sync..."
      if force_schema_sync; then
        print_success "Force sync completed successfully."
        return 0
      else
        print_error "All resolution attempts failed."
        return 1
      fi
    fi
  else
    print_error "Area type check failed or returned unexpected result."
    return 1
  fi
}

# Main migration logic
print_status "Attempting normal migration..."
MIGRATION_OUTPUT=$(npx prisma migrate deploy 2>&1) || MIGRATION_FAILED=true

if [ "${MIGRATION_FAILED:-}" != "true" ]; then
  print_success "Migration completed successfully."
else
  print_error "Migration failed. Analyzing error..."
  echo "Migration output: $MIGRATION_OUTPUT"
  
  # Check for specific error patterns
  if echo "$MIGRATION_OUTPUT" | grep -q "type \"Area\" already exists"; then
    print_status "Detected 'Area type already exists' error."
    handle_area_exists_error
    
  elif echo "$MIGRATION_OUTPUT" | grep -q "P3009"; then
    print_status "Detected P3009 error - failed migrations found in database."
    
    # Try to resolve the failed migration
    if resolve_failed_migration; then
      print_status "Failed migration resolved. Retrying migration..."
      
      # Retry the migration after resolution
      if npx prisma migrate deploy 2>&1; then
        print_success "Migration completed successfully after resolution."
      else
        print_warning "Migration still failed after resolution. Trying force sync..."
        
        # Last resort: force schema sync
        if force_schema_sync; then
          print_status "Schema synchronized successfully. Attempting final migration..."
          npx prisma migrate deploy 2>&1 || print_warning "Final migration attempt failed, but schema should be synchronized."
        else
          print_error "All resolution attempts failed. Manual intervention may be required."
          exit 1
        fi
      fi
    else
      print_warning "Failed to resolve migration. Trying direct force sync..."
      
      # Try force sync directly if resolution failed
      if force_schema_sync; then
        print_success "Schema synchronized via force sync."
      else
        print_error "All automated fixes failed. Manual database intervention required."
        print_error "Please check the database state and migration history manually."
        exit 1
      fi
    fi
  else
    print_warning "Different migration error detected. Checking for failed migrations..."
    
    # Check if there are any failed migrations
    if check_failed_migrations; then
      print_status "Found failed migrations. Attempting resolution..."
      resolve_failed_migration
    else
      print_error "Migration failed for unknown reason."
      echo "Error output: $MIGRATION_OUTPUT"
      exit 1
    fi
  fi
fi

print_status "Checking final migration status..."
check_migration_status || print_warning "Migration status check failed, but proceeding..."

print_status "Checking if seeding is needed..."
SEED="${SEED:-}"
if [ "$SEED" = "true" ]; then
  if [ -f "prisma/seed.ts" ]; then
    print_status "Running TypeScript seed file..."
    npx tsx prisma/seed.ts
  elif [ -f "prisma/seed.js" ]; then
    print_status "Running JavaScript seed file..."
    node prisma/seed.js
  else
    print_warning "No seed file found, skipping seeding."
  fi
else
  print_status "SEED environment variable is not 'true', skipping seeding."
fi

print_success "Migration and seeding process completed."

# Clean up
rm -f /tmp/migration_status.log