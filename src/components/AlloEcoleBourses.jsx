import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';

const AlloEcoleBourses = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [filteredBourses, setFilteredBourses] = useState([]);

  // --- Logique inchangée ---
  const fetchBourses = async () => {
    const response = await fetch('https://alloecoleapi-dev.up.railway.app/api/v1/students/scholarships');
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

  const currentBourses = bourses.filter((bourse) => isCurrent(bourse));
  const pastBourses = bourses.filter((bourse) => !isCurrent(bourse));

  useEffect(() => {
    const displayed = activeTab === 'current' ? currentBourses : pastBourses;
    setFilteredBourses(displayed);
  }, [activeTab, bourses]);

  console.log('Bourses fetched:', bourses);

  // --- VUE CENTRÉE ---
  if (isLoading) {
    return (
      <section className="bourses-section py-5 d-flex justify-content-center align-items-center min-vh-100 text-center">
        <div>
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Chargement des bourses...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bourses-section py-5 d-flex justify-content-center align-items-center min-vh-100 text-center">
        <div>
          <div className="alert alert-danger mb-3" role="alert">
            ⚠️ {error?.message || "Impossible de charger les bourses"}
          </div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bourses-section py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ backgroundColor: '#fefaf8' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Titre */}
        <div className="row">
          <div className="col-lg-8 mx-auto mb-5">
            <h2 className="section-title" data-aos="fade-up">Bourses d'études</h2>
            <p className="section-subtitle text-muted" data-aos="fade-up" data-aos-delay="100">
              Consultez les fiches de bourses avec toutes les informations utiles. Les candidatures se font directement auprès des organismes annonceurs.
            </p>
          </div>
        </div>

        {/* Onglets */}
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
            // ✅ Bloc vide centré verticalement et horizontalement
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

        {/* Statistiques centrées */}
        {/* <div className="row mt-5 justify-content-center">
          <div className="col-lg-8">
            <div className="bourses-stats bg-white p-4 rounded shadow-sm" data-aos="fade-up" data-aos-delay="400">
              <div className="row text-center">
                <div className="col-4">
                  <h3 className="text-primary mb-1">{currentBourses.length}</h3>
                  <p className="text-muted mb-0">Bourses actuelles</p>
                </div>
                <div className="col-4">
                  <h3 className="text-secondary mb-1">{pastBourses.length}</h3>
                  <p className="text-muted mb-0">Bourses passées</p>
                </div>
                <div className="col-4">
                  <h3 className="text-success mb-1">{bourses.length}</h3>
                  <p className="text-muted mb-0">Total des bourses</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Pagination centrée */}
        {pagination && (
          <div className="text-center text-muted mt-3">
            Page {pagination.current_page} sur {pagination.total_pages} (
            {pagination.total_items} bourse{pagination.total_items > 1 ? 's' : ''})
          </div>
        )}
      </div>
    </section>
  );
};

export default AlloEcoleBourses;
