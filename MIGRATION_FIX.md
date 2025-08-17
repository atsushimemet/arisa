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
4. Prisma marks the migration as failed, preventing future migrations

## Root Cause
The database was likely set up manually or from a previous deployment, but the migration history wasn't properly synchronized with the production database. This creates a state where:
- Database tables exist physically
- Prisma's migration history doesn't reflect this state
- New deployments fail because Prisma thinks it needs to create existing tables

## Solution Options

### Option 1: Automatic Fix (Recommended)
The deployment script has been **enhanced** to automatically handle this issue with multiple fallback strategies:

- `scripts/migrate-and-seed.sh` now includes:
  - Intelligent detection of failed migrations
  - Automatic resolution with verification
  - Multiple fallback approaches if the first fix fails
  - Schema push as a last resort with proper migration marking

**The script will now try these approaches in order:**
1. Normal migration deployment
2. Mark failed migration as applied and retry
3. Schema push + migration resolution if needed

### Option 2: Manual Fix
Use the **improved** dedicated script for manual resolution:
```bash
./scripts/fix-migration.sh
```

This enhanced script:
1. Shows current migration status
2. Attempts database introspection
3. Marks migration `20250817023012_init` as applied
4. Verifies the fix worked
5. Runs any pending migrations
6. Provides clear success/failure feedback

### Option 3: Alternative Approaches (If Options 1-2 Fail)

If the automatic fixes don't work, you can try these alternatives:

#### 3a. Reset and Recreate Migration (DANGEROUS - Data Loss Risk)
```bash
# Only use this if you're okay with potentially losing data
npx prisma migrate reset --force
npx prisma db push
```

#### 3b. Manual Database Sync
```bash
# Push the current schema without migrations
npx prisma db push --skip-generate --accept-data-loss
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

## Render Configuration Improvements

The `render.yaml` has been updated with additional environment variables for better Prisma compatibility:
- `PRISMA_CLI_QUERY_ENGINE_TYPE=binary` - Ensures consistent query engine
- `PRISMA_GENERATE_SKIP_AUTOINSTALL=true` - Prevents installation conflicts

## Prevention
To prevent this issue in the future:
1. Always use `prisma migrate deploy` for production deployments
2. Keep migration history synchronized between environments
3. Document any manual database changes
4. Use the improved deployment script that handles conflicts automatically

## Verification
After applying the fix, verify that:
1. `npx prisma migrate status` shows "Database schema is up to date!"
2. All tables exist in the database
3. The application starts successfully
4. No data is lost

## Troubleshooting

If you continue to see migration failures:

1. **Check database connectivity**: Ensure DATABASE_URL is correct
2. **Verify permissions**: Database user needs CREATE/ALTER permissions
3. **Check Render logs**: Look for more specific error messages
4. **Manual intervention**: Connect directly to Supabase and check table structure

## Files Modified
- `scripts/migrate-and-seed.sh` - **Enhanced** with multiple fallback strategies
- `scripts/fix-migration.sh` - **Improved** with better diagnostics and feedback
- `render.yaml` - Added Prisma-specific environment variables for better compatibility

## Quick Fix Commands

For immediate resolution, run one of these:

```bash
# Option 1: Use the automatic fix script
./scripts/fix-migration.sh

# Option 2: Manual resolution
npx prisma migrate resolve --applied 20250817023012_init
npx prisma migrate deploy

# Option 3: Force schema sync (if above fails)
npx prisma db push --skip-generate --accept-data-loss
npx prisma migrate resolve --applied 20250817023012_init
```