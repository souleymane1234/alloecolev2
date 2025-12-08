import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Play } from 'lucide-react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
const apiImageUrl = (import.meta as any).env?.VITE_API_URL_IMAGE;

interface Participant {
  id: number;
  nom_correct: string;
  prenoms_correct: string;
  nbre_vote: number;
  url_photo_identite: string;
  url_video: string;
  pays?: string;
  rang?: number;
}

type Props = {
  participants: Participant[];
};

function ProfileCard({ participants }: Props) {
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

  const handleOpenVideo = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div style={{ 
      background: '#ffffff',
      minHeight: '100vh',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 
          'radial-gradient(circle at 20% 30%, rgba(240, 86, 35, 0.08) 0%, transparent 40%),' +
          'radial-gradient(circle at 80% 70%, rgba(249, 160, 95, 0.08) 0%, transparent 40%),' +
          'radial-gradient(circle at 50% 50%, rgba(255, 177, 153, 0.06) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}></div>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        fontWeight="bold"
        sx={{ 
          mb: 2, 
          color: '#333', 
          paddingTop: '40px',
          fontSize: '36px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Liste des participants
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '1400px',
          mx: 'auto',
          my: 4,
          p: 2,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',           // mobile : 1 carte
            sm: 'repeat(4, 1fr)',// ≥600px : 2 cartes
            md: 'repeat(4, 1fr)',// ≥900px : 3 cartes
            lg: 'repeat(6, 1fr)',// ≥1200px : 4 cartes
            xl: 'repeat(8, 1fr)' // ≥1536px : 6 cartes
          },
          gap: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {participants.map((profile) => (
          <Card
            key={profile.id}
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(240, 86, 35, 0.1)',
              color: '#333',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 300,
              height: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.4s ease',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Box>
              <div className="relative z-10 flex flex-col items-center justify-between h-full p-4">
                {profile.rang && (
                  <div 
                    className="absolute top-4 right-4 text-white w-8 h-8 rounded flex items-center justify-center font-bold text-sm z-10"
                    style={{
                      background: '#666',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {profile.rang}
                  </div>
                )}

                <div 
                  className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-xl relative z-10"
                  style={{
                    border: '4px solid #e0e0e0',
                  }}
                >
                  <img
                    src={profile.url_photo_identite?.startsWith('http') ? profile.url_photo_identite : `${apiImageUrl}/${profile.url_photo_identite}`}
                    alt={`${profile.nom_correct}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center mb-3" style={{ minHeight: '100px', width: '100%' }}>
                <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-xl">🇨🇮</span>
                      <h2 className="text-xl font-bold" style={{ color: '#333' }}>{profile.nom_correct}</h2>
                    </div>
                    <p className="text-sm" style={{ color: '#666' }}>{profile.prenoms_correct}</p>
                  </div>
                  <div
                    className="flex items-center justify-center gap-1 mt-auto"
                    style={{ paddingTop: 12, color: '#666' }}
                  >
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-3 rounded-full"
                          style={{ backgroundColor: '#d0d0d0' }}
                        ></div>
                      ))}
                    </div>
                    <span className="ml-2 font-semibold text-sm" style={{ color: '#666' }}>{profile.nbre_vote} pts</span>
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <Button
                    fullWidth
                    className="font-semibold py-2 rounded-full shadow-lg"
                    sx={{
                      background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 16px rgba(240, 86, 35, 0.3)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #ea580c 0%, #f05623 50%, #f78c45 100%)',
                        boxShadow: '0 6px 20px rgba(240, 86, 35, 0.4)',
                      },
                    }}
                    startIcon={<Play className="w-4 h-4" />}
                    style={{ fontSize: '12px' }}
                    onClick={() => handleOpenVideo(profile.url_video?.startsWith('http') ? profile.url_video : `${apiImageUrl}/${profile.url_video}`)}
                  >
                    Voir la vidéo
                  </Button>

                  <Link to="/VotingComponent" style={{ textDecoration: 'none'}}   state={{ perso: profile }}> 
                    <Button
                      fullWidth
                      className="py-2 rounded-full shadow-lg"
                      sx={{ 
                        background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)', 
                        fontWeight: 'bold', 
                        color: 'white', 
                        marginTop: '10px',
                        boxShadow: '0 4px 16px rgba(240, 86, 35, 0.3)',
                        '&:hover': { 
                          background: 'linear-gradient(135deg, #ea580c 0%, #f05623 50%, #f78c45 100%)',
                          boxShadow: '0 6px 20px rgba(240, 86, 35, 0.4)',
                        }
                      }}
                    >
                      Je vote
                    </Button>
                  </Link>
                </div>
              </div>
            </Box>
          </Card>
        ))}
      </Box>

      <Dialog open={!!selectedVideo} onClose={handleCloseVideo} maxWidth="md" fullWidth>
        <Box sx={{ p: 2 }}>
          {selectedVideo && (
            <video
              controls
              autoPlay
              muted
              width="100%"
              style={{ borderRadius: '10px', background: 'black' }}
            >
              <source src={selectedVideo} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          )}
        </Box>
      </Dialog>
    </div>
  );
}

export default ProfileCard;
