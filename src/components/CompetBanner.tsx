import React, { useState } from 'react';
import {
  Box, Stack, Button, Typography, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
const apiImageUrl = (import.meta as any).env?.VITE_API_URL_IMAGE;

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
  backgroundColor: '#f5f5f5',
  color: '#333',
  borderRadius: '30px',
  border: '2px solid #e0e0e0',
  fontWeight: 'bold',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#e8e8e8',
    borderColor: '#d0d0d0',
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: 3,
            borderRadius: 2,
            width: '100%',
            maxWidth: '1500px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
          alignItems="center"
        >
          {/* Vidéo */}
          <Box sx={{ width: { xs: '100%', md: '33%' }, border: '2px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
            <video
              className="w-full h-48 object-cover"
              src={competition?.url_video_competition?.startsWith('http') ? competition.url_video_competition : `${apiImageUrl}/${competition?.url_video_competition}`}
              poster={competition?.url_photo_competition?.startsWith('http') ? competition.url_photo_competition : `${apiImageUrl}/${competition?.url_photo_competition}`}
              controls
            />
          </Box>

          {/* Infos compétition */}
          <Box sx={{ width: { xs: '100%', md: '40%' } }}>
            <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2, fontSize: '24px', textTransform: 'uppercase' }}>
              🎵 CONCOURS : {competition?.titre_competition || 'IVOIRE ZIK TALENT'}
            </Typography>

            <Box
              sx={{
                backgroundColor: '#f9f9f9',
                color: '#666',
                padding: 2,
                borderRadius: 1,
                mb: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              {competition?.description_competition ||
                '«IVOIRE ZIK TALENT» est un concept qui permet de détecter, révéler et faire la promotion des talents dans le domaine de la musique !'}
            </Box>

            <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#666' }}>
              <CalendarMonthIcon sx={{ mr: 1, color: '#666' }} />
              <strong>Inscription du</strong>
              <span style={{
                background: '#f5f5f5',
                color: '#333',
                fontWeight: 'bold',
                padding: '4px 12px',
                borderRadius: '6px',
                marginLeft: '8px',
                border: '1px solid #e0e0e0',
              }}>
                {formatDate(competition?.debut_inscription_competition)} au {formatDate(competition?.fin_inscription_competition)}
              </span>
            </Typography>

            <Typography sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#666' }}>
              <MonetizationOnIcon sx={{ mr: 1, color: '#666' }} />
              <strong>Coût d'inscription</strong>
              <span style={{
                background: '#f5f5f5',
                color: '#333',
                padding: '4px 12px',
                borderRadius: '6px',
                marginLeft: '8px',
                fontWeight: 'bold',
                border: '1px solid #e0e0e0',
              }}>
                {competition?.cout_inscription ? `${competition.cout_inscription} FCFA` : 'Gratuit'}
              </span>
            </Typography>

            <Button
              variant="contained"
              startIcon={<PersonAddAltIcon />}
              sx={{
                background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
                px: 4,
                borderRadius: '30px',
                fontSize: '16px',
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(240, 86, 35, 0.3)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #ea580c 0%, #f05623 50%, #f78c45 100%)',
                  boxShadow: '0 6px 20px rgba(240, 86, 35, 0.4)',
                },
              }}
              onClick={onInscriptionClick}
            >
              S'inscrire
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
        <DialogTitle sx={{ 
          backgroundColor: '#f5f5f5', 
          color: '#333',
          fontWeight: 'bold',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {openModal === 'lots' && 'Lots à gagner'}
          {openModal === 'reglement' && 'Règlement du jeu'}
          {openModal === 'principes' && 'Principes du jeu'}
          {openModal === 'sponsors' && 'Nos sponsors'}
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: '#ffffff' }}>
          <Typography sx={{ color: '#666', lineHeight: 1.8 }}>{openModal ? modalContents[openModal] : ''}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompetBanner;
