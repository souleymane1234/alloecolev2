import { useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import Stack from '@mui/material/Stack';
const apiUrl = (import.meta as any).env?.VITE_API_URL;
const apiImageUrl = (import.meta as any).env?.VITE_API_URL_IMAGE;



interface Emission {
  url_video_emission: string;
  url_photo_emission: string;
  titre_emission: string;
  description_emission: string;
}

const EmissionBanner: React.FC = () => {
    const { code_emission } = useParams();
    const location = useLocation();
    const showFromState = location.state?.show;
    
    const defaultEmission: Emission = {
      titre_emission: showFromState?.title || 'Battle of Talents',
      description_emission: showFromState?.description || 'Une compétition musicale intense où les talents s\'affrontent pour décrocher le titre ultime.',
      url_video_emission: showFromState?.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
      url_photo_emission: showFromState?.poster || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
    };
    
    const [emissionsInfo, setEmissionsInfo] = useState<Emission | null>(defaultEmission);
    const [loading, setLoading] = useState(false);

        useEffect(() => {
          // Essayer de récupérer depuis l'API, sinon utiliser les données par défaut
          if (code_emission && apiUrl) {
            setLoading(true);
            axios.get(`${apiUrl}/emissions/${code_emission}`)
              .then((response) => {
                setEmissionsInfo(response.data.emission || defaultEmission);
                console.log('Emission Info:', response.data.emission);
                setLoading(false);
              })
              .catch((error) => {
                console.error('Erreur lors de la récupération des émissions :', error);
                setEmissionsInfo(defaultEmission);
                setLoading(false);
              });
          } else {
            setEmissionsInfo(defaultEmission);
          }
        }, [code_emission]);
    
        if (loading) return <p>Chargement...</p>;

        function truncateText(text: string, maxLength: number = 100): string {
          return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
        }
  return (
    <>
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
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}

      >
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
        <div className="w-full  aspect-video">
        <video
              className="w-full h-64 object-cover"
              src={emissionsInfo?.url_video_emission?.startsWith('http') ? emissionsInfo.url_video_emission : `${apiImageUrl}/${emissionsInfo?.url_video_emission}`}
              poster={emissionsInfo?.url_photo_emission?.startsWith('http') ? emissionsInfo.url_photo_emission : `${apiImageUrl}/${emissionsInfo?.url_photo_emission}`}
              controls
            ></video>
      </div>
        </Box>
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
        <div className="mt-10">
            <h1 className="text-white font-semibold font-[Formula_Condensed] mb-8">{emissionsInfo?.titre_emission}</h1>
            <p className="...">
                {emissionsInfo?.description_emission
                  ? truncateText(emissionsInfo.description_emission, 80)
                  : ''}
              </p>
    </div>       
        </Box>
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}> 
        <div className="max-w-sm rounded-xl shadow-lg overflow-hidden bg-white" style={{ height: '200px' }}>
            <img src="/img/zik.jpg" alt=""  />
         </div>
      </Box>
      </Stack>
    </Box>
    </>
  );
};

export default EmissionBanner;