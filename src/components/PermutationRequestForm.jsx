import React, { useState } from 'react';
import { User, GraduationCap, MapPin, Calendar, FileText, Send, AlertCircle, CheckCircle } from 'lucide-react';

const PermutationRequestForm = () => {
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    
    // Informations académiques actuelles
    niveauEtude: '',
    filiere: '',
    etablissementActuel: '',
    villeActuelle: '',
    anneeAcademique: '',
    
    // Établissement souhaité
    etablissementSouhaite: '',
    villeSouhaitee: '',
    filiereSouhaitee: '',
    niveauSouhaite: '',
    
    // Motifs et documents
    motifPermutation: '',
    documents: [],
    commentaires: '',
    
    // Préférences de contact
    prefereContact: 'email',
    disponibilite: '',
    
    // Consentement
    consentement: false,
    consentementDonnees: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi de données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        dateNaissance: '',
        niveauEtude: '',
        filiere: '',
        etablissementActuel: '',
        villeActuelle: '',
        anneeAcademique: '',
        etablissementSouhaite: '',
        villeSouhaitee: '',
        filiereSouhaitee: '',
        niveauSouhaite: '',
        motifPermutation: '',
        documents: [],
        commentaires: '',
        prefereContact: 'email',
        disponibilite: '',
        consentement: false,
        consentementDonnees: false
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const niveauxEtude = [
    '6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale',
    'BTS 1', 'BTS 2', 'Licence 1', 'Licence 2', 'Licence 3',
    'Master 1', 'Master 2', 'Doctorat'
  ];

  const filieres = [
    'Lycée', 'Collège', 'Génie Civil', 'Génie Informatique', 'Génie Électrique', 'Génie Mécanique',
    'Commerce', 'Gestion', 'Comptabilité', 'Marketing', 'Communication',
    'Droit', 'Médecine', 'Pharmacie', 'Sciences', 'Lettres', 'Langues'
  ];

  return (
    <>
      <style>{`
        .permutation-form-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .form-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .form-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .form-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .form-container {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .form-tabs {
          display: flex;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-tab {
          flex: 1;
          padding: 1.5rem;
          text-align: center;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s;
          position: relative;
        }

        .form-tab.active {
          color: #f97316;
          background: white;
        }

        .form-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #f97316;
        }

        .form-content {
          padding: 3rem;
        }

        .form-section {
          margin-bottom: 3rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 2rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f97316;
        }

        .section-title svg {
          margin-right: 0.75rem;
          color: #f97316;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
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

        .file-upload {
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .file-upload:hover {
          border-color: #f97316;
          background: #fff7ed;
        }

        .file-upload.dragover {
          border-color: #f97316;
          background: #fff7ed;
        }

        .file-list {
          margin-top: 1rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .file-name {
          font-weight: 500;
          color: #374151;
        }

        .file-remove {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 0.25rem;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .checkbox-group {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .checkbox {
          margin-right: 0.75rem;
          margin-top: 0.25rem;
        }

        .checkbox-label {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .submit-section {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .submit-button {
          background: #f97316;
          color: white;
          border: none;
          padding: 1rem 3rem;
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

        .required {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .form-tabs {
            flex-direction: column;
          }

          .form-content {
            padding: 2rem 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <section className="permutation-form-section">
        <div className="container">
          <div className="form-header">
            <h1 className="form-title">Demande de Permutation</h1>
            {/* <p className="form-subtitle">
              Remplissez ce formulaire pour faire une demande de permutation d'établissement. 
              Notre équipe vous accompagnera dans vos démarches auprès des autorités compétentes.
            </p> */}
          </div>

          <div className="form-container">
            <div className="form-tabs">
              <button className="form-tab active">Informations Personnelles</button>
              <button className="form-tab">Situation Actuelle</button>
              <button className="form-tab">Établissement Souhaité</button>
              <button className="form-tab">Motifs</button>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
              {/* Informations Personnelles */}
              <div className="form-section">
                <h2 className="section-title">
                  <User size={24} />
                  Informations Personnelles
                </h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Nom <span className="required">*</span>
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
                      Prénom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="required">*</span>
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
                    <label className="form-label">
                      Téléphone <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Date de naissance <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Situation Académique Actuelle */}
              <div className="form-section">
                <h2 className="section-title">
                  <GraduationCap size={24} />
                  Situation Académique Actuelle
                </h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Niveau d'étude <span className="required">*</span>
                    </label>
                    <select
                      name="niveauEtude"
                      value={formData.niveauEtude}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionnez votre niveau</option>
                      {niveauxEtude.map(niveau => (
                        <option key={niveau} value={niveau}>{niveau}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Filière <span className="required">*</span>
                    </label>
                    <select
                      name="filiere"
                      value={formData.filiere}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionnez votre filière</option>
                      {filieres.map(filiere => (
                        <option key={filiere} value={filiere}>{filiere}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Établissement actuel <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="etablissementActuel"
                      value={formData.etablissementActuel}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nom de votre établissement actuel"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Ville actuelle <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="villeActuelle"
                      value={formData.villeActuelle}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ville où vous étudiez actuellement"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Année académique <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="anneeAcademique"
                      value={formData.anneeAcademique}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ex: 2024-2025"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Établissement Souhaité */}
              <div className="form-section">
                <h2 className="section-title">
                  <MapPin size={24} />
                  Établissement Souhaité
                </h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Établissement souhaité <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="etablissementSouhaite"
                      value={formData.etablissementSouhaite}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Nom de l'établissement souhaité"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Ville souhaitée <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="villeSouhaitee"
                      value={formData.villeSouhaitee}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ville où vous souhaitez étudier"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Filière souhaitée
                    </label>
                    <select
                      name="filiereSouhaitee"
                      value={formData.filiereSouhaitee}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Même filière</option>
                      {filieres.map(filiere => (
                        <option key={filiere} value={filiere}>{filiere}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Niveau souhaité
                    </label>
                    <select
                      name="niveauSouhaite"
                      value={formData.niveauSouhaite}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Même niveau</option>
                      {niveauxEtude.map(niveau => (
                        <option key={niveau} value={niveau}>{niveau}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Motifs et Documents */}
              <div className="form-section">
                <h2 className="section-title">
                  <FileText size={24} />
                   Motifs
                </h2>
                <div className="form-group">
                  <label className="form-label">
                    Motif de la permutation <span className="required">*</span>
                  </label>
                  <textarea
                    name="motifPermutation"
                    value={formData.motifPermutation}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Expliquez les raisons de votre demande de permutation..."
                    required
                  />
                </div>
              </div>

              {/* Consentements */}
              <div className="form-section">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="consentement"
                    checked={formData.consentement}
                    onChange={handleInputChange}
                    className="checkbox"
                    required
                  />
                  <label className="checkbox-label">
                    J'accepte que mes informations soient partagées avec d'autres utilisateurs 
                    pour faciliter les échanges de permutation. <span className="required">*</span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="consentementDonnees"
                    checked={formData.consentementDonnees}
                    onChange={handleInputChange}
                    className="checkbox"
                    required
                  />
                  <label className="checkbox-label">
                    J'accepte le traitement de mes données personnelles conformément à la 
                    politique de confidentialité d'AlloEcole. <span className="required">*</span>
                  </label>
                </div>
              </div>

              {/* Submit Section */}
              <div className="submit-section">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting || !formData.consentement || !formData.consentementDonnees}
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
                      Publication en cours...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Publiez ma demande
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="status-message status-success">
                    <CheckCircle size={20} />
                    Votre demande a été envoyée avec succès ! Notre équipe vous contactera sous 48h.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="status-message status-error">
                    <AlertCircle size={20} />
                    Une erreur est survenue. Veuillez réessayer ou nous contacter.
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default PermutationRequestForm;
