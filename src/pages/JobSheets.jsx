import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, MapPin, Tag, Star, GraduationCap, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import tokenManager from '../helper/tokenManager';
import Animation from '../helper/Animation';
import './JobSheets.css';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const JobSheets = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobSheets, setJobSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [retryCountdown, setRetryCountdown] = useState(0);
  
  // Filtres
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const tagsParam = searchParams.get('tags');
  const [tags, setTags] = useState(tagsParam ? tagsParam.split(',').filter(t => t.trim() !== '') : []);
  const [premiumOnly, setPremiumOnly] = useState(searchParams.get('premiumRequired') === 'true');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [limit] = useState(12);
  
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Charger les fiches métiers
  const fetchJobSheets = useCallback(async () => {
    setLoading(true);
    setError('');
    setErrorCode(null);
    setRetryCountdown(0);
    
    try {
      const params = new URLSearchParams();
      if (search && search.trim()) params.append('search', search.trim());
      if (categoryId && categoryId.trim()) params.append('categoryId', categoryId.trim());
      if (tags.length > 0) {
        tags.forEach(tag => {
          if (tag && tag.trim()) {
            params.append('tags', tag.trim());
          }
        });
      }
      if (premiumOnly) params.append('premiumRequired', 'true');
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const url = `${API_BASE}/students/job-sheets/public?${params.toString()}`;
      console.log('Fetching job sheets with URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          setErrorCode(429);
          const errorJson = await response.json().catch(() => ({}));
          setError(errorJson.message || 'Trop de requêtes effectuées. Le serveur limite le nombre de requêtes pour protéger les ressources. Veuillez patienter quelques instants avant de réessayer.');
          // Démarrer un countdown de 30 secondes
          setRetryCountdown(30);
          return;
        }
        
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        const errorMessage = errorData.message || errorData.errors?.[0] || `Erreur ${response.status}`;
        throw new Error(errorMessage);
      }

      const json = await response.json();
      
      if (json.success) {
        setJobSheets(json.data || []);
        setPagination(json.pagination || null);
        setErrorCode(null);
        
        // Mettre à jour l'URL
        setSearchParams(params);
      } else {
        throw new Error(json.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      console.error('Erreur chargement fiches métiers:', err);
      setError(err.message || 'Impossible de charger les fiches métiers');
      if (err.message.includes('429')) {
        setErrorCode(429);
        setRetryCountdown(30);
      }
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, tags, premiumOnly, page, limit, setSearchParams]);

  // Extraire les catégories et tags uniques depuis les données
  useEffect(() => {
    if (jobSheets.length > 0) {
      const uniqueCategories = [...new Map(jobSheets.map(item => [item.category?.id, item.category])).values()];
      setCategories(uniqueCategories);
      
      const uniqueTags = [...new Set(jobSheets.flatMap(item => item.tags?.map(t => t.name) || []))];
      setAllTags(uniqueTags);
    }
  }, [jobSheets]);

  useEffect(() => {
    fetchJobSheets();
  }, [fetchJobSheets]);

  // Gérer le countdown pour le retry après erreur 429
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => {
        setRetryCountdown(retryCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retryCountdown]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobSheets();
  };

  const handleTagToggle = (tagName) => {
    setPage(1);
    setTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategoryId('');
    setTags([]);
    setPremiumOnly(false);
    setPage(1);
  };

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
        <span className="category-badge">{jobSheet.category?.name || 'Non catégorisé'}</span>
      </div>
      
      <div className="card-body">
        <h3 className="card-title">{jobSheet.title}</h3>
        <p className="card-description">
          {jobSheet.description?.substring(0, 150)}...
        </p>
        
        {jobSheet.tags && jobSheet.tags.length > 0 && (
          <div className="card-tags">
            {jobSheet.tags.slice(0, 3).map(tag => (
              <span key={tag.id} className="tag">
                <Tag className="icon-xs" />
                {tag.name}
              </span>
            ))}
            {jobSheet.tags.length > 3 && (
              <span className="tag-more">+{jobSheet.tags.length - 3}</span>
            )}
          </div>
        )}
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

  return (
    <>
      <Animation />
      <section className="job-sheets-section">
        <div className="job-sheets-hero">
          <div className="container">
            <div className="hero-content">
              <h1>Fiches Métiers</h1>
              <p>Découvrez les métiers qui vous correspondent et les formations pour y accéder</p>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="job-sheets-content">
            {/* Barre de recherche et filtres */}
            <div className="search-filters-bar">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Rechercher un métier..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                  />
                </div>
                <button type="submit" className="btn-search">
                  Rechercher
                </button>
              </form>
              
              <button 
                className="btn-filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="icon-sm" />
                Filtres
                {(categoryId || tags.length > 0 || premiumOnly) && (
                  <span className="filter-badge">{[categoryId, tags.length, premiumOnly].filter(Boolean).length}</span>
                )}
              </button>
            </div>

            {/* Panneau de filtres */}
            {showFilters && (
              <div className="filters-panel">
                <div className="filter-group">
                  <label>Catégorie</label>
                  <select 
                    value={categoryId} 
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      setPage(1);
                    }}
                    className="filter-select"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Tags</label>
                  <div className="tags-filter">
                    {allTags.slice(0, 10).map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className={`tag-filter-btn ${tags.includes(tag) ? 'active' : ''}`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={premiumOnly}
                      onChange={(e) => {
                        setPremiumOnly(e.target.checked);
                        setPage(1);
                      }}
                    />
                    Premium uniquement
                  </label>
                </div>

                <button 
                  className="btn-clear-filters"
                  onClick={handleClearFilters}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Liste des fiches métiers */}
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Chargement des fiches métiers...</p>
              </div>
            )}

            {error && (
              <div className={`error-state ${errorCode === 429 ? 'error-rate-limit' : ''}`}>
                <div className="error-content">
                  <div className="error-icon-text">
                    {errorCode === 429 ? (
                      <Clock className="icon-lg error-icon" />
                    ) : (
                      <AlertCircle className="icon-lg error-icon" />
                    )}
                    <p>{error}</p>
                  </div>
                  {errorCode === 429 && retryCountdown > 0 && (
                    <div className="retry-countdown">
                      <Clock className="icon-sm" />
                      <p>Nouvelle tentative dans <strong>{retryCountdown}</strong> seconde{retryCountdown > 1 ? 's' : ''}</p>
                    </div>
                  )}
                  {errorCode === 429 && (
                    <button 
                      onClick={() => {
                        setRetryCountdown(0);
                        setErrorCode(null);
                        fetchJobSheets();
                      }}
                      className="btn-retry"
                      disabled={loading || retryCountdown > 0}
                    >
                      {retryCountdown > 0 ? (
                        <>
                          <Clock className="icon-sm" />
                          Attendre {retryCountdown}s
                        </>
                      ) : (
                        'Réessayer maintenant'
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {!loading && !error && jobSheets.length === 0 && (
              <div className="empty-state">
                <BookOpen className="icon-lg" />
                <h3>Aucune fiche métier trouvée</h3>
                <p>Essayez de modifier vos critères de recherche</p>
                <button onClick={handleClearFilters} className="btn-primary">
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {!loading && !error && jobSheets.length > 0 && (
              <>
                <div className="job-sheets-grid">
                  {jobSheets.map(renderJobSheetCard)}
                </div>

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Précédent
                    </button>
                    <span className="pagination-info">
                      Page {pagination.current_page} sur {pagination.total_pages}
                    </span>
                    <button
                      className="pagination-btn"
                      disabled={page >= pagination.total_pages}
                      onClick={() => setPage(page + 1)}
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default JobSheets;

