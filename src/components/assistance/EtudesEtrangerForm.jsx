import React, { useState } from 'react';
import './EtudesEtrangerForm.css';

const EtudesEtrangerForm = ({ initialData, userProfile, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    location: initialData?.location || '', // 'CI' ou 'Hors CI'
    targetCountry: initialData?.targetCountry || initialData?.paysCible || '',
    targetCity: initialData?.targetCity || initialData?.villeSouhaite || '',
    targetSchool: initialData?.targetSchool || initialData?.universiteSouhaite || initialData?.ecoleCible || '',
    targetLevel: initialData?.targetLevel || initialData?.niveauSouhaite || initialData?.niveauEtude || '',
    studyField: initialData?.studyField || initialData?.domaineEtude || '',
    budgetEstimate: initialData?.budgetEstimate || initialData?.budgetDisponible || '',
    assistanceHousing: initialData?.assistanceHousing || false,
    assistanceEnrollment: initialData?.assistanceEnrollment || false,
    documents: initialData?.documents || [],
    certification: initialData?.certification || false,
  });

  const [errors, setErrors] = useState({});
  const [documentType, setDocumentType] = useState('');

  const documentTypes = [
    'Relevés de notes',
    'Lettre de motivation',
    'Carte d\'identité',
    'Certificat de Résidence',
    'CV',
    'Diplômes'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddDocument = () => {
    if (documentType && !formData.documents.includes(documentType)) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, documentType]
      }));
      setDocumentType('');
    }
  };

  const handleRemoveDocument = (doc) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d !== doc)
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.location) newErrors.location = 'Requis';
    if (!formData.targetCountry) newErrors.targetCountry = 'Requis';
    if (!formData.targetCity) newErrors.targetCity = 'Requis';
    if (!formData.targetSchool) newErrors.targetSchool = 'Requis';
    if (!formData.targetLevel) newErrors.targetLevel = 'Requis';
    if (!formData.studyField) newErrors.studyField = 'Requis';
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
    <form className="etudes-etranger-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="section-title">Localisation</h3>
        <div className="form-group">
          <label>Zone géographique *</label>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className={errors.location ? 'error' : ''}
          >
            <option value="">Sélectionner</option>
            <option value="CI">En Côte d'Ivoire</option>
            <option value="Hors CI">Hors Côte d'Ivoire</option>
          </select>
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Destination souhaitée</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Pays ciblé *</label>
            <input
              type="text"
              value={formData.targetCountry}
              onChange={(e) => handleChange('targetCountry', e.target.value)}
              placeholder="Ex: France, Canada..."
              className={errors.targetCountry ? 'error' : ''}
            />
            {errors.targetCountry && <span className="error-text">{errors.targetCountry}</span>}
          </div>

          <div className="form-group">
            <label>Ville ciblée *</label>
            <input
              type="text"
              value={formData.targetCity}
              onChange={(e) => handleChange('targetCity', e.target.value)}
              placeholder="Ex: Paris, Montréal..."
              className={errors.targetCity ? 'error' : ''}
            />
            {errors.targetCity && <span className="error-text">{errors.targetCity}</span>}
          </div>

          <div className="form-group">
            <label>École/Université ciblée *</label>
            <input
              type="text"
              value={formData.targetSchool}
              onChange={(e) => handleChange('targetSchool', e.target.value)}
              placeholder="Ex: Sorbonne Université..."
              className={errors.targetSchool ? 'error' : ''}
            />
            {errors.targetSchool && <span className="error-text">{errors.targetSchool}</span>}
          </div>

          <div className="form-group">
            <label>Niveau souhaité *</label>
            <input
              type="text"
              value={formData.targetLevel}
              onChange={(e) => handleChange('targetLevel', e.target.value)}
              placeholder="Ex: Master 1, Licence 2..."
              className={errors.targetLevel ? 'error' : ''}
            />
            {errors.targetLevel && <span className="error-text">{errors.targetLevel}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Informations académiques</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Domaine d'étude *</label>
            <input
              type="text"
              value={formData.studyField}
              onChange={(e) => handleChange('studyField', e.target.value)}
              placeholder="Ex: Informatique, Médecine..."
              className={errors.studyField ? 'error' : ''}
            />
            {errors.studyField && <span className="error-text">{errors.studyField}</span>}
          </div>

          <div className="form-group">
            <label>Budget estimé</label>
            <input
              type="text"
              value={formData.budgetEstimate}
              onChange={(e) => handleChange('budgetEstimate', e.target.value)}
              placeholder="Ex: 6000 €/an"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Assistance</h3>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.assistanceHousing}
              onChange={(e) => handleChange('assistanceHousing', e.target.checked)}
            />
            <span>Besoin d'assistance pour le logement</span>
          </label>
        </div>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.assistanceEnrollment}
              onChange={(e) => handleChange('assistanceEnrollment', e.target.checked)}
            />
            <span>Besoin d'assistance pour l'inscription</span>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Documents à joindre</h3>
        <div className="document-upload">
          <div className="document-selector">
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="">Sélectionner un document</option>
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddDocument}
              disabled={!documentType}
            >
              Ajouter
            </button>
          </div>

          {formData.documents.length > 0 && (
            <div className="document-list">
              {formData.documents.map((doc, index) => (
                <div key={index} className="document-item">
                  <span>{doc}</span>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveDocument(doc)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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

export default EtudesEtrangerForm;