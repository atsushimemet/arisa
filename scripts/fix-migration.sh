#!/usr/bin/env sh
set -eu

echo "=== Fixing Migration Issue ==="
echo "This script resolves the migration conflict where tables already exist."

# Mark the failed migration as applied
echo "Marking migration 20250817023012_init as applied..."
npx prisma migrate resolve --applied 20250817023012_init

echo "Checking migration status..."
npx prisma migrate status

echo "Running any pending migrations..."
npx prisma migrate deploy

echo "Migration fix completed successfully!"