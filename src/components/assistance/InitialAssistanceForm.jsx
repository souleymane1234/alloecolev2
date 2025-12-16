import React, { useState, useEffect } from 'react';
import './InitialAssistanceForm.css';

const InitialAssistanceForm = ({ onComplete, initialData = null, userProfile = null }) => {
  // S'assurer que initialData est un objet
  const safeInitialData = initialData || {};
  
  // Utiliser les données du profil si disponibles, sinon initialData
  const getInitialValue = (field, profileField = null) => {
    if (userProfile && profileField) {
      // Essayer plusieurs variantes de noms de champs
      const value = userProfile[profileField] || 
                    userProfile[profileField.toLowerCase()] ||
                    userProfile[field] ||
                    '';
      return value || safeInitialData[field] || '';
    }
    return safeInitialData[field] || '';
  };

  const [isMyself, setIsMyself] = useState(safeInitialData.isMyself !== undefined ? safeInitialData.isMyself : true); // Par défaut "Moi-même"
  const [formData, setFormData] = useState({
    // Informations du demandeur - pré-remplies depuis le profil
    demandeurNom: getInitialValue('demandeurNom', 'lastName') || getInitialValue('demandeurNom', 'nom'),
    demandeurPrenoms: getInitialValue('demandeurPrenoms', 'firstName') || getInitialValue('demandeurPrenoms', 'prenom'),
    demandeurTelephone: getInitialValue('demandeurTelephone', 'phone') || getInitialValue('demandeurTelephone', 'telephone') || getInitialValue('demandeurTelephone', 'mobile'),
    demandeurEmail: getInitialValue('demandeurEmail', 'email'),
    demandeurPays: getInitialValue('demandeurPays', 'country') || getInitialValue('demandeurPays', 'pays'),
    demandeurStatut: getInitialValue('demandeurStatut', 'status') || getInitialValue('demandeurStatut', 'statut'),
    
    // Informations de la personne à charge
    chargeNom: safeInitialData.chargeNom || '',
    chargePrenoms: safeInitialData.chargePrenoms || '',
    chargeTelephone: safeInitialData.chargeTelephone || '',
    chargeEmail: safeInitialData.chargeEmail || '',
    chargePays: safeInitialData.chargePays || '',
    chargeStatut: safeInitialData.chargeStatut || '',
    chargeNationalite: safeInitialData.chargeNationalite || getInitialValue('chargeNationalite', 'nationality') || getInitialValue('chargeNationalite', 'nationalite'),
    chargeNiveauEtude: safeInitialData.chargeNiveauEtude || getInitialValue('chargeNiveauEtude', 'academicLevel') || getInitialValue('chargeNiveauEtude', 'niveauEtude'),
    chargeDernierDiplome: safeInitialData.chargeDernierDiplome || '',
    
    // Choix de la catégorie
    assistanceType: safeInitialData.assistanceType || '',
  });

  const [errors, setErrors] = useState({});

  const statuts = ['Étudiant', 'Élève', 'Parent', 'Enseignant', 'Autre'];
  const pays = ['Côte d\'Ivoire', 'France', 'Canada', 'Belgique', 'Suisse', 'Autre'];
  const assistanceTypes = [
    'Bourse d\'études',
    'Etudes à l\'Étranger',
    'Orientation scolaire',
    'Permutation',
    'Demande de documents'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMyselfChange = (checked) => {
    setIsMyself(checked);
    if (checked) {
      // Copier les données du demandeur vers la personne à charge
      setFormData(prev => ({
        ...prev,
        chargeNom: prev.demandeurNom,
        chargePrenoms: prev.demandeurPrenoms,
        chargeTelephone: prev.demandeurTelephone,
        chargeEmail: prev.demandeurEmail,
        chargePays: prev.demandeurPays,
        chargeStatut: prev.demandeurStatut,
        chargeNationalite: userProfile?.nationality || userProfile?.nationalite || prev.chargeNationalite,
        chargeNiveauEtude: userProfile?.academicLevel || userProfile?.niveauEtude || prev.chargeNiveauEtude,
      }));
    } else {
      // Réinitialiser les champs de la personne à charge
      setFormData(prev => ({
        ...prev,
        chargeNom: '',
        chargePrenoms: '',
        chargeTelephone: '',
        chargeEmail: '',
        chargePays: '',
        chargeStatut: '',
        chargeNationalite: '',
        chargeNiveauEtude: '',
        chargeDernierDiplome: '',
      }));
    }
  };

  // Auto-remplir si "Moi-même" est coché au chargement
  useEffect(() => {
    if (isMyself && userProfile) {
      setFormData(prev => ({
        ...prev,
        chargeNom: prev.demandeurNom,
        chargePrenoms: prev.demandeurPrenoms,
        chargeTelephone: prev.demandeurTelephone,
        chargeEmail: prev.demandeurEmail,
        chargePays: prev.demandeurPays,
        chargeStatut: prev.demandeurStatut,
        chargeNationalite: userProfile?.nationality || userProfile?.nationalite || prev.chargeNationalite,
        chargeNiveauEtude: userProfile?.academicLevel || userProfile?.niveauEtude || prev.chargeNiveauEtude,
      }));
    }
  }, [isMyself, userProfile]);

  const validate = () => {
    const newErrors = {};
    
    // Validation demandeur
    if (!formData.demandeurNom) newErrors.demandeurNom = 'Requis';
    if (!formData.demandeurPrenoms) newErrors.demandeurPrenoms = 'Requis';
    if (!formData.demandeurTelephone) newErrors.demandeurTelephone = 'Requis';
    if (!formData.demandeurEmail) newErrors.demandeurEmail = 'Requis';
    if (!formData.demandeurPays) newErrors.demandeurPays = 'Requis';
    if (!formData.demandeurStatut) newErrors.demandeurStatut = 'Requis';
    
    // Validation personne à charge (si pas "Moi-même")
    if (!isMyself) {
      if (!formData.chargeNom) newErrors.chargeNom = 'Requis';
      if (!formData.chargePrenoms) newErrors.chargePrenoms = 'Requis';
      if (!formData.chargeTelephone) newErrors.chargeTelephone = 'Requis';
      if (!formData.chargeEmail) newErrors.chargeEmail = 'Requis';
      if (!formData.chargePays) newErrors.chargePays = 'Requis';
      if (!formData.chargeStatut) newErrors.chargeStatut = 'Requis';
      if (!formData.chargeNationalite) newErrors.chargeNationalite = 'Requis';
      if (!formData.chargeNiveauEtude) newErrors.chargeNiveauEtude = 'Requis';
    }
    
    // Validation type d'assistance
    if (!formData.assistanceType) newErrors.assistanceType = 'Veuillez sélectionner un type d\'assistance';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onComplete({
        ...formData,
        isMyself,
      });
    }
  };

  return (
    <form className="initial-assistance-form" onSubmit={handleSubmit}>
      {/* Informations du demandeur */}
      <div className="form-section">
        <h3 className="section-title">Informations du demandeur</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom *</label>
            <input
              type="text"
              value={formData.demandeurNom}
              onChange={(e) => handleChange('demandeurNom', e.target.value)}
              className={errors.demandeurNom ? 'error' : ''}
            />
            {errors.demandeurNom && <span className="error-text">{errors.demandeurNom}</span>}
          </div>
          
          <div className="form-group">
            <label>Prénoms *</label>
            <input
              type="text"
              value={formData.demandeurPrenoms}
              onChange={(e) => handleChange('demandeurPrenoms', e.target.value)}
              className={errors.demandeurPrenoms ? 'error' : ''}
            />
            {errors.demandeurPrenoms && <span className="error-text">{errors.demandeurPrenoms}</span>}
          </div>
          
          <div className="form-group">
            <label>Téléphone *</label>
            <input
              type="tel"
              value={formData.demandeurTelephone}
              onChange={(e) => handleChange('demandeurTelephone', e.target.value)}
              className={errors.demandeurTelephone ? 'error' : ''}
            />
            {errors.demandeurTelephone && <span className="error-text">{errors.demandeurTelephone}</span>}
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.demandeurEmail}
              onChange={(e) => handleChange('demandeurEmail', e.target.value)}
              className={errors.demandeurEmail ? 'error' : ''}
            />
            {errors.demandeurEmail && <span className="error-text">{errors.demandeurEmail}</span>}
          </div>
          
          <div className="form-group">
            <label>Pays de résidence *</label>
            <select
              value={formData.demandeurPays}
              onChange={(e) => handleChange('demandeurPays', e.target.value)}
              className={errors.demandeurPays ? 'error' : ''}
            >
              <option value="">Sélectionner</option>
              {pays.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.demandeurPays && <span className="error-text">{errors.demandeurPays}</span>}
          </div>
          
          <div className="form-group">
            <label>Statut *</label>
            <select
              value={formData.demandeurStatut}
              onChange={(e) => handleChange('demandeurStatut', e.target.value)}
              className={errors.demandeurStatut ? 'error' : ''}
            >
              <option value="">Sélectionner</option>
              {statuts.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.demandeurStatut && <span className="error-text">{errors.demandeurStatut}</span>}
          </div>
        </div>
      </div>

      {/* Informations de la personne à charge */}
      <div className="form-section">
        <h3 className="section-title">Informations de la personne à charge</h3>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isMyself}
              onChange={(e) => handleMyselfChange(e.target.checked)}
            />
            <span>Moi-même</span>
          </label>
        </div>
        
        <div className={`form-grid ${isMyself ? 'disabled' : ''}`}>
          <div className="form-group">
            <label>Nom *</label>
            <input
              type="text"
              value={formData.chargeNom}
              onChange={(e) => handleChange('chargeNom', e.target.value)}
              disabled={isMyself}
              className={errors.chargeNom ? 'error' : ''}
            />
            {errors.chargeNom && <span className="error-text">{errors.chargeNom}</span>}
          </div>
          
          <div className="form-group">
            <label>Prénoms *</label>
            <input
              type="text"
              value={formData.chargePrenoms}
              onChange={(e) => handleChange('chargePrenoms', e.target.value)}
              disabled={isMyself}
              className={errors.chargePrenoms ? 'error' : ''}
            />
            {errors.chargePrenoms && <span className="error-text">{errors.chargePrenoms}</span>}
          </div>
          
          <div className="form-group">
            <label>Téléphone *</label>
            <input
              type="tel"
              value={formData.chargeTelephone}
              onChange={(e) => handleChange('chargeTelephone', e.target.value)}
              disabled={isMyself}
              className={errors.chargeTelephone ? 'error' : ''}
            />
            {errors.chargeTelephone && <span className="error-text">{errors.chargeTelephone}</span>}
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.chargeEmail}
              onChange={(e) => handleChange('chargeEmail', e.target.value)}
              disabled={isMyself}
              className={errors.chargeEmail ? 'error' : ''}
            />
            {errors.chargeEmail && <span className="error-text">{errors.chargeEmail}</span>}
          </div>
          
          <div className="form-group">
            <label>Pays de résidence *</label>
            <select
              value={formData.chargePays}
              onChange={(e) => handleChange('chargePays', e.target.value)}
              disabled={isMyself}
              className={errors.chargePays ? 'error' : ''}
            >
              <option value="">Sélectionner</option>
              {pays.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.chargePays && <span className="error-text">{errors.chargePays}</span>}
          </div>
          
          <div className="form-group">
            <label>Statut *</label>
            <select
              value={formData.chargeStatut}
              onChange={(e) => handleChange('chargeStatut', e.target.value)}
              disabled={isMyself}
              className={errors.chargeStatut ? 'error' : ''}
            >
              <option value="">Sélectionner</option>
              {statuts.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.chargeStatut && <span className="error-text">{errors.chargeStatut}</span>}
          </div>
          
          <div className="form-group">
            <label>Nationalité *</label>
            <input
              type="text"
              value={formData.chargeNationalite}
              onChange={(e) => handleChange('chargeNationalite', e.target.value)}
              disabled={isMyself}
              className={errors.chargeNationalite ? 'error' : ''}
            />
            {errors.chargeNationalite && <span className="error-text">{errors.chargeNationalite}</span>}
          </div>
          
          <div className="form-group">
            <label>Niveau d'étude *</label>
            <input
              type="text"
              value={formData.chargeNiveauEtude}
              onChange={(e) => handleChange('chargeNiveauEtude', e.target.value)}
              disabled={isMyself}
              placeholder="Ex: Terminale, Licence 2, Master 1..."
              className={errors.chargeNiveauEtude ? 'error' : ''}
            />
            {errors.chargeNiveauEtude && <span className="error-text">{errors.chargeNiveauEtude}</span>}
          </div>
          
          <div className="form-group">
            <label>Dernier diplôme obtenu *</label>
            <input
              type="text"
              value={formData.chargeDernierDiplome}
              onChange={(e) => handleChange('chargeDernierDiplome', e.target.value)}
              disabled={isMyself}
              placeholder="Ex: BAC, Licence, Master..."
              className={errors.chargeDernierDiplome ? 'error' : ''}
            />
            {errors.chargeDernierDiplome && <span className="error-text">{errors.chargeDernierDiplome}</span>}
          </div>
        </div>
      </div>

      {/* Choix de la catégorie d'assistance */}
      <div className="form-section">
        <h3 className="section-title">Choix de la catégorie d'Assistance</h3>
        <div className="form-group">
          <label>Type d'assistance demandée *</label>
          <select
            value={formData.assistanceType}
            onChange={(e) => handleChange('assistanceType', e.target.value)}
            className={errors.assistanceType ? 'error' : ''}
          >
            <option value="">Sélectionner un type</option>
            {assistanceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.assistanceType && <span className="error-text">{errors.assistanceType}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Continuer
        </button>
      </div>
    </form>
  );
};

export default InitialAssistanceForm;
