import React, { useState, useRef } from 'react';
import { Play, Volume2, Maximize, Share2, Heart, Download, Clock, Eye, Pause } from 'lucide-react';

const WebTVHero = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);

  const featuredVideo = {
    id: 1,
    title: "Comment bien choisir son orientation après le BAC ?",
    description: "Découvrez les meilleures stratégies pour faire le bon choix d'orientation après votre baccalauréat. Nos experts vous guident à travers les différentes options disponibles.",
    thumbnail: "/images/poster/poster.jpg",
    videoUrl: "/video/video2.mp4",
    duration: "15:30",
    views: 12500,
    likes: 890,
    category: "Orientation",
    publishedAt: "2024-01-15",
    author: {
      name: "Dr. Marie Kouassi",
      title: "Conseillère en orientation",
      avatar: "/assets/images/placeholder-avatar.jpg"
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleVolumeChange = (e) => {
    if (videoRef.current) {
      videoRef.current.volume = e.target.value;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleVideoClick = () => {
    handlePlay();
  };

  return (
    <>
      <style jsx>{`
        .webtv-hero {
          position: relative;
          min-height: 70vh;
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          position: relative;
          z-index: 2;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-info {
          color: white;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(249, 115, 22, 0.2);
          border: 1px solid #f97316;
          color: #f97316;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-description {
          font-size: 1.25rem;
          color: #d1d5db;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .hero-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
          font-size: 0.875rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .play-button {
          background: #f97316;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .play-button:hover {
          background: #ea580c;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .secondary-button {
          background: transparent;
          color: white;
          border: 2px solid #6b7280;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .secondary-button:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .hero-video {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
        }

        .video-container {
          position: relative;
          width: 100%;
          height: 400px;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: ${isPlaying ? 'none' : 'block'};
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: ${isPlaying ? 'none' : 'flex'};
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .play-overlay {
          width: 80px;
          height: 80px;
          background: rgba(249, 115, 22, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
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
          padding: 1.5rem;
          display: ${showControls ? 'flex' : 'none'};
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s;
        }

        .video-container:hover .video-controls {
          display: flex;
        }

        .video-info {
          color: white;
        }

        .video-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .video-duration {
          font-size: 0.875rem;
          color: #d1d5db;
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
          padding: 0.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .volume-control {
          width: 80px;
          cursor: pointer;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.25rem;
        }

        .author-details h4 {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .author-details p {
          color: #d1d5db;
          font-size: 0.875rem;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/assets/images/bg/webtv-bg.jpg') center/cover;
          opacity: 0.1;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-meta {
            flex-direction: column;
            gap: 1rem;
          }

          .hero-actions {
            flex-direction: column;
          }

          .video-container {
            height: 250px;
          }

          .video-controls {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .control-buttons {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>

      <section className="webtv-hero">
        <div className="hero-background"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-info">
              <div className="hero-badge">
                <Play size={16} />
                Web TV AlloEcole
              </div>
              
              <h1 className="hero-title">
                Votre chaîne éducative
                <span style={{ color: '#f97316' }}> en ligne</span>
              </h1>
              
              <p className="hero-description">
                Découvrez des contenus vidéo exclusifs sur l'orientation, les études, 
                les bourses et les conseils pratiques pour réussir votre parcours éducatif.
              </p>

              <div className="hero-meta">
                <div className="meta-item">
                  <Clock size={16} />
                  {featuredVideo.duration}
                </div>
                <div className="meta-item">
                  <Eye size={16} />
                  {featuredVideo.views.toLocaleString()} vues
                </div>
                <div className="meta-item">
                  <Heart size={16} />
                  {featuredVideo.likes} j'aime
                </div>
              </div>
            </div>

            <div className="hero-video">
              <div className="video-container" onClick={handleVideoClick}>
                {/* Élément vidéo réel */}
                <video
                  ref={videoRef}
                  className="video-element"
                  poster={featuredVideo.thumbnail}
                  onEnded={handleVideoEnd}
                >
                  <source src={featuredVideo.videoUrl} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>

                {/* Miniature (affichée seulement quand la vidéo ne joue pas) */}
                <img 
                  src={featuredVideo.thumbnail} 
                  alt={featuredVideo.title}
                  className="video-thumbnail"
                />

                {/* Overlay de lecture (affiché seulement quand la vidéo ne joue pas) */}
                <div className="video-overlay">
                  <div className="play-overlay" onClick={handlePlay}>
                    <Play size={32} />
                  </div>
                </div>

                {/* Contrôles vidéo */}
                <div className="video-controls">
                  <div className="video-info">
                    <div className="video-title">{featuredVideo.title}</div>
                    <div className="video-duration">{featuredVideo.duration}</div>
                  </div>
                  <div className="control-buttons">
                    <button className="control-button">
                      <Volume2 size={16} />
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      defaultValue="1"
                      className="volume-control"
                      onChange={handleVolumeChange}
                    />
                    <button className="control-button" onClick={handleFullscreen}>
                      <Maximize size={16} />
                    </button>
                    <button className="control-button" onClick={handleLike}>
                      <Heart 
                        size={16} 
                        style={{ color: isLiked ? '#ef4444' : 'white' }} 
                      />
                    </button>
                    <button className="control-button">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="author-info">
                <div className="author-avatar">
                  {featuredVideo.author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="author-details">
                  <h4>{featuredVideo.author.name}</h4>
                  <p>{featuredVideo.author.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WebTVHero;