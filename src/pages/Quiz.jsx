import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LocalOffer
} from '@mui/icons-material';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const quizzes = [
    {
      id: 1,
      icon: Calculate,
      title: 'Quiz Mathématiques',
      description: 'Testez vos connaissances en mathématiques',
      questions: 15,
      difficulty: 'Moyen',
      difficultyColor: '#E91E63',
      players: 1250,
      bgColor: 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)',
      duration: 15,
      prizes: [
        { rank: 1, reward: '10 000 FCFA', icon: '🥇' },
        { rank: 2, reward: '5 000 FCFA', icon: '🥈' },
        { rank: 3, reward: '2 500 FCFA', icon: '🥉' },
        { rank: '4-10', reward: '1 000 FCFA', icon: '⭐' }
      ],
      rules: [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ]
    },
    {
      id: 2,
      icon: Psychology,
      title: 'Quiz Culture Générale',
      description: 'Défiez vos amis sur la culture générale',
      questions: 20,
      difficulty: 'Difficile',
      difficultyColor: '#D32F2F',
      players: 2100,
      bgColor: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
      duration: 20,
      prizes: [
        { rank: 1, reward: '15 000 FCFA', icon: '🥇' },
        { rank: 2, reward: '7 500 FCFA', icon: '🥈' },
        { rank: 3, reward: '3 000 FCFA', icon: '🥉' },
        { rank: '4-10', reward: '1 500 FCFA', icon: '⭐' }
      ],
      rules: [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ]
    },
    {
      id: 3,
      icon: Calculate,
      title: 'Quiz Sciences',
      description: 'Explorez le monde des sciences',
      questions: 18,
      difficulty: 'Moyen',
      difficultyColor: '#E91E63',
      players: 1580,
      bgColor: 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)',
      duration: 18,
      prizes: [
        { rank: 1, reward: '12 000 FCFA', icon: '🥇' },
        { rank: 2, reward: '6 000 FCFA', icon: '🥈' },
        { rank: 3, reward: '2 500 FCFA', icon: '🥉' },
        { rank: '4-10', reward: '1 000 FCFA', icon: '⭐' }
      ],
      rules: [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ]
    },
    {
      id: 4,
      icon: Psychology,
      title: 'Quiz Histoire',
      description: 'Voyagez à travers le temps',
      questions: 25,
      difficulty: 'Difficile',
      difficultyColor: '#D32F2F',
      players: 1890,
      bgColor: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
      duration: 25,
      prizes: [
        { rank: 1, reward: '20 000 FCFA', icon: '🥇' },
        { rank: 2, reward: '10 000 FCFA', icon: '🥈' },
        { rank: 3, reward: '5 000 FCFA', icon: '🥉' },
        { rank: '4-10', reward: '2 000 FCFA', icon: '⭐' }
      ],
      rules: [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ]
    },
    {
      id: 5,
      icon: Calculate,
      title: 'Quiz Géographie',
      description: 'Découvrez les pays du monde',
      questions: 12,
      difficulty: 'Facile',
      difficultyColor: '#4CAF50',
      players: 2450,
      bgColor: 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)',
      duration: 12,
      prizes: [
        { rank: 1, reward: '8 000 FCFA', icon: '🥇' },
        { rank: 2, reward: '4 000 FCFA', icon: '🥈' },
        { rank: 3, reward: '2 000 FCFA', icon: '🥉' },
        { rank: '4-10', reward: '800 FCFA', icon: '⭐' }
      ],
      rules: [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ]
    },
    {
      id: 6,
      icon: Psychology,
      title: 'Quiz Français',
      description: 'Testez votre maîtrise du français',
      questions: 20,
      difficulty: 'Moyen',
      difficultyColor: '#E91E63',
      players: 1720,
      bgColor: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
      duration: 20,
      prizes: [
        { rank: 1, reward: '12 000 FCFA', icon: '🥇' },
        { rank: 2, reward: '6 000 FCFA', icon: '🥈' },
        { rank: 3, reward: '2 500 FCFA', icon: '🥉' },
        { rank: '4-10', reward: '1 000 FCFA', icon: '⭐' }
      ],
      rules: [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ]
    },
    {
      id: 7,
      icon: Calculate,
      title: 'Quiz Anglais',
      description: 'Améliorez votre anglais',
      questions: 15,
      difficulty: 'Facile',
      difficultyColor: '#4CAF50',
      players: 3200,
      bgColor: 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)',
      duration: 15,
      prizes: [
        { rank: 1, reward: '10 000 FCFA', icon: '🥇' },
        { rank: 2, reward: '5 000 FCFA', icon: '🥈' },
        { rank: 3, reward: '2 500 FCFA', icon: '🥉' },
        { rank: '4-10', reward: '1 000 FCFA', icon: '⭐' }
      ],
      rules: [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ]
    },
    {
      id: 8,
      icon: Psychology,
      title: 'Quiz Art & Culture',
      description: 'Pour les passionnés d\'art',
      questions: 22,
      difficulty: 'Difficile',
      difficultyColor: '#D32F2F',
      players: 980,
      bgColor: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
      duration: 22,
      prizes: [
        { rank: 1, reward: '15 000 FCFA', icon: '🥇' },
        { rank: 2, reward: '7 500 FCFA', icon: '🥈' },
        { rank: 3, reward: '3 000 FCFA', icon: '🥉' },
        { rank: '4-10', reward: '1 500 FCFA', icon: '⭐' }
      ],
      rules: [
        'Répondez à toutes les questions dans le temps imparti',
        'Les points sont attribués selon la rapidité de réponse',
        'Les meilleurs scores remportent des lots'
      ]
    }
  ];

  const handlePlayQuiz = (quizId, quizTitle) => {
    const quiz = quizzes.find(q => q.id === quizId);
    setSelectedQuiz(quiz);
    setShowModal(true);
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
        {quizzes.map((quiz, index) => (
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
              onClick={() => handlePlayQuiz(quiz.id, quiz.title)}
            >
              {/* <PlayArrow className="play-icon" /> */}
              <span>JOUER</span>
            </button>

          </div>
        ))}
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
                  {selectedQuiz.prizes.map((prize, index) => (
                    <div key={index} className="prize-item">
                      <span className="prize-icon">{prize.icon}</span>
                      <div className="prize-info">
                        <span className="prize-rank">{prize.rank === '4-10' ? 'Rang 4-10' : `Rang ${prize.rank}`}</span>
                        <span className="prize-reward">{prize.reward}</span>
                      </div>
                    </div>
                  ))}
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

