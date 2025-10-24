import React from 'react';
import Animation from '../helper/Animation';
import Breadcrumb from '../components/Breadcrumb';
import AlloEcoleBourses from '../components/AlloEcoleBourses';
import EtudeEtrangerComponent from '../components/EtudeEtrangerComponent';
import '../assets/alloecole-styles.css'

const EtudeEtranger = () => {
  return (
    <>
    {/* <HeadBanner />
    <CompetCardCours />
    <EmissionCard titleComponent="Nos Concepts"  titleButton="Plus de détails"/>
    <Partner />
    <AlreadyProduced />
    <Actuality /> */}
    <Animation />
    <EtudeEtrangerComponent />
    </>
  );
};

export default EtudeEtranger;