import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';

const AlloEcoleBourses = () => {
  const [mainTab, setMainTab] = useState('bourses'); // Onglet principal : bourses, emploi, stage, formations, autres
  const [activeTab, setActiveTab] = useState('current'); // Sous-onglet pour les bourses : current, past

  // --- Logique pour les bourses ---
  const fetchBourses = async () => {
    const response = await fetch('https://alloecoleapi-dev.up.railway.app/api/v1/scholarships');
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const result = await response.json();
    if (result.success && result.data) {
      return { bourses: result.data, pagination: result.pagination };
    }
    return { bourses: [], pagination: null };
  };

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['scholarships'],
    queryFn: fetchBourses,
    staleTime: 20 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const bourses = data?.bourses || [];
  const pagination = data?.pagination || null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isCurrent = (bourse) => {
    const deadline = new Date(bourse.dateLimite);
    const today = new Date();
    return deadline >= today && bourse.status === 'OUVERTE';
  };

  const getBourseType = (title) => {
    if (title.toLowerCase().includes('doctorat')) return 'Doctorat';
    if (title.toLowerCase().includes('master')) return 'Master';
    if (title.toLowerCase().includes('licence')) return 'Licence';
    return 'Master/Doctorat';
  };

  // Utiliser useMemo pour calculer les bourses filtrées
  const filteredBourses = useMemo(() => {
    const currentBourses = bourses.filter((bourse) => isCurrent(bourse));
    const pastBourses = bourses.filter((bourse) => !isCurrent(bourse));
    return activeTab === 'current' ? currentBourses : pastBourses;
  }, [activeTab, bourses]);

  const currentBourses = useMemo(() => bourses.filter((bourse) => isCurrent(bourse)), [bourses]);
  const pastBourses = useMemo(() => bourses.filter((bourse) => !isCurrent(bourse)), [bourses]);

  // --- Fonction pour rendre le contenu des bourses ---
  const renderBoursesContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Chargement des bourses...</p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <div className="alert alert-danger mb-3" role="alert">
              ⚠️ {error?.message || "Impossible de charger les bourses"}
            </div>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Sous-onglets pour les bourses */}
        <div className="row mb-4 justify-content-center">
          <div className="col-auto w-full">
            <div className="bourses-tabs w-full" data-aos="fade-up" data-aos-delay="200">
              <div className="nav nav-pills justify-content-center" role="tablist">
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

        {/* Liste des bourses */}
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#f9f9f9',
            mx: 'auto',
            p: 2,
            display: 'grid',
            justifyContent: 'center',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            minHeight: '300px',
          }}
        >
          {filteredBourses.length > 0 ? (
            filteredBourses.map((bourse) => (
              <div key={bourse.id} className="d-flex justify-content-center">
                <div
                  className={`bourse-card h-100 text-start ${!isCurrent(bourse) ? 'past-bourse' : ''}`}
                  data-aos="fade-up"
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    padding: '20px',
                    width: '100%',
                    maxWidth: '350px',
                  }}
                >
                  <div className="bourse-header d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary">{getBourseType(bourse.title)}</span>
                    <span className="badge bg-light text-dark">{bourse.hostCountry}</span>
                  </div>
                  {!isCurrent(bourse) && (
                    <span className="badge bg-danger mb-2">
                      {bourse.status === 'FERMEE' ? 'Fermée' : 'Expirée'}
                    </span>
                  )}

                  <h5 className="bourse-title mb-3">{bourse.title}</h5>
                  <div className="bourse-meta mb-4 text-muted small">
                    <div>📅 Publié : {formatDate(bourse.publishedAt)}</div>
                    <div>⏰ Limite : {formatDate(bourse.dateLimite)}</div>
                  </div>
                  <Link
                    to={`/bourses/details/${bourse.id}`}
                    className={`btn w-100 ${!isCurrent(bourse) ? 'btn-outline-secondary' : 'btn-primary'}`}
                  >
                    Consulter la fiche
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div
              className="d-flex flex-column justify-content-center align-items-center text-center"
              style={{
                gridColumn: '1 / -1',
                minHeight: '300px',
              }}
            >
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

        {/* Pagination */}
        {pagination && (
          <div className="text-center text-muted mt-3">
            Page {pagination.current_page} sur {pagination.total_pages} (
            {pagination.total_items} bourse{pagination.total_items > 1 ? 's' : ''})
          </div>
        )}
      </>
    );
  };

  // --- Fonction pour rendre le contenu des offres d'emploi ---
  const renderEmploiContent = () => {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '300px' }}>
        <div className="empty-state">
          <i className="ph-briefcase display-1 text-muted mb-3"></i>
          <h4>Offres d'emploi</h4>
          <p className="text-muted">
            Les offres d'emploi seront bientôt disponibles.
          </p>
        </div>
      </div>
    );
  };

  // --- Fonction pour rendre le contenu des offres de stage ---
  const renderStageContent = () => {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '300px' }}>
        <div className="empty-state">
          <i className="ph-student display-1 text-muted mb-3"></i>
          <h4>Offres de stage</h4>
          <p className="text-muted">
            Les offres de stage seront bientôt disponibles.
          </p>
        </div>
      </div>
    );
  };

  // --- Fonction pour rendre le contenu des formations ---
  const renderFormationsContent = () => {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '300px' }}>
        <div className="empty-state">
          <i className="ph-graduation-cap display-1 text-muted mb-3"></i>
          <h4>Formations</h4>
          <p className="text-muted">
            Les formations seront bientôt disponibles.
          </p>
        </div>
      </div>
    );
  };

  // --- Fonction pour rendre le contenu des autres alertes ---
  const renderAutresContent = () => {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '300px' }}>
        <div className="empty-state">
          <i className="ph-bell display-1 text-muted mb-3"></i>
          <h4>Autres alertes</h4>
          <p className="text-muted">
            D'autres alertes seront bientôt disponibles.
          </p>
        </div>
      </div>
    );
  };

  // --- Fonction pour rendre le contenu selon l'onglet principal ---
  const renderMainContent = () => {
    switch (mainTab) {
      case 'bourses':
        return renderBoursesContent();
      case 'emploi':
        return renderEmploiContent();
      case 'stage':
        return renderStageContent();
      case 'formations':
        return renderFormationsContent();
      case 'autres':
        return renderAutresContent();
      default:
        return renderBoursesContent();
    }
  };

  return (
    <section className="bourses-section py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ backgroundColor: '#fefaf8' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Titre */}
        <div className="row">
          <div className="col-lg-8 mx-auto mb-5">
            <h2 className="section-title" data-aos="fade-up">Nos alertes</h2>
            <p className="section-subtitle text-muted" data-aos="fade-up" data-aos-delay="100">
              Consultez toutes les alertes disponibles : bourses d'études, offres d'emploi, de stage, de formations et autres opportunités.
            </p>
          </div>
        </div>

        {/* Onglets principaux */}
        <div className="row mb-4 justify-content-center">
          <div className="col-auto w-full">
            <div className="bourses-tabs w-full" data-aos="fade-up" data-aos-delay="200">
              <div className="nav nav-pills justify-content-center flex-wrap" role="tablist">
                <button
                  className={`nav-link ${mainTab === 'bourses' ? 'active' : ''}`}
                  onClick={() => {
                    setMainTab('bourses');
                    setActiveTab('current');
                  }}
                  type="button"
                >
                  <i className="ph-graduation-cap me-2"></i>
                  Bourses d'étude {mainTab === 'bourses' && `(${bourses.length})`}
                </button>
                <button
                  className={`nav-link ${mainTab === 'emploi' ? 'active' : ''}`}
                  onClick={() => setMainTab('emploi')}
                  type="button"
                >
                  <i className="ph-briefcase me-2"></i>
                  Offres d'emploi
                </button>
                <button
                  className={`nav-link ${mainTab === 'stage' ? 'active' : ''}`}
                  onClick={() => setMainTab('stage')}
                  type="button"
                >
                  <i className="ph-student me-2"></i>
                  Offres de stage
                </button>
                <button
                  className={`nav-link ${mainTab === 'formations' ? 'active' : ''}`}
                  onClick={() => setMainTab('formations')}
                  type="button"
                >
                  <i className="ph-book-open me-2"></i>
                  Formations
                </button>
                <button
                  className={`nav-link ${mainTab === 'autres' ? 'active' : ''}`}
                  onClick={() => setMainTab('autres')}
                  type="button"
                >
                  <i className="ph-bell me-2"></i>
                  Autres
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu selon l'onglet principal */}
        {renderMainContent()}
      </div>
    </section>
  );
};

export default AlloEcoleBourses;
