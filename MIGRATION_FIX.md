# Migration Fix Documentation

## Issue
During deployment on Render, the Prisma migration `20250817023012_init` fails with error:
```
ERROR: relation "casts" already exists
Database error code: 42P07
```

This happens because:
1. The Supabase database already has the `casts`, `area_masters`, and `admins` tables
2. The migration tries to create these tables again
3. PostgreSQL throws an error because the tables already exist

## Root Cause
The database was likely set up manually or from a previous deployment, but the migration history wasn't properly synchronized with the production database.

## Solution Options

### Option 1: Automatic Fix (Recommended)
The deployment script has been updated to automatically handle this issue:
- `scripts/migrate-and-seed.sh` now detects failed migrations
- Automatically marks the conflicting migration as applied
- Continues with normal migration process

### Option 2: Manual Fix
If you need to fix this manually, use the dedicated script:
```bash
./scripts/fix-migration.sh
```

This script:
1. Marks migration `20250817023012_init` as applied
2. Checks migration status
3. Runs any pending migrations

### Option 3: Alternative Approaches (If Options 1-2 Fail)

If the automatic fixes don't work, you can try these alternatives:

#### 3a. Reset and Recreate Migration
```bash
# Only use this if you're okay with potentially losing data
npx prisma migrate reset --force
npx prisma db push
```

#### 3b. Manual Database Sync
```bash
# Push the current schema without migrations
npx prisma db push --skip-generate
# Then mark migration as applied
npx prisma migrate resolve --applied 20250817023012_init
```

#### 3c. Create New Migration
If the existing migration is corrupted:
```bash
# Delete the problematic migration
rm -rf prisma/migrations/20250817023012_init
# Create a new migration
npx prisma migrate dev --name init_fixed
```

## Prevention
To prevent this issue in the future:
1. Always use `prisma migrate deploy` for production deployments
2. Keep migration history synchronized between environments
3. Document any manual database changes

## Verification
After applying the fix, verify that:
1. `npx prisma migrate status` shows no failed migrations
2. All tables exist in the database
3. The application starts successfully
4. No data is lost

## Files Modified
- `scripts/migrate-and-seed.sh` - Updated to handle migration conflicts automatically
- `scripts/fix-migration.sh` - New script for manual migration fixing