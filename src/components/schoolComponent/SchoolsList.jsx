import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './SchoolsList.css';

const API_BASE_URL = 'https://alloecoleapi-dev.up.railway.app/api/v1';
const DEFAULT_LOGO = '/images/poster/ecole.png';
const levelToType = {
  université: 'Université',
  lycée: 'Lycée',
  collège: 'Collège',
  primaire: 'École Supérieure'
};

const SchoolsList = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const normalizedSearch = useMemo(() => searchTerm.trim(), [searchTerm]);

  // Fonction pour obtenir l'emoji du drapeau basé sur le pays/région
  const getCountryFlag = (region, city, country) => {
    // Si un pays est spécifié
    if (country) {
      const countryLower = country.toLowerCase();
      if (countryLower.includes('côte') || countryLower.includes('cote') || countryLower.includes('ivoire') || countryLower === 'ci') {
        return '🇨🇮';
      }
      if (countryLower.includes('france') || countryLower === 'fr') {
        return '🇫🇷';
      }
      if (countryLower.includes('sénégal') || countryLower.includes('senegal') || countryLower === 'sn') {
        return '🇸🇳';
      }
      if (countryLower.includes('mali') || countryLower === 'ml') {
        return '🇲🇱';
      }
      if (countryLower.includes('burkina') || countryLower === 'bf') {
        return '🇧🇫';
      }
      if (countryLower.includes('bénin') || countryLower.includes('benin') || countryLower === 'bj') {
        return '🇧🇯';
      }
      if (countryLower.includes('togo') || countryLower === 'tg') {
        return '🇹🇬';
      }
      if (countryLower.includes('ghana') || countryLower === 'gh') {
        return '🇬🇭';
      }
      if (countryLower.includes('guinée') || countryLower.includes('guinee') || countryLower === 'gn') {
        return '🇬🇳';
      }
    }
    
    // Par défaut, si c'est en Côte d'Ivoire (basé sur la région)
    const regionLower = (region || '').toLowerCase();
    const cityLower = (city || '').toLowerCase();
    
    // La plupart des écoles sont probablement en Côte d'Ivoire
    // On peut aussi vérifier des villes spécifiques
    if (regionLower.includes('abidjan') || cityLower.includes('abidjan') ||
        regionLower.includes('yamoussoukro') || cityLower.includes('yamoussoukro') ||
        regionLower.includes('bouaké') || cityLower.includes('bouake') ||
        regionLower.includes('san-pedro') || cityLower.includes('san-pedro')) {
      return '🇨🇮';
    }
    
    // Par défaut, retourner le drapeau de la Côte d'Ivoire
    return '🇨🇮';
  };

  const fetchSchools = async ({ queryKey }) => {
    const [_key, page, search, levelSelection, sort, order] = queryKey;
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    params.append('sortBy', sort);
    params.append('sortOrder', order);

    if (search && search.length >= 2) {
      params.append('search', search);
    }

    const apiType = levelSelection !== 'all' ? levelToType[levelSelection] : null;
    if (apiType) {
      params.append('type', apiType);
    }

    const response = await fetch(`${API_BASE_URL}/students/schools?${params.toString()}`);
    
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    
    const result = await response.json();

    if (result.success && result.data) {
      const formattedSchools = result.data.map((item) => {
        const name = (item.name || '').toLowerCase();
        let level = 'université';
        if (name.includes('primaire') || name.includes('école primaire')) level = 'primaire';
        else if (name.includes('collège') || name.includes('college')) level = 'collège';
        else if (name.includes('lycée') || name.includes('lycee')) level = 'lycée';

        const slogan = (item.slogan || '').toLowerCase();
        let filiere = 'général';
        if (name.includes('commerce') || slogan.includes('commerce') || slogan.includes('management')) filiere = 'commerce';
        else if (name.includes('technique') || name.includes('polytechnique') || name.includes('technologie') || slogan.includes('technologie')) filiere = 'technique';
        else if (name.includes('santé') || name.includes('sante') || name.includes('médecine')) filiere = 'santé';
        else if (name.includes('art') || name.includes('culture')) filiere = 'art';

        return {
          id: item.id,
          name: item.name,
          level,
          filiere,
          logo: item.logoUrl || DEFAULT_LOGO,
          address: item.city && item.region ? `${item.city}, ${item.region}` : item.city || item.region || 'Non précisée',
          description: item.description || item.slogan || "",
          isVerified: item.isVerified,
          city: item.city || 'Non précisée',
          region: item.region || 'Non précisée',
          country: item.country || null
        };
      });

      return { schools: formattedSchools, pagination: result.pagination };
    }
    
    return { schools: [], pagination: null };
  };

  const { data, isLoading, error, isError, isFetching } = useQuery({
    queryKey: ['schools', currentPage, normalizedSearch, selectedLevel, sortBy, sortOrder],
    queryFn: fetchSchools,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const schools = data?.schools || [];
  const pagination = data?.pagination || null;

  const academicLevels = [
    { value: 'all', label: 'Tous' },
    { value: 'primaire', label: 'Primaire' },
    { value: 'collège', label: 'Collège' },
    { value: 'lycée', label: 'Lycée' },
    { value: 'université', label: 'Université' }
  ];

  const filieres = [
    { value: 'all', label: 'Toutes filières' },
    { value: 'général', label: 'Général' },
    { value: 'technique', label: 'Technique' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'santé', label: 'Santé' },
    { value: 'art', label: 'Art' }
  ];

  // Liste des pays disponibles
  const countries = [
    { value: 'all', label: 'Tous les pays', flag: '🌍' },
    { value: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { value: 'France', label: 'France', flag: '🇫🇷' },
    { value: 'Sénégal', label: 'Sénégal', flag: '🇸🇳' },
    { value: 'Mali', label: 'Mali', flag: '🇲🇱' },
    { value: 'Burkina Faso', label: 'Burkina Faso', flag: '🇧🇫' },
    { value: 'Bénin', label: 'Bénin', flag: '🇧🇯' },
    { value: 'Togo', label: 'Togo', flag: '🇹🇬' },
    { value: 'Ghana', label: 'Ghana', flag: '🇬🇭' },
    { value: 'Guinée', label: 'Guinée', flag: '🇬🇳' }
  ];

  // Utiliser useMemo pour calculer les écoles filtrées au lieu d'un useEffect
  const filteredSchools = useMemo(() => {
    let filtered = schools;

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(school => school.level === selectedLevel);
    }

    if (selectedFiliere !== 'all') {
      filtered = filtered.filter(school => school.filiere === selectedFiliere);
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(school => {
        // Vérifier si le pays correspond directement
        if (school.country && school.country.toLowerCase() === selectedCountry.toLowerCase()) {
          return true;
        }
        // Sinon, utiliser la fonction getCountryFlag pour déterminer le pays
        const flag = getCountryFlag(school.region, school.city, school.country);
        const selectedCountryData = countries.find(c => c.value === selectedCountry);
        if (selectedCountryData) {
          return flag === selectedCountryData.flag;
        }
        return false;
      });
    }

    if (searchTerm && searchTerm.trim().length >= 1) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(term) ||
        (school.address && school.address.toLowerCase().includes(term)) ||
        (school.description && school.description.toLowerCase().includes(term)) ||
        (school.city && school.city.toLowerCase().includes(term)) ||
        (school.region && school.region.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [schools, selectedLevel, selectedFiliere, selectedCountry, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearch, selectedLevel, selectedFiliere, selectedCountry, sortBy, sortOrder]);

  const handleSchoolClick = (schoolId) => {
    navigate(`/schools/${schoolId}`);
  };

  const resetFilters = () => {
    setSelectedLevel('all');
    setSelectedFiliere('all');
    setSelectedCountry('all');
    setSearchTerm('');
  };

  return (
    <div className="schools-page">
      <div className="schools-container">
        <header className="page-header">
          <h1><i className="ph-buildings"></i> Découvrez les Écoles</h1>
          <p>Trouvez l'établissement parfait pour votre éducation</p>
        </header>

        <div className="filters-bar">
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Rechercher une école..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="filter-dropdown"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            {academicLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>

          <select
            className="filter-dropdown"
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value)}
          >
            {filieres.map(filiere => (
              <option key={filiere.value} value={filiere.value}>{filiere.label}</option>
            ))}
          </select>

          <select
            className="filter-dropdown"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countries.map(country => (
              <option key={country.value} value={country.value}>
                {country.flag} {country.label}
              </option>
            ))}
          </select>

          <button className="reset-button" onClick={resetFilters}>
            <i className="ph-arrow-clockwise"></i> Réinitialiser
          </button>
        </div>

        {isError && (
          <div className="error-message">
            ⚠️ {error?.message || "Impossible de charger les écoles"}
          </div>
        )}

        <div className="results-info">
          {isLoading || isFetching ? 'Chargement...' : `${filteredSchools.length} école(s) trouvée(s)`}
          {pagination && ` • Page ${pagination.current_page || currentPage} / ${pagination.total_pages || '?'}`}
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des écoles...</p>
          </div>
        ) : filteredSchools.length > 0 ? (
          <div className="schools-grid">
            {filteredSchools.map(school => (
              <div
                key={school.id}
                className="school-card"
                onClick={() => handleSchoolClick(school.id)}
              >
                <div className="card-header">
                  <img src={school.logo} alt="pas d'image" className="school-logo" />
                  {school.isVerified && (
                    <span className="verified-badge">
                      <i className="ph-check-circle-fill"></i>
                    </span>
                  )}
                </div>

                <div className="card-body">
                  <h3 className="school-name">
                    <span style={{ marginRight: '0.5rem', fontSize: '1.2em' }}>
                      {getCountryFlag(school.region, school.city, school.country)}
                    </span>
                    {school.name}
                  </h3>
                  <span className="school-badge">{academicLevels.find(l => l.value === school.level)?.label}</span>
                  
                  <p className="school-location">
                    <i className="ph-map-pin"></i> {school.city}
                  </p>

                  {school.description && (
                    <p className="school-desc">
                      {school.description.length > 80 
                        ? school.description.substring(0, 80) + '...' 
                        : school.description}
                    </p>
                  )}
                </div>

                <div className="card-footer">
                  <button className="view-btn">
                    Voir détails <i className="ph-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <i className="ph-magnifying-glass"></i>
            <h3>Aucune école trouvée</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isFetching}
            >
              <i className="ph-arrow-left"></i> Précédent
            </button>
            
            <span className="page-info">
              Page {pagination.current_page || currentPage} / {pagination.total_pages}
            </span>
            
            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
              disabled={(pagination.current_page || currentPage) >= pagination.total_pages || isFetching}
            >
              Suivant <i className="ph-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsList;