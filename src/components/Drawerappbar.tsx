import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const drawerWidth = 240;

const navItems = [
  { label: 'ACCUEIL', path: '/' },
  { label: 'ÉMISSIONS ET CONCOURS', path: '/emissions' },
  { label: 'ACTUALITÉ', path: '/actualities' },
  { label: 'A PROPOS', path: '/a-propos' }
];

interface NavItem {
  label: string;
  path: string;
}

interface DrawerAppBarProps {
  window?: () => Window;
}

interface User {
  id?: string;
  email?: string;
  [key: string]: any;
}

interface ReferralData {
  code: string;
  link: string;
}

function DrawerAppBar(props: DrawerAppBarProps) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [referralDialogOpen, setReferralDialogOpen] = React.useState<boolean>(false);
  const [referralData, setReferralData] = React.useState<ReferralData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = React.useState<User | null>(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const handleDrawerToggle = (): void => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      const res = await axios.post( 
        `${apiUrl}/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (res.data.success) {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
      } else {
        alert(res.data.message || 'Erreur lors de la déconnexion');
      }
    } catch (error: unknown) {
      console.error('Erreur logout:', error);
      localStorage.removeItem('user');
      setUser(null);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Erreur réseau. Déconnexion locale effectuée.');
      }
      navigate('/login');
    }
  };

  const generateReferralCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleReferralClick = async (): Promise<void> => {
    if (!user) {
      navigate('/login');
      return;
    }

    setReferralDialogOpen(true);
    setLoading(true);

    try {
      // Tentative d'appel API pour récupérer ou générer le code de parrainage
      const response = await axios.get(
        `${apiUrl}/referral/${user.id}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (response.data.success) {
        setReferralData(response.data.data);
      } else {
        throw new Error('Erreur lors de la récupération du code de parrainage');
      }
    } catch (error) {
      console.warn('API non disponible, génération locale du code:', error);
      
      // Fallback : génération locale si l'API n'est pas disponible
      const code = generateReferralCode();
      const link = `http://localhost:5173/register?ref=${code}`;
      
      setReferralData({ code, link });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = async (text: string, type: 'code' | 'link'): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage(`${type === 'code' ? 'Code' : 'Lien'} copié dans le presse-papiers !`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      setSnackbarMessage('Erreur lors de la copie');
      setSnackbarOpen(true);
    }
  };

  const handleCloseReferralDialog = (): void => {
    setReferralDialogOpen(false);
    setReferralData(null);
  };

  const handleCloseSnackbar = (): void => {
    setSnackbarOpen(false);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2 }}>
        <img src="/img/logo.png" alt="Logo" style={{ height: 40 }} />
      </Box>
      <Divider />
      <List>
        {navItems.map((item: NavItem) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                textAlign: 'center',
                color: location.pathname === item.path ? '#861e81' : '#000',
                backgroundColor: location.pathname === item.path ? 'rgba(134, 30, 129, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(134, 30, 129, 0.1)',
                  color: '#861e81',
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Bouton de parrainage pour mobile */}
        {user && (
          <ListItem disablePadding>
            <Button
              onClick={handleReferralClick}
              startIcon={<ShareIcon />}
              variant="outlined"
              fullWidth
              sx={{
                mt: 1,
                mx: 2,
                color: '#861e81',
                borderColor: '#861e81',
                '&:hover': {
                  backgroundColor: 'rgba(134, 30, 129, 0.1)',
                  borderColor: '#861e81',
                },
              }}
            >
              Parrainage
            </Button>
          </ListItem>
        )}
        
        {user ? (
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            variant="outlined"
            sx={{
              mt: 2,
              color: '#fff',
              backgroundColor: '#dc3545',
              '&:hover': { backgroundColor: '#b52a37', color: '#fff' },
            }}
          >
            Se Déconnecter
          </Button>
        ) : (
          <Button
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
            variant="outlined"
            sx={{
              mt: 2,
              color: '#fff',
              backgroundColor: '#861e81',
              '&:hover': { backgroundColor: '#dc3545', color: '#fff' },
            }}
          >
            S'AUTHENTIFIER
          </Button>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: '#fff', color: '#861e81', height: 80 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ my: 2, display: { xs: 'none', sm: 'block' } }}>
              <img src="/img/logo.png" alt="Logo" style={{ height: 70 }} />
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            {navItems.map((item: NavItem) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#861e81' : '#000',
                  backgroundColor: location.pathname === item.path ? 'rgba(134, 30, 129, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(134, 30, 129, 0.1)',
                    color: '#861e81',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            
            {/* Bouton de parrainage pour desktop */}
            {user && (
              <Button
                onClick={handleReferralClick}
                startIcon={<ShareIcon />}
                variant="outlined"
                sx={{
                  color: '#861e81',
                  borderColor: '#861e81',
                  '&:hover': {
                    backgroundColor: 'rgba(134, 30, 129, 0.1)',
                    borderColor: '#861e81',
                  },
                }}
              >
                Parrainage
              </Button>
            )}
            
            {user ? (
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                variant="outlined"
                sx={{
                  color: '#fff',
                  backgroundColor: '#dc3545',
                  '&:hover': { backgroundColor: '#b52a37', color: '#fff' },
                }}
              >
                Se Déconnecter
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                variant="outlined"
                sx={{
                  color: '#fff',
                  backgroundColor: '#861e81',
                  '&:hover': { backgroundColor: '#dc3545', color: '#fff' },
                }}
              >
                S'AUTHENTIFIER
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      {/* Dialog de parrainage */}
      <Dialog
        open={referralDialogOpen}
        onClose={handleCloseReferralDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShareIcon sx={{ color: '#861e81' }} />
            <Typography variant="h6">Mon Code de Parrainage</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography>Génération du code de parrainage...</Typography>
            </Box>
          ) : referralData ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Partagez votre code ou lien de parrainage avec vos amis pour qu'ils puissent s'inscrire :
              </Typography>
              
              {/* Code de parrainage */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Code de parrainage :
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={referralData.code}
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={{
                      '& .MuiInputBase-input': {
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: '#861e81',
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => handleCopyToClipboard(referralData.code, 'code')}
                    sx={{ color: '#861e81' }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Lien de parrainage */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Lien de parrainage :
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={referralData.link}
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => handleCopyToClipboard(referralData.link, 'link')}
                    sx={{ color: '#861e81' }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReferralDialog} sx={{ color: '#861e81' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box component="main">
        <Toolbar />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;