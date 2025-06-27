import React, { useState } from 'react';
import CompetCard from '../components/CompetCard';
import CompetBanner from '../components/CompetBanner';
import ProfileCard from '../components/ProfileCard';
import InscriptionForm from '../components/InscriptionForm';

const CompetDetail: React.FC = () => {
  const [showInscription, setShowInscription] = useState(false);

  const handleInscriptionClick = () => {
    setShowInscription(!showInscription);
  };
  return (
    <>
      <CompetBanner onInscriptionClick={handleInscriptionClick} />
      {showInscription ? <InscriptionForm /> : <ProfileCard />}
    </>
  );
};

export default CompetDetail;