import React from 'react';
import EmissionCard from '../components/EmissionCard';
import Partner from '../components/Partner';
import AlreadyProduced from '../components/AlreadyProduced';
import HeadBanner from '../components/HeadBanner';

const Emissions: React.FC = () => {
  
  return (
    <>
    <HeadBanner />
    <EmissionCard titleComponent="Toutes nos émissions" titleButton="Participer"/>
    <Partner />
    <AlreadyProduced />
    </>
  );
};

export default Emissions;