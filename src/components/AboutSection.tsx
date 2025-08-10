import React from 'react';
import { Box, Typography, Paper, Stack, List, ListItem, ListItemText } from '@mui/material';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const AboutSection: React.FC = () => {
  return (
    <Box bgcolor="white" py={10} px={2}>
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', md: 'row' }} 
        gap={{ xs: 1, sm: 2, md: 2 }}
        justifyContent="center"
        alignItems="stretch"
        maxWidth="1200px"
        mx="auto"
      >
        {/* Colonne Réseaux sociaux */}
        <Box flex={1} minWidth={{ xs: '100%', md: '50%' }}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Suivez-nous
            </Typography>

            <Stack direction="row" spacing={2} mb={3} fontSize={28}>
              <FaFacebookF color="#1877F2" />
              <FaTwitter color="#1DA1F2" />
              <FaInstagram color="#E1306C" />
              <FaYoutube color="#FF0000" />
            </Stack>

            <Stack spacing={2}>
              <Box
                component="img"
                src="/img/fb-widget.png"
                alt="facebook widget"
                sx={{ width: '100%', borderRadius: 2 }}
              />
              <Box
                component="img"
                src="/img/talent-promo.jpg"
                alt="Révèle ton talent"
                sx={{ width: '100%', borderRadius: 2 }}
              />
            </Stack>
          </Paper>
        </Box>

        {/* Colonne À propos */}
        <Box flex={1} minWidth={{ xs: '100%', md: '50%' }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              A PROPOS DE NOUS
            </Typography>

            <Typography color="text.secondary" paragraph>
              ZIK Talent est une plateforme de promotion des artistes débutants, des artistes en herbe,
              des chansonniers, des artistes confirmés non engagés dans un contrat antérieur.
            </Typography>

            <Typography color="text.secondary" paragraph>
              Les artistes talentueux seront sélectionnés pour bénéficier de compilations musicales,
              productions de singles, signatures de contrat de production, de licence, de distribution,
              et de communication autour de leurs créations.
            </Typography>

            <Typography fontWeight="bold" color="text.primary" paragraph>
              Inscrivez-vous nombreux sur ZIK Talent et bénéficiez de plusieurs offres
            </Typography>

            <List dense sx={{ textAlign: 'left', color: 'text.secondary', mb: 3 }}>
              <ListItem disableGutters>
                <ListItemText primary="• Enregistrement de chansons en studio" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="• Réalisation de vidéo de vos passages en studio" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="• Réalisation de clips vidéo de vos singles" />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="• Participations à des scènes de musiques" />
              </ListItem>
            </List>

            <Box mt={4}>
              <Typography fontWeight="bold" gutterBottom>
                Suivez ZIK Talent sur les réseaux suivants
              </Typography>
              <Stack spacing={0.5} color="text.secondary">
                <Typography>TikTok</Typography>
                <Typography>Instagram</Typography>
                <Typography>Facebook</Typography>
                <Typography>Twitter</Typography>
                <Typography>LinkedIn</Typography>
                <Typography>YouTube</Typography>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutSection;