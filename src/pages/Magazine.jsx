import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MenuBook,
  Science,
  CameraAlt,
  Palette,
  SportsSoccer,
  Fastfood,
  EmojiNature,
  Computer,
  Description,
  Visibility
} from '@mui/icons-material';
import './Magazine.css';

const Magazine = () => {
  const navigate = useNavigate();
  const magazines = [
    {
      id: 1,
      icon: MenuBook,
      iconBg: '#E3F2FD',
      iconColor: '#2196F3',
      title: 'AlloEcole Magazine',
      issue: 'N° 45 - Janvier 2024',
      issueColor: '#2196F3',
      description: 'Le magazine mensuel des étudiants',
      pages: 32,
      buttonColor: '#2196F3',
      pdfUrl: '#'
    },
    {
      id: 2,
      icon: Science,
      iconBg: '#E8F5E9',
      iconColor: '#4CAF50',
      title: 'Science & Éducation',
      issue: 'N° 12 - Décembre 2023',
      issueColor: '#4CAF50',
      description: 'Découvrez les dernières innovations',
      pages: 28,
      buttonColor: '#4CAF50',
      pdfUrl: '#'
    },
    {
      id: 3,
      icon: CameraAlt,
      iconBg: '#FCE4EC',
      iconColor: '#E91E63',
      title: 'Campus Life',
      issue: 'N° 8 - Novembre 2023',
      issueColor: '#E91E63',
      description: 'La vie étudiante en images',
      pages: 24,
      buttonColor: '#E91E63',
      pdfUrl: '#'
    },
    {
      id: 4,
      icon: Palette,
      iconBg: '#F3E5F5',
      iconColor: '#9C27B0',
      title: 'Art & Culture',
      issue: 'N° 18 - Octobre 2023',
      issueColor: '#9C27B0',
      description: 'L\'expression artistique des étudiants',
      pages: 36,
      buttonColor: '#9C27B0',
      pdfUrl: '#'
    },
    {
      id: 5,
      icon: SportsSoccer,
      iconBg: '#FFF3E0',
      iconColor: '#FF9800',
      title: 'Sports Campus',
      issue: 'N° 21 - Septembre 2023',
      issueColor: '#FF9800',
      description: 'Tous les événements sportifs',
      pages: 20,
      buttonColor: '#FF9800',
      pdfUrl: '#'
    },
    {
      id: 6,
      icon: Fastfood,
      iconBg: '#FFEBEE',
      iconColor: '#F44336',
      title: 'Food & Nutrition',
      issue: 'N° 6 - Août 2023',
      issueColor: '#F44336',
      description: 'Manger sainement au campus',
      pages: 16,
      buttonColor: '#F44336',
      pdfUrl: '#'
    },
    {
      id: 7,
      icon: EmojiNature,
      iconBg: '#E0F2F1',
      iconColor: '#009688',
      title: 'Écologie Campus',
      issue: 'N° 9 - Juillet 2023',
      issueColor: '#009688',
      description: 'Pour un campus plus vert',
      pages: 22,
      buttonColor: '#009688',
      pdfUrl: '#'
    },
    {
      id: 8,
      icon: Computer,
      iconBg: '#E8EAF6',
      iconColor: '#3F51B5',
      title: 'Tech & Innovation',
      issue: 'N° 14 - Juin 2023',
      issueColor: '#3F51B5',
      description: 'Les nouvelles technologies',
      pages: 30,
      buttonColor: '#3F51B5',
      pdfUrl: '#'
    }
  ];

  const handleReadMagazine = (magazine) => {
    // Créer un objet simplifié sans le composant icon
    const magazineData = {
      id: magazine.id,
      title: magazine.title,
      issue: magazine.issue,
      issueColor: magazine.issueColor,
      description: magazine.description,
      pages: magazine.pages,
      buttonColor: magazine.buttonColor,
      pdfUrl: magazine.pdfUrl
    };
    
    // Navigation vers le lecteur de magazine avec les données
    navigate(`/magazine/read/${magazine.id}`, { 
      state: { magazine: magazineData } 
    });
  };

  return (
    <div className="magazine-page">
      <div className="magazine-content">
        <div className="magazine-list">
          {magazines.map((magazine) => (
            <div key={magazine.id} className="magazine-card">
              <div 
                className="magazine-icon-container"
                style={{ backgroundColor: magazine.iconBg }}
              >
                <magazine.icon 
                  className="magazine-icon"
                  style={{ color: magazine.iconColor }}
                />
              </div>
              
              <div className="magazine-info">
                <h3 className="magazine-title">{magazine.title}</h3>
                <p 
                  className="magazine-issue"
                  style={{ color: magazine.issueColor }}
                >
                  {magazine.issue}
                </p>
                <p className="magazine-description">{magazine.description}</p>
                
                <div className="magazine-footer">
                  <div className="magazine-pages">
                    <Description className="pages-icon" />
                    <span>{magazine.pages} pages</span>
                  </div>
                  
                  <button 
                    className="read-button"
                    style={{ backgroundColor: magazine.buttonColor }}
                    onClick={() => handleReadMagazine(magazine)}
                  >
                    <Visibility className="read-icon" />
                    <span>Lire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Magazine;

