import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight, Eye, User, BookOpen, GraduationCap, Settings, Play } from 'lucide-react';
import ContactAlloEcoleService from './ContactAlloEcoleService';
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from 'axios';
import './AlloEcoleNewsFeed.css';
import UserProfileSidebar from './userComponent/UserProfileSidebar';
import Banner from './banner/Banner';
import './banner/Banner.css';

const AlloEcoleNewsFeed = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useOutletContext() || {};
  const token = localStorage.getItem("access_token");
  
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPermutation, setSelectedPermutation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const observerTarget = useRef(null);
  const promoSlides = useMemo(() => [
    {
      id: 1,
      image: '/images/pub/banniere2.jpg',
      eyebrow: 'Alertes concours',
      title: 'Soyez averti avant tout le monde',
      description: 'Recevez des notifications SMS et e-mail sur les concours et bourses qui vous concernent.',
      cta: 'Activer les alertes',
      linkUrl: '#'
    },
    {
      id: 2,
      image: '/images/pub/banniere1.jpg',
      eyebrow: 'Orientation',
      title: 'Sessions express avec nos coachs',
      description: '30 minutes pour clarifier votre projet de formation et décrocher l’école idéale.',
      cta: 'Réserver un créneau',
      linkUrl: '#'
    },
    {
      id: 3,
      image: '/images/pub/banniere3.jpg',
      eyebrow: 'Permutations',
      title: 'Publiez votre demande premium',
      description: 'Mettez votre dossier en avant et doublez vos chances de trouver un correspondant.',
      cta: 'Voir les offres',
      linkUrl: '#'
    }
  ], []);
  const statsHighlights = useMemo(() => [
    {
      label: 'Écoles partenaires',
      value: '1 247',
      sub: '+32 cette semaine',
      trend: '+18%'
    },
    {
      label: 'Bourses actives',
      value: '89',
      sub: '12 nouvelles',
      trend: '+6%'
    },
    {
      label: 'Permutations publiées',
      value: '456',
      sub: '34 en attente',
      trend: '+11%'
    }
  ], []);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % promoSlides.length);
  }, [promoSlides.length]);

  const handlePrevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  }, [promoSlides.length]);

  useEffect(() => {
    const timer = setInterval(handleNextSlide, 7000);
    return () => clearInterval(timer);
  }, [handleNextSlide]);

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
    console.log(`📥 Chargement page ${pageParam}...`);
    
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
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['feed-infinite'],
    queryFn: fetchFeedPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Observer pour le chargement infini
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('🎯 Observer déclenche le chargement...');
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Fonction pour charger plus d'éléments quand on scroll (fallback)
  const handleScroll = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 100) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Ajouter l'écouteur de scroll (fallback si IntersectionObserver ne fonctionne pas)
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Aplatir toutes les données des pages
  const allFeedData = data?.pages.flatMap(page => page.data) || [];

  // Données statiques pour les quiz uniquement
  const quizCardsForFeed = [
    {
      id: 15,
      type: "quiz",
      title: "Quiz Histoire",
      image: "/img/quiz.jpeg",
      questions: 18,
      players: 1250,
      topPrize: "10 000 FCFA",
      difficulty: "Moyen",
      date: "11/12/2025"
    },
    {
      id: 16,
      type: "quiz",
      title: "Quiz Culture Générale",
      image: "/img/quiz.jpeg",
      questions: 20,
      players: 2100,
      topPrize: "15 000 FCFA",
      difficulty: "Difficile",
      date: "11/12/2025"
    },
    {
      id: 17,
      type: "quiz",
      title: "Quiz Sciences",
      image: "/img/quiz.jpeg",
      questions: 22,
      players: 1580,
      topPrize: "12 000 FCFA",
      difficulty: "Difficile",
      date: "11/12/2025"
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
    <div className="card card-compact" key={`transfer-${item.id}`}>
      <div className="card-content card-content-compact">
        <div className="card-compact-header">
        <div className="card-badges">
          <span className="badge badge-purple">Transfert</span>
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
          <h3 className="card-title card-title-compact">Demande de transfert</h3>
        </div>
        <div className="permutation-path permutation-path-compact">
          <div className="path-item path-item-compact">
            <div className="path-dot"></div>
            <div>
              <p className="path-label path-label-compact">Source</p>
              <p className="path-value path-value-compact">{item.sourceInstitution}</p>
            </div>
          </div>
          <div className="path-arrow path-arrow-compact">
            <ChevronRight className="icon-md" />
          </div>
          <div className="path-item path-item-compact">
            <div className="path-dot"></div>
            <div>
              <p className="path-label path-label-compact">Cible</p>
              <p className="path-value path-value-compact">{item.targetInstitution}</p>
            </div>
          </div>
        </div>
        <div className="permutation-actions permutation-actions-compact">
          <button className="button-primary button-compact">Contacter</button>
          <button className="button-secondary button-compact">Détails</button>
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

  const renderQuizCard = (item) => (
    <div 
      className="card quiz-card" 
      key={`quiz-${item.id}`}
      onClick={() => navigate('/quiz')}
      style={{ cursor: 'pointer' }}
    >
      <div className="quiz-card-image-wrapper">
        <img src={item.image} alt={item.title} className="card-image quiz-card-image" />
        <div className="quiz-card-overlay">
          <Play className="quiz-play-icon" />
        </div>
        <div className="quiz-card-badge">
          <span className="badge badge-purple">Quiz</span>
        </div>
      </div>
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-orange">{item.difficulty}</span>
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <div className="quiz-card-stats">
          <div className="quiz-stat">
            <BookOpen className="icon-sm icon-purple" />
            <span>{item.questions} questions</span>
          </div>
          <div className="quiz-stat">
            <User className="icon-sm icon-purple" />
            <span>{item.players.toLocaleString()} joueurs</span>
          </div>
        </div>
        <div className="quiz-card-prize">
          <span className="prize-label">Lot principal :</span>
          <span className="prize-amount">{item.topPrize}</span>
        </div>
        <button 
          className="button-primary quiz-play-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/quiz');
          }}
        >
          <Play className="icon-sm" />
          Jouer maintenant
        </button>
      </div>
    </div>
  );

  // Carte quiz compacte pour le fil d'actualité
  const renderCompactQuizCard = (item, index = 0) => {
    const quizItem = quizCardsForFeed[index % quizCardsForFeed.length];
    if (!quizItem) return null;
    
    return (
      <div 
        className="card quiz-card-compact" 
        key={`quiz-compact-${quizItem.id}-${Date.now()}`}
        onClick={() => navigate('/quiz')}
        style={{ cursor: 'pointer' }}
      >
        <div className="quiz-compact-content">
          <div className="quiz-compact-image">
            <img src={quizItem.image} alt={quizItem.title} />
            <div className="quiz-compact-overlay">
              <Play className="quiz-compact-play-icon" />
            </div>
          </div>
          <div className="quiz-compact-info">
            <div className="quiz-compact-header">
              <span className="badge badge-purple">Quiz</span>
              <span className="badge badge-orange">{quizItem.difficulty}</span>
            </div>
            <h3 className="quiz-compact-title">{quizItem.title}</h3>
            <div className="quiz-compact-meta">
              <span>{quizItem.questions} questions</span>
              <span>•</span>
              <span>{quizItem.players.toLocaleString()} joueurs</span>
            </div>
            <div className="quiz-compact-prize">
              <span>🎁 {quizItem.topPrize}</span>
            </div>
            <button 
              className="quiz-compact-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/quiz');
              }}
            >
              <Play className="icon-sm" />
              Jouer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RightSidebar = () => {
    return (
      <div className="sidebar-right-content">
        {/* Section Vidéo */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">WebTV</h3>
          <div className="video-container">
            <video 
              controls
              autoPlay
              muted
              loop
              playsInline
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

        <div className="sidebar-section promo-slider">
          <div className="slider-viewport">
            {promoSlides.map((slide, index) => (
              <article
                key={slide.id}
                className={`promo-slide ${index === activeSlide ? 'is-active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
                aria-hidden={index !== activeSlide}
              >
                <div className="promo-overlay"></div>
                <div className="promo-content">
                  {/* <span className="promo-eyebrow">{slide.eyebrow}</span> */}
                  {/* <h4 className="promo-title">{slide.title}</h4>
                  <p className="promo-description">{slide.description}</p> */}
                  <a href={slide.linkUrl} className="promo-cta">
                    {slide.cta}
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
            <button
              className="slider-nav nav-prev"
              type="button"
              onClick={handlePrevSlide}
              aria-label="Voir la slide précédente"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="slider-nav nav-next"
              type="button"
              onClick={handleNextSlide}
              aria-label="Voir la slide suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="slider-dots" role="tablist">
            {promoSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`slider-dot ${index === activeSlide ? 'is-active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Afficher ${slide.title}`}
                aria-selected={index === activeSlide}
              />
            ))}
          </div>
        </div>
  
        {/* Section Actions rapides */}
        {/* <div className="sidebar-section">
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
          </div>
        </div> */}
  
        {/* Section Statistiques */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Statistiques & insights</h3>
          <div className="insights-grid">
            {statsHighlights.map((insight) => (
              <div className="insight-card" key={insight.label}>
                <div className="insight-top">
                  <span className="insight-label">{insight.label}</span>
                  <span className="insight-trend">{insight.trend}</span>
                </div>
                <div className="insight-value">{insight.value}</div>
                <p className="insight-sub">{insight.sub}</p>
              </div>
            ))}
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
  };
  

  return (
    <>
      {loadingProfile && (
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
                    <div className="school-detail-loading">
                      <div className="loading-spinner">
                        <div className="spinner-container">
                          <div className="spinner-ring"></div>
                          <div className="spinner-ring"></div>
                          <div className="spinner-ring"></div>
                        </div>
                        <div className="loading-text">Chargement des actualités...</div>
                      </div>
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
                    // Ajouter une bannière après les 2 premiers éléments de l'API
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

                    return (
                      <React.Fragment key={`item-${item.id || index}`}>
                        {item.type === 'news' && renderActualiteCard(item)}
                        {item.type === 'transfer' && renderTransferCard(item)}
                        {item.type === 'quiz' && renderQuizCard(item)}
                      </React.Fragment>
                    );
                  })}

                  {/* Cible pour l'observation du scroll */}
                  {hasNextPage && (
                    <div 
                      ref={observerTarget}
                      style={{ 
                        height: '20px', 
                        gridColumn: '1 / -1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {isFetchingNextPage && (
                        <div className="loading-text">Chargement...</div>
                      )}
                    </div>
                  )}

                  {/* Indicateur de chargement pour les pages suivantes */}
                  {isFetchingNextPage && (
                    <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
                      <div className="loading-spinner">
                        <div className="spinner-container">
                          <div className="spinner-ring"></div>
                          <div className="spinner-ring"></div>
                          <div className="spinner-ring"></div>
                        </div>
                        <div className="loading-text">Chargement des actualités suivantes...</div>
                      </div>
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

                  {/* Message si pas de données */}
                  {!isLoading && allFeedData.length === 0 && (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '3rem', 
                      gridColumn: '1 / -1',
                      color: '#666'
                    }}>
                      <p>Aucune actualité disponible pour le moment.</p>
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