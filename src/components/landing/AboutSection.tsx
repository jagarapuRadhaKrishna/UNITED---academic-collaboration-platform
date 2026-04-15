import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Eye, Heart } from 'lucide-react';

const aboutCards = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'Empower students and faculty with cutting-edge tools for seamless collaboration and innovation in academic projects.',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glow: 'rgba(99,102,241,0.35)',
    borderColor: 'rgba(99,102,241,0.35)',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'Building the future of academic networking where AI meets human potential for limitless discovery.',
    gradient: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
    glow: 'rgba(234,88,12,0.35)',
    borderColor: 'rgba(234,88,12,0.35)',
    iconColor: '#fff',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Innovation, excellence, inclusivity, and data-driven decision making for every student and faculty member.',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
    glow: 'rgba(6,182,212,0.35)',
    borderColor: 'rgba(6,182,212,0.35)',
    iconColor: '#fff',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const AboutSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.15 });

  return (
    <Box
      id="about"
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow orbs */}
      <Box sx={{
        position: 'absolute', top: '-15%', left: '-8%', width: '45%', height: '65%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-15%', right: '-8%', width: '45%', height: '65%',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  px: 2.5, py: 0.75,
                  borderRadius: 99,
                  border: '1px solid rgba(99,102,241,0.4)',
                  background: 'rgba(99,102,241,0.1)',
                  color: '#a5b4fc',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                Who We Are
              </Box>
            </Box>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                textAlign: 'center',
                color: '#f1f5f9',
              }}
            >
              About{' '}<Box component="span" sx={{ color: '#F97316' }}>UnitEd</Box>
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              sx={{
                color: '#94a3b8',
                textAlign: 'center',
                maxWidth: 860,
                mx: 'auto',
                lineHeight: 1.9,
                fontWeight: 400,
                mb: 8,
              }}
            >
              UnitEd is a comprehensive academic collaboration platform revolutionizing how students and faculty
              connect. AI-powered matching, real-time chat, personalized feeds — everything you need for academic
              success, all in one place.
            </Typography>
          </motion.div>

          {/* Items */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: { xs: 6, md: 4 },
            }}
          >
            {aboutCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      position: 'relative',
                      px: 2,
                      transition: 'transform 0.35s ease',
                      '&:hover': { transform: 'translateY(-8px)' },
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: card.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        color: '#fff',
                        boxShadow: `0 12px 40px ${card.glow}`,
                        transition: 'box-shadow 0.35s ease',
                        '&:hover': { boxShadow: `0 20px 60px ${card.glow}` },
                      }}
                    >
                      <Icon size={46} strokeWidth={1.75} color={card.iconColor} />
                    </Box>

                    {/* Accent line */}
                    <Box
                      sx={{
                        width: 48,
                        height: 3,
                        borderRadius: 2,
                        background: card.gradient,
                        mx: 'auto',
                        mb: 2,
                        opacity: 0.8,
                      }}
                    />

                    <Typography
                      variant="h6"
                      sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1.5, fontSize: '1.2rem' }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.9, maxWidth: 280, mx: 'auto' }}>
                      {card.description}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutSection;
