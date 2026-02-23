import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Eye, Search, Filter, X } from 'lucide-react';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const moduleType = searchParams.get('moduleType') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [selectedModule, setSelectedModule] = useState(moduleType);
  const [searchInput, setSearchInput] = useState(query);

  // Synchroniser searchInput avec la query de l'URL
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Synchroniser selectedModule avec moduleType de l'URL
  useEffect(() => {
    setSelectedModule(moduleType);
  }, [moduleType]);

  // Fonction pour effectuer la recherche
  const fetchSearchResults = async ({ queryKey }) => {
    const [, searchQuery, moduleFilter, pageNum] = queryKey;
    
    if (!searchQuery || searchQuery.length < 2) {
      return { data: [], pagination: {}, stats: {} };
    }

    const params = new URLSearchParams({
      query: searchQuery,
      page: pageNum.toString(),
      limit: '20',
    });

    if (moduleFilter) {
      params.append('moduleType', moduleFilter);
    }

    const response = await fetch(
      `https://alloecoleapi-dev.up.railway.app/api/v1/search?${params.toString()}`
    );

    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const result = await response.json();

    if (!result.success) throw new Error("Erreur API : success = false");

    return {
      data: result.data || [],
      pagination: result.pagination || {},
      stats: result.stats || {},
    };
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['search', query, selectedModule, page],
    queryFn: fetchSearchResults,
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim().length >= 2) {
      setSearchParams({
        q: searchInput.trim(),
        ...(selectedModule && { moduleType: selectedModule }),
        page: '1',
      });
    }
  };

  const handleModuleFilter = (module) => {
    const newModule = selectedModule === module ? '' : module;
    setSelectedModule(newModule);
    setSearchParams({
      q: query,
      ...(newModule && { moduleType: newModule }),
      page: '1',
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      q: query,
      ...(selectedModule && { moduleType: selectedModule }),
      page: newPage.toString(),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Types de modules disponibles
  const moduleTypes = [
    { value: 'news', label: 'Actualités', count: data?.stats?.news || 0 },
    { value: 'scholarship', label: 'Bourses', count: data?.stats?.scholarship || 0 },
    { value: 'school', label: 'Écoles', count: data?.stats?.school || 0 },
    { value: 'video', label: 'Vidéos', count: data?.stats?.video || 0 },
    { value: 'quiz', label: 'Quiz', count: data?.stats?.quiz || 0 },
    { value: 'play', label: 'Play', count: data?.stats?.play || 0 },
    { value: 'questionnaire', label: 'Questionnaires', count: data?.stats?.questionnaire || 0 },
    { value: 'magazine', label: 'Magazines', count: data?.stats?.magazine || 0 },
    { value: 'job_sheet', label: 'Fiches Métiers', count: data?.stats?.job_sheet || 0 },
    { value: 'foreign_study', label: 'Études à l\'étranger', count: data?.stats?.foreign_study || 0 },
    { value: 'permutation', label: 'Permutations', count: data?.stats?.permutation || 0 },
    { value: 'orientation', label: 'Orientations', count: data?.stats?.orientation || 0 },
    { value: 'revision', label: 'Révisions', count: data?.stats?.revision || 0 },
    { value: 'product', label: 'Produits', count: data?.stats?.product || 0 },
    { value: 'emission', label: 'Émissions', count: data?.stats?.emission || 0 },
  ];

  const renderContentCard = (item) => {
    const contentType = item.contentType || 'unknown';
    const getContentTypeLabel = () => {
      const typeMap = {
        news: 'Actualité',
        scholarship: 'Bourse',
        school: 'École',
        video: 'Vidéo',
        quiz: 'Quiz',
        play: 'Play',
        questionnaire: 'Questionnaire',
        magazine: 'Magazine',
        job_sheet: 'Fiche Métier',
        foreign_study: 'Étude à l\'étranger',
        permutation: 'Permutation',
        orientation: 'Orientation',
        revision: 'Révision',
        product: 'Produit',
        emission: 'Émission',
        candidate_video: 'Vidéo Candidat',
      };
      return typeMap[contentType] || 'Contenu';
    };

    const handleClick = () => {
      if (item.slug) {
        const routeMap = {
          news: `/actualites/${item.slug}`,
          scholarship: `/bourses/${item.slug}`,
          school: `/schools/${item.slug}`,
          video: `/webtv/video/${item.slug}`,
          quiz: `/quiz/${item.slug}`,
          play: `/quiz/${item.slug}`,
          questionnaire: `/questionnaires-interactifs`,
          magazine: `/magazine/read/${item.slug}`,
          job_sheet: `/fiches-metiers/${item.slug}`,
          foreign_study: `/etudes-etranger`,
          permutation: `/permutation`,
          orientation: `/questionnaires-interactifs`,
          revision: `/revision/${item.slug}`,
          product: `/marketplace/${item.slug}`,
          emission: `/emission/${item.slug}`,
        };
        const route = routeMap[contentType] || `/search?q=${query}`;
        navigate(route);
      } else if (item.id) {
        navigate(`/search?q=${query}&id=${item.id}`);
      }
    };

    return (
      <div className="search-result-card" key={`${contentType}-${item.id}`} onClick={handleClick}>
        <div className="search-result-header">
          <span className="content-type-badge">{getContentTypeLabel()}</span>
          {item.moduleName && (
            <span className="module-badge">{item.moduleName}</span>
          )}
        </div>
        {item.mainImage && (
          <div className="search-result-image">
            <img src={item.mainImage} alt={item.title} />
          </div>
        )}
        <div className="search-result-content">
          <h3 className="search-result-title">{item.title}</h3>
          {item.summary && (
            <p className="search-result-summary">{item.summary}</p>
          )}
          <div className="search-result-meta">
            {item.publishedAt && (
              <div className="meta-item">
                <Calendar className="icon-sm" />
                <span>{new Date(item.publishedAt).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            {item.views !== undefined && (
              <div className="meta-item">
                <Eye className="icon-sm" />
                <span>{item.views} vues</span>
              </div>
            )}
            {item.author && (
              <div className="meta-item">
                <span>Par {item.author}</span>
              </div>
            )}
          </div>
          {item.resultObject && (
            <div className="search-result-details">
              {/* Afficher des détails supplémentaires selon le type */}
              {contentType === 'play' && item.resultObject.difficulty && (
                <div className="detail-item">
                  <strong>Difficulté:</strong> {item.resultObject.difficulty}
                </div>
              )}
              {contentType === 'quiz' && item.resultObject.questions && (
                <div className="detail-item">
                  <strong>Questions:</strong> {item.resultObject.questions.length}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        {/* Barre de recherche */}
        <div className="search-bar-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher dans toute l'application..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => {
                    setSearchInput('');
                    setSearchParams({});
                  }}
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <button type="submit" className="search-button">
              Rechercher
            </button>
          </form>
        </div>

        {/* Filtres par module */}
        {query && (
          <div className="filters-section">
            <div className="filters-header">
              <Filter className="filter-icon" />
              <span>Filtrer par type:</span>
            </div>
            <div className="filter-chips">
              <button
                className={`filter-chip ${!selectedModule ? 'active' : ''}`}
                onClick={() => handleModuleFilter('')}
              >
                Tous ({data?.stats ? Object.values(data.stats).reduce((a, b) => a + b, 0) : 0})
              </button>
              {moduleTypes
                .filter((m) => m.count > 0 || selectedModule === m.value)
                .map((module) => (
                  <button
                    key={module.value}
                    className={`filter-chip ${selectedModule === module.value ? 'active' : ''}`}
                    onClick={() => handleModuleFilter(module.value)}
                  >
                    {module.label} ({module.count})
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Résultats */}
        <div className="results-section">
          {!query && (
            <div className="empty-state">
              <Search className="empty-icon" />
              <h2>Recherchez dans toute l'application</h2>
              <p>Entrez au moins 2 caractères pour commencer votre recherche</p>
            </div>
          )}

          {query.length < 2 && query.length > 0 && (
            <div className="empty-state">
              <Search className="empty-icon" />
              <h2>Recherche trop courte</h2>
              <p>Veuillez entrer au moins 2 caractères</p>
            </div>
          )}

          {isLoading && query.length >= 2 && (
            <div className="school-detail-loading">
              <div className="loading-spinner">
                <div className="spinner-container">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <div className="loading-text">Recherche en cours...</div>
              </div>
            </div>
          )}

          {isError && (
            <div className="error-state">
              <p>Erreur: {error.message}</p>
            </div>
          )}

          {data && query.length >= 2 && (
            <>
              <div className="results-header">
                <h2>
                  {data.pagination.total_items || 0} résultat
                  {(data.pagination.total_items || 0) > 1 ? 's' : ''} trouvé
                  pour "{query}"
                </h2>
              </div>

              {data.data.length === 0 ? (
                <div className="empty-state">
                  <Search className="empty-icon" />
                  <h2>Aucun résultat trouvé</h2>
                  <p>Essayez avec d'autres mots-clés ou modifiez vos filtres</p>
                </div>
              ) : (
                <>
                  <div className="results-grid">
                    {data.data.map((item) => renderContentCard(item))}
                  </div>

                  {/* Pagination */}
                  {data.pagination.total_pages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-button"
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                      >
                        Précédent
                      </button>
                      <div className="pagination-info">
                        Page {data.pagination.current_page} sur {data.pagination.total_pages}
                      </div>
                      <button
                        className="pagination-button"
                        disabled={page >= data.pagination.total_pages}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        Suivant
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
