-- Perfect Wedding Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('couple', 'vendor', 'admin');
CREATE TYPE rsvp_status AS ENUM ('yes', 'no', 'pending');
CREATE TYPE gift_status AS ENUM ('pending', 'received', 'na');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE service_category AS ENUM ('venue', 'photo_video', 'music_dj', 'sweets', 'decorations', 'invitations');

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'couple',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  business_name TEXT, -- For vendors
  profile_completed BOOLEAN DEFAULT true, -- Tracks if vendor has completed onboarding
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- WEDDINGS TABLE
-- ============================================
CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Step 1: Wedding Overview
  partner1_name TEXT NOT NULL,
  partner2_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  guest_count INTEGER NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  location TEXT NOT NULL,
  wedding_type TEXT,
  language TEXT DEFAULT 'en',
  referral_source TEXT,
  
  -- Step 2: Style & Theme
  themes TEXT[] DEFAULT '{}',
  color_palette TEXT[] DEFAULT '{}',
  venue_preference TEXT,
  formality_level TEXT,
  venue_types TEXT[] DEFAULT '{}',
  music_styles TEXT[] DEFAULT '{}',
  
  -- Step 3: Vendor Needs
  vendor_categories TEXT[] DEFAULT '{}',
  preferred_contact_method TEXT,
  
  -- Step 4: Timeline & Personalization
  current_stage TEXT,
  help_tasks TEXT[] DEFAULT '{}',
  notifications TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;

-- Policies for weddings
CREATE POLICY "Users can view their own weddings"
  ON weddings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weddings"
  ON weddings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weddings"
  ON weddings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weddings"
  ON weddings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GUESTS TABLE
-- ============================================
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  relationship TEXT NOT NULL,
  rsvp_status rsvp_status DEFAULT 'pending',
  meal_preference TEXT,
  plus_ones INTEGER DEFAULT 0,
  table_number TEXT,
  invited_date DATE,
  gift_status gift_status DEFAULT 'pending',
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX idx_guests_rsvp_status ON guests(rsvp_status);

-- Enable RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Policies for guests
CREATE POLICY "Users can view guests for their weddings"
  ON guests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = guests.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert guests for their weddings"
  ON guests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = guests.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update guests for their weddings"
  ON guests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = guests.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete guests for their weddings"
  ON guests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = guests.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

-- ============================================
-- SERVICES TABLE (Vendor Listings)
-- ============================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  title TEXT NOT NULL,
  category service_category NOT NULL,
  description TEXT NOT NULL,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  location TEXT NOT NULL,
  contact_method TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Category-specific fields (stored as JSONB for flexibility)
  specific_fields JSONB DEFAULT '{}',
  
  -- Media
  images TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  portfolio TEXT[] DEFAULT '{}',
  
  -- Availability
  service_region TEXT,
  available_days TEXT[] DEFAULT '{}',
  lead_time INTEGER, -- days needed in advance
  
  -- Stats
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_services_vendor_id ON services(vendor_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_location ON services(location);
CREATE INDEX idx_services_rating ON services(rating DESC);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies for services
CREATE POLICY "Active services are viewable by everyone"
  ON services FOR SELECT
  USING (is_active = true OR auth.uid() = vendor_id);

CREATE POLICY "Vendors can create their own services"
  ON services FOR INSERT
  WITH CHECK (
    auth.uid() = vendor_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'vendor'
    )
  );

CREATE POLICY "Vendors can update their own services"
  ON services FOR UPDATE
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their own services"
  ON services FOR DELETE
  USING (auth.uid() = vendor_id);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate reviews
  UNIQUE(service_id, user_id)
);

-- Create index
CREATE INDEX idx_reviews_service_id ON reviews(service_id);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  
  status booking_status DEFAULT 'pending',
  event_date DATE NOT NULL,
  total_price DECIMAL(10,2),
  deposit_paid DECIMAL(10,2),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookings_wedding_id ON bookings(wedding_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view bookings for their weddings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = bookings.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Vendors can view bookings for their services"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM services
      WHERE services.id = bookings.service_id
      AND services.vendor_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings for their weddings"
  ON bookings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = bookings.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update bookings for their weddings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = bookings.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

-- ============================================
-- SEATING CHARTS TABLE
-- ============================================
CREATE TABLE seating_charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE UNIQUE,
  
  tables JSONB DEFAULT '[]', -- Array of table configurations
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE seating_charts ENABLE ROW LEVEL SECURITY;

-- Policies for seating_charts
CREATE POLICY "Users can view seating charts for their weddings"
  ON seating_charts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = seating_charts.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create seating charts for their weddings"
  ON seating_charts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = seating_charts.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update seating charts for their weddings"
  ON seating_charts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM weddings
      WHERE weddings.id = seating_charts.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weddings_updated_at
  BEFORE UPDATE ON weddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seating_charts_updated_at
  BEFORE UPDATE ON seating_charts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'couple'); -- Default role is couple
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update service rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_service_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE services
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE service_id = COALESCE(NEW.service_id, OLD.service_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE service_id = COALESCE(NEW.service_id, OLD.service_id)
    )
  WHERE id = COALESCE(NEW.service_id, OLD.service_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for review changes
CREATE TRIGGER update_rating_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_service_rating();

CREATE TRIGGER update_rating_on_review_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_service_rating();

CREATE TRIGGER update_rating_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_service_rating();

-- ============================================
-- STORAGE BUCKETS (Run in Supabase Dashboard > Storage)
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('service-images', 'service-images', true),
  ('service-videos', 'service-videos', true),
  ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for service images
CREATE POLICY "Service images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-images');

CREATE POLICY "Vendors can upload service images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'service-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Similar policies for other buckets...
