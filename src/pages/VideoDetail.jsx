import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, Maximize, Heart, Share2, Clock, Eye, MessageCircle, ThumbsUp, Send, ArrowLeft, User, Calendar, Tag } from 'lucide-react';

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const videoRef = useRef(null);

  // Récupérer les détails de la vidéo
  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://alloecoleapi-dev.up.railway.app/api/v1/students/webtv/videos/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setVideo(result.data);
          setIsLiked(result.data.isLiked);
          // Charger les commentaires
          fetchComments();
        } else {
          setError('Vidéo non trouvée');
        }
      } catch (error) {
        setError('Erreur lors du chargement de la vidéo');
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetail();
  }, [id]);

  // API pour les commentaires (simulée - à remplacer par votre vraie API)
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      // Simuler l'API des commentaires
      const mockComments = [
        {
          id: 1,
          user: { name: "Jean Dupont", avatar: "JD" },
          text: "Très bon tutoriel pour débutants !",
          createdAt: "2024-01-15T10:30:00Z",
          likes: 5
        },
        {
          id: 2,
          user: { name: "Marie Curie", avatar: "MC" },
          text: "Les explications sont très claires, merci !",
          createdAt: "2024-01-14T15:20:00Z",
          likes: 3
        }
      ];
      setComments(mockComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Gérer le like de la vidéo
  const handleLike = async () => {
    if (loadingLike) return;
    
    try {
      setLoadingLike(true);
      // API pour liker (simulée - à remplacer par votre vraie API)
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: id,
          like: !isLiked
        })
      };

      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLiked(!isLiked);
      if (video) {
        setVideo({
          ...video,
          likesCount: isLiked ? video.likesCount - 1 : video.likesCount + 1
        });
      }
    } catch (error) {
      console.error('Error liking video:', error);
    } finally {
      setLoadingLike(false);
    }
  };

  // Ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // API pour ajouter un commentaire (simulée)
      const comment = {
        id: Date.now(),
        user: { name: "Utilisateur", avatar: "U" }, // Remplacer par les vraies données utilisateur
        text: newComment,
        createdAt: new Date().toISOString(),
        likes: 0
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      
      if (video) {
        setVideo({
          ...video,
          commentsCount: video.commentsCount + 1
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Contrôles vidéo
  const handlePlayPause = () => {
    if (video?.premiumRequired) {
      alert('Cette vidéo est réservée aux membres Premium');
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="video-detail-loading">
        <div className="skeleton-loader" style={{height: '500px', width: '100%'}}></div>
        <div className="container">
          <div className="skeleton-loader" style={{height: '40px', width: '70%', margin: '2rem 0 1rem'}}></div>
          <div className="skeleton-loader" style={{height: '20px', width: '100%', marginBottom: '0.5rem'}}></div>
          <div className="skeleton-loader" style={{height: '20px', width: '80%', marginBottom: '2rem'}}></div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="video-detail-error">
        <div className="container">
          <div style={{textAlign: 'center', padding: '4rem 0'}}>
            <h2>Vidéo non trouvée</h2>
            <p>{error || "La vidéo que vous recherchez n'existe pas."}</p>
            <button 
              onClick={() => navigate('/webtv')}
              className="back-button"
            >
              <ArrowLeft size={20} />
              Retour à la WebTV
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .video-detail {
          min-height: 100vh;
          background: #f8fafc;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f97316;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin: 1rem 0 2rem;
        }

        .back-button:hover {
          background: #ea580c;
          transform: translateY(-2px);
        }

        .video-player-section {
          background: #1f2937;
          padding: 2rem 0;
        }

        .video-player-container {
          max-width: 900px;
          margin: 0 auto;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          background: #000;
        }

        .video-element {
          width: 100%;
          height: auto;
          display: block;
        }

        .video-controls-overlay {
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

        .video-wrapper:hover .video-controls-overlay {
          display: flex;
        }

        .video-info-overlay {
          color: white;
        }

        .video-title-overlay {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .video-meta-overlay {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #d1d5db;
        }

        .control-buttons-overlay {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .control-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .volume-control {
          width: 80px;
          cursor: pointer;
        }

        .video-content {
          padding: 2rem 0;
        }

        .video-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .video-main-info {
          flex: 1;
        }

        .video-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .video-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .video-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-button.primary {
          background: #f97316;
          color: white;
        }

        .action-button.primary:hover {
          background: #ea580c;
          transform: translateY(-2px);
        }

        .action-button.secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .action-button.secondary:hover {
          background: #d1d5db;
        }

        .action-button.liked {
          background: #ef4444;
          color: white;
        }

        .video-side-info {
          background: white;
          padding: 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-weight: 600;
          color: #374151;
          min-width: 80px;
        }

        .info-value {
          color: #6b7280;
        }

        .category-badge {
          background: #fff7ed;
          color: #f97316;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .video-description {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .description-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .description-text {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .tags-section {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .comments-section {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .comments-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .comments-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
        }

        .comments-count {
          background: #f97316;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .comment-form {
          margin-bottom: 2rem;
        }

        .comment-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          margin-bottom: 1rem;
          resize: vertical;
          min-height: 80px;
        }

        .comment-input:focus {
          outline: none;
          border-color: #f97316;
        }

        .submit-comment {
          background: #f97316;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .submit-comment:hover {
          background: #ea580c;
        }

        .comments-list {
          space-y: 1.5rem;
        }

        .comment-item {
          padding: 1.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .comment-item:last-child {
          border-bottom: none;
        }

        .comment-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.75rem;
        }

        .comment-user {
          font-weight: 600;
          color: #1f2937;
        }

        .comment-date {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .comment-text {
          color: #4b5563;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .comment-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .comment-like {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s;
        }

        .comment-like:hover {
          color: #ef4444;
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
          .video-header {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .video-title {
            font-size: 1.5rem;
          }

          .video-stats {
            gap: 1rem;
          }

          .video-actions {
            flex-direction: column;
          }

          .action-button {
            justify-content: center;
          }

          .video-controls-overlay {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .control-buttons-overlay {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .video-player-section {
            padding: 1rem 0;
          }

          .video-content {
            padding: 1rem 0;
          }

          .video-description,
          .comments-section {
            padding: 1.5rem;
          }

          .stat-item {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <div className="video-detail">
        <div className="container">
          <button 
            onClick={() => navigate('/webtv')}
            className="back-button"
          >
            <ArrowLeft size={20} />
            Retour à la WebTV
          </button>
        </div>

        <section className="video-player-section">
          <div className="container">
            <div className="video-player-container">
              <div className="video-wrapper">
                <video
                  ref={videoRef}
                  className="video-element"
                  poster={video.thumbnailUrl || "/images/poster/poster.jpg"}
                  onEnded={handleVideoEnd}
                  onClick={handlePlayPause}
                >
                  <source src={video.url} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>

                <div className="video-controls-overlay">
                  <div className="video-info-overlay">
                    <div className="video-title-overlay">{video.title}</div>
                    <div className="video-meta-overlay">
                      <span>{formatDuration(video.duration)}</span>
                      <span>{video.views} vues</span>
                    </div>
                  </div>
                  <div className="control-buttons-overlay">
                    <button 
                      className="control-button"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button className="control-button">
                      <Volume2 size={20} />
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
                    <button 
                      className="control-button"
                      onClick={handleFullscreen}
                    >
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="video-content">
          <div className="container">
            <div className="video-header">
              <div className="video-main-info">
                <h1 className="video-title">{video.title}</h1>
                
                <div className="video-stats">
                  <div className="stat-item">
                    <Eye size={16} />
                    {video.views} vues
                  </div>
                  <div className="stat-item">
                    <Calendar size={16} />
                    {formatDate(video.createdAt)}
                  </div>
                  <div className="stat-item">
                    <ThumbsUp size={16} />
                    {video.likesCount} j'aime
                  </div>
                  <div className="stat-item">
                    <MessageCircle size={16} />
                    {video.commentsCount} commentaires
                  </div>
                </div>

                <div className="video-actions">
                  <button 
                    className={`action-button ${isLiked ? 'liked' : 'primary'}`}
                    onClick={handleLike}
                    disabled={loadingLike}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    {isLiked ? 'Je n\'aime plus' : 'J\'aime'}
                  </button>
                  <button className="action-button secondary">
                    <Share2 size={20} />
                    Partager
                  </button>
                </div>
              </div>

              <div className="video-side-info">
                <div className="info-item">
                  <span className="info-label">Catégorie</span>
                  <span className="category-badge">{video.category.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Durée</span>
                  <span className="info-value">{formatDuration(video.duration)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Statut</span>
                  <span className="info-value">
                    {video.premiumRequired ? '🔒 Premium' : '🟢 Public'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Source</span>
                  <span className="info-value">{video.sourceType}</span>
                </div>
              </div>
            </div>

            <div className="video-description">
              <h3 className="description-title">Description</h3>
              <p className="description-text">{video.description}</p>
              
              {video.tags && video.tags.length > 0 && (
                <>
                  <div className="description-title" style={{fontSize: '1rem', marginBottom: '0.75rem'}}>
                    <Tag size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
                    Tags
                  </div>
                  <div className="tags-section">
                    {video.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="comments-section">
              <div className="comments-header">
                <h3 className="comments-title">Commentaires</h3>
                <span className="comments-count">{video.commentsCount}</span>
              </div>

              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="comment-input"
                />
                <button type="submit" className="submit-comment">
                  <Send size={16} />
                  Publier
                </button>
              </form>

              <div className="comments-list">
                {loadingComments ? (
                  <div>Chargement des commentaires...</div>
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-avatar">
                          {comment.user.avatar}
                        </div>
                        <div>
                          <div className="comment-user">{comment.user.name}</div>
                          <div className="comment-date">
                            {formatDate(comment.createdAt)}
                          </div>
                        </div>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      <div className="comment-actions">
                        <button className="comment-like">
                          <ThumbsUp size={14} />
                          {comment.likes}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{textAlign: 'center', color: '#6b7280', padding: '2rem'}}>
                    Aucun commentaire pour le moment. Soyez le premier à commenter !
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VideoDetail;