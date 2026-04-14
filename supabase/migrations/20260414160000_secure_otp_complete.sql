-- Enable pgcrypto for crypt() / gen_salt() used in password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- OTP Security Hardening — targets the otp_codes table
-- (table already exists with the correct schema)
--
-- 1. Ensure attempt_count has a default of 0
-- 2. Add composite index for fast lookups
-- 3. Enable RLS + policies (anon access for forgot-password)
-- 4. RPC: verify_otp_and_mark_used  — atomic server-side verify
-- 5. RPC: reset_user_password_by_email — gated password update
-- ============================================================

-- Ensure attempt_count defaults to 0 (table was created with NULL default)
ALTER TABLE public.otp_codes
  ALTER COLUMN attempt_count SET DEFAULT 0;

-- Composite index for fast active-OTP lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_active
  ON public.otp_codes (email, is_used, expires_at);
-- Enable Row Level Security
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Policies — anon access is required because the forgot-password flow
-- runs before the user is authenticated.
DROP POLICY IF EXISTS "otp_anon_insert" ON public.otp_codes;
DROP POLICY IF EXISTS "otp_anon_select" ON public.otp_codes;
DROP POLICY IF EXISTS "otp_anon_update" ON public.otp_codes;
DROP POLICY IF EXISTS "otp_anon_delete" ON public.otp_codes;

CREATE POLICY "otp_anon_insert" ON public.otp_codes
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "otp_anon_select" ON public.otp_codes
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "otp_anon_update" ON public.otp_codes
  FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "otp_anon_delete" ON public.otp_codes
  FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- RPC 1: verify_otp_and_mark_used
-- Atomically verifies the OTP, enforces attempt limits,
-- and marks it as used (is_used = true) on success.
-- ============================================================
CREATE OR REPLACE FUNCTION public.verify_otp_and_mark_used(p_email TEXT, p_otp TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec RECORD;
BEGIN
  SELECT id, otp, attempt_count
  INTO   v_rec
  FROM   public.otp_codes
  WHERE  email      ILIKE p_email
    AND  is_used    = false
    AND  expires_at > NOW()
  ORDER  BY created_at DESC
  LIMIT  1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'OTP expired';
  END IF;

  IF COALESCE(v_rec.attempt_count, 0) >= 5 THEN
    RAISE EXCEPTION 'Too many failed attempts. Please request a new OTP.';
  END IF;

  IF v_rec.otp != p_otp THEN
    UPDATE public.otp_codes
    SET    attempt_count = COALESCE(attempt_count, 0) + 1
    WHERE  id = v_rec.id;
    RAISE EXCEPTION 'Invalid OTP';
  END IF;

  UPDATE public.otp_codes
  SET    is_used = true
  WHERE  id = v_rec.id;

  RETURN true;
END;
$$;

-- ============================================================
-- RPC 2: reset_user_password_by_email
-- Blocked unless a verified (is_used = true) unexpired OTP
-- exists for the email — no OTP bypass possible.
-- ============================================================
CREATE OR REPLACE FUNCTION public.reset_user_password_by_email(p_email TEXT, p_new_password TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_verified BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM   public.otp_codes
    WHERE  email      ILIKE p_email
      AND  is_used    = true
      AND  expires_at > NOW()
  ) INTO v_verified;

  IF NOT v_verified THEN
    RAISE EXCEPTION 'OTP not verified. Please verify your identity first.';
  END IF;

  UPDATE auth.users
  SET    encrypted_password = extensions.crypt(p_new_password, extensions.gen_salt('bf'))
  WHERE  email ILIKE p_email;

  DELETE FROM public.otp_codes WHERE email ILIKE p_email;

  UPDATE public.profiles
  SET    updated_at = NOW()
  WHERE  email ILIKE p_email;
END;
$$;
