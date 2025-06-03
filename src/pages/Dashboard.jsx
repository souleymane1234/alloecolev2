import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CompetCard from '../components/CompetCard';
import EmissionCard from '../components/EmissionCard';

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

const Dashboard = () => {
  return (
    <>
    <Box width="100%" display="flex" justifyContent="center" backgroundColor="#f0f0f0" padding={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 3 }}
        justifyContent="center"
        alignItems="center"
        width="100%"
        backgroundColor="#000"
      >
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
        <div className="w-full max-w-3xl aspect-video">
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/KC9nJpI2TLk"
          title="Vidéo YouTube"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
        </Box>
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}>
        <div className="mt-10">
      <span className="text-white text-[22px] font-semibold font-[Formula_Condensed]">
        Zik'Talent, la plateforme
      </span>

      <div className="mt-[-30px] font-[Formula_Condensed]">
        <span className="text-white text-[38px] font-bold mt-[-10px]">
          digitale qui révèle les
        </span>
      </div>

      <div className="mt-[-52px] font-[Formula_Condensed]">
        <span
          className="text-[90px] font-extrabold ml-[-6] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.17)]"
          style={{
            WebkitTextStroke: '2px #f5bf53',
            textShadow: '5px 5px 10px #0000002c',
            WebkitTextFillColor: '#3a0e66',
          }}
        >
          TALENTS
        </span>
      </div>

      <div className="mt-[-80px] font-[Formula_Condensed]">
        <span className="text-[#f5bf53] text-[80px] font-extrabold drop-shadow-[5px_5px_10px_rgba(0,0,0,0.17)]">
          MUSICAUX
        </span>
      </div>

      <div className="flex flex-row justify-center gap-4 mt-6">
  <div className="border-2 border-[#f5bf53] text-[#f5bf53] px-4 py-2 text-center font-[Jost]">
    <span>Artiste confirmé</span>
  </div>
  <div className="border-2 border-white text-white px-4 py-2 text-center font-[Jost]">
    <span>Talent en herbe</span>
  </div>
  <div className="border-2 border-[#f5bf53] text-[#f5bf53] px-4 py-2 text-center font-[Jost]">
    <span>Chansonnier...</span>
  </div>
</div>

      <div className="mt-10 text-left text-[14px]">
        <span className="text-white font-normal">
          <span className="text-[#f5bf53] font-bold">
            Inscris-toi, publie une vidéo
          </span>{' '}
          de ta prestation{' '}
          <span className="text-white font-bold">
            et donnes-toi plus de chances, chaque mois
          </span>
          , d'être sélectionné parmi les{' '}
          <span className="text-[#f5bf53] font-bold">
            10 talents et être produit.
          </span>
        </span>
      </div>
    </div>       
        </Box>
        <Box sx={{ width: { xs: '100%' }, padding: 2 }}> 
        <div className="max-w-sm rounded-xl shadow-lg overflow-hidden bg-white">
      <div className="relative">
        <video
          className="w-full h-48 object-cover"
          src="video-placeholder.mp4"
          controls
        ></video>
        <div className="absolute top-0 right-0 m-2">
          <span className="bg-gradient-to-b from-yellow-400 to-orange-500 text-black font-bold px-3 py-1 text-sm rounded-t-lg rounded-bl-lg shadow">
            Compétition
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white text-center py-2 font-bold text-xl">
        GOSPEL TALENT
      </div>

      <div className="px-4 py-3 text-center">
        <p>« GOSPEL TALENT» est un concept qui permet de détecter, révéler et faire la promotion des talents da...</p>
        {/* <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <div className="flex flex-col items-center">
            <CalendarDays size={20} />
            <span>Début</span>
            <span className="font-semibold text-black">02/02/2025</span>
          </div>
          <div className="flex flex-col items-center">
            <CalendarDays size={20} />
            <span>Fin</span>
            <span className="font-semibold text-black">10/07/2025</span>
          </div>
        </div> */}

        {/* <div className="flex justify-center -space-x-2 my-2">
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
        <p className="text-gray-500 italic text-sm">2 Candidats inscrit</p> */}

        <button className="mt-4 w-full bg-gradient-to-r from-fuchsia-700 to-purple-700 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
          ça m'intéresse
        </button>
      </div>
    </div>
      </Box>
      </Stack>
    </Box>
    <CompetCard />
    <EmissionCard />
    </>
  );
};

export default Dashboard;