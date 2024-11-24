import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  updatePassword,
  updateEmail,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from 'firebase/auth';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface AccountSettingsProps {
  user: User;
  onLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onLogout }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');

  // Fonction pour réauthentifier l'utilisateur
  const reauthenticate = async (password: string) => {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
  };

  // Changer le mot de passe
  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (newPassword !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (newPassword.length < 6) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      }

      // Réauthentifier l'utilisateur
      await reauthenticate(currentPassword);

      // Mettre à jour le mot de passe
      await updatePassword(user, newPassword);

      setSuccess('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Password change error:', err);
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  // Changer l'email
  const handleEmailChange = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!newEmail) {
        throw new Error('Veuillez entrer un nouvel email');
      }

      // Réauthentifier l'utilisateur
      await reauthenticate(currentPassword);

      // Mettre à jour l'email
      await updateEmail(user, newEmail);

      setSuccess('Email mis à jour avec succès');
      setCurrentPassword('');
      setNewEmail('');
    } catch (err: any) {
      console.error('Email change error:', err);
      setError(err.message || 'Erreur lors du changement d\'email');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer le compte
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      // Réauthentifier l'utilisateur
      await reauthenticate(deleteConfirmPassword);

      // Supprimer le compte
      await deleteUser(user);

      // Déconnecter l'utilisateur
      onLogout();
    } catch (err: any) {
      console.error('Account deletion error:', err);
      setError(err.message || 'Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ mb: 4 }}>
          Paramètres du compte
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Informations du compte
          </Typography>
          <Typography>Email actuel : {user.email}</Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Changement de mot de passe */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Changer le mot de passe
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Mot de passe actuel"
            type={showPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            InputProps={{
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nouveau mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirmer le nouveau mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handlePasswordChange}
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            sx={{ mt: 2 }}
          >
            {loading ? 'Chargement...' : 'Changer le mot de passe'}
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Changement d'email */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Changer l'email
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Mot de passe actuel"
            type={showPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            InputProps={{
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nouvel email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={loading}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleEmailChange}
            disabled={loading || !currentPassword || !newEmail}
            sx={{ mt: 2 }}
          >
            {loading ? 'Chargement...' : 'Changer l\'email'}
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Suppression du compte */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
            Zone dangereuse
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={loading}
          >
            Supprimer mon compte
          </Button>
        </Box>

        {/* Dialog de confirmation de suppression */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            if (!loading) {
              setDeleteDialogOpen(false);
              setDeleteConfirmPassword('');
              setError(null);
            }
          }}
        >
          <DialogTitle>Supprimer le compte</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirmez votre mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={deleteConfirmPassword}
              onChange={(e) => setDeleteConfirmPassword(e.target.value)}
              disabled={loading}
              InputProps={{
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
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteConfirmPassword('');
                setError(null);
              }}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={loading || !deleteConfirmPassword}
              color="error"
            >
              {loading ? 'Suppression...' : 'Supprimer définitivement'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AccountSettings;
