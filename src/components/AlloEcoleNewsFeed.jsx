import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, ChevronRight, Eye, User, BookOpen, GraduationCap, Settings, Bell, LogIn } from 'lucide-react';
import ContactAlloEcoleService from './ContactAlloEcoleService';
import { Link, useLocation } from "react-router-dom";

const AlloEcoleNewsFeed = () => {
  const location = useLocation();
  const isConnect = location.state?.isConnect || false;

  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPermutation, setSelectedPermutation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Détection de la taille d'écran au chargement et au redimensionnement

  console.log('okkkkkkk', isConnect)
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

  const actualites = [
    {
      id: 1,
      type: "actualite",
      title: "Ouverture des inscriptions pour l'année académique 2025-2026",
      date: "20/10/2025",
      image: "/images/poster/ecole.png",
      excerpt: "Les inscriptions pour la nouvelle année académique sont officiellement ouvertes dans tous les établissements de Côte d'Ivoire. Ne manquez pas cette opportunité...",
      views: 1250
    },
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
      id: 4,
      type: "actualite",
      title: "Nouvelles bourses d'excellence disponibles pour les étudiants ivoiriens",
      date: "18/10/2025",
      image: "/images/poster/bourse.jpg",
      excerpt: "Le gouvernement annonce de nouvelles opportunités de bourses pour encourager l'excellence académique et soutenir les étudiants méritants...",
      views: 2100
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
      id: 8,
      type: "actualite",
      title: "Réforme du système éducatif : Ce qui va changer en 2026",
      date: "15/10/2025",
      image: "/images/poster/ecole.png",
      excerpt: "Une réforme majeure du système éducatif ivoirien est en cours, avec de nombreux changements prévus pour améliorer la qualité de l'enseignement...",
      views: 890
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
      id: 12,
      type: "actualite",
      title: "Salon de l'orientation 2025 : Les dates annoncées",
      date: "12/10/2025",
      image: "/images/poster/ecole.png",
      excerpt: "Le grand salon de l'orientation scolaire et professionnelle se tiendra du 5 au 8 novembre prochain à Abidjan. Un événement incontournable...",
      views: 1450
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
    },
    {
      id: 15,
      type: "actualite",
      title: "Comment bien préparer son dossier Campus France",
      date: "10/10/2025",
      image: "/images/poster/ecole.png",
      excerpt: "Guide complet pour maximiser vos chances d'admission dans les universités françaises. Découvrez toutes les étapes essentielles...",
      views: 3200
    }
  ];

  const userData = {
    nom: 'Albert',
    prenom: 'Kala',
    email: 'albert.kala@email.com',
    photo: '/images/poster/albert.jpg',
    dossiers: 2,
    bourses: 3,
    permutations: 2
  };

  const UserProfileSidebar = () => (
    <div className="profile-sidebar">
      {isConnect ? (
        <>
          <div className="profile-header">
            <div className="profile-avatar">
              <img src={userData.photo} alt="Photo de profil" />
              <div className="online-indicator"></div>
            </div>
            <div className="profile-info">
              <h4 className="profile-name">{userData.prenom} {userData.nom}</h4>
              <p className="profile-email">{userData.email}</p>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">{userData.dossiers}</div>
              <div className="stat-label">Dossiers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{userData.bourses}</div>
              <div className="stat-label">Bourses</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{userData.permutations}</div>
              <div className="stat-label">Permutations</div>
            </div>
          </div>

          <div className="profile-quick-actions">
            <button className="quick-action-btn">
              <User className="icon-sm" />
              <span>Mon Profil</span>
            </button>
            <button className="quick-action-btn">
              <BookOpen className="icon-sm" />
              <span>Mes Dossiers</span>
            </button>
            <button className="quick-action-btn">
              <GraduationCap className="icon-sm" />
              <span>Mes Bourses</span>
            </button>
            <button className="quick-action-btn">
              <Settings className="icon-sm" />
              <span>Paramètres</span>
            </button>
          </div>

          <div className="profile-notifications">
            <div className="notification-header">
              <Bell className="icon-sm" />
              <span>Notifications récentes</span>
            </div>
            <div className="notification-item">
              <div className="notification-dot"></div>
              <span>Nouvelle bourse disponible</span>
            </div>
            <div className="notification-item">
              <div className="notification-dot"></div>
              <span>Mise à jour de votre dossier</span>
            </div>
          </div>
        </>
      ) : (
        <div className="guest-profile">
          <div className="guest-header">
            <User className="icon-lg" />
            <h4>Rejoignez-nous</h4>
            <p>Connectez-vous pour accéder à toutes les fonctionnalités</p>
          </div>
          
          <div className="guest-actions">
          <Link to='/login'>
            <button className="btn-primary full-width">
              <LogIn className="icon-sm" />
              Se connecter
            </button>
            </Link>
            <button className="btn-secondary full-width">
              S'inscrire
            </button>
          </div>

          <div className="guest-benefits">
            <h5>Avantages de s'inscrire :</h5>
            <ul>
              <li>✓ Sauvegarder vos recherches</li>
              <li>✓ Postuler aux bourses</li>
              <li>✓ Gérer vos dossiers</li>
              <li>✓ Recevoir des alertes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

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

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .section {
          padding: 3rem 1rem;
        }

        .max-width {
          margin: 0 auto;
          max-width: 1300px;
        }

        /* Layout principal - Desktop */
        .main-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          width: 100%;
        }

        .sidebar {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        /* Desktop: sidebar sticky */
        .sidebar-left {
          width: 320px;
          flex-shrink: 0; /* IMPORTANT: empêche le rétrécissement */
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .sidebar-right {
          width: 300px;
          flex-shrink: 0; /* IMPORTANT: empêche le rétrécissement */
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .content-area {
          flex: 1;
          min-width: 0; /* IMPORTANT: permet au contenu de se réduire correctement */
        }

        /* MOBILE FIRST APPROACH */
        @media (max-width: 991px) {
          .main-layout {
            flex-direction: column;
            gap: 1.5rem;
          }

          /* Sur mobile: sidebar prend toute la largeur et vient en premier */
          .sidebar-left {
            width: 100% !important;
            left: 0;
            right: 0;
            marggin:0;
            position: relative;
            top: 0;
            order: 1; /* Premier élément */
            /* RETIRER le background-color: red; */
          }

          .sidebar-right {
            width: 100% !important;
            left: 0;
            right: 0;
            marggin:0;
            position: relative;
            top: 0;
            order: 3; /* Premier élément */ 
            /* RETIRER le background-color: red; */
          }

          .content-area {
            order: 2; /* Deuxième élément */
            width: 100%;
          }


          .section {
            padding: 1.5rem 1rem;
          }
        }

        /* Desktop uniquement */
        @media (min-width: 992px) {
          .sidebar-right {
            display: block;
          }
          
          .main-layout {
            display: flex;
            flex-direction: row;
          }
        }

        /* Styles pour le profil utilisateur */
        .profile-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .profile-avatar {
          position: relative;
        }

        .profile-avatar img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #f97316;
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .profile-email {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f97316;
        }

        .stat-label {
          font-size: 0.50rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .profile-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #4b5563;
        }

        .quick-action-btn:hover {
          background: #fff7ed;
          border-color: #f97316;
          color: #f97316;
        }

        .profile-notifications {
          background: #fef3c7;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #f59e0b;
        }

        .notification-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.75rem;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #92400e;
          margin-bottom: 0.5rem;
        }

        .notification-dot {
          width: 6px;
          height: 6px;
          background: #f59e0b;
          border-radius: 50%;
        }

        /* Styles pour les utilisateurs non connectés */
        .guest-profile {
          text-align: center;
          padding: 1rem 0;
        }

        .guest-header {
          margin-bottom: 1.5rem;
        }

        .guest-header .icon-lg {
          width: 3rem;
          height: 3rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .guest-header h4 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .guest-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .guest-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: #f97316;
          color: white;
          border: none;
        }

        .btn-primary:hover {
          background: #ea580c;
        }

        .btn-secondary {
          background: white;
          color: #f97316;
          border: 2px solid #f97316;
        }

        .btn-secondary:hover {
          background: #fff7ed;
        }

        .full-width {
          width: 100%;
        }

        .guest-benefits {
          text-align: left;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .guest-benefits h5 {
          color: #1f2937;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .guest-benefits ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .guest-benefits li {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        /* Styles pour la sidebar droite */
        .sidebar-right-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
              /* Footer Styles */
      .sidebar-footer {
        background: white;
        border-radius: 0.75rem;
        padding: 1.25rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        margin-top: auto;
      }

      .footer-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0;
        margin-bottom: 1rem;
      }

      .footer-link {
        font-size: 0.75rem;
        color: #6b7280;
        text-decoration: none;
        transition: color 0.2s;
        padding: 0.25rem 0;
      }

      .footer-link:hover {
        color: #ea580c;
        text-decoration: underline;
      }

      .footer-link:not(:last-child)::after {
        content: '•';
        margin: 0 0.5rem;
        color: #d1d5db;
      }

      .footer-brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-top: 0.75rem;
        border-top: 1px solid #f3f4f6;
      }

      .brand-name {
        font-size: 0.875rem;
        font-weight: 700;
        color: #ea580c;
      }

      .copyright {
        font-size: 0.75rem;
        color: #9ca3af;
      }

        .school-ad {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .ad-image {
          width: 60px;
          height: 60px;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .ad-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ad-content {
          flex: 1;
        }

        .ad-content h5 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .ad-content p {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .btn-ad {
          padding: 0.25rem 0.75rem;
          background: #f97316;
          color: white;
          border: none;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .action-card:hover {
          background: #fff7ed;
          border-color: #f97316;
          transform: translateY(-2px);
        }

        .action-card span {
          font-size: 0.75rem;
          color: #4b5563;
          font-weight: 500;
        }

        .stats-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stat-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border-left: 4px solid #f97316;
        }

        .stat-card .stat-number {
          font-size: 1.125rem;
          font-weight: 700;
          color: #f97316;
        }

        .stat-card .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .event-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f97316;
          color: white;
          padding: 0.5rem;
          border-radius: 0.375rem;
          min-width: 50px;
        }

        .event-day {
          font-size: 1.125rem;
          font-weight: 700;
        }

        .event-month {
          font-size: 0.75rem;
        }

        .event-details h6 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .event-details p {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
        }

        /* Styles des cartes d'actualités */
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          border-left: 4px solid #f97316;
        }

        .card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .card-image {
          width: 100%;
          height: 16rem;
          object-fit: cover;
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .badges-wrap {
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 9999px;
        }

        .badge-orange {
          background-color: #ffedd5;
          color: #f97316;
        }

        .badge-blue {
          background-color: #dbeafe;
          color: #2563eb;
        }

        .badge-green {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .badge-purple {
          background-color: #f3e8ff;
          color: #9333ea;
        }

        .date-info {
          display: flex;
          align-items: center;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .card-title:hover {
          color: #f97316;
        }

        .card-excerpt {
          color: #6b7280;
          margin-bottom: 1rem;
          line-height: 1.625;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .link-button {
          display: flex;
          align-items: center;
          color: #f97316;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .link-button:hover {
          color: #ea580c;
        }

        .views {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .info-list {
          margin-bottom: 1rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .info-item.deadline {
          color: #dc2626;
          font-weight: 600;
        }

        .location-info {
          display: flex;
          align-items: center;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .button-primary {
          width: 100%;
          padding: 0.75rem;
          background-color: #f97316;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .button-primary:hover {
          background-color: #ea580c;
        }

        .button-secondary {
          width: 100%;
          padding: 0.75rem;
          background-color: white;
          color: #f97316;
          border: 2px solid #f97316;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .button-secondary:hover {
          background-color: #fff7ed;
        }

        .permutation-path {
          margin-bottom: 1rem;
        }

        .path-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .path-dot {
          width: 0.5rem;
          height: 0.5rem;
          background-color: #f97316;
          border-radius: 50%;
          margin-top: 0.5rem;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }

        .path-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .path-value {
          font-weight: 600;
          color: #1f2937;
        }

        .path-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.5rem 0;
        }

        .year-info {
          display: flex;
          align-items: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .permutation-user-info {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1rem;
          margin-right: 1rem;
        }

        .user-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .user-location {
          display: flex;
          align-items: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        .permutation-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .permutation-stats {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .stat-item {
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .correspondances-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .permutation-actions {
          display: flex;
          gap: 0.75rem;
        }

        .path-location {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }

        .icon-sm {
          width: 1rem;
          height: 1rem;
          margin-right: 0.25rem;
        }

        .icon-md {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
        }

        .icon-lg {
          width: 1.5rem;
          height: 1.5rem;
        }

        .icon-orange {
          color: #f97316;
        }

        .load-more-container {
          text-align: center;
          margin-top: 3rem;
        }

        .load-more-button {
          padding: 1rem 2rem;
          background-color: #f97316;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1.125rem;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.2s;
        }

        .load-more-button:hover {
          background-color: #ea580c;
        }

        @media (max-width: 767px) {
          .card-title {
            font-size: 1.25rem;
          }

          .section {
            padding: 1rem;
          }

          .profile-stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .quick-actions-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
      
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
                  {actualites.map((item) => {
                    if (item.type === 'actualite') return renderActualiteCard(item);
                    if (item.type === 'bourse') return renderBourseCard(item);
                    if (item.type === 'ecole') return renderEcoleCard(item);
                    if (item.type === 'permutation') return renderPermutationCard(item);
                    return null;
                  })}
                </div>

                <div className="load-more-container">
                  <button className="load-more-button">
                    Charger plus d'actualités
                  </button>
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