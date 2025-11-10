# Troubleshooting Vendor Onboarding

## Issue: Details Not Saving to Database

### Step 1: Check if Migration Was Run

The most common issue is that the database migration hasn't been run yet.

**Quick Check:**
```sql
-- Run this in Supabase SQL Editor
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'profile_completed';
```

**Expected Result:** Should return one row with `profile_completed`

**If empty:** You need to run the migration! See `DATABASE_SETUP_INSTRUCTIONS.md`

### Step 2: Check Browser Console

1. Open your browser DevTools (F12)
2. Go to the **Console** tab
3. Complete the vendor onboarding flow
4. Look for these logs:

```
=== VENDOR ONBOARDING DATA ===
Full context data: {vendorName: "...", contactPerson: "...", ...}
Vendor Name: Your Business Name
Contact Person: John Doe
Phone: +1234567890
...

=== SAVING TO DATABASE ===
Profile update payload: {...}
Profile saved successfully!
```

### Step 3: Check for Errors

**Common Errors:**

#### Error: "column 'profile_completed' does not exist"
**Solution:** Run the database migration (see DATABASE_SETUP_INSTRUCTIONS.md)

#### Error: "new row violates row-level security policy"
**Solution:** Check RLS policies on profiles table

```sql
-- View policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Ensure this policy exists:
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Error: Data shows as empty strings
**Cause:** Form data not being captured properly

**Debug Steps:**
1. Check console logs for "Full context data"
2. Verify all fields have values
3. If empty, check that forms are calling `updateStep1/2/3` correctly

### Step 4: Verify Data in Database

After completing onboarding, check the database:

```sql
SELECT 
  id,
  business_name,
  first_name,
  phone,
  location,
  bio,
  profile_completed,
  created_at
FROM profiles
WHERE role = 'vendor'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:** Should see your entered data in the most recent row

### Step 5: Check Auth Context

The `updateProfile` function should return an error object if something fails.

Look for console logs like:
```
Error from updateProfile: {...}
```

### Manual Test

If automated save isn't working, try manually updating:

```sql
UPDATE profiles
SET 
  business_name = 'Test Business',
  first_name = 'John',
  phone = '+1234567890',
  location = 'Bucharest',
  bio = 'Test description',
  profile_completed = true
WHERE id = 'YOUR_USER_ID';
```

If this works, the issue is in the application code, not the database.

## Debugging Checklist

- [ ] Database migration has been run
- [ ] `profile_completed` column exists in profiles table
- [ ] RLS policies allow users to update their own profile
- [ ] Browser console shows no errors
- [ ] Console logs show data being collected from forms
- [ ] Console logs show "Profile saved successfully!"
- [ ] Database query shows updated data
- [ ] Vendor dashboard displays the saved information

## Still Not Working?

### Check the Full Flow:

1. **Step 1 Form Submission:**
   - Open DevTools Console
   - Fill out Step 1 form
   - Click Continue
   - Check console for: "Vendor Name: [your input]"

2. **Step 2 Form Submission:**
   - Select business types
   - Select membership
   - Click Continue
   - Check console for: "Business Types: [...]"

3. **Step 3 Form Submission:**
   - Fill location, prices, days, lead time
   - Click Complete Setup
   - Check console for: "Location: [your input]"

4. **Success Page:**
   - Should see all collected data in console
   - Should see "Profile saved successfully!"
   - Button should change from "Saving..." to "Go to Dashboard"

### Get More Details:

Add this to your browser console while on the success page:

```javascript
// Check if context has data
console.log("Context data:", window.__VENDOR_ONBOARDING_DATA__);

// Check current user
console.log("Current user:", window.__USER__);
```

## Contact Support

If none of these steps work, provide:

1. Screenshot of browser console errors
2. Screenshot of the SQL query result for your profile
3. Screenshot of the migration status
4. Description of which step fails

This will help diagnose the issue quickly!
