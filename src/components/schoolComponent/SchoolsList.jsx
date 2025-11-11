import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './SchoolsList.css';

const SchoolsList = () => {
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('all');
  const [showProximityFilter, setShowProximityFilter] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [proximityRadius, setProximityRadius] = useState(10);
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  // Fonction pour récupérer les écoles depuis l'API
  const fetchSchools = async () => {
    const response = await fetch('https://alloecoleapi-dev.up.railway.app/api/v1/students/schools');
    
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    
    const result = await response.json();

    if (result.success && result.data) {
      const formattedSchools = result.data.map((item) => {
        const name = item.name.toLowerCase();
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
          logo: item.logoUrl || "/images/poster/ecole.png",
          banner: item.bannerUrl || "/images/poster/ecole.png",
          address: `${item.city}, ${item.region}`,
          description: item.description || item.slogan || "",
          rating: item.isVerified ? 4.5 : 4.0,
          foundedYear: item.createdAt ? new Date(item.createdAt).getFullYear() : null,
          slogan: item.slogan,
          hasPaid: item.hasPaid,
          isVerified: item.isVerified,
          region: item.region,
          city: item.city
        };
      });

      return { schools: formattedSchools, pagination: result.pagination };
    }
    
    return { schools: [], pagination: null };
  };

  // Utilisation de React Query
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchools,
    staleTime: 20 * 60 * 1000, // Les données restent fraîches pendant 5 minutes
    cacheTime: 30 * 60 * 1000, // Les données sont gardées en cache pendant 10 minutes
    refetchOnWindowFocus: false, // Ne pas recharger quand on revient sur l'onglet
    retry: 2, // Réessayer 2 fois en cas d'échec
  });

  const schools = data?.schools || [];
  const pagination = data?.pagination || null;

  const academicLevels = [
    { value: 'all', label: 'Tous les niveaux', icon: 'ph-graduation-cap' },
    { value: 'primaire', label: 'Primaire', icon: 'ph-book' },
    { value: 'collège', label: 'Collège', icon: 'ph-student' },
    { value: 'lycée', label: 'Lycée', icon: 'ph-graduation-cap' },
    { value: 'université', label: 'Université', icon: 'ph-buildings' }
  ];

  const filieres = [
    { value: 'all', label: 'Toutes les filières', icon: 'ph-stack' },
    { value: 'général', label: 'Général', icon: 'ph-book-open' },
    { value: 'technique', label: 'Technique', icon: 'ph-wrench' },
    { value: 'commerce', label: 'Commerce', icon: 'ph-currency-circle-dollar' },
    { value: 'santé', label: 'Santé', icon: 'ph-heart' },
    { value: 'art', label: 'Art', icon: 'ph-palette' }
  ];

  useEffect(() => {
    filterSchools();
  }, [selectedLevel, searchTerm, selectedFiliere, schools]);

  const filterSchools = () => {
    let filtered = schools;

    // Filtre par niveau académique
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(school => school.level === selectedLevel);
    }

    // Filtre par filière
    if (selectedFiliere !== 'all') {
      filtered = filtered.filter(school => school.filiere === selectedFiliere);
    }

    // Filtre par recherche textuelle
    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.address && school.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.description && school.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.slogan && school.slogan.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.city && school.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.region && school.region.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredSchools(filtered);
  };

  const handleProximitySearch = () => {
    if (!userLocation) {
      // Demander la géolocalisation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setUserLocation(location);
            filterByProximity(location);
          },
          (error) => {
            alert('Impossible d\'obtenir votre position. Veuillez autoriser la géolocalisation.');
          }
        );
      } else {
        alert('La géolocalisation n\'est pas supportée par votre navigateur.');
      }
    } else {
      filterByProximity(userLocation);
    }
  };

  const filterByProximity = (location) => {
    // Filtrer par ville si les coordonnées GPS ne sont pas disponibles
    const filtered = schools.filter(school => {
      // Si l'école a des coordonnées GPS, utiliser la distance
      if (school.latitude && school.longitude) {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          school.latitude,
          school.longitude
        );
        return distance <= proximityRadius;
      }
      // Sinon, inclure toutes les écoles (la géolocalisation fine nécessite des coordonnées)
      return true;
    });

    setFilteredSchools(filtered);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSchoolClick = (schoolId, event) => {
    // Empêcher le comportement par défaut du bouton
    event.preventDefault();
    event.stopPropagation();
    
    // Indiquer qu'une navigation est en cours
    setNavigating(true);
    
    // Navigation sans rechargement de page avec transition fluide
    setTimeout(() => {
      navigate(`/schools/${schoolId}`, { replace: false });
      setNavigating(false);
    }, 50); // Réduit à 50ms pour une transition quasi-instantanée
  };

  const resetFilters = () => {
    setSelectedLevel('all');
    setSelectedFiliere('all');
    setSearchTerm('');
    setUserLocation(null);
    setShowProximityFilter(false);
    setFilteredSchools(schools);
  };

  if (isLoading) {
    return (
      <>
        <div className="school-detail-loading">
          <div className="loading-spinner">
            <div className="spinner-container">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <div className="loading-text">Chargement des détails...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="schools-page">
        {navigating && (
          <div className="navigation-overlay">
            <div className="navigation-indicator">
              <div className="nav-spinner-container">
                <div className="nav-spinner-ring"></div>
                <div className="nav-spinner-ring"></div>
              </div>
              <div className="nav-spinner-text">Chargement...</div>
            </div>
          </div>
        )}
        <div className="schools-container">
          <div className="schools-header">
            <h1 className="schools-title">
              <i className="ph-buildings"></i>
              Découvrez les Écoles
            </h1>
            <p className="schools-subtitle">
              Trouvez l'établissement parfait pour votre éducation
            </p>
          </div>

          <div className="filters-section">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">
                  <i className="ph-magnifying-glass"></i>
                  Recherche
                </label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Nom de l'école, adresse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="ph-graduation-cap"></i>
                  Niveau académique
                </label>
                <select
                  className="filter-select"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  {academicLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="ph-stack"></i>
                  Filière
                </label>
                <select
                  className="filter-select"
                  value={selectedFiliere}
                  onChange={(e) => setSelectedFiliere(e.target.value)}
                >
                  {filieres.map(filiere => (
                    <option key={filiere.value} value={filiere.value}>
                      {filiere.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">
                  <i className="ph-map-pin"></i>
                  Proximité
                </label>
                <button
                  className="proximity-btn"
                  onClick={() => setShowProximityFilter(!showProximityFilter)}
                >
                  {showProximityFilter ? 'Masquer' : 'Rechercher près de moi'}
                </button>
              </div>
            </div>

            {showProximityFilter && (
              <div className="proximity-section">
                <div className="proximity-controls">
                  <input
                    type="number"
                    className="proximity-input"
                    placeholder="Rayon (km)"
                    value={proximityRadius}
                    onChange={(e) => setProximityRadius(Number(e.target.value))}
                    min="1"
                    max="100"
                  />
                  <button
                    className="proximity-btn"
                    onClick={handleProximitySearch}
                  >
                    <i className="ph-map-pin"></i>
                    Rechercher
                  </button>
                </div>
              </div>
            )}

            <button className="reset-btn" onClick={resetFilters}>
              <i className="ph-arrow-clockwise"></i>
              Réinitialiser les filtres
            </button>
          </div>

          <div className="schools-results">
            {isError && (
              <div style={{ 
                padding: '1rem', 
                margin: '1rem 0', 
                background: '#fee2e2', 
                color: '#dc2626', 
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                ⚠️ {error?.message || "Impossible de charger les écoles"}
                {!localStorage.getItem('access_token') && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href="/login" style={{ color: '#dc2626', textDecoration: 'underline' }}>
                      Se connecter
                    </a>
                  </div>
                )}
              </div>
            )}
            
            <p style={{ color: 'white', marginBottom: '1rem', textAlign: 'center' }}>
              {filteredSchools.length} école{filteredSchools.length > 1 ? 's' : ''} trouvée{filteredSchools.length > 1 ? 's' : ''}
            </p>

            {filteredSchools.length > 0 ? (
              <div className="schools-grid">
                {filteredSchools.map(school => (
                  <div
                    key={school.id}
                    className="school-card"
                    onClick={(e) => handleSchoolClick(school.id, e)}
                  >
                    <div className="school-banner">
                      <div className="school-logo">
                        <img src={school.logo} alt={`Logo ${school.name}`} />
                      </div>
                    </div>
                    
                    <div className="school-content">
                      <h3 className="school-name">{school.name}</h3>
                      <span className="school-level">
                        {academicLevels.find(l => l.value === school.level)?.label}
                      </span>
                      
                      <div className="school-info">
                        {school.isVerified && (
                          <div className="school-verified" style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.25rem',
                            background: '#10b981',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem'
                          }}>
                            <i className="ph-check-circle-fill"></i>
                            <span>Vérifié</span>
                          </div>
                        )}
                        {school.slogan && (
                          <div className="school-slogan" style={{ 
                            fontSize: '0.875rem', 
                            color: '#9ca3af', 
                            fontStyle: 'italic',
                            marginTop: '0.5rem'
                          }}>
                            "{school.slogan}"
                          </div>
                        )}
                        {school.city && school.region && (
                          <div className="school-location" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.25rem',
                            fontSize: '0.875rem',
                            color: '#9ca3af',
                            marginTop: '0.25rem'
                          }}>
                            <i className="ph-map-pin"></i>
                            <span>{school.city}, {school.region}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="school-description">
                        {school.description}
                      </p>
                      
                      <div className="school-actions">
                        <button 
                          className="action-btn"
                          onClick={(e) => handleSchoolClick(school.id, e)}
                        >
                          <i className="ph-eye"></i>
                          Voir détails
                        </button>
                        <button className="action-btn secondary">
                          <i className="ph-heart"></i>
                          Favoris
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-schools">
                <i className="ph-buildings"></i>
                <h3>Aucune école trouvée</h3>
                <p>Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolsList;