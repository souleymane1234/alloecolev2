import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Box, Typography, Link } from '@mui/material';
import Grid from '@mui/material/Grid';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(to right, #9f0053, #7a1ea1)',
        color: 'white',
        px: { xs: 2, sm: 6 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Grid container spacing={4}>
        {/* Logo + description + social */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <img src="/img/logo.png" alt="ZikTalent" style={{ height: '80px' }} />
          <Typography mt={2} variant="body1" sx={{ color: '#d1d5db' }}>
            ZIK’TALENT est un concept qui permet de détecter, révéler et faire la promotion des talents dans le domaine de la musique.
          </Typography>
          <Box mt={3} display="flex" justifyContent={{ xs: 'center', md: 'flex-start' }} gap={2}>
            <Link href="#" color="inherit"><Facebook size={24} /></Link>
            <Link href="#" color="inherit"><Twitter size={24} /></Link>
            <Link href="#" color="inherit"><Instagram size={24} /></Link>
            <Link href="#" color="inherit"><Youtube size={24} /></Link>
          </Box>
        </Grid>

        {/* Info utiles */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            INFO UTILES
          </Typography>
          <Box width="50px" height="3px" bgcolor="#ff1744" mb={2} mx={{ xs: 'auto', md: 0 }} />
          <Typography><Link href="#" color="inherit" underline="none">À propos de Zik Talent</Link></Typography>
          <Typography><Link href="#" color="inherit" underline="none">Actualité</Link></Typography>
          <Typography><Link href="#" color="inherit" underline="none">Nous contacter</Link></Typography>
        </Grid>

        {/* Liens utiles */}
        <Grid size={{ xs: 12, md: 4, sm:6 }} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            LIENS UTILES
          </Typography>
          <Box width="50px" height="3px" bgcolor="#ff1744" mb={2} mx={{ xs: 'auto', md: 0 }} />
          <Typography><Link href="#" color="inherit" underline="none">Mentions légales</Link></Typography>
          <Typography><Link href="#" color="inherit" underline="none">Conditions générales d'utilisation</Link></Typography>
          <Typography><Link href="#" color="inherit" underline="none">Politique de confidentialité</Link></Typography>
          <Typography><Link href="#" color="inherit" underline="none">Politique en matière de cookies</Link></Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
