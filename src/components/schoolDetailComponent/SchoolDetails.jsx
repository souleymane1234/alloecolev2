import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './SchoolDetails.css';

const SchoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');
  const [isFollowing, setIsFollowing] = useState(false);
  const [newPost, setNewPost] = useState('');

  // Fonction pour récupérer les détails de l'école depuis l'API
  const fetchSchoolDetails = async () => {
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
      return {
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
    }
    
    throw new Error("Données de l'école non disponibles");
  };

  // Utilisation de React Query
  const { data: school, isLoading, error, isError } = useQuery({
    queryKey: ['school', id],
    queryFn: fetchSchoolDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!id, // Ne charge que si l'ID existe
  });

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

  if (isError) {
    return (
      <>
        <div className="school-error">
          <div className="error-content">
            <i className="ph-warning-circle"></i>
            <h2>Erreur de chargement</h2>
            <p>{error?.message || "Impossible de charger les détails de l'école"}</p>
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

export default SchoolDetails;