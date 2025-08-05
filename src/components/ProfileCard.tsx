import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Play } from 'lucide-react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';

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
    <div className='bg-[#120a1c]'>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        fontWeight={"bold"}
        sx={{ mb: 2, color: 'white', paddingTop: '20px' }}
      >
        Liste des participants
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
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
        }}
      >
        {participants.map((profile) => (
          <Card
            key={profile.id}
            sx={{
              backgroundColor: '#3d033a',
              border: 'none',
              color: 'white',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 300, // Réduction de la hauteur
              height: '100%',
            }}
          >
            <Box>
              <div className="relative z-10 flex flex-col items-center justify-between h-full p-4 text-white">
                {/* Décor */}
                <div
                  className="w-64 h-32 mb-[-4rem] mt-[-2rem] z-0"
                  style={{
                    backgroundImage: "url('/img/bg1.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>

                {profile.rang && (
                  <div className="absolute top-4 right-4 bg-[#ff0100] text-white w-8 h-8 rounded flex items-center justify-center font-bold text-sm z-10">
                    {profile.rang}
                  </div>
                )}

                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white/20 shadow-xl relative z-10">
                  <img
                    src={`http://localhost:9002/${profile.url_photo_identite}`}
                    alt={`${profile.nom_correct}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center mb-3" style={{ minHeight: '100px', backgroundColor: '#120a1c' }}>
                <div className="text-center px-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-xl">🇨🇮</span>
                      <h2 className="text-xl font-bold">{profile.nom_correct}</h2>
                    </div>
                    <p className="text-sm text-white/90">{profile.prenoms_correct}</p>
                  </div>
                  <div
                    className="flex items-center justify-center gap-1 text-white/80 mt-auto"
                    style={{ paddingTop: 12 }}
                  >
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-3 bg-white/60 rounded-full"
                        ></div>
                      ))}
                    </div>
                    <span className="ml-2 font-semibold text-sm">{profile.nbre_vote} pts</span>
                  </div>
                </div>

                <div className="space-y-2 w-full">
                  <Button
                    fullWidth
                    className="font-semibold py-2 rounded-full shadow-lg"
                    sx={{
                      backgroundColor: '#f9c254',
                      color: 'black',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#f6ddab' },
                    }}
                    startIcon={<Play className="w-4 h-4" />}
                    style={{ fontSize: '10px' }}
                    onClick={() => handleOpenVideo(`http://localhost:9002/${profile.url_video}`)}
                  >
                    Voir la vidéo
                  </Button>

                  <Link to="/VotingComponent" style={{ textDecoration: 'none'}}   state={{ perso: profile }}> 
                    <Button
                      fullWidth
                      className="py-2 rounded-full shadow-lg"
                      sx={{ backgroundColor: '#ff0100', fontWeight: 'bold', color: 'white', marginTop: '10px', '&:hover': { backgroundColor: '#e63946' } }}
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
