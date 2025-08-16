#!/bin/sh
echo "Running database migrations..."
npx prisma migrate deploy

echo "Checking if seeding is needed..."
# Check if the casts table has any data
CAST_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM casts;" 2>/dev/null || echo "0")

if [ "$CAST_COUNT" = "0" ] || [ -z "$CAST_COUNT" ]; then
  echo "Seeding database..."
  npx prisma db seed
else
  echo "Database already has data, skipping seed."
fi

echo "Database setup complete."