import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Tv,
  ErrorOutline
} from '@mui/icons-material';
import { CircularProgress, Alert } from '@mui/material';
import emissionService from '../services/emissionService';
import './TeleReality.css';

const TeleReality = () => {
  const navigate = useNavigate();

  // Récupérer les émissions depuis l'API
  const { data, isLoading, error } = useQuery({
    queryKey: ['emissions'],
    queryFn: async () => {
      try {
        const result = await emissionService.getEmissions({ page: 1, limit: 20 });
        console.log('📺 Données reçues dans TeleReality:', result);
        return result;
      } catch (err) {
        console.error('❌ Erreur lors de la récupération des émissions:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const emissions = data?.emissions || [];
  console.log('📺 Émissions à afficher:', emissions);

  // Émission en vedette (première émission active)
  const featuredShow = useMemo(() => {
    if (emissions.length === 0) return null;
    const first = emissions[0];
    return {
      id: first.id,
      title: first.title,
      description: first.description,
      category: 'TÉLÉRÉALITÉ'
    };
  }, [emissions]);

  const handleShowClick = (emissionId) => {
    navigate(`/emission/${emissionId}`);
  };

  if (isLoading) {
    return (
      <div className="telerealite-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="telerealite-page">
        <div className="telerealite-content">
          <Alert severity="error" icon={<ErrorOutline />}>
            {error.message || 'Erreur lors du chargement des émissions'}
          </Alert>
        </div>
      </div>
    );
  }

  if (emissions.length === 0) {
    return (
      <div className="telerealite-page">
        <div className="telerealite-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Tv style={{ fontSize: 64, color: '#ccc', marginBottom: '16px' }} />
            <h2>Aucune émission disponible</h2>
            <p>Il n'y a pas d'émissions publiées pour le moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="telerealite-page">
      <div className="telerealite-content">
        {/* Featured Show */}
        {featuredShow && (
          <div 
            className="featured-show"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={() => handleShowClick(featuredShow.id)}
          >
            <div className="featured-overlay">
              <div className="featured-info">
                <div className="show-badge">
                  <Tv className="badge-icon" />
                  <span>TÉLÉRÉALITÉ</span>
                </div>
                
                <h1 className="featured-title">{featuredShow.title}</h1>
                
                <p className="featured-description">{featuredShow.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* All Shows Section */}
        <div className="all-shows-section">
          <h2 className="section-title">Toutes les émissions</h2>
          
          <div className="shows-grid">
            {emissions.map((emission) => (
              <div 
                key={emission.id} 
                className="show-card"
                onClick={() => handleShowClick(emission.id)}
              >
                <div className="show-content">
                  <div className="show-badge-small">
                    <Tv className="badge-icon" />
                    <span>Émission</span>
                  </div>
                  
                  <h3 className="show-title">{emission.title}</h3>
                  <p className="show-description">{emission.description}</p>
                  
                  <button 
                    className="interest-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowClick(emission.id);
                    }}
                  >
                    <span>Voir les détails</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeleReality;