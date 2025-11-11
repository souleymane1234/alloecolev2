import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './BourseDetailsComponent.css';

const BourseDetailsComponent = () => {
    const { id } = useParams(); // Récupère l'id dans l'URL
  const [activeTab, setActiveTab] = useState('description');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  // --- Vérifier si l'utilisateur est connecté ---
  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  };

  // --- Récupérer le token ---
  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  // --- Fonction de récupération des détails depuis l'API ---
  const fetchBourseDetails = async () => {
    const response = await fetch(`https://alloecoleapi-dev.up.railway.app/api/v1/students/scholarships/${id}`);
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const result = await response.json();
    if (result.success && result.data) return result.data;
    throw new Error('Aucune donnée trouvée');
  };

    // --- Fonction de candidature à la bourse ---
  const applyToScholarship = async () => {
    const token = getAuthToken();
    
    const response = await fetch(
      `https://alloecoleapi-dev.up.railway.app/api/v1/students/scholarships/${id}/apply`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    return await response.json();
  };


  // --- Utilisation de React Query ---
  const { data: bourse, isLoading, isError, error } = useQuery({
    queryKey: ['bourse', id],
    queryFn: fetchBourseDetails,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

    // --- Mutation pour la candidature ---
  const applyMutation = useMutation({
    mutationFn: applyToScholarship,
    onSuccess: (data) => {
      console.log('Candidature réussie:', data);
      alert('Votre candidature a été soumise avec succès !');
      queryClient.invalidateQueries(['bourse', id]);
    },
    onError: (error) => {
      console.error('Erreur lors de la candidature:', error);
      alert(`Erreur: ${error.message}`);
    },
  });

  // --- Gestionnaire de candidature ---
  const handleApply = () => {
    // Vérifier si l'utilisateur est connecté
    if (!isAuthenticated()) {
      // Sauvegarder l'URL actuelle pour rediriger après connexion
      const currentPath = location.pathname;
      
      if (window.confirm('Vous devez être connecté pour postuler à cette bourse. Voulez-vous vous connecter maintenant ?')) {
        // Rediriger vers la page de connexion avec l'URL de retour
        navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      return;
    }

    // Si connecté, procéder à la candidature
    if (window.confirm('Êtes-vous sûr de vouloir postuler à cette bourse ?')) {
      applyMutation.mutate();
    }
  };


  console.log('Détails de la bours:', bourse);

  // --- États de chargement et d'erreur ---
  if (isLoading) {
    return (
      <section className="bourse-details d-flex justify-content-center align-items-center min-vh-100 text-center">
        <div>
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Chargement des détails de la bourse...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bourse-details d-flex justify-content-center align-items-center min-vh-100 text-center">
        <div>
          <div className="alert alert-danger mb-3" role="alert">
            ⚠️ {error.message}
          </div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  // --- Calculs utiles ---
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const deadline = new Date(bourse.dateLimite);
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = deadline < new Date();




  return (
    <>

      <div className="page-container">
        <section className="section">
          <div className="container">
            {/* En-tête de la bourse */}
            <div className="header-section">
              <div className="grid grid-cols-1 lg-grid-cols-3">
                <div className="lg-col-span-2">
                  <div className="badges-container">
                    <span className={isExpired ? 'badge badge-expired' : 'badge badge-active'}>
                      {isExpired ? 'Bourse expirée' : 'Bourse active'}
                    </span>
                    <span className="badge badge-outline">
                      {bourse?.type}
                    </span>
                    <span className="badge badge-type">
                      {bourse?.country}
                    </span>
                  </div>
                  
                  <h1 className="title">{bourse.title}</h1>
                  
                  {/* Image de la bourse */}
                  <div className="image-container">
                    <img 
                      src="/images/poster/bourse.jpg"
                      alt={bourse.title}
                    />
                    <div className="image-badge">
                      <div className="overlay-badge">
                        <i className="ph ph-graduation-cap"></i>
                        {bourse?.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-grid">
                    <div className="info-column">
                      <div className="info-item">
                        <i className="ph ph-building"></i>
                        <span><strong>Université :</strong> {bourse?.university}</span>
                      </div>
                      <div className="info-item">
                        <i className="ph ph-calendar"></i>
                        <span><strong>Publié :</strong> {bourse?.publishedAt}</span>
                      </div>
                      <div className="info-item">
                        <i className="ph ph-clock"></i>
                        <span><strong>Limite :</strong> {bourse?.dateLimite}</span>
                        {!isExpired && daysLeft > 0 && (
                          <span className="days-left">({daysLeft} jours restants)</span>
                        )}
                      </div>
                    </div>
                    <div className="info-column">
                      <div className="info-item">
                        <i className="ph ph-timer"></i>
                        <span><strong>Durée :</strong> {bourse?.duration}</span>
                      </div>
                      <div className="info-item">
                        <i className="ph ph-currency-circle-dollar"></i>
                        <span><strong>Montant :</strong> {bourse?.amount}</span>
                      </div>
                      <div className="info-item">
                        <i className="ph ph-translate"></i>
                        <span><strong>Langues :</strong> {bourse?.language}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg-col-span-1">
                  <div className="sidebar">
                    <h5 className="sidebar-title">Actions</h5>
                      {/* <button className="btn btn-primary">
                        <i className="ph ph-paper-plane-tilt"></i>
                        Postuler maintenant
                      </button> */}
                    {!isExpired ? (
                      <button 
                        className="btn btn-primary"
                        onClick={handleApply}
                        disabled={applyMutation.isPending}
                      >
                        <i className="ph ph-paper-plane-tilt"></i>
                        {applyMutation.isPending ? 'Envoi en cours...' : 'Postuler maintenant'}
                      </button>
                    ) : (
                      <button className="btn btn-disabled" disabled>
                        <i className="ph ph-clock"></i>
                        Bourse expirée
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Onglets de contenu */}
            <div className="tabs-container">
              <div className="tabs-header">
                <button
                  className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  <i className="ph ph-file-text"></i>
                  Description
                </button>
                <button
                  className={`tab-button ${activeTab === 'requirements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('requirements')}
                >
                  <i className="ph ph-list-checks"></i>
                  Exigences
                </button>
                <button
                  className={`tab-button ${activeTab === 'benefits' ? 'active' : ''}`}
                  onClick={() => setActiveTab('benefits')}
                >
                  <i className="ph ph-gift"></i>
                  Avantages
                </button>
              </div>

              {/* Contenu des onglets */}
              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className="grid grid-cols-1 lg-grid-cols-3">
                    <div className="lg-col-span-2">
                      <div className="content-box">
                        <h4 className="content-title">Description du programme</h4>
                        <p className="content-text">{bourse?.description}</p>
                      </div>
                    </div>
                    <div className="lg-col-span-1">
                      <div className="info-box">
                        <h5 className="info-box-title">Informations clés</h5>
                        <ul className="info-list">
                          <li><strong>Type :</strong> {bourse?.type}</li>
                          <li><strong>Pays :</strong> {bourse?.country}</li>
                          <li><strong>Durée :</strong> {bourse?.duration}</li>
                          <li><strong>Montant :</strong> {bourse?.amount}</li>
                          <li><strong>Langues :</strong> {bourse?.language}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="content-box">
                    <h4 className="content-title">Exigences de candidature</h4>
                    <div className="requirements-list">
                      {bourse?.requirements.map((req, index) => (
                        <div key={index} className="requirement-item">
                          <i className="ph ph-check-circle"></i>
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'benefits' && (
                  <div className="content-box">
                    <h4 className="content-title">Avantages de la bourse</h4>
                    <div className="benefits-grid">
                      {bourse?.benefits.map((benefit, index) => (
                        <div key={index} className="benefit-item">
                          <i className="ph ph-star"></i>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BourseDetailsComponent;