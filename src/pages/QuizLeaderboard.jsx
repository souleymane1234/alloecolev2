import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  EmojiEvents, 
  ArrowBack,
  Person,
  Star,
  ErrorOutline
} from '@mui/icons-material';
import { Trophy } from 'lucide-react';
import { Alert, CircularProgress } from '@mui/material';
import quizService from '../services/quizService';
import './QuizLeaderboard.css';

const QuizLeaderboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('ALL_TIME');

  const { data: leaderboardData, isLoading, error } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => quizService.getLeaderboard({ period, limit: 50, offset: 0 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-first';
    if (rank === 2) return 'rank-second';
    if (rank === 3) return 'rank-third';
    return '';
  };

  if (isLoading) {
    return (
      <div className="quiz-leaderboard-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-leaderboard-page">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: '16px' }}>
          <Alert severity="error" />
          <p>Erreur lors du chargement du classement. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  const entries = leaderboardData?.entries || [];
  const currentUserEntry = leaderboardData?.currentUserEntry;
  const total = leaderboardData?.total || 0;

  return (
    <div className="quiz-leaderboard-page">
      <div className="leaderboard-header">
        <button onClick={() => navigate('/quiz')} className="back-button">
          <ArrowBack />
          Retour
        </button>
        <h1 className="leaderboard-title">
          <EmojiEvents />
          Classement
        </h1>
      </div>

      <div className="leaderboard-filters">
        <button
          className={`filter-btn ${period === 'ALL_TIME' ? 'active' : ''}`}
          onClick={() => setPeriod('ALL_TIME')}
        >
          Tous les temps
        </button>
        <button
          className={`filter-btn ${period === 'MONTHLY' ? 'active' : ''}`}
          onClick={() => setPeriod('MONTHLY')}
        >
          Ce mois
        </button>
        <button
          className={`filter-btn ${period === 'WEEKLY' ? 'active' : ''}`}
          onClick={() => setPeriod('WEEKLY')}
        >
          Cette semaine
        </button>
      </div>

      {currentUserEntry && (
        <div className="current-user-card">
          <div className="user-rank-badge">
            <Trophy />
            <span>Votre position: #{currentUserEntry.rank}</span>
          </div>
          <div className="user-stats">
            <div className="stat-item">
              <Star />
              <span>{currentUserEntry.totalPoints} points</span>
            </div>
            <div className="stat-item">
              <Person />
              <span>{currentUserEntry.quizzesCompleted} quiz complétés</span>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-list">
        <div className="leaderboard-header-row">
          <span className="rank-col">Rang</span>
          <span className="user-col">Joueur</span>
          <span className="points-col">Points</span>
          <span className="quizzes-col">Quiz</span>
        </div>

        {entries.length === 0 ? (
          <div className="empty-state">
            <p>Aucun joueur dans le classement pour le moment.</p>
          </div>
        ) : (
          entries.map((entry, index) => {
            const rankIcon = getRankIcon(entry.rank);
            const rankClass = getRankClass(entry.rank);
            const isCurrentUser = currentUserEntry?.userId === entry.userId;

            return (
              <div
                key={entry.userId}
                className={`leaderboard-entry ${rankClass} ${isCurrentUser ? 'current-user' : ''}`}
              >
                <div className="rank-col">
                  {rankIcon ? (
                    <span className="rank-icon">{rankIcon}</span>
                  ) : (
                    <span className="rank-number">#{entry.rank}</span>
                  )}
                </div>
                <div className="user-col">
                  {entry.profileImage && (
                    <img
                      src={entry.profileImage}
                      alt={`${entry.firstName} ${entry.lastName}`}
                      className="user-avatar"
                    />
                  )}
                  <div className="user-info">
                    <span className="user-name">
                      {entry.firstName} {entry.lastName}
                    </span>
                    {entry.email && (
                      <span className="user-email">{entry.email}</span>
                    )}
                  </div>
                </div>
                <div className="points-col">
                  <Trophy className="points-icon" />
                  <span className="points-value">{entry.totalPoints}</span>
                </div>
                <div className="quizzes-col">
                  <span className="quizzes-value">{entry.quizzesCompleted}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {total > entries.length && (
        <div className="leaderboard-footer">
          <p>Affichage de {entries.length} sur {total} joueurs</p>
        </div>
      )}
    </div>
  );
};

export default QuizLeaderboard;
