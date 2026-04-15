import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  User, Brain, Users, MessageCircle, Target,
  Bell, Mail, Star, Filter, BarChart, Briefcase
} from 'lucide-react';

const features = [
  {
    icon: User,
    title: 'Smart Profiles',
    description: 'Comprehensive profiles with skills, projects, achievements, and resume integration.',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.22)',
  },
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Advanced ML algorithms match you with perfect team members based on skills and compatibility.',
    gradient: 'linear-gradient(135deg, #f97316, #eab308)',
    glow: 'rgba(249,115,22,0.22)',
  },
  {
    icon: Users,
    title: 'Team Formation',
    description: 'Create diverse teams with complementary skills. Smart candidate recommendations included.',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    glow: 'rgba(16,185,129,0.22)',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Chat',
    description: 'Group chats, channels, and direct messaging with file sharing and message threading.',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    glow: 'rgba(139,92,246,0.22)',
  },
  {
    icon: Target,
    title: 'Personalized Feed',
    description: 'AI-curated feed showing opportunities that match your profile with smart filters.',
    gradient: 'linear-gradient(135deg, #ec4899, #f97316)',
    glow: 'rgba(236,72,153,0.22)',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Real-time alerts for applications, team invitations, and opportunities. Stay informed.',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    glow: 'rgba(239,68,68,0.22)',
  },
  {
    icon: Mail,
    title: 'Email Integration',
    description: 'Automated email notifications for applications, acceptances, and team updates.',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    glow: 'rgba(59,130,246,0.22)',
  },
  {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description: 'Track application success rate, skill demand, profile views, and engagement metrics.',
    gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
    glow: 'rgba(16,185,129,0.22)',
  },
  {
    icon: Filter,
    title: 'Advanced Search',
    description: 'Filter opportunities by skills, department, project type, and timeline.',
    gradient: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    glow: 'rgba(99,102,241,0.22)',
  },
  {
    icon: Briefcase,
    title: 'Project Management',
    description: 'Manage active projects, track team members, monitor progress all in one place.',
    gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
    glow: 'rgba(20,184,166,0.22)',
  },
  {
    icon: Star,
    title: 'Recommendations',
    description: 'Personalized suggestions for team members, skills to learn, and projects to join.',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    glow: 'rgba(245,158,11,0.22)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55 } },
};

const FeaturesSection: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.05 });

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: '#111827',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <Box sx={{
        position: 'absolute', top: '10%', right: '-5%', width: '35%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '10%', left: '-5%', width: '35%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
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
                  border: '1px solid rgba(139,92,246,0.4)',
                  background: 'rgba(139,92,246,0.1)',
                  color: '#c4b5fd',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                Platform Features
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
                color: '#f1f5f9',
              }}
            >
              Powerful Features for{' '}<Box component="span" sx={{ color: '#F97316' }}>Academic Success</Box>
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              sx={{
                color: '#94a3b8',
                textAlign: 'center',
                mb: 8,
                maxWidth: 700,
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.8,
              }}
            >
              A comprehensive platform with powerful tools designed to revolutionize academic collaboration and team building
            </Typography>
          </motion.div>

          {/* Features Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Box
                    sx={{
                      height: '100%',
                      p: 3.5,
                      borderRadius: 3,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      cursor: 'default',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 50px ${feature.glow}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 2.5,
                        background: feature.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                        boxShadow: `0 6px 20px ${feature.glow}`,
                      }}
                    >
                      <Icon size={24} color="#fff" strokeWidth={2} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ color: '#f1f5f9', fontWeight: 700, mb: 1, fontSize: '1rem' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.75 }}>
                      {feature.description}
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

export default FeaturesSection;
