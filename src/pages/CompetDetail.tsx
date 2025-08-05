import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompetCard from '../components/CompetCard';
import CompetBanner from '../components/CompetBanner';
import ProfileCard from '../components/ProfileCard';
import InscriptionForm from '../components/InscriptionForm';
import { useParams } from 'react-router-dom';

const CompetDetail: React.FC = () => {
  const { code_competition } = useParams();
  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInscription, setShowInscription] = useState(false);

  const handleInscriptionClick = () => {
    setShowInscription(!showInscription);
  };

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await axios.get(`http://localhost:9002/api/competitions/${code_competition}`);
        if (response.status === 200) {
          setCompetition(response.data.details);
          setParticipants(response.data.participants || []);
          console.log('Participants:', response);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la compétition:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompetition();
  }, [code_competition]);
  console.log('Competition data:', competition);
  
  return (
    <>
    <CompetBanner onInscriptionClick={handleInscriptionClick} competition={competition} />
    {loading ? (
      <p>Chargement...</p>
    ) : showInscription ? (
      <InscriptionForm competitionCode={code_competition} />
    ) : (
      <ProfileCard participants={participants}/>
    )}
  </>
  );
};

export default CompetDetail;