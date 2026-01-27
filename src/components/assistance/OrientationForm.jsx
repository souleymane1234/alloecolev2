import React, { useState } from 'react';
import './OrientationForm.css';

const OrientationForm = ({ initialData, userProfile, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    orientationLevel: initialData?.orientationLevel || '',
    desiredSchool: initialData?.desiredSchool || initialData?.ecoleSouhaitee || '',
    desiredField: initialData?.desiredField || initialData?.domaineSouhaite || '',
    lastAverage: initialData?.lastAverage || initialData?.moyenne || '',
    strengths: initialData?.strengths || initialData?.pointsForts || '',
    motivations: initialData?.motivations || initialData?.motivation || '',
    offerType: initialData?.offerType || 'SIMULATEUR',
    certification: initialData?.certification || false,
  });

  const [errors, setErrors] = useState({});

  const orientationLevels = [
    { value: 'ORIENTATION_6E', label: 'Orientation en 6ème' },
    { value: 'ORIENTATION_5E', label: 'Orientation en 5ème' },
    { value: 'ORIENTATION_POST_BAC', label: 'Orientation Post-Bac' },
  ];

  const offerTypes = [
    { value: 'SIMULATEUR', label: 'Simulateur d\'orientation' },
    { value: 'CONSEILLER', label: 'Conseiller' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.orientationLevel) newErrors.orientationLevel = 'Requis';
    if (!formData.desiredSchool) newErrors.desiredSchool = 'Requis';
    if (!formData.desiredField) newErrors.desiredField = 'Requis';
    if (!formData.lastAverage) newErrors.lastAverage = 'Requis';
    if (!formData.strengths) newErrors.strengths = 'Requis';
    if (!formData.motivations) newErrors.motivations = 'Requis';
    if (!formData.offerType) newErrors.offerType = 'Requis';
    if (!formData.certification) newErrors.certification = 'Vous devez certifier que les informations sont exactes';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onComplete(formData);
    }
  };

  return (
    <form className="orientation-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="section-title">Niveau d'orientation</h3>
        <div className="form-group">
          <label>Niveau d'orientation *</label>
          <select
            value={formData.orientationLevel}
            onChange={(e) => handleChange('orientationLevel', e.target.value)}
            className={errors.orientationLevel ? 'error' : ''}
          >
            <option value="">Sélectionner</option>
            {orientationLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
          {errors.orientationLevel && <span className="error-text">{errors.orientationLevel}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">École et domaine souhaités</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>École souhaitée *</label>
            <input
              type="text"
              value={formData.desiredSchool}
              onChange={(e) => handleChange('desiredSchool', e.target.value)}
              placeholder="Ex: Lycée Sainte Marie"
              className={errors.desiredSchool ? 'error' : ''}
            />
            {errors.desiredSchool && <span className="error-text">{errors.desiredSchool}</span>}
          </div>

          <div className="form-group">
            <label>Domaine souhaité *</label>
            <input
              type="text"
              value={formData.desiredField}
              onChange={(e) => handleChange('desiredField', e.target.value)}
              placeholder="Ex: Sciences, Commerce..."
              className={errors.desiredField ? 'error' : ''}
            />
            {errors.desiredField && <span className="error-text">{errors.desiredField}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Informations académiques</h3>
          <div className="form-group">
            <label>Dernière moyenne *</label>
            <input
              type="text"
              value={formData.lastAverage}
              onChange={(e) => handleChange('lastAverage', e.target.value)}
              placeholder="Ex: 15.5/20"
              className={errors.lastAverage ? 'error' : ''}
            />
            {errors.lastAverage && <span className="error-text">{errors.lastAverage}</span>}
        </div>

        <div className="form-group">
          <label>Points forts *</label>
          <textarea
            value={formData.strengths}
            onChange={(e) => handleChange('strengths', e.target.value)}
            rows={3}
            placeholder="Ex: Mathématiques, Physique, Sciences..."
            className={errors.strengths ? 'error' : ''}
          />
          {errors.strengths && <span className="error-text">{errors.strengths}</span>}
        </div>

        <div className="form-group">
          <label>Motivations *</label>
          <textarea
            value={formData.motivations}
            onChange={(e) => handleChange('motivations', e.target.value)}
            rows={4}
            placeholder="Ex: Passion pour les sciences et recherche..."
            className={errors.motivations ? 'error' : ''}
          />
          {errors.motivations && <span className="error-text">{errors.motivations}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Type d'offre</h3>
        <div className="form-group">
          <label>Type d'offre souhaitée *</label>
          <select
            value={formData.offerType}
            onChange={(e) => handleChange('offerType', e.target.value)}
            className={errors.offerType ? 'error' : ''}
          >
            <option value="">Sélectionner</option>
            {offerTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.offerType && <span className="error-text">{errors.offerType}</span>}
        </div>
      </div>

      <div className="form-section">
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.certification}
              onChange={(e) => handleChange('certification', e.target.checked)}
              className={errors.certification ? 'error' : ''}
            />
            <span>JE CERTIFIE QUE LES INFORMATIONS FOURNIES SONT EXACTES *</span>
          </label>
          {errors.certification && <span className="error-text">{errors.certification}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Retour
        </button>
        <button type="submit" className="btn btn-primary">
          Enregistrer la demande
        </button>
      </div>
    </form>
  );
};

export default OrientationForm;