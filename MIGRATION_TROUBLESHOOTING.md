# Migration Troubleshooting Guide

## Problem Description

The deployment was failing with the following error:
```
ERROR: type "Area" already exists
```

This error occurs when:
1. The database already contains the `Area` enum type
2. A migration tries to create the same type again
3. Prisma migration system gets into an inconsistent state

## Root Cause Analysis

1. **Migration Name Mismatch**: The fix scripts were referencing `20250817023012_init` but the actual migration is `20250817173110_init`
2. **Database State**: The `Area` type already exists in the production database
3. **Migration State**: The migration `20250817173110_init` is marked as failed in the `_prisma_migrations` table

## Solution Implemented

### 1. Fixed Migration Names
- Updated `scripts/fix-migration.sh` to reference the correct migration name `20250817173110_init`
- Updated `scripts/migrate-and-seed.sh` to reference the correct migration name

### 2. Created Robust Migration Script
Created `scripts/migrate-and-seed-robust.sh` with:
- Database type existence checking
- Intelligent error handling for "Area already exists" error
- Colored output for better debugging
- Multiple fallback strategies

### 3. Updated Dockerfile
- Updated to use the new robust migration script
- Added execution permissions for all migration scripts

## Migration Scripts Overview

### `scripts/migrate-and-seed-robust.sh` (Primary)
- Checks if `Area` type exists before attempting migration
- Handles "Area already exists" error specifically
- Uses `prisma migrate resolve --applied` to mark failed migrations as complete
- Fallback to `prisma db push` for schema synchronization
- Colored output for better monitoring

### `scripts/migrate-production.sh` (Alternative)
- Focused specifically on production deployment issues
- Database type existence validation
- Step-by-step resolution process

### `scripts/fix-migration.sh` (Manual Fix)
- For manual intervention when automated fixes fail
- Detailed status checking and reporting

## Deployment Process

1. **Normal Migration**: Try `prisma migrate deploy`
2. **Error Detection**: Check for specific error patterns
3. **Area Exists Error**: 
   - Verify `Area` type exists in database
   - Mark migration as applied using `prisma migrate resolve`
4. **P3009 Error**: Resolve failed migrations
5. **Fallback**: Use `prisma db push` for schema sync
6. **Final Step**: Generate Prisma client and run seeds

## Manual Resolution (if needed)

If automated fixes fail, connect to the database and run:

```sql
-- Check if Area type exists
SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Area');

-- Check migration history
SELECT migration_name, started_at, finished_at, logs 
FROM _prisma_migrations 
ORDER BY started_at DESC 
LIMIT 10;

-- If needed, manually mark migration as completed
-- (This should be done through Prisma CLI, not directly)
```

Then use:
```bash
npx prisma migrate resolve --applied 20250817173110_init
```

## Prevention

1. Always test migrations in staging environment first
2. Use `prisma db push` for development, `prisma migrate` for production
3. Backup database before major schema changes
4. Monitor migration logs during deployment

## Testing the Fix

To test the fix locally:
```bash
# Run the robust migration script
./scripts/migrate-and-seed-robust.sh

# Or test the production script
./scripts/migrate-production.sh
```

## Monitoring

The scripts now provide colored output:
- 🔵 **INFO**: General information
- 🟢 **SUCCESS**: Successful operations
- 🟡 **WARNING**: Non-critical issues
- 🔴 **ERROR**: Critical failures

Watch for these patterns in deployment logs to quickly identify and resolve issues.