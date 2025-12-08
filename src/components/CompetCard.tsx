import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CalendarDays } from "lucide-react";
const apiUrl = (import.meta as any).env?.VITE_API_URL;
const apiImageUrl = (import.meta as any).env?.VITE_API_URL_IMAGE;

const CompetCard: React.FC = () => {
  const { code_emission } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const showFromState = location.state?.show;
  const sharedVideo = showFromState?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
  const sharedPoster = showFromState?.poster || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80';
  
  interface EmissionDetail {
    id: string;
    url_video_competition: string;
    url_photo_competition: string;
    titre_competition: string;
    description_competition: string;
    debut_inscription_competition: string;
    fin_inscription_competition: string;
    code_competition: string;
  }
  
  const defaultCompetitions: EmissionDetail[] = [
    {
      id: 'comp-1',
      code_competition: 'COMP-2025-01',
      titre_competition: 'Édition 2025 - Live Gospel',
      description_competition: 'Une édition phare avec des prestations live et un jury de professionnels du gospel.',
      url_video_competition: sharedVideo,
      url_photo_competition: sharedPoster,
      debut_inscription_competition: '2025-02-02',
      fin_inscription_competition: '2025-07-10',
    },
    {
      id: 'comp-2',
      code_competition: 'COMP-2024-02',
      titre_competition: 'Édition 2024 - Spécial Découvertes',
      description_competition: 'Des talents révélés lors des auditions nationales avec accompagnement scénique.',
      url_video_competition: sharedVideo,
      url_photo_competition: sharedPoster,
      debut_inscription_competition: '2024-04-01',
      fin_inscription_competition: '2024-08-20',
    },
    {
      id: 'comp-3',
      code_competition: 'COMP-2023-03',
      titre_competition: 'Édition 2023 - Talents émergents',
      description_competition: 'Focus sur les jeunes artistes et les choeurs universitaires.',
      url_video_competition: sharedVideo,
      url_photo_competition: sharedPoster,
      debut_inscription_competition: '2023-05-01',
      fin_inscription_competition: '2023-08-08',
    },
  ];
  
  const [emissionsDetails, setEmissionsDetails] = useState<EmissionDetail[]>(defaultCompetitions);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      // Essayer de récupérer depuis l'API, sinon utiliser les données par défaut
      if (code_emission && apiUrl) {
        setLoading(true);
        axios.get(`${apiUrl}/emissions/${code_emission}`)
          .then((response) => {
            const competitions = response.data.competitions || defaultCompetitions;
            console.log('Competitions data:', competitions);
            setEmissionsDetails(competitions);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des émissions :', error);
            setEmissionsDetails(defaultCompetitions);
            setLoading(false);
          });
      } else {
        setEmissionsDetails(defaultCompetitions);
      }
    }, [code_emission]);

    if (loading) return <p>Chargement...</p>;


    function truncateText(text: string, maxLength = 100) {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    // Identifier l'édition actuelle (celle en cours ou la première)
    const now = dayjs();
    const currentEdition = emissionsDetails.find((card) => {
      const debut = dayjs(card.debut_inscription_competition);
      const fin = dayjs(card.fin_inscription_competition);
      return now.isAfter(debut) && now.isBefore(fin);
    }) || emissionsDetails[0];

  return (
<>
  <Typography 
    variant="h4" 
    align="center" 
    gutterBottom 
    fontWeight="bold" 
    sx={{ 
      mt: 4, 
      mb: 2,
      color: '#f05623',
      fontSize: '36px',
      textTransform: 'uppercase',
      letterSpacing: '2px'
    }}
  >
    Toutes nos Éditions
  </Typography>

  <Box
  sx={{
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '1400px',
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
  {emissionsDetails.map((card) => {
    const isCurrent = card.id === currentEdition?.id;
    const finDate = dayjs(card.fin_inscription_competition);
    const isExpired = now.isAfter(finDate);
    
    return (
    <Card 
      key={card.id}
      sx={{
        border: isCurrent ? 'none' : '1px solid rgba(240, 86, 35, 0.1)',
        boxShadow: isCurrent 
          ? '0 8px 32px rgba(240, 86, 35, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.4s ease',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(240, 86, 35, 0.25)',
        }
      }}
    >
      {isCurrent && (
        <div 
          style={{
            position: 'absolute',
            top: '-12px',
            right: '16px',
            background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
            color: '#ffffff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 16px rgba(240, 86, 35, 0.4)',
            zIndex: 10,
            animation: 'badgeFloat 3s ease-in-out infinite'
          }}
        >
          ⭐ En cours
        </div>
      )}
      {isExpired && !isCurrent && (
        <div 
          style={{
            position: 'absolute',
            top: '-12px',
            right: '16px',
            background: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)',
            color: '#ffffff',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 4px 16px rgba(107, 114, 128, 0.4)',
            zIndex: 10
          }}
        >
          Expiré
        </div>
      )}
      <Box sx={{ height: '100%' }}>
        <div className="w-full rounded-xl shadow-lg overflow-hidden bg-white">
          <div className="relative">
            <video
              className="w-full h-36 object-cover" // Hauteur réduite
              src={card.url_video_competition?.startsWith('http') ? card.url_video_competition : `${apiImageUrl}/${card.url_video_competition}`}
              poster={card.url_photo_competition?.startsWith('http') ? card.url_photo_competition : `${apiImageUrl}/${card.url_photo_competition}`}
              controls
            ></video>
          </div>

          <div 
            style={{
              background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
              color: '#ffffff',
              textAlign: 'center',
              padding: '12px 8px',
              fontWeight: '800',
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {card.titre_competition}
          </div>

          <div 
            className="px-2 py-2 text-center" 
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              backgroundColor: isCurrent ? '#ffffff' : 'transparent'
            }}
          >
            <p 
              className="h-16 line-clamp-3 text-sm leading-snug"
              style={{ color: '#666', marginBottom: '12px' }}
            >
              {truncateText(card.description_competition, 80)}
            </p>

            <div 
              className="flex justify-around items-center text-xs my-1"
              style={{ 
                padding: '12px',
                background: 'rgba(240, 86, 35, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(240, 86, 35, 0.15)',
                marginBottom: '12px'
              }}
            >
              <div className="flex flex-col items-center" style={{ color: '#666' }}>
                <CalendarDays size={16} style={{ color: '#f05623', marginBottom: '4px' }} />
                <span>Début</span>
                <span className="font-semibold" style={{ color: '#f05623' }}>
                  {dayjs(card.debut_inscription_competition).format('DD/MM/YYYY')}
                </span>
              </div>
              <div className="flex flex-col items-center" style={{ color: '#666' }}>
                <CalendarDays size={16} style={{ color: '#f05623', marginBottom: '4px' }} />
                <span>Fin</span>
                <span className="font-semibold" style={{ color: '#f05623' }}>
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

            {card.code_competition ? (
              <Link
                to={`/competitions/${card.code_competition}/detail`}
                style={{ textDecoration: 'none', display: 'block', marginTop: '8px' }}
                onClick={(e) => {
                  console.log('Link clicked! Navigating to:', `/competitions/${card.code_competition}/detail`);
                  console.log('Card data:', card);
                }}
              >
                <button 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 4px 16px rgba(240, 86, 35, 0.3)',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(240, 86, 35, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ea580c 0%, #f05623 50%, #f78c45 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(240, 86, 35, 0.3)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%)';
                  }}
                >
                  Ça m'intéresse
                </button>
              </Link>
            ) : (
              <button 
                className="mt-2 w-full bg-gray-400 text-white font-medium text-sm py-1.5 px-3 rounded-lg cursor-not-allowed"
                disabled
                onClick={() => {
                  console.error('code_competition is missing for card:', card);
                  alert('Erreur: code_competition manquant');
                }}
              >
                Ça m'intéresse (code manquant)
              </button>
            )}
          </div>
        </div>
      </Box>
    </Card>
    );
  })}
</Box>
</>

  );
}

export default CompetCard;
