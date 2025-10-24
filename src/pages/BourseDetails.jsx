import React from 'react';
import Animation from '../helper/Animation';
import Breadcrumb from '../components/Breadcrumb';
import AlloEcoleBourses from '../components/AlloEcoleBourses';
import BourseDetailsComponent from '../components/BourseDetailsComponent';
import '../assets/alloecole-styles.css'

const BourseDetails = () => {
  return (
    <>
    {/* <HeadBanner />
    <CompetCardCours />
    <EmissionCard titleComponent="Nos Concepts"  titleButton="Plus de détails"/>
    <Partner />
    <AlreadyProduced />
    <Actuality /> */}
    <Animation />
    <BourseDetailsComponent />
    </>
  );
};

export default BourseDetails;