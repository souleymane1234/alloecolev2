import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { User, Settings, LogIn, LogOut, BookOpen, Code, X, GraduationCap, Smartphone, PlayCircle } from 'lucide-react';
import tokenManager from '../../helper/tokenManager';
import './UserProfileSidebar.css';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const UserProfileSidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSyntaxModal, setShowSyntaxModal] = useState(false);

  /**
   * 📦 Charger le profil utilisateur avec auto-refresh
   */
  const loadUser = async () => {
    if (!tokenManager.isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🌐 Utiliser fetchWithAuth pour gérer automatiquement le refresh
      const response = await tokenManager.fetchWithAuth(`${API_BASE}/profile/student`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const json = await response.json();
      const userData = json?.data ?? json;
      
      console.log('✅ Profil chargé:', userData);
      setUser(userData);
      
    } catch (err) {
      console.error('❌ Erreur profil sidebar:', err);
      setError(err.message);
      
      // Si l'erreur vient du token, l'utilisateur sera déconnecté automatiquement
      if (err.message.includes('token') || !tokenManager.isAuthenticated()) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 👂 Écouter les changements d'authentification
   */
  useEffect(() => {
    loadUser(); // Chargement initial

    // 🔄 Écouter les changements de token
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        if (e.newValue) {
          loadUser();
        } else {
          setUser(null);
        }
      }
    };

    // 🚪 Écouter les déconnexions
    const handleLogout = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  /**
   * 🎨 Générer les initiales
   */
  const getInitials = () => {
    if (!user) return '?';
    const firstName = user?.firstName || user?.prenom || 'P';
    const lastName = user?.lastName || user?.nom || 'N';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  /**
   * 🎨 Couleur aléatoire pour l'avatar
   */
  const getAvatarColor = () => {
    if (!user) return '#6b7280';
    const name = `${user?.firstName || user?.prenom || ''}${user?.lastName || user?.nom || ''}`;
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#F8B739', '#52B788', '#E07A5F', '#81B29A'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  /**
   * 🔓 Déconnexion via TokenManager
   */
  const handleLogout = () => {
    tokenManager.logout();
    setUser(null);
  };

  /**
   * 📘 Initialiser le SDK Facebook
   */
  useEffect(() => {
    // Charger le SDK Facebook
    if (window.FB) {
      window.FB.XFBML.parse();
    } else {
      window.fbAsyncInit = function() {
        window.FB.init({
          xfbml: true,
          version: 'v18.0'
        });
      };

      // Charger le script Facebook SDK
      if (!document.getElementById('facebook-jssdk')) {
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s);
          js.id = id;
          js.src = "https://connect.facebook.net/fr_FR/sdk.js";
          js.async = true;
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      }
    }
  }, []);

  // 🔄 Affichage pendant le chargement
  if (loading) {
    return (
      <div className="profile-sidebar">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const syntaxSections = [
    {
      title: 'Inscription lycées et collèges',
      intro: 'Paiement des frais de préinscription et d’inscription dans les lycées/ collèges.',
      operators: [
        {
          operator: 'MOOV',
          code: '*155*7*6#',
          summary: 'Paiement direct via MOOV Money.',
          steps: ['Composer *155*7*6#', 'Suivre les instructions à l’écran', 'Valider le paiement'],
        },
      ],
    }, 
    {
      title: 'Préinscription bacheliers',
      intro:
        'Permet aux nouveaux bacheliers de se préinscrire dans les universités et grandes écoles.',
      operators: [
        {
          operator: 'MOOV',
          code: '*155*7*3*1#',
          summary: 'Parcours rapide MOOV.',
          steps: ['Composer *155*7*3*1#', 'Sélectionner le menu indiqué', 'Confirmer'],
        },
        {
          operator: 'MTN',
          code: '*133*6*6#',
          summary: 'Processus guidé via MTN Mobile Money.',
          steps: ['Composer *133#', 'Option 6', 'Option 3', 'Option 2', 'Renseigner le matricule'],
        },
        {
          operator: 'ORANGE',
          code: '#144*13*2#',
          summary: 'Paiement express via Orange Money.',
          steps: ['Composer #144*13*2#', 'Suivre les étapes du menu', 'Valider'],
        },
      ],
    },
    {
      title: 'Frais d’examen & soutenance BTS',
      intro: 'Réglez vos frais d’examen ou de soutenance du BTS via mobile money.',
      operators: [
        {
          operator: 'MOOV',
          code: '*155*7# → option 5',
          summary: 'Menu Écoles & concours (option 7) puis BTS.',
          steps: ['Composer *155#', 'Option 7 : Écoles & concours', 'Option 5 : BTS', 'Saisir le matricule'],
        },
        {
          operator: 'MTN',
          code: '*133#',
          summary: 'Inscription : options 6 puis 3. Soutenance : 6 puis 2.',
          steps: ['Composer *133#', 'Choisir 6', 'Choisir 3 (inscription) ou 2 (soutenance)', 'Confirmer le paiement'],
        },
        {
          operator: 'ORANGE',
          code: '#144*13*3*1#',
          summary: 'Parcours multi-étapes Orange Money.',
          steps: ['Composer #144#', 'Sélectionner 1 → 3 → 3 → 1', 'Valider le paiement'],
        },
        {
          operator: 'MTN (Accès direct)',
          code: '*133*6*3*1#',
          summary: 'Raccourci vers la catégorie BTS.',
          steps: ['Composer *133#', 'Entrer 6 puis 3 puis 1', 'Choisir la catégorie correspondante'],
        },
        {
          operator: 'ORANGE (Inscription & vérification)',
          code: '#144*13*11# / #144*13*12#',
          summary: 'Paiement et vérification depuis Orange Money.',
          steps: ['Composer le code souhaité', 'Suivre les étapes', 'Confirmer'],
        },
      ],
    },
    {
      title: 'Universités & grandes écoles',
      intro: 'Inscriptions et paiements pour les établissements d’enseignement supérieur.',
      operators: [
        {
          operator: 'MOOV',
          code: '*155*7*3*2#',
          summary: 'Accès direct aux universités publiques.',
          steps: ['Composer *155*7*3*2#', 'Choisir l’établissement', 'Valider'],
        },
        {
          operator: 'MTN',
          code: '*133# → 6 → 3 → 2',
          summary: 'Chemin Mobile Money pour universités / grandes écoles.',
          steps: ['Composer *133#', 'Option 6', 'Option 3', 'Option 2', 'Renseigner le matricule'],
        },
        {
          operator: 'ORANGE',
          code: '#144*4*2*4#',
          summary: 'Parcours Orange Money en trois étapes.',
          steps: ['Composer #144#', 'Option 4', 'Option 2', 'Option 4', 'Confirmer'],
        },
      ],
    },
    {
      title: 'Préinscription INP-HB',
      intro: 'Paiement des frais de préinscription au sein de l’INP-HB.',
      operators: [
        {
          operator: 'MOOV',
          code: '*155*7# → option 3',
          summary: 'Menu INP-HB.',
          steps: ['Composer *155*7#', 'Sélectionner l’option 3', 'Valider'],
        },
        {
          operator: 'MTN',
          code: '*133# → 6 → 3 → 2 → 3',
          summary: 'Processus complet via MTN.',
          steps: ['Composer *133#', 'Option 6', 'Option 3', 'Option 2', 'Option 3', 'Renseigner le matricule'],
        },
        {
          operator: 'ORANGE',
          code: '#144*13*2*2#',
          summary: 'Code direct Orange Money.',
          steps: ['Composer #144*13*2*2#', 'Suivre les instructions', 'Valider'],
        },
      ],
    },
    {
      title: 'Concours CAFOP',
      intro: 'Paiement des frais de visite médicale pour le concours CAFOP.',
      operators: [
        {
          operator: 'MOOV',
          code: '*155*7*8#',
          summary: 'Accès direct MOOV Money.',
          steps: ['Composer *155*7*8#', 'Suivre le menu', 'Confirmer'],
        },
        {
          operator: 'MTN',
          code: '*133# → 6 → 3 → 2 → 4',
          summary: 'Parcours multi-étapes.',
          steps: ['Composer *133#', 'Option 6', 'Option 3', 'Option 2', 'Option 4'],
        },
        {
          operator: 'ORANGE',
          code: '#144*4*2*3*2#',
          summary: 'Syntaxe directe Orange Money.',
          steps: ['Composer #144*4*2*3*2#', 'Valider'],
        },
      ],
    },
    {
      title: 'Concours IPNETP',
      intro: 'Concours directs et promotions internes du domaine technique et professionnel.',
      operators: [
        {
          operator: 'Site officiel',
          code: 'www.ipnetp.ci',
          summary: 'Consulter toutes les filières et concours.',
          steps: ['Visiter www.ipnetp.ci', 'Choisir le concours', 'Suivre la procédure détaillée'],
        },
      ],
    },
    {
      title: 'Concours ENA',
      intro: 'Concours directs et professionnels de l’École Nationale d’Administration.',
      operators: [
        {
          operator: 'Processus en ligne',
          code: 'www.ena.ci',
          summary: 'Inscription + paiement + rendez-vous via l’espace candidat.',
          steps: [
            'Remplir le formulaire sur www.ena.ci',
            'Payer via Mobile Money',
            'Prendre rendez-vous (visite / dépôt)',
            'Imprimer les reçus',
          ],
        },
        {
          operator: 'MOOV',
          code: '*155*7*4#',
          summary: 'Paiement Mobile Money.',
          steps: ['Composer *155*7*4#', 'Sélectionner le concours', 'Valider'],
        },
      ],
    },
    {
      title: 'Concours INFAS',
      intro: 'Paiement des frais INFAS (visite médicale, inscription).',
      operators: [
        {
          operator: 'MOOV',
          code: '*155*7*2#',
          summary: 'Paiement direct.',
          steps: ['Composer *155*7*2#', 'Suivre les instructions'],
        },
        {
          operator: 'Plateforme en ligne',
          code: 'www.infas.ci',
          summary: 'Préinscription + paiement Orange/ Moov via le site.',
          steps: ['Se rendre sur www.infas.ci', 'Choisir le concours et la date', 'Payer en ligne'],
        },
      ],
    },
  ];

  const QuickLinksPanel = () => (
    <div className="quick-links-panel">
      <a
        href="https://www.myschooltoon.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="quick-link-card scholarship-card"
      >
        <div className="quick-link-image-wrapper scholarship-bg">
          <PlayCircle size={28} className="quick-link-image-icon" />
        </div>
        <div className="quick-link-content">
          <span className="quick-link-label">Visitez MySchoolToon</span>
          <span className="quick-link-subtitle">Plateforme de cartoon éducatif</span>
        </div>
      </a>

      <button
        type="button"
        className="quick-link-card syntax-card"
        onClick={() => setShowSyntaxModal(true)}
      >
        <div className="quick-link-image-wrapper syntax-bg">
          <Smartphone size={28} className="quick-link-image-icon" />
        </div>
        <div className="quick-link-content">
          <span className="quick-link-label">Syntaxe opérateur</span>
          <span className="quick-link-subtitle">Codes USSD</span>
        </div>
      </button>
    </div>
  );

  const SyntaxModal = () =>
    createPortal(
      <div className="syntax-modal-overlay">
        <div className="syntax-modal">
        <button
          className="syntax-modal-close"
          onClick={() => setShowSyntaxModal(false)}
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
          <div className="syntax-modal-header">
            <h3>Syntaxes opérateurs</h3>
            <p className="syntax-modal-subtitle">
              Composez ces syntaxes sur votre téléphone pour régler vos frais d’inscription et de concours.
            </p>
          </div>
          <div className="syntax-scrollable">
            {syntaxSections.map((section, index) => (
              <div className="syntax-section" key={section.title}>
                <div className="syntax-section-header">
                  <span className="syntax-section-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4>{section.title}</h4>
                    <p>{section.intro}</p>
                  </div>
                </div>
                <div className="syntax-operators">
                  {section.operators.map((op, opIndex) => (
                    <div className="syntax-operator-card" key={`${op.operator}-${opIndex}`}>
                      <div className="syntax-operator-header">
                        <span className="syntax-operator-name">{op.operator}</span>
                        <code className="syntax-operator-code">{op.code}</code>
                      </div>
                      {op.summary && <p className="syntax-operator-summary">{op.summary}</p>}
                      {op.steps && op.steps.length > 0 && (
                        <ul className="syntax-steps">
                          {op.steps.map((step, stepIndex) => (
                            <li key={`${op.operator}-${stepIndex}`}>{step}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            className="syntax-modal-action"
            onClick={() => setShowSyntaxModal(false)}
          >
            Compris !
          </button>
        </div>
      </div>,
      document.body
    );

  // ✅ Si utilisateur connecté
  if (user) {
    const hasImage = user?.profileImage || user?.photo || user?.avatar;

    return (
      <>
      <div className="profile-sidebar">
        <QuickLinksPanel />

        {/* <div className="profile-header">
          <div className="profile-avatar">
            {hasImage ? (
              <>
                <img 
                  src={user.profileImage || user.photo || user.avatar}
                  alt="Profil"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-placeholder" style={{ display: 'none', backgroundColor: getAvatarColor() }}>
                  {getInitials()}
                </div>
              </>
            ) : (
              <div className="avatar-placeholder" style={{ backgroundColor: getAvatarColor() }}>
                {getInitials()}
              </div>
            )}
            <div className="online-indicator"></div>
          </div>
          <div className="profile-info">
            <h4>{user.firstName || user.prenom || 'Prénom'} {user.lastName || user.nom || 'Nom'}</h4>
            <p>{user.email || 'Email non disponible'}</p>
            {(user.city || user.ville) && (
              <p>📍 {user.city || user.ville}{(user.country || user.pays) ? `, ${user.country || user.pays}` : ''}</p>
            )}
          </div>
        </div> */}

        {/* <div className="profile-quick-actions">
          <Link to="/profil" className="quick-action-btn">
            <User /> Mon Profil
          </Link>
          <Link to="/profil?tab=parametres" className="quick-action-btn">
            <Settings /> Paramètres
          </Link>
          <button onClick={handleLogout} className="quick-action-btn logout-btn">
            <LogOut /> Déconnexion
          </button>
        </div> */}

        {error && (
          <div className="error-message">
            <small>⚠️ {error}</small>
          </div>
        )}

        {/* Fil d'actualité Facebook */}
        <div className="profile-facebook-section">
          <h4 className="facebook-section-title">Suivez-nous sur Facebook</h4>
          <div className="facebook-feed-container">
            <div 
              className="fb-page" 
              data-href="https://www.facebook.com/alloecole225" 
              data-tabs="timeline"
              data-width=""
              data-height="400"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true"
            >
              <blockquote 
                cite="https://www.facebook.com/alloecole225" 
                className="fb-xfbml-parse-ignore"
              >
                <a href="https://www.facebook.com/alloecole225" target="_blank" rel="noopener noreferrer">
                  Allo Ecole
                </a>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
        {showSyntaxModal && <SyntaxModal />}
      </>
    );
  }

  // 👤 Si utilisateur non connecté
  return (
    <>
    <div className="profile-sidebar">
      <QuickLinksPanel />

      {/* <div className="guest-profile">
        <div className="guest-header">
          <h4>Rejoignez-nous</h4>
        </div>
        <div className="guest-actions">
          <Link to="/login" className="btn-primary full-width">
            <LogIn /> S'authentifier
          </Link>
        </div>
      </div> */}

      {/* Fil d'actualité Facebook */}
      <div className="profile-facebook-section">
        <h4 className="facebook-section-title">Suivez-nous sur Facebook</h4>
        <div className="facebook-feed-container">
          <div 
            className="fb-page" 
            data-href="https://www.facebook.com/alloecole225" 
            data-tabs="timeline"
            data-width=""
            data-height="400"
            data-small-header="false"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          >
            <blockquote 
              cite="https://www.facebook.com/alloecole225" 
              className="fb-xfbml-parse-ignore"
            >
              <a href="https://www.facebook.com/alloecole225" target="_blank" rel="noopener noreferrer">
                Allo Ecole
              </a>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
      {showSyntaxModal && <SyntaxModal />}
    </>
  );
};

export default UserProfileSidebar;