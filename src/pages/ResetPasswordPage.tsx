import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Ensure the recovery session is established when arriving from the email link
  useEffect(() => {
    const ensureSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSessionReady(true);
        }
      } catch {
        // ignore; onAuthStateChange will handle
      }
    };

    ensureSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionReady(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!sessionReady) {
      setError('Reset link is invalid or has expired. Please request a new one.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to update password. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'fixed radial-gradient(circle at 100% 0%, #E0E7FF 0%, transparent 40%), fixed radial-gradient(circle at 0% 100%, #C7D2FE 0%, transparent 40%), linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 50% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-md mx-auto px-4 w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Card 
            className="shadow-2xl border-none overflow-hidden"
            style={{
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <img 
                      src="/favicon.svg" 
                      alt="UnitEd Logo" 
                      style={{ width: '70%', height: '70%', objectFit: 'contain' }} 
                    />
                  </div>
                </motion.div>
              </div>

              <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                Reset Password
              </h1>
              <p className="text-sm text-slate-600 text-center mb-8 font-medium">
                Create a strong new password for your account.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex justify-between items-center">
                  <span>{error}</span>
                  <button onClick={() => setError('')} className="font-bold text-lg leading-none">×</button>
                </div>
              )}

              {!success ? (
                <form onSubmit={handleReset} className="space-y-5">
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 h-12 border-slate-200 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 h-12 border-slate-200 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 font-bold text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </Button>

                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full h-12 font-semibold text-blue-600 active:scale-[0.98]" 
                    onClick={() => navigate('/login')}
                  >
                    <ArrowLeft size={18} className="mr-2" /> Back to Login
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                  >
                    <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Updated</h2>
                  <p className="text-slate-600 mb-8 font-medium">You can now sign in with your new password.</p>
                  <Button 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold" 
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
