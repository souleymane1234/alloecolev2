import React, { useState, useRef } from 'react';
import { Play, Clock, Eye, Heart, ArrowRight, Filter, Search, Pause, Volume2, Maximize } from 'lucide-react';

const VideoCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});

  const categories = [
    { id: 'all', name: 'Toutes les catégories', icon: '📺', count: 156 },
    { id: 'orientation', name: 'Orientation', icon: '🎯', count: 32 },
    { id: 'bourses', name: 'Bourses d\'études', icon: '💰', count: 28 },
    { id: 'etudes-etranger', name: 'Études à l\'étranger', icon: '🌍', count: 24 },
    { id: 'campus-france', name: 'Campus France', icon: '🇫🇷', count: 18 },
    { id: 'conseils', name: 'Conseils pratiques', icon: '💡', count: 22 },
    { id: 'temoignages', name: 'Témoignages', icon: '👥', count: 15 },
    { id: 'actualites', name: 'Actualités', icon: '📰', count: 17 }
  ];

  const videos = [
    {
      id: 1,
      title: "Comment choisir sa filière après le BAC",
      thumbnail: "/images/poster/poster.jpg",
      videoUrl: "/video/video.mp4",
      duration: "15:30",
      views: 12500,
      likes: 890,
      category: "orientation",
      publishedAt: "2024-01-20",
      author: "Dr. Marie Kouassi"
    },
    {
      id: 2,
      title: "Les bourses d'excellence disponibles en 2024",
      thumbnail: "/images/poster/poster.jpg",
      videoUrl: "/video/video.mp4",
      duration: "18:45",
      views: 8900,
      likes: 567,
      category: "bourses",
      publishedAt: "2024-01-18",
      author: "Prof. Jean Traoré"
    },
    {
      id: 3,
      title: "Étudier au Canada : Guide complet",
      thumbnail: "/images/poster/poster.jpg",
      videoUrl: "/video/video.mp4",
      duration: "22:15",
      views: 15600,
      likes: 1205,
      category: "etudes-etranger",
      publishedAt: "2024-01-15",
      author: "Dr. Fatou Diabaté"
    },
    {
      id: 4,
      title: "Dossier Campus France : Les erreurs à éviter",
      thumbnail: "/images/poster/poster.jpg",
      videoUrl: "/video/video.mp4",
      duration: "12:20",
      views: 22100,
      likes: 1340,
      category: "campus-france",
      publishedAt: "2024-01-12",
      author: "Mme. Aminata Koné"
    },
    {
      id: 5,
      title: "Comment rédiger une lettre de motivation efficace",
      thumbnail: "/images/poster/poster.jpg",
      videoUrl: "/video/video.mp4",
      duration: "14:10",
      views: 9800,
      likes: 678,
      category: "conseils",
      publishedAt: "2024-01-10",
      author: "Dr. Ibrahim Ouattara"
    },
    {
      id: 6,
      title: "Témoignage : Mon parcours d'études en France",
      thumbnail: "/images/poster/poster.jpg",
      videoUrl: "/video/video.mp4",
      duration: "20:30",
      views: 18700,
      likes: 1456,
      category: "temoignages",
      publishedAt: "2024-01-08",
      author: "Kouassi Jean"
    },
    {
      id: 7,
      title: "Nouvelles réformes du système éducatif ivoirien",
      thumbnail: "/images/poster/poster.jpg",
      videoUrl: "/video/video.mp4",
      duration: "16:45",
      views: 11200,
      likes: 789,
      category: "actualites",
      publishedAt: "2024-01-05",
      author: "Ministère de l'Éducation"
    },
    {
      id: 8,
      title: "Orientation : Les métiers d'avenir",
      thumbnail: "/images/poster/poster.jpg",
      videoUrl: "/video/video.mp4",
      duration: "19:20",
      views: 13400,
      likes: 923,
      category: "orientation",
      publishedAt: "2024-01-03",
      author: "Dr. Marie Kouassi"
    }
  ];

  const handlePlayPause = (videoId) => {
    const videoElement = videoRefs.current[videoId];
    
    if (!videoElement) return;

    if (playingVideo === videoId) {
      // Pause current video
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // Pause any currently playing video
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo].pause();
      }
      
      // Play new video
      videoElement.play();
      setPlayingVideo(videoId);
    }
  };

  const handleVideoEnd = (videoId) => {
    setPlayingVideo(null);
  };

  const handleFullscreen = (videoId) => {
    const videoElement = videoRefs.current[videoId];
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      }
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <>
      <style jsx>{`
        .categories-section {
          padding: 4rem 0;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .filters-section {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .category-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-select:focus {
          outline: none;
          border-color: #f97316;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .category-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-card:hover {
          border-color: #f97316;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
        }

        .category-card.active {
          border-color: #f97316;
          background: #fff7ed;
        }

        .category-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .category-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .category-count {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .videos-section {
          margin-top: 3rem;
        }

        .videos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .videos-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
        }

        .videos-count {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .video-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 180px;
          background: #e5e7eb;
          overflow: hidden;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: ${playingVideo ? 'block' : 'none'};
        }

        .video-thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: ${playingVideo ? 'none' : 'block'};
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: ${playingVideo ? 0 : 1};
          transition: opacity 0.3s;
        }

        .video-card:hover .video-overlay {
          opacity: 1;
        }

        .play-overlay {
          width: 50px;
          height: 50px;
          background: rgba(249, 115, 22, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .play-overlay:hover {
          background: #f97316;
          transform: scale(1.1);
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          padding: 0.75rem;
          display: ${playingVideo ? 'flex' : 'none'};
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s;
        }

        .video-thumbnail:hover .video-controls {
          display: flex;
        }

        .control-buttons {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .control-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.25rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .video-duration {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          display: ${playingVideo ? 'none' : 'block'};
        }

        .video-content {
          padding: 1.5rem;
        }

        .video-title {
          font-size: 1.125rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .video-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .author-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.75rem;
        }

        .author-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .video-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          background: white;
          color: #6b7280;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }

        .action-button:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .action-button.primary {
          background: #f97316;
          color: white;
          border-color: #f97316;
        }

        .action-button.primary:hover {
          background: #ea580c;
        }

        .load-more {
          text-align: center;
          margin-top: 3rem;
        }

        .load-more-button {
          background: #f97316;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .load-more-button:hover {
          background: #ea580c;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        @media (max-width: 768px) {
          .filters-row {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .videos-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 2rem;
          }

          .video-controls {
            padding: 0.5rem;
          }

          .control-buttons {
            gap: 0.25rem;
          }
        }
      `}</style>

      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Bibliothèque vidéo</h2>
            <p className="section-subtitle">
              Explorez nos contenus vidéo organisés par catégories
            </p>
          </div>

          <div className="filters-section">
            <div className="filters-row">
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher une vidéo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="categories-grid">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
                <div className="category-count">{category.count} vidéos</div>
              </div>
            ))}
          </div>

          <div className="videos-section">
            <div className="videos-header">
              <div>
                <h3 className="videos-title">
                  {selectedCategoryData?.name || 'Toutes les vidéos'}
                </h3>
                <p className="videos-count">
                  {filteredVideos.length} vidéo{filteredVideos.length > 1 ? 's' : ''} trouvée{filteredVideos.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="videos-grid">
              {filteredVideos.map((video) => (
                <div key={video.id} className="video-card">
                  <div className="video-thumbnail">
                    {/* Élément vidéo */}
                    <video
                      ref={el => videoRefs.current[video.id] = el}
                      className="video-element"
                      poster={video.thumbnail}
                      onEnded={() => handleVideoEnd(video.id)}
                      preload="metadata"
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>

                    {/* Miniature */}
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="video-thumbnail-image"
                    />

                    {/* Overlay de lecture */}
                    <div className="video-overlay">
                      <div 
                        className="play-overlay"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(video.id);
                        }}
                      >
                        {playingVideo === video.id ? <Pause size={20} /> : <Play size={20} />}
                      </div>
                    </div>

                    {/* Contrôles vidéo */}
                    <div className="video-controls">
                      <div className="control-buttons">
                        <button 
                          className="control-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause(video.id);
                          }}
                        >
                          {playingVideo === video.id ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <button className="control-button">
                          <Volume2 size={14} />
                        </button>
                        <button 
                          className="control-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFullscreen(video.id);
                          }}
                        >
                          <Maximize size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Durée de la vidéo */}
                    <div className="video-duration">{video.duration}</div>
                  </div>
                  
                  <div className="video-content">
                    <h4 className="video-title">{video.title}</h4>
                    
                    <div className="video-meta">
                      <div className="meta-item">
                        <Clock size={14} />
                        {video.duration}
                      </div>
                      <div className="meta-item">
                        <Eye size={14} />
                        {video.views.toLocaleString()} vues
                      </div>
                      <div className="meta-item">
                        <Heart size={14} />
                        {video.likes} j'aime
                      </div>
                    </div>

                    <div className="author-info">
                      <div className="author-avatar">
                        {video.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="author-name">{video.author}</div>
                    </div>

                    <div className="video-actions">
                      <button 
                        className="action-button primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(video.id);
                        }}
                      >
                        {playingVideo === video.id ? <Pause size={14} /> : <Play size={14} />}
                        {playingVideo === video.id ? 'Pause' : 'Regarder'}
                      </button>
                      <button className="action-button">
                        <Heart size={14} />
                      </button>
                      <button className="action-button">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length > 8 && (
              <div className="load-more">
                <button className="load-more-button">
                  <Filter size={20} />
                  Voir plus de vidéos
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoCategories;