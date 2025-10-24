import React, { useState } from 'react';

const BourseDetailsComponent = () => {
  const [activeTab, setActiveTab] = useState('description');

  // Données de la bourse
  const bourse = {
    id: 1,
    title: "Programme doctoral de littérature de l'Université de Bâle (Suisse)",
    published: "06/10/2025",
    deadline: "16/11/2025",
    type: "Doctorat",
    country: "Suisse",
    status: "current",
    university: "Université de Bâle",
    duration: "3-4 ans",
    amount: "CHF 1'500/mois",
    language: "Français, Allemand, Anglais",
    requirements: [
      "Master en littérature ou domaine connexe",
      "Excellence académique (moyenne minimale 5.0/6.0)",
      "Projet de recherche innovant",
      "Maîtrise de l'allemand (niveau C1)",
      "Lettre de motivation",
      "2 lettres de recommandation"
    ],
    benefits: [
      "Bourse mensuelle de CHF 1'500",
      "Exemption des frais de scolarité",
      "Accès aux ressources de recherche",
      "Encadrement par des professeurs renommés",
      "Possibilité de séjours à l'étranger",
      "Réseau international d'étudiants"
    ],
    description: "Le programme doctoral en littérature de l'Université de Bâle offre une formation d'excellence dans un environnement de recherche international. Les candidats retenus bénéficient d'un encadrement personnalisé et d'un accès privilégié aux ressources documentaires de l'une des plus prestigieuses universités suisses.",
    contact: {
      email: "phd.literature@unibas.ch",
      phone: "+41 61 207 30 00",
      website: "https://www.unibas.ch/literature-phd"
    }
  };

  const isExpired = bourse.status === 'past';
  const daysLeft = Math.ceil((new Date(bourse.deadline.split('/').reverse().join('-')) - new Date()) / (1000 * 60 * 60 * 24));

  const boursesSimiliaires = [
    {
      id: 3,
      title: "Bourse UNIL 2026/2027",
      description: "Bourse d'études de l'Université de Lausanne",
      type: "Doctorat",
      country: "Suisse",
      deadline: "01/11/2025",
      status: "current"
    },
    {
      id: 2,
      title: "Bourse d'étude doctorat sciences",
      description: "Recrutement et égalité dans l'enseignement",
      type: "Doctorat",
      country: "International",
      deadline: "04/11/2025",
      status: "current"
    },
    {
      id: 4,
      title: "Bourse d'excellence Eiffel",
      description: "Programme de bourses d'excellence français",
      type: "Master",
      country: "France",
      deadline: "15/03/2024",
      status: "past"
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
        
        * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        .page-container {
          min-height: 100vh;
          background-color: #f9fafb;
        }

        .section {
          padding: 3rem 0;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header-section {
          margin-bottom: 3rem;
        }

        .grid {
          display: grid;
          gap: 2rem;
        }

        .grid-cols-1 {
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        @media (min-width: 768px) {
          .md-grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .lg-grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .lg-col-span-2 {
            grid-column: span 2 / span 2;
          }

          .lg-col-span-1 {
            grid-column: span 1 / span 1;
          }
        }

        .badges-container {
          margin-bottom: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .badge-active {
          background-color: #ea580c;
          color: white;
        }

        .badge-expired {
          background-color: #4b5563;
          color: white;
        }

        .badge-outline {
          background-color: white;
          color: #ea580c;
          border: 2px solid #ea580c;
        }

        .badge-type {
          background-color: #ea580c;
          color: white;
        }

        .title {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 1024px) {
          .title {
            font-size: 2.25rem;
          }
        }

        .image-container {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border: 4px solid #ea580c;
          margin-bottom: 1.5rem;
        }

        .image-container img {
          width: 100%;
          height: 20rem;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .image-container:hover img {
          transform: scale(1.05);
        }

        .image-badge {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
        }

        .overlay-badge {
          background: linear-gradient(to right, #ea580c, #c2410c);
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 2px solid white;
          backdrop-filter: blur(4px);
        }

        .overlay-badge i {
          font-size: 1.25rem;
          margin-right: 0.5rem;
        }

        .info-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .info-column {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          color: #374151;
        }

        .info-item i {
          color: #ea580c;
          font-size: 1.25rem;
          margin-right: 0.75rem;
        }

        .days-left {
          margin-left: 0.5rem;
          color: #ca8a04;
          font-weight: 600;
        }

        .sidebar {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          padding: 1.5rem;
          position: sticky;
          top: 1.5rem;
        }

        .sidebar-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .btn {
          width: 100%;
          padding: 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 1rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(to right, #ea580c, #c2410c);
          color: white;
        }

        .btn-primary:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: scale(1.05);
        }

        .btn-disabled {
          background-color: #9ca3af;
          color: white;
          cursor: not-allowed;
        }

        .btn i {
          font-size: 1.5rem;
          margin-right: 0.75rem;
        }

        .tabs-container {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .tabs-header {
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          flex-wrap: wrap;
        }

        .tab-button {
          flex: 1;
          min-width: max-content;
          padding: 1rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          background-color: white;
          color: #4b5563;
        }

        .tab-button:hover {
          background-color: #f9fafb;
        }

        .tab-button.active {
          background-color: #ea580c;
          color: white;
          border-bottom: 4px solid #c2410c;
        }

        .tab-button i {
          font-size: 1.25rem;
          margin-right: 0.5rem;
        }

        .tab-content {
          padding: 2rem;
        }

        .content-box {
          background-color: #f9fafb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .content-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .content-text {
          color: #374151;
          line-height: 1.75;
        }

        .info-box {
          background-color: #f9fafb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .info-box-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-list li {
          color: #374151;
        }

        .requirements-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .requirement-item {
          display: flex;
          align-items: flex-start;
          background-color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .requirement-item i {
          color: #22c55e;
          font-size: 1.5rem;
          margin-right: 1rem;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .requirement-item span {
          color: #374151;
        }

        .benefits-grid {
          display: grid;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .benefits-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          background-color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .benefit-item i {
          color: #eab308;
          font-size: 1.5rem;
          margin-right: 1rem;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }

        .benefit-item span {
          color: #374151;
        }

        .similar-section {
          margin-top: 3rem;
        }

        .similar-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 2rem;
        }

        .card {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.3s;
        }

        .card:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transform: translateY(-0.5rem);
        }

        .card-header {
          background: linear-gradient(to right, #ea580c, #c2410c);
          padding: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .card-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-badge-type {
          background-color: #f97316;
          color: white;
        }

        .card-badge-expired {
          background-color: #4b5563;
          color: white;
        }

        .card-badge-country {
          background-color: white;
          color: #ea580c;
        }

        .card-body {
          padding: 1.5rem;
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .card-description {
          color: #4b5563;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .card-deadline {
          display: flex;
          align-items: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .card-deadline i {
          margin-right: 0.5rem;
        }

        .card-btn {
          width: 100%;
          padding: 0.5rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
        }

        .card-btn-active {
          background-color: #ea580c;
          color: white;
        }

        .card-btn-active:hover {
          background-color: #c2410c;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .card-btn-expired {
          background-color: #4b5563;
          color: white;
        }

        .card-btn-expired:hover {
          background-color: #374151;
        }
      `}</style>

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
                      {bourse.type}
                    </span>
                    <span className="badge badge-type">
                      {bourse.country}
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
                        Programme Doctoral
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-grid">
                    <div className="info-column">
                      <div className="info-item">
                        <i className="ph ph-building"></i>
                        <span><strong>Université :</strong> {bourse.university}</span>
                      </div>
                      <div className="info-item">
                        <i className="ph ph-calendar"></i>
                        <span><strong>Publié :</strong> {bourse.published}</span>
                      </div>
                      <div className="info-item">
                        <i className="ph ph-clock"></i>
                        <span><strong>Limite :</strong> {bourse.deadline}</span>
                        {!isExpired && daysLeft > 0 && (
                          <span className="days-left">({daysLeft} jours restants)</span>
                        )}
                      </div>
                    </div>
                    <div className="info-column">
                      <div className="info-item">
                        <i className="ph ph-timer"></i>
                        <span><strong>Durée :</strong> {bourse.duration}</span>
                      </div>
                      <div className="info-item">
                        <i className="ph ph-currency-circle-dollar"></i>
                        <span><strong>Montant :</strong> {bourse.amount}</span>
                      </div>
                      <div className="info-item">
                        <i className="ph ph-translate"></i>
                        <span><strong>Langues :</strong> {bourse.language}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg-col-span-1">
                  <div className="sidebar">
                    <h5 className="sidebar-title">Actions</h5>
                    {!isExpired ? (
                      <button className="btn btn-primary">
                        <i className="ph ph-paper-plane-tilt"></i>
                        Postuler maintenant
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
                        <p className="content-text">{bourse.description}</p>
                      </div>
                    </div>
                    <div className="lg-col-span-1">
                      <div className="info-box">
                        <h5 className="info-box-title">Informations clés</h5>
                        <ul className="info-list">
                          <li><strong>Type :</strong> {bourse.type}</li>
                          <li><strong>Pays :</strong> {bourse.country}</li>
                          <li><strong>Durée :</strong> {bourse.duration}</li>
                          <li><strong>Montant :</strong> {bourse.amount}</li>
                          <li><strong>Langues :</strong> {bourse.language}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="content-box">
                    <h4 className="content-title">Exigences de candidature</h4>
                    <div className="requirements-list">
                      {bourse.requirements.map((req, index) => (
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
                      {bourse.benefits.map((benefit, index) => (
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

            {/* Bourses similaires */}
            <div className="similar-section">
              <h3 className="similar-title">Bourses similaires</h3>
              <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
                {boursesSimiliaires.map((item) => (
                  <div key={item.id} className="card">
                    <div className="card-header">
                      <span className={`card-badge ${item.status === 'past' ? 'card-badge-expired' : 'card-badge-type'}`}>
                        {item.type}
                      </span>
                      <span className="card-badge card-badge-country">
                        {item.country}
                      </span>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-description">{item.description}</p>
                      <div className="card-deadline">
                        <i className="ph ph-clock"></i>
                        <span>{item.status === 'past' ? 'Expirée: ' : 'Limite: '}{item.deadline}</span>
                      </div>
                      <button className={`card-btn ${item.status === 'past' ? 'card-btn-expired' : 'card-btn-active'}`}>
                        Voir détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BourseDetailsComponent;