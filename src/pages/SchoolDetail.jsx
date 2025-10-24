import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SchoolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');
  const [isFollowing, setIsFollowing] = useState(false);
  const [newPost, setNewPost] = useState('');

  // Données d'exemple (en réalité, cela viendrait d'une API)
  const mockSchoolData = {
    1: {
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
      description: "École primaire d'excellence offrant une éducation de qualité dans un environnement moderne et sécurisé. Nous nous engageons à développer le potentiel de chaque enfant.",
      latitude: 5.316667,
      longitude: -4.033333,
      rating: 4.5,
      studentsCount: 450,
      teachersCount: 25,
      foundedYear: 1995,
      director: "Mme Marie Kouassi",
      activities: ["Sport", "Musique", "Théâtre", "Art plastique", "Danse"],
      facilities: ["Bibliothèque", "Laboratoire informatique", "Terrain de sport", "Cantine"],
      achievements: [
        "Meilleure école primaire 2023",
        "Prix d'excellence académique",
        "Certification qualité ISO 9001"
      ],
      socialStats: {
        followers: 1250,
        following: 45,
        posts: 89
      },
      timeline: [
        {
          id: 1,
          type: "news",
          title: "Inscription ouverte pour l'année 2024-2025",
          content: "Les inscriptions pour la nouvelle année scolaire sont maintenant ouvertes. Venez découvrir notre établissement lors de nos journées portes ouvertes.",
          date: "2024-01-15",
          time: "10:30",
          image: "/images/news/inscription-2024.jpg",
          likes: 45,
          comments: 12,
          shares: 8
        },
        {
          id: 2,
          type: "event",
          title: "Journée sportive annuelle",
          content: "Notre journée sportive annuelle aura lieu le 25 janvier. Tous les parents sont invités à venir encourager leurs enfants.",
          date: "2024-01-20",
          time: "14:00",
          image: "/images/news/journee-sportive.jpg",
          likes: 32,
          comments: 8,
          shares: 5
        },
        {
          id: 3,
          type: "achievement",
          title: "Félicitations à nos élèves",
          content: "Nous sommes fiers de nos élèves qui ont obtenu d'excellents résultats aux examens de fin d'année. Bravo à tous !",
          date: "2024-01-10",
          time: "16:45",
          image: "/images/news/felicitations-eleves.jpg",
          likes: 67,
          comments: 23,
          shares: 15
        }
      ],
      gallery: [
        "/images/gallery/ecole-1.jpg",
        "/images/gallery/ecole-2.jpg",
        "/images/gallery/ecole-3.jpg",
        "/images/gallery/ecole-4.jpg",
        "/images/gallery/ecole-5.jpg"
      ]
    }
  };

  useEffect(() => {
    // Simulation du chargement des données (très réduit pour une navigation fluide)
    // setTimeout(() => {
      const schoolData = mockSchoolData[id];
      if (schoolData) {
        setSchool(schoolData);
      }
    //   setLoading(false);
    // }, 150); 
  }, [id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Ici, vous feriez un appel API pour suivre/ne plus suivre
  };

  const handleLike = (postId) => {
    // Logique pour liker un post
    console.log('Like post:', postId);
  };

  const handleComment = (postId) => {
    // Logique pour commenter un post
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId) => {
    // Logique pour partager un post
    console.log('Share post:', postId);
  };

  const handleNewPost = () => {
    if (newPost.trim()) {
      // Logique pour créer un nouveau post
      console.log('New post:', newPost);
      setNewPost('');
    }
  };

  if (loading) {
    return (
      <div className="school-detail-loading">
        <div className="loading-spinner">
          <div className="spinner-container">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="loading-text">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
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
    );
  }

  return (
    <>
      <style>{`
        @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
        
        .school-detail-page {
          min-height: 100vh;
          background: #f8fafc;
        }

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

        .school-logo {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border: 4px solid white;
        }

        .school-logo img {
          width: 90px;
          height: 90px;
          object-fit: contain;
        }

        .school-info {
          padding: 3rem 2rem 2rem;
          text-align: center;
        }

        .school-name {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .school-level {
          display: inline-block;
          background: #ea580c;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .school-description {
          color: #6b7280;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .school-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #ea580c;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .school-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
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

        .new-post-section {
          background: #f8fafc;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .new-post-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          resize: vertical;
          min-height: 80px;
          margin-bottom: 0.75rem;
        }

        .new-post-input:focus {
          outline: none;
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }

        .new-post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .post-btn {
          background: #ea580c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .timeline-post {
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .post-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .post-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ea580c;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }

        .post-info {
          flex: 1;
        }

        .post-author {
          font-weight: 600;
          color: #1f2937;
        }

        .post-date {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .post-content {
          margin-bottom: 1rem;
        }

        .post-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .post-text {
          color: #6b7280;
          line-height: 1.5;
        }

        .post-image {
          width: 100%;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .post-actions {
          display: flex;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .post-action {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s;
          color: #6b7280;
        }

        .post-action:hover {
          background: #f3f4f6;
          color: #ea580c;
        }

        .post-action.liked {
          color: #ea580c;
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

        @media (max-width: 768px) {
          .school-details {
            grid-template-columns: 1fr;
          }
          
          .school-content {
            grid-template-columns: 1fr;
          }
          
          .school-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .school-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .content-tabs {
            flex-direction: column;
          }
          
          .tab-btn {
            justify-content: flex-start;
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
              <div className="school-logo">
                <img src={school.logo} alt={`Logo ${school.name}`} />
              </div>
              
              <h1 className="school-name">{school.name}</h1>
              <span className="school-level">
                {school.level.charAt(0).toUpperCase() + school.level.slice(1)}
              </span>
              
              <p className="school-description">{school.description}</p>
              
              <div className="school-stats">
                <div className="stat-item">
                  <div className="stat-number">{school.socialStats.followers}</div>
                  <div className="stat-label">Abonnés</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{school.studentsCount}</div>
                  <div className="stat-label">Élèves</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{school.teachersCount}</div>
                  <div className="stat-label">Enseignants</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{school.rating}</div>
                  <div className="stat-label">Note</div>
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
                <button className="action-btn outline">
                  <i className="ph-phone"></i>
                  Contacter
                </button>
                <button className="action-btn outline">
                  <i className="ph-share-network"></i>
                  Partager
                </button>
              </div>
            </div>
          </div>

          <div className="school-details">
            <div className="details-section">
              <h3 className="section-title">
                <i className="ph-info"></i>
                Informations générales
              </h3>
              
              <div className="detail-item">
                <i className="ph-map-pin detail-icon"></i>
                <div className="detail-content">
                  <div className="detail-label">Adresse</div>
                  <div className="detail-value">{school.address}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <i className="ph-phone detail-icon"></i>
                <div className="detail-content">
                  <div className="detail-label">Téléphone</div>
                  <div className="detail-value">{school.phone}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <i className="ph-envelope detail-icon"></i>
                <div className="detail-content">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{school.email}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <i className="ph-globe detail-icon"></i>
                <div className="detail-content">
                  <div className="detail-label">Site web</div>
                  <div className="detail-value">{school.website}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <i className="ph-user detail-icon"></i>
                <div className="detail-content">
                  <div className="detail-label">Directeur</div>
                  <div className="detail-value">{school.director}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <i className="ph-calendar detail-icon"></i>
                <div className="detail-content">
                  <div className="detail-label">Fondée en</div>
                  <div className="detail-value">{school.foundedYear}</div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3 className="section-title">
                <i className="ph-star"></i>
                Activités et réalisations
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem', color: '#374151' }}>Activités</h4>
                <div className="activities-grid">
                  {school.activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '0.75rem', color: '#374151' }}>Réalisations</h4>
                <ul className="achievements-list">
                  {school.achievements.map((achievement, index) => (
                    <li key={index} className="achievement-item">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="school-content">
            <div className="content-sidebar">
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
                    <div className="new-post-section">
                      <textarea
                        className="new-post-input"
                        placeholder="Partagez une actualité..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                      />
                      <div className="new-post-actions">
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="post-action">
                            <i className="ph-image"></i>
                          </button>
                          <button className="post-action">
                            <i className="ph-video"></i>
                          </button>
                        </div>
                        <button className="post-btn" onClick={handleNewPost}>
                          Publier
                        </button>
                      </div>
                    </div>

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
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div className="gallery-grid">
                    {school.gallery.map((image, index) => (
                      <div key={index} className="gallery-item">
                        <img src={image} alt={`Galerie ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolDetail;
