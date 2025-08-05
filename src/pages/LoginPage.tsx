import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  Alert,
} from '@mui/material';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setType('');

    try {
      const res = await axios.post('http://localhost:9002/api/userAccount/login', {
        login,
        password,
      }, {
        withCredentials: true  // <== important pour les cookies de session Laravel
      });

      if (res.data.success) {
        setType('success');
        setMessage('Connexion réussie ✅');
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = "/";
      } else {
        setType('error');
        setMessage(res.data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Erreur réseau ou serveur.');
      }
      setType('error');
    }
  };

  return (
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

        <Box component="form" noValidate autoComplete="on" mt={3} onSubmit={handleSubmit}>
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
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            sx={{
              input: { color: 'black' },
              backgroundColor: '#e9f0fe',
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
              },
            }}
          />

          <Typography variant="body2" sx={{ color: 'white', mb: 1, textAlign: 'start' }}>
            Mot de passe *
          </Typography>
          <TextField
            fullWidth
            type="password"
            variant="outlined"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: { color: 'black' },
              backgroundColor: '#e9f0fe',
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ccc' },
              },
            }}
          />

          {message && (
            <Alert severity={type} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Button
            type="submit"
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
