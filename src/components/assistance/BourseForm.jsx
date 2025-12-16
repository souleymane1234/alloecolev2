import React, { useState } from 'react';
import './BourseForm.css';

const BourseForm = ({ initialData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    location: initialData?.location || '', // 'CI' ou 'Hors CI'
    typeBourse: initialData?.typeBourse || '', // 'Secours financiers', 'Bourses d\'études', 'Bourses de coopération'
    niveauEtude: initialData?.niveauEtude || '',
    domaineEtude: initialData?.domaineEtude || '',
    paysCible: initialData?.paysCible || '',
    ecoleCible: initialData?.ecoleCible || '',
    objectif: initialData?.objectif || '',
    documents: initialData?.documents || [],
    certification: initialData?.certification || false,
  });

  const [errors, setErrors] = useState({});
  const [documentType, setDocumentType] = useState('');

  const documentTypes = [
    'Relevés de notes',
    'Lettre de motivation',
    'Carte d\'identité',
    'Certificat de Résidence'
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
    if (!formData.typeBourse) newErrors.typeBourse = 'Requis';
    if (!formData.niveauEtude) newErrors.niveauEtude = 'Requis';
    if (!formData.domaineEtude) newErrors.domaineEtude = 'Requis';
    if (!formData.paysCible) newErrors.paysCible = 'Requis';
    if (!formData.ecoleCible) newErrors.ecoleCible = 'Requis';
    if (!formData.objectif) newErrors.objectif = 'Requis';
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

  const getBourseTypes = () => {
    if (formData.location === 'CI') {
      return ['Secours financiers', 'Bourses d\'études'];
    } else if (formData.location === 'Hors CI') {
      return ['Secours financiers', 'Bourses d\'études', 'Bourses de coopération'];
    }
    return [];
  };

  return (
    <form className="bourse-form" onSubmit={handleSubmit}>
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

      {formData.location && (
        <div className="form-section">
          <h3 className="section-title">Type de bourse</h3>
          <div className="form-group">
            <label>Type *</label>
            <select
              value={formData.typeBourse}
              onChange={(e) => handleChange('typeBourse', e.target.value)}
              className={errors.typeBourse ? 'error' : ''}
            >
              <option value="">Sélectionner</option>
              {getBourseTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.typeBourse && <span className="error-text">{errors.typeBourse}</span>}
          </div>
        </div>
      )}

      <div className="form-section">
        <h3 className="section-title">Informations académiques</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Niveau d'étude actuel *</label>
            <input
              type="text"
              value={formData.niveauEtude}
              onChange={(e) => handleChange('niveauEtude', e.target.value)}
              placeholder="Ex: Terminale, Licence 2..."
              className={errors.niveauEtude ? 'error' : ''}
            />
            {errors.niveauEtude && <span className="error-text">{errors.niveauEtude}</span>}
          </div>

          <div className="form-group">
            <label>Domaine d'étude *</label>
            <input
              type="text"
              value={formData.domaineEtude}
              onChange={(e) => handleChange('domaineEtude', e.target.value)}
              placeholder="Ex: Sciences, Commerce..."
              className={errors.domaineEtude ? 'error' : ''}
            />
            {errors.domaineEtude && <span className="error-text">{errors.domaineEtude}</span>}
          </div>

          <div className="form-group">
            <label>Pays ciblé *</label>
            <input
              type="text"
              value={formData.paysCible}
              onChange={(e) => handleChange('paysCible', e.target.value)}
              className={errors.paysCible ? 'error' : ''}
            />
            {errors.paysCible && <span className="error-text">{errors.paysCible}</span>}
          </div>

          <div className="form-group">
            <label>École ciblée *</label>
            <input
              type="text"
              value={formData.ecoleCible}
              onChange={(e) => handleChange('ecoleCible', e.target.value)}
              className={errors.ecoleCible ? 'error' : ''}
            />
            {errors.ecoleCible && <span className="error-text">{errors.ecoleCible}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Objectif de la demande *</label>
          <textarea
            value={formData.objectif}
            onChange={(e) => handleChange('objectif', e.target.value)}
            rows={4}
            placeholder="Décrivez votre objectif..."
            className={errors.objectif ? 'error' : ''}
          />
          {errors.objectif && <span className="error-text">{errors.objectif}</span>}
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

export default BourseForm;
