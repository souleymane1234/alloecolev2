import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  EmojiEvents, 
  Calculate, 
  Psychology, 
  QuestionMark, 
  Group, 
  PlayArrow,
  Star,
  Close,
  Timer,
  LocalOffer,
  ErrorOutline
} from '@mui/icons-material';
import { Alert, CircularProgress } from '@mui/material';
import quizService from '../services/quizService';
import './Quiz.css';

// Mapping des difficultés pour les couleurs
const difficultyColors = {
  'FACILE': '#4CAF50',
  'MOYEN': '#E91E63',
  'DIFFICILE': '#D32F2F',
  'EXPERT': '#9C27B0',
};

// Mapping des icônes par défaut
const defaultIcons = {
  'Mathématiques': Calculate,
  'Culture Générale': Psychology,
  'Sciences': Calculate,
  'Histoire': Psychology,
  'Géographie': Calculate,
  'Français': Psychology,
  'Anglais': Calculate,
  'Art & Culture': Psychology,
};

const Quiz = () => {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Récupérer les quiz depuis l'API
  const { data: quizzesData, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizService.getQuizzes({ page: 1, limit: 50 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transformer les données de l'API en format compatible avec l'UI
  const quizzes = useMemo(() => {
    if (!quizzesData || !Array.isArray(quizzesData)) return [];
    
    // Filtrer uniquement les quiz actifs
    return quizzesData
      .filter(quiz => quiz.active !== false)
      .map((quiz) => {
      // Déterminer l'icône basée sur le titre
      const iconKey = Object.keys(defaultIcons).find(key => 
        quiz.title?.toLowerCase().includes(key.toLowerCase())
      );
      const Icon = iconKey ? defaultIcons[iconKey] : Calculate;
      
      // Mapper la difficulté
      const difficulty = quiz.difficulty || 'MOYEN';
      const difficultyColor = difficultyColors[difficulty] || difficultyColors['MOYEN'];
      
      // Générer un gradient basé sur la difficulté
      const bgColors = {
        'FACILE': 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)',
        'MOYEN': 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)',
        'DIFFICILE': 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
        'EXPERT': 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
      };
      const bgColor = bgColors[difficulty] || bgColors['MOYEN'];
      
      // Transformer les rewards en format prizes
      // Filtrer et organiser les rewards : badges d'abord, puis points bonus
      const badges = (quiz.rewards || []).filter(r => r.rewardType === 'BADGE');
      const pointsBonus = (quiz.rewards || []).filter(r => r.rewardType === 'POINTS_BONUS');
      
      const prizes = [
        ...badges.map((reward, index) => ({
          rank: index + 1,
          reward: reward.title || 'Badge',
          icon: '🏅',
          description: reward.description,
          minScore: reward.minScore,
        })),
        ...pointsBonus.map((reward, index) => ({
          rank: badges.length + index + 1,
          reward: `${reward.pointsValue || 0} points bonus`,
          icon: '⭐',
          description: reward.description,
          minScore: reward.minScore,
        })),
      ];
      
      // Règles par défaut
      const rules = [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ];
      
      return {
        id: quiz.id,
        icon: Icon,
        title: quiz.title || 'Quiz sans titre',
        description: quiz.description || '',
        questions: quiz.totalQuestions || 0,
        difficulty: difficulty,
        difficultyColor,
        players: 0, // Non disponible dans l'API
        bgColor,
        duration: Math.ceil((quiz.totalQuestions || 10) * 1.5), // Estimation: 1.5 min par question
        prizes: prizes.length > 0 ? prizes : [],
        rules,
        rewards: quiz.rewards || [],
        active: quiz.active !== false, // Par défaut actif si non spécifié
      };
    });
  }, [quizzesData]);

  const handlePlayQuiz = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      setSelectedQuiz(quiz);
      setShowModal(true);
    }
  };

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      setShowModal(false);
      // Créer un objet propre sans les composants React (icon) qui ne peuvent pas être clonés
      const cleanQuizData = {
        id: selectedQuiz.id,
        title: selectedQuiz.title,
        description: selectedQuiz.description,
        questions: selectedQuiz.questions,
        difficulty: selectedQuiz.difficulty,
        difficultyColor: selectedQuiz.difficultyColor,
        players: selectedQuiz.players,
        bgColor: selectedQuiz.bgColor,
        duration: selectedQuiz.duration,
        prizes: selectedQuiz.prizes,
        rules: selectedQuiz.rules
      };
      navigate(`/quiz/${selectedQuiz.id}`, { 
        state: { 
          quizTitle: selectedQuiz.title,
          quizData: cleanQuizData
        }
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  if (isLoading) {
    return (
      <div className="quiz-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', gap: '16px' }}>
          <Alert severity="error" />
          <p>Erreur lors du chargement des quiz. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      {/* Main content */}
      <div className="quiz-content">
        {/* User Rank Card */}
        <div className="rank-card">
          <div className="rank-icon">
            <EmojiEvents />
          </div>
          <div className="rank-info">
            <span className="rank-label">Votre rang</span>
            <span className="rank-value">#42 sur 1250</span>
          </div>
          <div className="rank-badge">
            <Star />
            <span className="badge-count">8</span>
          </div>
        </div>

        {/* Quiz Cards */}
        {quizzes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Aucun quiz disponible pour le moment.</p>
          </div>
        ) : (
          quizzes.map((quiz, index) => (
          <div 
            key={quiz.id} 
            className="quiz-card"
            style={{ background: quiz.bgColor }}
          >
            <div className="quiz-card-header">
              <div className="quiz-icon">
                <quiz.icon />
              </div>
              <div className="quiz-title-section">
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>
              </div>
            </div>

            <div className="quiz-details">
              <div className="quiz-detail-item">
                <QuestionMark className="detail-icon" />
                <span>{quiz.questions} questions</span>
              </div>
              <div 
                className="quiz-detail-item difficulty"
                style={{ backgroundColor: quiz.difficultyColor }}
              >
                <span>{quiz.difficulty}</span>
              </div>
              <div className="quiz-detail-item">
                <Group className="detail-icon" />
                <span>{quiz.players}</span>
              </div>
            </div>
            <button 
              className="play-buttons"
              onClick={() => handlePlayQuiz(quiz.id)}
            >
              {/* <PlayArrow className="play-icon" /> */}
              <span>JOUER</span>
            </button>

          </div>
          ))
        )}
      </div>

      {/* Modal de préambule */}
      {showModal && selectedQuiz && (
        <div className="quiz-modal-overlay" onClick={handleCloseModal}>
          <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
            <button className="quiz-modal-close" onClick={handleCloseModal}>
              <Close />
            </button>
            
            <div className="quiz-modal-header" style={{ background: selectedQuiz.bgColor }}>
              <div className="quiz-modal-icon">
                <selectedQuiz.icon />
              </div>
              <h2 className="quiz-modal-title">{selectedQuiz.title}</h2>
              <p className="quiz-modal-description">{selectedQuiz.description}</p>
            </div>

            <div className="quiz-modal-content">
              <div className="quiz-modal-info">
                <div className="info-item">
                  <QuestionMark className="info-icon" />
                  <div>
                    <span className="info-label">Nombre de questions</span>
                    <span className="info-value">{selectedQuiz.questions}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Timer className="info-icon" />
                  <div>
                    <span className="info-label">Durée estimée</span>
                    <span className="info-value">{selectedQuiz.duration} min</span>
                  </div>
                </div>
                <div className="info-item">
                  <div 
                    className="difficulty-badge"
                    style={{ backgroundColor: selectedQuiz.difficultyColor }}
                  >
                    {selectedQuiz.difficulty}
                  </div>
                </div>
                <div className="info-item">
                  <Group className="info-icon" />
                  <div>
                    <span className="info-label">Joueurs</span>
                    <span className="info-value">{selectedQuiz.players.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="quiz-modal-prizes">
                <h3 className="prizes-title">
                  <LocalOffer className="prizes-icon" />
                  Lots à gagner
                </h3>
                <div className="prizes-list">
                  {selectedQuiz.prizes.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                      Aucune récompense spécifique pour ce quiz
                    </p>
                  ) : (
                    selectedQuiz.prizes.map((prize, index) => (
                      <div key={index} className="prize-item">
                        <span className="prize-icon">{prize.icon}</span>
                        <div className="prize-info">
                          <span className="prize-rank">{prize.reward}</span>
                          {prize.description && (
                            <span className="prize-description">{prize.description}</span>
                          )}
                          {prize.minScore && (
                            <span className="prize-min-score">Score minimum: {prize.minScore}%</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="quiz-modal-rules">
                <h3 className="rules-title">Règles du quiz</h3>
                <ul className="rules-list">
                  {selectedQuiz.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="quiz-modal-footer">
              <button className="quiz-modal-cancel" onClick={handleCloseModal}>
                Annuler
              </button>
              <button className="quiz-modal-start" onClick={handleStartQuiz}>
                <PlayArrow className="start-icon" />
                Commencer le quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;

