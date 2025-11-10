# Complete Vendor Onboarding Fields Implementation

## Database Migration

**File**: `supabase/migrations/add_vendor_profile_fields.sql`

Run this SQL in your Supabase dashboard:

```sql
-- Migration: Add additional vendor profile fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS service_areas TEXT,
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS starting_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS pinterest TEXT,
ADD COLUMN IF NOT EXISTS business_hours TEXT,
ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT '{}';
```

## Fields Collected in Join-Vendor Flow

### Step 1: Business Identity
- ✅ Vendor Name (`business_name`)
- ✅ Contact Person (`first_name`)
- ✅ Phone Number (`phone`)
- ✅ Business Description (`bio`)
- 🔄 Profile Picture (`avatar_url`) - UI exists, needs upload implementation

### Step 2: Business Details  
- ✅ Business Types (multiple selection)
- ✅ Membership Level
- ✅ Website (`website`) - **ADDED**
- ✅ Years of Experience (`years_experience`) - **ADDED**

### Step 3: Service Details
- ✅ Service Location (`location`)
- 🔄 Service Areas (`service_areas`) - **NEEDS TO BE ADDED**
- ✅ Price Range Min (`priceMin`)
- ✅ Price Range Max (`priceMax`)
- ✅ Available Days (`availableDays`)
- ✅ Lead Time (`leadTime`)

### Step 4: Additional Details (NEW STEP NEEDED)
- 🔄 Instagram (`instagram`)
- 🔄 Facebook (`facebook`)
- 🔄 Pinterest (`pinterest`)
- 🔄 Business Hours (`business_hours`)
- 🔄 Specialties/Tags (`specialties`)

## Implementation Status

### ✅ Completed
1. Database migration SQL created
2. TypeScript types updated in `database.types.ts`
3. Vendor onboarding context updated with all fields
4. Step 2 updated with Website and Years of Experience fields
5. Edit profile page updated to use actual profile data

### 🔄 Still Needed

#### 1. Update Step 3 to add Service Areas
Add this field after Service Location in `join-vendor-step3.tsx`:

```typescript
const [serviceAreas, setServiceAreas] = useState(data.serviceAreas);

// In the form:
<div className="space-y-2">
  <label className="text-base font-semibold text-gray-900">
    Service Areas
  </label>
  <Input
    placeholder="e.g., Bucharest, Ilfov, Prahova"
    value={serviceAreas}
    onChange={(e) => setServiceAreas(e.target.value)}
    required
  />
  <p className="text-sm text-gray-500">
    Areas where you provide services (comma separated)
  </p>
</div>

// In handleSubmit:
updateStep3({
  // ... existing fields
  serviceAreas,
});
```

#### 2. Create Step 4 for Social Media & Additional Details
Create new file: `join-vendor-step4.tsx`

Fields to include:
- Instagram handle
- Facebook page URL
- Pinterest profile URL
- Business Hours (textarea)
- Specialties/Tags (similar to edit profile)

#### 3. Update Progress Indicators
Change from "Step X of 3" to "Step X of 4" in all steps.

#### 4. Update Navigation Flow
- Step 3 should navigate to `/join-vendor/step-4`
- Step 4 should navigate to `/join-vendor/success`

#### 5. Update Routes
Add route in `_index.tsx`:
```typescript
<Route
  path="/join-vendor/step-4"
  element={<ProtectedRoute><JoinVendorStep4 /></ProtectedRoute>}
/>
```

#### 6. Update Success Page to Save All Fields
Update `join-vendor-success.tsx` to save all collected data:

```typescript
await updateProfile({
  business_name: data.vendorName,
  first_name: data.contactPerson,
  phone: data.phoneNumber,
  bio: data.businessDescription,
  location: data.serviceLocation,
  website: data.website,
  years_experience: parseInt(data.yearsExperience) || null,
  service_areas: data.serviceAreas,
  starting_price: parseFloat(data.priceMin) || null,
  instagram: data.instagram,
  facebook: data.facebook,
  pinterest: data.pinterest,
  business_hours: data.businessHours,
  specialties: data.specialties,
  profile_completed: true,
});
```

#### 7. Update Edit Profile to Save All Fields
Update `vendor-edit-profile.tsx` handleSave to include all new fields.

## Quick Implementation Guide

### Priority 1: Add Service Areas to Step 3
This is a simple addition to the existing step.

### Priority 2: Create Step 4
This completes the onboarding with social media and additional details.

### Priority 3: Update Save Logic
Ensure all collected data is actually saved to the database.

## Testing Checklist

After implementation:
- [ ] Run database migration
- [ ] Complete full vendor onboarding flow
- [ ] Check all fields are saved in database
- [ ] Edit profile and verify all fields are editable
- [ ] Save changes in edit profile
- [ ] Verify changes appear in vendor dashboard

## Notes

- Business types and available days are currently stored in context but not in database
- Consider creating a separate `vendor_services` table for business types
- Consider creating a `vendor_availability` table for available days and hours
- Starting price is saved as the minimum price from the range
- Specialties are stored as a PostgreSQL array for easy searching

Would you like me to implement Step 4 and complete the remaining tasks?
