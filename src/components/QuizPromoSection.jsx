import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayArrow, 
  EmojiEvents, 
  LocalOffer,
  Timer,
  Star,
  TrendingUp
} from '@mui/icons-material';
import './QuizPromoSection.css';

const QuizPromoSection = () => {
  const navigate = useNavigate();

  const featuredQuizzes = [
    {
      id: 1,
      title: 'Quiz Histoire',
      image: '/assets/quizs1-6a7bab66-48e8-40a9-bf09-da4bcf85e3f6.png',
      questions: 18,
      players: 1250,
      topPrize: '10 000 FCFA'
    },
    {
      id: 2,
      title: 'Quiz Culture Générale',
      image: '/assets/quiz2-b21294b2-59f0-43c1-a2c0-6f9fb89c9e02.png',
      questions: 20,
      players: 2100,
      topPrize: '15 000 FCFA'
    },
    {
      id: 3,
      title: 'Quiz Sciences',
      image: '/assets/quiz3-3127627e-bb6e-400a-8a90-73410ec28bc4.png',
      questions: 22,
      players: 1580,
      topPrize: '12 000 FCFA'
    }
  ];

  return (
    <div className="quiz-promo-section">
      <div className="quiz-promo-container">
        <div className="quiz-promo-header">
          <div className="promo-header-left">
            <h2 className="promo-title">
              <EmojiEvents className="title-icon" />
              Quiz Populaires
            </h2>
            <p className="promo-subtitle">
              Rejoignez des milliers de joueurs et tentez de remporter les meilleurs lots
            </p>
          </div>
          <button 
            className="promo-view-all"
            onClick={() => navigate('/quiz')}
          >
            Voir tous les quiz
            <PlayArrow className="view-all-icon" />
          </button>
        </div>

        <div className="quiz-promo-grid">
          {featuredQuizzes.map((quiz) => (
            <div 
              key={quiz.id}
              className="quiz-promo-card"
              onClick={() => navigate('/quiz')}
            >
              <div className="promo-card-image">
                <img src={quiz.image} alt={quiz.title} />
                <div className="promo-card-overlay">
                  <PlayArrow className="overlay-play-icon" />
                </div>
                <div className="promo-card-badge">
                  <Star className="badge-star" />
                  <span>Top</span>
                </div>
              </div>
              <div className="promo-card-content">
                <h3 className="promo-card-title">{quiz.title}</h3>
                <div className="promo-card-stats">
                  <div className="promo-stat">
                    <Timer className="stat-icon" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="promo-stat">
                    <TrendingUp className="stat-icon" />
                    <span>{quiz.players.toLocaleString()} joueurs</span>
                  </div>
                </div>
                <div className="promo-card-prize">
                  <LocalOffer className="prize-icon" />
                  <span className="prize-label">Lot principal :</span>
                  <span className="prize-amount">{quiz.topPrize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-promo-cta-section">
          <div className="cta-section-content">
            <h3 className="cta-title">Prêt à relever le défi ?</h3>
            <p className="cta-description">
              Testez vos connaissances, gagnez des points et remportez des lots exceptionnels
            </p>
            <button 
              className="cta-button"
              onClick={() => navigate('/quiz')}
            >
              <PlayArrow className="cta-button-icon" />
              Commencer maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPromoSection;
