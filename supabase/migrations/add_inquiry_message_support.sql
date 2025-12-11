-- Add 'inquiry' to the message_type enum
-- This is necessary because message_type is an ENUM, not a text column with a check constraint
ALTER TYPE message_type ADD VALUE IF NOT EXISTS 'inquiry';

-- Add inquiry_data column to messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS inquiry_data JSONB DEFAULT NULL;

-- Add comment
COMMENT ON COLUMN messages.inquiry_data IS 'Stores structured inquiry details for inquiry type messages';
