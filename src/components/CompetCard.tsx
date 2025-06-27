import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { CalendarDays } from "lucide-react";
import { Link } from 'react-router-dom';

const competCards = [
  {
    id: 1,
    title: 'GOSPEL TALENT',
    badge: 'Compétition',
    urlVideo: '/video/video.mp4',
    urlPoster: '/img/zik.jpg',
    dateDebut: '2025-02-02',
    dateFin: '2025-07-10',
    description: '« GOSPEL TALENT » est un concept qui permet de détecter, révéler et faire la promotion des talents da...',
  },
  {
    id: 2,
    title: 'IVOIRE ZIK TALENT',
    badge: 'Compétition',
    urlVideo: '/video/video.mp4',
    urlPoster: '/img/zik.jpg',
    dateDebut: '2025-02-02',
    dateFin: '2025-07-10',
    description: '« GOSPEL TALENT » est un concept qui permet de détecter, révéler et faire la promotion des talents da...',
  },
  {
    id: 3,
    title: 'URBAN TALENT',
    badge: 'Compétition',
    urlVideo: '/video/video.mp4',
    urlPoster: '/img/zik.jpg',
    dateDebut: '2025-02-02',
    dateFin: '2025-07-10',
    description: '« GOSPEL TALENT » est un concept qui permet de détecter, révéler et faire la promotion des talents da...',
  },
];

function CompetCard() {
  const { code_emission } = useParams();
  const [selectedCard, setSelectedCard] = useState(0);
  const [emissionsDetails, setEmissionsDetails] = useState([]);
  const [loading, setLoading] = useState(true);



    useEffect(() => {
      axios.get(`http://localhost:9002/api/emissions/${code_emission}`)
        .then((response) => {
          setEmissionsDetails(response.data.competitions);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des émissions :', error);
          setLoading(false);
        });
    }, [code_emission]);

    if (loading) return <p>Chargement...</p>;
    console.log('emissionsss', emissionsDetails);

  return (
<>
  <Typography variant="h4" align="center" gutterBottom fontWeight={"bold"} sx={{ mt: 4, mb: 2 }}>
    Nos compétitions en cours
  </Typography>

  <Box
    sx={{
      width: '100%',
      maxWidth: '1200px', // limite la largeur pour éviter que ce soit trop large
      mx: 'auto',          // centre horizontalement
      my: 4,               // marge verticale
      p: 2,                // padding interne
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 3,              // espace entre les cartes
    }}
  >
    {emissionsDetails.map((card, index) => (
      <Card key={card.id}>
        <CardActionArea
        //   onClick={() => setSelectedCard(index)}
          data-active={selectedCard === index ? '' : undefined}
          sx={{
            height: '100%',
          }}
        >
          <div className="max-w-sm rounded-xl shadow-lg overflow-hidden bg-white">
            <div className="relative">
              <video
                className="w-full h-48 object-cover"
                src={`http://localhost:9002/${card.url_video_competition}`}
                poster={`http://localhost:9002/${card.url_photo_competition}`}
                controls
              ></video>
              <div className="absolute top-0 right-0">
                <span className="bg-gradient-to-b from-yellow-400 to-orange-500 text-black font-bold px-2 py-1 text-sm rounded-t-lg rounded-bl-lg shadow">
                Compétition
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white text-center py-2 font-bold text-xl">
              {card.titre_competition}
            </div>

            <div className="px-2 py-2 text-center">
              <p className='h-42'>{card.description_competition}</p>

              <div className="flex justify-around items-center text-sm text-gray-600">
                <div className="flex flex-col items-center">
                  <CalendarDays size={20} />
                  <span>Début</span>
                  <span className="font-semibold text-black">
                  {dayjs(card.debut_inscription_competition).format('DD/MM/YYYY')}
                </span>
                </div>
                <div className="flex flex-col items-center">
                  <CalendarDays size={20} />
                  <span>Fin</span>
                  <span className="font-semibold text-black">
                  {dayjs(card.fin_inscription_competition).format('DD/MM/YYYY')}
                </span>
                </div>
              </div>

              <div className="flex justify-center">
                <img
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Candidat 1"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Candidat 2"
                />
              </div>
              <p className="text-gray-500 italic text-sm">2 Candidats inscrits</p>

              <button className="mt-4 w-full bg-gradient-to-r from-fuchsia-700 to-purple-700 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
              <Link to={`/competitions/detail`} style={{ color: 'white', textDecoration: 'none' }}>
                Ça m'intéresse
              </Link>
              </button>
            </div>
          </div>
        </CardActionArea>
      </Card>
    ))}
  </Box>
</>

  );
}

export default CompetCard;
