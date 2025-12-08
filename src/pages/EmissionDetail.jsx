import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CalendarDays } from 'lucide-react';
import './EmissionDetail.css';

const apiUrl = import.meta.env.VITE_API_URL;
const apiImageUrl = import.meta.env.VITE_API_URL_IMAGE;

const buildMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${apiImageUrl}/${url}`;
};

const EmissionBanner = () => {
  const { code_emission } = useParams();
  const location = useLocation();
  const showFromState = location.state?.show;
  
  const defaultEmission = {
    titre_emission: showFromState?.title || 'GOSPEL TALENT',
    description_emission:
      showFromState?.description ||
      '« GOSPEL TALENT » met en avant les talents gospel émergents avec des prestations live et des mentors reconnus.',
    url_video_emission: showFromState?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
    url_photo_emission:
      showFromState?.poster ||
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
  };
  
  const [emissionsInfo, setEmissionsInfo] = useState(defaultEmission);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${apiUrl}/emissions/${code_emission}`)
      .then((response) => {
        if (!mounted) return;
        const emission = response.data.emission || defaultEmission;
        setEmissionsInfo(emission);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des émissions :', error);
        setEmissionsInfo(defaultEmission);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [code_emission]);

  if (loading) {
    return (
      <div className="school-detail-loading">
        <div className="loading-spinner">
          <div className="spinner-container">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="loading-text">Chargement...</div>
        </div>
      </div>
    );
  }

  const truncateText = (text, maxLength = 100) =>
    text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <Box
      width="100%"
      display="flex"
      justifyContent="center"
      padding={2}
      sx={{
        backgroundImage: 'url(/img/bg1.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 3 }}
        justifyContent="center"
        alignItems="center"
        width="100%"
        sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
          <div className="w-full aspect-video">
            <video
              className="w-full h-64 object-cover"
              src={buildMediaUrl(emissionsInfo?.url_video_emission)}
              poster={buildMediaUrl(emissionsInfo?.url_photo_emission)}
              controls
            ></video>
          </div>
        </Box>

        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
          <div className="mt-10">
            <h1 className="emission-banner-title">
              {emissionsInfo?.titre_emission}
            </h1>
            <p className="emission-banner-description">
              {emissionsInfo?.description_emission
                ? truncateText(emissionsInfo.description_emission, 80)
                : ''}
            </p>
          </div>
        </Box>

        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
          <div
            className="max-w-sm rounded-xl shadow-lg overflow-hidden bg-white"
            style={{ height: '200px' }}
          >
            <img
              src="/img/zik.jpg"
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </Box>
      </Stack>
    </Box>
  );
};

const CompetCard = () => {
  const { code_emission } = useParams();
  const location = useLocation();
  const showFromState = location.state?.show;
  const sharedVideo = showFromState?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
  const sharedPoster =
    showFromState?.poster ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80';

  const defaultCompetitions = [
    {
      id: 'comp-1',
      code_competition: 'COMP-2025-01',
      titre_competition: 'Édition 2025 - Live Gospel',
      description_competition:
        'Une édition phare avec des prestations live et un jury de professionnels du gospel.',
      url_video_competition: sharedVideo,
      url_photo_competition: sharedPoster,
      debut_inscription_competition: '2025-02-02',
      fin_inscription_competition: '2025-07-10',
    },
    {
      id: 'comp-2',
      code_competition: 'COMP-2024-02',
      titre_competition: 'Édition 2024 - Spécial Découvertes',
      description_competition:
        'Des talents révélés lors des auditions nationales avec accompagnement scénique.',
      url_video_competition: sharedVideo,
      url_photo_competition: sharedPoster,
      debut_inscription_competition: '2024-04-01',
      fin_inscription_competition: '2024-08-20',
    },
    {
      id: 'comp-3',
      code_competition: 'COMP-2023-03',
      titre_competition: 'Édition 2023 - Talents émergents',
      description_competition:
        'Focus sur les jeunes artistes et les choeurs universitaires.',
      url_video_competition: sharedVideo,
      url_photo_competition: sharedPoster,
      debut_inscription_competition: '2023-05-01',
      fin_inscription_competition: '2023-08-08',
    },
  ];
  
  const [emissionsDetails, setEmissionsDetails] = useState(defaultCompetitions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${apiUrl}/emissions/${code_emission}`)
      .then((response) => {
        if (!mounted) return;
        const comps = response.data.competitions || defaultCompetitions;
        setEmissionsDetails(comps);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des émissions :', error);
        setEmissionsDetails(defaultCompetitions);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [code_emission]);

  if (loading) {
    return (
      <div className="school-detail-loading">
        <div className="loading-spinner">
          <div className="spinner-container">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="loading-text">Chargement...</div>
        </div>
      </div>
    );
  }

  const truncateText = (text, maxLength = 100) =>
    text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;

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
        Nos compétitions en cours
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
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
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
              className={isCurrent ? 'current-edition-card' : ''}
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
                  className="current-edition-badge"
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
                  className="expired-edition-badge"
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
                <div
                  className="competition-card"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div className="relative">
                    <video
                      className="w-full h-36 object-cover"
                      src={buildMediaUrl(card.url_video_competition)}
                      poster={buildMediaUrl(card.url_photo_competition)}
                      controls
                    ></video>
                  </div>

                  <div 
                    className="competition-title"
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

                    <button 
                      className="interest-button-detail"
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
                    >
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
          );
        })}
      </Box>
    </>
  );
};

const EmissionDetail = () => (
  <div className="emission-detail-page">
    <EmissionBanner />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <CompetCard />
    </div>
  </div>
);

export default EmissionDetail;

