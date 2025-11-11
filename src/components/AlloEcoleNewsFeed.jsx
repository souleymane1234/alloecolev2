import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, ArrowRight, ChevronRight, Eye, User, BookOpen, GraduationCap, Settings, Bell, LogIn } from 'lucide-react';
import ContactAlloEcoleService from './ContactAlloEcoleService';
import { Link, useLocation, useOutletContext } from "react-router-dom";
import axios from 'axios';
import './AlloEcoleNewsFeed.css';
import UserProfileSidebar from './userComponent/UserProfileSidebar';

const AlloEcoleNewsFeed = () => {
  const { isAuthenticated } = useOutletContext() || {};
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  console.log('token dans AlloEcoleNewsFeed:', token);
  // const isConnect = location.state?.isConnect || false;

  const [isUserConnected, setIsUserConnected] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPermutation, setSelectedPermutation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [actualites, setActualites] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [pagination, setPagination] = useState(null);

  // Détection de la taille d'écran au chargement et au redimensionnement


  React.useEffect(() => {
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
    
    console.log("🔍 État connexion AlloEcoleNewsFeed:", {
      token: token ? "Présent" : "Absent",
      isAuthenticated,
      connected
    });
  }, [isAuthenticated]);

  // Données statiques pour les autres types (bourses, écoles, permutations)
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

  // Fonction pour rafraîchir le token d'accès
  const getNewAccessToken = async () => {
    const storedRefresh = localStorage.getItem('refresh_token');
    if (!storedRefresh) throw new Error('Aucun refresh token');

    const resp = await fetch('https://alloecoleapi-dev.up.railway.app/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: storedRefresh })
    });

    if (!resp.ok) throw new Error('Échec du refresh token');
    const data = await resp.json();
    const newAccess = data?.access_token || data?.data?.access_token || data?.accessToken || data?.data?.accessToken || data?.token;
    if (!newAccess) throw new Error('Réponse refresh invalide');
    localStorage.setItem('access_token', newAccess);
    return newAccess;
  };

  // Fonction pour récupérer les actualités depuis l'API
//   const fetchNews = async () => {
//     setLoadingNews(true);
//     setError("");
  
//     try {
//       const response = await fetch('https://alloecoleapi-dev.up.railway.app/api/v1/students/feed');
      
//       if (!response.ok) throw new Error(`Erreur ${response.status}`);
      
//       const result = await response.json();
  
//       if (result.success && result.data) {
//         const formattedNews = result.data.map((item) => ({
//           id: item.id,
//           type: "actualite",
//           title: item.title,
//           date: new Date(item.publishedAt).toLocaleDateString('fr-FR'),
//           image: item.mainImage || "/images/poster/ecole.png",
//           excerpt: item.summary || "",
//           views: item.views || 0,
//           author: item.author,
//           category: item.category?.name,
//           slug: item.slug
//         }));
//         console.log('formattedNews', formattedNews);
  
//         setActualites(formattedNews);
//         setPagination(result.pagination);
//       }
//     } catch (err) {
//       console.error('Erreur actualités:', err);
//       setError(err.message || "Impossible de charger les actualités");
//     } finally {
//       setLoadingNews(false);
//     }
//   };

// useEffect(() => {
//   fetchNews();
  
//   if (token) {
//     setLoading(true);
//     axios
//       .get(`https://alloecoleapi-dev.up.railway.app/api/v1/profile/student`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         setUser(response.data.data);
//       })
//       .catch((error) => {
//         console.error('❌ Erreur lors de la récupération du profil :', error);
//         if (error.response?.status === 401) {
//           localStorage.removeItem('access_token');
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }
// }, [token]);


  // ✅ Fonction pour récupérer TOUT le feed (toutes les pages)
