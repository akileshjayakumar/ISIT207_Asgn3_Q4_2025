-- Pet Heaven Database Schema
-- This schema will be automatically initialized on first app startup
-- No manual SQL execution required!

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  membership_type TEXT NOT NULL CHECK (membership_type IN ('member', 'supporter')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Adoption applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  pet_id TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  pet_breed TEXT NOT NULL,
  pet_type TEXT NOT NULL CHECK (pet_type IN ('cat', 'dog')),
  member_name TEXT NOT NULL,
  member_email TEXT NOT NULL,
  member_phone TEXT NOT NULL,
  member_address TEXT NOT NULL,
  reason TEXT NOT NULL,
  home_environment TEXT NOT NULL,
  experience TEXT NOT NULL,
  other_pets TEXT,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pet surrender requests table
CREATE TABLE IF NOT EXISTS pet_surrender_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_address TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  pet_type TEXT NOT NULL CHECK (pet_type IN ('cat', 'dog')),
  pet_breed TEXT NOT NULL,
  pet_age TEXT NOT NULL,
  pet_gender TEXT NOT NULL CHECK (pet_gender IN ('male', 'female', 'unknown')),
  reason TEXT NOT NULL,
  medical_history TEXT,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_members_id ON members(id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_member_id ON adoption_applications(member_id);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_status ON adoption_applications(status);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_created_at ON adoption_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surrender_requests_status ON pet_surrender_requests(status);
CREATE INDEX IF NOT EXISTS idx_surrender_requests_created_at ON pet_surrender_requests(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_adoption_applications_updated_at ON adoption_applications;
CREATE TRIGGER update_adoption_applications_updated_at
  BEFORE UPDATE ON adoption_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_surrender_requests_updated_at ON pet_surrender_requests;
CREATE TRIGGER update_surrender_requests_updated_at
  BEFORE UPDATE ON pet_surrender_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create member profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.members (id, name, phone, address, membership_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    COALESCE(NEW.raw_user_meta_data->>'membership_type', 'member')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = COALESCE(EXCLUDED.phone, members.phone),
    address = COALESCE(EXCLUDED.address, members.address),
    membership_type = COALESCE(EXCLUDED.membership_type, members.membership_type);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create member profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_surrender_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for members
DROP POLICY IF EXISTS "Users can view own profile" ON members;
CREATE POLICY "Users can view own profile"
  ON members FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON members;
CREATE POLICY "Users can insert own profile"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON members;
CREATE POLICY "Users can update own profile"
  ON members FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for adoption_applications
DROP POLICY IF EXISTS "Users can view own applications" ON adoption_applications;
CREATE POLICY "Users can view own applications"
  ON adoption_applications FOR SELECT
  USING (auth.uid() = member_id OR member_id IS NULL);

DROP POLICY IF EXISTS "Anyone can create applications" ON adoption_applications;
CREATE POLICY "Anyone can create applications"
  ON adoption_applications FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own applications" ON adoption_applications;
CREATE POLICY "Users can update own applications"
  ON adoption_applications FOR UPDATE
  USING (auth.uid() = member_id)
  WITH CHECK (auth.uid() = member_id);

-- RLS Policies for pet_surrender_requests
DROP POLICY IF EXISTS "Anyone can create surrender requests" ON pet_surrender_requests;
CREATE POLICY "Anyone can create surrender requests"
  ON pet_surrender_requests FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own surrender requests" ON pet_surrender_requests;
CREATE POLICY "Users can view own surrender requests"
  ON pet_surrender_requests FOR SELECT
  USING (
    owner_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR auth.uid() IS NULL
  );

-- Function to initialize database schema (can be called via RPC)
CREATE OR REPLACE FUNCTION initialize_database()
RETURNS jsonb AS $$
DECLARE
  result jsonb := '{"success": true, "message": "Database already initialized"}';
BEGIN
  -- This function exists to allow checking if database is initialized
  -- The actual initialization happens via the SQL above
  -- Tables are created with IF NOT EXISTS, so this is safe to call multiple times
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION initialize_database() TO anon, authenticated;

