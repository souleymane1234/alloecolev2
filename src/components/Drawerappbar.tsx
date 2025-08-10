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
import axios from 'axios';

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
  [key: string]: any; // Adjust this type based on the actual structure of the user object
}

function DrawerAppBar(props: DrawerAppBarProps) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 pour identifier la route active

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
        'http://localhost:9002/api/logout',
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
