# Database Setup Instructions

## IMPORTANT: Run This Migration First!

Before testing the vendor onboarding flow, you **MUST** run the database migration to add the `profile_completed` column to the profiles table.

## Step 1: Run the Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/add_profile_completed.sql`
5. Click **Run** or press `Ctrl/Cmd + Enter`

### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# From the project root directory
supabase db push
```

## Step 2: Verify the Migration

Run this query in the SQL Editor to verify the column was added:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'profile_completed';
```

You should see:
- **column_name**: `profile_completed`
- **data_type**: `boolean`
- **column_default**: `true`

## Step 3: Check Existing Data

To see if existing profiles have the column:

```sql
SELECT id, role, profile_completed, business_name, first_name, phone, location, bio
FROM profiles
LIMIT 10;
```

## Troubleshooting

### Issue: "Column profile_completed does not exist"

**Solution**: The migration hasn't been run yet. Follow Step 1 above.

### Issue: "Profile data not saving"

**Possible causes:**

1. **Migration not run**: Run the migration first
2. **RLS Policies**: Check that the user can update their own profile
3. **Browser console errors**: Open browser DevTools (F12) and check the Console tab for errors

**Debug steps:**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Complete the vendor onboarding
4. Look for console logs showing:
   - "Saving vendor profile data: {...}"
   - "Profile saved successfully!" or error messages

### Issue: "Permission denied for table profiles"

**Solution**: Check RLS policies. Run this query:

```sql
-- View existing policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Ensure users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## What the Migration Does

The migration:

1. **Adds the column**: `profile_completed BOOLEAN DEFAULT true`
2. **Sets existing vendors to false**: So they go through onboarding on next login (optional)
3. **Sets couples to true**: They don't need vendor onboarding

## After Migration

Once the migration is complete:

1. **New vendors**: Will have `profile_completed = false` on signup
2. **Existing vendors**: Will have `profile_completed = false` (if you kept that part of the migration)
3. **Couples**: Will have `profile_completed = true`

## Testing the Flow

After running the migration:

1. **Create a new vendor account**
2. **Complete the 3-step onboarding**
3. **Check the database**:
   ```sql
   SELECT business_name, first_name, phone, location, bio, profile_completed
   FROM profiles
   WHERE role = 'vendor'
   ORDER BY created_at DESC
   LIMIT 1;
   ```

You should see all your entered data saved!

## Common Fields Saved

| Database Column | Onboarding Field |
|----------------|------------------|
| `business_name` | Vendor Name (Step 1) |
| `first_name` | Contact Person (Step 1) |
| `phone` | Phone Number (Step 1) |
| `bio` | Business Description (Step 1) |
| `location` | Service Location (Step 3) |
| `profile_completed` | Set to `true` on success |

## Note on Additional Data

The onboarding also collects:
- Business types (Step 2)
- Membership level (Step 2)
- Price range (Step 3)
- Available days (Step 3)
- Lead time (Step 3)

These are currently stored in the onboarding context but not yet saved to the database. To save these, you would need to either:

1. Add columns to the `profiles` table
2. Create a separate `vendor_details` or `vendor_services` table
3. Store as JSONB in a `metadata` column

Let me know if you need help implementing storage for these additional fields!
