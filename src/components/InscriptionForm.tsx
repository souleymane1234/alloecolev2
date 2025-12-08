import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Upload, User, Video, Image as ImageIcon, ArrowLeft } from 'lucide-react';
const apiUrl = (import.meta as any).env?.VITE_API_URL;

type Props = {
  competitionCode?: any;
  onCancel?: () => void;
};

const InscriptionForm = ({ competitionCode, onCancel }: Props) => {
  interface User {
    code_user_account?: string;
    login_number?: string;
    telephone?: string;
    localisation?: string;
    ville?: string;
    pays?: string;
    nom?: string;
  }
  
  const [user, setUser] = React.useState<User | null>(null);
  const [formData, setFormData] = useState({
    nom_correct: '',
    nom_presentation: '',
    description_presentation: '',
    url_photo_identite: null as File | null,
    url_video: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const navigate = useNavigate();


  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      setUser(storedUser);
    } else {
      alert('Veuillez vous connecter avant de vous inscrire.');
      navigate('/login');
    }
  }, [navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if ((e.target as HTMLInputElement).files) {
      const file = (e.target as HTMLInputElement).files![0];
      setFormData({ ...formData, [name]: file });
      
      // Afficher un aperçu pour les images
      if (name === 'url_photo_identite' && file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      
      // Afficher un aperçu pour les vidéos
      if (name === 'url_video' && file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
  
    if (!user) {
      setError('Veuillez vous connecter.');
      return;
    }
  
    setIsSubmitting(true);
    const data = new FormData();
    
    // Champs requis du formulaire
    data.append('nom_correct', formData.nom_correct);
    data.append('nom_presentation', formData.nom_presentation);
    data.append('description_presentation', formData.description_presentation);
    
    // Fichiers (optionnels)
    if (formData.url_photo_identite) {
      data.append('url_photo_identite', formData.url_photo_identite);
    }
    if (formData.url_video) {
      data.append('url_video', formData.url_video);
    }
  
    // Champs requis avec les bonnes valeurs/types
    data.append('code_user_account', user.code_user_account || '');
    data.append('code_competition', competitionCode);
    data.append('code_statut', '2');
    data.append('url_project_file', '');
    data.append('login_number', user.login_number || user.telephone || '');
    data.append('localisation', user.localisation || user.ville || user.pays || '');
    
    // Champs boolean
    data.append('preselectionne', '0');
    data.append('finaliste', '0');
    
    // Champs integer
    data.append('nbre_vote', '0');
    data.append('nbre_point', '0');
    
    data.append('user_update', user.nom || 'System');
  
    try {
      const res = await axios.post(`${apiUrl}/competition/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (res.data && res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(-1); // Retourner à la page précédente
        }, 2000);
      } else {
        setError('Erreur lors de l\'inscription: ' + (res.data.message || 'Erreur inconnue'));
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError('Erreurs de validation:\n' + errors.join('\n'));
      } else if (axios.isAxiosError(err)) {
        setError('Une erreur est survenue: ' + (err.response?.data?.message || err.message));
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 
          'radial-gradient(circle at 20% 30%, rgba(240, 86, 35, 0.08) 0%, transparent 40%),' +
          'radial-gradient(circle at 80% 70%, rgba(249, 160, 95, 0.08) 0%, transparent 40%),' +
          'radial-gradient(circle at 50% 50%, rgba(255, 177, 153, 0.06) 0%, transparent 50%)',
        py: 6,
        px: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: '900px',
          mx: 'auto',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <User size={28} />
              Inscrivez-vous !
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mt: 1,
              }}
            >
              Remplissez le formulaire ci-dessous pour participer à la compétition
            </Typography>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Inscription réussie ! Vous allez être redirigé...
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Nom et Pseudo */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  <TextField
                    label="Nom complet"
                    name="nom_correct"
                    value={formData.nom_correct}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#f05623',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#f05623',
                        },
                      },
                    }}
                  />

                  <TextField
                    label="Pseudo / Nom de scène"
                    name="nom_presentation"
                    value={formData.nom_presentation}
                    onChange={handleChange}
                    placeholder="Votre pseudo"
                    required
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#f05623',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#f05623',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Description */}
                <TextField
                  label="Description de votre présentation"
                  name="description_presentation"
                  value={formData.description_presentation}
                  onChange={handleChange}
                  placeholder="Décrivez votre talent, votre style, votre parcours..."
                  required
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#f05623',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f05623',
                      },
                    },
                  }}
                />

                {/* Upload de fichiers */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  {/* Photo */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontWeight: 'medium',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <ImageIcon size={16} />
                      Photo d'identité
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#f05623',
                          backgroundColor: '#fff5f2',
                        },
                      }}
                    >
                      {photoPreview ? (
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={photoPreview}
                            alt="Aperçu"
                            style={{
                              width: '100%',
                              maxHeight: '200px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ mb: 2 }}>
                          <Upload size={32} style={{ color: '#999', marginBottom: '8px' }} />
                          <Typography variant="body2" sx={{ color: '#999' }}>
                            Aucune photo sélectionnée
                          </Typography>
                        </Box>
                      )}
                      <input
                        type="file"
                        name="url_photo_identite"
                        accept="image/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload">
                        <Button
                          component="span"
                          variant="outlined"
                          startIcon={<ImageIcon size={18} />}
                          sx={{
                            borderColor: '#e0e0e0',
                            color: '#666',
                            '&:hover': {
                              borderColor: '#f05623',
                              backgroundColor: '#fff5f2',
                            },
                          }}
                        >
                          Choisir une photo
                        </Button>
                      </label>
                    </Box>
                  </Box>

                  {/* Vidéo */}
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontWeight: 'medium',
                        color: '#666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Video size={16} />
                      Vidéo de présentation
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.75rem',
                          color: '#f05623',
                          fontStyle: 'italic',
                          ml: 0.5,
                        }}
                      >
                        (max 20 Mo)
                      </Typography>
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed #e0e0e0',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#f05623',
                          backgroundColor: '#fff5f2',
                        },
                      }}
                    >
                      {videoPreview ? (
                        <Box sx={{ mb: 2 }}>
                          <video
                            src={videoPreview}
                            controls
                            style={{
                              width: '100%',
                              maxHeight: '200px',
                              borderRadius: '8px',
                            }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ mb: 2 }}>
                          <Upload size={32} style={{ color: '#999', marginBottom: '8px' }} />
                          <Typography variant="body2" sx={{ color: '#999' }}>
                            Aucune vidéo sélectionnée
                          </Typography>
                        </Box>
                      )}
                      <input
                        type="file"
                        name="url_video"
                        accept="video/*"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                        id="video-upload"
                      />
                      <label htmlFor="video-upload">
                        <Button
                          component="span"
                          variant="outlined"
                          startIcon={<Video size={18} />}
                          sx={{
                            borderColor: '#e0e0e0',
                            color: '#666',
                            '&:hover': {
                              borderColor: '#f05623',
                              backgroundColor: '#fff5f2',
                            },
                          }}
                        >
                          Choisir une vidéo
                        </Button>
                      </label>
                    </Box>
                  </Box>
                </Box>

                {/* Boutons */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    flexDirection: { xs: 'column', md: 'row' },
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => {
                      if (onCancel) {
                        onCancel();
                      } else {
                        navigate(-1);
                      }
                    }}
                    disabled={isSubmitting}
                    sx={{
                      borderColor: '#e0e0e0',
                      color: '#666',
                      '&:hover': {
                        borderColor: '#f05623',
                        backgroundColor: '#fff5f2',
                      },
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || success}
                    sx={{
                      background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
                      boxShadow: '0 4px 16px rgba(240, 86, 35, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ea580c 0%, #f05623 50%, #f78c45 100%)',
                        boxShadow: '0 6px 20px rgba(240, 86, 35, 0.4)',
                      },
                      '&:disabled': {
                        background: '#bdbdbd',
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        Inscription en cours...
                      </Box>
                    ) : (
                      "S'inscrire"
                    )}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default InscriptionForm;
