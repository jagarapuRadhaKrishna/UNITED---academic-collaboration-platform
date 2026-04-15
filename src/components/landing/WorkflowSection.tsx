import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UserPlus, Search, Send, Users } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Sign up and build a comprehensive profile with your skills, projects, and interests.',
    number: '01',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    glow: 'rgba(99,102,241,0.45)',
    ring: 'rgba(99,102,241,0.25)',
  },
  {
    icon: Search,
    title: 'Discover Opportunities',
    description: 'Browse AI-recommended opportunities or post your own project needs.',
    number: '02',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    glow: 'rgba(6,182,212,0.45)',
    ring: 'rgba(6,182,212,0.25)',
  },
  {
    icon: Send,
    title: 'Apply & Connect',
    description: 'Submit skill-specific applications and wait for approval from opportunity creators.',
    number: '03',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    glow: 'rgba(16,185,129,0.45)',
    ring: 'rgba(16,185,129,0.25)',
  },
  {
    icon: Users,
    title: 'Collaborate',
    description: 'Join team chatrooms to communicate, share files, and work together on projects.',
    number: '04',
    gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
    glow: 'rgba(249,115,22,0.45)',
    ring: 'rgba(249,115,22,0.25)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65 } },
};

const WorkflowSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });

  return (
    <Box
      id="workflow"
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: '#0f172a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <Box sx={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
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
                  border: '1px solid rgba(16,185,129,0.4)',
                  background: 'rgba(16,185,129,0.1)',
                  color: '#6ee7b7',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                How It Works
              </Box>
            </Box>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f1f5f9 0%, #6ee7b7 60%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Your Journey Starts Here
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              sx={{
                color: '#94a3b8',
                textAlign: 'center',
                mb: 10,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.8,
              }}
            >
              Four simple steps to start collaborating on amazing academic projects
            </Typography>
          </motion.div>

          <Box sx={{ position: 'relative' }}>
            {/* Connecting Line (desktop) */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 64,
                left: '12.5%',
                right: '12.5%',
                height: 2,
                background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 33%, #10b981 66%, #f97316 100%)',
                opacity: 0.4,
                zIndex: 0,
                borderRadius: 1,
              }}
            />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                gap: 4,
                position: 'relative',
                zIndex: 1,
              }}
            >
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <Box sx={{ textAlign: 'center', position: 'relative' }}>
                      {/* Circle wrapper */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: 128,
                          height: 128,
                          mx: 'auto',
                          mb: 3,
                        }}
                      >
                        {/* Pulsing ring */}
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: -10,
                            borderRadius: '50%',
                            border: `2px solid ${step.ring}`,
                            animation: 'pulse-ring 2.5s ease-in-out infinite',
                            '@keyframes pulse-ring': {
                              '0%': { opacity: 0.5, transform: 'scale(1)' },
                              '50%': { opacity: 1, transform: 'scale(1.06)' },
                              '100%': { opacity: 0.5, transform: 'scale(1)' },
                            },
                          }}
                        />
                        {/* Main circle */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: step.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            boxShadow: `0 15px 45px ${step.glow}`,
                            transition: 'all 0.35s ease',
                            '&:hover': {
                              transform: 'scale(1.1) rotate(6deg)',
                              boxShadow: `0 25px 65px ${step.glow}`,
                            },
                          }}
                        >
                          <Icon size={44} strokeWidth={2} />
                        </Box>
                        {/* Step number badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: '#0f172a',
                            border: '2px solid rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            color: '#f1f5f9',
                          }}
                        >
                          {step.number}
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1.5 }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#94a3b8', lineHeight: 1.8, px: 1 }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default WorkflowSection;