const fetchAllFeed = async () => {
  const baseUrl = 'https://alloecoleapi-dev.up.railway.app/api/v1/students/feed';

  // 🟠 Récupération de la première page
  const firstResponse = await fetch(`${baseUrl}?page=1`);
  if (!firstResponse.ok) throw new Error(`Erreur ${firstResponse.status}`);
  const firstResult = await firstResponse.json();

  if (!firstResult.success) throw new Error("Erreur API : success = false");

  const totalPages = firstResult.pagination?.total_pages || 1;
  let allData = firstResult.data;

  // 🟢 Si plusieurs pages, on récupère toutes les autres
  if (totalPages > 1) {
    const pages = [];
    for (let p = 2; p <= totalPages; p++) {
      pages.push(fetch(`${baseUrl}?page=${p}`).then(r => r.json()));
    }

    const results = await Promise.all(pages);
    results.forEach(r => {
      if (r.success) allData = [...allData, ...r.data];
    });
  }

  console.log("✅ Données totales avant suppression des doublons:", allData);

  // 🧹 Élimination des doublons basés sur l'ID
  const uniqueData = Array.from(
    new Map(allData.map(item => [item.id, item])).values()
  );

  console.log("🧭 Données uniques après nettoyage:", uniqueData);

  // 🧩 Transformation des données pour l'affichage
  return uniqueData.map((item) => ({
    id: item.id,
    title: item.title || "Actualité sans titre",
    image: item.mainImage || "/images/poster/ecole.png",
    excerpt: item.summary || "",
    date: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString("fr-FR")
      : "Date inconnue",
    views: item.views || 0,
  }));
};



  // 🧠 React Query pour le feed complet
  const { data: feed = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['feed-all'],
    queryFn: fetchAllFeed,
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 👤 Charger le profil utilisateur
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (token && isUserConnected) {
      setLoadingProfile(true);
      axios
        .get(`https://alloecoleapi-dev.up.railway.app/api/v1/profile/student`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("✅ Profil chargé:", response.data.data);
          setUser(response.data.data);
        })
        .catch((error) => {
          console.error('❌ Erreur profil :', error);
          if (error.response?.status === 401) {
            console.log("⚠️ Token invalide, déconnexion");
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsUserConnected(false);
            setUser(null);
          }
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [isUserConnected]);

  console.log('Actualités fetched:', feed);

  // 👤 Charger le profil utilisateur si connecté
  useEffect(() => {
    if (token) {
      setLoadingProfile(true);
      axios
        .get(`https://alloecoleapi-dev.up.railway.app/api/v1/profile/student`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data.data))
        .catch((error) => {
          console.error('❌ Erreur profil :', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
          }
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [token]);

  


  // const UserProfileSidebar = () => (
  //   <div className="profile-sidebar">
  //     {user ? (
  //       <>
  //         <div className="profile-header">
  //           <div className="profile-avatar">
  //             <img src={user.photo || user.avatar || '/images/poster/albert.jpg'} alt="Photo de profil" />
  //             <div className="online-indicator"></div>
  //           </div>
  //           <div className="profile-info">
  //             <h4 className="profile-name">{user.prenom || user.firstName || 'Prénom'} {user.nom || user.lastName || 'Nom'}</h4>
  //             <p className="profile-email">{user.email || 'Email non disponible'}</p>
  //           </div>
  //         </div>

  //         <div className="profile-quick-actions">
  //           <Link to="/profil" className="quick-action-btn">
  //             <User className="icon-sm" />
  //             <span>Mon Profil</span>
  //           </Link>
  //           <Link to="/profil" className="quick-action-btn">
  //             <Settings className="icon-sm" />
  //             <span>Paramètres</span>
  //           </Link>
  //         </div>
  //       </>
  //     ) : (
  //       <div className="guest-profile">
  //         <div className="guest-header">
  //           <User className="icon-lg" />
  //           <h4>Rejoignez-nous</h4>
  //           <p>Connectez-vous pour accéder à toutes les fonctionnalités</p>
  //         </div>
          
  //         <div className="guest-actions">
  //         <Link to='/login'>
  //           <button className="btn-primary full-width" >
  //             <LogIn className="icon-sm" />
  //              S'authentifier
  //           </button>
  //           </Link>
  //         </div>

  //         <div className="guest-benefits">
  //           <h5>Avantages de s'authentifier :</h5>
  //           <ul>
  //             <li>✓ Sauvegarder vos recherches</li>
  //             <li>✓ Postuler aux bourses</li>
  //             <li>✓ Gérer vos dossiers</li>
  //             <li>✓ Recevoir des alertes</li>
  //           </ul>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  const RightSidebar = () => (
    <div className="sidebar-right-content">
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

  // Les fonctions render... restent inchangées
  const renderActualiteCard = (item) => (
    <div className="card" key={item.id}>
      <img src={item.image} alt={item.title} className="card-image" />
      <div className="card-content">
        <div className="card-badges">
          <span className="badge badge-orange">Actualité</span>
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

  const renderBourseCard = (item) => (
    <div className="card" key={item.id}>
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
    <div className="card" key={item.id}>
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
    <div className="card" key={item.id}>
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
  {loadingNews && (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Chargement des actualités...</p>
                  </div>
                )}
                
                {error && (
                  <div style={{ 
                    padding: '1rem', 
                    margin: '1rem', 
                    background: '#fee2e2', 
                    color: '#dc2626', 
                    borderRadius: '0.5rem' 
                  }}>
                    ⚠️ {error}
                  </div>
                )}

  return (
    <>
      {loadingProfile && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Chargement des actualités...</p>
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
                  {/* Afficher les actualités de l'API */}
                  {feed.map((item) => renderActualiteCard(item))}
                  
                  {/* Afficher les données statiques pour les autres types */}
                  {staticData.map((item) => {
                    if (item.type === 'bourse') return renderBourseCard(item);
                    if (item.type === 'ecole') return renderEcoleCard(item);
                    if (item.type === 'permutation') return renderPermutationCard(item);
                    return null;
                  })}
                </div>

                {pagination && pagination.current_page < pagination.total_pages && (
                  <div className="load-more-container">
                    <button className="load-more-button" onClick={fetchNews}>
                      Charger plus d'actualités
                    </button>
                  </div>
                )}
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