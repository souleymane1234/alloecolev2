import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('all');
  const [showProximityFilter, setShowProximityFilter] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [proximityRadius, setProximityRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  // Données d'exemple des écoles
  const mockSchools = [
    {
      id: 1,
      name: "École Primaire Les Cocotiers",
      level: "primaire",
      filiere: "général",
      logo: "/images/schools/ecole-primaire-cocotiers.png",
      banner: "/images/schools/banner-primaire-cocotiers.jpg",
      address: "Avenue de la Paix, Abidjan",
      phone: "+225 20 30 40 50",
      email: "contact@cocotiers.ci",
      website: "www.cocotiers.ci",
      description: "École primaire d'excellence offrant une éducation de qualité dans un environnement moderne.",
      latitude: 5.316667,
      longitude: -4.033333,
      rating: 4.5,
      studentsCount: 450,
      foundedYear: 1995,
      activities: ["Sport", "Musique", "Théâtre", "Art plastique"],
      news: [
        {
          id: 1,
          title: "Inscription ouverte pour l'année 2024-2025",
          content: "Les inscriptions pour la nouvelle année scolaire sont maintenant ouvertes.",
          date: "2024-01-15",
          image: "/images/news/inscription-2024.jpg"
        }
      ]
    },
    {
      id: 2,
      name: "Collège Moderne d'Abidjan",
      level: "collège",
      filiere: "général",
      logo: "/images/schools/college-moderne-abidjan.png",
      banner: "/images/schools/banner-college-moderne.jpg",
      address: "Boulevard de la République, Abidjan",
      phone: "+225 20 30 40 51",
      email: "info@college-moderne.ci",
      website: "www.college-moderne.ci",
      description: "Collège moderne avec des installations de pointe et un corps enseignant qualifié.",
      latitude: 5.320000,
      longitude: -4.030000,
      rating: 4.3,
      studentsCount: 800,
      foundedYear: 1988,
      activities: ["Sciences", "Littérature", "Sport", "Informatique"],
      news: [
        {
          id: 2,
          title: "Résultats du BEPC 2024",
          content: "Félicitations à nos élèves pour leurs excellents résultats au BEPC.",
          date: "2024-01-10",
          image: "/images/news/bepc-results.jpg"
        }
      ]
    },
    {
      id: 3,
      name: "Lycée Technique Industriel",
      level: "lycée",
      filiere: "technique",
      logo: "/images/schools/lycee-technique-industriel.png",
      banner: "/images/schools/banner-lycee-technique.jpg",
      address: "Zone Industrielle, Abidjan",
      phone: "+225 20 30 40 52",
      email: "contact@lycee-technique.ci",
      website: "www.lycee-technique.ci",
      description: "Formation technique et industrielle de haut niveau pour préparer aux métiers de demain.",
      latitude: 5.325000,
      longitude: -4.025000,
      rating: 4.7,
      studentsCount: 600,
      foundedYear: 1975,
      activities: ["Mécanique", "Électricité", "Informatique", "Électronique"],
      news: [
        {
          id: 3,
          title: "Nouveau laboratoire d'informatique",
          content: "Inauguration du nouveau laboratoire d'informatique avec du matériel dernier cri.",
          date: "2024-01-08",
          image: "/images/news/lab-informatique.jpg"
        }
      ]
    },
    {
      id: 4,
      name: "Université Félix Houphouët-Boigny",
      level: "université",
      filiere: "général",
      logo: "/images/schools/universite-fhb.png",
      banner: "/images/schools/banner-universite-fhb.jpg",
      address: "Cocody, Abidjan",
      phone: "+225 20 30 40 53",
      email: "contact@ufhb.ci",
      website: "www.ufhb.ci",
      description: "Première université de Côte d'Ivoire, centre d'excellence académique et de recherche.",
      latitude: 5.330000,
      longitude: -4.020000,
      rating: 4.8,
      studentsCount: 45000,
      foundedYear: 1964,
      activities: ["Recherche", "Sport universitaire", "Culture", "Innovation"],
      news: [
        {
          id: 4,
          title: "Colloque international sur l'éducation",
          content: "L'UFHB accueille un colloque international sur l'avenir de l'éducation en Afrique.",
          date: "2024-01-12",
          image: "/images/news/colloque-education.jpg"
        }
      ]
    },
    {
      id: 5,
      name: "École Supérieure de Commerce",
      level: "université",
      filiere: "commerce",
      logo: "/images/schools/ecole-commerce.png",
      banner: "/images/schools/banner-ecole-commerce.jpg",
      address: "Plateau, Abidjan",
      phone: "+225 20 30 40 54",
      email: "info@ecole-commerce.ci",
      website: "www.ecole-commerce.ci",
      description: "Formation en commerce et gestion d'entreprise avec des partenariats internationaux.",
      latitude: 5.315000,
      longitude: -4.035000,
      rating: 4.6,
      studentsCount: 1200,
      foundedYear: 1990,
      activities: ["Gestion", "Marketing", "Finance", "Entrepreneuriat"],
      news: [
        {
          id: 5,
          title: "Partenariat avec une université française",
          content: "Nouveau partenariat pour des échanges d'étudiants avec l'Université de Paris.",
          date: "2024-01-05",
          image: "/images/news/partenariat-france.jpg"
        }
      ]
    },
    {
      id: 6,
      name: "Institut Supérieur de Technologie",
      level: "université",
      filiere: "technique",
      logo: "/images/schools/institut-technologie.png",
      banner: "/images/schools/banner-institut-tech.jpg",
      address: "Marcory, Abidjan",
      phone: "+225 20 30 40 55",
      email: "contact@ist.ci",
      website: "www.ist.ci",
      description: "Formation technique supérieure dans les domaines de l'ingénierie et de la technologie.",
      latitude: 5.310000,
      longitude: -4.040000,
      rating: 4.4,
      studentsCount: 800,
      foundedYear: 1985,
      activities: ["Ingénierie", "Technologie", "Innovation", "Recherche"],
      news: [
        {
          id: 6,
          title: "Projet de recherche en énergie solaire",
          content: "L'IST lance un projet de recherche innovant sur l'énergie solaire.",
          date: "2024-01-03",
          image: "/images/news/energie-solaire.jpg"
        }
      ]
    }
  ];

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
    // Simulation du chargement des données
    // setTimeout(() => {
      setSchools(mockSchools);
      setFilteredSchools(mockSchools);
    //   setLoading(false);
    // }, 1000);
  }, []);

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
        school.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    const filtered = schools.filter(school => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        school.latitude,
        school.longitude
      );
      return distance <= proximityRadius;
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

  if (loading) {
    return (
      <div className="schools-loading">
        <div className="loading-spinner">
          <i className="ph-spinner"></i>
          <p>Chargement des écoles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
        
        .schools-page {
          min-height: 100vh;
          background: #fefaf8;
          padding: 2rem 0;
        }

        .schools-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .schools-header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }

        .schools-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #000;
        }

        .schools-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          color: #666666;
        }

        .filters-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-label i {
          color: #ea580c;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }

        .filter-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }

        .proximity-section {
          background: #f8fafc;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 1rem;
        }

        .proximity-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .proximity-input {
          flex: 1;
          min-width: 120px;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
        }

        .proximity-btn {
          background: #ea580c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .proximity-btn:hover {
          background: #c2410c;
        }

        .reset-btn {
          background: #6b7280;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          margin-top: 1rem;
        }

        .reset-btn:hover {
          background: #4b5563;
        }

        .schools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .school-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s;
          cursor: pointer;
        }

        .school-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .school-banner {
          height: 150px;
          background: linear-gradient(45deg, #ea580c, #f97316);
          position: relative;
          overflow: hidden;
        }

        .school-logo {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .school-logo img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .school-content {
          padding: 2rem 1.5rem 1.5rem;
          text-align: center;
        }

        .school-name {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .school-level {
          display: inline-block;
          background: #ea580c;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .school-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .school-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .school-rating i {
          color: #fbbf24;
        }

        .school-students {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .school-students i {
          color: #ea580c;
        }

        .school-description {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .school-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }

        .action-btn {
          background: #ea580c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .action-btn:hover {
          background: #c2410c;
        }

        .action-btn.secondary {
          background: #6b7280;
        }

        .action-btn.secondary:hover {
          background: #4b5563;
        }

        .no-schools {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        .no-schools i {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .schools-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
          color: white;
        }

        .loading-spinner {
          text-align: center;
        }

        .loading-spinner i {
          font-size: 3rem;
          animation: spin 1s linear infinite;
        }

        .loading-spinner p {
          margin-top: 1rem;
          font-size: 1.1rem;
        }

        .navigation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(254, 250, 248, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(3px);
        }

        .navigation-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .nav-spinner-container {
          position: relative;
          width: 50px;
          height: 50px;
        }

        .nav-spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid #ea580c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .nav-spinner-ring:nth-child(2) {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-top-color: #f97316;
          animation-duration: 1.5s;
          animation-direction: reverse;
        }

        .nav-spinner-text {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          opacity: 0.8;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .schools-title {
            font-size: 2rem;
          }
          
          .filters-grid {
            grid-template-columns: 1fr;
          }
          
          .schools-grid {
            grid-template-columns: 1fr;
          }
          
          .proximity-controls {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

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
                        <div className="school-rating">
                          <i className="ph-star-fill"></i>
                          <span>{school.rating}</span>
                        </div>
                        <div className="school-students">
                          <i className="ph-users"></i>
                          <span>{school.studentsCount.toLocaleString()} élèves</span>
                        </div>
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
