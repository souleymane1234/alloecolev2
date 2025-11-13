import React, { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, ArrowRight, ChevronRight, Eye, User, BookOpen, GraduationCap, Settings } from 'lucide-react';
import ContactAlloEcoleService from './ContactAlloEcoleService';
import { Link, useOutletContext } from "react-router-dom";
import axios from 'axios';
import './AlloEcoleNewsFeed.css';
import UserProfileSidebar from './userComponent/UserProfileSidebar';
import Banner from './banner/Banner';
import './banner/Banner.css';

const AlloEcoleNewsFeed = () => {
  const { isAuthenticated } = useOutletContext() || {};
  const token = localStorage.getItem("access_token");
  
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPermutation, setSelectedPermutation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
    
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const connected = !!token || isAuthenticated;
    setIsUserConnected(connected);
  }, [isAuthenticated]);

  // Fonction pour récupérer une page spécifique du feed
  const fetchFeedPage = async ({ pageParam = 1 }) => {
    const response = await fetch(`https://alloecoleapi-dev.up.railway.app/api/v1/students/feed?page=${pageParam}`);
    
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    
    const result = await response.json();

    if (!result.success) throw new Error("Erreur API : success = false");

    // Transformer les données pour l'affichage
    const transformedData = result.data.map((item) => {
      const baseItem = {
        id: item.id,
        type: item.type,
        title: item.title || "Actualité sans titre",
        image: item.mainImage || "/images/poster/ecole.png",
        excerpt: item.summary || "",
        date: item.publishedAt
          ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
          : "Date inconnue",
        views: item.views || 0,
        createdAt: item.createdAt,
        category: item.category,
      };

      // Ajouter les propriétés spécifiques au type
      if (item.type === 'transfer') {
        return {
          ...baseItem,
          sourceInstitution: item.sourceInstitution,
          targetInstitution: item.targetInstitution,
        };
      }

      if (item.type === 'news') {
        return {
          ...baseItem,
          publishedAt: item.publishedAt,
        };
      }

      return baseItem;
    });

    return {
      data: transformedData,
      pagination: result.pagination,
      nextPage: result.pagination.current_page < result.pagination.total_pages 
        ? result.pagination.current_page + 1 
        : undefined
    };
  };

  // UseInfiniteQuery pour le chargement infini
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['feed-infinite'],
    queryFn: fetchFeedPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fonction pour charger plus d'éléments quand on scroll
  const handleScroll = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Charger plus quand on est à 100px du bas
    if (scrollTop + windowHeight >= documentHeight - 100) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Ajouter l'écouteur de scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Aplatir toutes les données des pages
  const allFeedData = data?.pages.flatMap(page => page.data) || [];

  // Données statiques pour les autres types
  const staticData = [
    {
      id: 2,
      type: "bourse",
      title: "Programme doctoral de littérature de l'Université de Bâle (Suisse)",
      published: "06/10/2025",
      deadline: "16/11/2025",
      typeEtude: "Doctorat",
      country: "Suisse",
      image: "/images/poster/bourse.jpg"
    },
    {
      id: 3,
      type: "ecole",
      name: "COLLÈGE PRIVÉ NOTRE DAME DES LAGUNES DE YOPOUGON MILLIONNAIRE",
      location: "Yopougon, Côte d'Ivoire",
      typeEcole: "Collège Privé",
      image: "/images/poster/ecole.png",
      description: "Établissement d'excellence offrant un enseignement de qualité avec des infrastructures modernes et un personnel qualifié."
    },
    {
      id: 5,
      type: "permutation",
      niveau: "BTS 1",
      filiere: "Génie Informatique",
      annee: "2024-2025",
      origine: "Grande école ASTC",
      villeOrigine: "Abidjan",
      souhait: "Université de Amérique",
      villeSouhaitee: "Abidjan",
      status: "En cours",
      date: "15/10/2025",
      user: {
        nom: "Kouassi",
        prenom: "Jean",
        ville: "Abidjan"
      },
      vues: 45,
      correspondances: 3
    },
    {
      id: 6,
      type: "bourse",
      title: "Bourse d'étude doctorat en recrutement et égalité dans l'enseignement des sciences et de l'ingénierie",
      published: "29/09/2025",
      deadline: "04/11/2025",
      typeEtude: "Doctorat",
      country: "International",
      image: "/images/poster/ecole.png"
    },
    {
      id: 7,
      type: "ecole",
      name: "COLLEGE AHIMSA",
      location: "Abidjan, Côte d'Ivoire",
      typeEcole: "Collège",
      image: "/images/poster/ecole.png",
      description: "Institution reconnue pour son approche pédagogique innovante et son engagement envers la réussite de chaque élève."
    },
    {
      id: 9,
      type: "permutation",
      niveau: "Master 1",
      filiere: "Commerce",
      annee: "2024-2025",
      origine: "Université Félix Houphouët Boigny",
      villeOrigine: "Abidjan",
      souhait: "Université de Strasbourg",
      villeSouhaitee: "Strasbourg, France",
      status: "En cours",
      date: "12/10/2025",
      user: {
        nom: "Traoré",
        prenom: "Fatou",
        ville: "Bouaké"
      },
      vues: 78,
      correspondances: 1
    },
    {
      id: 10,
      type: "bourse",
      title: "Bourse d'études de l'Université de Lausanne UNIL, 2026/2027",
      published: "29/09/2025",
      deadline: "01/11/2025",
      typeEtude: "Master/Doctorat",
      country: "Suisse",
      image: "/images/poster/bourse.jpg"
    },
    {
      id: 11,
      type: "ecole",
      name: "COLLEGE ABOUDRAMANE TRAORE PK 18",
      location: "Abobo, Côte d'Ivoire",
      typeEcole: "Collège",
      image: "/images/poster/ecole.png",
      description: "Établissement public offrant un enseignement de qualité accessible à tous avec un encadrement professionnel."
    },
    {
      id: 13,
      type: "permutation",
      niveau: "Licence 3",
      filiere: "Génie Civil",
      annee: "2024-2025",
      origine: "LEGACY INSTITUT",
      villeOrigine: "Abidjan",
      souhait: "Campus France",
      villeSouhaitee: "Paris, France",
      status: "En cours",
      date: "10/10/2025",
      user: {
        nom: "Koné",
        prenom: "Moussa",
        ville: "Yamoussoukro"
      },
      vues: 92,
      correspondances: 2
    },
    {
      id: 14,
      type: "ecole",
      name: "INSTITUT SECONDAIRE FAMORY",
      location: "Marcory, Côte d'Ivoire",
      typeEcole: "Institut Secondaire",
      image: "/images/poster/ecole.png",
      description: "Institut moderne spécialisé dans la formation technique et professionnelle avec des équipements de pointe."
    }
  ];

  // Charger le profil utilisateur
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (token && isUserConnected) {
      setLoadingProfile(true);
      axios
        .get(`https://alloecoleapi-dev.up.railway.app/api/v1/profile/student`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data.data);
        })
        .catch((error) => {
          console.error('❌ Erreur profil :', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsUserConnected(false);
            setUser(null);
          }
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [isUserConnected]);

  // Fonctions de rendu
  const renderActualiteCard = (item) => (
    <div className="card" key={`news-${item.id}`}>
      <img src={item.image} alt={item.title} className="card-image" />
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-orange">Actualité</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-excerpt">{item.excerpt}</p>
        <div className="card-footer">
          <button className="link-button">
            Lire la suite <ArrowRight className="icon-sm" />
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderTransferCard = (item) => (
    <div className="card" key={`transfer-${item.id}`}>
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-purple">Transfert</span>
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">Demande de transfert</h3>
        <div className="permutation-path">
          <div className="path-item">
            <div className="path-dot"></div>
            <div>
              <p className="path-label">Établissement source</p>
              <p className="path-value">{item.sourceInstitution}</p>
            </div>
          </div>
          <div className="path-arrow">
            <ChevronRight className="icon-lg" />
          </div>
          <div className="path-item">
            <div className="path-dot"></div>
            <div>
              <p className="path-label">Établissement cible</p>
              <p className="path-value">{item.targetInstitution}</p>
            </div>
          </div>
        </div>
        <div className="permutation-actions">
          <button className="button-primary">Contacter</button>
          <button className="button-secondary">Voir détails</button>
        </div>
      </div>
    </div>
  );

  const renderBourseCard = (item) => (
    <div className="card" key={`bourse-${item.id}`}>
      <img src={item.image} alt={item.title} className="card-image" />
      <div className="card-content">
        <div className="card-badges badges-wrap">
          <span className="badge badge-orange">Bourse d'études</span>
          <span className="badge badge-blue">{item.typeEtude}</span>
          <span className="badge badge-green">{item.country}</span>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <div className="info-list">
          <div className="info-item">
            <Calendar className="icon-md icon-orange" />
            <span>Publié le: {item.published}</span>
          </div>
          <div className="info-item deadline">
            <Clock className="icon-md" />
            <span>Date limite: {item.deadline}</span>
          </div>
        </div>
        <button className="button-primary">Voir les détails de la bourse</button>
      </div>
    </div>
  );

  const renderEcoleCard = (item) => (
    <div className="card" key={`ecole-${item.id}`}>
      <img src={item.image} alt={item.name} className="card-image" />
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-orange">{item.typeEcole}</span>
        </div>
        <h3 className="card-title">{item.name}</h3>
        <div className="location-info">
          <MapPin className="icon-md icon-orange" />
          <span>{item.location}</span>
        </div>
        <p className="card-excerpt">{item.description}</p>
        <button className="button-secondary">Découvrir l'établissement</button>
      </div>
    </div>
  );

  const renderPermutationCard = (item) => (
    <div className="card" key={`permutation-${item.id}`}>
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-orange">Permutation</span>
          <span className="badge badge-purple">{item.status}</span>
        </div>
        <div className="permutation-user-info">
          <div className="user-avatar">
            {item.user.prenom[0]}{item.user.nom[0]}
          </div>
          <div className="user-details">
            <h4 className="user-name">{item.user.prenom} {item.user.nom}</h4>
            <p className="user-location">
              <MapPin className="icon-sm" />
              {item.user.ville}
            </p>
          </div>
        </div>
        <h3 className="card-title">{item.niveau} - {item.filiere}</h3>
        <div className="permutation-path">
          <div className="path-item">
            <div className="path-dot"></div>
            <div>
              <p className="path-label">École d'origine</p>
              <p className="path-value">{item.origine}</p>
              <p className="path-location">{item.villeOrigine}</p>
            </div>
          </div>
          <div className="path-arrow">
            <ChevronRight className="icon-lg" />
          </div>
          <div className="path-item">
            <div className="path-dot"></div>
            <div>
              <p className="path-label">École souhaitée</p>
              <p className="path-value">{item.souhait}</p>
              <p className="path-location">{item.villeSouhaitee}</p>
            </div>
          </div>
        </div>
        <div className="permutation-meta">
          <div className="year-info">
            <Calendar className="icon-sm icon-orange" />
            <span>Année: {item.annee}</span>
          </div>
          <div className="permutation-stats">
            <div className="stat-item">
              <Eye className="icon-sm" />
              <span>{item.vues} vues</span>
            </div>
            <div className="stat-item">
              <span className="correspondances-badge">
                {item.correspondances} correspondance{item.correspondances > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="permutation-actions">
          <button 
            className="button-primary"
            onClick={() => {
              setSelectedPermutation(item);
              setShowContactModal(true);
            }}
          >
            Contacter
          </button>
          <button className="button-secondary">Voir détails</button>
        </div>
      </div>
    </div>
  );

  const RightSidebar = () => (
    <div className="sidebar-right-content">
      <Banner
        imageSrc="/images/pub/banniere2.jpg"
        altText="Alertes SMS - Permutations"
        size="md"
        className="sidebar-banner"
        linkUrl="#"
      />
      
      {/* Section Vidéo */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">WebTV</h3>
        <div className="video-container">
          <video 
            controls 
            className="sidebar-video"
            poster="/images/poster/poster.jpg"
          >
            <source src="/video/video.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          <div className="video-description">
            <h6 className="sidebar-webTV-title">Découvrez notre WebTV</h6>
          </div>
        </div>
      </div>

      {/* Section Écoles recommandées */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Écoles recommandées</h3>
        <div className="school-ad">
          <div className="ad-image">
            <img src="/images/poster/ecole.png" alt="École recommandée" />
          </div>
          <div className="ad-content">
            <h5>COLLÈGE PRIVÉ EXCELLENCE</h5>
            <p>Abidjan, Plateau</p>
            <button className="btn-ad">Découvrir</button>
          </div>
        </div>
        
        <div className="school-ad">
          <div className="ad-image">
            <img src="/images/poster/ecole.png" alt="École recommandée" />
          </div>
          <div className="ad-content">
            <h5>INSTITUT MODERNE</h5>
            <p>Yopougon</p>
            <button className="btn-ad">Visiter</button>
          </div>
        </div>
      </div>

      {/* Section Actions rapides */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Actions rapides</h3>
        <div className="quick-actions-grid">
          <button className="action-card">
            <GraduationCap className="icon-md" />
            <span>Postuler à une bourse</span>
          </button>
          <button className="action-card">
            <BookOpen className="icon-md" />
            <span>Créer un dossier</span>
          </button>
          <button className="action-card">
            <User className="icon-md" />
            <span>Demande de permutation</span>
          </button>
          <button className="action-card">
            <Settings className="icon-md" />
            <span>Contacter le support</span>
          </button>
        </div>
      </div>

      {/* Section Statistiques */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Statistiques</h3>
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-number">1,247</div>
            <div className="stat-label">Écoles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">89</div>
            <div className="stat-label">Bourses actives</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">456</div>
            <div className="stat-label">Permutations</div>
          </div>
        </div>
      </div>

      {/* Section Événements à venir */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Événements à venir</h3>
        <div className="event-item">
          <div className="event-date">
            <span className="event-day">15</span>
            <span className="event-month">NOV</span>
          </div>
          <div className="event-details">
            <h6>Salon de l'orientation</h6>
            <p>Abidjan, Plateaux</p>
          </div>
        </div>
        <div className="event-item">
          <div className="event-date">
            <span className="event-day">20</span>
            <span className="event-month">NOV</span>
          </div>
          <div className="event-details">
            <h6>Journée portes ouvertes</h6>
            <p>Université de Cocody</p>
          </div>
        </div>
      </div>

      {/* Footer - Liens utiles */}
      <div className="sidebar-footer">
        <div className="footer-links">
          <a href="/about" className="footer-link">À propos</a>
          <a href="/help" className="footer-link">Centre d'aide</a>
          <a href="/privacy" className="footer-link">Confidentialité</a>
          <a href="/terms" className="footer-link">Conditions</a>
          <a href="/advertising" className="footer-link">Publicité</a>
          <a href="/contact" className="footer-link">Nous contacter</a>
        </div>
        
        <div className="footer-brand">
          <span className="brand-name">Allo Ecole</span>
          <span className="copyright">© 2025</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {loadingProfile && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Chargement du profil...</p>
        </div>
      )}
      
      <div className="container-fluid bg-[#fdfaf8ff]">
        <section className="section">
          <div className="max-width">
            <div className="main-layout">
              {/* Sidebar Left - Profil utilisateur */}
              <aside className="sidebar sidebar-left">
                <UserProfileSidebar />
              </aside>

              {/* Content Area - Actualités */}
              <div className="content-area">
                <div className="grid">
                  {/* Chargement initial */}
                  {isLoading && (
                    <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
                      <p>Chargement des actualités...</p>
                    </div>
                  )}

                  {/* Erreur */}
                  {isError && (
                    <div style={{ 
                      padding: '1rem', 
                      margin: '1rem', 
                      background: '#fee2e2', 
                      color: '#dc2626', 
                      borderRadius: '0.5rem',
                      gridColumn: '1 / -1'
                    }}>
                      ⚠️ {error.message}
                    </div>
                  )}

                  {/* Données de l'API avec pagination infinie */}
                  {allFeedData.map((item, index) => {
                    // Ajouter une bannière après les 2 premiers éléments
                    if (index === 2) {
                      return (
                        <React.Fragment key={`banner-${index}`}>
                          <Banner
                            imageSrc="/images/pub/banniere1.jpg"
                            altText="Alertes SMS - Permutations"
                            size="lg"
                            className="content-banner"
                            linkUrl="#"
                          />
                          {item.type === 'news' && renderActualiteCard(item)}
                          {item.type === 'transfer' && renderTransferCard(item)}
                        </React.Fragment>
                      );
                    }

                    // Rendu normal des éléments
                    if (item.type === 'news') return renderActualiteCard(item);
                    if (item.type === 'transfer') return renderTransferCard(item);
                    
                    return null;
                  })}

                  {/* Données statiques mélangées */}
                  {/* {staticData.slice(0, 4).map((item, index) => {
                    if (item.type === 'bourse') return renderBourseCard(item);
                    if (item.type === 'ecole') return renderEcoleCard(item);
                    if (item.type === 'permutation') return renderPermutationCard(item);
                    return null;
                  })} */}

                  {/* Indicateur de chargement pour les pages suivantes */}
                  {isFetchingNextPage && (
                    <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
                      <p>Chargement des actualités suivantes...</p>
                    </div>
                  )}

                  {/* Message quand il n'y a plus de données */}
                  {!hasNextPage && allFeedData.length > 0 && (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '2rem', 
                      gridColumn: '1 / -1',
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      <p>Vous avez vu toutes les actualités</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Right - Pubs et actions rapides */}
              <aside className="sidebar sidebar-right">
                <RightSidebar />
              </aside>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de contact */}
      {showContactModal && (
        <ContactAlloEcoleService
          permutationId={selectedPermutation?.id}
          onClose={() => {
            setShowContactModal(false);
            setSelectedPermutation(null);
          }}
        />
      )}
    </>
  );
};

export default AlloEcoleNewsFeed;