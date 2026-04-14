import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env (EMAIL_USER, EMAIL_PASS, SUPABASE_SERVICE_ROLE_KEY, SERVER_PORT)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = parseInt(process.env.SERVER_PORT || '3001', 10);
const SUPABASE_URL = 'https://briynvmtsinfomfsvxag.supabase.co';

// Service-role client bypasses RLS — only used server-side
const supabaseAdmin = createClient(
  SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

const app = express();
app.use(cors({ origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://[::]:8080'] }));
app.use(express.json());

const OTP_EXPIRY_MS        = 5  * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX       = 3;              // max OTP requests
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ---------------------------------------------------------------------------
// POST /api/send-otp
// Body: { email }
// ---------------------------------------------------------------------------
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body ?? {};

    // 1. Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check user exists — return generic error so account existence is not revealed
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .ilike('email', normalizedEmail)
      .maybeSingle();

    if (!profile) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // 3. Rate limiting — max 3 requests per 10 minutes
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count } = await supabaseAdmin
      .from('otp_codes')
      .select('*', { count: 'exact', head: true })
      .ilike('email', normalizedEmail)
      .gte('created_at', windowStart);

    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Too many requests. Please wait before requesting a new OTP.' });
    }

    // 4. Invalidate all previous unused OTPs for this email
    await supabaseAdmin
      .from('otp_codes')
      .delete()
      .ilike('email', normalizedEmail)
      .eq('is_used', false);

    // 5. Generate and store new OTP (never returned to the client)
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

    const { error: insertError } = await supabaseAdmin
      .from('otp_codes')
      .insert({ email: normalizedEmail, otp, expires_at: expiresAt, is_used: false, attempt_count: 0 });

    if (insertError) {
      console.error('[send-otp] DB insert error:', insertError.message);
      return res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
    }

    // 6. Send email
    const emailConfigured =
      process.env.EMAIL_USER &&
      process.env.EMAIL_USER !== 'your-email@gmail.com' &&
      process.env.EMAIL_PASS;

    if (!emailConfigured) {
      // Development fallback — print OTP to terminal only
      console.log('\n╔══════════════════════════════╗');
      console.log('║   [DEV] OTP (not emailed)    ║');
      console.log(`║  Email : ${normalizedEmail.padEnd(20)} ║`);
      console.log(`║  OTP   : ${otp}                 ║`);
      console.log('╚══════════════════════════════╝\n');
    } else {
      await transporter.sendMail({
        from: `"UnitEd" <${process.env.EMAIL_USER}>`,
        to: normalizedEmail,
        subject: 'Your UnitEd Password Reset OTP',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:28px;
                      border:1px solid #e2e8f0;border-radius:14px;">
            <h2 style="color:#1e40af;margin:0 0 10px">Password Reset</h2>
            <p style="color:#475569;margin:0 0 20px">
              Use the code below to reset your <strong>UnitEd</strong> password.
              It expires in <strong>5 minutes</strong>.
            </p>
            <div style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:10px;
                        padding:22px;text-align:center;margin-bottom:20px;">
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
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('[send-otp] Unexpected error:', err?.message ?? err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n[UnitEd Auth Server] http://localhost:${PORT}`);
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.error('  ✗ SUPABASE_SERVICE_ROLE_KEY missing — add it to .env');
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com')
    console.warn('  ⚠ EMAIL_USER not configured — OTPs will be printed to terminal only');
});
