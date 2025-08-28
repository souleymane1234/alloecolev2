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
const apiUrl = import.meta.env.VITE_API_URL;
const apiImageUrl = import.meta.env.VITE_API_URL_IMAGE;


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
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
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
  const [votes, setVotes] = React.useState<number>(1);
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
  const [paymentCheckInterval, setPaymentCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [currentReference, setCurrentReference] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();

  const part = location.state?.perso;

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
        // Paiement réussi
        setPaymentModal({
          open: true,
          status: 'success',
          message: `🎉 Félicitations ! Vos ${votes} vote(s) ont été enregistrés avec succès pour ${part.nom_presentation}. Merci pour votre participation !`
        });
        
        // Arrêter la vérification
        if (paymentCheckInterval) {
          clearInterval(paymentCheckInterval);
          setPaymentCheckInterval(null);
        }
        
        return true;
        
      } else if (statusResponse.data.state === 'FAILED' || statusResponse.data.state === 'ERROR') {
        // Paiement échoué
        setPaymentModal({
          open: true,
          status: 'failed',
          message: 'Le paiement a échoué ou a été annulé. Aucun montant n\'a été débité de votre compte.'
        });
        
        // Arrêter la vérification
        if (paymentCheckInterval) {
          clearInterval(paymentCheckInterval);
          setPaymentCheckInterval(null);
        }
        
        return true;
        
      } else if (statusResponse.data.state === 'PENDING' || statusResponse.data.state === 'INITIALISE') {
        // Paiement toujours en cours
        return false;
      }
      
      return false;
      
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      return false;
    }
  };

  const startPaymentStatusCheck = (reference: string) => {
    setCurrentReference(reference);
    
    // Afficher la modal de statut en attente
    setPaymentModal({
      open: true,
      status: 'pending',
      message: 'Vérification du paiement en cours... Veuillez patienter.'
    });

    let checkCount = 0;
    const maxChecks = 60; // 5 minutes avec des vérifications toutes les 5 secondes

    const interval = setInterval(async () => {
      checkCount++;
      
      const paymentCompleted = await checkPaymentStatus(reference);
      
      if (paymentCompleted || checkCount >= maxChecks) {
        clearInterval(interval);
        setPaymentCheckInterval(null);
        
        if (!paymentCompleted && checkCount >= maxChecks) {
          // Délai d'attente dépassé
          setPaymentModal({
            open: true,
            status: 'failed',
            message: 'Délai d\'attente dépassé. Le statut du paiement n\'a pas pu être vérifié. Veuillez vérifier votre compte ou contacter le support.'
          });
        }
      }
    }, 5000); // Vérifier toutes les 5 secondes

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
            
            // Ouvrir l'URL de paiement Wave
            window.open(paymentUrl, '_blank');
            
            setMessage({
              type: 'success',
              text: "Une fenêtre de paiement Wave s'est ouverte. Scannez le code QR avec votre application Wave.",
              show: true
            });

            // Démarrer la vérification du statut
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
          // Pour MTN, Orange, Moov
          setMessage({
            type: 'success',
            text: `Demande de paiement envoyée sur votre numéro ${paymentMethod.toUpperCase()}. Vérifiez votre téléphone et confirmez le paiement.`,
            show: true
          });

          // Démarrer la vérification du statut
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
    
    // Si le paiement était réussi, rediriger après fermeture de la modal
    if (paymentModal.status === 'success') {
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  };

  const handleRetryPayment = () => {
    setPaymentModal({ ...paymentModal, open: false });
    // Relancer le paiement
    initiatePayment();
  };

  const totalAmount = votes * 100;
  const totalPoints = votes * 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          <Box sx={{ position: 'relative', width: { xs: '100%' }, padding: 2  }}>
            <Avatar 
              src={`${apiImageUrl}/${part.url_photo_identite}`}
              alt={part.nom_presentation}
              sx={{
                width: 128,
                height: 128,
                border: '4px solid white',
                boxShadow: 3
              }}
            />
            <Stack spacing={2} sx={{ flex: 1 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                {part.nom_presentation}
              </Typography>
              
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'white' }}>
                    CODE :
                  </Typography>
                  <Chip
                    label={part.code_candidat}
                    sx={{
                      backgroundColor: '#f3e8ff',
                      color: '#7c3aed',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}
                  />
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Trophy size={16} color="#eab308" />
                  <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'white' }}>
                    {part.nbre_point} point(s)
                  </Typography>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Vote size={16} color="#3b82f6" />
                  <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'white' }}>
                    {part.nbre_vote} vote(s)
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
              <Typography 
                variant="h6" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: { xs: 'center', md: 'center' }
                }}
              >
                {competition.titre_competition} 
              </Typography>  
            </div>   
          </Box>

          <Box sx={{ maxWidth: '640px', mx: 'auto', width: { xs: '100%' }, padding: 2 }}>
            {part.url_video ? (
              <Box
                component="video"
                src={`${apiImageUrl}/${part.url_video}`}
                controls
                sx={{
                  width: '100%',
                  height: 320,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 2
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
      <div className="max-w-4xl mx-auto p-6">
        {/* Message d'information */}
        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            Les votes sont actualisés <strong>toutes les 5 minutes.</strong>
          </p>
        </div>

        {/* Messages de feedback */}
        {message.show && message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-200 text-green-800'
              : message.type === 'warning'
              ? 'bg-yellow-100 border border-yellow-200 text-yellow-800' 
              : 'bg-red-100 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulaire de vote */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CreditCard className="w-6 h-6" />
              Vote en ligne
            </h2>
          </div>

          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Utilisez les contrôles ci-dessous pour choisir le nombre de votes.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Nombre de votes à attribuer :
                </label>
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-lg text-center font-semibold mb-4">
                  1 vote = 100 FCFA = 10 points
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setVotes(Math.max(1, votes - 1))}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 transition-colors"
                    disabled={votes <= 1 || isLoading}
                  >
                    <span className="text-xl font-bold">-</span>
                  </button>
                  
                  <input
                    type="number"
                    value={votes}
                    onChange={(e) => setVotes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg py-2"
                    min="1"
                    disabled={isLoading}
                  />
                  
                  <button
                    type="button"
                    onClick={() => setVotes(votes + 1)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 transition-colors"
                    disabled={isLoading}
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>
                </div>

                <div className="text-center text-gray-600">
                  <p>Total: <span className="font-bold text-lg">{totalAmount} FCFA</span></p>
                  <p>Points attribués: <span className="font-bold text-lg">{totalPoints} points</span></p>
                </div>
              </div>

              {/* Sélection de l'opérateur */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Choisissez votre opérateur :
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { id: 'mtn', name: 'MTN Money', color: 'bg-yellow-500' },
                    { id: 'orange', name: 'Orange Money', color: 'bg-orange-500' },
                    { id: 'wave', name: 'Wave', color: 'bg-blue-500' },
                    { id: 'moov', name: 'Moov Money', color: 'bg-green-500' }
                  ].map((operator) => (
                    <label key={operator.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={operator.id}
                        checked={paymentMethod === operator.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                        disabled={isLoading}
                      />
                      <div className={`p-4 rounded-lg border-2 text-center transition-all ${
                        paymentMethod === operator.id 
                          ? `${operator.color} text-white border-transparent transform scale-105` 
                          : 'bg-gray-100 border-gray-300 hover:border-gray-400'
                      }`}>
                        <div className="font-semibold">{operator.name}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Numéro de téléphone */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Numéro de téléphone :
                </label>
                <div className="flex">
                  <span className="bg-gray-100 border border-r-0 border-gray-300 px-4 py-3 rounded-l-lg">
                    +225
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="00 00 00 00 00"
                    className="flex-1 border border-gray-300 px-4 py-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Instructions spécifiques pour Wave */}
              {paymentMethod === 'wave' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Instructions Wave :</h4>
                  <p className="text-blue-700 text-sm">
                    Après avoir cliqué sur "Valider et Payer", une nouvelle fenêtre s'ouvrira avec un code QR. 
                    Scannez ce code avec votre application Wave pour finaliser le paiement.
                  </p>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                onClick={initiatePayment}
                className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg transition-all ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Traitement en cours...
                  </div>
                ) : (
                  'Valider et Payer'
                )}
              </button>
            </div>

            {/* Bouton retour */}
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold mx-auto"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                Revenir à la liste des candidats
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section publicitaire */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Espace Publicitaire</h3>
            <p className="text-gray-600">Votre publicité ici</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingComponent;