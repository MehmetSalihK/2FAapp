import React, { useState } from 'react';
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
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { sendVerificationEmail } from '../services/emailService';

interface AuthProps {
  onLogin: (userId: string) => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  animation: `${fadeIn} 0.5s ease-out`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Auth = ({ onLogin }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'credentials' | 'code'>('credentials');
  const [message, setMessage] = useState('');

  const generateVerificationCode = (): string => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (verificationStep === 'credentials') {
        // Première étape : vérification des identifiants
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (userCredential.user) {
          // Générer le code de vérification
          const code = generateVerificationCode();
          
          try {
            // Envoyer le code par email
            const emailSent = await sendVerificationEmail(email, code);
            if (!emailSent) {
              throw new Error('Échec de l\'envoi de l\'email');
            }

            // Stocker le code avec un timestamp et un sel unique
            const salt = Math.random().toString(36).substring(2);
            const timestamp = Date.now();
            const encryptedCode = btoa(`${salt}:${code}:${timestamp}`);
            
            localStorage.setItem('verificationCode', encryptedCode);
            localStorage.setItem('verificationCodeExpiry', (timestamp + 600000).toString()); // 10 minutes
          
            setVerificationStep('code');
            setMessage('Un code de vérification à 8 chiffres a été envoyé à votre adresse email.');

            // Pour le développement, afficher aussi le code dans la console
            console.log('Code de vérification (dev only):', code);
          } catch (error) {
            console.error('Erreur lors du processus de vérification:', error);
            setError('Erreur lors de l\'envoi du code de vérification. Veuillez réessayer.');
          }
        }
      } else if (verificationStep === 'code') {
        // Vérification du code
        const storedEncryptedCode = localStorage.getItem('verificationCode');
        const expiryTime = localStorage.getItem('verificationCodeExpiry');
        
        if (!storedEncryptedCode || !expiryTime) {
          setError('Code de vérification non trouvé ou expiré');
          setVerificationStep('credentials');
          return;
        }
        
        if (Date.now() > parseInt(expiryTime)) {
          setError('Code de vérification expiré');
          localStorage.removeItem('verificationCode');
          localStorage.removeItem('verificationCodeExpiry');
          setVerificationStep('credentials');
          return;
        }
        
        try {
          // Décrypter et vérifier le code
          const [salt, storedCode, timestamp] = atob(storedEncryptedCode).split(':');
          
          if (!salt || !storedCode || !timestamp) {
            throw new Error('Format de code invalide');
          }
          
          if (verificationCode === storedCode) {
            const user = auth.currentUser;
            if (user) {
              // Nettoyer le localStorage
              localStorage.removeItem('verificationCode');
              localStorage.removeItem('verificationCodeExpiry');
              
              onLogin(user.uid);
            }
          } else {
            setError('Code de vérification incorrect');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du code:', error);
          setError('Erreur lors de la vérification du code');
          setVerificationStep('credentials');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/network-request-failed') {
        setError('Erreur de connexion. Vérifiez votre connexion internet.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Email ou mot de passe incorrect');
      } else if (error.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cet email');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Trop de tentatives. Veuillez réessayer plus tard.');
      } else {
        setError(error.message || 'Une erreur est survenue lors de la connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={6}>
        <Typography component="h1" variant="h5" gutterBottom>
          {verificationStep === 'credentials' ? 'Connexion' : 'Vérification'}
        </Typography>
        <StyledForm onSubmit={handleLogin}>
          {verificationStep === 'credentials' ? (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </>
          ) : (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="verificationCode"
              label="Code de vérification (8 chiffres)"
              name="verificationCode"
              autoComplete="off"
              autoFocus
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={loading}
              inputProps={{ maxLength: 8, pattern: '[0-9]*' }}
              helperText="Veuillez entrer le code à 8 chiffres envoyé à votre adresse email"
            />
          )}
          {error && (
            <Typography color="error" align="center" style={{ marginTop: '1rem' }}>
              {error}
            </Typography>
          )}
          {message && (
            <Typography color="primary" align="center" style={{ marginTop: '1rem' }}>
              {message}
            </Typography>
          )}
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : verificationStep === 'credentials' ? (
              'Se connecter'
            ) : (
              'Vérifier le code'
            )}
          </StyledButton>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

export default Auth;
