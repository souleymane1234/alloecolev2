import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayArrow, 
  EmojiEvents
} from '@mui/icons-material';
import './QuizBanner.css';

const QuizBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="quiz-banner">
      <div className="quiz-banner-content">
        <div className="quiz-banner-left">
          <div className="quiz-banner-badge">
            <EmojiEvents className="badge-icon" />
            <span>Nouveau</span>
          </div>
          <h2 className="quiz-banner-title">
            Testez vos connaissances et <span className="highlight">gagnez des lots</span>
          </h2>
          <button 
            className="quiz-banner-cta"
            onClick={() => navigate('/quiz')}
          >
            <PlayArrow className="cta-icon" />
            Jouer maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizBanner;
