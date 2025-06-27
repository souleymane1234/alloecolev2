import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
} from '@mui/material';

const LoginPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("/img/bg1.jpg")', // ✅ remplace avec ton image d’arrière-plan
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 700,
          p: 4,
          backgroundColor: '#3b2150',
          borderRadius: 3,
          color: 'white',
          marginTop: -30,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: '#FFD042', textAlign: 'center' }}
        >
          Connectez-vous !
        </Typography>

        <Box component="form" noValidate autoComplete="on" mt={3}>
          <Typography
            variant="body2"
            sx={{ color: '#FFB74D', mb: 1, fontStyle: 'italic', textAlign: 'start' }}
          >
            Login * | (Numéro de Téléphone 225xxxxxxxxx)
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="2250102010200"
            sx={{
              input: { color: 'black' },
              backgroundColor: '#e9f0fe',
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
              },
            }}
          />

          <Typography variant="body2" sx={{ color: 'white', mb: 1, textAlign: 'start'  }}>
            Mot de passe *
          </Typography>
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            placeholder="********"
            sx={{
              input: { color: 'black' },
              backgroundColor: '#e9f0fe',
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#FFD042',
              color: '#3b2150',
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '16px',
              py: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#ffc400',
              },
            }}
          >
            Envoyer
          </Button>

          <Typography variant="body2" mt={2} textAlign="center">
            Vous n'avez pas de compte ?{' '}
            <MuiLink href="/register" underline="hover" sx={{ color: '#FFD042' }}>
              S’inscrire
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
