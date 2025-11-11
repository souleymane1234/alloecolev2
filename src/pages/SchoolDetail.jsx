import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import SchoolDetails from '../components/schoolComponent/SchoolDetails';

const SchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [isFollowing, setIsFollowing] = useState(false);
  const [newPost, setNewPost] = useState('');

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

  // Fonction pour récupérer les détails de l'école depuis l'API
  const fetchSchoolDetails = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`https://alloecoleapi-dev.up.railway.app/api/v1/students/schools/${id}`);
      
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      
      const result = await response.json();
  
      if (result.success && result.data) {
        const apiData = result.data;
        const name = apiData.name.toLowerCase();
        
        // Déterminer le niveau académique
        let level = 'université';
        if (name.includes('primaire') || name.includes('école primaire')) level = 'primaire';
        else if (name.includes('collège') || name.includes('college')) level = 'collège';
        else if (name.includes('lycée') || name.includes('lycee')) level = 'lycée';
  
        // Déterminer la filière
        const slogan = (apiData.slogan || '').toLowerCase();
        let filiere = 'général';
        if (name.includes('commerce') || slogan.includes('commerce') || slogan.includes('management')) filiere = 'commerce';
        else if (name.includes('technique') || name.includes('polytechnique') || name.includes('technologie') || slogan.includes('technologie')) filiere = 'technique';
        else if (name.includes('santé') || name.includes('sante') || name.includes('médecine')) filiere = 'santé';
        else if (name.includes('art') || name.includes('culture')) filiere = 'art';
  
        // Calculer les statistiques
        const studentsCount = apiData.statistics?.find(stat => 
          stat.name.toLowerCase().includes('étudiant')
        )?.value || null;
  
        const teachersCount = apiData.statistics?.find(stat => 
          stat.name.toLowerCase().includes('enseignant') || stat.name.toLowerCase().includes('professeur')
        )?.value || null;
  
        const successRate = apiData.statistics?.find(stat => 
          stat.name.toLowerCase().includes('réussite') || stat.name.toLowerCase().includes('taux')
        )?.value || null;
        
        const rating = successRate ? (successRate / 100 * 5).toFixed(1) : (apiData.isVerified ? 4.5 : 4.0);
  
        // Formater les données
        const formattedSchool = {
          id: apiData.id,
          name: apiData.name,
          level,
          filiere,
          logo: "/images/poster/ecole.png",
          banner: apiData.bannerUrl || "/images/poster/ecole.png",
          address: apiData.address || `${apiData.city}, ${apiData.region}`,
          phone: apiData.phone || null,
          email: apiData.email || null,
          website: apiData.website || null,
          description: apiData.description || apiData.slogan || "",
          rating: parseFloat(rating),
          studentsCount,
          teachersCount,
          foundedYear: apiData.createdAt ? new Date(apiData.createdAt).getFullYear() : null,
          director: apiData.directorWords?.directorName || "Direction",
          activities: apiData.programs?.map(p => p.name) || [],
          facilities: apiData.amenities?.map(a => a.name) || [],
          achievements: apiData.strengths?.map(s => s.name) || [],
          slogan: apiData.slogan,
          hasPaid: apiData.hasPaid,
          isVerified: apiData.isVerified,
          region: apiData.region,
          city: apiData.city,
          programs: apiData.programs || [],
          services: apiData.services || [],
          amenities: apiData.amenities || [],
          strengths: apiData.strengths || [],
          statistics: apiData.statistics || [],
          directorWords: apiData.directorWords || null,
          media: apiData.media || [],
          socialStats: { followers: 0, following: 0, posts: 0 },
          timeline: [],
          gallery: apiData.media?.filter(m => m.type === 'IMAGE').map(m => m.url) || []
        };
  
        setSchool(formattedSchool);
      }
    } catch (err) {
      console.error('Erreur détails école:', err);
      setError(err.message || "Impossible de charger les détails de l'école");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSchoolDetails();
    }
  }, [id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Ici, vous feriez un appel API pour suivre/ne plus suivre
  };

  const handleLike = (postId) => {
    console.log('Like post:', postId);
  };

  const handleComment = (postId) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId) => {
    console.log('Share post:', postId);
  };

  const handleNewPost = () => {
    if (newPost.trim()) {
      console.log('New post:', newPost);
      setNewPost('');
    }
  };

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
          
          .school-detail-loading {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(248, 250, 252, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(3px);
          }

          .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .spinner-container {
            position: relative;
            width: 60px;
            height: 60px;
          }

          .spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-top: 4px solid #ea580c;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .spinner-ring:nth-child(2) {
            width: 80%;
            height: 80%;
            top: 10%;
            left: 10%;
            border-top-color: #f97316;
            animation-duration: 1.5s;
            animation-direction: reverse;
          }

          .spinner-ring:nth-child(3) {
            width: 60%;
            height: 60%;
            top: 20%;
            left: 20%;
            border-top-color: #fb923c;
            animation-duration: 2s;
          }

          .loading-text {
            color: #6b7280;
            font-size: 0.875rem;
            font-weight: 500;
            opacity: 0.8;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
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

  if (error) {
    return (
      <>
        <style>{`
          @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
          
          .school-error {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f8fafc;
            padding: 2rem;
          }

          .error-content {
            text-align: center;
            color: #6b7280;
            max-width: 500px;
          }

          .error-content i {
            font-size: 4rem;
            margin-bottom: 1rem;
            color: #dc2626;
          }

          .error-content h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #374151;
          }

          .error-content p {
            margin-bottom: 1.5rem;
          }

          .back-btn {
            background: #ea580c;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
          }

          .back-btn:hover {
            background: #c2410c;
          }
        `}</style>
        <div className="school-error">
          <div className="error-content">
            <i className="ph-warning-circle"></i>
            <h2>Erreur de chargement</h2>
            <p>{error}</p>
            {!localStorage.getItem('access_token') && (
              <div style={{ marginBottom: '1rem' }}>
                <a href="/login" style={{ color: '#dc2626', textDecoration: 'underline' }}>
                  Se connecter
                </a>
              </div>
            )}
            <button onClick={() => navigate('/schools')} className="back-btn">
              Retour aux écoles
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!school) {
    return (
      <>
        <style>{`
          @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
          
          .school-not-found {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f8fafc;
          }

          .not-found-content {
            text-align: center;
            color: #6b7280;
          }

          .not-found-content i {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
          }

          .not-found-content h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #374151;
          }

          .back-btn {
            background: #ea580c;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 1rem;
          }

          .back-btn:hover {
            background: #c2410c;
          }
        `}</style>
        <div className="school-not-found">
          <div className="not-found-content">
            <i className="ph-buildings"></i>
            <h2>École non trouvée</h2>
            <p>L'école que vous recherchez n'existe pas.</p>
            <button onClick={() => navigate('/schools')} className="back-btn">
              Retour aux écoles
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
        
        .school-detail-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem 0;
        }

        .school-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .school-header {
          background: white;
          border-radius: 1rem;
          margin-bottom: 2rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .school-banner {
          height: 300px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .school-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .school-info {
          padding: 2rem;
        }

        .school-header-content {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .school-logo {
          flex-shrink: 0;
          width: 140px;
          height: 140px;
          background: white;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 4px solid white;
          margin-top: 70px;
        }

        .school-logo img {
          width: 110px;
          height: 110px;
          object-fit: contain;
        }

        .school-main-info {
          flex: 1;
          min-width: 0;
        }

        .school-title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .school-name {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1f2937;
          margin: 0;
        }

        .school-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .school-level {
          display: inline-flex;
          align-items: center;
          background: #ea580c;
          color: white;
          padding: 0.375rem 0.875rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .school-verified {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: #10b981;
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .school-slogan {
          font-size: 1rem;
          color: #6b7280;
          font-style: italic;
          margin-bottom: 1rem;
        }

        .school-description {
          color: #4b5563;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .school-quick-info {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          align-items: center;
          padding: 1rem 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
        }

        .quick-info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .quick-info-item i {
          color: #ea580c;
          font-size: 1.125rem;
        }

        .school-stats {
          // display: grid;
          // grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ea580c;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.8rem;
        }

        .school-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .school-stats {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
        }

        .action-btn.primary {
          background: #ea580c;
          color: white;
        }

        .action-btn.primary:hover {
          background: #c2410c;
        }

        .action-btn.secondary {
          background: #6b7280;
          color: white;
        }

        .action-btn.secondary:hover {
          background: #4b5563;
        }

        .action-btn.outline {
          background: transparent;
          color: #ea580c;
          border: 2px solid #ea580c;
        }

        .action-btn.outline:hover {
          background: #ea580c;
          color: white;
        }

        .school-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .details-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-title i {
          color: #ea580c;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-icon {
          color: #ea580c;
          font-size: 1.25rem;
        }

        .detail-content {
          flex: 1;
        }

        .detail-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .detail-value {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .activity-item {
          background: #f8fafc;
          padding: 0.75rem;
          border-radius: 0.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: #374151;
        }

        .achievements-list {
          list-style: none;
          padding: 0;
        }

        .achievement-item {
          background: #f0f9ff;
          border-left: 4px solid #ea580c;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #1e40af;
          font-weight: 500;
        }

        .programs-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .program-item {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 3px solid #ea580c;
        }

        .program-name {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .program-description {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .statistics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .statistic-item {
          background: #f0f9ff;
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
        }

        .statistic-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ea580c;
        }

        .statistic-label {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .director-words {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .director-title {
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.5rem;
        }

        .director-content {
          color: #78350f;
          line-height: 1.6;
        }

        .school-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }

        .content-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .school-name-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .school-logo-img {
          width: 110px;
          height: 110px;
          object-fit: contain;
          flex-shrink: 0;
          width: 140px;
          height: 140px;
          background: white;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 4px solid white;
        }

        .content-main {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .content-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab-btn {
          flex: 1;
          padding: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .tab-btn.active {
          color: #ea580c;
          border-bottom: 2px solid #ea580c;
        }

        .tab-content {
          padding: 2rem;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .gallery-item {
          aspect-ratio: 1;
          border-radius: 0.5rem;
          overflow: hidden;
          cursor: pointer;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .gallery-item:hover img {
          transform: scale(1.05);
        }

        .no-data {
          text-align: center;
          color: #9ca3af;
          padding: 2rem;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .school-header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          // .school-logo {
          //   margin-top: -70px;
          // }

          .school-main-info {
            width: 100%;
          }

          .school-title-row {
            flex-direction: column;
            align-items: center;
          }

          .school-quick-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .school-details {
            grid-template-columns: 1fr;
          }
          
          .school-content {
            grid-template-columns: 1fr;
          }
          
          // .school-stats {
          //   grid-template-columns: repeat(2, 1fr);
          // }
          .school-stats {
            flex-direction: column;
            width: 100%;
          }
          
          .school-actions {
            flex-direction: column;
            width: 100%;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }
          
          .content-tabs {
            flex-direction: column;
          }
          
          .tab-btn {
            justify-content: flex-start;
          }

          .statistics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="school-detail-page">
        <div className="school-detail-container">
          <div className="school-header">
            <div className="school-banner">
              <img src={school.banner} alt={`Bannière ${school.name}`} />
            </div>
            <div className="school-info">
              <div className="school-header-content">
                
                <div className="school-main-info">
                  <div className="school-title-row">
                  <div className="school-name-container">
                    <img src={school.logo} alt={`Logo ${school.name}`} className="school-logo-img" />
                    <h1 className="school-name">{school.name}</h1>
                 </div>
                    <div className="school-badges">
                      <span className="school-level">
                        {school.level.charAt(0).toUpperCase() + school.level.slice(1)}
                      </span>
                      {school.isVerified && (
                        <span className="school-verified">
                          <i className="ph-check-circle-fill"></i>
                          Vérifié
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {school.slogan && (
                    <p className="school-slogan">"{school.slogan}"</p>
                  )}
                  
                  <p className="school-description">{school.description}</p>
                  
                  <div className="school-quick-info">
                    {school.city && school.region && (
                      <div className="quick-info-item">
                        <i className="ph-map-pin"></i>
                        <span>{school.city}, {school.region}</span>
                      </div>
                    )}
                    {school.phone && (
                      <div className="quick-info-item">
                        <i className="ph-phone"></i>
                        <span>{school.phone}</span>
                      </div>
                    )}
                    {school.email && (
                      <div className="quick-info-item">
                        <i className="ph-envelope"></i>
                        <span>{school.email}</span>
                      </div>
                    )}
                    {school.foundedYear && (
                      <div className="quick-info-item">
                        <i className="ph-calendar"></i>
                        <span>Fondée en {school.foundedYear}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="school-actions">
                <button 
                  className={`action-btn ${isFollowing ? 'secondary' : 'primary'}`}
                  onClick={handleFollow}
                >
                  <i className={isFollowing ? 'ph-user-minus' : 'ph-user-plus'}></i>
                  {isFollowing ? 'Ne plus suivre' : 'Suivre'}
                </button>
                {school.phone && (
                  <button className="action-btn outline" onClick={() => window.location.href = `tel:${school.phone}`}>
                    <i className="ph-phone"></i>
                    Appeler
                  </button>
                )}
                {school.email && (
                  <button className="action-btn outline" onClick={() => window.location.href = `mailto:${school.email}`}>
                    <i className="ph-envelope"></i>
                    Email
                  </button>
                )}
                {school.website && (
                  <button className="action-btn outline" onClick={() => window.open(school.website, '_blank')}>
                    <i className="ph-globe"></i>
                    Site web
                  </button>
                )}
                <button className="action-btn outline">
                  <i className="ph-share-network"></i>
                  Partager
                </button>
                <div className="school-stats">
                {school.studentsCount && (
                  <div className="stat-item">
                    <div className="stat-number">{school.studentsCount.toLocaleString()}</div>
                    <div className="stat-label">Élèves</div>
                  </div>
                )}
                {school.teachersCount && (
                  <div className="stat-item">
                    <div className="stat-number">{school.teachersCount}</div>
                    <div className="stat-label">Enseignants</div>
                  </div>
                )}
                {school.rating && (
                  <div className="stat-item">
                    <div className="stat-number">{school.rating}</div>
                    <div className="stat-label">Note</div>
                  </div>
                )}
                {school.programs && school.programs.length > 0 && (
                  <div className="stat-item">
                    <div className="stat-number">{school.programs.length}</div>
                    <div className="stat-label">Programmes</div>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
          {school.directorWords && (
            <div className="director-words">
              <div className="director-title">{school.directorWords.title}</div>
              <div className="director-content">{school.directorWords.content}</div>
              {school.directorWords.directorName && (
                <div style={{ marginTop: '1rem', fontWeight: 600, color: '#92400e' }}>
                  - {school.directorWords.directorName}
                </div>
              )}
            </div>
          )}

          <div className="school-details">
            <div className="details-section">
              <h3 className="section-title">
                <i className="ph-info"></i>
                Informations générales
              </h3>
              
              {school.address && (
                <div className="detail-item">
                  <i className="ph-map-pin detail-icon"></i>
                  <div className="detail-content">
                    <div className="detail-label">Adresse</div>
                    <div className="detail-value">{school.address}</div>
                  </div>
                </div>
              )}
              
              {school.phone && (
                <div className="detail-item">
                  <i className="ph-phone detail-icon"></i>
                  <div className="detail-content">
                    <div className="detail-label">Téléphone</div>
                    <div className="detail-value">{school.phone}</div>
                  </div>
                </div>
              )}
              
              {school.email && (
                <div className="detail-item">
                  <i className="ph-envelope detail-icon"></i>
                  <div className="detail-content">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{school.email}</div>
                  </div>
                </div>
              )}
              
              {school.website && (
                <div className="detail-item">
                  <i className="ph-globe detail-icon"></i>
                  <div className="detail-content">
                    <div className="detail-label">Site web</div>
                    <div className="detail-value">{school.website}</div>
                  </div>
                </div>
              )}
              
              {school.director && (
                <div className="detail-item">
                  <i className="ph-user detail-icon"></i>
                  <div className="detail-content">
                    <div className="detail-label">Directeur</div>
                    <div className="detail-value">{school.director}</div>
                  </div>
                </div>
              )}
              
              {school.foundedYear && (
                <div className="detail-item">
                  <i className="ph-calendar detail-icon"></i>
                  <div className="detail-content">
                    <div className="detail-label">Fondée en</div>
                    <div className="detail-value">{school.foundedYear}</div>
                  </div>
                </div>
              )}

              {school.city && school.region && (
                <div className="detail-item">
                  <i className="ph-map-trifold detail-icon"></i>
                  <div className="detail-content">
                    <div className="detail-label">Localisation</div>
                    <div className="detail-value">{school.city}, {school.region}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="details-section">
              <h3 className="section-title">
                <i className="ph-graduation-cap"></i>
                Programmes offerts
              </h3>
              
              {school.programs && school.programs.length > 0 ? (
                <div className="programs-list">
                  {school.programs.map((program) => (
                    <div key={program.id} className="program-item">
                      <div className="program-name">{program.name}</div>
                      {program.description && (
                        <div className="program-description">{program.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">Aucun programme disponible</div>
              )}
            </div>
          </div>

          <div className="school-details">
            <div className="details-section">
              <h3 className="section-title">
                <i className="ph-buildings"></i>
                Équipements & Infrastructures
              </h3>
              
              {school.amenities && school.amenities.length > 0 ? (
                <div className="activities-grid">
                  {school.amenities.map((amenity) => (
                    <div key={amenity.id} className="activity-item">
                      {amenity.name}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">Aucun équipement listé</div>
              )}
            </div>

            <div className="details-section">
              <h3 className="section-title">
                <i className="ph-star"></i>
                Points forts
              </h3>
              
              {school.strengths && school.strengths.length > 0 ? (
                <ul className="achievements-list">
                  {school.strengths.map((strength) => (
                    <li key={strength.id} className="achievement-item">
                      {strength.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-data">Aucun point fort listé</div>
              )}
            </div>
          </div>

          {school.services && school.services.length > 0 && (
            <div className="details-section" style={{ marginBottom: '2rem' }}>
              <h3 className="section-title">
                <i className="ph-hand-heart"></i>
                Services offerts
              </h3>
              
              <div className="programs-list">
                {school.services.map((service) => (
                  <div key={service.id} className="program-item">
                    <div className="program-name">{service.name}</div>
                    {service.description && (
                      <div className="program-description">{service.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {school.statistics && school.statistics.length > 0 && (
            <div className="details-section" style={{ marginBottom: '2rem' }}>
              <h3 className="section-title">
                <i className="ph-chart-bar"></i>
                Statistiques
              </h3>
              
              <div className="statistics-grid">
                {school.statistics.map((stat) => (
                  <div key={stat.id} className="statistic-item">
                    <div className="statistic-value">
                      {stat.value.toLocaleString()} {stat.unit}
                    </div>
                    <div className="statistic-label">{stat.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="school-content">
            <div className="content-sidebar">
              {school.facilities && school.facilities.length > 0 && (
                <div className="details-section">
                  <h3 className="section-title">
                    <i className="ph-buildings"></i>
                    Installations
                  </h3>
                  <div className="activities-grid">
                    {school.facilities.map((facility, index) => (
                      <div key={index} className="activity-item">
                        {facility}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {school.activities && school.activities.length > 0 && (
                <div className="details-section">
                  <h3 className="section-title">
                    <i className="ph-soccer-ball"></i>
                    Activités
                  </h3>
                  <div className="activities-grid">
                    {school.activities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="content-main">
              <div className="content-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  <i className="ph-clock"></i>
                  Actualités
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  <i className="ph-images"></i>
                  Galerie
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'timeline' && (
                  <div>
                    {school.timeline && school.timeline.length > 0 ? (
                      <div className="timeline">
                        {school.timeline.map(post => (
                          <div key={post.id} className="timeline-post">
                            <div className="post-header">
                              <div className="post-avatar">
                                {school.name.charAt(0)}
                              </div>
                              <div className="post-info">
                                <div className="post-author">{school.name}</div>
                                <div className="post-date">
                                  {new Date(post.date).toLocaleDateString('fr-FR')} à {post.time}
                                </div>
                              </div>
                            </div>
                            
                            <div className="post-content">
                              <h4 className="post-title">{post.title}</h4>
                              <p className="post-text">{post.content}</p>
                              {post.image && (
                                <img src={post.image} alt={post.title} className="post-image" />
                              )}
                            </div>
                            
                            <div className="post-actions">
                              <div className="post-action" onClick={() => handleLike(post.id)}>
                                <i className="ph-heart"></i>
                                <span>{post.likes}</span>
                              </div>
                              <div className="post-action" onClick={() => handleComment(post.id)}>
                                <i className="ph-chat-circle"></i>
                                <span>{post.comments}</span>
                              </div>
                              <div className="post-action" onClick={() => handleShare(post.id)}>
                                <i className="ph-share"></i>
                                <span>{post.shares}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-data">
                        <i className="ph-newspaper" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }}></i>
                        <p>Aucune actualité disponible pour le moment</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div>
                    {school.gallery && school.gallery.length > 0 ? (
                      <div className="gallery-grid">
                        {school.gallery.map((image, index) => (
                          <div key={index} className="gallery-item">
                            <img src={image} alt={`Galerie ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-data">
                        <i className="ph-images" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }}></i>
                        <p>Aucune image dans la galerie</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={() => navigate('/schools')} 
              className="action-btn outline"
              style={{ display: 'inline-flex' }}
            >
              <i className="ph-arrow-left"></i>
              Retour à la liste des écoles
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolDetail;