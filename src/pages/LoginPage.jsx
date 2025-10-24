import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
  }, [countdown, step]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  const handleSendOTP = () => {
    if (phoneNumber.length < 10) {
      setError('Veuillez entrer un numéro valide');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setCountdown(60);
      setIsResendDisabled(true);
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length === 6) {
      handleVerifyOTP(pastedData);
    }
  };

  const handleVerifyOTP = (otpCode) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (otpCode === '123456') {
        setStep('success');
        navigate('/', { state: { isConnect: true } });
        // setTimeout(() => {
        //   alert('Connexion réussie!');
        // }, 2000);
      } else {
        setError('Code incorrect. Veuillez réessayer.');
        setOtp(['', '', '', '', '', '']);
        otpRefs[0].current?.focus();
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    setCountdown(60);
    setIsResendDisabled(true);
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Connexion via ${provider} réussie!`);
    }, 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .auth-page {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .auth-page::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 20s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(50px, 50px) rotate(180deg); }
        }
        
        .auth-container {
          display: flex;
          width: 100%;
          max-width: 1200px;
          margin: auto;
          padding: 2rem;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .auth-left {
          flex: 1;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 2rem;
          font-weight: 800;
        }
        
        .auth-logo i { font-size: 3rem; }
        
        .auth-hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        
        .auth-hero p {
          font-size: 1.25rem;
          opacity: 0.9;
          line-height: 1.6;
        }
        
        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
        }
        
        .feature-icon {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .feature-text h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .feature-text p {
          font-size: 0.875rem;
          opacity: 0.8;
        }
        
        .auth-right { flex: 0 0 450px; }
        
        .auth-card {
          background: white;
          border-radius: 1.5rem;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(234, 88, 12, 0.2);
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .auth-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .auth-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }
        
        .phone-input-container {
          display: flex;
          gap: 0.5rem;
        }
        
        .country-code {
          flex: 0 0 80px;
          padding: 0.875rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          background: #f9fafb;
          text-align: center;
        }
        
        .phone-input {
          flex: 1;
          padding: 0.875rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: all 0.3s;
        }
        
        .phone-input:focus {
          outline: none;
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }
        
        .otp-container {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin: 1rem 0;
        }
        
        .otp-input {
          width: 55px;
          height: 60px;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s;
        }
        
        .otp-input:focus {
          outline: none;
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }
        
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(234, 88, 12, 0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .resend-section {
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .resend-btn {
          color: #ea580c;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          text-decoration: underline;
          padding: 0;
        }
        
        .resend-btn:disabled {
          color: #9ca3af;
          cursor: not-allowed;
          text-decoration: none;
        }
        
        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: #9ca3af;
          font-size: 0.875rem;
        }
        
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }
        
        .social-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .social-btn {
          flex: 1;
          padding: 0.875rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .social-btn:hover {
          border-color: #ea580c;
          background: #fefaf8;
        }
        
        .social-btn.google { color: #ea4335; }
        .social-btn.facebook { color: #1877f2; }
        
        .success-animation {
          text-align: center;
          padding: 2rem 0;
        }
        
        .success-checkmark {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleIn 0.5s ease-out;
        }
        
        .success-checkmark i {
          font-size: 3rem;
          color: white;
        }
        
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        .success-text h3 {
          font-size: 1.5rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .success-text p { color: #6b7280; }
        
        .back-btn {
          background: none;
          border: none;
          color: #ea580c;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding: 0.5rem;
        }
        
        .back-btn:hover { text-decoration: underline; }
        
        @media (max-width: 968px) {
          .auth-container {
            flex-direction: column;
            gap: 2rem;
          }
          .auth-left { text-align: center; }
          .auth-hero h1 { font-size: 2.5rem; }
          .auth-right {
            flex: 0 0 auto;
            width: 100%;
            max-width: 450px;
          }
        }
        
        @media (max-width: 640px) {
          .auth-container { padding: 1rem; }
          .auth-card { padding: 2rem 1.5rem; }
          .auth-hero h1 { font-size: 2rem; }
          .otp-input {
            width: 45px;
            height: 50px;
            font-size: 1.25rem;
          }
          .social-buttons { flex-direction: column; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-left">
            <div className="auth-logo">
              <i className="ph-graduation-cap-fill"></i>
              <span>EduConnect</span>
            </div>
            <div className="auth-hero">
              <h1>Bienvenue dans l'écosystème éducatif</h1>
              <p>Connectez-vous pour accéder à des milliers d'établissements et ressources éducatives.</p>
            </div>
            <div className="auth-features">
              <div className="feature-item">
                <div className="feature-icon"><i className="ph-shield-check"></i></div>
                <div className="feature-text">
                  <h3>Sécurisé</h3>
                  <p>Authentification sécurisée par OTP</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><i className="ph-lightning"></i></div>
                <div className="feature-text">
                  <h3>Rapide</h3>
                  <p>Connexion en quelques secondes</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><i className="ph-devices"></i></div>
                <div className="feature-text">
                  <h3>Multi-plateformes</h3>
                  <p>Accessible partout, sur tous vos appareils</p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-card">
              {step === 'phone' && (
                <>
                  <div className="auth-header">
                    <h2>Connexion</h2>
                    <p>Entrez votre numéro de téléphone pour continuer</p>
                  </div>
                  <div className="auth-form">
                    {error && (
                      <div className="error-message">
                        <i className="ph-warning-circle"></i>
                        {error}
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Numéro de téléphone</label>
                      <div className="phone-input-container">
                        <div className="country-code">+225</div>
                        <input
                          type="tel"
                          className="phone-input"
                          placeholder="01 02 03 04 05"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <button className="submit-btn" onClick={handleSendOTP} disabled={loading || phoneNumber.length < 10}>
                      {loading ? (
                        <><div className="btn-spinner"></div>Envoi en cours...</>
                      ) : (
                        <><i className="ph-paper-plane-tilt"></i>Recevoir le code</>
                      )}
                    </button>
                    <div className="divider">OU</div>
                    <div className="social-buttons">
                      <button className="social-btn google" onClick={() => handleSocialLogin('Google')} disabled={loading}>
                        <i className="ph-google-logo"></i>Google
                      </button>
                      <button className="social-btn facebook" onClick={() => handleSocialLogin('Facebook')} disabled={loading}>
                        <i className="ph-facebook-logo"></i>Facebook
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 'otp' && (
                <>
                  <button className="back-btn" onClick={() => setStep('phone')}>
                    <i className="ph-arrow-left"></i>Retour
                  </button>
                  <div className="auth-header">
                    <h2>Vérification</h2>
                    <p>Code envoyé au +225 {phoneNumber}</p>
                  </div>
                  <div className="auth-form">
                    {error && (
                      <div className="error-message">
                        <i className="ph-warning-circle"></i>
                        {error}
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Entrez le code à 6 chiffres</label>
                      <div className="otp-container">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={otpRefs[index]}
                            type="text"
                            className="otp-input"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                            maxLength={1}
                            inputMode="numeric"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="resend-section">
                      {isResendDisabled ? (
                        <span>Renvoyer le code dans {countdown}s</span>
                      ) : (
                        <button className="resend-btn" onClick={handleResendOTP}>
                          Renvoyer le code
                        </button>
                      )}
                    </div>
                    {loading && (
                      <button className="submit-btn" disabled>
                        <div className="btn-spinner"></div>Vérification...
                      </button>
                    )}
                  </div>
                </>
              )}

              {step === 'success' && (
                <div className="success-animation">
                  <div className="success-checkmark">
                    <i className="ph-check-bold"></i>
                  </div>
                  <div className="success-text">
                    <h3>Authentification réussie !</h3>
                    <p>Redirection en cours...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;