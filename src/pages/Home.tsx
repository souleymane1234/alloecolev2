import React from 'react';
import EmissionCard from '../components/EmissionCard';
import Partner from '../components/Partner';
import AlreadyProduced from '../components/AlreadyProduced';
import Actuality from '../components/Actuality';
import HeadBanner from '../components/HeadBanner';
import CompetCardCours from '../components/CompetCardCours';

const Home: React.FC = () => {
  return (
    <>
    <HeadBanner />
    <CompetCardCours />
    <EmissionCard titleComponent="Nos Concepts"  titleButton="Plus de détails"/>
    <Partner />
    <AlreadyProduced />
    <Actuality />
    </>
  );
};

export default Home;