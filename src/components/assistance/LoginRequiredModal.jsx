import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Close, 
  Login,
  Security,
  SupportAgent
} from '@mui/icons-material';
import './LoginRequiredModal.css';

const LoginRequiredModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login', { 
      state: { 
        from: '/assistance-demande',
        message: 'Veuillez vous connecter pour accéder à la demande d\'assistance'
      } 
    });
  };

  return (
    <div className="login-required-modal-overlay">
      <div className="login-required-modal">
        <button className="login-required-modal-close" onClick={onClose}>
          <Close />
        </button>
        
        <div className="login-required-modal-content">
          <div className="login-required-popup-icon">
            <Security />
          </div>
          <h2 className="login-required-popup-title">Connexion requise</h2>
          <p className="login-required-popup-description">
            Vous devez être connecté pour accéder à la demande d'assistance. 
            Connectez-vous pour continuer et bénéficier de nos services.
          </p>
          
          <div className="login-required-popup-features">
            <div className="login-required-popup-feature">
              <SupportAgent className="login-required-feature-icon" />
              <span>Assistance personnalisée</span>
            </div>
            <div className="login-required-popup-feature">
              <Security className="login-required-feature-icon" />
              <span>Sécurisé et rapide</span>
            </div>
          </div>

          <button className="login-required-popup-cta" onClick={handleLogin}>
            <Login className="login-required-cta-icon" />
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;