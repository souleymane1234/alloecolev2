import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, ArrowLeft, User, Trophy, Vote, Phone, CreditCard } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Stack, 
  Typography, 
  Avatar, 
  Chip, 
  Paper,
  IconButton
} from '@mui/material';

const generateReference = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `REF-${timestamp}-${random}`;
};

const VotingComponent = () => {
  const [votes, setVotes] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', show: false });
  const [transactionId, setTransactionId] = useState('');

  // const [votes, setVotes] = useState(1);
  // const [paymentMethod, setPaymentMethod] = useState('mtn');
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  // const [message, setMessage] = useState({ type: '', text: '' });

  const location = useLocation();
  const navigate = useNavigate();

    // Récupération du participant transmis
const part = location.state?.perso;



  // Données simulées du participant
  const participant = {
    nom_presentation: "Artiste Demo",
    code_candidat: "ZT001",
    nbre_point: 1250,
    nbre_vote: 125,
    url_photo_identite: "img/cacao.jpg",
    url_video: "video/demo.mp4",
  };

  const competition = {
    titre_competition: "ÉDITION 2025"
  };

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'une requête
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: `Votre vote de ${votes} vote(s) a été enregistré avec succès !`
      });
      setIsLoading(false);
    }, 2000);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setMessage({
        type: 'error',
        text: 'Veuillez saisir votre numéro de téléphone'
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulation du paiement
    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'Paiement initié avec succès ! Vous recevrez un SMS de confirmation.'
      });
      setIsLoading(false);
    }, 3000);
  };

  const validatePhoneNumber = (number, operator) => {
    // Nettoyer les espaces
    const cleaned = number.replace(/\s+/g, '');
  
    // Vérifie si le numéro est bien composé de 10 chiffres
    if (!/^\d{10}$/.test(cleaned)) {
      return false;
    }
  
    // Valider selon l'opérateur (exemple de validation simple pour la Côte d'Ivoire)
    const mtnPrefixes = ['05', '65', '25'];
    const orangePrefixes = ['07', '67', '27'];
    const moovPrefixes = ['01', '61', '21'];
    const wavePrefixes = ['01', '07', '05']; // dépend du support local Wave
  
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

  const initiatePayment = async () => {

    console.log('=== DÉBUT DU PAIEMENT ===');
    console.log('Numéro:', phoneNumber);
    console.log('Opérateur:', paymentMethod);
    console.log('Montant:', totalAmount);

    if (!validatePhoneNumber(phoneNumber, paymentMethod)) {
      setMessage({
        type: 'error',
        text: 'Numéro invalide pour l’opérateur sélectionné.'
      });
      return;
    }
  
    setIsLoading(true);
  setMessage({ type: '', text: '' }); // Reset message

  const reference = generateReference();
  console.log('Référence générée:', reference);

  const paymentData = {
    numberClient: phoneNumber,
    typeService: paymentMethod,
    amount: totalAmount,
    reference: reference
  };

  console.log('Données envoyées:', paymentData);

  try {
    const response = await axios.post('http://localhost:9002/api/payment/cashout', paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('=== RÉPONSE REÇUE ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

    // Vérification de la structure de la réponse
    if (response.data && response.data.success) {
      const result = response.data.result;
      const paymentUrl = result?.payment_url;

      console.log('Payment URL trouvée:', paymentUrl);

      if (paymentUrl) {
        // Construction de l'URL de retour
        const returnUrl = `http://localhost:5173/payment/return?ref=${reference}`;
        const fullPaymentUrl = `${paymentUrl}?return_url=${encodeURIComponent(returnUrl)}`;
        
        console.log('Redirection vers:', fullPaymentUrl);
        
        // Redirection vers la page de paiement
        window.location.href = fullPaymentUrl;
      } else {
        console.error('Pas d\'URL de paiement dans la réponse');
        setMessage({
          type: 'error',
          text: "Erreur: URL de paiement non fournie par le service."
        });
      }
    } else {
      console.error('Réponse d\'erreur:', response.data);
      setMessage({
        type: 'error',
        text: response.data?.message || "Erreur lors de l'initialisation du paiement."
      });
    }

  } catch (error) {
    console.error('=== ERREUR AXIOS ===');
    console.error('Error object:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    
    if (error.response) {
      // Erreur de réponse du serveur
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      setMessage({
        type: 'error',
        text: `Erreur serveur: ${error.response.data?.message || error.response.statusText}`
      });
    } else if (error.request) {
      // Erreur de requête (pas de réponse)
      console.error('Pas de réponse du serveur');
      setMessage({
        type: 'error',
        text: 'Impossible de contacter le serveur. Vérifiez votre connexion.'
      });
    } else {
      // Autre erreur
      console.error('Erreur inconnue:', error.message);
      setMessage({
        type: 'error',
        text: 'Une erreur inattendue est survenue.'
      });
    }
  } finally {
    setIsLoading(false);
    console.log('=== FIN DU PAIEMENT ===');
  }
};
  

  const totalAmount = votes * 100;
  const totalPoints = votes * 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">


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
            backgroundColor="rgba(0, 0, 0, 0.5)"
    
          >
            <Box sx={{ position: 'relative', width: { xs: '100%' }, padding: 2  }}>
                  <Avatar
                    src={`http://localhost:9002/${part.url_photo_identite}`}
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
            {/* <div className="w-full  aspect-video">
            <video
                  className="w-full h-64object-cover"
                  src={`http://localhost:9002/${emissionsInfo.url_video_emission}`}
                  poster={`http://localhost:9002/${emissionsInfo.url_photo_emission}`}
                  controls
                ></video>
          </div> */}
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
                    src={`http://localhost:9002/${part.url_video}`}
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
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-200 text-green-800' 
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
                    disabled={votes <= 1}
                  >
                    <span className="text-xl font-bold">-</span>
                  </button>
                  
                  <input
                    type="number"
                    value={votes}
                    onChange={(e) => setVotes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg py-2"
                    min="1"
                  />
                  
                  <button
                    type="button"
                    onClick={() => setVotes(votes + 1)}
                    className="bg-gray-200 hover:bg-gray-300 rounded-full p-3 transition-colors"
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
                  />
                </div>
              </div>

              {/* Bouton de soumission */}
              {/* <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg transition-all ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Traitement en cours...
                  </div>
                ) : (
                  'Effectuer le paiement'
                )}
              </button> */}
              <button
                onClick={initiatePayment}
                className="bg-purple-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Traitement...' : 'Valider et Payer'}
              </button>
            </div>

            {/* Bouton retour */}
            <div className="mt-6 text-center">
              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold mx-auto">
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