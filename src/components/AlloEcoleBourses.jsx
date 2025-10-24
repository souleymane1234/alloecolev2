import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { CalendarDays } from "lucide-react";

const AlloEcoleBourses = () => {
  const [activeTab, setActiveTab] = useState('current'); // 'current' ou 'past'
  
  const bourses = [
    {
      id: 1,
      title: "Programme doctoral de littérature de l'Université de Bâle (Suisse)",
      published: "06/10/2025",
      deadline: "16/11/2025",
      type: "Doctorat",
      country: "Suisse",
      status: "current"
    },
    {
      id: 2,
      title: "Bourse d'étude doctorat en recrutement et égalité dans l'enseignement des sciences et de l'ingénierie",
      published: "29/09/2025",
      deadline: "04/11/2025",
      type: "Doctorat",
      country: "International",
      status: "current"
    },
    {
      id: 3,
      title: "Bourse d'études de l'Université de Lausanne UNIL, 2026/2027",
      published: "29/09/2025",
      deadline: "01/11/2025",
      type: "Master/Doctorat",
      country: "Suisse",
      status: "current"
    },
    {
      id: 4,
      title: "Bourse d'excellence Eiffel 2024-2025",
      published: "15/01/2024",
      deadline: "15/03/2024",
      type: "Master/Doctorat",
      country: "France",
      status: "past"
    },
    {
      id: 5,
      title: "Bourse Chevening 2024-2025",
      published: "01/08/2023",
      deadline: "01/11/2023",
      type: "Master",
      country: "Royaume-Uni",
      status: "past"
    },
    {
      id: 6,
      title: "Bourse Fulbright 2024-2025",
      published: "01/04/2024",
      deadline: "01/06/2024",
      type: "Master/Doctorat",
      country: "États-Unis",
      status: "past"
    }
  ];

  const currentBourses = bourses.filter(bourse => bourse.status === 'current');
  const pastBourses = bourses.filter(bourse => bourse.status === 'past');
  const displayedBourses = activeTab === 'current' ? currentBourses : pastBourses;

  return (
      <section className="bourses-section py-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="section-title" data-aos="fade-up">Bourses d'études</h2>
            <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
              Découvrez les opportunités de bourses d'études disponibles et passées
            </p>
          </div>
        </div>

        {/* Tabs de navigation */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-center">
            <div
              className="bourses-tabs"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="nav nav-pills d-flex justify-content-center" role="tablist">
                <button
                  className={`nav-link ${activeTab === 'current' ? 'active' : ''}`}
                  onClick={() => setActiveTab('current')}
                  type="button"
                >
                  <i className="ph-calendar-check me-2"></i>
                  Bourses actuelles ({currentBourses.length})
                </button>
                <button
                  className={`nav-link ${activeTab === 'past' ? 'active' : ''}`}
                  onClick={() => setActiveTab('past')}
                  type="button"
                >
                  <i className="ph-archive me-2"></i>
                  Bourses passées ({pastBourses.length})
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Contenu des bourses */}
        <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#f2f2f2',
          mx: 'auto',
          p: 2,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',     // mobile : 1 carte par ligne
            sm: 'repeat(2, 1fr)', // écran ≥600px : 2 cartes
            md: 'repeat(3, 1fr)', // écran ≥900px : 4 cartes
          },
          gap: 3,
        }}
      >
          {displayedBourses.length > 0 ? (
            displayedBourses.map((bourse) => (
              <div key={bourse.id} className="col">
                <div className={`bourse-card h-100 ${bourse.status === 'past' ? 'past-bourse' : ''}`} data-aos="fade-up" data-aos-delay={bourse.id * 100}>
                  <div className="bourse-header">
                    <span className="bourse-type">{bourse.type}</span>
                    <span className="bourse-country">{bourse.country}</span>
                    {bourse.status === 'past' && (
                      <span className="bourse-status past">Expirée</span>
                    )}
                  </div>
                  <div className="bourse-content">
                    <h4 className="bourse-title">{bourse.title}</h4>
                    <div className="bourse-meta">
                      <div className="meta-item">
                        <i className="ph-calendar"></i>
                        <span>Publié: {bourse.published}</span>
                      </div>
                      <div className="meta-item">
                        <i className="ph-clock"></i>
                        <span>Limite: {bourse.deadline}</span>
                      </div>
                    </div>
                    <Link 
                      to={`/bourses/details`} 
                      // to={`/bourses/${bourse.id}`} 
                      className={`btn ${bourse.status === 'past' ? 'btn-outline-secondary' : 'btn-primary'} btn-sm`}
                    >
                      {bourse.status === 'past' ? 'Voir détails' : 'Postuler maintenant'}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="empty-state">
                <i className="ph-folder-open display-1 text-muted mb-3"></i>
                <h4>Aucune bourse trouvée</h4>
                <p className="text-muted">
                  {activeTab === 'current' 
                    ? 'Aucune bourse actuellement disponible.' 
                    : 'Aucune bourse passée trouvée.'}
                </p>
              </div>
            </div>
          )}
      </Box>

        {/* Statistiques */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="bourses-stats bg-white p-4 rounded shadow-sm" data-aos="fade-up" data-aos-delay="400">
              <div className="row flex text-center w-100%">
                <div className="col-4 w-1/3">
                  <div className="stat-item">
                    <h3 className="text-primary mb-1">{currentBourses.length}</h3>
                    <p className="text-muted mb-0">Bourses actuelles</p>
                  </div>
                </div>
                <div className="col-4 w-1/3">
                  <div className="stat-item">
                    <h3 className="text-secondary mb-1">{pastBourses.length}</h3>
                    <p className="text-muted mb-0">Bourses passées</p>
                  </div>
                </div>
                <div className="col-4 w-1/3">
                  <div className="stat-item">
                    <h3 className="text-success mb-1">{bourses.length}</h3>
                    <p className="text-muted mb-0">Total des bourses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
};

export default AlloEcoleBourses;
