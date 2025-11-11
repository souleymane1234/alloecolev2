import React from 'react';
import Animation from '../helper/Animation';
import WebTVHero from '../components/webTvComponent/WebTVHero'
import VideoCategories from '../components/webTvComponent/VideoCategories'
import '../assets/alloecole-styles.css'

const WebTv = () => {
  return (
    <>
    {/* <HeadBanner />
    <CompetCardCours />
    <EmissionCard titleComponent="Nos Concepts"  titleButton="Plus de détails"/>
    <Partner />
    <AlreadyProduced />
    <Actuality /> */}
    <Animation />
    <WebTVHero />
    <VideoCategories />
    </>
  );
};

export default WebTv;