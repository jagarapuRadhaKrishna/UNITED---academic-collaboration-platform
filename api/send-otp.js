import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    'https://ioxoiahhfprwqexccelg.supabase.co').trim();
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (serviceRoleKey) {
    return {
      client: createClient(SUPABASE_URL, serviceRoleKey, {
        auth: { persistSession: false },
      }),
      canCheckProfile: true,
    };
  }

  if (anonKey) {
    return {
      client: createClient(SUPABASE_URL, anonKey, {
        auth: { persistSession: false },
      }),
      canCheckProfile: false,
    };
  }

  throw new Error('No Supabase key configured for OTP delivery.');
}

function getTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || emailUser === 'your-email@gmail.com' || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailUser, pass: emailPass },
    tls: { rejectUnauthorized: false },
  });
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await parseBody(req);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const { client: supabaseClient, canCheckProfile } = getSupabaseClient();

    if (canCheckProfile) {
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('email')
        .ilike('email', email)
        .maybeSingle();

      if (profileError) {
        console.error('[send-otp] Profile lookup error:', profileError.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!profile) {
        return res.status(400).json({ error: 'Invalid request' });
      }
    } else {
      console.warn('[send-otp] SUPABASE_SERVICE_ROLE_KEY missing. Skipping profile existence check.');
    }

    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabaseClient
      .from('otp_codes')
      .select('*', { count: 'exact', head: true })
      .ilike('email', email)
      .gte('created_at', windowStart);

    if (countError) {
      console.error('[send-otp] Rate-limit lookup error:', countError.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Too many requests. Please wait before requesting a new OTP.' });
    }

    const { error: invalidateError } = await supabaseClient
      .from('otp_codes')
      .delete()
      .ilike('email', email)
      .eq('is_used', false);

    if (invalidateError) {
      console.error('[send-otp] OTP invalidation error:', invalidateError.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

    const { error: insertError } = await supabaseClient
      .from('otp_codes')
      .insert({ email, otp, expires_at: expiresAt, is_used: false, attempt_count: 0 });

    if (insertError) {
      console.error('[send-otp] OTP insert error:', insertError.message);
      return res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
    }

    const transporter = getTransporter();
    if (!transporter) {
      console.log(`[send-otp] EMAIL_USER/EMAIL_PASS not configured. OTP for ${email}: ${otp}`);
      return res.status(200).json({ success: true });
    }

    await transporter.sendMail({
      from: `"UnitEd" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your UnitEd Password Reset OTP',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:28px;border:1px solid #e2e8f0;border-radius:14px;">
          <h2 style="color:#1e40af;margin:0 0 10px">Password Reset</h2>
          <p style="color:#475569;margin:0 0 20px">
            Use the code below to reset your <strong>UnitEd</strong> password.
            It expires in <strong>5 minutes</strong>.
          </p>
          <div style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:10px;padding:22px;text-align:center;margin-bottom:20px;">
            <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#1e40af">
              ${otp}
            </span>
          </div>
          <p style="color:#94a3b8;font-size:13px;margin:0">
            If you did not request a password reset, ignore this email.
            Never share this code with anyone.
          </p>
        </div>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[send-otp] Unexpected error:', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
