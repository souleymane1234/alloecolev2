import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const EtudesEtrangerComponent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showBoursePopup, setShowBoursePopup] = useState(false);
  const [createdDossierId, setCreatedDossierId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('access_token'));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    targetCountry: '',
    niveauEtude: '',
    domaineEtude: '',
    etablissementActuel: '',
    moyenne: '',
    diplomeObtenu: '',
    villeSouhaite: '',
    universiteSouhaite: '',
    programmeSouhaite: '',
    niveauSouhaite: '',
    langueMaternelle: '',
    languesEtrangeres: [],
    niveauAnglais: '',
    niveauFrancais: '',
    certificatsLangues: '',
    motivation: '',
    objectifsCarriere: '',
    experienceInternationale: '',
    budgetDisponible: '',
    besoinBourse: false,
    typeBourse: '',
    autresFinancements: '',
    cabinet: '',
    cv: '',
    lettreMotivation: '',
    relevesNotes: '',
    diplomes: '',
    certificatsLanguesFile: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Query pour récupérer le dossier existant
  const { data: existingDossier, isLoading: isLoadingDossier, refetch } = useQuery({
    queryKey: ['foreign-studies-file'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
      }

      const response = await fetch(`${API_BASE_URL}/students/foreign-studies/file`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la récupération du dossier');
      }

      const result = await response.json();
      return result.data;
    },
    enabled: isAuthenticated,
    retry: false
  });

  const steps = [
    { id: 1, title: 'Profil académique', icon: 'ph-graduation-cap' },
    { id: 2, title: 'Destination souhaitée', icon: 'ph-globe' },
    { id: 3, title: 'Langues', icon: 'ph-translate' },
    { id: 4, title: 'Motivation', icon: 'ph-lightbulb' },
    { id: 5, title: 'Financement', icon: 'ph-currency-circle-dollar' },
    { id: 6, title: 'Documents', icon: 'ph-file-text' }
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

  // Mutation pour créer le dossier
  const createDossierMutation = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
      }

      const response = await fetch(`${API_BASE_URL}/students/foreign-studies/file`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du dossier');
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('Dossier créé:', data);
      setCreatedDossierId(data.data?.id || data.id || data.foreignFileId);
      setShowBoursePopup(true);
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      console.error('Erreur:', error);
      if (error.message.includes('authentifié')) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        navigate('/login?redirect=/etudes-etranger');
      } else {
        alert(`Erreur: ${error.message}`);
      }
    }
  });

  // Mutation pour soumettre la candidature de bourse
  const submitBourseMutation = useMutation({
    mutationFn: async (foreignFileId) => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Non authentifié. Veuillez vous connecter.');
      }

      const response = await fetch(`${API_BASE_URL}/students/foreign-studies/applications/free`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          foreignFileId: foreignFileId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la soumission de la candidature');
      }

      return response.json();
    },
    onSuccess: (data) => {
      alert('Votre candidature de bourse a été soumise avec succès !');
      console.log('Candidature soumise:', data);
      setShowBoursePopup(false);
      navigate('/etudes-etranger');
    },
    onError: (error) => {
      console.error('Erreur:', error);
      alert(`Erreur lors de la soumission: ${error.message}`);
      navigate('/etudes-etranger');
    }
  });

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

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale: 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setFormData(prev => ({
        ...prev,
        [name]: base64String
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.niveauEtude) newErrors.niveauEtude = 'Le niveau d\'étude est requis';
        if (!formData.domaineEtude) newErrors.domaineEtude = 'Le domaine d\'étude est requis';
        break;
      case 2:
        if (!formData.targetCountry) newErrors.targetCountry = 'Le pays souhaité est requis';
        if (!formData.niveauSouhaite) newErrors.niveauSouhaite = 'Le niveau souhaité est requis';
        break;
      case 4:
        if (!formData.motivation || formData.motivation.trim().length < 50) {
          newErrors.motivation = 'La motivation doit contenir au moins 50 caractères';
        }
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
      createDossierMutation.mutate(formData);
    }
  };

  const handleSubmitBourse = () => {
    const dossierId = createdDossierId || existingDossier?.id;
    if (dossierId) {
      submitBourseMutation.mutate(dossierId);
    } else {
      alert('Erreur: ID du dossier non trouvé');
      navigate('/etudes-etranger');
    }
  };

  const handleSkipBourse = () => {
    alert('Votre dossier d\'études à l\'étranger a été créé avec succès !');
    setShowBoursePopup(false);
    navigate('/etudes-etranger');
  };

  const handleEditDossier = () => {
    if (existingDossier) {
      setFormData({
        targetCountry: existingDossier.targetCountry || '',
        niveauEtude: existingDossier.niveauEtude || '',
        domaineEtude: existingDossier.domaineEtude || '',
        etablissementActuel: existingDossier.etablissementActuel || '',
        moyenne: existingDossier.moyenne || '',
        diplomeObtenu: existingDossier.diplomeObtenu || '',
        villeSouhaite: existingDossier.villeSouhaite || '',
        universiteSouhaite: existingDossier.universiteSouhaite || '',
        programmeSouhaite: existingDossier.programmeSouhaite || '',
        niveauSouhaite: existingDossier.niveauSouhaite || '',
        langueMaternelle: existingDossier.langueMaternelle || '',
        languesEtrangeres: existingDossier.languesEtrangeres || [],
        niveauAnglais: existingDossier.niveauAnglais || '',
        niveauFrancais: existingDossier.niveauFrancais || '',
        certificatsLangues: existingDossier.certificatsLangues || '',
        motivation: existingDossier.motivation || '',
        objectifsCarriere: existingDossier.objectifsCarriere || '',
        experienceInternationale: existingDossier.experienceInternationale || '',
        budgetDisponible: existingDossier.budgetDisponible || '',
        besoinBourse: existingDossier.besoinBourse || false,
        typeBourse: existingDossier.typeBourse || '',
        autresFinancements: existingDossier.autresFinancements || '',
        cabinet: existingDossier.cabinet || '',
        cv: existingDossier.cv || '',
        lettreMotivation: existingDossier.lettreMotivation || '',
        relevesNotes: existingDossier.relevesNotes || '',
        diplomes: existingDossier.diplomes || '',
        certificatsLanguesFile: existingDossier.certificatsLanguesFile || ''
      });
      setIsEditing(true);
      setCurrentStep(1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
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

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Destination souhaitée</h3>
            <div className="form-row">
              <div className="form-col-half">
                <label className="form-label">Pays souhaité *</label>
                <select
                  className={`form-select ${errors.targetCountry ? 'input-invalid' : ''}`}
                  name="targetCountry"
                  value={formData.targetCountry}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez un pays</option>
                  {paysOptions.map(pays => (
                    <option key={pays} value={pays}>{pays}</option>
                  ))}
                </select>
                {errors.targetCountry && <div className="error-message">{errors.targetCountry}</div>}
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

      case 3:
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

      case 4:
        return (
          <div className="step-content">
            <h3 className="step-title-content">Motivation et objectifs</h3>
            <div className="form-group">
              <label className="form-label">Pourquoi souhaitez-vous étudier à l'étranger ? *</label>
              <textarea
                className={`form-textarea ${errors.motivation ? 'input-invalid' : ''}`}
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows="4"
                placeholder="Décrivez vos motivations pour étudier à l'étranger (minimum 50 caractères)..."
              />
              {errors.motivation && <div className="error-message">{errors.motivation}</div>}
              <div className="char-count">{formData.motivation.length} caractères</div>
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

      case 5:
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
            <div className="form-group">
              <label className="form-label">Cabinet de traitement (optionnel)</label>
              <select
                className="form-select"
                name="cabinet"
                value={formData.cabinet}
                onChange={handleInputChange}
              >
                <option value="">Sélectionnez un cabinet (optionnel)</option>
                <option value="Cabinet A">Cabinet A</option>
                <option value="Cabinet B">Cabinet B</option>
                <option value="Cabinet C">Cabinet C</option>
                <option value="Autre">Autre</option>
              </select>
              <small className="form-text text-muted" style={{ display: 'block', marginTop: '0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>
                Choisissez le cabinet qui doit traiter votre dossier. Ce champ est optionnel.
              </small>
            </div>
          </div>
        );

      case 6:
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
                {formData.cv && <div className="file-uploaded">✓ Fichier téléchargé</div>}
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
                {formData.lettreMotivation && <div className="file-uploaded">✓ Fichier téléchargé</div>}
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
                {formData.relevesNotes && <div className="file-uploaded">✓ Fichier téléchargé</div>}
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
                {formData.diplomes && <div className="file-uploaded">✓ Fichier téléchargé</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Certificats de langues (PDF)</label>
              <input
                type="file"
                className="form-file"
                name="certificatsLanguesFile"
                onChange={handleFileChange}
                accept=".pdf"
              />
              {formData.certificatsLanguesFile && <div className="file-uploaded">✓ Fichier téléchargé</div>}
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

  if (!isAuthenticated) {
    return (
      <div className="etudes-etranger-section">
        <div className="container">
          <div className="auth-guard-card">
            <div className="auth-guard-icon">
              <i className="ph-lock-key"></i>
            </div>
            <h2 className="auth-guard-title">Connectez-vous pour accéder à Études à l'Étranger</h2>
            <p className="auth-guard-text">
              Vous devez être authentifié pour créer ou consulter votre dossier d'études internationales.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/login?redirect=/etudes-etranger')}
            >
              <i className="ph-user-circle"></i>
              Me connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le loading pendant la vérification du dossier
  if (isLoadingDossier) {
    return (
      <div className="etudes-etranger-section">
        <div className="container">
          <div className="text-center">
            <div className="loading-spinner"></div>
            <p>Vérification de votre dossier...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si un dossier existe et qu'on n'est pas en mode édition, afficher la vue du dossier existant
  if (existingDossier && !isEditing) {
    return (
      <>
        <style>{`
          .dossier-existant-section {
            padding: 3rem 0;
            min-height: 100vh;
          }

          .dossier-card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }

          .dossier-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .dossier-icon {
            font-size: 3rem;
            color: #ea580c;
            margin-bottom: 1rem;
          }

          .dossier-title {
            font-size: 2rem;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }

          .dossier-subtitle {
            color: #6b7280;
            margin-bottom: 2rem;
          }

          .dossier-info {
            background: #f8fafc;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 2rem;
          }

          .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .info-item:last-child {
            margin-bottom: 0;
            border-bottom: none;
          }

          .info-label {
            font-weight: 600;
            color: #374151;
          }

          .info-value {
            color: #6b7280;
            text-align: right;
          }

          .dossier-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
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

          .btn-primary {
            background-color: #ea580c;
            color: white;
          }

          .btn-primary:hover {
            background-color: #c2410c;
          }

          .btn-secondary {
            background-color: #6b7280;
            color: white;
          }

          .btn-secondary:hover {
            background-color: #4b5563;
          }

          .btn-primary.loading {
            position: relative;
          }

          .btn-primary.loading::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.6s linear infinite;
            margin-left: 0.5rem;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #ea580c;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .dossier-actions {
              flex-direction: column;
            }
            
            .btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>

        <div className="dossier-existant-section">
          <div className="container">
            <div className="dossier-card">
              <div className="dossier-header">
                <div className="dossier-icon">
                  <i className="ph-graduation-cap"></i>
                </div>
                <h1 className="dossier-title">Dossier Existant</h1>
                <p className="dossier-subtitle">
                  Vous avez déjà un dossier d'études à l'étranger en cours
                </p>
              </div>

              <div className="dossier-info">
                <div className="info-item">
                  <span className="info-label">Destination :</span>
                  <span className="info-value">{existingDossier.targetCountry}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ville souhaitée :</span>
                  <span className="info-value">{existingDossier.villeSouhaite || 'Non spécifiée'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Université souhaitée :</span>
                  <span className="info-value">{existingDossier.universiteSouhaite || 'Non spécifiée'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Programme :</span>
                  <span className="info-value">{existingDossier.programmeSouhaite || 'Non spécifié'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Niveau :</span>
                  <span className="info-value">{existingDossier.niveauSouhaite}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Statut :</span>
                  <span className="info-value" style={{ 
                    color: existingDossier.status === 'BROUILLON' ? '#ea580c' : '#16a34a',
                    fontWeight: '600'
                  }}>
                    {existingDossier.status === 'BROUILLON' ? 'Brouillon' : 'Soumis'}
                  </span>
                </div>
              </div>

              <div className="dossier-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={handleEditDossier}
                >
                  <i className="ph-pencil"></i>
                  Modifier le dossier
                </button>
                <button 
                  className={`btn btn-primary ${submitBourseMutation.isPending ? 'loading' : ''}`}
                  onClick={handleSubmitBourse}
                  disabled={submitBourseMutation.isPending}
                >
                  {submitBourseMutation.isPending ? 'Soumission...' : 'Soumettre ma candidature'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Popup pour la soumission de bourse */}
        {showBoursePopup && (
          <div className="popup-overlay">
            <div className="popup-container">
              <div className="popup-icon">
                <i className="ph-graduation-cap"></i>
              </div>
              <h2 className="popup-title">Félicitations !</h2>
              <div className="popup-content">
                <p>Votre dossier d'études à l'étranger a été créé avec succès !</p>
                <p>Souhaitez-vous maintenant soumettre une candidature pour une bourse d'études ?</p>
                <p><small>Cette candidature vous permettra d'être considéré pour diverses opportunités de financement.</small></p>
              </div>
              <div className="popup-actions">
                <button 
                  type="button" 
                  className="popup-btn popup-btn-secondary"
                  onClick={handleSkipBourse}
                  disabled={submitBourseMutation.isPending}
                >
                  Plus tard
                </button>
                <button 
                  type="button" 
                  className={`popup-btn popup-btn-primary ${submitBourseMutation.isPending ? 'loading' : ''}`}
                  onClick={handleSubmitBourse}
                  disabled={submitBourseMutation.isPending}
                >
                  {submitBourseMutation.isPending ? 'Soumission...' : 'Soumettre ma candidature'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Si aucun dossier n'existe, afficher le formulaire de création normal
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

        .text-center {
          text-align: center;
        }

        .mb-5 {
          margin-bottom: 3rem;
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

        .auth-guard-card {
          max-width: 600px;
          margin: 4rem auto;
          padding: 2.5rem;
          background: white;
          border-radius: 1.25rem;
          text-align: center;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }

        .auth-guard-icon {
          font-size: 3rem;
          color: #ea580c;
          margin-bottom: 1rem;
        }

        .auth-guard-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }

        .auth-guard-text {
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.6;
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

        .char-count {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .file-uploaded {
          color: #16a34a;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
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
          cursor: pointer;
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

        .d-flex {
          display: flex;
        }

        .gap-2 {
          gap: 0.5rem;
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

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: #6b7280;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #4b5563;
        }

        .btn-primary {
          background-color: #ea580c;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #c2410c;
        }

        .btn-primary.loading {
          position: relative;
        }

        .btn-primary.loading::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 0.6s linear infinite;
          margin-left: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .step-counter {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Styles pour le popup */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }

        .popup-container {
          background-color: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-width: 500px;
          width: 100%;
          animation: popup-appear 0.3s ease-out;
        }

        @keyframes popup-appear {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .popup-icon {
          text-align: center;
          margin-bottom: 1rem;
        }

        .popup-icon i {
          font-size: 3rem;
          color: #ea580c;
        }

        .popup-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          text-align: center;
          margin-bottom: 1rem;
        }

        .popup-content {
          color: #6b7280;
          text-align: center;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .popup-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .popup-btn {
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
          min-width: 120px;
          justify-content: center;
        }

        .popup-btn-secondary {
          background-color: #6b7280;
          color: white;
        }

        .popup-btn-secondary:hover {
          background-color: #4b5563;
        }

        .popup-btn-primary {
          background-color: #ea580c;
          color: white;
        }

        .popup-btn-primary:hover {
          background-color: #c2410c;
        }

        .popup-btn-primary.loading {
          position: relative;
        }

        .popup-btn-primary.loading::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 0.6s linear infinite;
          margin-left: 0.5rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #ea580c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
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

          .d-flex {
            flex-direction: column;
            width: 100%;
          }

          .popup-actions {
            flex-direction: column;
          }
          
          .popup-btn {
            width: 100%;
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
                      disabled={createDossierMutation.isPending}
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
                      disabled={createDossierMutation.isPending}
                    >
                      Suivant
                      <i className="ph-arrow-right"></i>
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className={`btn btn-primary ${createDossierMutation.isPending ? 'loading' : ''}`}
                      disabled={createDossierMutation.isPending}
                    >
                      {createDossierMutation.isPending ? (
                        'Création en cours...'
                      ) : (
                        <>
                          <i className="ph-check"></i>
                          Créer le dossier
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popup pour la soumission de bourse */}
      {showBoursePopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-icon">
              <i className="ph-graduation-cap"></i>
            </div>
            <h2 className="popup-title">Félicitations !</h2>
            <div className="popup-content">
              <p>Votre dossier d'études à l'étranger a été créé avec succès !</p>
              <p>Souhaitez-vous maintenant soumettre une candidature pour une bourse d'études ?</p>
              <p><small>Cette candidature vous permettra d'être considéré pour diverses opportunités de financement.</small></p>
            </div>
            <div className="popup-actions">
              <button 
                type="button" 
                className="popup-btn popup-btn-secondary"
                onClick={handleSkipBourse}
                disabled={submitBourseMutation.isPending}
              >
                Plus tard
              </button>
              <button 
                type="button" 
                className={`popup-btn popup-btn-primary ${submitBourseMutation.isPending ? 'loading' : ''}`}
                onClick={handleSubmitBourse}
                disabled={submitBourseMutation.isPending}
              >
                {submitBourseMutation.isPending ? 'Soumission...' : 'Soumettre ma candidature'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EtudesEtrangerComponent;