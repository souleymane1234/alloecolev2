import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompetBanner from '../components/CompetBanner';
import ProfileCard from '../components/ProfileCard';
import InscriptionForm from '../components/InscriptionForm';
import { useParams } from 'react-router-dom';
const apiUrl = (import.meta as any).env?.VITE_API_URL;

// Données simulées par défaut
const defaultCompetition = {
  titre_competition: 'Édition 2025 - Live Gospel',
  description_competition: 'Une édition phare avec des prestations live et un jury de professionnels du gospel. Rejoignez-nous pour découvrir les talents émergents de la scène musicale.',
  debut_inscription_competition: '2025-02-02',
  fin_inscription_competition: '2025-07-10',
  cout_inscription: 5000,
  url_video_competition: 'https://www.w3schools.com/html/mov_bbb.mp4',
  url_photo_competition: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
};

const defaultParticipants = [
  {
    id: 1,
    nom_correct: 'Kouassi',
    prenoms_correct: 'Jean-Baptiste',
    nbre_vote: 1250,
    url_photo_identite: 'https://i.pravatar.cc/150?img=1',
    url_video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    pays: 'Côte d\'Ivoire',
    rang: 1,
  },
  {
    id: 2,
    nom_correct: 'Traoré',
    prenoms_correct: 'Aminata',
    nbre_vote: 980,
    url_photo_identite: 'https://i.pravatar.cc/150?img=5',
    url_video: 'https://www.w3schools.com/html/movie.mp4',
    pays: 'Côte d\'Ivoire',
    rang: 2,
  },
  {
    id: 3,
    nom_correct: 'Kouamé',
    prenoms_correct: 'Marie-Claire',
    nbre_vote: 875,
    url_photo_identite: 'https://i.pravatar.cc/150?img=8',
    url_video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    pays: 'Côte d\'Ivoire',
    rang: 3,
  },
  {
    id: 4,
    nom_correct: 'Diabaté',
    prenoms_correct: 'Sékou',
    nbre_vote: 720,
    url_photo_identite: 'https://i.pravatar.cc/150?img=12',
    url_video: 'https://www.w3schools.com/html/movie.mp4',
    pays: 'Côte d\'Ivoire',
    rang: 4,
  },
  {
    id: 5,
    nom_correct: 'Koné',
    prenoms_correct: 'Fatou',
    nbre_vote: 650,
    url_photo_identite: 'https://i.pravatar.cc/150?img=15',
    url_video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    pays: 'Côte d\'Ivoire',
  },
  {
    id: 6,
    nom_correct: 'Sangaré',
    prenoms_correct: 'Ibrahim',
    nbre_vote: 580,
    url_photo_identite: 'https://i.pravatar.cc/150?img=20',
    url_video: 'https://www.w3schools.com/html/movie.mp4',
    pays: 'Côte d\'Ivoire',
  },
  {
    id: 7,
    nom_correct: 'Bamba',
    prenoms_correct: 'Aissatou',
    nbre_vote: 520,
    url_photo_identite: 'https://i.pravatar.cc/150?img=25',
    url_video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    pays: 'Côte d\'Ivoire',
  },
  {
    id: 8,
    nom_correct: 'Ouattara',
    prenoms_correct: 'Moussa',
    nbre_vote: 450,
    url_photo_identite: 'https://i.pravatar.cc/150?img=30',
    url_video: 'https://www.w3schools.com/html/movie.mp4',
    pays: 'Côte d\'Ivoire',
  },
];

const CompetDetail: React.FC = () => {
  const { code_competition } = useParams();
  const [competition, setCompetition] = useState(defaultCompetition);
  const [participants, setParticipants] = useState(defaultParticipants);
  const [loading, setLoading] = useState(false);
  const [showInscription, setShowInscription] = useState(false);

  const handleInscriptionClick = () => {
    setShowInscription(!showInscription);
  };

  useEffect(() => {
    const fetchCompetition = async () => {
      // Essayer de récupérer depuis l'API, sinon utiliser les données par défaut
      if (code_competition && apiUrl) {
        setLoading(true);
        try {
          const response = await axios.get(`${apiUrl}/competitions/${code_competition}`);
          if (response.status === 200) {
            setCompetition(response.data.details || defaultCompetition);
            setParticipants(response.data.participants || defaultParticipants);
            console.log('Participants:', response);
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la compétition:', error);
          setCompetition(defaultCompetition);
          setParticipants(defaultParticipants);
        } finally {
          setLoading(false);
        }
      } else {
        setCompetition(defaultCompetition);
        setParticipants(defaultParticipants);
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
      <InscriptionForm 
        competitionCode={code_competition} 
        onCancel={() => setShowInscription(false)}
      />
    ) : (
      <ProfileCard participants={participants}/>
    )}
  </>
  );
};

export default CompetDetail;