import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EmojiEvents, 
  Calculate, 
  Psychology, 
  QuestionMark, 
  Group, 
  PlayArrow,
  Star
} from '@mui/icons-material';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
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
      bgColor: 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)'
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
      bgColor: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)'
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
      bgColor: 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)'
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
      bgColor: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)'
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
      bgColor: 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)'
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
      bgColor: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)'
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
      bgColor: 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%)'
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
      bgColor: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)'
    }
  ];

  const handlePlayQuiz = (quizId, quizTitle) => {
    // Navigation vers la page du quiz avec l'ID
    navigate(`/quiz/${quizId}`, { 
      state: { 
        quizTitle,
        quizData: quizzes.find(q => q.id === quizId)
      }
    });
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
    </div>
  );
};

export default Quiz;

