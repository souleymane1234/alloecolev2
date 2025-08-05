import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const EmissionBanner = () => {
    const { code_emission } = useParams();
    const [selectedCard, setSelectedCard] = useState(0);
    const [emissionsInfo, setEmissionsInfo] = useState([]);
    const [loading, setLoading] = useState(true);

        useEffect(() => {
          axios.get(`http://localhost:9002/api/emissions/${code_emission}`)
            .then((response) => {
              setEmissionsInfo(response.data.emission);
              console.log('Emission Info:', response.data.emission); // Log emission info
              setLoading(false);
            })
            .catch((error) => {
              console.error('Erreur lors de la récupération des émissions :', error);
              setLoading(false);
            });
        }, [code_emission]);
    
        if (loading) return <p>Chargement...</p>;

        function truncateText(text, maxLength = 100) {
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
        backgroundColor="rgba(0, 0, 0, 0.5)"

      >
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
        <div className="w-full  aspect-video">
        <video
              className="w-full h-64object-cover"
              src={`http://localhost:9002/${emissionsInfo.url_video_emission}`}
              poster={`http://localhost:9002/${emissionsInfo.url_photo_emission}`}
              controls
            ></video>
      </div>
        </Box>
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
        <div className="mt-10">
            <h1 className="text-white font-semibold font-[Formula_Condensed] mb-8">{emissionsInfo.titre_emission}</h1>
            <p className="text-white text-[22px] font-semibold font-[Formula_Condensed] mb-8">{truncateText(emissionsInfo.description_emission, 80)}</p>
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