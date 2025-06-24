-- This SQL file shows how to create a stored procedure in Supabase to create the contacts table
-- Execute this in your Supabase SQL Editor

-- Create a stored procedure that can be called from your app
CREATE OR REPLACE FUNCTION create_contacts_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This will run with the privileges of the function creator
AS $$
BEGIN
  -- Create the contacts table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Grant appropriate permissions
  GRANT ALL ON TABLE public.contacts TO authenticated;
  GRANT SELECT, INSERT ON TABLE public.contacts TO anon;
END;
$$;

-- Grant execute permission on this function
GRANT EXECUTE ON FUNCTION create_contacts_table() TO service_role;
GRANT EXECUTE ON FUNCTION create_contacts_table() TO authenticated;
GRANT EXECUTE ON FUNCTION create_contacts_table() TO anon;

-- Example of how to call this function
-- SELECT create_contacts_table();
