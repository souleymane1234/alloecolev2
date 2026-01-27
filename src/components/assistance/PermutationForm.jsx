import React, { useState } from 'react';
import './PermutationForm.css';

const PermutationForm = ({ initialData, userProfile, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    departureSchool: initialData?.departureSchool || initialData?.ecoleActuelle || '',
    desiredInstitution: initialData?.desiredInstitution || initialData?.ecoleSouhaitee || '',
    desiredGeographicZone: initialData?.desiredGeographicZone || initialData?.zoneGeographique || '',
    reason: initialData?.reason || initialData?.motif || '',
    permutationRole: initialData?.permutationRole || 'ELEVE',
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
    'Attestation de scolarité'
  ];

  const permutationRoles = [
    { value: 'ELEVE', label: 'Élève' },
    { value: 'ENSEIGNANT', label: 'Enseignant' },
    { value: 'PARENT', label: 'Parent' },
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
    
    if (!formData.departureSchool) newErrors.departureSchool = 'Requis';
    if (!formData.desiredInstitution) newErrors.desiredInstitution = 'Requis';
    if (!formData.desiredGeographicZone) newErrors.desiredGeographicZone = 'Requis';
    if (!formData.reason) newErrors.reason = 'Requis';
    if (!formData.permutationRole) newErrors.permutationRole = 'Requis';
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
    <form className="permutation-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="section-title">École actuelle</h3>
        <div className="form-group">
          <label>Établissement de départ *</label>
          <input
            type="text"
            value={formData.departureSchool}
            onChange={(e) => handleChange('departureSchool', e.target.value)}
            placeholder="Ex: Lycée Moderne de Cocody"
            className={errors.departureSchool ? 'error' : ''}
          />
          {errors.departureSchool && <span className="error-text">{errors.departureSchool}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">École souhaitée</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Établissement souhaité *</label>
            <input
              type="text"
              value={formData.desiredInstitution}
              onChange={(e) => handleChange('desiredInstitution', e.target.value)}
              placeholder="Ex: Lycée Sainte Marie"
              className={errors.desiredInstitution ? 'error' : ''}
            />
            {errors.desiredInstitution && <span className="error-text">{errors.desiredInstitution}</span>}
          </div>

          <div className="form-group">
            <label>Zone géographique souhaitée *</label>
            <input
              type="text"
              value={formData.desiredGeographicZone}
              onChange={(e) => handleChange('desiredGeographicZone', e.target.value)}
              placeholder="Ex: Abidjan - Cocody"
              className={errors.desiredGeographicZone ? 'error' : ''}
            />
            {errors.desiredGeographicZone && <span className="error-text">{errors.desiredGeographicZone}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Informations sur la permutation</h3>
        <div className="form-group">
          <label>Rôle dans la permutation *</label>
          <select
            value={formData.permutationRole}
            onChange={(e) => handleChange('permutationRole', e.target.value)}
            className={errors.permutationRole ? 'error' : ''}
          >
            <option value="">Sélectionner</option>
            {permutationRoles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          {errors.permutationRole && <span className="error-text">{errors.permutationRole}</span>}
        </div>

        <div className="form-group">
          <label>Motif de la permutation *</label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            rows={4}
            placeholder="Ex: Rapprochement familial, Proximité du domicile..."
            className={errors.reason ? 'error' : ''}
          />
          {errors.reason && <span className="error-text">{errors.reason}</span>}
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

export default PermutationForm;