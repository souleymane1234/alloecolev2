import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Play } from 'lucide-react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const profileCards = [
  {
    id: 1,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  {
    id: 2,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  {
    id: 3,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  {
    id: 4,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  {
    id: 5,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  {
    id: 6,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  {
    id: 7,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  {
    id: 8,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  {
    id: 9,
    name: "Konate",
    username: "souleymane",
    points: 660,
    profileImage: "/img/claudia.jpg",
    flag: "🇨🇮",
    rank: 2
  },
  // tu peux ajouter d'autres profils ici
];

function ProfileCardGrid() {
  return (
    <div className='bg-[#120a1c]'>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        fontWeight={"bold"}
        sx={{  mb: 2, color: 'white', paddingTop: '20px' }}
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
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 3,
  }}
>
  {profileCards.map((profile) => (
    <Card
      key={profile.id}
      sx={{
        backgroundColor: '#3d033a',
        border: 'none',
        color: 'white',
        position: 'relative',
      }}
    >
      <CardActionArea>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-white">
          {/* Decorative background above profile image */}
          <div
            className="w-64 h-32  mb-[-4rem] mt-[-2rem] z-0"
            style={{
              backgroundImage: "url('/img/bg1.jpg')", // 👉 remplace par ton image réelle
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
                  {/* Rank badge */}
        {profile.rank && (
          <div className="absolute top-4 right-4 bg-[#ff0100] text-white w-8 h-8 rounded flex items-center justify-center font-bold text-sm z-10">
            {profile.rank}
          </div>
        )}

        {/* Background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/30 rounded-full"></div>
          <div className="absolute top-16 right-12 w-8 h-8 border border-white/20 rounded"></div>
          <div className="absolute bottom-32 left-12 w-12 h-12 border border-white/20 rounded-full"></div>
        </div>

          {/* Profile image */}
          <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white/20 shadow-xl relative z-10">
            <img
              src={profile.profileImage}
              alt={`${profile.name} profile`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">{profile.flag}</span>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
            </div>
            <p className="text-lg text-white/90 mb-3">{profile.username}</p>
            <div className="flex items-center justify-center gap-1 text-white/80">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-4 bg-white/60 rounded-full"
                  ></div>
                ))}
              </div>
              <span className="ml-2 font-semibold">
                {profile.points} pts
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 w-full">
            <Button
              fullWidth 
              className="font-semibold py-3 rounded-full shadow-lg"
              sx={{ backgroundColor: '#f9c254', color: 'black', fontWeight: 'bold', marginBottom: '10px', '&:hover': { backgroundColor: '#f6ddab' } }}
              startIcon={<Play className="w-4 h-4" />}
              style={{ fontSize: '10px' }}
            >
              Voir la vidéo
            </Button>

            <Link to="/voter" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                className="py-3 rounded-full shadow-lg"
                sx={{ backgroundColor: '#ff0100', fontWeight: 'bold', color: 'white', '&:hover': { backgroundColor: '#e63946' } }}
              >
                Je vote
              </Button>
            </Link>
          </div>
        </div>
      </CardActionArea>
    </Card>
  ))}
</Box>

    </div>
  );
}

export default ProfileCardGrid;
