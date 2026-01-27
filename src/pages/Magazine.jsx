import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  MenuBook,
  Description,
  Visibility,
  ErrorOutline
} from '@mui/icons-material';
import { CircularProgress, Alert } from '@mui/material';
import magazineService from '../services/magazineService';
import './Magazine.css';

const Magazine = () => {
  const navigate = useNavigate();

  // Récupérer les magazines depuis l'API
  const { data, isLoading, error } = useQuery({
    queryKey: ['magazines'],
    queryFn: () => magazineService.getMagazines({ page: 1, limit: 20 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const magazines = data?.magazines || [];

  // Fonction pour obtenir une couleur basée sur l'index
  const getMagazineColors = (index) => {
    const colors = [
      { iconBg: '#E3F2FD', iconColor: '#2196F3', issueColor: '#2196F3', buttonColor: '#2196F3' },
      { iconBg: '#E8F5E9', iconColor: '#4CAF50', issueColor: '#4CAF50', buttonColor: '#4CAF50' },
      { iconBg: '#FCE4EC', iconColor: '#E91E63', issueColor: '#E91E63', buttonColor: '#E91E63' },
      { iconBg: '#F3E5F5', iconColor: '#9C27B0', issueColor: '#9C27B0', buttonColor: '#9C27B0' },
      { iconBg: '#FFF3E0', iconColor: '#FF9800', issueColor: '#FF9800', buttonColor: '#FF9800' },
      { iconBg: '#FFEBEE', iconColor: '#F44336', issueColor: '#F44336', buttonColor: '#F44336' },
      { iconBg: '#E0F2F1', iconColor: '#009688', issueColor: '#009688', buttonColor: '#009688' },
      { iconBg: '#E8EAF6', iconColor: '#3F51B5', issueColor: '#3F51B5', buttonColor: '#3F51B5' },
    ];
    return colors[index % colors.length];
  };

  // Formater la date de publication
  const formatPublishedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleReadMagazine = (magazine) => {
    navigate(`/magazine/read/${magazine.id}`, { 
      state: { magazine } 
    });
  };

  if (isLoading) {
    return (
      <div className="magazine-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="magazine-page">
        <div className="magazine-content">
          <Alert severity="error" icon={<ErrorOutline />}>
            {error.message || 'Erreur lors du chargement des magazines'}
          </Alert>
        </div>
      </div>
    );
  }

  if (magazines.length === 0) {
    return (
      <div className="magazine-page">
        <div className="magazine-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <MenuBook style={{ fontSize: 64, color: '#ccc', marginBottom: '16px' }} />
            <h2>Aucun magazine disponible</h2>
            <p>Il n'y a pas de magazines publiés pour le moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="magazine-page">
      <div className="magazine-content">
        <div className="magazine-list">
          {magazines.map((magazine, index) => {
            const colors = getMagazineColors(index);
            const publishedDate = formatPublishedDate(magazine.publishedAt);
            
            return (
            <div key={magazine.id} className="magazine-card">
                {magazine.coverImageUrl ? (
                  <div className="magazine-cover-container">
                    <img 
                      src={magazine.coverImageUrl} 
                      alt={magazine.title}
                      className="magazine-cover-image"
                    />
                  </div>
                ) : (
              <div 
                className="magazine-icon-container"
                    style={{ backgroundColor: colors.iconBg }}
              >
                    <MenuBook 
                  className="magazine-icon"
                      style={{ color: colors.iconColor }}
                />
              </div>
                )}
              
              <div className="magazine-info">
                <h3 className="magazine-title">{magazine.title}</h3>
                  {publishedDate && (
                <p 
                  className="magazine-issue"
                      style={{ color: colors.issueColor }}
                >
                      {publishedDate}
                </p>
                  )}
                <p className="magazine-description">{magazine.description}</p>
                
                <div className="magazine-footer">
                  <div className="magazine-pages">
                    <Description className="pages-icon" />
                      <span>PDF disponible</span>
                  </div>
                  
                  <button 
                    className="read-button"
                      style={{ backgroundColor: colors.buttonColor }}
                    onClick={() => handleReadMagazine(magazine)}
                  >
                    <Visibility className="read-icon" />
                    <span>Lire</span>
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Magazine;

