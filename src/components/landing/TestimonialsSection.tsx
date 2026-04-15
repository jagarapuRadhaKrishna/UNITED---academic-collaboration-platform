import React from 'react';
import { Box, Container, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';
import type { LandingStats } from '@/hooks/useLandingStats';

const testimonials = [
  {
    name: 'Godavarthi Vedaaksharee',
    role: 'Student',
    department: 'CSD Dept',
    avatar: '/image/godavarthi vedaaksharee.png',
    quote: 'This platform made it much easier to find the right teammates for my academic projects. The collaboration features help us communicate and manage tasks effectively, making the entire workflow more organized and productive.',
    accent: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.18)',
  },
  {
    name: 'Jagarapu Radha Krishna',
    role: 'Student',
    department: 'CSD Dept',
    avatar: '/image/krishna.png',
    quote: 'Finding project partners used to take a lot of time, but this platform makes it simple. I can explore different project ideas, join teams, and collaborate with students who share similar interests.',
    accent: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    glow: 'rgba(6,182,212,0.18)',
  },
  {
    name: 'Annanya',
    role: 'Student',
    department: 'CSD Dept',
    avatar: '',
    quote: 'The platform provides a great space for students to collaborate on projects. From discovering new opportunities to connecting with teammates — everything is well organized and focused on productivity.',
    accent: 'linear-gradient(135deg, #10b981, #06b6d4)',
    glow: 'rgba(16,185,129,0.18)',
  },
];

interface TestimonialsSectionProps {
  stats: LandingStats;
}

const formatStatNumber = (value: number | null) => {
  if (value === null) return '...';
  return value.toLocaleString();
};

const statGradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f97316, #eab308)',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ stats }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.08 });

  const statItems = [
    { number: formatStatNumber(stats.totalUsers), label: 'Active Users' },
    { number: formatStatNumber(stats.totalFaculty), label: 'Faculty Members' },
    { number: formatStatNumber(stats.completedProjects), label: 'Projects Completed' },
    { number: stats.coreFeatures.toLocaleString(), label: 'Core Features' },
  ];

  return (
    <Box
      id="testimonials"
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: '#111827',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '20%', width: '60%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', right: '20%', width: '60%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Stats badge */}
          <motion.div variants={itemVariants}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  px: 2.5, py: 0.75,
                  borderRadius: 99,
                  border: '1px solid rgba(6,182,212,0.4)',
                  background: 'rgba(6,182,212,0.1)',
                  color: '#67e8f9',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                By The Numbers
              </Box>
            </Box>
          </motion.div>

          {/* Stats grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              mb: 12,
            }}
          >
            {statItems.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.55 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3.5,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 0.75,
                      background: statGradients[index],
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Testimonials heading */}
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
                User Stories
              </Box>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f1f5f9 0%, #a5b4fc 60%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              What Our Users Say
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              sx={{
                color: '#94a3b8',
                textAlign: 'center',
                mb: 7,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.8,
              }}
            >
              Join thousands of students and faculty who are already collaborating on UnitEd
            </Typography>
          </motion.div>

          {/* Testimonial cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {testimonials.map((t, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.08)',
                      transform: 'translateY(-10px)',
                      boxShadow: `0 25px 65px ${t.glow}`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0, left: 0, right: 0,
                      height: 3,
                      background: t.accent,
                    },
                  }}
                >
                  {/* Quote icon */}
                  <Box sx={{ position: 'absolute', top: 20, right: 20, opacity: 0.12 }}>
                    <Quote size={44} color="#a5b4fc" />
                  </Box>

                  {/* Author */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={t.avatar}
                      sx={{
                        width: 52, height: 52, mr: 2,
                        background: t.accent,
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#fff',
                        border: '2px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      {t.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 0.25 }}>
                        {t.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.4 }}>
                        {t.role} · {t.department}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quote */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#cbd5e1',
                      lineHeight: 1.85,
                      fontStyle: 'italic',
                    }}
                  >
                    "{t.quote}"
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
