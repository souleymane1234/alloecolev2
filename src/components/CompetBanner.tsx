import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#9b2c9b',
  color: '#fff',
  borderRadius: '30px',
  border: '2px solid #fff',
  fontWeight: 'bold',
  marginBottom: '12px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#7c217c',
  },
}));

const modalContents = {
  lots: 'Voici la liste des lots à gagner pour les meilleurs candidats...',
  reglement: 'Voici le règlement complet du jeu concours Ivoire Zik Talent...',
  principes: 'Le jeu se déroule en plusieurs étapes : inscription, vote, finale...',
  sponsors: 'Nos sponsors officiels : MTN, Coca-Cola, Canal+, etc...',
};

const CompetBanner = ({ onInscriptionClick }: { onInscriptionClick: () => void }) => {
  const [openModal, setOpenModal] = useState<null | keyof typeof modalContents>(null);

  const handleOpen = (key: keyof typeof modalContents) => {
    setOpenModal(key);
  };

  const handleClose = () => {
    setOpenModal(null);
  };

  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        padding={4}
        sx={{
          backgroundImage: 'url(/img/bg1.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#1a0e24',
            padding: 3,
            borderRadius: 2,
            display: 'flex',
            gap: 4,
            width: '100%',
            maxWidth: '1500px',
            alignItems: 'center',
          }}
        >
          {/* Vidéo */}
          <Box flex={1.2} sx={{ border: '10px solid #351931' }}>
            <iframe
              width="100%"
              height="300"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Concours Ivoire Zik Talent"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>

          {/* Infos */}
          <Box flex={2}>
            <Typography
              variant="h4"
              sx={{ color: '#FFD700', fontWeight: 'bold', mb: 2 }}
            >
              🎵 CONCOURS : IVOIRE ZIK TALENT
            </Typography>

            <Box
              sx={{
                backgroundColor: '#2f2f2f',
                color: '#7f7f7f',
                padding: 2,
                borderRadius: 1,
                mb: 2,
                fontSize: '16px',
                fontWeight: 400,
              }}
            >
              «IVOIRE ZIK TALENT» est un concept qui permet de détecter,
              révéler et faire la promotion des talents dans le domaine de la
              musique ! Inscrivez-vous, postez vos vidéos et devenez la star du
              moment.
            </Box>

            <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarMonthIcon sx={{ mr: 1, color: '#7f7f7f' }} />
              <strong style={{ color: '#7f7f7f' }}>Inscription du</strong>
              <span
                style={{
                  background: 'black',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  marginLeft: '8px',
                }}
              >
                28/01/2025 au 28/05/2025
              </span>
            </Typography>

            <Typography sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MonetizationOnIcon sx={{ mr: 1, color: '#7f7f7f' }} />
              <strong style={{ color: '#7f7f7f' }}>Coût d’inscription</strong>
              <span
                style={{
                  background: '#FFD700',
                  color: '#000',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  marginLeft: '8px',
                  fontWeight: 'bold',
                }}
              >
                0 FCFA
              </span>
            </Typography>

            <Button
              variant="contained"
              startIcon={<PersonAddAltIcon />}
              sx={{
                backgroundColor: '#9b2c9b',
                paddingX: 4,
                borderRadius: '30px',
                fontSize: '16px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#7c217c' },
              }}
              onClick={onInscriptionClick}
            >
              S’inscrire
            </Button>
          </Box>

          {/* Boutons modaux */}
          <Box flex={1}>
            <Stack spacing={2}>
              <StyledButton fullWidth onClick={() => handleOpen('lots')}>Lots</StyledButton>
              <StyledButton fullWidth onClick={() => handleOpen('reglement')}>Règlement du jeu</StyledButton>
              <StyledButton fullWidth onClick={() => handleOpen('principes')}>Principes du jeu</StyledButton>
              <StyledButton fullWidth onClick={() => handleOpen('sponsors')}>Sponsors</StyledButton>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Dialog open={!!openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#9b2c9b', color: '#fff' }}>
          {openModal === 'lots' && 'Lots à gagner'}
          {openModal === 'reglement' && 'Règlement du jeu'}
          {openModal === 'principes' && 'Principes du jeu'}
          {openModal === 'sponsors' && 'Nos sponsors'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: '#f9f9f9' }}>
          <Typography>{openModal ? modalContents[openModal] : ''}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompetBanner;
