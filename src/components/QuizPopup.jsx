import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Close, 
  PlayArrow, 
  EmojiEvents, 
  LocalOffer,
  Timer
} from '@mui/icons-material';
import './QuizPopup.css';

const QuizPopup = ({ onClose }) => {
  const navigate = useNavigate();

  const handlePlay = () => {
    onClose();
    navigate('/quiz');
  };

  return (
    <div className="quiz-popup-overlay" onClick={onClose}>
      <div className="quiz-popup" onClick={(e) => e.stopPropagation()}>
        <button className="quiz-popup-close" onClick={onClose}>
          <Close />
        </button>
        
        <div className="quiz-popup-content">
          <div className="popup-icon">
            <EmojiEvents />
          </div>
          <h2 className="popup-title">Nouveaux Quiz Disponibles !</h2>
          <p className="popup-description">
            Testez vos connaissances et gagnez des lots exceptionnels. 
            Rejoignez des milliers de joueurs dès maintenant !
          </p>
          
          <div className="popup-features">
            <div className="popup-feature">
              <LocalOffer className="feature-icon" />
              <span>Lots à gagner</span>
            </div>
            <div className="popup-feature">
              <Timer className="feature-icon" />
              <span>Quiz interactifs</span>
            </div>
          </div>

          <button className="popup-cta" onClick={handlePlay}>
            <PlayArrow className="cta-icon" />
            Jouer maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPopup;
