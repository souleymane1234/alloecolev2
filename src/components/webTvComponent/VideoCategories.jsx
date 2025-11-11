import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Eye, Heart, ArrowRight, Filter, Search, Pause, Volume2, Maximize, Tag } from 'lucide-react';

const VideoCategories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRefs = useRef({});

  // Récupérer les catégories et vidéos depuis les APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les catégories
        const categoriesResponse = await fetch("https://alloecoleapi-dev.up.railway.app/api/v1/students/webtv/categories");
        const categoriesResult = await categoriesResponse.json();
        console.log('Catégories récupérées:', categoriesResult);
        if (categoriesResult.success) {
          const formattedCategories = categoriesResult.data.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            icon: getCategoryIcon(cat.name),
            count: 0
          }));
          
          const allCategories = [
            { id: 'all', name: 'Toutes les catégories', icon: '📺', count: 0 }
          ].concat(formattedCategories);
          
          setCategories(allCategories);
        }

        // Récupérer les vidéos
        const videosResponse = await fetch("https://alloecoleapi-dev.up.railway.app/api/v1/students/webtv/videos");
        const videosResult = await videosResponse.json();
        
        if (videosResult.success) {
          const formattedVideos = videosResult.data.map(video => ({
            id: video.id,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnailUrl || "/images/poster/poster.jpg",
            videoUrl: video.url,
            duration: formatDuration(video.duration),
            views: video.views,
            likes: video.likesCount,
            category: video.category.id,
            categoryName: video.category.name,
            publishedAt: new Date(video.createdAt).toLocaleDateString(),
            premiumRequired: video.premiumRequired,
            tags: video.tags || [],
            author: "Expert AlloEcole",
            isLiked: video.isLiked,
            isFavorite: video.isFavorite,
            commentsCount: video.commentsCount
          }));
          
          setVideos(formattedVideos);
          
          setCategories(prev => prev.map(cat => {
            if (cat.id === 'all') {
              return { ...cat, count: formattedVideos.length };
            }
            const count = formattedVideos.filter(video => video.category === cat.id).length;
            return { ...cat, count };
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Orientation Professionnelle': '🎯',
      'Technologie': '💻',
      'Vie Universitaire': '🏫',
      'Éducation': '📚'
    };
    return icons[categoryName] || '📺';
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Fonction de redirection vers la page détail
  const handleVideoClick = (video) => {
    navigate(`/webtv/video/${video.id}`);
  };

  const handlePlayPause = (video, e) => {
    e.stopPropagation(); // Empêcher la redirection quand on clique sur le bouton play
    
    if (video.premiumRequired) {
      setSelectedVideo(video);
      setShowPremiumPopup(true);
      return;
    }

    const videoElement = videoRefs.current[video.id];
    
    if (!videoElement) return;

    if (playingVideo === video.id) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo].pause();
      }
      
      videoElement.play();
      setPlayingVideo(video.id);
    }
  };

  const handleVideoEnd = (videoId) => {
    setPlayingVideo(null);
  };

  const handleFullscreen = (videoId, e) => {
    e.stopPropagation();
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
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  if (loading) {
    return (
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div className="skeleton-loader" style={{height: '50px', width: '300px', margin: '0 auto 1rem'}}></div>
            <div className="skeleton-loader" style={{height: '24px', width: '400px', margin: '0 auto'}}></div>
          </div>
          
          <div className="categories-grid">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-loader" style={{height: '120px', borderRadius: '0.75rem'}}></div>
            ))}
          </div>
          
          <div className="videos-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-loader" style={{height: '280px', borderRadius: '1rem'}}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style jsx>{`
        .categories-section {
          padding: 3rem 0;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .filters-section {
          background: #f8fafc;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .category-select {
          padding: 0.625rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
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
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .category-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.25rem;
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
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .category-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .category-count {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .videos-section {
          margin-top: 2rem;
        }

        .videos-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .videos-title {
          font-size: 1.25rem;
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
          gap: 1.5rem;
        }

        .video-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: fit-content;
        }

        .video-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          height: 160px;
          background: #e5e7eb;
          overflow: hidden;
          flex-shrink: 0;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
          opacity: 1;
          transition: opacity 0.3s;
        }

        .video-card:hover .video-overlay {
          opacity: 1;
        }

        .play-overlay {
          width: 44px;
          height: 44px;
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
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s;
          opacity: 0;
        }

        .video-thumbnail:hover .video-controls {
          opacity: 1;
        }

        .control-buttons {
          display: flex;
          gap: 0.375rem;
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
          bottom: 0.5rem;
          right: 0.5rem;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .premium-badge {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          background: rgba(249, 115, 22, 0.9);
          color: white;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.7rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.125rem;
        }

        .video-content {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .video-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }

        .video-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .tags-section {
          margin: 0.25rem 0;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.65rem;
          font-weight: 500;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .tag:hover {
          background: #f97316;
          color: white;
          border-color: #f97316;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .author-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.6rem;
          flex-shrink: 0;
        }

        .author-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
        }

        .video-actions {
          display: flex;
          gap: 0.375rem;
          margin-top: 0.5rem;
        }

        .action-button {
          flex: 1;
          padding: 0.375rem;
          border: 1px solid #e5e7eb;
          background: white;
          color: #6b7280;
          border-radius: 0.375rem;
          font-size: 0.7rem;
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
          flex: 2;
        }

        .action-button.primary:hover {
          background: #ea580c;
        }

        .view-details-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          flex: 1;
        }

        .view-details-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .load-more {
          text-align: center;
          margin-top: 2rem;
        }

        .load-more-button {
          background: #f97316;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
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

        .premium-popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .premium-content {
          background: white;
          padding: 1.5rem;
          border-radius: 0.75rem;
          text-align: center;
          max-width: 350px;
          margin: 1rem;
        }

        .premium-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }

        .premium-message {
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .premium-button {
          background: #f97316;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .premium-button:hover {
          background: #ea580c;
        }

        .close-button {
          background: #6b7280;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          margin-left: 0.75rem;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .skeleton-loader {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 0.5rem;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @media (max-width: 768px) {
          .categories-section {
            padding: 2rem 0;
          }

          .filters-row {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }

          .videos-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .video-controls {
            padding: 0.375rem;
          }

          .control-buttons {
            gap: 0.25rem;
          }

          .video-content {
            padding: 0.75rem;
          }

          .tags-container {
            gap: 0.125rem;
          }

          .tag {
            font-size: 0.6rem;
            padding: 0.1rem 0.3rem;
          }

          .video-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .videos-grid {
            grid-template-columns: 1fr;
          }
          
          .video-thumbnail {
            height: 140px;
          }
          
          .action-button {
            font-size: 0.65rem;
            padding: 0.25rem;
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
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher une vidéo, un tag..."
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
                <div className="category-count">{category.count} vidéo{category.count > 1 ? 's' : ''}</div>
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
                <div 
                  key={video.id} 
                  className="video-card"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="video-thumbnail">
                    <video
                      ref={el => videoRefs.current[video.id] = el}
                      className="video-element"
                      poster={video.thumbnail}
                      onEnded={() => handleVideoEnd(video.id)}
                      preload="metadata"
                      style={{ display: playingVideo === video.id ? 'block' : 'none' }}
                    >
                      <source src={video.videoUrl} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>

                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="video-thumbnail-image"
                      style={{ display: playingVideo === video.id ? 'none' : 'block' }}
                    />

                    {video.premiumRequired && (
                      <div className="premium-badge">
                        🔒 Premium
                      </div>
                    )}

                    <div 
                      className="video-overlay"
                      style={{ display: playingVideo === video.id ? 'none' : 'flex' }}
                    >
                      <div 
                        className="play-overlay"
                        onClick={(e) => handlePlayPause(video, e)}
                      >
                        <Play size={18} />
                      </div>
                    </div>

                    <div className="video-controls">
                      <div className="control-buttons">
                        <button 
                          className="control-button"
                          onClick={(e) => handlePlayPause(video, e)}
                        >
                          {playingVideo === video.id ? <Pause size={12} /> : <Play size={12} />}
                        </button>
                        <button className="control-button">
                          <Volume2 size={12} />
                        </button>
                        <button 
                          className="control-button"
                          onClick={(e) => handleFullscreen(video.id, e)}
                        >
                          <Maximize size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="video-duration">{video.duration}</div>
                  </div>
                  
                  <div className="video-content">
                    <h4 className="video-title">{video.title}</h4>
                    
                    <div className="video-meta">
                      <div className="meta-item">
                        <Clock size={12} />
                        {video.duration}
                      </div>
                      <div className="meta-item">
                        <Eye size={12} />
                        {video.views.toLocaleString()}
                      </div>
                      <div className="meta-item">
                        <Heart size={12} />
                        {video.likes}
                      </div>
                    </div>

                    {video.tags && video.tags.length > 0 && (
                      <div className="tags-section">
                        <div className="tags-container">
                          {video.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                              {tag}
                            </span>
                          ))}
                          {video.tags.length > 3 && (
                            <span className="tag">
                              +{video.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

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
                          handlePlayPause(video, e);
                        }}
                      >
                        {playingVideo === video.id ? <Pause size={12} /> : <Play size={12} />}
                        {playingVideo === video.id ? 'Pause' : 'Regarder'}
                      </button>
                      <button 
                        className="view-details-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoClick(video);
                        }}
                      >
                        <ArrowRight size={12} />
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                Aucune vidéo trouvée pour cette recherche.
              </div>
            )}

            {filteredVideos.length > 8 && (
              <div className="load-more">
                <button className="load-more-button">
                  <Filter size={18} />
                  Voir plus de vidéos
                </button>
              </div>
            )}
          </div>
        </div>

        {showPremiumPopup && (
          <div className="premium-popup">
            <div className="premium-content">
              <h3 className="premium-title">Contenu Premium</h3>
              <p className="premium-message">
                {selectedVideo?.title} est réservée aux membres Premium. Abonnez-vous pour accéder à tous nos contenus exclusifs.
              </p>
              <div>
                <button className="premium-button" onClick={() => setShowPremiumPopup(false)}>
                  Devenir Premium
                </button>
                <button className="close-button" onClick={() => setShowPremiumPopup(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default VideoCategories;