import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import unitedTheme from '@/theme/unitedTheme';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Keep autofill from painting the inputs gray (Chrome)
  const autofillReset = {
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
      WebkitTextFillColor: '#111827',
    },
    '& input': {
      backgroundColor: 'transparent',
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={unitedTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>

        {/* ── Left branding panel ── */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: '0 0 44%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)',
            position: 'relative',
            overflow: 'hidden',
            p: 6,
          }}
        >
          <Box sx={{ position: 'absolute', top: -80, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(96,165,250,0.1)', filter: 'blur(50px)' }} />
          <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(50px)' }} />
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
              <Box sx={{ width: 76, height: 76, borderRadius: '20px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                <img src="/favicon.svg" alt="UnitEd" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 1.5, letterSpacing: '-0.03em' }}>
                UnitEd
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: 260, mx: 'auto', lineHeight: 1.7 }}>
                Connecting students &amp; faculty in one unified workspace.
              </Typography>
            </motion.div>
          </Box>
        </Box>

        {/* ── Right form panel ── */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            p: { xs: 3, sm: 6 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            {/* Mobile logo */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 5 }}>
              <img src="/favicon.svg" alt="UnitEd" style={{ width: 48, height: 48 }} />
            </Box>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, letterSpacing: '-0.02em' }}>
                Welcome back
              </Typography>
              <Typography sx={{ color: '#64748b', mb: 4 }}>
                Sign in to your UnitEd account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2.5 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={18} color="#94a3b8" />
                        </InputAdornment>
                      ),
                      sx: autofillReset,
                    }}
                  />
                </Box>

                <Box sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} color="#94a3b8" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                            {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: autofillReset,
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3, textAlign: 'right' }}>
                  <Button component={Link} to="/forgot-password" sx={{ color: '#2563eb', textTransform: 'none', fontSize: '0.875rem', p: 0, minWidth: 'auto', '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>
                    Forgot Password?
                  </Button>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5, mb: 3,
                    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                    fontSize: '1rem', fontWeight: 700, textTransform: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                    '&:hover': { background: 'linear-gradient(135deg, #1e40af, #1d4ed8)', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' },
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', px: 1 }}>OR</Typography>
                </Divider>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Don't have an account?{' '}
                    <Button component={Link} to="/register" sx={{ color: '#2563eb', fontWeight: 700, textTransform: 'none', p: 0, minWidth: 'auto', '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}>
                      Register here
                    </Button>
                  </Typography>
                </Box>
              </form>
            </motion.div>
          </Box>

          <Box sx={{ mt: 5, textAlign: 'center' }}>
            <Button component={Link} to="/landing" sx={{ color: '#94a3b8', textTransform: 'none', fontSize: '0.8rem', '&:hover': { backgroundColor: 'transparent', color: '#64748b' } }}>
              ← Back to Home
            </Button>
          </Box>
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
