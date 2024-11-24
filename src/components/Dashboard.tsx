import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Divider,
  useTheme,
  styled,
  keyframes,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Security,
  Person,
  Settings,
  ExitToApp,
  Lock,
  Phone,
  Email,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { auth } from '../firebase';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
`;

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: '#1a1a1a',
  padding: theme.spacing(3),
  transition: 'all 0.3s ease',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#2d2d2d',
  color: '#ffffff',
  borderRadius: 16,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 25px 0px rgba(0, 0, 0, 0.6)',
  },
}));

const SecurityStatus = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: '#3d3d3d',
  marginBottom: theme.spacing(4),
  '& .MuiSvgIcon-root': {
    fontSize: 48,
    color: '#ffd700',
    animation: `${pulseAnimation} 2s infinite`,
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: '#2d2d2d',
    color: '#ffffff',
    width: 280,
    padding: theme.spacing(2),
  },
}));

const StyledListItem = styled(ListItem)<{ component?: React.ElementType }>(({ theme }) => ({
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'translateX(5px)',
  },
  '& .MuiListItemIcon-root': {
    color: '#ffd700',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ffd700 30%, #ffed4a 90%)',
  color: '#000000',
  padding: theme.spacing(1.5, 3),
  borderRadius: 25,
  textTransform: 'none',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #ffc600 30%, #ffe033 90%)',
    transform: 'scale(1.02)',
  },
}));

const Dashboard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <StyledContainer maxWidth={false}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => setDrawerOpen(true)}
            sx={{ color: '#ffd700' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
            2FA Desktop
          </Typography>
          <Avatar sx={{ bgcolor: '#ffd700', color: '#000000' }}>
            {auth.currentUser?.email?.[0].toUpperCase()}
          </Avatar>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <SecurityStatus>
            <Box sx={{ textAlign: 'center' }}>
              <Security />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Sécurité Active
              </Typography>
              <Typography variant="body2" sx={{ color: '#9a9a9a', mt: 1 }}>
                Authentification à deux facteurs activée
              </Typography>
            </Box>
          </SecurityStatus>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>
                Méthodes de Vérification
              </Typography>
              <List>
                <ListItem sx={{ color: '#ffd700' }}>
                  <ListItemIcon>
                    <Email sx={{ color: '#ffd700' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={auth.currentUser?.email}
                    secondaryTypographyProps={{ sx: { color: '#9a9a9a' } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone sx={{ color: '#ffd700' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Téléphone" 
                    secondary="Ajouter un numéro"
                    secondaryTypographyProps={{ sx: { color: '#9a9a9a' } }}
                  />
                  <ActionButton size="small">
                    Ajouter
                  </ActionButton>
                </ListItem>
              </List>
            </StyledPaper>

            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>
                Dernières Activités
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Lock sx={{ color: '#ffd700' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Connexion réussie" 
                    secondary="Il y a 2 heures"
                    secondaryTypographyProps={{ sx: { color: '#9a9a9a' } }}
                  />
                </ListItem>
              </List>
            </StyledPaper>
          </Box>
        </Box>

        {/* Drawer */}
        <StyledDrawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
              2FA Desktop
            </Typography>
          </Box>
          <Divider sx={{ backgroundColor: '#4a4a4a' }} />
          <List>
            <StyledListItem component="div" onClick={() => {}}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profil" />
            </StyledListItem>
            <StyledListItem component="div" onClick={() => {}}>
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText primary="Sécurité" />
            </StyledListItem>
            <StyledListItem component="div" onClick={() => {}}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Paramètres" />
            </StyledListItem>
            <StyledListItem component="div" onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </StyledListItem>
          </List>
        </StyledDrawer>
      </Box>
    </StyledContainer>
  );
};

export default Dashboard;
