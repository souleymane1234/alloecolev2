import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CalendarDays } from "lucide-react";
import { Link } from 'react-router-dom';

const CompetCardCours: React.FC = () => {
  const { code_emission } = useParams();
  interface Competition {
    id: string;
    url_video_competition: string;
    url_photo_competition: string;
    titre_competition: string;
    description_competition: string;
    debut_inscription_competition: string;
    fin_inscription_competition: string;
    code_competition: string;
  }
  
  const [emissionsDetails, setEmissionsDetails] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  // console.log('user.........', emissionsDetails);



    useEffect(() => {
      axios.get(`http://localhost:9002/api/competitions/ziktalent`)
        .then((response) => {
          const allCompetitions = response.data.competitions || [];
          const limitedCompetitions = allCompetitions.slice(0, 4);
          setEmissionsDetails(limitedCompetitions);
          console.log('emissionsDetails', limitedCompetitions);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des émissions :', error);
          setLoading(false);
        });
    }, [code_emission]);

    if (loading) return <p>Nos compétitions sont en cours de chargement...</p>;
    // console.log('emissionsss', emissionsDetails);

    function truncateText(text: string, maxLength: number = 100): string {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

  return (
<>
  <Typography variant="h4" align="center" gutterBottom fontWeight={"bold"} sx={{ mt: 4, mb: 2 }}>
    Nos compétitions en cours
  </Typography>

  <Box
  sx={{
    backgroundColor: '#f2f2f2',
    width: '100%',
    maxWidth: '1200px',
    mx: 'auto',
    my: 4,
    p: 2,
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',     // mobile : 1 carte par ligne
      sm: 'repeat(2, 1fr)', // écran ≥600px : 2 cartes
      md: 'repeat(4, 1fr)', // écran ≥900px : 4 cartes
    },
    gap: 3,
  }}
>
  {emissionsDetails.map((card) => (
    <Card key={card.id}>
      <Box sx={{ height: '100%' }}>
        <div className="w-full rounded-xl shadow-lg overflow-hidden bg-white">
          <div className="relative">
            <video
              className="w-full h-36 object-cover" // Hauteur réduite
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

          <div className="bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white text-center py-1 font-semibold text-lg">
            {card.titre_competition}
          </div>

          <div className="px-2 py-2 text-center">
            <p className="h-16 line-clamp-3 text-sm leading-snug">
              {truncateText(card.description_competition, 80)}
            </p>

            <div className="flex justify-around items-center text-xs text-gray-600 my-1">
              <div className="flex flex-col items-center">
                <CalendarDays size={16} />
                <span>Début</span>
                <span className="font-semibold text-black">
                  {dayjs(card.debut_inscription_competition).format('DD/MM/YYYY')}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <CalendarDays size={16} />
                <span>Fin</span>
                <span className="font-semibold text-black">
                  {dayjs(card.fin_inscription_competition).format('DD/MM/YYYY')}
                </span>
              </div>
            </div>

            {/* <div className="flex justify-center my-1">
              {card.participants?.slice(0, 4).map((participant, idx) => (
                <img
                  key={idx}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  src={`http://localhost:9002/${participant.photo_participant}`}
                  alt={participant.nom_participant}
                />
              ))}
            </div>

            <p className="text-gray-500 italic text-xs">
              {card.participants?.length || 0} Candidat{card.participants?.length > 1 ? 's' : ''} inscrit{card.participants?.length > 1 ? 's' : ''}
            </p> */}

            <button className="mt-2 w-full bg-gradient-to-r from-fuchsia-700 to-purple-700 hover:bg-purple-900 text-white font-medium text-sm py-1.5 px-3 rounded-lg transition duration-300">
              <Link
                to={`/competitions/${card.code_competition}/detail`}
                style={{ color: 'white', textDecoration: 'none' }}
              >
                Ça m'intéresse
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

export default CompetCardCours;
