import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import {
  Security,
  Speed,
  Shield,
  Smartphone,
  Cloud,
  Lock,
  ArrowForward,
  GitHub,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: <Security sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Sécurité Avancée',
      description: 'Protection à deux facteurs avec chiffrement de bout en bout pour une sécurité maximale.'
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Rapide & Efficace',
      description: 'Génération instantanée de codes avec une interface utilisateur optimisée.'
    },
    {
      icon: <Shield sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Protection Totale',
      description: 'Sauvegarde sécurisée de vos comptes avec synchronisation cloud.'
    },
    {
      icon: <Smartphone sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Multi-Plateforme',
      description: 'Accessible sur tous vos appareils avec synchronisation automatique.'
    },
    {
      icon: <Cloud sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Sauvegarde Cloud',
      description: 'Vos données sont sauvegardées en toute sécurité dans le cloud.'
    },
    {
      icon: <Lock sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Chiffrement Fort',
      description: 'Algorithmes de chiffrement militaire pour protéger vos informations.'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.03)})`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 8 },
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                fontWeight: 800,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              Sécurisez
              <br />
              Vos Comptes
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.secondary,
                mb: 5,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Une solution moderne et élégante pour protéger vos comptes en ligne avec l'authentification à deux facteurs
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {!currentUser ? (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.main, 0.7)})`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Commencer
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderRadius: 3,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    S'inscrire
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.main, 0.7)})`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Accéder au Dashboard
                </Button>
              )}
            </Box>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 700,
                textAlign: 'center',
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              Pourquoi nous choisir ?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: theme.palette.text.secondary,
                mb: 6,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Découvrez les fonctionnalités qui font de notre application la meilleure solution 2FA
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box sx={{ mb: 3 }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 4,
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            © 2024 SecureAuth 2FA. Tous droits réservés.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <IconButton
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <GitHub />
            </IconButton>
            <IconButton
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;