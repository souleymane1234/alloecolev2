import React, { useState } from 'react';

const EtudesEtrangerComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    nationalite: '',
    
    // Informations académiques
    niveauEtude: '',
    domaineEtude: '',
    etablissementActuel: '',
    moyenne: '',
    diplomeObtenu: '',
    
    // Destination souhaitée
    paysSouhaite: '',
    villeSouhaite: '',
    universiteSouhaite: '',
    programmeSouhaite: '',
    niveauSouhaite: '',
    
    // Langues
    langueMaternelle: '',
    languesEtrangeres: [],
    niveauAnglais: '',
    niveauFrancais: '',
    certificatsLangues: '',
    
    // Motivation et objectifs
    motivation: '',
    objectifsCarriere: '',
    experienceInternationale: '',
    
    // Situation financière
    budgetDisponible: '',
    besoinBourse: false,
    typeBourse: '',
    autresFinancements: '',
    
    // Documents
    cv: null,
    lettreMotivation: null,
    relevesNotes: null,
    diplomes: null,
    certificatsLangues: null
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: 'ph-user' },
    { id: 2, title: 'Profil académique', icon: 'ph-graduation-cap' },
    { id: 3, title: 'Destination souhaitée', icon: 'ph-globe' },
    { id: 4, title: 'Langues', icon: 'ph-translate' },
    { id: 5, title: 'Motivation', icon: 'ph-lightbulb' },
    { id: 6, title: 'Financement', icon: 'ph-currency-circle-dollar' },
    { id: 7, title: 'Documents', icon: 'ph-file-text' }
  ];

  const paysOptions = [
    'France', 'Canada', 'États-Unis', 'Royaume-Uni', 'Allemagne', 'Suisse', 
    'Belgique', 'Pays-Bas', 'Suède', 'Norvège', 'Danemark', 'Finlande',
    'Espagne', 'Italie', 'Portugal', 'Australie', 'Nouvelle-Zélande', 'Japon',
    'Corée du Sud', 'Singapour', 'Autre'
  ];

  const niveauxEtude = [
    'Baccalauréat', 'Licence', 'Master', 'Doctorat', 'Post-doctorat'
  ];

  const domainesEtude = [
    'Sciences', 'Ingénierie', 'Médecine', 'Droit', 'Économie', 'Commerce',
    'Arts', 'Lettres', 'Sciences sociales', 'Informatique', 'Autre'
  ];

  const niveauxLangue = [
    'Débutant (A1)', 'Élémentaire (A2)', 'Intermédiaire (B1)', 
    'Intermédiaire supérieur (B2)', 'Avancé (C1)', 'Maîtrise (C2)'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value) 
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.nom) newErrors.nom = 'Le nom est requis';
        if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
        if (!formData.email) newErrors.email = 'L\'email est requis';
        if (!formData.telephone) newErrors.telephone = 'Le téléphone est requis';
        break;
      case 2:
        if (!formData.niveauEtude) newErrors.niveauEtude = 'Le niveau d\'étude est requis';
        if (!formData.domaineEtude) newErrors.domaineEtude = 'Le domaine d\'étude est requis';
        break;
      case 3:
        if (!formData.paysSouhaite) newErrors.paysSouhaite = 'Le pays souhaité est requis';
        if (!formData.niveauSouhaite) newErrors.niveauSouhaite = 'Le niveau souhaité est requis';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      console.log('Form submitted:', formData);
      alert('Votre dossier d\'études à l\'étranger a été créé avec succès !');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Informations personnelles</h3>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className={`form-input ${errors.nom ? 'input-invalid' : ''}`}
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                />
                {errors.nom && <div className="error-message">{errors.nom}</div>}
              </div>
              <div className="form-col-half">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  className={`form-input ${errors.prenom ? 'input-invalid' : ''}`}
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                />
                {errors.prenom && <div className="error-message">{errors.prenom}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'input-invalid' : ''}`}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              <div className="form-col-half">
                <label className="form-label">Téléphone *</label>
                <input
                  type="tel"
                  className={`form-input ${errors.telephone ? 'input-invalid' : ''}`}
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                />
                {errors.telephone && <div className="error-message">{errors.telephone}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Date de naissance</label>
                <input
                  type="date"
                  className="form-input"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-col-half">
                <label className="form-label">Nationalité</label>
                <input
                  type="text"
                  className="form-input"
                  name="nationalite"
                  value={formData.nationalite}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Profil académique</h3>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Niveau d'étude actuel *</label>
                <select
                  className={`form-select ${errors.niveauEtude ? 'input-invalid' : ''}`}
                  name="niveauEtude"
                  value={formData.niveauEtude}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez votre niveau</option>
                  {niveauxEtude.map(niveau => (
                    <option key={niveau} value={niveau}>{niveau}</option>
                  ))}
                </select>
                {errors.niveauEtude && <div className="error-message">{errors.niveauEtude}</div>}
              </div>
              <div className="form-col-half">
                <label className="form-label">Domaine d'étude *</label>
                <select
                  className={`form-select ${errors.domaineEtude ? 'input-invalid' : ''}`}
                  name="domaineEtude"
                  value={formData.domaineEtude}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez votre domaine</option>
                  {domainesEtude.map(domaine => (
                    <option key={domaine} value={domaine}>{domaine}</option>
                  ))}
                </select>
                {errors.domaineEtude && <div className="error-message">{errors.domaineEtude}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Établissement actuel</label>
                <input
                  type="text"
                  className="form-input"
                  name="etablissementActuel"
                  value={formData.etablissementActuel}
                  onChange={handleInputChange}
                  placeholder="Nom de votre université/école"
                />
              </div>
              <div className="form-col-half">
                <label className="form-label">Moyenne générale</label>
                <input
                  type="text"
                  className="form-input"
                  name="moyenne"
                  value={formData.moyenne}
                  onChange={handleInputChange}
                  placeholder="Ex: 15.5/20 ou 3.8/4.0"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Diplôme(s) obtenu(s)</label>
              <textarea
                className="form-textarea"
                name="diplomeObtenu"
                value={formData.diplomeObtenu}
                onChange={handleInputChange}
                rows="3"
                placeholder="Listez vos diplômes avec les années d'obtention"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Destination souhaitée</h3>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Pays souhaité *</label>
                <select
                  className={`form-select ${errors.paysSouhaite ? 'input-invalid' : ''}`}
                  name="paysSouhaite"
                  value={formData.paysSouhaite}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez un pays</option>
                  {paysOptions.map(pays => (
                    <option key={pays} value={pays}>{pays}</option>
                  ))}
                </select>
                {errors.paysSouhaite && <div className="error-message">{errors.paysSouhaite}</div>}
              </div>
              <div className="form-col-half">
                <label className="form-label">Ville souhaitée</label>
                <input
                  type="text"
                  className="form-input"
                  name="villeSouhaite"
                  value={formData.villeSouhaite}
                  onChange={handleInputChange}
                  placeholder="Ex: Paris, Londres, Toronto"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Université souhaitée</label>
                <input
                  type="text"
                  className="form-input"
                  name="universiteSouhaite"
                  value={formData.universiteSouhaite}
                  onChange={handleInputChange}
                  placeholder="Nom de l'université"
                />
              </div>
              <div className="form-col-half">
                <label className="form-label">Programme souhaité</label>
                <input
                  type="text"
                  className="form-input"
                  name="programmeSouhaite"
                  value={formData.programmeSouhaite}
                  onChange={handleInputChange}
                  placeholder="Ex: Master en Informatique"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Niveau souhaité *</label>
              <select
                className={`form-select ${errors.niveauSouhaite ? 'input-invalid' : ''}`}
                name="niveauSouhaite"
                value={formData.niveauSouhaite}
                onChange={handleInputChange}
              >
                <option value="">Sélectionnez le niveau souhaité</option>
                {niveauxEtude.map(niveau => (
                  <option key={niveau} value={niveau}>{niveau}</option>
                ))}
              </select>
              {errors.niveauSouhaite && <div className="error-message">{errors.niveauSouhaite}</div>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Compétences linguistiques</h3>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Langue maternelle</label>
                <input
                  type="text"
                  className="form-input"
                  name="langueMaternelle"
                  value={formData.langueMaternelle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-col-half">
                <label className="form-label">Niveau d'anglais</label>
                <select
                  className="form-select"
                  name="niveauAnglais"
                  value={formData.niveauAnglais}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez votre niveau</option>
                  {niveauxLangue.map(niveau => (
                    <option key={niveau} value={niveau}>{niveau}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Niveau de français</label>
                <select
                  className="form-select"
                  name="niveauFrancais"
                  value={formData.niveauFrancais}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez votre niveau</option>
                  {niveauxLangue.map(niveau => (
                    <option key={niveau} value={niveau}>{niveau}</option>
                  ))}
                </select>
              </div>
              <div className="form-col-half">
                <label className="form-label">Certificats de langues</label>
                <input
                  type="text"
                  className="form-input"
                  name="certificatsLangues"
                  value={formData.certificatsLangues}
                  onChange={handleInputChange}
                  placeholder="Ex: TOEFL, IELTS, DELF"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Autres langues étrangères</label>
              <div className="checkbox-grid">
                {['Espagnol', 'Allemand', 'Italien', 'Chinois', 'Japonais', 'Arabe'].map(langue => (
                  <div key={langue} className="checkbox-item">
                    <input
                      className="checkbox-input"
                      type="checkbox"
                      id={langue}
                      checked={formData.languesEtrangeres.includes(langue)}
                      onChange={() => handleArrayChange('languesEtrangeres', langue)}
                    />
                    <label className="checkbox-label" htmlFor={langue}>
                      {langue}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Motivation et objectifs</h3>
            <div className="form-group">
              <label className="form-label">Pourquoi souhaitez-vous étudier à l'étranger ? *</label>
              <textarea
                className="form-textarea"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows="4"
                placeholder="Décrivez vos motivations pour étudier à l'étranger..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Objectifs de carrière</label>
              <textarea
                className="form-textarea"
                name="objectifsCarriere"
                value={formData.objectifsCarriere}
                onChange={handleInputChange}
                rows="3"
                placeholder="Quels sont vos objectifs professionnels ?"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expérience internationale</label>
              <textarea
                className="form-textarea"
                name="experienceInternationale"
                value={formData.experienceInternationale}
                onChange={handleInputChange}
                rows="3"
                placeholder="Avez-vous déjà voyagé ou étudié à l'étranger ?"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Situation financière</h3>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Budget disponible (par an)</label>
                <select
                  className="form-select"
                  name="budgetDisponible"
                  value={formData.budgetDisponible}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez votre budget</option>
                  <option value="< 5000€">Moins de 5 000€</option>
                  <option value="5000-10000€">5 000€ - 10 000€</option>
                  <option value="10000-20000€">10 000€ - 20 000€</option>
                  <option value="20000-30000€">20 000€ - 30 000€</option>
                  <option value="> 30000€">Plus de 30 000€</option>
                </select>
              </div>
              <div className="form-col-half">
                <label className="form-label">Avez-vous besoin d'une bourse ?</label>
                <div className="checkbox-item">
                  <input
                    className="checkbox-input"
                    type="checkbox"
                    name="besoinBourse"
                    id="besoinBourse"
                    checked={formData.besoinBourse}
                    onChange={handleInputChange}
                  />
                  <label className="checkbox-label" htmlFor="besoinBourse">
                    Oui, je recherche une bourse
                  </label>
                </div>
              </div>
            </div>
            {formData.besoinBourse && (
              <div className="form-row">
                <div className="form-col-half">
                  <label className="form-label">Type de bourse recherchée</label>
                  <select
                    className="form-select"
                    name="typeBourse"
                    value={formData.typeBourse}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionnez le type</option>
                    <option value="Bourse d'excellence">Bourse d'excellence</option>
                    <option value="Bourse de mérite">Bourse de mérite</option>
                    <option value="Bourse sociale">Bourse sociale</option>
                    <option value="Bourse de recherche">Bourse de recherche</option>
                    <option value="Toute bourse disponible">Toute bourse disponible</option>
                  </select>
                </div>
                <div className="form-col-half">
                  <label className="form-label">Autres financements</label>
                  <input
                    type="text"
                    className="form-input"
                    name="autresFinancements"
                    value={formData.autresFinancements}
                    onChange={handleInputChange}
                    placeholder="Prêt étudiant, famille, etc."
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Documents à joindre</h3>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">CV (PDF)</label>
                <input
                  type="file"
                  className="form-file"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </div>
              <div className="form-col-half">
                <label className="form-label">Lettre de motivation (PDF)</label>
                <input
                  type="file"
                  className="form-file"
                  name="lettreMotivation"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Relevés de notes (PDF)</label>
                <input
                  type="file"
                  className="form-file"
                  name="relevesNotes"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </div>
              <div className="form-col-half">
                <label className="form-label">Diplômes (PDF)</label>
                <input
                  type="file"
                  className="form-file"
                  name="diplomes"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Certificats de langues (PDF)</label>
              <input
                type="file"
                className="form-file"
                name="certificatsLangues"
                onChange={handleFileChange}
                accept=".pdf"
              />
            </div>
            <div className="alert-info">
              <i className="ph-info"></i>
              <strong>Note :</strong> Tous les documents doivent être au format PDF. La taille maximale par fichier est de 5MB.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
        
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
        }

        .etudes-etranger-section {
          padding: 3rem 0;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .progress-container {
          margin-bottom: 3rem;
        }

        .progress {
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background-color: #ea580c;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          margin-top: 0.5rem;
          color: #6b7280;
          font-weight: 600;
        }

        .steps-navigation {
          margin-bottom: 2rem;
        }

        .steps-navigation .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .step-item {
          padding: 1rem;
          background-color: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .step-item:hover {
          border-color: #ea580c;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .step-item.active {
          border-color: #ea580c;
          background-color: #fff7ed;
        }

        .step-item.current {
          background-color: #ea580c;
          color: white;
        }

        .step-item.current .step-icon i {
          color: white;
        }

        .step-icon {
          margin-bottom: 0.5rem;
        }

        .step-icon i {
          font-size: 2rem;
          color: #ea580c;
        }

        .step-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: inherit;
        }

        .form-container {
          background-color: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .step-content {
          margin-bottom: 2rem;
        }

        .step-title-content {
          font-size: 1.75rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 3px solid #ea580c;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-col-half {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .form-input,
        .form-select,
        .form-textarea,
        .form-file {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus,
        .form-file:focus {
          outline: none;
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .input-invalid {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkbox-input {
          width: 1rem;
          height: 1rem;
          accent-color: #ea580c;
        }

        .checkbox-label {
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
        }

        .alert-info {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .alert-info i {
          color: #2563eb;
          margin-top: 0.125rem;
        }

        .alert-info strong {
          color: #1e40af;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary {
          background-color: #6b7280;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #4b5563;
        }

        .btn-primary {
          background-color: #ea580c;
          color: white;
        }

        .btn-primary:hover {
          background-color: #c2410c;
        }

        .btn-primary:disabled {
          background-color: #d1d5db;
          cursor: not-allowed;
        }

        .step-counter {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 0.5rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .form-container {
            padding: 1rem;
          }
          
          .steps-navigation .form-row {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .step-item {
            padding: 0.75rem 0.5rem;
          }
          
          .step-title {
            font-size: 0.7rem;
          }
          
          .step-icon i {
            font-size: 1.5rem;
          }
          
          .form-actions {
            flex-direction: column;
            gap: 1rem;
          }
          
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      
      <div className="etudes-etranger-section">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="section-title">Études à l'Étranger</h1>
            <p className="section-subtitle">
              Créez votre dossier d'études à l'étranger en quelques étapes simples
            </p>
          </div>

          <div className="progress-container">
            <div className="progress">
              <div 
                className="progress-bar" 
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Étape {currentStep} sur {steps.length}
            </div>
          </div>

          <div className="steps-navigation">
            <div className="form-row">
              {steps.map(step => (
                <div 
                  key={step.id}
                  className={`step-item ${currentStep === step.id ? 'current' : currentStep > step.id ? 'active' : ''}`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className="step-icon">
                    <i className={step.icon}></i>
                  </div>
                  <div className="step-title">{step.title}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              <div className="form-actions">
                <div className="step-counter">
                  Étape {currentStep} sur {steps.length}
                </div>
                
                <div className="d-flex gap-2">
                  {currentStep > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      <i className="ph-arrow-left"></i>
                      Précédent
                    </button>
                  )}
                  
                  {currentStep < steps.length ? (
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Suivant
                      <i className="ph-arrow-right"></i>
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      <i className="ph-check"></i>
                      Créer le dossier
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EtudesEtrangerComponent;