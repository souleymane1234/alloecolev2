import * as React from 'react';
import PropTypes from 'prop-types';
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
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const drawerWidth = 240;
const navItems = ['ACCUEIL', 'ÉMISSIONS ET CONCOURS', 'ACTUALITÉ', 'A PROPOS'];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
    <Box sx={{ my: 2 }}>
    <img src="/img/logo.png" alt="Logo" style={{ height: 40 }} />
    </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding sx={{
            color: '#000',
            '&:hover': {
              backgroundColor: 'rgba(134, 30, 129, 0.1)', // ou une autre couleur de survol
              color: '#861e81', // couleur au survol
            },
          }}>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
            <Button variant="outlined" sx={{ color: '#fff', backgroundColor: '#861e81', '&:hover': { backgroundColor: '#dc3545', color: '#fff' } }}>
              Connecter
            </Button>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: '#fff', color: '#861e81' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left: Logo + Menu button (mobile) */}
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
            <Box sx={{ my: 2, display: { xs: 'none', sm: 'block' , color: '#861e81'} }}>
                <img src="/img/logo.png" alt="Logo" style={{ height: 70 }} />
            </Box>
          </Box>

          {/* Right: Nav Items + Connect Button */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
            {navItems.map((item) => (
              <Button key={item} sx={{
                color: '#000',
                '&:hover': {
                  backgroundColor: 'rgba(134, 30, 129, 0.1)', // ou une autre couleur de survol
                  color: '#861e81', // couleur au survol
                },
              }}>
                {item}
              </Button>
            ))}
            <Button variant="outlined" sx={{ color: '#fff', backgroundColor: '#861e81', '&:hover': { backgroundColor: '#dc3545', color: '#fff' } }}>
              Connecter
            </Button>
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
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        {/* Your page content here */}
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
