import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';

const ContactAlloEcoleService = ({ permutationId, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    motif: '',
    message: '',
    urgence: 'normale',
    prefereContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi de données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      // Reset form after success
      setTimeout(() => {
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          motif: '',
          message: '',
          urgence: 'normale',
          prefereContact: 'email'
        });
        setSubmitStatus(null);
        if (onClose) onClose();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: <Users size={24} />,
      title: "Accompagnement personnalisé",
      description: "Notre équipe vous guide dans toutes vos démarches administratives"
    },
    {
      icon: <Phone size={24} />,
      title: "Support téléphonique",
      description: "Disponible du lundi au vendredi de 8h à 18h"
    },
    {
      icon: <Mail size={24} />,
      title: "Suivi par email",
      description: "Recevez des mises à jour régulières sur votre dossier"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Chat en direct",
      description: "Obtenez des réponses immédiates à vos questions"
    }
  ];

  return (
    <>
      <style jsx>{`
        .contact-service-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .contact-service-modal {
          background: white;
          border-radius: 1rem;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .modal-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .modal-content {
          padding: 2rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .service-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s;
        }

        .service-card:hover {
          background: #fff7ed;
          border-color: #f97316;
          transform: translateY(-2px);
        }

        .service-icon {
          color: #f97316;
          margin-bottom: 1rem;
        }

        .service-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .service-description {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .contact-form {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 2rem;
        }

        .form-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s;
          background: white;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .submit-section {
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .submit-button {
          background: #f97316;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .submit-button:hover:not(:disabled) {
          background: #ea580c;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-message {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .status-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .contact-info {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .contact-info-title {
          font-weight: 600;
          color: #1e40af;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .contact-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .contact-method {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 0.5rem;
          border: 1px solid #dbeafe;
        }

        .contact-method-icon {
          color: #f97316;
        }

        .contact-method-text {
          font-size: 0.875rem;
          color: #374151;
        }

        .contact-method-value {
          font-weight: 600;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .contact-service-modal {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }

          .modal-content {
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .contact-methods {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="contact-service-overlay">
        <div className="contact-service-modal">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          
          <div className="modal-header">
            <h2 className="modal-title">Contactez le Service AlloEcole</h2>
            <p className="modal-subtitle">
              Notre équipe vous accompagne dans vos démarches de permutation
            </p>
          </div>

          <div className="modal-content">
            {/* Services disponibles */}
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">
                    {service.icon}
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              ))}
            </div>

            {/* Informations de contact */}
            <div className="contact-info">
              <h3 className="contact-info-title">
                <Clock size={20} />
                Nos coordonnées
              </h3>
              <div className="contact-methods">
                <div className="contact-method">
                  <Phone className="contact-method-icon" size={20} />
                  <div className="contact-method-text">
                    <div>Téléphone</div>
                    <div className="contact-method-value">+225 20 30 40 50</div>
                  </div>
                </div>
                <div className="contact-method">
                  <Mail className="contact-method-icon" size={20} />
                  <div className="contact-method-text">
                    <div>Email</div>
                    <div className="contact-method-value">service@alloecole.ci</div>
                  </div>
                </div>
                <div className="contact-method">
                  <MapPin className="contact-method-icon" size={20} />
                  <div className="contact-method-text">
                    <div>Adresse</div>
                    <div className="contact-method-value">Abidjan, Côte d'Ivoire</div>
                  </div>
                </div>
                <div className="contact-method">
                  <Clock className="contact-method-icon" size={20} />
                  <div className="contact-method-text">
                    <div>Horaires</div>
                    <div className="contact-method-value">Lun-Ven: 8h-18h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="contact-form">
              <h3 className="form-title">
                <MessageCircle size={20} />
                Envoyez-nous un message
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Nom complet <span style={{color: '#ef4444'}}>*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Email <span style={{color: '#ef4444'}}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Motif de contact</label>
                    <select
                      name="motif"
                      value={formData.motif}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Sélectionnez un motif</option>
                      <option value="permutation">Demande de permutation</option>
                      <option value="accompagnement">Accompagnement administratif</option>
                      <option value="information">Demande d'information</option>
                      <option value="probleme">Résolution de problème</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Niveau d'urgence</label>
                    <select
                      name="urgence"
                      value={formData.urgence}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="normale">Normale</option>
                      <option value="urgente">Urgente</option>
                      <option value="tres-urgente">Très urgente</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Préférence de contact</label>
                    <select
                      name="prefereContact"
                      value={formData.prefereContact}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="email">Email</option>
                      <option value="telephone">Téléphone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Message <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Décrivez votre demande en détail..."
                    required
                  />
                </div>

                <div className="submit-section">
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid #ffffff',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <MessageCircle size={20} />
                        Envoyer le message
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="status-message status-success">
                      <CheckCircle size={20} />
                      Votre message a été envoyé avec succès ! Notre équipe vous contactera sous 24h.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="status-message status-error">
                      <AlertCircle size={20} />
                      Une erreur est survenue. Veuillez réessayer ou nous appeler directement.
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default ContactAlloEcoleService;
