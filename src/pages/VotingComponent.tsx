import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, ArrowLeft, Trophy, Vote, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Stack, 
  Typography, 
  Avatar, 
  Chip, 
  Paper,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';

const apiUrl = (import.meta as any).env?.VITE_API_URL;
const apiImageUrl = (import.meta as any).env?.VITE_API_URL_IMAGE;

interface MessageState {
  type: string;
  text: string;
  show: boolean;
}

interface PaymentResponse {
  success?: boolean;
  result?: {
    payment_url?: string;
  };
  message?: string;
  status?: string;
  data?: {
    payment_url?: string;
  };
}

interface PaymentStatusResponse {
  state?: string;
  status?: string;
  message?: string;
}

interface ErrorResponse {
  message?: string;
}

// Composant Modal de Confirmation de Paiement
const PaymentStatusModal = ({ 
  open, 
  onClose, 
  status, 
  message, 
  onRetry 
}: {
  open: boolean;
  onClose: () => void;
  status: 'success' | 'failed' | 'pending';
  message: string;
  onRetry?: () => void;
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle size={64} className="text-green-500" />;
      case 'failed':
        return <XCircle size={64} className="text-red-500" />;
      case 'pending':
      default:
        return <Clock size={64} className="text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'from-green-500 to-green-600';
      case 'failed':
        return 'from-red-500 to-red-600';
      case 'pending':
      default:
        return 'from-yellow-500 to-yellow-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return 'Paiement Confirmé !';
      case 'failed':
        return 'Paiement Échoué';
      case 'pending':
      default:
        return 'Paiement en Cours...';
    }
  };

  return (
    <Modal
      aria-labelledby="payment-status-modal"
      aria-describedby="payment-status-description"
      open={open}
      onClose={status !== 'pending' ? onClose : undefined}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 24,
          p: 0,
          outline: 'none',
        }}>
          <div className={`bg-gradient-to-r ${getStatusColor()} text-white p-6 rounded-t-3xl`}>
            <div className="flex flex-col items-center text-center">
              {getStatusIcon()}
              <h2 className="text-xl font-bold mt-4">{getStatusText()}</h2>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 text-center mb-6">{message}</p>
            
            <div className="flex flex-col gap-3">
              {status === 'success' && (
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Parfait !
                </button>
              )}
              
              {status === 'failed' && (
                <>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                      Réessayer
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
                  >
                    Fermer
                  </button>
                </>
              )}
              
              {status === 'pending' && (
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

const generateReference = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `REF-${timestamp}-${random}`;
};

const VotingComponent: React.FC = () => {
  const [votes, setVotes] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<string>('mtn');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '', show: false });
  
  // États pour la modal de statut de paiement
  const [paymentModal, setPaymentModal] = useState({
    open: false,
    status: 'pending' as 'success' | 'failed' | 'pending',
    message: ''
  });
  
  // État pour la vérification du paiement
  const [paymentCheckInterval, setPaymentCheckInterval] = useState<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const part = location.state?.perso;

  const defaultPart = {
    nom_presentation: 'Candidat',
    code_candidat: 'CAND-001',
    nbre_point: 0,
    nbre_vote: 0,
    url_photo_identite: 'https://i.pravatar.cc/150?img=1',
    url_video: 'https://www.w3schools.com/html/mov_bbb.mp4',
  };

  const participant = part || defaultPart;
  const competition = {
    titre_competition: "ÉDITION 2025"
  };

  // Nettoyer les intervalles lors du démontage du composant
  useEffect(() => {
    return () => {
      if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
      }
    };
  }, [paymentCheckInterval]);

  const validatePhoneNumber = (number: string, operator: string): boolean => {
    const cleaned = number.replace(/\s+/g, '');
  
    if (!/^\d{10}$/.test(cleaned)) {
      return false;
    }
  
    const mtnPrefixes = ['05', '65', '25'];
    const orangePrefixes = ['07', '67', '27'];
    const moovPrefixes = ['01', '61', '21'];
    const wavePrefixes = ['01', '07', '05'];
  
    const prefix = cleaned.substring(0, 2);
  
    switch (operator) {
      case 'mtn':
        return mtnPrefixes.includes(prefix);
      case 'orange':
        return orangePrefixes.includes(prefix);
      case 'moov':
        return moovPrefixes.includes(prefix);
      case 'wave':
        return wavePrefixes.includes(prefix);
      default:
        return false;
    }
  };

  const checkPaymentStatus = async (reference: string): Promise<boolean> => {
    try {
      const statusResponse = await axios.get<PaymentStatusResponse>(
        `${apiUrl}/payment/status/${reference}`
      );
      
      console.log('Statut de la transaction:', statusResponse.data);
      if (statusResponse.data.state === 'COMPLETED' || statusResponse.data.state === 'SUCCESS') {
        setPaymentModal({
          open: true,
          status: 'success',
          message: `🎉 Félicitations ! Vos ${votes} vote(s) ont été enregistrés avec succès pour ${participant.nom_presentation}. Merci pour votre participation !`
        });
        
        if (paymentCheckInterval) {
          clearInterval(paymentCheckInterval);
          setPaymentCheckInterval(null);
        }
        
        return true;
        
      } else if (statusResponse.data.state === 'FAILED' || statusResponse.data.state === 'ERROR') {
        setPaymentModal({
          open: true,
          status: 'failed',
          message: 'Le paiement a échoué ou a été annulé. Aucun montant n\'a été débité de votre compte.'
        });
        
        if (paymentCheckInterval) {
          clearInterval(paymentCheckInterval);
          setPaymentCheckInterval(null);
        }
        
        return true;
        
      } else if (statusResponse.data.state === 'PENDING' || statusResponse.data.state === 'INITIALISE') {
        return false;
      }
      
      return false;
      
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      return false;
    }
  };

  const startPaymentStatusCheck = (reference: string) => {
    setPaymentModal({
      open: true,
      status: 'pending',
      message: 'Vérification du paiement en cours... Veuillez patienter.'
    });
    let checkCount = 0;
    const maxChecks = 60;
    const interval = setInterval(async () => {
      checkCount++;
      
      const paymentCompleted = await checkPaymentStatus(reference);
      
      if (paymentCompleted || checkCount >= maxChecks) {
        clearInterval(interval);
        setPaymentCheckInterval(null);
        
        if (!paymentCompleted && checkCount >= maxChecks) {
          setPaymentModal({
            open: true,
            status: 'failed',
            message: 'Délai d\'attente dépassé. Le statut du paiement n\'a pas pu être vérifié. Veuillez vérifier votre compte ou contacter le support.'
          });
        }
      }
    }, 5000);
    setPaymentCheckInterval(interval);
  };

  const initiatePayment = async (): Promise<void> => {
    const totalAmount = votes * 100;
    console.log('=== DÉBUT DU PAIEMENT ===');
    console.log('Numéro:', phoneNumber);
    console.log('Opérateur:', paymentMethod);
    console.log('Montant:', totalAmount);
    if (!phoneNumber.trim()) {
      setMessage({
        type: 'error',
        text: 'Veuillez saisir votre numéro de téléphone',
        show: true
      });
      return;
    }
    if (!validatePhoneNumber(phoneNumber, paymentMethod)) {
      setMessage({
        type: 'error',
        text: 'Numéro invalide pour l\'opérateur sélectionné.',
        show: true
      });
      return;
    }
  
    setIsLoading(true);
    setMessage({ type: '', text: '', show: false });
    const reference = generateReference();
    console.log('Référence générée:', reference);
    const paymentData = {
      numberClient: phoneNumber,
      typeService: paymentMethod,
      amount: totalAmount,
      partner_reference: reference
    };
    console.log('Données envoyées:', paymentData);
    try {
      const response = await axios.post<PaymentResponse>( 
        `${apiUrl}/payment/cashout`,
        paymentData, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      console.log('=== RÉPONSE REÇUE ===');
      console.log('Status:', response.status);
      console.log('Data:', response.data);
      if (response.data && response.status === 200) {
        if (paymentMethod === 'wave') {
          const paymentUrl = response.data.data?.payment_url || response.data.result?.payment_url;
          
          if (paymentUrl) {
            console.log('Payment URL trouvée pour Wave:', paymentUrl);
            window.open(paymentUrl, '_blank');
            setMessage({
              type: 'success',
              text: "Une fenêtre de paiement Wave s'est ouverte. Scannez le code QR avec votre application Wave.",
              show: true
            });
            startPaymentStatusCheck(reference);
          } else {
            console.error('Pas d\'URL de paiement pour Wave dans la réponse');
            setMessage({
              type: 'error',
              text: "Erreur: URL de paiement Wave non fournie par le service.",
              show: true
            });
          }
        } else {
          setMessage({
            type: 'success',
            text: `Demande de paiement envoyée sur votre numéro ${paymentMethod.toUpperCase()}. Vérifiez votre téléphone et confirmez le paiement.`,
            show: true
          });
          startPaymentStatusCheck(reference);
        }
      } else {
        console.error('Réponse d\'erreur:', response.data);
        setMessage({
          type: 'error',
          text: response.data?.message || "Erreur lors de l'initialisation du paiement.",
          show: true
        });
      }
    } catch (error) {
      console.error('=== ERREUR AXIOS ===');
      console.error('Error object:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
          
          const errorData = error.response.data as ErrorResponse;
          
          if (error.response.status === 422 && error.response.data.errors) {
            const validationErrors = Object.values(error.response.data.errors).flat();
            setMessage({
              type: 'error',
              text: `Erreur de validation: ${validationErrors.join(', ')}`,
              show: true
            });
          } else {
            setMessage({
              type: 'error',
              text: `Erreur serveur: ${errorData?.message || error.response.statusText}`,
              show: true
            });
          }
        } else if (error.request) {
          console.error('Pas de réponse du serveur');
          setMessage({
            type: 'error',
            text: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
            show: true
          });
        } else {
          console.error('Erreur inconnue:', error.message);
          setMessage({
            type: 'error',
            text: 'Une erreur inattendue est survenue.',
            show: true
          });
        }
      } else {
        console.error('Erreur non-Axios:', error);
        setMessage({
          type: 'error',
          text: 'Une erreur inattendue est survenue.',
          show: true
        });
      }
    } finally {
      setIsLoading(false);
      console.log('=== FIN DU PAIEMENT ===');
    }
  };

  const handleModalClose = () => {
    setPaymentModal({ ...paymentModal, open: false });
    
    if (paymentModal.status === 'success') {
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  };

  const handleRetryPayment = () => {
    setPaymentModal({ ...paymentModal, open: false });
    initiatePayment();
  };

  const totalAmount = votes * 100;
  const totalPoints = votes * 10;

  const buildMediaUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${apiImageUrl}/${url}`;
  };

  return (
    <div className="min-h-screen bg-white" style={{
      background: 
        'radial-gradient(circle at 20% 30%, rgba(240, 86, 35, 0.08) 0%, transparent 40%),' +
        'radial-gradient(circle at 80% 70%, rgba(249, 160, 95, 0.08) 0%, transparent 40%),' +
        'radial-gradient(circle at 50% 50%, rgba(255, 177, 153, 0.06) 0%, transparent 50%)',
    }}>
      {/* Modal de statut de paiement */}
      <PaymentStatusModal
        open={paymentModal.open}
        onClose={handleModalClose}
        status={paymentModal.status}
        message={paymentModal.message}
        onRetry={paymentModal.status === 'failed' ? handleRetryPayment : undefined}
      />

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
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 3 }}
          justifyContent="center"
          alignItems="center"
          width="100%"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 3,
            borderRadius: 2,
          }}
        >
          <Box sx={{ position: 'relative', width: { xs: '100%', sm: '30%' }, padding: 2 }}>
            <Stack spacing={2} alignItems={{ xs: 'center', sm: 'flex-start' }}>
              <Avatar 
                src={buildMediaUrl(participant.url_photo_identite)}
                alt={participant.nom_presentation}
                sx={{
                  width: 128,
                  height: 128,
                  border: '4px solid white',
                  boxShadow: 3
                }}
              />
              
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                {participant.nom_presentation}
              </Typography>
              
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'white' }}>
                    CODE :
                  </Typography>
                  <Chip
                    label={participant.code_candidat || 'N/A'}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}
                  />
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Trophy size={16} color="#FFD700" />
                  <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'white' }}>
                    {participant.nbre_point || 0} point(s)
                  </Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  <Vote size={16} color="#3b82f6" />
                  <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'white' }}>
                    {participant.nbre_vote || 0} vote(s)
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '30%' }, padding: 2 }}>
            <div className="bg-white rounded-lg p-4 text-center shadow-lg">
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#f05623',
                  textTransform: 'uppercase'
                }}
              >
                {competition.titre_competition} 
              </Typography>  
            </div>   
          </Box>

          <Box sx={{ maxWidth: '640px', mx: 'auto', width: { xs: '100%', sm: '40%' }, padding: 2 }}>
            {participant.url_video ? (
              <Box
                component="video"
                src={buildMediaUrl(participant.url_video)}
                controls
                sx={{
                  width: '100%',
                  height: 320,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 2,
                  border: '2px solid white'
                }}
              />
            ) : (
              <Paper
                elevation={1}
                sx={{
                  backgroundColor: 'grey.100',
                  height: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'grey.500',
                  borderRadius: 2
                }}
              >
                <Play size={32} style={{ opacity: 0.5, marginBottom: 8 }} />
                <Typography variant="body2">
                  Pas de vidéo disponible
                </Typography>
              </Paper>
            )}
          </Box>
        </Stack>
      </Box>

      {/* Section de vote */}
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Message d'information */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: 2,
            p: 2,
            mb: 3,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: '#1565c0', fontWeight: 500 }}>
            Les votes sont actualisés <strong>toutes les 5 minutes.</strong>
          </Typography>
        </Paper>

        {/* Messages de feedback */}
        {message.show && message.text && (
          <Paper
            elevation={0}
            sx={{
              backgroundColor: 
                message.type === 'success' ? '#e8f5e9' :
                message.type === 'warning' ? '#fff3e0' : '#ffebee',
              border: `1px solid ${
                message.type === 'success' ? '#81c784' :
                message.type === 'warning' ? '#ffb74d' : '#e57373'
              }`,
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            <Typography
              sx={{
                color:
                  message.type === 'success' ? '#2e7d32' :
                  message.type === 'warning' ? '#e65100' : '#c62828',
              }}
            >
              {message.text}
            </Typography>
          </Paper>
        )}

        {/* Formulaire de vote */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e0e0e0',
          }}
        >
          {/* Header du formulaire */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <CreditCard size={24} />
              Vote en ligne
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                textAlign: 'center',
                mb: 4,
              }}
            >
              Utilisez les contrôles ci-dessous pour choisir le nombre de votes.
            </Typography>

            <Stack spacing={4}>
              {/* Section nombre de votes */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    mb: 2,
                  }}
                >
                  Nombre de votes à attribuer
                </Typography>
                
                <Paper
                  elevation={0}
                  sx={{
                    background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
                    p: 2,
                    mb: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    1 vote = 100 FCFA = 10 points
                  </Typography>
                </Paper>
                
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setVotes(Math.max(1, votes - 1))}
                    disabled={votes <= 1 || isLoading}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: votes <= 1 || isLoading ? '#e0e0e0' : '#f5f5f5',
                      color: votes <= 1 || isLoading ? '#bdbdbd' : '#333',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      cursor: votes <= 1 || isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (!(votes <= 1 || isLoading)) {
                        e.currentTarget.style.backgroundColor = '#e0e0e0';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(votes <= 1 || isLoading)) {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    -
                  </button>
                  
                  <input
                    type="number"
                    value={votes}
                    onChange={(e) => setVotes(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    disabled={isLoading}
                    style={{
                      width: '100px',
                      textAlign: 'center',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '8px',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#f05623';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  />
                  
                  <button
                    type="button"
                    onClick={() => setVotes(votes + 1)}
                    disabled={isLoading}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: isLoading ? '#e0e0e0' : '#f5f5f5',
                      color: isLoading ? '#bdbdbd' : '#333',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#e0e0e0';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    +
                  </button>
                </Box>

                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography sx={{ color: '#666', mb: 1 }}>
                    Total: <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#f05623' }}>{totalAmount} FCFA</span>
                  </Typography>
                  <Typography sx={{ color: '#666' }}>
                    Points attribués: <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#f05623' }}>{totalPoints} points</span>
                  </Typography>
                </Box>
              </Box>

              {/* Sélection de l'opérateur */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    mb: 3,
                  }}
                >
                  Choisissez votre opérateur
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    gap: 2,
                  }}
                >
                  {[
                    { id: 'mtn', name: 'MTN Money', color: '#ffc107' },
                    { id: 'orange', name: 'Orange Money', color: '#ff9800' },
                    { id: 'wave', name: 'Wave', color: '#2196f3' },
                    { id: 'moov', name: 'Moov Money', color: '#4caf50' }
                  ].map((operator) => (
                    <label
                      key={operator.id}
                      style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={operator.id}
                        checked={paymentMethod === operator.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ display: 'none' }}
                        disabled={isLoading}
                      />
                      <Paper
                        elevation={paymentMethod === operator.id ? 4 : 1}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          borderRadius: 2,
                          border: `2px solid ${paymentMethod === operator.id ? operator.color : '#e0e0e0'}`,
                          backgroundColor: paymentMethod === operator.id ? operator.color : 'white',
                          color: paymentMethod === operator.id ? 'white' : '#333',
                          transition: 'all 0.3s ease',
                          transform: paymentMethod === operator.id ? 'scale(1.05)' : 'scale(1)',
                          '&:hover': {
                            borderColor: operator.color,
                            transform: 'scale(1.02)',
                          },
                        }}
                      >
                        <Typography sx={{ fontWeight: 'bold' }}>
                          {operator.name}
                        </Typography>
                      </Paper>
                    </label>
                  ))}
                </Box>
              </Box>

              {/* Numéro de téléphone */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    mb: 2,
                  }}
                >
                  Numéro de téléphone
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    maxWidth: '400px',
                    mx: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #e0e0e0',
                      borderRight: 'none',
                      px: 2,
                      py: 1.5,
                      borderRadius: '8px 0 0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    +225
                  </Box>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="00 00 00 00 00"
                    required
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      border: '1px solid #e0e0e0',
                      borderRadius: '0 8px 8px 0',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#f05623';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  />
                </Box>
              </Box>

              {/* Instructions spécifiques pour Wave */}
              {paymentMethod === 'wave' && (
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #90caf9',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', color: '#1565c0', mb: 1 }}>
                    Instructions Wave :
                  </Typography>
                  <Typography sx={{ color: '#0d47a1', fontSize: '14px' }}>
                    Après avoir cliqué sur "Valider et Payer", une nouvelle fenêtre s'ouvrira avec un code QR. 
                    Scannez ce code avec votre application Wave pour finaliser le paiement.
                  </Typography>
                </Paper>
              )}

              {/* Bouton de soumission */}
              <button
                onClick={initiatePayment}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isLoading
                    ? '#bdbdbd'
                    : 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isLoading ? 'none' : '0 4px 16px rgba(240, 86, 35, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(240, 86, 35, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(240, 86, 35, 0.3)';
                  }
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid white',
                        borderTop: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Traitement en cours...
                  </Box>
                ) : (
                  'Valider et Payer'
                )}
              </button>
            </Stack>

            {/* Bouton retour */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <button
                onClick={() => navigate(-1)}
                disabled={isLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#f05623',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <ArrowLeft size={18} />
                Revenir à la liste des candidats
              </button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Section publicitaire */}
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          pb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
            Espace Publicitaire
          </Typography>
          <Typography sx={{ color: '#666' }}>
            Votre publicité ici
          </Typography>
        </Paper>
      </Box>
    </div>
  );
};

export default VotingComponent;

