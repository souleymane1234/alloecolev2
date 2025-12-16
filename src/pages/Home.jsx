import React, { useState, useEffect } from 'react';
import EmissionCard from '../components/EmissionCard';
import Partner from '../components/Partner';
import AlreadyProduced from '../components/AlreadyProduced';
import Actuality from '../components/Actuality';
import HeadBanner from '../components/HeadBanner';
import CompetCardCours from '../components/CompetCardCours';
import AlloEcoleNewsFeed from '../components/AlloEcoleNewsFeed';
import QuizBanner from '../components/QuizBanner';
import QuizPopup from '../components/QuizPopup';
import Animation from '../helper/Animation';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu le popup aujourd'hui
    const lastPopupDate = localStorage.getItem('quizPopupDate');
    const today = new Date().toDateString();
    
    if (lastPopupDate !== today) {
      // Afficher le popup après un court délai
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem('quizPopupDate', today);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
    {/* <HeadBanner />
    <CompetCardCours />
    <EmissionCard titleComponent="Nos Concepts"  titleButton="Plus de détails"/>
    <Partner />
    <AlreadyProduced />
    <Actuality /> */}
    <Animation />
    <QuizBanner />
    <AlloEcoleNewsFeed />
    {showPopup && <QuizPopup onClose={() => setShowPopup(false)} />}
    </>
  );
};

export default Home;