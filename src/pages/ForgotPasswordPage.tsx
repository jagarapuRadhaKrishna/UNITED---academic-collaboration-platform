import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { sendOTP, verifyOTP, resetPassword } from '@/services/otpService';
import { toast } from 'sonner';
type Step = 'email' | 'otp' | 'password';
const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await sendOTP(email);
      setStep('otp');
      toast.success('OTP sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleVerifyOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6) return;
    setIsSubmitting(true);
    setError('');

    try {
      await verifyOTP(email, otp);
      setStep('password');
      toast.success('OTP verified successfully');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await resetPassword(email, newPassword);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* ── Left branding panel ── */}
      <div
        className="hidden md:flex flex-col items-center justify-center flex-none relative overflow-hidden p-10"
        style={{ width: '44%', background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)' }}
      >
        <div style={{ position: 'absolute', top: -80, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(96,165,250,0.1)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <motion.div className="relative z-10 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <img src="/favicon.svg" alt="UnitEd" className="mx-auto mb-4" style={{ width: 100, height: 100, objectFit: 'contain' }} />
          <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">UnitEd</h2>
          <p className="text-white/70 text-sm font-bold tracking-widest mx-auto whitespace-nowrap">
            UNITE &nbsp;·&nbsp; <span className="text-orange-400">COLLABORATE</span> &nbsp;·&nbsp; ACHIEVE
          </p>
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-10 sm:px-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex justify-center mb-6 md:hidden">
            <img src="/favicon.svg" alt="UnitEd" className="w-12 h-12" />
          </div>

          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.div key="email" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Reset Password</h1>
                <p className="text-slate-500 text-sm mb-8">Enter your email to receive a verification OTP.</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="font-bold ml-2">×</button>
                  </div>
                )}

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="relative">
                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your.email@university.edu" className="pl-11 h-12 rounded-xl border-slate-200 focus:border-blue-500 bg-slate-50" />
                  </div>
                  <Button type="submit" className="w-full h-12 font-bold text-base rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white shadow-md transition-all active:scale-[0.98]" disabled={isSubmitting || !email}>
                    {isSubmitting ? 'Sending...' : 'Send OTP'}
                  </Button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-white h-11 rounded-xl transition-all active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #c2410c, #ea580c)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #ea580c, #f97316)')}
                    onClick={() => navigate('/login')}
                  >
                    <ArrowLeft size={15} /> Back to Login
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Verify OTP</h1>
                <p className="text-slate-500 text-sm mb-8">
                  Code sent to <span className="font-semibold text-blue-600">{email}</span>
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="font-bold ml-2">×</button>
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp} onComplete={() => handleVerifyOTP()}>
                      <InputOTPGroup className="gap-2">
                        {[0,1,2,3,4,5].map(i => (
                          <InputOTPSlot key={i} index={i} className="h-14 w-12 text-lg font-bold border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-blue-500" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button type="submit" className="w-full h-12 font-bold text-base rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white shadow-md transition-all active:scale-[0.98]" disabled={isSubmitting || otp.length !== 6}>
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <div className="flex items-center justify-between text-sm pt-1">
                    <button type="button" className="text-blue-600 font-semibold hover:underline" onClick={handleSendOTP} disabled={isSubmitting}>Resend OTP</button>
                    <button type="button" className="text-slate-400 hover:text-slate-600" onClick={() => setStep('email')}>Change Email</button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'password' && (
              <motion.div key="password" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">New Password</h1>
                <p className="text-slate-500 text-sm mb-8">Set a secure password for your account.</p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="font-bold ml-2">×</button>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative">
                    <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input type={showPassword ? 'text' : 'password'} placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="pl-11 pr-12 h-12 rounded-xl border-slate-200 bg-slate-50 focus:border-blue-500" />
                    <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50 focus:border-blue-500" />
                  </div>
                  <Button type="submit" className="w-full h-12 font-bold text-base rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white shadow-md transition-all active:scale-[0.98]" disabled={isSubmitting || !newPassword}>
                    {isSubmitting ? 'Updating...' : 'Save Password'}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-xs text-slate-400 text-center mt-10">
            Need help? Contact <a href="mailto:support@united.edu" className="text-slate-500 font-semibold hover:underline">support</a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default ForgotPasswordPage;
