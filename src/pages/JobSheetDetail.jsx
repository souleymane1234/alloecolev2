import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Tag, GraduationCap, MapPin, Phone, Mail, Globe, BookOpen, Download } from 'lucide-react';
import tokenManager from '../helper/tokenManager';
import Animation from '../helper/Animation';
import './JobSheetDetail.css';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const JobSheetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobSheet, setJobSheet] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [showSchools, setShowSchools] = useState(false);
  const isAuthenticated = tokenManager.isAuthenticated();

  // Charger les détails de la fiche métier
  useEffect(() => {
    const fetchJobSheet = async () => {
      setLoading(true);
      setError('');
      
      try {
        const endpoint = isAuthenticated 
          ? `/students/job-sheets/me/${id}`
          : `/students/job-sheets/public/${id}`;
        
        const response = await tokenManager.fetchWithAuth(`${API_BASE}${endpoint}`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const json = await response.json();
        
        if (json.success) {
          setJobSheet(json.data);
          if (json.data.schools && json.data.schools.length > 0) {
            setSchools(json.data.schools);
          }
        } else {
          throw new Error(json.message || 'Erreur lors du chargement');
        }
      } catch (err) {
        console.error('Erreur chargement fiche métier:', err);
        setError(err.message || 'Impossible de charger la fiche métier');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobSheet();
    }
  }, [id, isAuthenticated]);

  // Charger les écoles associées
  const fetchSchools = async () => {
    if (schools.length > 0) return; // Déjà chargées
    
    setLoadingSchools(true);
    try {
      const response = await fetch(`${API_BASE}/students/job-sheets/public/${id}/schools`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const json = await response.json();
      
      if (json.success) {
        setSchools(json.data || []);
      }
    } catch (err) {
      console.error('Erreur chargement écoles:', err);
    } finally {
      setLoadingSchools(false);
    }
  };

  const handleShowSchools = () => {
    if (!showSchools && schools.length === 0) {
      fetchSchools();
    }
    setShowSchools(!showSchools);
  };

  const formatDescription = (text) => {
    if (!text) return '';
    
    // Convertir les markdown bold (**text**) en HTML
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          const content = line.replace(/\*\*/g, '');
          return <h4 key={index} className="description-section-title">{content}</h4>;
        }
        if (line.trim().startsWith('- ')) {
          const content = line.replace(/^-\s*/, '');
          return <li key={index} className="description-list-item">{content}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="description-paragraph">{line}</p>;
      });
  };

  if (loading) {
    return (
      <>
        <Animation />
        <div className="job-sheet-detail-loading">
          <div className="spinner"></div>
          <p>Chargement de la fiche métier...</p>
        </div>
      </>
    );
  }

  if (error || !jobSheet) {
    return (
      <>
        <Animation />
        <div className="job-sheet-detail-error">
          <p>⚠️ {error || 'Fiche métier introuvable'}</p>
          <Link to="/fiches-metiers" className="btn-primary">
            <ArrowLeft className="icon-sm" />
            Retour aux fiches métiers
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Animation />
      <section className="job-sheet-detail-section">
        <div className="container">
          <Link to="/fiches-metiers" className="back-link">
            <ArrowLeft className="icon-sm" />
            Retour aux fiches métiers
          </Link>

          <article className="job-sheet-detail">
            {/* Header */}
            <div className="detail-header">
              <div className="header-badges">
                {jobSheet.premiumRequired && (
                  <span className="premium-badge">
                    <Star className="icon-sm" />
                    Premium
                  </span>
                )}
                <span className="category-badge">{jobSheet.category?.name || 'Non catégorisé'}</span>
              </div>
              
              <h1>{jobSheet.title}</h1>
              
              {jobSheet.tags && jobSheet.tags.length > 0 && (
                <div className="detail-tags">
                  {jobSheet.tags.map(tag => (
                    <span key={tag.id} className="tag">
                      <Tag className="icon-xs" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {jobSheet.authorName && (
                <p className="author-info">Par {jobSheet.authorName}</p>
              )}
            </div>

            {/* Description */}
            <div className="detail-description">
              <div className="description-content">
                {formatDescription(jobSheet.description)}
              </div>
            </div>

            {/* Document PDF si disponible */}
            {jobSheet.docUrl && (
              <div className="detail-document">
                <a 
                  href={jobSheet.docUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-download"
                >
                  <Download className="icon-sm" />
                  Télécharger la fiche complète (PDF)
                </a>
              </div>
            )}

            {/* Écoles associées */}
            {jobSheet.schoolsCount > 0 && (
              <div className="detail-schools">
                <div className="schools-header">
                  <h2>
                    <GraduationCap className="icon-md" />
                    Écoles proposant cette formation ({jobSheet.schoolsCount})
                  </h2>
                  <button 
                    className="btn-toggle-schools"
                    onClick={handleShowSchools}
                    disabled={loadingSchools}
                  >
                    {showSchools ? 'Masquer' : 'Afficher'} les écoles
                  </button>
                </div>

                {showSchools && (
                  <div className="schools-list">
                    {loadingSchools ? (
                      <div className="loading-schools">
                        <div className="spinner-small"></div>
                        <p>Chargement des écoles...</p>
                      </div>
                    ) : schools.length > 0 ? (
                      <div className="schools-grid">
                        {schools.map(school => (
                          <div key={school.id} className="school-card">
                            {school.logoUrl && (
                              <img 
                                src={school.logoUrl} 
                                alt={school.name}
                                className="school-logo"
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                            <h3>{school.name}</h3>
                            {school.city && (
                              <p className="school-location">
                                <MapPin className="icon-xs" />
                                {school.city}
                              </p>
                            )}
                            {school.description && (
                              <p className="school-description">
                                {school.description.substring(0, 150)}...
                              </p>
                            )}
                            <div className="school-contacts">
                              {school.email && (
                                <a href={`mailto:${school.email}`} className="contact-link">
                                  <Mail className="icon-xs" />
                                  Email
                                </a>
                              )}
                              {school.phone && (
                                <a href={`tel:${school.phone}`} className="contact-link">
                                  <Phone className="icon-xs" />
                                  Téléphone
                                </a>
                              )}
                              {school.website && (
                                <a 
                                  href={school.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="contact-link"
                                >
                                  <Globe className="icon-xs" />
                                  Site web
                                </a>
                              )}
                            </div>
                            <Link 
                              to={`/schools/${school.id}`}
                              className="btn-school-detail"
                            >
                              Voir les détails
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-schools">Aucune école disponible pour le moment</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
              <Link to="/fiches-metiers" className="btn-secondary">
                <ArrowLeft className="icon-sm" />
                Retour à la liste
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="btn-primary">
                  Se connecter pour voir plus de détails
                </Link>
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  );
};

export default JobSheetDetail;

