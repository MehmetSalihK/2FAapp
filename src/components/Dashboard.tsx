import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  styled,
  alpha,
  useTheme,
  keyframes,
  Stack,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Security,
  Notifications,
  Settings,
  AccountCircle,
  ExitToApp,
  Shield,
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Phone,
  Smartphone,
  Computer,
  LocationOn,
  AccessTime,
  CheckCircle,
  Warning,
  Error,
  Info,
  Add,
  Edit,
  Delete,
  MoreVert,
  Refresh,
  Download,
  Upload,
  VpnKey,
  Fingerprint,
  Face,
  QrCode,
  History,
  TrendingUp,
  DeviceHub,
  CloudSync,
  NotificationsActive,
  VerifiedUser,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(25, 118, 210, 0.6);
  }
`;

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.15)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const GradientCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
  color: theme.palette.primary.contrastText,
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
  animation: `${glow} 3s ease-in-out infinite`,
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.1)}`,
    '& .stat-icon': {
      animation: `${pulse} 0.6s ease-in-out`,
    },
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(20px)',
  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
  '&:hover': {
    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.main, 0.7)})`,
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail, onLogout }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [securityScore, setSecurityScore] = useState(85);

  // Mock data
  const [devices] = useState([
    {
      id: 1,
      name: 'iPhone 14 Pro',
      type: 'mobile',
      location: 'Paris, France',
      lastActive: '2 minutes ago',
      trusted: true,
      current: true,
    },
    {
      id: 2,
      name: 'MacBook Pro',
      type: 'desktop',
      location: 'Paris, France',
      lastActive: '1 hour ago',
      trusted: true,
      current: false,
    },
    {
      id: 3,
      name: 'Chrome Browser',
      type: 'browser',
      location: 'Lyon, France',
      lastActive: '2 days ago',
      trusted: false,
      current: false,
    },
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      action: 'Connexion réussie',
      device: 'iPhone 14 Pro',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      action: 'Code 2FA vérifié',
      device: 'MacBook Pro',
      time: '1 hour ago',
      status: 'success',
    },
    {
      id: 3,
      action: 'Tentative de connexion bloquée',
      device: 'Appareil inconnu',
      time: '3 hours ago',
      status: 'warning',
    },
    {
      id: 4,
      action: 'Mot de passe modifié',
      device: 'MacBook Pro',
      time: '1 day ago',
      status: 'info',
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone />;
      case 'desktop':
        return <Computer />;
      case 'browser':
        return <Computer />;
      default:
        return <DeviceHub />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      case 'info':
        return <Info color="info" />;
      default:
        return <Info />;
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Welcome Card */}
      <Grid item xs={12}>
        <GradientCard>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: alpha(theme.palette.common.white, 0.2),
                  fontSize: '2rem',
                }}
              >
                {userEmail.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Bienvenue, {userEmail.split('@')[0]} !
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  Votre compte est sécurisé et protégé
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<VerifiedUser />}
                    label="Compte vérifié"
                    sx={{ background: alpha(theme.palette.common.white, 0.2), color: 'inherit' }}
                  />
                  <Chip
                    icon={<Shield />}
                    label="2FA activé"
                    sx={{ background: alpha(theme.palette.common.white, 0.2), color: 'inherit' }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </GradientCard>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box className="stat-icon" sx={{ mb: 2 }}>
              <Security sx={{ fontSize: 48, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="primary">
              {securityScore}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Score de sécurité
            </Typography>
            <LinearProgress
              variant="determinate"
              value={securityScore}
              color={getSecurityScoreColor(securityScore)}
              sx={{ mt: 1, borderRadius: 1 }}
            />
          </CardContent>
        </StatCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box className="stat-icon" sx={{ mb: 2 }}>
              <DeviceHub sx={{ fontSize: 48, color: theme.palette.success.main }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {devices.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Appareils connectés
            </Typography>
          </CardContent>
        </StatCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box className="stat-icon" sx={{ mb: 2 }}>
              <History sx={{ fontSize: 48, color: theme.palette.info.main }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="info.main">
              {recentActivity.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Activités récentes
            </Typography>
          </CardContent>
        </StatCard>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box className="stat-icon" sx={{ mb: 2 }}>
              <TrendingUp sx={{ fontSize: 48, color: theme.palette.warning.main }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="warning.main">
              24h
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dernière connexion
            </Typography>
          </CardContent>
        </StatCard>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} md={8}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Activité récente
              </Typography>
              <Button startIcon={<Refresh />} size="small">
                Actualiser
              </Button>
            </Box>
            <List>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(activity.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.device} • ${activity.time}`}
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Security Alerts */}
      <Grid item xs={12} md={4}>
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Alertes de sécurité
            </Typography>
            <Stack spacing={2}>
              <Alert severity="success" variant="outlined">
                <AlertTitle>Sécurité optimale</AlertTitle>
                Votre compte est bien protégé !
              </Alert>
              <Alert severity="info" variant="outlined">
                <AlertTitle>Recommandation</AlertTitle>
                Activez la biométrie pour plus de sécurité.
              </Alert>
            </Stack>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );

  const renderSecurity = () => (
    <Grid container spacing={3}>
      {/* Security Settings */}
      <Grid item xs={12} md={6}>
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Paramètres de sécurité
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <VpnKey color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Authentification à deux facteurs"
                  secondary="Protection supplémentaire pour votre compte"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Fingerprint color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Authentification biométrique"
                  secondary="Utilisez votre empreinte ou reconnaissance faciale"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={biometricEnabled}
                    onChange={(e) => setBiometricEnabled(e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <NotificationsActive color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Notifications de sécurité"
                  secondary="Recevez des alertes pour les activités suspectes"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Password & Recovery */}
      <Grid item xs={12} md={6}>
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Mot de passe et récupération
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Lock />}
                fullWidth
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                Changer le mot de passe
              </Button>
              <Button
                variant="outlined"
                startIcon={<Email />}
                fullWidth
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                Configurer l'email de récupération
              </Button>
              <Button
                variant="outlined"
                startIcon={<Phone />}
                fullWidth
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                Ajouter un numéro de téléphone
              </Button>
              <Button
                variant="outlined"
                startIcon={<QrCode />}
                fullWidth
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                Configurer l'authentificateur
              </Button>
            </Stack>
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Security Score Details */}
      <Grid item xs={12}>
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Analyse de sécurité détaillée
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <CheckCircle sx={{ fontSize: 48, color: theme.palette.success.main, mb: 1 }} />
                  <Typography variant="h6" color="success.main">Excellent</Typography>
                  <Typography variant="body2" color="text.secondary">Mot de passe fort</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <CheckCircle sx={{ fontSize: 48, color: theme.palette.success.main, mb: 1 }} />
                  <Typography variant="h6" color="success.main">Activé</Typography>
                  <Typography variant="body2" color="text.secondary">2FA configuré</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Warning sx={{ fontSize: 48, color: theme.palette.warning.main, mb: 1 }} />
                  <Typography variant="h6" color="warning.main">À améliorer</Typography>
                  <Typography variant="body2" color="text.secondary">Biométrie désactivée</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <CheckCircle sx={{ fontSize: 48, color: theme.palette.success.main, mb: 1 }} />
                  <Typography variant="h6" color="success.main">Sécurisé</Typography>
                  <Typography variant="body2" color="text.secondary">Email vérifié</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );

  const renderDevices = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <StyledCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Appareils connectés
              </Typography>
              <Button startIcon={<Add />} variant="contained">
                Ajouter un appareil
              </Button>
            </Box>
            <Grid container spacing={2}>
              {devices.map((device) => (
                <Grid item xs={12} md={6} lg={4} key={device.id}>
                  <Card
                    sx={{
                      border: device.current ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                      borderColor: device.current ? theme.palette.primary.main : theme.palette.divider,
                      position: 'relative',
                    }}
                  >
                    {device.current && (
                      <Chip
                        label="Appareil actuel"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      />
                    )}
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {getDeviceIcon(device.type)}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {device.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {device.location}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {device.lastActive}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={device.trusted ? 'Appareil de confiance' : 'Non vérifié'}
                          color={device.trusted ? 'success' : 'warning'}
                          size="small"
                        />
                        {!device.current && (
                          <Button size="small" color="error">
                            Déconnecter
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <StyledAppBar position="sticky" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Shield sx={{ fontSize: 32, color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              SecureAuth Dashboard
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications sx={{ color: theme.palette.text.primary }} />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Paramètres">
              <IconButton color="inherit">
                <Settings sx={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Profil">
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                  {userEmail.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText>Mon profil</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText>Paramètres</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={onLogout}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText>Se déconnecter</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Main Content */}
      <StyledContainer maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Navigation Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  py: 2,
                },
              }}
            >
              <Tab
                label="Vue d'ensemble"
                icon={<DashboardIcon />}
                iconPosition="start"
              />
              <Tab
                label="Sécurité"
                icon={<Security />}
                iconPosition="start"
              />
              <Tab
                label="Appareils"
                icon={<DeviceHub />}
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tabValue}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabPanel value={tabValue} index={0}>
                {renderOverview()}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {renderSecurity()}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                {renderDevices()}
              </TabPanel>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </StyledContainer>

      {/* Floating Action Button */}
      <FloatingActionButton color="primary">
        <Add />
      </FloatingActionButton>
    </Box>
  );
};

export default Dashboard;
