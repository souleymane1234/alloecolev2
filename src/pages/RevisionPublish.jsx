import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Revision.css';

const RevisionPublish = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    certified: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Merci ! La publication d'exercice sera disponible prochainement.");
    navigate('/revision');
  };

  return (
    <div className="revision-page">
      <div className="revision-container">
        <div className="revision-header">
          <div>
            <h1 className="revision-title">Publier un exercice</h1>
            <p className="revision-subtitle">
              Partagez un énoncé (texte, PDF, image ou vidéo) avec la communauté. Les uploads seront ajoutés dans une prochaine version.
            </p>
          </div>
        </div>

        <form className="revision-detail" onSubmit={handleSubmit}>
          <div className="detail-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label>
                Titre
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Titre de l'exercice"
                  style={{
                    width: '100%',
                    marginTop: 6,
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                  }}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Décrivez brièvement le contenu"
                  rows={4}
                  style={{
                    width: '100%',
                    marginTop: 6,
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                  }}
                  required
                />
              </label>

              <label>
                Prix (FCFA)
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ex: 1500"
                  style={{
                    width: '100%',
                    marginTop: 6,
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                  }}
                  required
                  min="0"
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  name="certified"
                  checked={form.certified}
                  onChange={handleChange}
                />
                Je souhaite que cet exercice soit certifié
              </label>
            </div>
          </div>

          <div className="detail-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/revision')}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevisionPublish;

