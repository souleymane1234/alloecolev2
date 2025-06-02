import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {


  return (
    <section id="intro" className="w-full px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - WebTV */}
        <div className="w-full md:w-1/3">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">
              [&nbsp;&nbsp;<i className="fa fa-play-circle"></i>&nbsp;WebTV&nbsp;&nbsp;]
            </h2>
            <iframe
              className="w-full mt-2 rounded-lg"
              src="https://www.youtube.com/embed/KC9nJpI2TLk"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
              style={{
                background: 'rgba(236, 123, 51, 0.14)',
                height: '270px',
                padding: '8px',
              }}
              title="WebTV"
            ></iframe>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-2/3">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Texte principal */}
            <div className="hidden lg:block w-full lg:w-2/3 space-y-2">
              <span className="text-white text-2xl font-semibold font-condensed">
                Zik'Talent, la plateforme
              </span>
              <div className="-mt-4 font-condensed">
                <span className="text-white text-4xl font-bold">
                  digitale qui révèle les
                </span>
              </div>
              <div className="-mt-10 font-condensed">
                <span className="text-[90px] font-black text-[#3a0e66]" style={{
                  WebkitTextStroke: '2px #f5bf53',
                  textShadow: '5px 5px 10px #0000002c',
                }}>
                  TALENTS
                </span>
              </div>
              <div className="-mt-20 font-condensed">
                <span className="text-[80px] font-black text-[#f5bf53]" style={{
                  textShadow: '5px 5px 10px #0000002c',
                }}>
                  MUSICAUX
                </span>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-4">
                <div className="border-2 border-[#f5bf53] text-[#f5bf53] px-2 py-1 rounded">
                  Artiste confirmé
                </div>
                <div className="border-2 border-white text-white px-2 py-1 rounded">
                  Talent en herbe
                </div>
                <div className="border-2 border-[#f5bf53] text-[#f5bf53] px-2 py-1 rounded">
                  Chansonnier...
                </div>
              </div>

              {/* Call-to-action */}
              <p className="text-white text-sm mt-4 text-left">
                <span className="text-[#f5bf53] font-bold">
                  Inscris-toi, publie une vidéo
                </span>{' '}
                de ta prestation{' '}
                <span className="font-bold">et donnes-toi plus de chances, chaque mois</span>, d'être sélectionné parmi les{' '}
                <span className="text-[#f5bf53] font-bold">10 talents et être produit.</span>
              </p>
            </div>

            {/* Vidéo secondaire */}
            <div className="w-full lg:w-1/3">
              <article className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative">
                  <video className="w-full" muted loop preload="auto" controls>
                    <source src="video" type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                  <div className="absolute top-0 left-0 mt-2 ml-2 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">
                    <blink>NOUVEAU</blink>
                  </div>
                </div>
                <p className="text-center text-white font-bold text-2xl py-4" style={{
                  background: 'linear-gradient(to right, #970066, #911074, #861e81, #78298e, #663399)',
                  height: '100px',
                }}>
                  titre_emission
                </p>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-600 text-left">description_emission</p>
                  <div className="mt-4 mb-2">
                    <a
                      href="#"
                      className="inline-block bg-[#861e81] text-white px-6 py-2 rounded font-medium text-sm"
                    >
                      Plus de détails
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
