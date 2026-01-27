import React, { useState } from 'react';
import './DocumentForm.css';

const DocumentForm = ({ initialData, userProfile, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    city: initialData?.city || initialData?.ville || '',
    schoolInstitutionId: initialData?.schoolInstitutionId || '',
    receptionMethod: initialData?.receptionMethod || 'EMAIL',
    expeditionRegion: initialData?.expeditionRegion || '',
    desiredSchool: initialData?.desiredSchool || initialData?.ecoleSouhaitee || '',
    desiredField: initialData?.desiredField || initialData?.domaineSouhaite || '',
    lastAverage: initialData?.lastAverage || initialData?.moyenne || '',
    strengths: initialData?.strengths || initialData?.pointsForts || '',
    motivations: initialData?.motivations || initialData?.motivation || '',
    documentType: initialData?.documentType || '',
    classe: initialData?.classe || '',
    certification: initialData?.certification || false,
  });

  const [errors, setErrors] = useState({});

  const receptionMethods = [
    { value: 'EMAIL', label: 'Email' },
    { value: 'COURRIER', label: 'Courrier' },
    { value: 'RETRAIT', label: 'Retrait sur place' },
  ];

  const expeditionRegions = [
    { value: 'CEDEAO', label: 'CEDEAO' },
    { value: 'AFRIQUE', label: 'Afrique' },
    { value: 'EUROPE', label: 'Europe' },
    { value: 'AMERIQUE', label: 'Amérique' },
    { value: 'ASIE', label: 'Asie' },
  ];

  const documentTypes = [
    { value: 'BULLETIN_SCOLAIRE', label: 'Bulletin scolaire' },
    { value: 'CERTIFICAT_SCOLARITE', label: 'Certificat de scolarité' },
    { value: 'DIPLOME', label: 'Diplôme' },
    { value: 'RELEVE_NOTE', label: 'Relevé de notes' },
    { value: 'ATTESTATION', label: 'Attestation' },
  ];

  const classes = [
    { value: 'SIXIEME', label: '6ème' },
    { value: 'CINQUIEME', label: '5ème' },
    { value: 'QUATRIEME', label: '4ème' },
    { value: 'TROISIEME', label: '3ème' },
    { value: 'SECONDE', label: '2nde' },
    { value: 'PREMIERE', label: '1ère' },
    { value: 'TERMINALE', label: 'Terminale' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.city) newErrors.city = 'Requis';
    if (!formData.receptionMethod) newErrors.receptionMethod = 'Requis';
    if (!formData.desiredSchool) newErrors.desiredSchool = 'Requis';
    if (!formData.desiredField) newErrors.desiredField = 'Requis';
    if (!formData.lastAverage) newErrors.lastAverage = 'Requis';
    if (!formData.strengths) newErrors.strengths = 'Requis';
    if (!formData.motivations) newErrors.motivations = 'Requis';
    if (!formData.documentType) newErrors.documentType = 'Requis';
    if (!formData.classe) newErrors.classe = 'Requis';
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
    <form className="document-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="section-title">Informations de localisation</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Ville *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ex: Abidjan"
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>Méthode de réception *</label>
            <select
              value={formData.receptionMethod}
              onChange={(e) => handleChange('receptionMethod', e.target.value)}
              className={errors.receptionMethod ? 'error' : ''}
            >
              <option value="">Sélectionner</option>
              {receptionMethods.map(method => (
                <option key={method.value} value={method.value}>{method.label}</option>
              ))}
            </select>
            {errors.receptionMethod && <span className="error-text">{errors.receptionMethod}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Région d'expédition</label>
          <select
            value={formData.expeditionRegion}
            onChange={(e) => handleChange('expeditionRegion', e.target.value)}
          >
            <option value="">Sélectionner (optionnel)</option>
            {expeditionRegions.map(region => (
              <option key={region.value} value={region.value}>{region.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Informations sur le document</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Type de document *</label>
            <select
              value={formData.documentType}
              onChange={(e) => handleChange('documentType', e.target.value)}
              className={errors.documentType ? 'error' : ''}
            >
              <option value="">Sélectionner</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.documentType && <span className="error-text">{errors.documentType}</span>}
          </div>

          <div className="form-group">
            <label>Classe *</label>
            <select
              value={formData.classe}
              onChange={(e) => handleChange('classe', e.target.value)}
              className={errors.classe ? 'error' : ''}
            >
              <option value="">Sélectionner</option>
              {classes.map(cl => (
                <option key={cl.value} value={cl.value}>{cl.label}</option>
              ))}
            </select>
            {errors.classe && <span className="error-text">{errors.classe}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>ID de l'institution scolaire</label>
          <input
            type="text"
            value={formData.schoolInstitutionId}
            onChange={(e) => handleChange('schoolInstitutionId', e.target.value)}
            placeholder="ID de l'établissement (optionnel)"
          />
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
            placeholder="Ex: Mathématiques, Physique..."
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
            placeholder="Ex: Besoin pour inscription..."
            className={errors.motivations ? 'error' : ''}
          />
          {errors.motivations && <span className="error-text">{errors.motivations}</span>}
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

export default DocumentForm;