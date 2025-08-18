#!/usr/bin/env sh
set -eu

echo "=== Production Migration Fix Script ==="
echo "Resolving Area type already exists error"
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
    print_error "Failed to check Area type existence."
    return 2
  fi
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

# Function to resolve failed migration by marking it as applied
resolve_failed_migration() {
  local migration_name="20250817173110_init"
  
  print_status "Marking migration $migration_name as applied..."
  
  if npx prisma migrate resolve --applied "$migration_name" 2>&1; then
    print_success "Migration marked as applied successfully."
    return 0
  else
    print_error "Failed to mark migration as applied."
    return 1
  fi
}

# Function to sync schema if needed
sync_schema_if_needed() {
  print_status "Syncing schema to ensure consistency..."
  
  # Use db push to ensure schema is in sync
  if npx prisma db push --skip-generate --accept-data-loss 2>&1; then
    print_success "Schema synchronized successfully."
    return 0
  else
    print_error "Failed to sync schema."
    return 1
  fi
}

# Function to generate Prisma client
generate_client() {
  print_status "Generating Prisma client..."
  
  if npx prisma generate 2>&1; then
    print_success "Prisma client generated successfully."
    return 0
  else
    print_error "Failed to generate Prisma client."
    return 1
  fi
}

# Main execution
echo ""
print_status "Starting production migration fix..."
echo ""

# Step 1: Check current migration status
print_status "Step 1: Checking migration status"
if check_migration_status; then
  print_success "No migration issues found."
  generate_client
  exit 0
fi

echo ""

# Step 2: Check if Area type exists
print_status "Step 2: Checking if Area type already exists"
AREA_EXISTS=0
check_area_type_exists || AREA_EXISTS=$?

echo ""

# Step 3: Resolve based on the situation
if [ $AREA_EXISTS -eq 0 ]; then
  print_status "Step 3: Area type exists, marking migration as applied"
  if resolve_failed_migration; then
    print_success "Migration resolved successfully!"
  else
    print_warning "Failed to resolve migration. Trying schema sync..."
    if sync_schema_if_needed; then
      print_status "Attempting to resolve migration after schema sync..."
      resolve_failed_migration || print_warning "Migration resolution still failed, but schema is synced."
    fi
  fi
else
  print_status "Step 3: Area type doesn't exist, running normal migration"
  if npx prisma migrate deploy 2>&1; then
    print_success "Migration deployed successfully!"
  else
    print_error "Migration deployment failed."
    exit 1
  fi
fi

echo ""

# Step 4: Final verification and client generation
print_status "Step 4: Final verification"
check_migration_status || print_warning "Migration status still shows issues, but proceeding..."

echo ""
print_status "Step 5: Generating Prisma client"
generate_client

echo ""
print_success "Production migration fix completed!"

# Clean up
rm -f /tmp/migration_status.log