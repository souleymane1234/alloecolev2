import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import InfoIcon from '@mui/icons-material/Info';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import GridViewIcon from '@mui/icons-material/GridView';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const drawerWidth = 240;

interface User {
  id?: string;
  email?: string;
  name?: string;
  avatar?: string;
  [key: string]: any;
}

interface ReferralData {
  code: string;
  link: string;
}

interface DrawerAppBarProps {
  window?: () => Window;
}

function DrawerAppBar(props: DrawerAppBarProps) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [productsMenuAnchor, setProductsMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [etudesMenuAnchor, setEtudesMenuAnchor] = React.useState<null | HTMLElement>(null);
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

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = (): void => {
    setProfileMenuAnchor(null);
  };

  const handleProductsMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setProductsMenuAnchor(event.currentTarget);
  };

  const handleProductsMenuClose = (): void => {
    setProductsMenuAnchor(null);
  };

  const handleEtudesMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setEtudesMenuAnchor(event.currentTarget);
  };

  const handleEtudesMenuClose = (): void => {
    setEtudesMenuAnchor(null);
  };

  const handleLogout = async (): Promise<void> => {
    handleProfileMenuClose();
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

  const navItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: '8px 12px',
    minWidth: '80px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    borderRadius: '2px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '& .MuiSvgIcon-root': {
        color: '#000',
      },
      '& .nav-label': {
        color: '#000',
      },
    },
  };

  const isActive = (path: string): boolean => location.pathname === path;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2 }}>
        <img src="/img/logo-black.png" alt="Logo" style={{ height: 40 }} />
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" sx={{ py: 1.5 }}>
            <HomeIcon sx={{ mr: 2, color: '#666' }} />
            <ListItemText primary="ACCUEIL" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/emissions" sx={{ py: 1.5 }}>
            <LiveTvIcon sx={{ mr: 2, color: '#666' }} />
            <ListItemText primary="ÉMISSIONS ET CONCOURS" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/actualities" sx={{ py: 1.5 }}>
            <NewspaperIcon sx={{ mr: 2, color: '#666' }} />
            <ListItemText primary="ACTUALITÉ" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/a-propos" sx={{ py: 1.5 }}>
            <InfoIcon sx={{ mr: 2, color: '#666' }} />
            <ListItemText primary="A PROPOS" />
          </ListItemButton>
        </ListItem>
        
        <Divider sx={{ my: 2 }} />
        
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleReferralClick} sx={{ py: 1.5 }}>
              <ShareIcon sx={{ mr: 2, color: '#861e81' }} />
              <ListItemText primary="Parrainage" />
            </ListItemButton>
          </ListItem>
        )}
        
        {user ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ py: 1.5 }}>
              <LogoutIcon sx={{ mr: 2, color: '#dc3545' }} />
              <ListItemText primary="Se Déconnecter" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login" sx={{ py: 1.5 }}>
              <LoginIcon sx={{ mr: 2, color: '#861e81' }} />
              <ListItemText primary="S'AUTHENTIFIER" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        component="nav" 
        position="fixed"
        sx={{ 
          backgroundColor: '#fffefeff', 
          color: '#666',
          boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(157, 51, 51, 0.08)',
          zIndex: 1201,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1200, width: '100%', mx: 'auto', minHeight: '52px !important', px: { xs: 1, sm: 2 } }}>
          {/* Left section: Logo + Search */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/img/logo-black.png" alt="Logo" style={{ height: 36 }} />
            </Box>
            
            {/* Search Bar */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                backgroundColor: '#eef3f8',
                borderRadius: '4px',
                padding: '4px 8px',
                ml: 1,
                width: 280,
              }}
            >
              <SearchIcon sx={{ color: '#666', fontSize: 20, mr: 0.5 }} />
              <InputBase
                placeholder="Rechercher..."
                sx={{ 
                  flex: 1, 
                  fontSize: '14px',
                  '& input': {
                    padding: '4px 0',
                  }
                }}
              />
            </Box>
          </Box>

          {/* Center/Right section: Navigation Icons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {/* Accueil */}
            <Box
              component={Link}
              to="/"
              sx={{
                ...navItemStyle,
                color: isActive('/') ? '#000' : '#666',
                borderBottom: isActive('/') ? '2px solid #f97315' : '1px solid transparent',
              }}
            >
              <HomeIcon sx={{ fontSize: 24 }} />
              <Typography className="nav-label" sx={{ fontSize: '12px', mt: 0.3, fontWeight: isActive('/') ? 600 : 400 }}>
                Accueil
              </Typography>
            </Box>
            <Box
                  onMouseEnter={handleEtudesMenuOpen}
              sx={{
                ...navItemStyle,
                color: '#666',
                borderBottom: '2px solid transparent',
              }}
            >
              <LiveTvIcon sx={{ fontSize: 24 }} /> 
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3 }}>
                <Typography className="nav-label" sx={{ fontSize: '12px' }}>
                  Émissions
                </Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 16, ml: 0.2 }} />
              </Box>
            </Box>

            {/* Émissions */}
            {/* <Box
              component={Link}
              to="/emissions"
              sx={{
                ...navItemStyle,
                color: isActive('/emissions') ? '#000' : '#666',
                borderBottom: isActive('/emissions') ? '2px solid #000' : '2px solid transparent',
              }}
            >
              <LiveTvIcon sx={{ fontSize: 24 }} />
              <Typography className="nav-label" sx={{ fontSize: '12px', mt: 0.3, fontWeight: isActive('/emissions') ? 600 : 400 }}>
                Émissions
              </Typography>
            </Box> */}

            {/* Actualité */}
            <Box
              component={Link}
              to="/actualities"
              sx={{
                ...navItemStyle,
                color: isActive('/actualities') ? '#000' : '#666',
                borderBottom: isActive('/actualities') ? '2px solid #000' : '2px solid transparent',
              }}
            >
              <NewspaperIcon sx={{ fontSize: 24 }} />
              <Typography className="nav-label" sx={{ fontSize: '12px', mt: 0.3, fontWeight: isActive('/actualities') ? 600 : 400 }}>
                Actualité
              </Typography>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                ...navItemStyle,
                color: '#666',
                borderBottom: '2px solid transparent',
              }}
            >
              <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '10px', height: '16px', minWidth: '16px' } }}>
                <MessageIcon sx={{ fontSize: 24 }} />
              </Badge>
              <Typography className="nav-label" sx={{ fontSize: '12px', mt: 0.3 }}>
                Messages
              </Typography>
            </Box>

            {/* Notifications */}
            <Box
              sx={{
                ...navItemStyle,
                color: '#666',
                borderBottom: '2px solid transparent',
              }}
            >
              <Badge badgeContent={5} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '10px', height: '16px', minWidth: '16px' } }}>
                <NotificationsIcon sx={{ fontSize: 24 }} />
              </Badge>
              <Typography className="nav-label" sx={{ fontSize: '12px', mt: 0.3 }}>
                Notifications
              </Typography>
            </Box>

            {/* Profile Menu */}
            {user ? (
              <Box
                onClick={handleProfileMenuOpen}
                sx={{
                  ...navItemStyle,
                  color: '#666',
                  borderBottom: '2px solid transparent',
                }}
              >
                <Avatar 
                  sx={{ width: 24, height: 24, fontSize: '12px', bgcolor: '#861e81' }}
                  src={user.avatar}
                >
                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3 }}>
                  <Typography className="nav-label" sx={{ fontSize: '12px' }}>
                    Moi
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ fontSize: 16, ml: 0.2 }} />
                </Box>
              </Box>
            ) : (
              <Box
                component={Link}
                to="/login"
                sx={{
                  ...navItemStyle,
                  color: '#666',
                  borderBottom: '2px solid transparent',
                }}
              >
                <Avatar sx={{ width: 24, height: 24, fontSize: '12px', bgcolor: '#666' }}>
                  <LoginIcon sx={{ fontSize: 14 }} />
                </Avatar>
                <Typography className="nav-label" sx={{ fontSize: '12px', mt: 0.3 }}>
                  Connexion
                </Typography>
              </Box>
            )}

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1.5 }} />

            {/* Products Menu */}
            <Box
              onClick={handleProductsMenuOpen}
              sx={{
                ...navItemStyle,
                color: '#666',
                borderBottom: '2px solid transparent',
              }}
            >
              <GridViewIcon sx={{ fontSize: 24 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3 }}>
                <Typography className="nav-label" sx={{ fontSize: '12px' }}>
                  Produits
                </Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 16, ml: 0.2 }} />
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
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

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1.5,
          '& .MuiPaper-root': {
            minWidth: 240,
            boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 8px 16px rgba(0,0,0,.15)',
            borderRadius: '8px',
          },
        }}
      >
        <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar 
              sx={{ width: 48, height: 48, bgcolor: '#861e81' }}
              src={user?.avatar}
            >
              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {user?.name || 'Utilisateur'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Button
            component={Link}
            to="/profile"
            variant="outlined"
            size="small"
            fullWidth
            onClick={handleProfileMenuClose}
            sx={{
              textTransform: 'none',
              borderColor: '#0a66c2',
              color: '#0a66c2',
              '&:hover': {
                backgroundColor: 'rgba(10, 102, 194, 0.08)',
                borderColor: '#0a66c2',
              },
            }}
          >
            Voir le profil
          </Button>
        </Box>
        <MenuItem 
          onClick={() => { 
            handleProfileMenuClose(); 
            handleReferralClick(); 
          }}
          sx={{ py: 1.5, fontSize: '14px' }}
        >
          <ShareIcon sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
          Parrainage
        </MenuItem>
        <MenuItem 
          component={Link} 
          to="/a-propos" 
          onClick={handleProfileMenuClose}
          sx={{ py: 1.5, fontSize: '14px' }}
        >
          <InfoIcon sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
          À propos
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleLogout}
          sx={{ py: 1.5, fontSize: '14px', color: '#dc3545' }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
          Se déconnecter
        </MenuItem>
      </Menu>

      {/* Products Menu */}
      <Menu
        anchorEl={productsMenuAnchor}
        open={Boolean(productsMenuAnchor)}
        onClose={handleProductsMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1.5,
          '& .MuiPaper-root': {
            minWidth: 280,
            boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 8px 16px rgba(0,0,0,.15)',
            borderRadius: '8px',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000' }}>
            Nos Produits & Services
          </Typography>
        </Box>
        <MenuItem 
          component={Link} 
          to="/emissions" 
          onClick={handleProductsMenuClose}
          sx={{ py: 1.5, fontSize: '14px' }}
        >
          <LiveTvIcon sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
          Émissions & Concours
        </MenuItem>
        <MenuItem 
          component={Link} 
          to="/actualities" 
          onClick={handleProductsMenuClose}
          sx={{ py: 1.5, fontSize: '14px' }}
        >
          <NewspaperIcon sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
          Actualités
        </MenuItem>
        <MenuItem 
          component={Link} 
          to="/a-propos" 
          onClick={handleProductsMenuClose}
          sx={{ py: 1.5, fontSize: '14px' }}
        >
          <InfoIcon sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
          À propos
        </MenuItem>
      </Menu>
      {/* Etudes Menu */}
      <Menu
        anchorEl={etudesMenuAnchor}
        open={Boolean(etudesMenuAnchor)}
        onClose={handleEtudesMenuClose}
        MenuListProps={{
          onMouseEnter: () => setEtudesMenuAnchor(etudesMenuAnchor), // Garde le menu ouvert
          onMouseLeave: handleEtudesMenuClose,
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1.5,
          ml: 20,
          '& .MuiPaper-root': {
            minWidth: 280,
            boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 8px 16px rgba(0,0,0,.15)',
            borderRadius: '8px',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000' }}>
            Nos Etudes
          </Typography>
        </Box>
        <MenuItem 
          component={Link} 
          to="/emissions" 
          onClick={handleProductsMenuClose}
          sx={{ py: 1.5, fontSize: '14px' }}
        >
          <LiveTvIcon sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
          Émissions & Concours
        </MenuItem>
        <MenuItem 
          component={Link} 
          to="/actualities" 
          onClick={handleProductsMenuClose}
          sx={{ py: 1.5, fontSize: '14px' }}
        >
          <NewspaperIcon sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
          Actualités
        </MenuItem>
        <MenuItem 
          component={Link} 
          to="/a-propos" 
          onClick={handleProductsMenuClose}
          sx={{ py: 1.5, fontSize: '14px' }}
        >
          <InfoIcon sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
          À propos
        </MenuItem>
      </Menu>

      {/* Referral Dialog */}
      <Dialog
        open={referralDialogOpen}
        onClose={handleCloseReferralDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
          }
        }}
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
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Partagez votre code ou lien de parrainage avec vos amis pour qu'ils puissent s'inscrire :
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
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
                        letterSpacing: '2px',
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => handleCopyToClipboard(referralData.code, 'code')}
                    sx={{ 
                      color: '#861e81',
                      '&:hover': {
                        backgroundColor: 'rgba(134, 30, 129, 0.1)',
                      }
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'bold' }}>
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
                    sx={{ 
                      color: '#861e81',
                      '&:hover': {
                        backgroundColor: 'rgba(134, 30, 129, 0.1)',
                      }
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseReferralDialog} 
            sx={{ 
              color: '#861e81',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            borderRadius: '8px',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        <Toolbar sx={{ minHeight: '52px !important' }} />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;