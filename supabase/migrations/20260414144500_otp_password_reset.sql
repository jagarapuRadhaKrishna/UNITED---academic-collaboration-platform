-- Create the otp_verifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_email ON public.otp_verifications(email);

-- Function to reset password by email (using a securer approach than direct update if using Supabase Auth)
-- This requires high privileges (security definer)
CREATE OR REPLACE FUNCTION public.reset_user_password_by_email(p_email TEXT, p_new_password TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update the password in auth.users (requires security definer for non-admin)
    UPDATE auth.users
    SET encrypted_password = crypt(p_new_password, gen_salt('bf'))
    WHERE email = p_email;
    
    -- Also update the profiles table if necessary
    UPDATE public.profiles
    SET updated_at = NOW()
    WHERE email = p_email;
END;
$$;
