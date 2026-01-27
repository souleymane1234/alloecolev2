import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowBack,
  Tv,
  CalendarToday,
  People,
  EmojiEvents,
  PlayArrow,
  ErrorOutline
} from '@mui/icons-material';
import { CircularProgress, Alert, Tabs, Tab, Box } from '@mui/material';
import emissionService from '../services/emissionService';
import './EmissionDetailPage.css';

const EmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Récupérer les détails de l'émission
  const { data: emission, isLoading: isLoadingEmission, error: emissionError } = useQuery({
    queryKey: ['emission', id],
    queryFn: () => emissionService.getEmissionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Récupérer l'édition active
  const { data: activeEdition } = useQuery({
    queryKey: ['emission', id, 'active-edition'],
    queryFn: () => emissionService.getActiveEdition(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });

  // Récupérer toutes les éditions
  const { data: editionsData } = useQuery({
    queryKey: ['emission', id, 'editions'],
    queryFn: () => emissionService.getEditions(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const editions = editionsData?.editions || [];
  const currentEdition = activeEdition || (editions.length > 0 ? editions[0] : null);

  // État pour l'édition sélectionnée
  const [selectedEditionId, setSelectedEditionId] = useState(() => currentEdition?.id || null);
  
  // Mettre à jour selectedEditionId quand currentEdition change
  useEffect(() => {
    if (currentEdition?.id && !selectedEditionId) {
      setSelectedEditionId(currentEdition.id);
    }
  }, [currentEdition?.id, selectedEditionId]);

  // Récupérer les candidats de l'édition sélectionnée
  const { data: candidatesData } = useQuery({
    queryKey: ['edition', selectedEditionId, 'candidates'],
    queryFn: () => emissionService.getCandidates(selectedEditionId, { status: 'VALIDE' }),
    enabled: !!selectedEditionId,
    staleTime: 1 * 60 * 1000,
  });

  // Récupérer le classement de l'édition sélectionnée
  const { data: rankingData } = useQuery({
    queryKey: ['edition', selectedEditionId, 'ranking'],
    queryFn: () => emissionService.getRanking(selectedEditionId),
    enabled: !!selectedEditionId,
    staleTime: 1 * 60 * 1000,
  });

  const candidates = candidatesData?.candidates || [];
  const ranking = rankingData?.ranking || [];

  // Formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'OUVERTE': '#4CAF50',
      'EN_COURS': '#2196F3',
      'FERMEE': '#9E9E9E',
      'TERMINEE': '#FF9800',
    };
    return colors[status] || '#9E9E9E';
  };

  if (isLoadingEmission) {
    return (
      <div className="emission-detail-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (emissionError || !emission) {
    return (
      <div className="emission-detail-page">
        <div className="emission-detail-content">
          <Alert severity="error" icon={<ErrorOutline />}>
            {emissionError?.message || 'Émission non trouvée'}
          </Alert>
          <button onClick={() => navigate('/emissions-telerealite')} className="back-button">
            <ArrowBack />
            Retour aux émissions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="emission-detail-page">
      <div className="emission-detail-content">
        {/* Header */}
        <div className="emission-header">
          <button onClick={() => navigate('/emissions-telerealite')} className="back-icon-button">
            <ArrowBack />
          </button>
          <div className="emission-header-info">
            <div className="emission-badge">
              <Tv className="badge-icon" />
              <span>TÉLÉRÉALITÉ</span>
            </div>
            <h1 className="emission-title">{emission.title}</h1>
            <p className="emission-description">{emission.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Éditions" />
            {selectedEditionId && <Tab label="Candidats" />}
            {selectedEditionId && <Tab label="Classement" />}
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <div className="editions-section">
            <h2 className="section-title">Éditions</h2>
            {editions.length === 0 ? (
              <div className="empty-state">
                <CalendarToday style={{ fontSize: 64, color: '#ccc', marginBottom: '16px' }} />
                <p>Aucune édition disponible pour le moment.</p>
              </div>
            ) : (
              <div className="editions-grid">
                {editions.map((edition) => (
                  <div key={edition.id} className="edition-card">
                    <div className="edition-header">
                      <h3 className="edition-title">{edition.title}</h3>
                      <span 
                        className="edition-status"
                        style={{ backgroundColor: getStatusColor(edition.status) }}
                      >
                        {edition.status}
                      </span>
                    </div>
                    <p className="edition-description">{edition.description}</p>
                    <div className="edition-dates">
                      <div className="date-item">
                        <CalendarToday className="date-icon" />
                        <div>
                          <span className="date-label">Début:</span>
                          <span className="date-value">{formatDate(edition.startDate)}</span>
                        </div>
                      </div>
                      <div className="date-item">
                        <CalendarToday className="date-icon" />
                        <div>
                          <span className="date-label">Fin:</span>
                          <span className="date-value">{formatDate(edition.endDate)}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="view-edition-button"
                      onClick={() => {
                        setSelectedEditionId(edition.id);
                        setActiveTab(1);
                      }}
                    >
                      <PlayArrow />
                      Voir les candidats
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && selectedEditionId && (
          <div className="candidates-section">
            <h2 className="section-title">
              Candidats - {editions.find(e => e.id === selectedEditionId)?.title || 'Édition'}
            </h2>
            {candidates.length === 0 ? (
              <div className="empty-state">
                <People style={{ fontSize: 64, color: '#ccc', marginBottom: '16px' }} />
                <p>Aucun candidat pour le moment.</p>
              </div>
            ) : (
              <div className="candidates-grid">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    className="candidate-card"
                    onClick={() => navigate(`/emission/candidate/${candidate.id}`)}
                  >
                    <div className="candidate-header">
                      <h3 className="candidate-pseudo">{candidate.pseudo}</h3>
                      <span className="candidate-votes">{candidate.totalVotes} votes</span>
                    </div>
                    {candidate.description && (
                      <p className="candidate-description">{candidate.description}</p>
                    )}
                    <div className="candidate-footer">
                      <span className="candidate-status">{candidate.status}</span>
                      <button className="view-candidate-button">
                        Voir le profil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && selectedEditionId && (
          <div className="ranking-section">
            <h2 className="section-title">
              Classement - {editions.find(e => e.id === selectedEditionId)?.title || 'Édition'}
            </h2>
            {ranking.length === 0 ? (
              <div className="empty-state">
                <EmojiEvents style={{ fontSize: 64, color: '#ccc', marginBottom: '16px' }} />
                <p>Aucun classement disponible pour le moment.</p>
              </div>
            ) : (
              <div className="ranking-list">
                {ranking.map((entry, index) => (
                  <div key={entry.id} className="ranking-item">
                    <div className="ranking-position">
                      {entry.rank <= 3 ? (
                        <EmojiEvents 
                          className="ranking-trophy"
                          style={{ 
                            color: entry.rank === 1 ? '#FFD700' : 
                                   entry.rank === 2 ? '#C0C0C0' : '#CD7F32'
                          }}
                        />
                      ) : (
                        <span className="ranking-number">#{entry.rank}</span>
                      )}
                    </div>
                    <div className="ranking-info">
                      <h3 className="ranking-pseudo">{entry.pseudo}</h3>
                      {entry.description && (
                        <p className="ranking-description">{entry.description}</p>
                      )}
                    </div>
                    <div className="ranking-votes">
                      <span className="votes-count">{entry.totalVotes}</span>
                      <span className="votes-label">votes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmissionDetailPage;
