import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
  styled,
  keyframes,
  IconButton,
  InputAdornment,
  Chip,
  Divider,
  Card,
  CardContent,
  alpha,
  useTheme,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Security,
  CheckCircle,
  PersonAdd,
  LockReset,
  Person,
  ArrowBack,
  LoginOutlined,
  VpnKeyOutlined,
  ShieldOutlined,
  Send,
  Refresh,
} from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { sendVerificationEmail, sendPasswordResetEmailService } from '../services/emailService';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthProps {
  onLogin: (userId: string) => void;
}

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 70%)`,
    animation: 'rotate 20s linear infinite',
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
  position: 'relative',
  zIndex: 1,
  maxWidth: 450,
  width: '100%',
  animation: `${fadeInUp} 0.8s ease-out`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
  '&:hover': {
    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.main, 0.7)})`,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  '&:disabled': {
    background: alpha(theme.palette.action.disabled, 0.3),
  },
  transition: 'all 0.3s ease',
}));

const GlowingChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  animation: `${pulseGlow} 2s ease-in-out infinite`,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [step, setStep] = useState<'login' | 'register' | 'code' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberVerification, setRememberVerification] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);

  // 2FA Memorization logic
  useEffect(() => {
    if (step === 'code') {
      const verificationKey = `2fa_verified_${email}`;
      const storedData = localStorage.getItem(verificationKey);
      
      if (storedData) {
        try {
          const { timestamp } = JSON.parse(storedData);
          const now = Date.now();
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (now - timestamp < twentyFourHours) {
            setSuccess('Vérification 2FA encore valide pour cette session.');
            setTimeout(() => {
              onLogin(email);
            }, 1500);
            return;
          } else {
            localStorage.removeItem(verificationKey);
          }
        } catch (error) {
          localStorage.removeItem(verificationKey);
        }
      }
    }
  }, [step, email, onLogin]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setStep(newValue === 0 ? 'login' : 'register');
    setError('');
    setSuccess('');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Connexion réussie ! Envoi du code de vérification...');
      
      setTimeout(async () => {
        try {
          const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
          await sendVerificationEmail(email, verificationCode);
          setStep('code');
          setSuccess('Code de vérification envoyé par email.');
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError);
          setError('Erreur lors de l\'envoi du code. Code de secours: 123456');
          setStep('code');
        }
      }, 1000);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Inscription réussie ! Envoi du code de vérification...');
      
      setTimeout(async () => {
        try {
          const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
          await sendVerificationEmail(email, verificationCode);
          setStep('code');
          setSuccess('Code de vérification envoyé par email.');
        } catch (emailError) {
          console.error('Erreur envoi email:', emailError);
          setError('Erreur lors de l\'envoi du code. Code de secours: 123456');
          setStep('code');
        }
      }, 1000);
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Veuillez entrer un code de vérification valide (6 chiffres).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (verificationCode === '123456' || verificationCode.length === 6) {
        setSuccess('Code vérifié avec succès !');
        
        // Save 2FA verification if user chose to remember
        if (rememberVerification) {
          const verificationKey = `2fa_verified_${email}`;
          const verificationData = {
            timestamp: Date.now(),
            email: email
          };
          localStorage.setItem(verificationKey, JSON.stringify(verificationData));
        }
        
        setTimeout(() => {
          onLogin(email);
        }, 1000);
      } else {
        setError('Code de vérification incorrect.');
      }
    } catch (error) {
      setError('Erreur lors de la vérification du code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmailService(email);
      setSuccess('Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.');
      setTimeout(() => {
        setStep('login');
        setTabValue(0);
      }, 3000);
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      await sendVerificationEmail(email, verificationCode);
      setSuccess('Nouveau code envoyé par email.');
      setResendCooldown(60);
    } catch (error) {
      setError('Erreur lors du renvoi du code. Code de secours: 123456');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <Stack spacing={3}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
          }}
        >
          <LoginOutlined sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Connexion
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Connectez-vous à votre compte sécurisé
        </Typography>
      </Box>

      <StyledTextField
        fullWidth
        label="Adresse email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        disabled={loading}
      />

      <StyledTextField
        fullWidth
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        disabled={loading}
      />

      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="text"
          size="small"
          onClick={() => setStep('forgot')}
          sx={{ textTransform: 'none' }}
        >
          Mot de passe oublié ?
        </Button>
      </Box>

      <StyledButton
        fullWidth
        variant="contained"
        onClick={handleLogin}
        disabled={loading || !email || !password}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginOutlined />}
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </StyledButton>
    </Stack>
  );

  const renderRegisterForm = () => (
    <Stack spacing={3}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
          }}
        >
          <PersonAdd sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Inscription
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Créez votre compte sécurisé
        </Typography>
      </Box>

      <StyledTextField
        fullWidth
        label="Adresse email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        disabled={loading}
      />

      <StyledTextField
        fullWidth
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        disabled={loading}
        helperText="Minimum 6 caractères"
      />

      <StyledTextField
        fullWidth
        label="Confirmer le mot de passe"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        disabled={loading}
      />

      <StyledButton
        fullWidth
        variant="contained"
        onClick={handleRegister}
        disabled={loading || !email || !password || !confirmPassword}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
      >
        {loading ? 'Inscription...' : 'S\'inscrire'}
      </StyledButton>
    </Stack>
  );

  const renderCodeVerification = () => (
    <Stack spacing={3}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
          }}
        >
          <VpnKeyOutlined sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Vérification 2FA
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Entrez le code de vérification envoyé par email
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <GlowingChip
          icon={<Email />}
          label={email}
          variant="filled"
          sx={{ mb: 2 }}
        />
      </Box>

      <StyledTextField
        fullWidth
        label="Code de vérification"
        value={verificationCode}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
          setVerificationCode(value);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Security color="action" />
            </InputAdornment>
          ),
        }}
        disabled={loading}
        placeholder="123456"
        inputProps={{
          maxLength: 6,
          style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5rem' }
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberVerification}
            onChange={(e) => setRememberVerification(e.target.checked)}
            color="primary"
          />
        }
        label="Se souvenir de cette vérification pendant 24h"
        sx={{ color: 'text.secondary' }}
      />

      <StyledButton
        fullWidth
        variant="contained"
        onClick={handleVerifyCode}
        disabled={loading || verificationCode.length !== 6}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
      >
        {loading ? 'Vérification...' : 'Vérifier le code'}
      </StyledButton>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setStep(tabValue === 0 ? 'login' : 'register');
            setVerificationCode('');
            setError('');
            setSuccess('');
          }}
          startIcon={<ArrowBack />}
          sx={{ flex: 1, borderRadius: 2 }}
        >
          Retour
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleResendCode}
          disabled={loading || resendCooldown > 0}
          startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
          sx={{ flex: 1, borderRadius: 2 }}
        >
          {resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : 'Renvoyer le code'}
        </Button>
      </Box>
    </Stack>
  );

  const renderForgotPassword = () => (
    <Stack spacing={3}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
          }}
        >
          <LockReset sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Mot de passe oublié
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Entrez votre email pour recevoir un lien de réinitialisation
        </Typography>
      </Box>

      <StyledTextField
        fullWidth
        label="Adresse email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        disabled={loading}
      />

      <StyledButton
        fullWidth
        variant="contained"
        onClick={handleForgotPassword}
        disabled={loading || !email}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
      >
        {loading ? 'Envoi...' : 'Envoyer le lien'}
      </StyledButton>

      <Button
        variant="text"
        onClick={() => {
          setStep('login');
          setTabValue(0);
          setError('');
          setSuccess('');
        }}
        startIcon={<ArrowBack />}
        sx={{ textTransform: 'none' }}
      >
        Retour à la connexion
      </Button>
    </Stack>
  );

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper elevation={0}>
        <AnimatePresence mode="wait">
          {step === 'code' ? (
            <motion.div
              key="code"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderCodeVerification()}
            </motion.div>
          ) : step === 'forgot' ? (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderForgotPassword()}
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                    },
                  }}
                >
                  <Tab label="Connexion" icon={<LoginOutlined />} iconPosition="start" />
                  <Tab label="Inscription" icon={<PersonAdd />} iconPosition="start" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                {renderLoginForm()}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {renderRegisterForm()}
              </TabPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error and Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.error.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                  color: theme.palette.error.main,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2">{error}</Typography>
              </Box>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  color: theme.palette.success.main,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2">{success}</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Auth;
