import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Stack,
  Link as MuiLink,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107',
    },
    background: {
      default: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 50%, #9C27B0 100%)',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: '8px',
            '& fieldset': {
              border: 'none',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white',
            fontWeight: 500,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'white',
          },
        },
      },
    },
  },
});

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    login: ''
  });

  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false,
    cookies: false,
    imageRights: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgreementChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreements(prev => ({
      ...prev,
      [key]: event.target.checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { formData, agreements });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: 'url("/img/bg1.jpg")',
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
            height: '90vh',
            backgroundColor: '#3b2150',
            borderRadius: 3,
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              color: '#FFC107',
              fontWeight: 'bold',
              marginBottom: 3,
              pt: 4,
            }}
          >
            Inscrivez-vous !
          </Typography>

          {/* Zone scrollable */}
          <Box
            sx={{
              overflowY: 'auto',
              px: 4,
              pb: 4,
              flex: 1,
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#FFC107',
                borderRadius: '8px',
              },
            }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* ... Form fields */}
                <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic', textAlign: 'start' }}>
                  Votre nom
                </Typography>
                <TextField size="small" name="nom" value={formData.nom} onChange={handleInputChange} fullWidth placeholder="Votre nom" required />

                <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic', textAlign: 'start' }}>
                  Votre prénom
                </Typography>
                <TextField size="small" name="prenom" value={formData.prenom} onChange={handleInputChange} fullWidth placeholder="Votre prénom" required />

                <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic', textAlign: 'start' }}>
                  Votre mail
                </Typography>
                <TextField size="small" name="email" value={formData.email} onChange={handleInputChange} fullWidth placeholder="mail@gmail.com" required type="email" />

                <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic', textAlign: 'start' }}>
                  Votre mot de passe
                </Typography>
                <TextField size="small" name="password" value={formData.password} onChange={handleInputChange} fullWidth placeholder="••••••••" required type="password" />

                <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic', textAlign: 'start' }}>
                  Confirmer Votre mot de passe
                </Typography>
                <TextField size="small" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} fullWidth placeholder="Confirmez votre mot de passe" required type="password" />

                <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic', textAlign: 'start' }}>
                  Votre numéro de téléphone
                </Typography>
                <TextField size="small" name="telephone" value={formData.telephone} onChange={handleInputChange} fullWidth placeholder="Votre numéro de téléphone" required type="tel" />

                <Typography variant="body1" sx={{ color: 'white', fontWeight: 500, fontStyle: 'italic', textAlign: 'start' }}>
                  Votre login{' '}
                  <Typography component="span" sx={{ color: '#FFC107' }}>
                    (Numéro de Téléphone 225xxxxxxxxxx)
                  </Typography>
                </Typography>
                <TextField size="small" name="login" value={formData.login} onChange={handleInputChange} fullWidth placeholder="Numéro de Téléphone 225xxxxxxxxxx" required />

                {/* Checkboxes */}
                <Stack spacing={2} sx={{ marginTop: 3 }}>
                  {[
                    {
                      key: 'privacy',
                      label: "la politique de confidentialité",
                      highlight: '#FF5252',
                    },
                    {
                      key: 'terms',
                      label: "les Conditions Générales d'Utilisation",
                      highlight: '#FF5252',
                    },
                    {
                      key: 'cookies',
                      label: "la politique de cookies",
                      highlight: '#FF5252',
                    },
                  ].map(({ key, label, highlight }) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={agreements[key as keyof typeof agreements]}
                          onChange={handleAgreementChange(key)}
                          sx={{
                            color: 'white',
                            '&.Mui-checked': { color: '#FFC107' },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          J'accepte{' '}
                          <Typography component="span" sx={{ color: highlight, textDecoration: 'underline' }}>
                            {label}
                          </Typography>{' '}
                          et je déclare en avoir pris connaissance*
                        </Typography>
                      }
                    />
                  ))}

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreements.imageRights}
                        onChange={handleAgreementChange('imageRights')}
                        sx={{
                          color: 'white',
                          '&.Mui-checked': {
                            color: '#FFC107',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        J'autorise ELIWOOD STUDIO et partenaires à utiliser mes images et vidéos et leur garanti contre toute réclamation provenant des droits des tiers*
                      </Typography>
                    }
                  />
                </Stack>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#FFC107',
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    padding: '16px',
                    borderRadius: '8px',
                    marginTop: 4,
                    '&:hover': {
                      backgroundColor: '#FFD54F',
                    },
                  }}
                >
                  S'inscrire
                </Button>

                <Typography variant="body2" align="center" sx={{ color: 'white', marginTop: 2 }}>
                  Vous avez déjà un compte ?{' '}
                    <MuiLink   component={RouterLink} to="/login" underline="hover" sx={{ color: '#FFC107', textDecoration: 'underline', cursor: 'pointer' }}>
                    Connectez-vous
                    </MuiLink>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;
