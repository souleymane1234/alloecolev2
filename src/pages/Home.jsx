import React from 'react';
import EmissionCard from '../components/EmissionCard';
import Partner from '../components/Partner';
import AlreadyProduced from '../components/AlreadyProduced';
import Actuality from '../components/Actuality';
import HeadBanner from '../components/HeadBanner';
import CompetCardCours from '../components/CompetCardCours';
import AlloEcoleNewsFeed from '../components/AlloEcoleNewsFeed';
import Animation from '../helper/Animation';

const Home = () => {
  return (
    <>
    {/* <HeadBanner />
    <CompetCardCours />
    <EmissionCard titleComponent="Nos Concepts"  titleButton="Plus de détails"/>
    <Partner />
    <AlreadyProduced />
    <Actuality /> */}
    <Animation />
    <AlloEcoleNewsFeed />
    </>
  );
};

export default Home;