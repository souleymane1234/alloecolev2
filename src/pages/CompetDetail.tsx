import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompetBanner from '../components/CompetBanner';
import ProfileCard from '../components/ProfileCard';
import InscriptionForm from '../components/InscriptionForm';
import { useParams } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;


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
        const response = await axios.get(`${apiUrl}/competitions/${code_competition}`);
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
    {!loading && competition && (
      <CompetBanner onInscriptionClick={handleInscriptionClick} competition={competition} />
    )}
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