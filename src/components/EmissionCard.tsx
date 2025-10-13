import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
const apiUrl = import.meta.env.VITE_API_URL;
const apiImageUrl = import.meta.env.VITE_API_URL_IMAGE;

interface Props {
  titleComponent: string;
  titleButton: string;
}

const EmissionCard: React.FC<Props> = ({ titleComponent, titleButton }) => {
  interface Emission {
    code_emission: string;
    url_video_emission: string;
    url_photo_emission: string;
    titre_emission: string;
    description_emission: string;
  }
  
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${apiUrl}/emission`)
      .then((response) => {
        const allCompetitions = response.data.emissions || [];
        const limitedCompetitions = allCompetitions.slice(0, 4);
        setEmissions(limitedCompetitions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des émissions :', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-4">Nos compétitions sont en cours de chargement...</p>;

  return (
    <>
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        sx={{ mt: 4, mb: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        {titleComponent}
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#f9f9f9',
          mx: 'auto',
          my: 4,
          p: 2,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',        // mobile
            sm: 'repeat(2, 1fr)', // tablette
            md: 'repeat(4, 1fr)'  // desktop
          },
          gap: 2,
        }}
      >
        {emissions.map((card) => (
          <Card key={card.code_emission} sx={{ height: '100%' }}>
            <Box sx={{ height: '100%' }}>
              <div className="rounded-xl shadow-md overflow-hidden bg-white h-full">
                <div className="relative">
                  <video
                    className="w-full h-32 sm:h-36 md:h-40 object-cover"
                    src={`${apiImageUrl}/${card.url_video_emission}`}
                    poster={`${apiImageUrl}/${card.url_photo_emission}`}
                    controls
                  ></video>
                  <div className="absolute top-0 right-0">
                    <span className="bg-gradient-to-b from-yellow-400 to-orange-500 text-black font-bold px-2 py-1 text-xs sm:text-sm rounded-t-lg rounded-bl-lg shadow">
                      Emission
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white text-center py-1 font-semibold text-base sm:text-lg">
                  {card.titre_emission}
                </div>

                <div className="px-2 py-2 text-center">
                  <p className="line-clamp-3 text-sm leading-snug h-20 sm:h-24">
                    {card.description_emission}
                  </p>

                  <button className="mt-2 w-full bg-gradient-to-r from-fuchsia-700 to-purple-700 hover:bg-purple-900 text-white font-medium text-sm py-1.5 px-3 rounded-lg transition duration-300">
                    <Link
                      to={`/emissions/detail/${card.code_emission}`}
                      style={{ color: 'white', textDecoration: 'none' }}
                    >
                      {titleButton}
                    </Link>
                  </button>
                </div>
              </div>
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
}

export default EmissionCard;
