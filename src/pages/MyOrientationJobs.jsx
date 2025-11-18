import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Tag, GraduationCap, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import tokenManager from '../helper/tokenManager';
import Animation from '../helper/Animation';
import './JobSheets.css';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const MyOrientationJobs = () => {
  const navigate = useNavigate();
  const [jobSheets, setJobSheets] = useState([]);
  const [orientationSummary, setOrientationSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAuthenticated = tokenManager.isAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMyOrientationJobs = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await tokenManager.fetchWithAuth(
          `${API_BASE}/students/job-sheets/my-orientation`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const json = await response.json();
        
        if (json.success) {
          setJobSheets(json.data || []);
          setOrientationSummary(json.orientationSummary || '');
        } else {
          throw new Error(json.message || 'Erreur lors du chargement');
        }
      } catch (err) {
        console.error('Erreur chargement métiers orientation:', err);
        setError(err.message || 'Impossible de charger vos métiers recommandés');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrientationJobs();
  }, [isAuthenticated, navigate]);

  const renderJobSheetCard = (jobSheet) => (
    <Link 
      key={jobSheet.id} 
      to={`/fiches-metiers/${jobSheet.id}`}
      className="job-sheet-card"
    >
      <div className="card-header">
        {jobSheet.premiumRequired && (
          <span className="premium-badge">
            <Star className="icon-sm" />
            Premium
          </span>
        )}
        {jobSheet.matchScore && (
          <span className="match-badge" style={{
            background: jobSheet.matchScore >= 80 ? '#10b981' : jobSheet.matchScore >= 60 ? '#f59e0b' : '#6b7280',
            color: 'white'
          }}>
            <TrendingUp className="icon-sm" />
            {jobSheet.matchScore}% de correspondance
          </span>
        )}
        <span className="category-badge">{jobSheet.category?.name || 'Non catégorisé'}</span>
      </div>
      
      <div className="card-body">
        <h3 className="card-title">{jobSheet.title}</h3>
        <p className="card-description">
          {jobSheet.description?.substring(0, 150)}...
        </p>
      </div>
      
      <div className="card-footer">
        <div className="card-meta">
          {jobSheet.schoolsCount > 0 && (
            <span className="meta-item">
              <GraduationCap className="icon-sm" />
              {jobSheet.schoolsCount} école{jobSheet.schoolsCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <span className="card-link">
          Voir les détails <ArrowRight className="icon-sm" />
        </span>
      </div>
    </Link>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Animation />
      <section className="job-sheets-section">
        <div className="job-sheets-hero">
          <div className="container">
            <div className="hero-content">
              <h1>Métiers Recommandés</h1>
              <p>Découvrez les métiers qui correspondent à votre profil d'orientation</p>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="job-sheets-content">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Chargement de vos métiers recommandés...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>⚠️ {error}</p>
                <Link to="/simulateur" className="btn-primary" style={{ marginTop: '1rem' }}>
                  Faire le questionnaire d'orientation
                </Link>
              </div>
            )}

            {!loading && !error && orientationSummary && (
              <div className="orientation-summary">
                <h2>Votre profil d'orientation</h2>
                <p>{orientationSummary}</p>
              </div>
            )}

            {!loading && !error && jobSheets.length === 0 && (
              <div className="empty-state">
                <BookOpen className="icon-lg" />
                <h3>Aucun métier recommandé</h3>
                <p>Complétez le questionnaire d'orientation pour obtenir des recommandations personnalisées</p>
                <Link to="/simulateur" className="btn-primary">
                  Faire le questionnaire d'orientation
                </Link>
              </div>
            )}

            {!loading && !error && jobSheets.length > 0 && (
              <>
                <div className="results-header">
                  <h2>{jobSheets.length} métier{jobSheets.length > 1 ? 's' : ''} recommandé{jobSheets.length > 1 ? 's' : ''}</h2>
                  <p>Basé sur votre profil d'orientation</p>
                </div>
                <div className="job-sheets-grid">
                  {jobSheets.map(renderJobSheetCard)}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MyOrientationJobs;

