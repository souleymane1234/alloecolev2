import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EmojiEvents, 
  PlayArrow,
  Star,
  Close,
  Timer,
  LocalOffer,
  QuestionMark,
  Group
} from '@mui/icons-material';
import './Jeux.css';

const Jeux = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const games = [
    {
      id: 1,
      title: 'Quiz Histoire',
      description: 'Testez vos connaissances en histoire',
      image: '/assets/quizs1-6a7bab66-48e8-40a9-bf09-da4bcf85e3f6.png',
      questions: 18,
      difficulty: 'Moyen',
      difficultyColor: '#E91E63',
      players: 1250,
      duration: 18,
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
      title: 'Quiz Culture Générale',
      description: 'Défiez vos amis sur la culture générale',
      image: '/assets/quiz2-b21294b2-59f0-43c1-a2c0-6f9fb89c9e02.png',
      questions: 20,
      difficulty: 'Difficile',
      difficultyColor: '#D32F2F',
      players: 2100,
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
      title: 'Quiz Sciences',
      description: 'Explorez le monde des sciences',
      image: '/assets/quiz3-3127627e-bb6e-400a-8a90-73410ec28bc4.png',
      questions: 22,
      difficulty: 'Difficile',
      difficultyColor: '#D32F2F',
      players: 1580,
      duration: 22,
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
      title: 'Quiz Géographie',
      description: 'Découvrez les pays du monde',
      image: '/assets/1_-b36948f9-cbcf-4040-9bc2-c500e36190ba.png',
      questions: 15,
      difficulty: 'Facile',
      difficultyColor: '#4CAF50',
      players: 2450,
      duration: 15,
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
    }
  ];

  const handlePlayGame = (gameId) => {
    const game = games.find(g => g.id === gameId);
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleStartGame = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (selectedGame) {
      // Créer un objet propre sans les propriétés qui ne peuvent pas être clonées
      const cleanGameData = {
        id: selectedGame.id,
        title: selectedGame.title,
        description: selectedGame.description,
        image: selectedGame.image,
        questions: selectedGame.questions,
        difficulty: selectedGame.difficulty,
        difficultyColor: selectedGame.difficultyColor,
        players: selectedGame.players,
        duration: selectedGame.duration,
        prizes: selectedGame.prizes,
        rules: selectedGame.rules
      };
      
      // Fermer le modal d'abord
      setShowModal(false);
      setSelectedGame(null);
      
      // Naviguer après un court délai pour s'assurer que le modal se ferme
      setTimeout(() => {
        navigate(`/quiz/${cleanGameData.id}`, { 
          state: { 
            quizTitle: cleanGameData.title,
            quizData: cleanGameData
          }
        });
      }, 150);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGame(null);
  };

  return (
    <div className="jeux-page">
      <div className="jeux-content">
        {/* Header */}
        <div className="jeux-header">
          <h1 className="jeux-title">Jeux & Quiz</h1>
          <p className="jeux-subtitle">Testez vos connaissances et gagnez des lots</p>
        </div>

        {/* Games Grid */}
        <div className="jeux-grid">
          {games.map((game) => (
            <div 
              key={game.id} 
              className="jeux-card"
              onClick={() => handlePlayGame(game.id)}
            >
              <div className="jeux-card-image">
                <img src={game.image} alt={game.title} />
                <div className="jeux-card-overlay">
                  <PlayArrow className="play-icon" />
                </div>
              </div>
              <div className="jeux-card-content">
                <h3 className="jeux-card-title">{game.title}</h3>
                <p className="jeux-card-description">{game.description}</p>
                <div className="jeux-card-details">
                  <div className="jeux-detail-item">
                    <QuestionMark className="detail-icon" />
                    <span>{game.questions} questions</span>
                  </div>
                  <div 
                    className="jeux-detail-item difficulty"
                    style={{ backgroundColor: game.difficultyColor }}
                  >
                    <span>{game.difficulty}</span>
                  </div>
                  <div className="jeux-detail-item">
                    <Group className="detail-icon" />
                    <span>{game.players.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de préambule */}
      {showModal && selectedGame && (
        <div className="jeux-modal-overlay" onClick={handleCloseModal}>
          <div className="jeux-modal" onClick={(e) => e.stopPropagation()}>
            <button className="jeux-modal-close" onClick={handleCloseModal}>
              <Close />
            </button>
            
            <div className="jeux-modal-header">
              <div className="jeux-modal-image">
                <img src={selectedGame.image} alt={selectedGame.title} />
              </div>
              <h2 className="jeux-modal-title">{selectedGame.title}</h2>
              <p className="jeux-modal-description">{selectedGame.description}</p>
            </div>

            <div className="jeux-modal-content">
              <div className="jeux-modal-info">
                <div className="info-item">
                  <QuestionMark className="info-icon" />
                  <div>
                    <span className="info-label">Nombre de questions</span>
                    <span className="info-value">{selectedGame.questions}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Timer className="info-icon" />
                  <div>
                    <span className="info-label">Durée estimée</span>
                    <span className="info-value">{selectedGame.duration} min</span>
                  </div>
                </div>
                <div className="info-item">
                  <div 
                    className="difficulty-badge"
                    style={{ backgroundColor: selectedGame.difficultyColor }}
                  >
                    {selectedGame.difficulty}
                  </div>
                </div>
                <div className="info-item">
                  <Group className="info-icon" />
                  <div>
                    <span className="info-label">Joueurs</span>
                    <span className="info-value">{selectedGame.players.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="jeux-modal-prizes">
                <h3 className="prizes-title">
                  <LocalOffer className="prizes-icon" />
                  Lots à gagner
                </h3>
                <div className="prizes-list">
                  {selectedGame.prizes.map((prize, index) => (
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

              <div className="jeux-modal-rules">
                <h3 className="rules-title">Règles du jeu</h3>
                <ul className="rules-list">
                  {selectedGame.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="jeux-modal-footer">
              <button 
                type="button"
                className="jeux-modal-cancel" 
                onClick={handleCloseModal}
              >
                Annuler
              </button>
              <button 
                type="button"
                className="jeux-modal-start" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStartGame();
                }}
              >
                <PlayArrow className="start-icon" />
                Commencer le jeu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jeux;
