import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Close, 
  CheckCircle,
  Celebration
} from '@mui/icons-material';
import './SuccessModal.css';

const SuccessModal = ({ onClose, title, message, onAction, actionLabel }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    onClose();
  };

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <button className="success-modal-close" onClick={onClose}>
          <Close />
        </button>
        
        <div className="success-modal-content">
          <div className="success-modal-icon">
            <CheckCircle />
          </div>
          <h2 className="success-modal-title">{title || 'Succès !'}</h2>
          <p className="success-modal-description">
            {message || 'Votre demande a été soumise avec succès.'}
          </p>
          
          <div className="success-modal-features">
            <div className="success-modal-feature">
              <Celebration className="success-feature-icon" />
              <span>Demande enregistrée</span>
            </div>
          </div>

          <button className="success-modal-cta" onClick={handleAction}>
            {actionLabel || 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;