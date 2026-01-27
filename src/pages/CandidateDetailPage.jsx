import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  ArrowBack,
  Person,
  ThumbUp,
  EmojiEvents,
  ErrorOutline,
  Phone,
  CreditCard
} from '@mui/icons-material';
import { CircularProgress, Alert, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import emissionService from '../services/emissionService';
import tokenManager from '../helper/tokenManager';
import './CandidateDetailPage.css';

const CandidateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVoteForm, setShowVoteForm] = useState(false);
  const [voteData, setVoteData] = useState({
    voteCount: 1,
    provider: 'MTN',
    amountPerVote: 500,
    phoneNumber: '',
    otp: '',
  });

  // Récupérer les détails du candidat
  const { data: candidate, isLoading, error } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => emissionService.getCandidateById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });

  // Mutation pour initier le vote
  const initiateVoteMutation = useMutation({
    mutationFn: (data) => emissionService.initiateVote(id, {
      ...data,
      returnUrl: `${window.location.origin}/emission/candidate/${id}?payment=success`,
      cancelUrl: `${window.location.origin}/emission/candidate/${id}?payment=cancel`,
    }),
    onSuccess: (data) => {
      console.log('Paiement initié:', data);
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert('Paiement initié avec succès. Vérifiez votre téléphone pour confirmer.');
      }
    },
    onError: (error) => {
      alert(`Erreur: ${error.message}`);
    },
  });

  const handleVoteSubmit = (e) => {
    e.preventDefault();
    if (!tokenManager.isAuthenticated()) {
      alert('Vous devez être connecté pour voter');
      navigate('/login');
      return;
    }
    initiateVoteMutation.mutate(voteData);
  };

  if (isLoading) {
    return (
      <div className="candidate-detail-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="candidate-detail-page">
        <div className="candidate-detail-content">
          <Alert severity="error" icon={<ErrorOutline />}>
            {error?.message || 'Candidat non trouvé'}
          </Alert>
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowBack />
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-detail-page">
      <div className="candidate-detail-content">
        {/* Header */}
        <div className="candidate-header">
          <button onClick={() => navigate(-1)} className="back-icon-button">
            <ArrowBack />
          </button>
          <div className="candidate-header-info">
            <div className="candidate-avatar">
              <Person />
            </div>
            <div>
              <h1 className="candidate-pseudo">{candidate.pseudo}</h1>
              {candidate.description && (
                <p className="candidate-description">{candidate.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="candidate-stats">
          <div className="stat-card">
            <ThumbUp className="stat-icon" />
            <div>
              <span className="stat-value">{candidate.totalVotes}</span>
              <span className="stat-label">Votes</span>
            </div>
          </div>
          <div className="stat-card">
            <EmojiEvents className="stat-icon" />
            <div>
              <span className="stat-value">{candidate.status}</span>
              <span className="stat-label">Statut</span>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {candidate.videoId && (
          <div className="candidate-video-section">
            <h2>Vidéo de candidature</h2>
            <div className="video-placeholder">
              <p>Vidéo ID: {candidate.videoId}</p>
              <p className="note">Note: L'intégration de la vidéo nécessite l'API des vidéos WebTV</p>
            </div>
          </div>
        )}

        {/* Vote Section */}
        {tokenManager.isAuthenticated() && (
          <div className="vote-section">
            <h2>Voter pour ce candidat</h2>
            {!showVoteForm ? (
              <button 
                className="vote-button"
                onClick={() => setShowVoteForm(true)}
              >
                <ThumbUp />
                Voter maintenant
              </button>
            ) : (
              <form onSubmit={handleVoteSubmit} className="vote-form">
                <FormControl fullWidth margin="normal">
                  <InputLabel>Nombre de votes</InputLabel>
                  <Select
                    value={voteData.voteCount}
                    onChange={(e) => setVoteData({ ...voteData, voteCount: e.target.value })}
                  >
                    {[1, 2, 3, 5, 10].map(count => (
                      <MenuItem key={count} value={count}>{count} vote{count > 1 ? 's' : ''}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Opérateur</InputLabel>
                  <Select
                    value={voteData.provider}
                    onChange={(e) => setVoteData({ ...voteData, provider: e.target.value })}
                  >
                    <MenuItem value="MTN">MTN</MenuItem>
                    <MenuItem value="Orange">Orange</MenuItem>
                    <MenuItem value="Moov">Moov</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Numéro de téléphone"
                  value={voteData.phoneNumber}
                  onChange={(e) => setVoteData({ ...voteData, phoneNumber: e.target.value })}
                  placeholder="0512345678"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Code OTP"
                  value={voteData.otp}
                  onChange={(e) => setVoteData({ ...voteData, otp: e.target.value })}
                  placeholder="Code reçu par SMS"
                />

                <div className="vote-summary">
                  <p>Montant total: {voteData.voteCount * voteData.amountPerVote} FCFA</p>
                </div>

                <div className="vote-form-actions">
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowVoteForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    disabled={initiateVoteMutation.isPending}
                    startIcon={<CreditCard />}
                  >
                    {initiateVoteMutation.isPending ? 'Traitement...' : 'Payer et voter'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {!tokenManager.isAuthenticated() && (
          <div className="vote-section">
            <Alert severity="info">
              Vous devez être connecté pour voter
            </Alert>
            <Button 
              variant="contained"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailPage;
