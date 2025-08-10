import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import axios from 'axios';

const HeadBanner: React.FC = () => {

  interface Emission {
    code_emission: string;
    url_video_emission: string;
    url_photo_emission: string;
    titre_emission: string;
    description_emission: string;
  }

    const [emissions, setEmissions] = useState<Emission | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      axios.get('http://localhost:9002/api/emission')
        .then((response) => {
          const allEmissions = response.data.emissions || [];
          const gospelEmission = allEmissions.find(
            emission => emission.titre_emission === "GOSPEL TALENT"
          );
          setEmissions(gospelEmission || null);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des émissions :', error);
          setLoading(false);
        });
    }, []);

    console.log('competDetails', emissions);
  return (
    <>
    <Box     width="100%"
    display="flex"
    justifyContent="center"
    padding={2}
    sx={{
      backgroundImage: 'url(/img/bg1.jpg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 3 }}
        justifyContent="center"
        alignItems="center"
        width="100%"
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

        <Box sx={{ width: '100%', padding: { xs: 1.5, sm: 2 } }}>
  <div className="mt-6 sm:mt-10">
    <span className="text-white text-[18px] sm:text-[22px] font-semibold font-[Formula_Condensed] mb-6 block">
      Zik'Talent, la plateforme
    </span>

    <div className="mt-[-30px] font-[Formula_Condensed] mb-2 sm:mb-4">
      <span className="text-white text-[28px] sm:text-[38px] font-bold block">
        digitale qui révèle les
      </span>
    </div>

    <div className="mt-[-40px] font-[Formula_Condensed]">
      <span
        className="text-[70px] sm:text-[90px] font-extrabold drop-shadow-[3px_3px_6px_rgba(0,0,0,0.2)]"
        style={{
          WebkitTextStroke: '1px #f5bf53',
          textShadow: '3px 3px 6px #0000002c',
          WebkitTextFillColor: '#3a0e66',
        }}
      >
        TALENTS
      </span>
    </div>

    <div className="mt-[-35px] sm:mt-[-70px] font-[Formula_Condensed]">
      <span className="text-[#f5bf53] text-[65px] sm:text-[80px] font-extrabold drop-shadow-[3px_3px_6px_rgba(0,0,0,0.2)]">
        MUSICAUX
      </span>
    </div>

    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      <div className="border border-[#f5bf53] text-[#f5bf53] px-3 py-1.5 text-center text-sm font-[Jost]">
        <span>Artiste confirmé</span>
      </div>
      <div className="border border-white text-white px-3 py-1.5 text-center text-sm font-[Jost]">
        <span>Talent en herbe</span>
      </div>
      <div className="border border-[#f5bf53] text-[#f5bf53] px-3 py-1.5 text-center text-sm font-[Jost]">
        <span>Chansonnier...</span>
      </div>
    </div>

    <div className="mt-8 sm:mt-10 text-left text-sm sm:text-[14px] leading-relaxed">
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
        <Box sx={{ width: { xs: '100%', sm: '100%', md: '70%' }, padding: 2 }}> 
        <div className="max-w-sm rounded-xl shadow-lg overflow-hidden bg-white">
      <div className="relative">
      <video
        className="w-full h-32 sm:h-36 md:h-40 object-cover"
        src={`http://localhost:9002/${emissions?.url_video_emission}`}
        poster={`http://localhost:9002/${emissions?.url_photo_emission}`}
        controls
      ></video>
        <div className="absolute top-0 right-0">
          <span className="bg-gradient-to-b from-yellow-400 to-orange-500 text-black font-bold px-3 py-1 text-sm rounded-t-lg rounded-bl-lg shadow">
            Emission
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-fuchsia-700 to-purple-700 text-white text-center py-2 font-bold text-xl">
        {emissions?.titre_emission}
      </div>

      <div className="px-4 py-3 text-center">
      <p
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {emissions?.description_emission}
      </p>
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
    </>
  );
};

export default HeadBanner;