import React from 'react';
import Animation from '../helper/Animation';
import Breadcrumb from '../components/Breadcrumb';
import AlloEcoleBourses from '../components/AlloEcoleBourses';
import EtudeEtrangerComponent from '../components/EtudeEtrangerComponent';
import PermutationRequestForm from '../components/PermutationRequestForm';
import PermutationList from '../components/PermutationList';
import '../assets/alloecole-styles.css'

const Permutation = () => {
  return (
    <>
    {/* <HeadBanner />
    <CompetCardCours />
    <EmissionCard titleComponent="Nos Concepts"  titleButton="Plus de détails"/>
    <Partner />
    <AlreadyProduced />
    <Actuality /> */}
    <Animation />
    <PermutationRequestForm />
    {/* <PermutationList /> */}
    </>
  );
};

export default Permutation;