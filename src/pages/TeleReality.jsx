import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayArrow,
  Visibility,
  Tv
} from '@mui/icons-material';
import './TeleReality.css';

const TeleReality = () => {
  const navigate = useNavigate();

  // Émission en vedette
  const featuredShow = {
    id: 1,
    title: 'Campus Confessions',
    description: 'Des binômes d\'étudiants partagent leur quotidien sans filtre entre examens, colocs insolites et secrets inavouables.',
    episodes: 16,
    views: 12850,
    poster: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
    category: 'TÉLÉRÉALITÉ'
  };

  // Liste de toutes les émissions
  const allShows = [
    {
      id: 1,
      title: 'Battle of Talents',
      description: 'Une compétition musicale intense où les talents s\'affrontent pour décrocher le titre ultime.',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      participants: [
        { id: 1, photo: 'https://i.pravatar.cc/150?img=1' },
        { id: 2, photo: 'https://i.pravatar.cc/150?img=2' },
        { id: 3, photo: 'https://i.pravatar.cc/150?img=3' },
        { id: 4, photo: 'https://i.pravatar.cc/150?img=4' }
      ],
      totalParticipants: 12
    },
    {
      id: 2,
      title: 'Street Challenge',
      description: 'Des défis urbains spectaculaires dans les rues de Paris, mêlant sport extrême et stratégie.',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      participants: [
        { id: 1, photo: 'https://i.pravatar.cc/150?img=5' },
        { id: 2, photo: 'https://i.pravatar.cc/150?img=6' },
        { id: 3, photo: 'https://i.pravatar.cc/150?img=7' }
      ],
      totalParticipants: 8
    },
    {
      id: 3,
      title: 'Love Connection',
      description: 'Trouvez l\'amour dans une aventure romantique unique où chaque choix compte.',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      participants: [
        { id: 1, photo: 'https://i.pravatar.cc/150?img=8' },
        { id: 2, photo: 'https://i.pravatar.cc/150?img=9' },
        { id: 3, photo: 'https://i.pravatar.cc/150?img=10' },
        { id: 4, photo: 'https://i.pravatar.cc/150?img=11' },
        { id: 5, photo: 'https://i.pravatar.cc/150?img=12' }
      ],
      totalParticipants: 20
    },
    {
      id: 4,
      title: 'Aventure Extrême',
      description: 'Survivre dans les conditions les plus difficiles. Seuls les plus forts resteront.',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      participants: [
        { id: 1, photo: 'https://i.pravatar.cc/150?img=13' },
        { id: 2, photo: 'https://i.pravatar.cc/150?img=14' },
        { id: 3, photo: 'https://i.pravatar.cc/150?img=15' }
      ],
      totalParticipants: 10
    },
    {
      id: 5,
      title: 'Chef Academy',
      description: 'Apprenez les secrets de la haute cuisine avec les meilleurs chefs du pays.',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      participants: [
        { id: 1, photo: 'https://i.pravatar.cc/150?img=16' },
        { id: 2, photo: 'https://i.pravatar.cc/150?img=17' },
        { id: 3, photo: 'https://i.pravatar.cc/150?img=18' },
        { id: 4, photo: 'https://i.pravatar.cc/150?img=19' }
      ],
      totalParticipants: 15
    },
    {
      id: 6,
      title: 'Dance Revolution',
      description: 'Les meilleurs danseurs s\'affrontent dans des chorégraphies spectaculaires et innovantes.',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      participants: [
        { id: 1, photo: 'https://i.pravatar.cc/150?img=20' },
        { id: 2, photo: 'https://i.pravatar.cc/150?img=21' },
        { id: 3, photo: 'https://i.pravatar.cc/150?img=22' },
        { id: 4, photo: 'https://i.pravatar.cc/150?img=23' },
        { id: 5, photo: 'https://i.pravatar.cc/150?img=24' }
      ],
      totalParticipants: 18
    }
  ];

  const handlePlayShow = (showId) => {
    navigate(`/emission/${showId}`);
  };

  const handleInterested = (showId, e) => {
    e.stopPropagation();
    navigate(`/emission/${showId}`);
    console.log('Interested in show:', showId);
    // Ajouter ici la logique pour marquer l'intérêt
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return (views / 1000).toFixed(0) + 'k';
    }
    return views;
  };

  return (
    <div className="telerealite-page">
      <div className="telerealite-content">
        {/* Featured Show */}
        <div 
          className="featured-show"
          style={{ backgroundImage: `url(${featuredShow.poster})` }}
        >
          <div className="featured-overlay">
            <div className="featured-info">
              <div className="show-badge">
                <Tv className="badge-icon" />
                <span>{featuredShow.category}</span>
              </div>
              
              <h1 className="featured-title">{featuredShow.title}</h1>
              
              <p className="featured-description">{featuredShow.description}</p>
              
              <div className="featured-stats">
                <div className="stat-item">
                  <PlayArrow className="stat-icon" />
                  <span>{featuredShow.episodes} épisodes</span>
                </div>
                <div className="stat-item">
                  <Visibility className="stat-icon" />
                  <span>{formatViews(featuredShow.views)} vues</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Shows Section */}
        <div className="all-shows-section">
          <h2 className="section-title">Toutes les émissions</h2>
          
          <div className="shows-grid">
            {allShows.map((show) => (
              <div 
                key={show.id} 
                className="show-card"
              >
                <div className="show-video-container">
                  <video 
                    className="show-video"
                    controls
                    preload="metadata"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <source src={show.videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                </div>
                
                <div className="show-content">
                  <h3 className="show-title">{show.title}</h3>
                  <p className="show-description">{show.description}</p>
                  
                  <div className="show-participants">
                    <div className="participants-avatars">
                      {show.participants.slice(0, 4).map((participant, index) => (
                        <img 
                          key={participant.id}
                          src={participant.photo} 
                          alt="Participant"
                          className="participant-avatar"
                          style={{ zIndex: 10 - index }}
                        />
                      ))}
                      {show.totalParticipants > 4 && (
                        <div className="more-participants">
                          +{show.totalParticipants - 4}
                        </div>
                      )}
                    </div>
                    <span className="participants-count">
                      {show.totalParticipants} participant{show.totalParticipants > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <button 
                    className="interest-button"
                    onClick={(e) => handleInterested(show.id, e)}
                  >
                    <span>Ça m'intéresse</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeleReality;