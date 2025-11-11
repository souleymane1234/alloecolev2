
import React, { useState } from 'react';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const DossierCreationForm = ({ showForm, setShowForm, onSuccess }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    currentLevel: '',
    cvUrl: '',
    status: 'draft'
  });

  const getNewAccessToken = async () => {
    const storedRefresh = localStorage.getItem('refresh_token');
    if (!storedRefresh) throw new Error('Aucun refresh token');

    const resp = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefresh })
    });

    if (!resp.ok) throw new Error('Échec du refresh token');
    const data = await resp.json();
    const newAccess = data?.accessToken || data?.data?.accessToken || data?.token;
    if (!newAccess) throw new Error('Réponse refresh invalide');
    localStorage.setItem('access_token', newAccess);
    return newAccess;
  };

  const apiRequest = async (path, options = {}) => {
    let access = localStorage.getItem('access_token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (access) headers.Authorization = `Bearer ${access}`;

    const doFetch = async () =>
      fetch(`${API_BASE}${path}`, { ...options, headers });

    let response = await doFetch();

    if (response.status === 401) {
      const newAccess = await getNewAccessToken();
      headers.Authorization = `Bearer ${newAccess}`;
      response = await doFetch();
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erreur HTTP ${response.status}`);
    }

    return response.json();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    // Validation
    if (!form.currentLevel.trim()) {
      setError('Le niveau académique est requis');
      setIsCreating(false);
      return;
    }

    const payload = {
      currentLevel: form.currentLevel,
      cvUrl: form.cvUrl || undefined,
      status: form.status
    };

    try {
      const json = await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      console.log('✅ Dossier créé:', json);
      
      // Réinitialiser le formulaire
      setForm({
        currentLevel: '',
        cvUrl: '',
        status: 'draft'
      });
      
      // Fermer le modal
      setShowForm(false);
      
      // Callback de succès
      if (onSuccess) {
        onSuccess(json);
      }
    } catch (err) {
      console.error('❌ Erreur création dossier:', err);
      setError(err.message || 'Une erreur est survenue lors de la création du dossier');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setError('');
    setForm({
      currentLevel: '',
      cvUrl: '',
      status: 'draft'
    });
  };

  if (!showForm) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #f3f4f6'
        }}>
          <div>
            <h3 style={{ 
              margin: 0, 
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="ph-graduation-cap" style={{ color: '#f97316', fontSize: '1.75rem' }}></i>
              Créer un nouveau dossier
            </h3>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              Remplissez les informations pour créer votre dossier d'études
            </p>
          </div>
          <button 
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.375rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <i className="ph-x"></i>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <i className="ph-warning-circle" style={{ fontSize: '1.25rem' }}></i>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Niveau académique */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Niveau académique actuel <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              name="currentLevel"
              value={form.currentLevel}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                color: '#374151',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f97316';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Sélectionner un niveau</option>
              <option value="Baccalauréat">Baccalauréat</option>
              <option value="Licence 1">Licence 1</option>
              <option value="Licence 2">Licence 2</option>
              <option value="Licence 3">Licence 3</option>
              <option value="Master 1">Master 1</option>
              <option value="Master 2">Master 2</option>
              <option value="Doctorat">Doctorat</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* CV URL */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Lien vers votre CV (optionnel)
            </label>
            <input
              type="url"
              name="cvUrl"
              value={form.cvUrl}
              onChange={handleChange}
              placeholder="https://exemple.com/mon-cv.pdf"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                color: '#374151',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f97316';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <i className="ph-info"></i>
              Vous pouvez ajouter un lien vers votre CV en ligne (Google Drive, Dropbox, etc.)
            </p>
          </div>

          {/* Statut */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Statut du dossier
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                color: '#374151',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f97316';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="draft">Brouillon</option>
              <option value="submitted">Soumis</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #f3f4f6'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
            >
              <i className="ph-x-circle"></i>
              Annuler
            </button>
            <button
              type="submit"
              disabled={isCreating}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: isCreating ? '#9ca3af' : '#f97316',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isCreating) {
                  e.currentTarget.style.backgroundColor = '#ea580c';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCreating) {
                  e.currentTarget.style.backgroundColor = '#f97316';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isCreating ? (
                <>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  Création en cours...
                </>
              ) : (
                <>
                  <i className="ph-check-circle"></i>
                  Créer le dossier
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default DossierCreationForm;