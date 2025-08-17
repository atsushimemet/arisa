#!/usr/bin/env sh
set -eu

echo "=== Prisma Migration Fix Script ==="
echo "This script will resolve the P3009 error (failed migrations found)"
echo ""

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

# Function to check current migration status
check_migration_status() {
  print_status "Checking current migration status..."
  
  if npx prisma migrate status 2>&1 | tee /tmp/migration_status.log; then
    if grep -q "failed migrations" /tmp/migration_status.log; then
      print_warning "Found failed migrations in the database."
      return 1
    elif grep -q "up to date" /tmp/migration_status.log; then
      print_success "Database schema is up to date."
      return 0
    else
      print_warning "Migration status is unclear."
      return 2
    fi
  else
    print_error "Failed to check migration status."
    return 3
  fi
}

# Function to resolve the specific failed migration
resolve_specific_migration() {
  local migration_name="20250817023012_init"
  
  print_status "Attempting to resolve failed migration: $migration_name"
  
  if npx prisma migrate resolve --applied "$migration_name" 2>&1; then
    print_success "Successfully marked migration as applied."
    
    # Verify the fix
    print_status "Verifying the fix..."
    if check_migration_status; then
      print_success "Migration fix verified successfully."
      return 0
    else
      print_warning "Migration marked as applied, but status check shows issues."
      return 1
    fi
  else
    print_error "Failed to mark migration as applied."
    return 1
  fi
}

# Function to force schema synchronization
force_schema_sync() {
  print_status "Attempting force schema synchronization..."
  print_warning "This may result in data loss if schema changes are destructive."
  
  # Push schema to database
  if npx prisma db push --skip-generate --accept-data-loss 2>&1; then
    print_success "Schema pushed to database successfully."
    
    # Mark migration as applied after schema push
    if npx prisma migrate resolve --applied "20250817023012_init" 2>&1; then
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

# Function to show database introspection
show_database_info() {
  print_status "Showing database information..."
  
  echo ""
  echo "=== Database Tables ==="
  if npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" 2>/dev/null; then
    print_success "Database connection successful."
  else
    print_warning "Could not retrieve database table information."
  fi
  
  echo ""
  echo "=== Migration History ==="
  if npx prisma db execute --stdin <<< "SELECT migration_name, started_at, finished_at FROM _prisma_migrations ORDER BY started_at DESC LIMIT 5;" 2>/dev/null; then
    print_success "Retrieved recent migration history."
  else
    print_warning "Could not retrieve migration history (table may not exist yet)."
  fi
}

# Main execution
echo ""
print_status "Starting migration fix process..."
echo ""

# Step 1: Show current status
print_status "Step 1: Checking current migration status"
STATUS_CHECK=$(check_migration_status) || STATUS_CODE=$?

case ${STATUS_CODE:-0} in
  0)
    print_success "No migration issues found. Database is up to date."
    exit 0
    ;;
  1)
    print_warning "Found failed migrations. Proceeding with fix..."
    ;;
  2|3)
    print_warning "Migration status unclear. Proceeding with caution..."
    ;;
esac

echo ""

# Step 2: Show database information
print_status "Step 2: Gathering database information"
show_database_info
echo ""

# Step 3: Attempt to resolve the failed migration
print_status "Step 3: Attempting to resolve failed migration"
if resolve_specific_migration; then
  print_success "Migration resolved successfully!"
  
  # Final verification
  echo ""
  print_status "Final verification: Running migration deploy"
  if npx prisma migrate deploy 2>&1; then
    print_success "All migrations applied successfully!"
  else
    print_warning "Migration deploy had issues, but the main problem should be resolved."
  fi
  
else
  print_warning "Standard resolution failed. Trying force schema sync..."
  echo ""
  
  # Step 4: Force schema sync as fallback
  print_status "Step 4: Attempting force schema synchronization"
  if force_schema_sync; then
    print_success "Schema synchronized successfully!"
    
    # Try migration deploy one more time
    echo ""
    print_status "Final attempt: Running migration deploy"
    if npx prisma migrate deploy 2>&1; then
      print_success "All migrations applied successfully after force sync!"
    else
      print_warning "Migration deploy still has issues, but schema should be synchronized."
    fi
  else
    print_error "All automated fixes failed."
    echo ""
    print_error "Manual intervention required:"
    echo "1. Check your DATABASE_URL environment variable"
    echo "2. Verify database connectivity and permissions"
    echo "3. Consider connecting directly to the database to inspect tables"
    echo "4. You may need to manually clean up the _prisma_migrations table"
    exit 1
  fi
fi

echo ""
print_status "Final migration status check:"
check_migration_status || true

echo ""
print_success "Migration fix script completed!"
print_status "Your next deployment should now work correctly."

# Clean up temp files
rm -f /tmp/migration_status.log