import React from 'react';
import Box from '@mui/material/Box';
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
          className="w-full h-64 object-cover"
          src="/video/video.mp4"
          poster='/img/zik.jpg'
          controls
        ></video>
      </div>
        </Box>
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
        <div className="mt-10">
            <h1 className="text-white font-semibold font-[Formula_Condensed] mb-8">Titre</h1>
            <p className="text-white text-[22px] font-semibold font-[Formula_Condensed] mb-8">description</p>
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