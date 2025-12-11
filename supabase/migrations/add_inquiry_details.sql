-- Add inquiry_details column to conversations table
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS inquiry_details JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN conversations.inquiry_details IS 'Stores structured event details from couple inquiry form (wedding date, guests, budget, location, service-specific fields)';
