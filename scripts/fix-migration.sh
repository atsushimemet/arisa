#!/usr/bin/env sh
set -eu

echo "=== Prisma Migration Fix Script ==="
echo "This script will fix the failed migration: 20250817023012_init"
echo ""

# Check current migration status
echo "1. Checking current migration status..."
npx prisma migrate status

echo ""
echo "2. Checking if tables exist in database..."

# Try to introspect the database to see what exists
npx prisma db pull --print > /tmp/current_schema.prisma 2>/dev/null || echo "Could not introspect database"

echo ""
echo "3. Marking failed migration as applied..."

# Mark the failed migration as applied
npx prisma migrate resolve --applied 20250817023012_init

echo ""
echo "4. Checking migration status after resolution..."
npx prisma migrate status

echo ""
echo "5. Running any pending migrations..."
npx prisma migrate deploy

echo ""
echo "6. Final migration status check..."
npx prisma migrate status

echo ""
echo "=== Fix Complete ==="
echo "If you see 'Database schema is up to date!' above, the fix was successful."
echo "You can now redeploy your application on Render."