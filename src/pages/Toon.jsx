import React from 'react';
import { 
  PlayArrow,
  Group,
  Palette,
  Science,
  Calculate,
  Language,
  History,
  Public,
  MusicNote,
  SportsBasketball,
  ArrowForward
} from '@mui/icons-material';
import './Toon.css';

const Toon = () => {
  // Catégories de Toon
  const toonCategories = [
    {
      id: 1,
      icon: Palette,
      iconBg: '#E3F2FD',
      iconColor: '#2196F3',
      title: 'SCHOOL TOON',
      description: 'Dessins animés éducatifs pour apprendre en s\'amusant',
      videos: 45,
      subscribers: 12500
    },
    // {
    //   id: 2,
    //   icon: Science,
    //   iconBg: '#F3E5F5',
    //   iconColor: '#9C27B0',
    //   title: 'SCIENCE TOON',
    //   description: 'Découvrez les merveilles de la science à travers des animations',
    //   videos: 38,
    //   subscribers: 9800
    // },
    // {
    //   id: 3,
    //   icon: Calculate,
    //   iconBg: '#FFF3E0',
    //   iconColor: '#FF9800',
    //   title: 'MATHS TOON',
    //   description: 'Rendez les mathématiques amusantes avec des dessins animés',
    //   videos: 52,
    //   subscribers: 15200
    // },
    // {
    //   id: 4,
    //   icon: Language,
    //   iconBg: '#E8F5E9',
    //   iconColor: '#4CAF50',
    //   title: 'LANGUES TOON',
    //   description: 'Apprenez de nouvelles langues de manière ludique',
    //   videos: 67,
    //   subscribers: 18500
    // },
    // {
    //   id: 5,
    //   icon: History,
    //   iconBg: '#FBE9E7',
    //   iconColor: '#FF5722',
    //   title: 'HISTOIRE TOON',
    //   description: 'Voyagez dans le temps avec des histoires captivantes',
    //   videos: 41,
    //   subscribers: 11300
    // },
    // {
    //   id: 6,
    //   icon: Public,
    //   iconBg: '#E0F2F1',
    //   iconColor: '#009688',
    //   title: 'GÉOGRAPHIE TOON',
    //   description: 'Explorez le monde à travers des animations éducatives',
    //   videos: 35,
    //   subscribers: 8900
    // },
    // {
    //   id: 7,
    //   icon: MusicNote,
    //   iconBg: '#FCE4EC',
    //   iconColor: '#E91E63',
    //   title: 'MUSIQUE TOON',
    //   description: 'Découvrez la musique et les instruments avec style',
    //   videos: 29,
    //   subscribers: 7600
    // },
    // {
    //   id: 8,
    //   icon: SportsBasketball,
    //   iconBg: '#FFF9C4',
    //   iconColor: '#FBC02D',
    //   title: 'SPORT TOON',
    //   description: 'Le sport expliqué aux enfants de manière amusante',
    //   videos: 33,
    //   subscribers: 10200
    // }
  ];

  const handleCategoryClick = (categoryId) => {
    // Redirection vers le site externe MySchoolToon
    window.open('https://www.myschooltoon.com', '_blank');
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <div className="toon-page">
      <div className="toon-content">
        <div className="toon-categories">
          {toonCategories.map((category) => (
            <div 
              key={category.id} 
              className="toon-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="toon-card-content">
                <div 
                  className="toon-icon-container"
                  style={{ backgroundColor: category.iconBg }}
                >
                  <category.icon 
                    className="toon-icon"
                    style={{ color: category.iconColor }}
                  />
                </div>
                
                <div className="toon-info">
                  <h3 className="toon-title">{category.title}</h3>
                  <p className="toon-description">{category.description}</p>
                  
                  <div className="toon-stats">
                    <div className="toon-stat">
                      <PlayArrow className="stat-icon" />
                      <span>{category.videos} vidéos</span>
                    </div>
                    <div className="toon-stat">
                      <Group className="stat-icon" />
                      <span>{formatNumber(category.subscribers)} abonnés</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="toon-arrow">
                <ArrowForward />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toon;

