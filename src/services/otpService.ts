import { supabase } from "@/integrations/supabase/client";

// ---------------------------------------------------------------------------
// Step 1 — Send OTP
// Delegates to the Express auth server (server/index.js) which:
//   • validates format + checks profile existence
//   • rate-limits (3 requests / 10 min)
//   • generates the OTP, stores it in DB, and emails it
//   • NEVER sends the OTP value back to the browser
// ---------------------------------------------------------------------------
export const sendOTP = async (email: string) => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw new Error('Invalid request');
  }

  const res = await fetch('/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() }),
  });

  const body: { error?: string } = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || 'Failed to send OTP. Please try again.');
  }

  return { success: true };
};

// ---------------------------------------------------------------------------
// Step 2 — Verify OTP
// Calls a Supabase RPC that atomically:
//   • finds the latest active (unused, unexpired) OTP for the email
//   • enforces a 5-attempt brute-force limit
//   • marks the OTP as used (is_used = true) on success
// All logic runs server-side; the OTP value is never returned to the client.
// ---------------------------------------------------------------------------
export const verifyOTP = async (email: string, otp: string) => {
  const { error } = await supabase.rpc('verify_otp_and_mark_used', {
    p_email: email.trim(),
    p_otp:   otp,
  });

  if (error) {
    const msg = error.message?.toLowerCase().includes('expired')
      ? 'OTP expired'
      : error.message?.toLowerCase().includes('attempts')
        ? 'Too many failed attempts. Please request a new OTP.'
        : 'Invalid OTP';
    throw new Error(msg);
  }

  return { success: true };
};

// ---------------------------------------------------------------------------
// Step 3 — Reset Password
// Calls a Supabase RPC that:
//   • checks a verified (is_used = true) OTP still exists for the email
//   • updates auth.users.encrypted_password via pgcrypto bcrypt
//   • deletes all OTP records for the email
// Blocked if OTP verification was not completed first.
// ---------------------------------------------------------------------------
export const resetPassword = async (email: string, newPassword: string) => {
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Invalid password');
  }

  const { error } = await supabase.rpc('reset_user_password_by_email', {
    p_email:        email.trim(),
    p_new_password: newPassword,
  });

  if (error) {
    throw new Error(error.message || 'Failed to reset password. Please try again.');
  }

  return { success: true };
};
