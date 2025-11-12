-- ================================================================
-- RUN THIS SQL IN YOUR SUPABASE SQL EDITOR
-- This adds the missing packages column needed for step 3
-- ================================================================

-- Add packages column to store service package options
ALTER TABLE services
ADD COLUMN IF NOT EXISTS packages JSONB DEFAULT '[]';

COMMENT ON COLUMN services.packages IS 'Array of service packages. Example: [{"id":"123","name":"Basic Package","price":"1500","description":"Includes..."}]';

-- Create index for better performance on JSONB columns
CREATE INDEX IF NOT EXISTS idx_services_specific_fields 
ON services USING GIN (specific_fields);

CREATE INDEX IF NOT EXISTS idx_services_packages 
ON services USING GIN (packages);

-- Verify the table has all required columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'services'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ================================================================
-- EXPECTED RESULT - All these columns should exist:
-- ================================================================
-- id                  | uuid              | NO
-- vendor_id           | uuid              | NO
-- title               | text              | NO
-- category            | service_category  | NO
-- description         | text              | NO
-- price_min           | numeric(10,2)     | YES
-- price_max           | numeric(10,2)     | YES
-- location            | text              | NO
-- contact_method      | text              | YES
-- tags                | text[]            | YES
-- specific_fields     | jsonb             | YES  <-- Stores all step 2 category fields
-- images              | text[]            | YES
-- videos              | text[]            | YES
-- portfolio           | text[]            | YES
-- service_region      | text              | YES
-- available_days      | text[]            | YES
-- lead_time           | integer           | YES
-- packages            | jsonb             | YES  <-- NEW COLUMN for step 3 packages
-- rating              | numeric(3,2)      | YES
-- review_count        | integer           | YES
-- view_count          | integer           | YES
-- booking_count       | integer           | YES
-- is_active           | boolean           | YES
-- is_featured         | boolean           | YES
-- created_at          | timestamptz       | YES
-- updated_at          | timestamptz       | YES
