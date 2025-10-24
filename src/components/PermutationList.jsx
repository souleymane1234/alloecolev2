import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, User, MessageCircle, Phone, Mail, Eye, Heart, Share2 } from 'lucide-react';
import ContactAlloEcoleService from './ContactAlloEcoleService';

const PermutationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPermutation, setSelectedPermutation] = useState(null);

  const permutations = [
    {
      id: 1,
      user: {
        nom: "Kouassi",
        prenom: "Jean",
        ville: "Abidjan",
        avatar: "/assets/images/placeholder-avatar.jpg"
      },
      niveau: "BTS 1",
      filiere: "Génie Informatique",
      etablissementActuel: "Grande école ASTC",
      villeActuelle: "Abidjan",
      etablissementSouhaite: "Université de Amérique",
      villeSouhaitee: "Abidjan",
      anneeAcademique: "2024-2025",
      dateCreation: "2024-01-15",
      status: "En cours",
      motif: "Rapprochement familial et meilleure qualité d'enseignement",
      contactPrefere: "whatsapp",
      telephone: "+225 07 12 34 56 78",
      email: "jean.kouassi@email.com",
      vues: 45,
      likes: 12,
      correspondances: 3
    },
    {
      id: 2,
      user: {
        nom: "Traoré",
        prenom: "Fatou",
        ville: "Bouaké",
        avatar: "/assets/images/placeholder-avatar.jpg"
      },
      niveau: "Master 1",
      filiere: "Commerce",
      etablissementActuel: "Université Félix Houphouët Boigny",
      villeActuelle: "Abidjan",
      etablissementSouhaite: "Université de Strasbourg",
      villeSouhaitee: "Strasbourg, France",
      anneeAcademique: "2024-2025",
      dateCreation: "2024-01-12",
      status: "En cours",
      motif: "Poursuite d'études à l'étranger pour spécialisation",
      contactPrefere: "email",
      telephone: "+225 05 98 76 54 32",
      email: "fatou.traore@email.com",
      vues: 78,
      likes: 23,
      correspondances: 1
    },
    {
      id: 3,
      user: {
        nom: "Koné",
        prenom: "Moussa",
        ville: "Yamoussoukro",
        avatar: "/assets/images/placeholder-avatar.jpg"
      },
      niveau: "Licence 3",
      filiere: "Génie Civil",
      etablissementActuel: "LEGACY INSTITUT",
      villeActuelle: "Abidjan",
      etablissementSouhaite: "Campus France",
      villeSouhaitee: "Paris, France",
      anneeAcademique: "2024-2025",
      dateCreation: "2024-01-10",
      status: "En cours",
      motif: "Études à l'étranger pour master spécialisé",
      contactPrefere: "telephone",
      telephone: "+225 01 23 45 67 89",
      email: "moussa.kone@email.com",
      vues: 92,
      likes: 18,
      correspondances: 2
    },
    {
      id: 4,
      user: {
        nom: "Diabaté",
        prenom: "Aminata",
        ville: "San-Pédro",
        avatar: "/assets/images/placeholder-avatar.jpg"
      },
      niveau: "BTS 2",
      filiere: "Comptabilité",
      etablissementActuel: "Institut Supérieur de Gestion",
      villeActuelle: "Abidjan",
      etablissementSouhaite: "École Supérieure de Commerce",
      villeSouhaitee: "Abidjan",
      anneeAcademique: "2024-2025",
      dateCreation: "2024-01-08",
      status: "En cours",
      motif: "Meilleure formation et opportunités professionnelles",
      contactPrefere: "whatsapp",
      telephone: "+225 06 78 90 12 34",
      email: "aminata.diabate@email.com",
      vues: 34,
      likes: 8,
      correspondances: 0
    },
    {
      id: 5,
      user: {
        nom: "Ouattara",
        prenom: "Ibrahim",
        ville: "Korhogo",
        avatar: "/assets/images/placeholder-avatar.jpg"
      },
      niveau: "Master 2",
      filiere: "Droit",
      etablissementActuel: "Université Alassane Ouattara",
      villeActuelle: "Bouaké",
      etablissementSouhaite: "Université de Cocody",
      villeSouhaitee: "Abidjan",
      anneeAcademique: "2024-2025",
      dateCreation: "2024-01-05",
      status: "En cours",
      motif: "Spécialisation en droit des affaires",
      contactPrefere: "email",
      telephone: "+225 04 56 78 90 12",
      email: "ibrahim.ouattara@email.com",
      vues: 67,
      likes: 15,
      correspondances: 1
    }
  ];

  const filteredPermutations = permutations.filter(permutation => {
    const matchesSearch = 
      permutation.niveau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permutation.filiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permutation.etablissementActuel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permutation.etablissementSouhaite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permutation.villeActuelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permutation.villeSouhaitee.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || permutation.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const sortedPermutations = [...filteredPermutations].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.dateCreation) - new Date(a.dateCreation);
      case 'vues':
        return b.vues - a.vues;
      case 'likes':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const handleContact = (permutation) => {
    setSelectedPermutation(permutation);
    setShowContactModal(true);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setSelectedPermutation(null);
  };

  const handleLike = (permutationId) => {
    // Logique de like
    console.log('Like permutation:', permutationId);
  };

  const handleShare = (permutationId) => {
    // Logique de partage
    console.log('Share permutation:', permutationId);
  };

  return (
    <>
      <style jsx>{`
        .permutation-list-section {
          padding: 4rem 0;
          background: #f8fafc;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .filters-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .filters-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #f97316;
        }

        .sort-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .sort-select:focus {
          outline: none;
          border-color: #f97316;
        }

        .permutations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }

        .permutation-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
          border-left: 4px solid #f97316;
        }

        .permutation-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.25rem;
        }

        .user-details h3 {
          font-size: 1.125rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .user-location {
          display: flex;
          align-items: center;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          background: #dcfce7;
          color: #166534;
        }

        .permutation-path {
          margin-bottom: 1.5rem;
        }

        .path-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .path-dot {
          width: 12px;
          height: 12px;
          background: #f97316;
          border-radius: 50%;
          margin-top: 0.5rem;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .path-content {
          flex: 1;
        }

        .path-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }

        .path-value {
          font-weight: 600;
          color: #1f2937;
        }

        .path-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.5rem 0;
          color: #f97316;
        }

        .permutation-details {
          margin-bottom: 1.5rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .detail-label {
          color: #6b7280;
        }

        .detail-value {
          color: #1f2937;
          font-weight: 500;
        }

        .motif-section {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .motif-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .motif-text {
          color: #374151;
          line-height: 1.5;
        }

        .card-actions {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .action-button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .contact-button {
          background: #f97316;
          color: white;
        }

        .contact-button:hover {
          background: #ea580c;
        }

        .like-button {
          background: #f3f4f6;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .like-button:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        .share-button {
          background: #f3f4f6;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .share-button:hover {
          background: #dbeafe;
          color: #2563eb;
        }

        .card-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .correspondances-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .no-results-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          color: #d1d5db;
        }

        @media (max-width: 768px) {
          .filters-row {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .permutations-grid {
            grid-template-columns: 1fr;
          }

          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <section className="permutation-list-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Quelques de Permutation</h2>
            <p className="section-subtitle">
              Consultez les demandes de permutation et trouvez des correspondances pour faciliter votre changement d'établissement
            </p>
          </div>

          <div className="filters-section">
            <div className="filters-row">
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par niveau, filière, établissement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Acceptée">Acceptée</option>
                <option value="Refusée">Refusée</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Plus récent</option>
                <option value="vues">Plus vues</option>
                <option value="likes">Plus aimées</option>
              </select>
            </div>
          </div>

          {sortedPermutations.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">
                <Search size={64} />
              </div>
              <h3>Aucune demande trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="permutations-grid">
              {sortedPermutations.map((permutation) => (
                <div key={permutation.id} className="permutation-card">
                  <div className="card-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        {permutation.user.prenom[0]}{permutation.user.nom[0]}
                      </div>
                      <div className="user-details">
                        <h3>{permutation.user.prenom} {permutation.user.nom}</h3>
                        <div className="user-location">
                          <MapPin size={16} />
                          {permutation.user.ville}
                        </div>
                      </div>
                    </div>
                    <div className="status-badge">{permutation.status}</div>
                  </div>

                  <div className="permutation-path">
                    <div className="path-item">
                      <div className="path-dot"></div>
                      <div className="path-content">
                        <div className="path-label">Établissement actuel</div>
                        <div className="path-value">{permutation.etablissementActuel}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          {permutation.villeActuelle}
                        </div>
                      </div>
                    </div>
                    
                    <div className="path-arrow">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                    
                    <div className="path-item">
                      <div className="path-dot"></div>
                      <div className="path-content">
                        <div className="path-label">Établissement souhaité</div>
                        <div className="path-value">{permutation.etablissementSouhaite}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          {permutation.villeSouhaitee}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="permutation-details">
                    <div className="detail-row">
                      <span className="detail-label">Niveau:</span>
                      <span className="detail-value">{permutation.niveau}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Filière:</span>
                      <span className="detail-value">{permutation.filiere}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Année académique:</span>
                      <span className="detail-value">{permutation.anneeAcademique}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date de création:</span>
                      <span className="detail-value">
                        {new Date(permutation.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div className="motif-section">
                    <div className="motif-label">Motif de la permutation:</div>
                    <div className="motif-text">{permutation.motif}</div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="action-button contact-button"
                      // onClick={() => handleContact(permutation)}
                    >
                      <MessageCircle size={16} />
                      Contacter
                    </button>
                    {/* <button
                      className="action-button like-button"
                      onClick={() => handleLike(permutation.id)}
                    >
                      <Heart size={16} />
                      {permutation.likes}
                    </button>
                    <button
                      className="action-button share-button"
                      onClick={() => handleShare(permutation.id)}
                    >
                      <Share2 size={16} />
                      Partager
                    </button> */}
                  </div>

                  <div className="card-stats">
                    <div className="stat-item">
                      <Eye size={16} />
                      {permutation.vues} vues
                    </div>
                    <div className="stat-item">
                      <span className="correspondances-badge">
                        {permutation.correspondances} correspondance{permutation.correspondances > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de contact */}
      {showContactModal && (
        <ContactAlloEcoleService
          permutationId={selectedPermutation?.id}
          onClose={handleCloseContactModal}
        />
      )}
    </>
  );
};

export default PermutationList;
