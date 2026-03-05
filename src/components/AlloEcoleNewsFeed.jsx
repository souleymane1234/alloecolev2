import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight, Eye, User, BookOpen, GraduationCap, Settings, Play, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  
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
    setIsUserConnected(prev => {
      // Ne mettre à jour que si la valeur change vraiment
      if (prev !== connected) {
        return connected;
      }
      return prev;
    });
  }, [isAuthenticated]);

  // Fonction pour récupérer une page spécifique du feed
  const fetchFeedPage = async ({ pageParam = 1 }) => {
    console.log(`📥 Chargement page ${pageParam}...`);
    
    // Utiliser la nouvelle API /api/v1/news avec pagination
    const url = new URL('https://alloecoleapi-dev.up.railway.app/api/v1/news');
    // ✅ Filtrer le module "Actualités" uniquement (contentType = news)
    url.searchParams.set('module', 'news');
    url.searchParams.set('page', String(pageParam));
    url.searchParams.set('limit', '10');

    const response = await fetch(url.toString());
    
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    
    const result = await response.json();

    if (!result.success) throw new Error("Erreur API : success = false");

    // Transformer les données pour l'affichage
    const transformedData = result.data.map((item) => {
      const contentType = item.contentType || 'unknown';
      
      // Gérer les actualités (contentType: "news")
      if (contentType === 'news') {
        return {
          id: item.id,
          type: 'news',
          contentType: 'news',
          title: item.title || "Actualité sans titre",
          image: item.mainImage || "/images/poster/ecole.png",
          excerpt: item.summary || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          createdAt: item.createdAt,
          publishedAt: item.publishedAt,
          category: item.category?.name || item.category || null,
          author: item.author,
          slug: item.slug,
          content: item.content,
          sourceUrl: item.sourceUrl,
        };
      }

      // Gérer les publicités (contentType: "ad")
      if (contentType === 'ad') {
        return {
          id: item.id,
          type: 'ad',
          contentType: 'ad',
          adType: item.type, // BANNER ou VIDEO
          title: item.title || "Publicité",
          description: item.description || "",
          image: item.imageUrl || item.thumbnailUrl || "/images/poster/ecole.png",
          videoUrl: item.videoUrl || null,
          targetUrl: item.targetUrl || "#",
          isActive: item.isActive,
          displayOrder: item.displayOrder || 0,
          clickCount: item.clickCount || 0,
          viewCount: item.viewCount || 0,
          createdAt: item.createdAt,
          startDate: item.startDate,
          endDate: item.endDate,
        };
      }

      // Gérer les bourses d'études (contentType: "scholarship")
      if (contentType === 'scholarship') {
        return {
          id: item.id,
          type: 'scholarship',
          contentType: 'scholarship',
          title: item.title || "Bourse d'études",
          image: item.mainImage || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
        };
      }

      // Gérer les écoles (contentType: "school")
      if (contentType === 'school') {
        return {
          id: item.id,
          type: 'school',
          contentType: 'school',
          title: item.title || item.name || "École",
          image: item.mainImage || item.logo || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
        };
      }

      // Gérer les vidéos (contentType: "video")
      if (contentType === 'video') {
        return {
          id: item.id,
          type: 'video',
          contentType: 'video',
          title: item.title || "Vidéo",
          image: item.mainImage || item.thumbnailUrl || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
          videoUrl: item.videoUrl || item.url,
        };
      }

      // Gérer les vidéos de candidats (contentType: "candidate_video")
      if (contentType === 'candidate_video') {
        return {
          id: item.id,
          type: 'candidate_video',
          contentType: 'candidate_video',
          title: item.title || "Vidéo de candidat",
          image: item.mainImage || item.video?.thumbnailUrl || "/images/poster/ecole.png",
          excerpt: item.summary || item.video?.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || item.video?.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
          author: item.author,
          video: item.video,
        };
      }

      // Gérer les quiz (contentType: "quiz")
      if (contentType === 'quiz') {
        return {
          id: item.id,
          type: 'quiz',
          contentType: 'quiz',
          title: item.title || "Quiz",
          image: item.mainImage || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
        };
      }

      // Gérer les questionnaires (contentType: "questionnaire")
      if (contentType === 'questionnaire') {
        return {
          id: item.id,
          type: 'questionnaire',
          contentType: 'questionnaire',
          title: item.title || "Questionnaire",
          image: item.mainImage || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
        };
      }

      // Gérer les magazines (contentType: "magazine")
      if (contentType === 'magazine') {
        return {
          id: item.id,
          type: 'magazine',
          contentType: 'magazine',
          title: item.title || "Magazine",
          image: item.mainImage || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
        };
      }

      // Gérer les études à l'étranger (contentType: "foreign_study")
      if (contentType === 'foreign_study') {
        return {
          id: item.id,
          type: 'foreign_study',
          contentType: 'foreign_study',
          title: item.title || "Étude à l'étranger",
          image: item.mainImage || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
        };
      }

      // Gérer les produits marketplace (contentType: "product")
      if (contentType === 'product') {
        return {
          id: item.id,
          type: 'product',
          contentType: 'product',
          title: item.title || "Produit",
          image: item.mainImage || item.imageUrl || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
        };
      }

      // Gérer les permutations (contentType: "permutation")
      if (contentType === 'permutation') {
        return {
          id: item.id,
          type: 'permutation',
          contentType: 'permutation',
          title: item.title || "Permutation",
          image: item.mainImage || item.imageUrl || "/images/poster/ecole.png",
          excerpt: item.summary || item.description || "",
          date: item.publishedAt || item.createdAt
            ? new Date(item.publishedAt || item.createdAt).toLocaleDateString("fr-FR")
            : "Date inconnue",
          views: item.views || item.viewCount || 0,
          slug: item.slug,
          category: item.category?.name || item.category || null,
          moduleName: item.moduleName,
          publishedAt: item.publishedAt,
          createdAt: item.createdAt,
          // Préserver les données spécifiques aux permutations si disponibles
          user: item.user || null,
          niveau: item.niveau || null,
          filiere: item.filiere || null,
          origine: item.origine || item.sourceSchool || null,
          souhait: item.souhait || item.targetSchool || null,
          villeOrigine: item.villeOrigine || item.sourceCity || null,
          villeSouhaitee: item.villeSouhaitee || item.targetCity || null,
          annee: item.annee || item.year || null,
          status: item.status || null,
          correspondances: item.correspondances || item.matches || 0,
          vues: item.views || item.viewCount || 0,
        };
      }

      // Fallback pour les autres types (orientation, revision, document_request, play, emission, job_sheet)
      return {
        id: item.id,
        type: contentType,
        contentType: contentType,
        title: item.title || "Contenu",
        image: item.mainImage || item.imageUrl || "/images/poster/ecole.png",
        excerpt: item.summary || item.description || "",
        date: item.publishedAt || item.createdAt
          ? new Date(item.publishedAt || item.createdAt).toLocaleDateString("fr-FR")
          : "Date inconnue",
        views: item.views || item.viewCount || 0,
        slug: item.slug,
        category: item.category?.name || item.category || null,
        moduleName: item.moduleName,
        publishedAt: item.publishedAt,
        createdAt: item.createdAt,
      };
    });

    return {
      data: transformedData,
      pagination: result.pagination || {},
      nextPage: result.pagination && result.pagination.current_page < result.pagination.total_pages 
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
    refetch,
  } = useInfiniteQuery({
    queryKey: ['news-feed-infinite', { module: 'news', limit: 10 }], // Sépare du feed agrégé
    queryFn: fetchFeedPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes - les données sont considérées comme fraîches pendant 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes - temps de cache (anciennement cacheTime)
    refetchOnWindowFocus: false, // Ne pas refetch quand la fenêtre reprend le focus
    refetchOnMount: false, // Ne pas refetch à chaque montage du composant
    refetchOnReconnect: false, // Ne pas refetch lors de la reconnexion
    retry: 1, // Ne réessayer qu'une seule fois en cas d'erreur
  });

  // Observer pour le chargement infini
  useEffect(() => {
    // Ne créer l'observer que si on a une page suivante et qu'on n'est pas en train de charger
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
  // Utiliser useRef pour éviter de recréer l'écouteur à chaque render
  const handleScrollRef = useRef(handleScroll);
  useEffect(() => {
    handleScrollRef.current = handleScroll;
  }, [handleScroll]);

  useEffect(() => {
    const scrollHandler = () => {
      handleScrollRef.current();
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []); // Tableau de dépendances vide pour ne s'exécuter qu'une fois

  // Aplatir toutes les données des pages et dédupliquer par ID
  const allFeedDataRaw = data?.pages.flatMap(page => page.data) || [];
  // Dédupliquer les données en utilisant un Map pour garder la première occurrence de chaque ID
  const allFeedDataMap = new Map();
  allFeedDataRaw.forEach((item, index) => {
    const key = `${item.contentType || item.type || 'unknown'}-${item.id || `no-id-${index}`}`;
    if (!allFeedDataMap.has(key)) {
      allFeedDataMap.set(key, item);
    }
  });
  const allFeedData = Array.from(allFeedDataMap.values());

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

  // Ref pour suivre si on a déjà tenté de charger le profil
  const profileLoadedRef = useRef(false);
  
  // Charger le profil utilisateur (une seule fois si l'utilisateur est connecté)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    // Ne charger le profil que si l'utilisateur est connecté ET qu'on n'a pas encore chargé le profil
    if (token && isUserConnected && !user && !loadingProfile && !profileLoadedRef.current) {
      profileLoadedRef.current = true;
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
          profileLoadedRef.current = false; // Réinitialiser en cas d'erreur pour permettre un nouvel essai
        })
        .finally(() => setLoadingProfile(false));
    }
    
    // Si l'utilisateur n'est plus connecté, réinitialiser le profil et le ref
    if (!isUserConnected) {
      if (user) {
        setUser(null);
      }
      profileLoadedRef.current = false; // Réinitialiser pour permettre un nouveau chargement si l'utilisateur se reconnecte
    }
  }, [isUserConnected, user, loadingProfile]);

  // Fonction principale pour rendre le contenu selon son type
  const renderContentByType = (item) => {
    const contentType = item.contentType || item.type || 'unknown';
    
    switch (contentType) {
      case 'news':
        return renderActualiteCard(item);
      case 'ad':
        return renderAdCard(item);
      case 'scholarship':
        return renderBourseCard(item);
      case 'school':
        return renderEcoleCard(item);
      case 'video':
      case 'candidate_video':
        return renderVideoCard(item);
      case 'quiz':
      case 'play':
        return renderQuizCard(item);
      case 'questionnaire':
        return renderQuestionnaireCard(item);
      case 'magazine':
        return renderMagazineCard(item);
      case 'foreign_study':
        return renderForeignStudyCard(item);
      case 'product':
        return renderProductCard(item);
      case 'permutation':
        return renderPermutationCard(item);
      case 'orientation':
        return renderOrientationCard(item);
      case 'revision':
        return renderRevisionCard(item);
      case 'document_request':
        return renderDocumentRequestCard(item);
      case 'emission':
        return renderEmissionCard(item);
      case 'job_sheet':
        return renderJobSheetCard(item);
      default:
        return renderGenericCard(item);
    }
  };

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
          <button 
            className="link-button"
            onClick={() => {
              const targetSlug = item.slug || item.id;
              if (!targetSlug) return;

              navigate(`/actualites/${targetSlug}`, {
                state: { item },
              });
            }}
          >
            Lire la suite <ArrowRight className="icon-sm" />
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  // Fonction pour rendre les publicités (ads) - Affichage simplifié sans carte ni texte
  const renderAdCard = (item) => {
    // Publicité de type BANNER - Juste l'image avec badge
    if (item.adType === 'BANNER') {
      return (
        <div 
          className="ad-simple" 
          key={`ad-${item.id}`}
          onClick={() => {
            if (item.targetUrl && item.targetUrl !== '#') {
              window.open(item.targetUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          style={{ cursor: item.targetUrl && item.targetUrl !== '#' ? 'pointer' : 'default' }}
        >
          <div className="ad-badge-simple">
            <span className="badge badge-purple">Publicité</span>
          </div>
          <img src={item.image} alt={item.title || "Publicité"} className="ad-image" />
        </div>
      );
    }

    // Publicité de type VIDEO - Juste la vidéo avec badge
    if (item.adType === 'VIDEO') {
      return (
        <div className="ad-simple video-ad-simple" key={`ad-${item.id}`}>
          <div className="ad-badge-simple">
            <span className="badge badge-purple">Publicité</span>
          </div>
          {item.videoUrl ? (
            <video 
              className="ad-video"
              controls
              poster={item.image}
              onClick={(e) => {
                if (item.targetUrl && item.targetUrl !== '#') {
                  e.stopPropagation();
                  window.open(item.targetUrl, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <source src={item.videoUrl} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          ) : (
            <img src={item.image} alt={item.title || "Publicité"} className="ad-image" />
          )}
        </div>
      );
    }

    // Fallback pour les autres types de publicités
    return (
      <div className="ad-simple" key={`ad-${item.id}`}>
        <div className="ad-badge-simple">
          <span className="badge badge-purple">Publicité</span>
        </div>
        <img src={item.image} alt={item.title || "Publicité"} className="ad-image" />
      </div>
    );
  };

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
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges badges-wrap">
          <span className="badge badge-orange">Bourse d'études</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button 
            className="button-primary"
            onClick={() => {
              if (item.slug) {
                navigate(`/bourses/${item.slug}`);
              } else if (item.id) {
                navigate(`/bourses/${item.id}`);
              }
            }}
          >
            Voir les détails de la bourse
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderEcoleCard = (item) => (
    <div className="card" key={`ecole-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-orange">École</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button 
            className="button-secondary"
            onClick={() => {
              if (item.slug) {
                navigate(`/ecoles/${item.slug}`);
              } else if (item.id) {
                navigate(`/ecoles/${item.id}`);
              }
            }}
          >
            Découvrir l'établissement
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderPermutationCard = (item) => {
    // Gérer les données de permutation de la nouvelle API (structure simplifiée)
    const hasUserData = item.user && item.user.prenom && item.user.nom;
    const hasDetailedData = item.niveau && item.filiere && item.origine && item.souhait;
    
    return (
      <div className="card" key={`permutation-${item.id}`}>
        <div className="card-content">
          <div className="card-badges">
            <span className="badge badge-orange">Permutation</span>
            {item.status && <span className="badge badge-purple">{item.status}</span>}
            {item.category && <span className="badge badge-blue">{item.category}</span>}
            <div className="date-info">
              <Calendar className="icon-sm" />
              {item.date}
            </div>
          </div>
          
          {hasUserData && (
            <div className="permutation-user-info">
              <div className="user-avatar">
                {item.user.prenom?.[0] || ''}{item.user.nom?.[0] || ''}
              </div>
              <div className="user-details">
                <h4 className="user-name">
                  {item.user.prenom || ''} {item.user.nom || ''}
                </h4>
                {item.user.ville && (
                  <p className="user-location">
                    <MapPin className="icon-sm" />
                    {item.user.ville}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <h3 className="card-title">
            {hasDetailedData ? `${item.niveau} - ${item.filiere}` : item.title}
          </h3>
          
          {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
          
          {hasDetailedData && (
            <div className="permutation-path">
              <div className="path-item">
                <div className="path-dot"></div>
                <div>
                  <p className="path-label">École d'origine</p>
                  <p className="path-value">{item.origine}</p>
                  {item.villeOrigine && (
                    <p className="path-location">{item.villeOrigine}</p>
                  )}
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
                  {item.villeSouhaitee && (
                    <p className="path-location">{item.villeSouhaitee}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="permutation-meta">
            {item.annee && (
              <div className="year-info">
                <Calendar className="icon-sm icon-orange" />
                <span>Année: {item.annee}</span>
              </div>
            )}
            <div className="permutation-stats">
              <div className="stat-item">
                <Eye className="icon-sm" />
                <span>{item.views || item.vues || 0} vues</span>
              </div>
              {item.correspondances !== undefined && (
                <div className="stat-item">
                  <span className="correspondances-badge">
                    {item.correspondances} correspondance{item.correspondances > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="permutation-actions">
            {hasUserData && (
              <button 
                className="button-primary"
                onClick={() => {
                  setSelectedPermutation(item);
                  setShowContactModal(true);
                }}
              >
                Contacter
              </button>
            )}
            <button 
              className="button-secondary"
              onClick={() => {
                if (item.slug) {
                  navigate(`/permutations/${item.slug}`);
                } else if (item.id) {
                  navigate(`/permutations/${item.id}`);
                }
              }}
            >
              Voir détails
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderVideoCard = (item) => (
    <div className="card" key={`video-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-purple">Vidéo</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button 
            className="button-primary"
            onClick={() => {
              if (item.slug) {
                navigate(`/videos/${item.slug}`);
              } else if (item.id) {
                navigate(`/videos/${item.id}`);
              }
            }}
          >
            <Play className="icon-sm" />
            Regarder
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderQuestionnaireCard = (item) => (
    <div className="card" key={`questionnaire-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-purple">Questionnaire</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button 
            className="button-primary"
            onClick={() => {
              if (item.slug) {
                navigate(`/questionnaires/${item.slug}`);
              } else if (item.id) {
                navigate(`/questionnaires/${item.id}`);
              }
            }}
          >
            Commencer le questionnaire
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderMagazineCard = (item) => (
    <div className="card" key={`magazine-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-orange">Magazine</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button 
            className="button-primary"
            onClick={() => {
              if (item.slug) {
                navigate(`/magazines/${item.slug}`);
              } else if (item.id) {
                navigate(`/magazines/${item.id}`);
              }
            }}
          >
            Lire le magazine
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderForeignStudyCard = (item) => (
    <div className="card" key={`foreign-study-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-green">Étude à l'étranger</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button 
            className="button-primary"
            onClick={() => {
              if (item.slug) {
                navigate(`/etudes-etranger/${item.slug}`);
              } else if (item.id) {
                navigate(`/etudes-etranger/${item.id}`);
              }
            }}
          >
            En savoir plus
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderProductCard = (item) => (
    <div className="card" key={`product-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-orange">Marketplace</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button 
            className="button-primary"
            onClick={() => {
              if (item.slug) {
                navigate(`/marketplace/${item.slug}`);
              } else if (item.id) {
                navigate(`/marketplace/${item.id}`);
              }
            }}
          >
            Voir le produit
          </button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderOrientationCard = (item) => (
    <div className="card card-compact" key={`orientation-${item.id}`}>
      <div className="card-content card-content-compact">
        <div className="card-compact-header">
          <div className="card-badges">
            <span className="badge badge-purple">Orientation</span>
            <div className="date-info">
              <Calendar className="icon-sm" />
              {item.date}
            </div>
          </div>
          <h3 className="card-title card-title-compact">{item.title}</h3>
        </div>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="permutation-actions permutation-actions-compact">
          <button className="button-primary button-compact">Voir détails</button>
        </div>
      </div>
    </div>
  );

  const renderRevisionCard = (item) => (
    <div className="card card-compact" key={`revision-${item.id}`}>
      <div className="card-content card-content-compact">
        <div className="card-compact-header">
          <div className="card-badges">
            <span className="badge badge-blue">Révision</span>
            <div className="date-info">
              <Calendar className="icon-sm" />
              {item.date}
            </div>
          </div>
          <h3 className="card-title card-title-compact">{item.title}</h3>
        </div>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="permutation-actions permutation-actions-compact">
          <button className="button-primary button-compact">Commencer</button>
        </div>
      </div>
    </div>
  );

  const renderDocumentRequestCard = (item) => (
    <div className="card card-compact" key={`document-request-${item.id}`}>
      <div className="card-content card-content-compact">
        <div className="card-compact-header">
          <div className="card-badges">
            <span className="badge badge-orange">Demande de document</span>
            <div className="date-info">
              <Calendar className="icon-sm" />
              {item.date}
            </div>
          </div>
          <h3 className="card-title card-title-compact">{item.title}</h3>
        </div>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="permutation-actions permutation-actions-compact">
          <button className="button-primary button-compact">Voir détails</button>
        </div>
      </div>
    </div>
  );

  const renderEmissionCard = (item) => (
    <div className="card" key={`emission-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-purple">Émission</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button className="button-primary">Voir l'émission</button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderJobSheetCard = (item) => (
    <div className="card" key={`job-sheet-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-green">Fiche métier</span>
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <button className="button-primary">Voir la fiche</button>
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderGenericCard = (item) => (
    <div className="card" key={`generic-${item.id}`}>
      {item.image && <img src={item.image} alt={item.title} className="card-image" />}
      <div className="card-content">
        <div className="card-badges">
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        <div className="card-footer">
          <span className="views">{item.views} vues</span>
        </div>
      </div>
    </div>
  );

  const renderQuizCard = (item) => (
    <div 
      className="card quiz-card" 
      key={`quiz-${item.id}`}
      onClick={() => {
        if (item.slug) {
          navigate(`/quiz/${item.slug}`);
        } else if (item.id) {
          navigate(`/quiz/${item.id}`);
        } else {
          navigate('/quiz');
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {item.image && (
        <div className="quiz-card-image-wrapper">
          <img src={item.image} alt={item.title} className="card-image quiz-card-image" />
          <div className="quiz-card-overlay">
            <Play className="quiz-play-icon" />
          </div>
          <div className="quiz-card-badge">
            <span className="badge badge-purple">Quiz</span>
          </div>
        </div>
      )}
      <div className="card-content">
        <div className="card-badges">
          {item.difficulty && <span className="badge badge-orange">{item.difficulty}</span>}
          {item.category && <span className="badge badge-blue">{item.category}</span>}
          <div className="date-info">
            <Calendar className="icon-sm" />
            {item.date}
          </div>
        </div>
        <h3 className="card-title">{item.title}</h3>
        {item.excerpt && <p className="card-excerpt">{item.excerpt}</p>}
        {(item.questions || item.players) && (
          <div className="quiz-card-stats">
            {item.questions && (
              <div className="quiz-stat">
                <BookOpen className="icon-sm icon-purple" />
                <span>{item.questions} questions</span>
              </div>
            )}
            {item.players && (
              <div className="quiz-stat">
                <User className="icon-sm icon-purple" />
                <span>{typeof item.players === 'number' ? item.players.toLocaleString() : item.players} joueurs</span>
              </div>
            )}
          </div>
        )}
        {item.topPrize && (
          <div className="quiz-card-prize">
            <span className="prize-label">Lot principal :</span>
            <span className="prize-amount">{item.topPrize}</span>
          </div>
        )}
        <div className="card-footer">
          <button 
            className="button-primary quiz-play-button"
            onClick={(e) => {
              e.stopPropagation();
              if (item.slug) {
                navigate(`/quiz/${item.slug}`);
              } else if (item.id) {
                navigate(`/quiz/${item.id}`);
              } else {
                navigate('/quiz');
              }
            }}
          >
            <Play className="icon-sm" />
            Jouer maintenant
          </button>
          <span className="views">{item.views || 0} vues</span>
        </div>
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
                {/* Barre de recherche */}
                <div className="home-search-section">
                  <form className="home-search-form" onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim().length >= 2) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}>
                    <div className="home-search-input-wrapper">
                      <Search className="home-search-icon" />
                      <input
                        type="text"
                        className="home-search-input"
                        placeholder="Rechercher dans toute l'application..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="home-search-button">
                      Rechercher
                    </button>
                    <button
                      type="button"
                      className="home-refresh-button"
                      onClick={() => refetch()}
                      disabled={isFetching}
                      aria-busy={isFetching ? 'true' : 'false'}
                      title="Recharger les actualités"
                    >
                      {isFetching ? 'Actualisation…' : 'Actualiser'}
                    </button>
                  </form>
                </div>

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
                    // Générer une clé unique en combinant contentType, id et index
                    const uniqueKey = `${item.contentType || item.type || 'unknown'}-${item.id || 'no-id'}-${index}`;
                    
                    // Ajouter une bannière après les 2 premiers éléments de l'API
                    if (index === 2) {
                      return (
                        <React.Fragment key={`banner-${index}-${uniqueKey}`}>
                          <Banner
                            imageSrc="/images/pub/banniere1.jpg"
                            altText="Alertes SMS - Permutations"
                            size="lg"
                            className="content-banner"
                            linkUrl="#"
                          />
                          {renderContentByType(item)}
                        </React.Fragment>
                      );
                    }

                    return (
                      <React.Fragment key={uniqueKey}>
                        {renderContentByType(item)}
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