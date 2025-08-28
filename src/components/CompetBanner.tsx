import React, { useState } from 'react';
import {
  Box, Stack, Button, Typography, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
const apiUrl = import.meta.env.VITE_API_URL;
const apiImageUrl = import.meta.env.VITE_API_URL_IMAGE;

interface Competition {
  titre_competition: string;
  description_competition: string;
  debut_inscription_competition: string;
  fin_inscription_competition: string;
  cout_inscription: number;
  url_video_competition: string;
  url_photo_competition: string;
}

type CompetBannerProps = {
  competition: Competition;
  onInscriptionClick: () => void;
};

const StyledButton = styled(Button)(() => ({
  backgroundColor: '#9b2c9b',
  color: '#fff',
  borderRadius: '30px',
  border: '2px solid #fff',
  fontWeight: 'bold',
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

const CompetBanner: React.FC<CompetBannerProps> = ({ competition, onInscriptionClick }) => {
  const [openModal, setOpenModal] = useState<null | keyof typeof modalContents>(null);

  const handleOpen = (key: keyof typeof modalContents) => setOpenModal(key);
  const handleClose = () => setOpenModal(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '??';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        padding={2}
        sx={{
          backgroundImage: 'url(/img/bg1.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            backgroundColor: '#1a0e24',
            padding: 3,
            borderRadius: 2,
            width: '100%',
            maxWidth: '1500px',
          }}
          alignItems="center"
        >
          {/* Vidéo */}
          <Box sx={{ width: { xs: '100%', md: '33%' }, border: '6px solid #351931' }}>
            <video
              className="w-full h-48 object-cover"
              src={`${apiImageUrl}/${competition?.url_video_competition}`}
              poster={`${apiImageUrl}/${competition?.url_photo_competition}`}
              controls
            />
          </Box>

          {/* Infos compétition */}
          <Box sx={{ width: { xs: '100%', md: '40%' } }}>
            <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold', mb: 2 }}>
              🎵 CONCOURS : {competition?.titre_competition || 'IVOIRE ZIK TALENT'}
            </Typography>

            <Box
              sx={{
                backgroundColor: '#2f2f2f',
                color: '#7f7f7f',
                padding: 2,
                borderRadius: 1,
                mb: 2,
              }}
            >
              {competition?.description_competition ||
                '«IVOIRE ZIK TALENT» est un concept qui permet de détecter, révéler et faire la promotion des talents dans le domaine de la musique !'}
            </Box>

            <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#7f7f7f' }}>
              <CalendarMonthIcon sx={{ mr: 1 }} />
              <strong>Inscription du</strong>
              <span style={{
                background: 'black',
                color: 'white',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '6px',
                marginLeft: '8px',
              }}>
                {formatDate(competition?.debut_inscription_competition)} au {formatDate(competition?.fin_inscription_competition)}
              </span>
            </Typography>

            <Typography sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#7f7f7f' }}>
              <MonetizationOnIcon sx={{ mr: 1 }} />
              <strong>Coût d’inscription</strong>
              <span style={{
                background: '#FFD700',
                color: '#000',
                padding: '2px 6px',
                borderRadius: '6px',
                marginLeft: '8px',
                fontWeight: 'bold',
              }}>
                {competition?.cout_inscription ? `${competition.cout_inscription} FCFA` : 'Gratuit'}
              </span>
            </Typography>

            <Button
              variant="contained"
              startIcon={<PersonAddAltIcon />}
              sx={{
                backgroundColor: '#9b2c9b',
                px: 4,
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
          <Box sx={{ width: { xs: '100%', md: '25%' } }}>
            <Stack spacing={2}>
              <StyledButton fullWidth onClick={() => handleOpen('lots')}>Lots</StyledButton>
              <StyledButton fullWidth onClick={() => handleOpen('reglement')}>Règlement du jeu</StyledButton>
              <StyledButton fullWidth onClick={() => handleOpen('principes')}>Principes du jeu</StyledButton>
              <StyledButton fullWidth onClick={() => handleOpen('sponsors')}>Sponsors</StyledButton>
            </Stack>
          </Box>
        </Stack>
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
