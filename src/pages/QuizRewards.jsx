import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  EmojiEvents, 
  ArrowBack,
  Star,
  ErrorOutline,
  Image as ImageIcon
} from '@mui/icons-material';
import { Trophy } from 'lucide-react';
import { Alert, CircularProgress } from '@mui/material';
import quizService from '../services/quizService';
import './QuizRewards.css';

const QuizRewards = () => {
  const navigate = useNavigate();

  const { data: rewards, isLoading, error } = useQuery({
    queryKey: ['myRewards'],
    queryFn: () => quizService.getMyRewards(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getRewardTypeIcon = (type) => {
    switch (type) {
      case 'BADGE':
        return '🏅';
      case 'POINTS':
        return '⭐';
      case 'TROPHY':
        return '🏆';
      default:
        return '🎁';
    }
  };

  const getRewardTypeLabel = (type) => {
    switch (type) {
      case 'BADGE':
        return 'Badge';
      case 'POINTS':
        return 'Points';
      case 'TROPHY':
        return 'Trophée';
      default:
        return 'Récompense';
    }
  };

  if (isLoading) {
    return (
      <div className="quiz-rewards-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-rewards-page">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: '16px' }}>
          <Alert severity="error" />
          <p>Erreur lors du chargement des récompenses. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  const rewardsList = rewards || [];

  return (
    <div className="quiz-rewards-page">
      <div className="rewards-header">
        <button onClick={() => navigate('/quiz')} className="back-button">
          <ArrowBack />
          Retour
        </button>
        <h1 className="rewards-title">
          <Trophy />
          Mes Récompenses
        </h1>
      </div>

      {rewardsList.length === 0 ? (
        <div className="empty-rewards">
          <EmojiEvents className="empty-icon" />
          <h2>Aucune récompense</h2>
          <p>Participez aux quiz pour débloquer des récompenses !</p>
          <button onClick={() => navigate('/quiz')} className="cta-button">
            Voir les quiz
          </button>
        </div>
      ) : (
        <>
          <div className="rewards-summary">
            <div className="summary-card">
              <Trophy className="summary-icon" />
              <div>
                <span className="summary-value">{rewardsList.length}</span>
                <span className="summary-label">Récompenses obtenues</span>
              </div>
            </div>
          </div>

          <div className="rewards-grid">
            {rewardsList.map((userReward) => {
              const reward = userReward.reward || {};
              const obtainedDate = new Date(userReward.obtainedAt);

              return (
                <div key={userReward.id} className="reward-card">
                  <div className="reward-header">
                    {reward.iconUrl ? (
                      <img
                        src={reward.iconUrl}
                        alt={reward.title}
                        className="reward-icon-img"
                      />
                    ) : (
                      <div className="reward-icon">
                        {getRewardTypeIcon(reward.rewardType)}
                      </div>
                    )}
                    <div className="reward-type-badge">
                      {getRewardTypeLabel(reward.rewardType)}
                    </div>
                  </div>

                  <div className="reward-content">
                    <h3 className="reward-title">{reward.title}</h3>
                    {reward.description && (
                      <p className="reward-description">{reward.description}</p>
                    )}

                    <div className="reward-details">
                      {reward.pointsValue && (
                        <div className="detail-item">
                          <Star className="detail-icon" />
                          <span>{reward.pointsValue} points</span>
                        </div>
                      )}
                      {reward.minScore && (
                        <div className="detail-item">
                          <span>Score minimum: {reward.minScore}%</span>
                        </div>
                      )}
                    </div>

                    <div className="reward-footer">
                      <span className="obtained-date">
                        Obtenu le {obtainedDate.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {reward.imageUrl && (
                    <div className="reward-image-container">
                      <img
                        src={reward.imageUrl}
                        alt={reward.title}
                        className="reward-image"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizRewards;
