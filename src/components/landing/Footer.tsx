import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Mail, MapPin, Phone, Linkedin, Github, Globe } from 'lucide-react';
import { DEVELOPERS } from '@/data/developers';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const developer = DEVELOPERS[0];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About Us', sectionId: 'about' },
    { label: 'How It Works', sectionId: 'workflow' },
    { label: 'Features', sectionId: 'features' },
    { label: 'Testimonials', sectionId: 'testimonials' },
    { label: 'FAQ', to: '/register' },
  ];

  const studentLinks = [
    { label: 'Browse Opportunities', to: '/login' },
    { label: 'Create Profile', to: '/register' },
    { label: 'Apply to Projects', to: '/login' },
    { label: 'Join Teams', to: '/login' },
    { label: 'Resources', sectionId: 'features' },
  ];

  const socialLinks = [
    { icon: Mail, href: `mailto:${developer?.email || 'jagarapuradhakrishna.work@gmail.com'}`, label: 'Gmail', gradient: 'linear-gradient(135deg, #ea580c, #f97316)' },
    { icon: Linkedin, href: developer?.linkedin || '#', label: 'LinkedIn', gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' },
    { icon: Github, href: developer?.github || '#', label: 'GitHub', gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
    { icon: Globe, href: developer?.portfolio || '#', label: 'Portfolio', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  ];

  const linkSx = {
    border: 0,
    background: 'none',
    p: 0,
    textAlign: 'left' as const,
    width: '100%',
    display: 'block',
    color: '#64748b',
    textDecoration: 'none',
    mb: 1.25,
    fontSize: '0.875rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
    '&:hover': { color: '#F97316' },
  };

  return (
    <Box
      id="footer"
      sx={{
        backgroundColor: '#0a0f1e',
        color: '#FFFFFF',
        pt: 8,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #6366f1 0%, #F97316 50%, #10b981 100%)',
        },
      }}
    >
      {/* Background glow */}
      <Box sx={{
        position: 'absolute', bottom: 0, left: '30%', width: '40%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 5,
            mb: 7,
          }}
        >
          {/* Brand column */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                component="img"
                src="/favicon.svg"
                alt="UnitEd"
                sx={{ width: 36, height: 36, filter: 'drop-shadow(0 2px 8px rgba(249,115,22,0.4))' }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f1f5f9' }}>
                Unit<Box component="span" sx={{ color: '#F97316' }}>Ed</Box>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3, lineHeight: 1.8 }}>
              Connecting students and faculty for research, projects, and hackathons through AI-powered matching.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <IconButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      width: 36, height: 36,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#64748b',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        background: social.gradient,
                        border: '1px solid transparent',
                        color: '#fff',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    <Icon size={16} />
                  </IconButton>
                );
              })}
            </Box>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#f1f5f9', letterSpacing: 0.5 }}>
              Quick Links
            </Typography>
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                component={item.to ? RouterLink : 'button'}
                to={item.to}
                type={item.sectionId ? 'button' : undefined}
                onClick={item.sectionId ? () => scrollToSection(item.sectionId as string) : undefined}
                sx={linkSx}
              >
                {item.label}
              </Link>
            ))}
          </Box>

          {/* For Students */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#f1f5f9', letterSpacing: 0.5 }}>
              For Students
            </Typography>
            {studentLinks.map((item) => (
              <Link
                key={item.label}
                component={item.to ? RouterLink : 'button'}
                to={item.to}
                type={item.sectionId ? 'button' : undefined}
                onClick={item.sectionId ? () => scrollToSection(item.sectionId as string) : undefined}
                sx={linkSx}
              >
                {item.label}
              </Link>
            ))}
          </Box>

          {/* Contact */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#f1f5f9', letterSpacing: 0.5 }}>
              Created By
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
              <Mail size={15} color="#F97316" style={{ marginTop: 2, flexShrink: 0 }} />
              <Link
                href={`mailto:${developer?.email || 'jagarapuradhakrishna.work@gmail.com'}`}
                sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', lineHeight: 1.6, '&:hover': { color: '#F97316' } }}
              >
                {developer?.email || 'jagarapuradhakrishna.work@gmail.com'}
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
              <Phone size={15} color="#F97316" style={{ marginTop: 2, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.875rem' }}>
                +91 9550897539<br />+91 7075827539
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <MapPin size={15} color="#F97316" style={{ marginTop: 2, flexShrink: 0 }} />
              <Box>
                <Link
                  href="https://anits.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', lineHeight: 1.6, '&:hover': { color: '#F97316' } }}
                >
                  Anil Neerukonda Institute of Technology & Sciences
                </Link>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.8rem', mt: 0.5 }}>
                  Sangivalasa, Bheemunipatnam Mandal<br />
                  Visakhapatnam, Andhra Pradesh 531162
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem' }}>
            © {currentYear} Unit<Box component="span" sx={{ color: '#F97316' }}>Ed</Box>. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {[
              { label: 'Privacy Policy', to: '/register' },
              { label: 'Terms of Service', to: '/register' },
              { label: 'Cookie Policy', to: '/register' },
            ].map((item) => (
              <Link
                key={item.label}
                component={RouterLink}
                to={item.to}
                sx={{ color: '#475569', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s', '&:hover': { color: '#F97316' } }}
              >
                {item.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
