# Database Migration Guide

## User Data Isolation Update

This migration adds user-level data isolation to ensure each user only sees their own products and transactions.

## What Changed

### Database Schema Updates:
1. **Product Model**: Added `userId` field (required, indexed)
2. **Transaction Model**: Added `userId` field (required, indexed)
3. **Product Name Uniqueness**: Changed from global unique to unique per user

### Backend Changes:
- All product operations now filter by authenticated user's ID
- Product creation assigns current user as owner
- Transactions record which user performed them
- API endpoints return only user-specific data

### Frontend Changes:
- Login/register now clear all previous localStorage data
- Logout properly clears all cached user data
- Force page reload on logout to prevent data leakage

## Migration Steps

### 1. Run the Migration Script

The migration script will:
- Add `userId` to all existing products
- Add `userId` to all existing transactions
- Assign existing data to the first user in the database
- Update database indexes

```powershell
# From project root directory
node backend/scripts/migrate-add-userid.js
```

### 2. Restart the Server

After migration, restart your server:

```powershell
npm start
```

### 3. Clear Browser Data (Important!)

Each user should:
1. **Log out** from all sessions
2. **Clear browser localStorage**: 
   - Open DevTools (F12)
   - Go to Application/Storage tab
   - Click "Clear site data" or manually delete `inv_token` and `inv_user`
3. **Log in again** with their credentials

## Testing the Migration

### Test 1: User A Creates Products
1. Register/login as User A (e.g., `usera@test.com`)
2. Create some products (e.g., "Laptop", "Mouse")
3. Make some buy/sell transactions
4. Log out

### Test 2: User B Has Empty Dashboard
1. Register/login as User B (e.g., `userb@test.com`)
2. Verify the products page is empty (no products from User A)
3. Create different products (e.g., "Phone", "Tablet")
4. Log out

### Test 3: User A Still Has Their Data
1. Log back in as User A
2. Verify all User A's products are still there
3. Verify User B's products are NOT visible
4. Transactions should only show User A's activities

## What This Fixes

### Before Migration:
❌ All users saw the same products
❌ User B could sell User A's products
❌ Transaction history was shared across all users
❌ Product names had to be globally unique

### After Migration:
✅ Each user sees only their own products
✅ Users cannot access other users' inventory
✅ Transaction history is user-specific
✅ Product names only need to be unique per user

## Rollback (Emergency Only)

If you need to rollback:

1. Stop the server
2. Restore database from backup
3. Revert to previous code version:
   ```powershell
   git checkout <previous-commit-hash>
   ```

## Notes

- Existing data will be assigned to the **first user** in the database
- If no users exist, a default admin user will be created
- The migration is idempotent (safe to run multiple times)
- The compound index `(userId, name)` allows duplicate product names across different users

## Support

If you encounter issues:
1. Check that MongoDB is running
2. Verify `.env` has correct `MONGO_URI`
3. Check server logs for error messages
4. Ensure all users have logged out and cleared localStorage
