'use client';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MonProfil = () => {
  const [activeTab, setActiveTab] = useState('informations');

  // Données utilisateur (en réalité, ces données viendraient d'une API)
  const userData = {
    nom: 'Albert',
    prenom: 'Kala',
    email: 'albert.kala@email.com',
    telephone: '+225 07 00 00 00 00',
    dateNaissance: '2000-01-01',
    nationalite: 'Ivoirienne',
    adresse: '493 Rue de Brazzaville, Abidjan-marcory',
    photo: '/images/poster/albert.jpg'
  };

  const dossiers = [
    {
      id: 1,
      type: 'Études à l\'étranger',
      pays: 'Canada',
      universite: 'Université de Toronto',
      programme: 'Master en Informatique',
      dateCreation: '2024-01-15',
      statut: 'En cours de traitement',
      priorite: 'Haute',
      derniereMiseAJour: '2024-01-20',
      documents: 5,
      etape: 'Évaluation des documents'
    },
    {
      id: 2,
      type: 'Bourse d\'étude',
      pays: 'France',
      universite: 'Sorbonne Université',
      programme: 'Master en Littérature',
      dateCreation: '2024-01-10',
      statut: 'Approuvé',
      priorite: 'Moyenne',
      derniereMiseAJour: '2024-01-18',
      documents: 3,
      etape: 'Prêt pour inscription'
    }
  ];

  const demandesBourses = [
    {
      id: 1,
      titre: 'Bourse d\'excellence Eiffel 2024-2025',
      universite: 'Sorbonne Université',
      montant: '1 181€/mois',
      dateDemande: '2024-01-10',
      statut: 'En cours',
      echeance: '2024-03-15'
    },
    {
      id: 2,
      titre: 'Bourse Chevening 2024-2025',
      universite: 'University of Cambridge',
      montant: '£18,000/an',
      dateDemande: '2024-01-05',
      statut: 'Approuvée',
      echeance: '2024-02-28'
    }
  ];

  const demandesPermutation = [
    {
      id: 1,
      niveau: 'BTS 1',
      filiere: 'Génie Informatique',
      etablissementActuel: 'Grande école ASTC',
      villeActuelle: 'Abidjan',
      etablissementSouhaite: 'Université de Amérique',
      villeSouhaitee: 'Abidjan',
      anneeAcademique: '2024-2025',
      dateCreation: '2024-01-15',
      statut: 'En cours',
      motif: 'Rapprochement familial et meilleure qualité d\'enseignement',
      vues: 45,
      correspondances: 3
    },
    {
      id: 2,
      niveau: 'Master 1',
      filiere: 'Commerce',
      etablissementActuel: 'Université Félix Houphouët Boigny',
      villeActuelle: 'Abidjan',
      etablissementSouhaite: 'Université de Strasbourg',
      villeSouhaitee: 'Strasbourg, France',
      anneeAcademique: '2024-2025',
      dateCreation: '2024-01-12',
      statut: 'En cours',
      motif: 'Poursuite d\'études à l\'étranger pour spécialisation',
      vues: 78,
      correspondances: 1
    }
  ];

  const tabs = [
    { id: 'informations', label: 'Mes informations', icon: 'ph-user' },
    { id: 'dossiers', label: 'Mes dossiers', icon: 'ph-folder' },
    { id: 'bourses', label: 'Demandes de bourses', icon: 'ph-graduation-cap' },
    { id: 'permutations', label: 'Mes permutations', icon: 'ph-arrows-clockwise' },
    { id: 'documents', label: 'Mes documents', icon: 'ph-file-text' },
    { id: 'parametres', label: 'Paramètres', icon: 'ph-gear' }
  ];

  const getStatutBadge = (statut) => {
    const badges = {
      'En cours de traitement': 'badge-warning',
      'Approuvé': 'badge-success',
      'En attente': 'badge-info',
      'Rejeté': 'badge-danger',
      'En cours': 'badge-warning',
      'Approuvée': 'badge-success'
    };
    return badges[statut] || 'badge-secondary';
  };

  const getStatutIcon = (statut) => {
    const icons = {
      'En cours de traitement': 'ph-clock',
      'Approuvé': 'ph-check-circle',
      'En attente': 'ph-hourglass',
      'Rejeté': 'ph-x-circle',
      'En cours': 'ph-clock',
      'Approuvée': 'ph-check-circle'
    };
    return icons[statut] || 'ph-question';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informations':
        return (
          <div className="tab-content-wrapper">
            <div className="profile-row">
              <div className="profile-col-left">
                <div className="profile-card">
                  <div className="profile-avatar">
                    <img src={userData.photo} alt="Photo de profil" />
                    <button className="btn-avatar-edit">
                      <i className="ph-camera icon-margin-right"></i>
                    </button>
                  </div>
                  <div className="profile-info">
                    <h4>{userData.prenom} {userData.nom}</h4>
                    <p className="text-muted">{userData.email}</p>
                    <div className="profile-stats">
                      <div className="stat-item">
                        <span className="stat-number">{dossiers.length}</span>
                        <span className="stat-label">Dossiers</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{demandesBourses.length}</span>
                        <span className="stat-label">Bourses</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{demandesPermutation.length}</span>
                        <span className="stat-label">Permutations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-col-right">
                <div className="info-card">
                  <h5 className="card-title">Informations personnelles</h5>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">Nom</label>
                      <input type="text" className="form-control" value={userData.nom} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Prénom</label>
                      <input type="text" className="form-control" value={userData.prenom} readOnly />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={userData.email} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Téléphone</label>
                      <input type="tel" className="form-control" value={userData.telephone} readOnly />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">Date de naissance</label>
                      <input type="date" className="form-control" value={userData.dateNaissance} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Nationalité</label>
                      <input type="text" className="form-control" value={userData.nationalite} readOnly />
                    </div>
                  </div>
                  <div className="form-group-full">
                    <label className="form-label">Adresse</label>
                    <textarea className="form-control" rows="2" value={userData.adresse} readOnly />
                  </div>
                  <button className="btn-orange">
                    <i className="ph-pencil icon-margin-right"></i>
                    Modifier mes informations
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'dossiers':
        return (
          <div className="tab-content-wrapper">
            <div className="header-section">
              <h5>Mes dossiers d'études</h5>
              <Link to="/etudes-etranger" className="btn-orange">
                <i className="ph-plus icon-margin-right"></i>
                Nouveau dossier
              </Link>
            </div>
            <div className="cards-grid">
              {dossiers.map(dossier => (
                <div key={dossier.id} className="grid-col">
                  <div className="dossier-card">
                    <div className="dossier-header">
                      <div className="dossier-type">
                        <i className="ph-graduation-cap icon-margin-right"></i>
                        {dossier.type}
                      </div>
                      <div className="dossier-actions">
                        <button className="btn-icon-outline">
                          <i className="ph-eye"></i>
                        </button>
                        <button className="btn-icon-secondary">
                          <i className="ph-download"></i>
                        </button>
                      </div>
                    </div>
                    <div className="dossier-content">
                      <h6 className="dossier-title">{dossier.universite}</h6>
                      <p className="dossier-programme">{dossier.programme}</p>
                      <p className="dossier-pays">
                        <i className="ph-map-pin icon-margin-right"></i>
                        {dossier.pays}
                      </p>
                      <div className="dossier-meta">
                        <div className="meta-item">
                          <i className="ph-calendar icon-margin-right"></i>
                          <span>Créé le {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="meta-item">
                          <i className="ph-file icon-margin-right"></i>
                          <span>{dossier.documents} document(s)</span>
                        </div>
                      </div>
                    </div>
                    <div className="dossier-footer">
                      <div className="dossier-status">
                        <span className={`badge ${getStatutBadge(dossier.statut)}`}>
                          <i className={`${getStatutIcon(dossier.statut)} icon-margin-right-small`}></i>
                          {dossier.statut}
                        </span>
                        <span className={`badge ${dossier.priorite === 'Haute' ? 'badge-danger' : dossier.priorite === 'Moyenne' ? 'badge-warning' : 'badge-success'}`}>
                          {dossier.priorite}
                        </span>
                      </div>
                      <div className="dossier-etape">
                        <small className="text-muted">{dossier.etape}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'bourses':
        return (
          <div className="tab-content-wrapper">
            <div className="header-section">
              <h5>Mes demandes de bourses</h5>
              <Link to="/course" className="btn-orange">
                <i className="ph-plus icon-margin-right"></i>
                Nouvelle demande
              </Link>
            </div>
            <div className="cards-grid">
              {demandesBourses.map(demande => (
                <div key={demande.id} className="grid-col">
                  <div className="bourse-card">
                    <div className="bourse-header">
                      <div className="bourse-title">
                        <h6>{demande.titre}</h6>
                        <p className="bourse-universite">{demande.universite}</p>
                      </div>
                      <div className="bourse-montant">
                        <span className="montant">{demande.montant}</span>
                      </div>
                    </div>
                    <div className="bourse-content">
                      <div className="bourse-meta">
                        <div className="meta-item">
                          <i className="ph-calendar icon-margin-right"></i>
                          <span>Demandée le {new Date(demande.dateDemande).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="meta-item">
                          <i className="ph-clock icon-margin-right"></i>
                          <span>Échéance: {new Date(demande.echeance).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bourse-footer">
                      <div className="bourse-status">
                        <span className={`badge ${getStatutBadge(demande.statut)}`}>
                          <i className={`${getStatutIcon(demande.statut)} icon-margin-right-small`}></i>
                          {demande.statut}
                        </span>
                      </div>
                      <div className="bourse-actions">
                        <button className="btn-sm-outline">
                          <i className="ph-eye icon-margin-right-small"></i>
                          Voir
                        </button>
                        <button className="btn-sm-secondary">
                          <i className="ph-download icon-margin-right-small"></i>
                          PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'permutations':
        return (
          <div className="tab-content-wrapper">
            <div className="header-section">
              <h5>Mes demandes de permutation</h5>
              <Link to="/permutations" className="btn-orange">
                <i className="ph-plus icon-margin-right"></i>
                Nouvelle demande
              </Link>
            </div>
            <div className="cards-grid">
              {demandesPermutation.map(demande => (
                <div key={demande.id} className="grid-col">
                  <div className="permutation-card">
                    <div className="permutation-header">
                      <div className="permutation-info">
                        <h6 className="permutation-niveau">{demande.niveau}</h6>
                        <p className="permutation-filiere">{demande.filiere}</p>
                      </div>
                      <div className="permutation-status">
                        <span className={`badge ${getStatutBadge(demande.statut)}`}>
                          <i className={`${getStatutIcon(demande.statut)} icon-margin-right-small`}></i>
                          {demande.statut}
                        </span>
                      </div>
                    </div>
                    <div className="permutation-path">
                      <div className="path-item">
                        <div className="path-dot"></div>
                        <div className="path-content">
                          <div className="path-label">Établissement actuel</div>
                          <div className="path-value">{demande.etablissementActuel}</div>
                          <div className="path-location">{demande.villeActuelle}</div>
                        </div>
                      </div>
                      <div className="path-arrow">
                        <i className="ph-arrow-right"></i>
                      </div>
                      <div className="path-item">
                        <div className="path-dot"></div>
                        <div className="path-content">
                          <div className="path-label">Établissement souhaité</div>
                          <div className="path-value">{demande.etablissementSouhaite}</div>
                          <div className="path-location">{demande.villeSouhaitee}</div>
                        </div>
                      </div>
                    </div>
                    <div className="permutation-meta">
                      <div className="meta-item">
                        <i className="ph-calendar icon-margin-right"></i>
                        <span>Créée le {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="meta-item">
                        <i className="ph-eye icon-margin-right"></i>
                        <span>{demande.vues} vues</span>
                      </div>
                      <div className="meta-item">
                        <i className="ph-users icon-margin-right"></i>
                        <span>{demande.correspondances} correspondance{demande.correspondances > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="permutation-motif">
                      <strong>Motif:</strong> {demande.motif}
                    </div>
                    <div className="permutation-actions">
                      <button className="btn-sm-outline">
                        <i className="ph-eye icon-margin-right-small"></i>
                        Voir détails
                      </button>
                      <button className="btn-sm-secondary">
                        <i className="ph-pencil icon-margin-right-small"></i>
                        Modifier
                      </button>
                      <button className="btn-sm-danger">
                        <i className="ph-trash icon-margin-right-small"></i>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {demandesPermutation.length === 0 && (
              <div className="empty-state">
                <i className="ph-arrows-clockwise display-4 text-muted icon-margin-bottom"></i>
                <h5>Aucune demande de permutation</h5>
                <p className="text-muted">Vous n'avez pas encore fait de demande de permutation.</p>
                <Link to="/permutations" className="btn-orange">
                  <i className="ph-plus icon-margin-right"></i>
                  Faire une demande
                </Link>
              </div>
            )}
          </div>
        );

      case 'documents':
        return (
          <div className="tab-content-wrapper">
            <h5 className="section-title">Mes documents</h5>
            <div className="cards-grid-three">
              <div className="document-card">
                <div className="document-icon">
                  <i className="ph-file-text"></i>
                </div>
                <div className="document-info">
                  <h6>CV</h6>
                  <p className="text-muted">cv_marie_dupont.pdf</p>
                  <div className="document-actions">
                    <button className="btn-sm-outline">
                      <i className="ph-eye icon-margin-right-small"></i>
                      Voir
                    </button>
                    <button className="btn-sm-secondary">
                      <i className="ph-download icon-margin-right-small"></i>
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
              <div className="document-card">
                <div className="document-icon">
                  <i className="ph-file-text"></i>
                </div>
                <div className="document-info">
                  <h6>Lettre de motivation</h6>
                  <p className="text-muted">lettre_motivation.pdf</p>
                  <div className="document-actions">
                    <button className="btn-sm-outline">
                      <i className="ph-eye icon-margin-right-small"></i>
                      Voir
                    </button>
                    <button className="btn-sm-secondary">
                      <i className="ph-download icon-margin-right-small"></i>
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
              <div className="document-card">
                <div className="document-icon">
                  <i className="ph-file-text"></i>
                </div>
                <div className="document-info">
                  <h6>Relevés de notes</h6>
                  <p className="text-muted">releves_notes.pdf</p>
                  <div className="document-actions">
                    <button className="btn-sm-outline">
                      <i className="ph-eye icon-margin-right-small"></i>
                      Voir
                    </button>
                    <button className="btn-sm-secondary">
                      <i className="ph-download icon-margin-right-small"></i>
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="upload-section">
              <h6>Ajouter un nouveau document</h6>
              <div className="upload-area">
                <i className="ph-cloud-arrow-up display-4 text-muted icon-margin-bottom"></i>
                <p>Glissez-déposez vos fichiers ici ou cliquez pour sélectionner</p>
                <input type="file" className="form-control" multiple accept=".pdf" />
              </div>
            </div>
          </div>
        );

      case 'parametres':
        return (
          <div className="tab-content-wrapper">
            <h5 className="section-title">Paramètres du compte</h5>
            <div className="settings-row">
              <div className="settings-col">
                <div className="settings-card">
                  <h6>Changer le mot de passe</h6>
                  <div className="form-group">
                    <label className="form-label">Mot de passe actuel</label>
                    <input type="password" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input type="password" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirmer le mot de passe</label>
                    <input type="password" className="form-control" />
                  </div>
                  <button className="btn-orange">Changer le mot de passe</button>
                </div>
              </div>
              <div className="settings-col">
                <div className="settings-card">
                  <h6>Notifications</h6>
                  <div className="form-check-group">
                    <input className="form-check-input" type="checkbox" id="email-notifications" defaultChecked />
                    <label className="form-check-label" htmlFor="email-notifications">
                      Notifications par email
                    </label>
                  </div>
                  <div className="form-check-group">
                    <input className="form-check-input" type="checkbox" id="sms-notifications" />
                    <label className="form-check-label" htmlFor="sms-notifications">
                      Notifications par SMS
                    </label>
                  </div>
                  <div className="form-check-group">
                    <input className="form-check-input" type="checkbox" id="bourse-updates" defaultChecked />
                    <label className="form-check-label" htmlFor="bourse-updates">
                      Mises à jour des bourses
                    </label>
                  </div>
                  <button className="btn-orange">Sauvegarder</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        /* Reset et base */
        * {
          box-sizing: border-box;
        }

        /* Variables CSS */
        :root {
          --orange-primary: #f97316;
          --orange-hover: #ea580c;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-700: #374151;
          --gray-900: #1f2937;
          --blue-500: #3b82f6;
          --green-500: #22c55e;
          --yellow-500: #eab308;
          --red-500: #ef4444;
          --white: #ffffff;
        }

        /* Section principale */
        .mon-profil-section {
          padding: 3rem 0;
          background-color: var(--gray-50);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -0.5rem;
        }

        .col-lg-3 {
          flex: 0 0 25%;
          max-width: 25%;
          padding: 0 0.5rem;
        }

        .col-lg-9 {
          flex: 0 0 75%;
          max-width: 75%;
          padding: 0 0.5rem;
        }

        /* Sidebar */
        .profile-sidebar {
          background: var(--white);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 1rem;
        }

        .profile-summary {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          background-color: red;
        }

        .profile-avatar-small {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 1rem;
          border: 3px solid var(--orange-primary);
        }

        .profile-avatar-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info-small {
          text-align: center;
        }

        .profile-info-small h5 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 0.25rem 0;
        }

        .profile-info-small p {
          font-size: 0.875rem;
          margin: 0;
        }

        .profile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-radius: 0.5rem;
          color: var(--gray-700);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }

        .nav-item:hover {
          background: var(--gray-100);
          color: var(--orange-primary);
        }

        .nav-item.active {
          background: rgba(249, 115, 22, 0.1);
          color: var(--orange-primary);
        }

        .nav-item i {
          font-size: 1.25rem;
        }

        /* Contenu principal */
        .profile-content {
          background: var(--white);
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .tab-content-wrapper {
          width: 100%;
        }

        /* Layout en grille */
        .profile-row {
          display: flex;
          gap: 1.5rem;
        }

        .profile-col-left {
          flex: 0 0 calc(33.333% - 1rem);
        }

        .profile-col-right {
          flex: 0 0 calc(66.667% - 0.5rem);
        }

        /* Carte de profil */
        .profile-card {
          background: var(--white);
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .profile-avatar {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid var(--orange-primary);
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btn-avatar-edit {
          position: absolute;
          bottom: 0;
          right: 0;
          background: var(--orange-primary);
          color: var(--white);
          border: 2px solid var(--white);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-avatar-edit:hover {
          background: var(--orange-hover);
        }

        .profile-info h4 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 0.5rem 0;
        }

        .profile-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--gray-200);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--orange-primary);
        }

        .stat-label {
          font-size: 0.5rem;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Carte d'informations */
        .info-card {
          background: var(--white);
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 1.5rem 0;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-col {
          flex: 1;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group-full {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gray-700);
          margin-bottom: 0.5rem;
        }

        .form-control {
          width: 100%;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          border: 1px solid var(--gray-300);
          border-radius: 0.5rem;
          background: var(--gray-50);
          color: var(--gray-700);
          transition: all 0.2s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: var(--orange-primary);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        textarea.form-control {
          resize: vertical;
        }

        /* Boutons */
        .btn-orange {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.625rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--white);
          background: var(--orange-primary);
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-orange:hover {
          background: var(--orange-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
        }

        .btn-icon-outline,
        .btn-sm-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--orange-primary);
          background: transparent;
          border: 1px solid var(--orange-primary);
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-icon-outline {
          padding: 0.5rem;
        }

        .btn-icon-outline:hover,
        .btn-sm-outline:hover {
          background: var(--orange-primary);
          color: var(--white);
        }

        .btn-icon-secondary,
        .btn-sm-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gray-700);
          background: transparent;
          border: 1px solid var(--gray-300);
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-icon-secondary {
          padding: 0.5rem;
        }

        .btn-icon-secondary:hover,
        .btn-sm-secondary:hover {
          background: var(--gray-100);
        }

        .btn-sm-danger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--red-500);
          background: transparent;
          border: 1px solid var(--red-500);
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-sm-danger:hover {
          background: var(--red-500);
          color: var(--white);
        }

        /* Header section */
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .header-section h5 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 1.5rem 0;
        }

        /* Grilles de cartes */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .cards-grid-three {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .grid-col {
          width: 100%;
        }

        /* Carte de dossier */
        .dossier-card {
          background: var(--white);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-left: 4px solid var(--orange-primary);
          transition: all 0.3s ease;
        }

        .dossier-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .dossier-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .dossier-type {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--orange-primary);
        }

        .dossier-actions {
          display: flex;
          gap: 0.5rem;
        }

        .dossier-content {
          margin-bottom: 1rem;
        }

        .dossier-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 0.5rem 0;
        }

        .dossier-programme {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0 0 0.75rem 0;
        }

        .dossier-pays {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: var(--gray-500);
          margin: 0 0 1rem 0;
        }

        .dossier-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dossier-footer {
          border-top: 1px solid var(--gray-200);
          padding-top: 1rem;
        }

        .dossier-status {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .dossier-etape small {
          font-size: 0.75rem;
        }

        /* Carte de bourse */
        .bourse-card {
          background: var(--white);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-left: 4px solid var(--orange-primary);
          transition: all 0.3s ease;
        }

        .bourse-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .bourse-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .bourse-title h6 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 0.5rem 0;
        }

        .bourse-universite {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0;
        }

        .bourse-montant {
          text-align: right;
        }

        .montant {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--orange-primary);
        }

        .bourse-content {
          margin-bottom: 1rem;
        }

        .bourse-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .bourse-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--gray-200);
          padding-top: 1rem;
        }

        .bourse-status {
          display: flex;
          gap: 0.5rem;
        }

        .bourse-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* Meta items */
        .meta-item {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        /* Badges */
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .badge-success {
          background: #dcfce7;
          color: #166534;
        }

        .badge-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .badge-info {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge-secondary {
          background: var(--gray-200);
          color: var(--gray-700);
        }

        /* Carte de permutation */
        .permutation-card {
          background: var(--white);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-left: 4px solid var(--orange-primary);
          transition: all 0.3s ease;
        }

        .permutation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .permutation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .permutation-niveau {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--gray-900);
          margin: 0 0 0.25rem 0;
        }

        .permutation-filiere {
          color: var(--gray-600);
          margin: 0;
          font-size: 0.875rem;
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
          background: var(--orange-primary);
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
          color: var(--gray-600);
          margin-bottom: 0.25rem;
        }

        .path-value {
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: 0.25rem;
        }

        .path-location {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .path-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.5rem 0;
          color: var(--orange-primary);
        }

        .permutation-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .permutation-motif {
          background: var(--gray-50);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .permutation-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        /* Carte de document */
        .document-card {
          background: var(--white);
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .document-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .document-icon {
          width: 60px;
          height: 60px;
          background: rgba(249, 115, 22, 0.1);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .document-icon i {
          font-size: 2rem;
          color: var(--orange-primary);
        }

        .document-info h6 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 0.5rem 0;
        }

        .document-info p {
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        .document-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* Section de téléchargement */
        .upload-section {
          background: var(--gray-50);
          border-radius: 0.75rem;
          padding: 2rem;
          border: 2px dashed var(--gray-300);
        }

        .upload-section h6 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 1rem 0;
        }

        .upload-area {
          text-align: center;
          padding: 2rem;
          background: var(--white);
          border-radius: 0.5rem;
        }

        .upload-area i {
          font-size: 3rem;
          color: var(--gray-400);
          margin-bottom: 1rem;
        }

        .upload-area p {
          color: var(--gray-600);
          margin-bottom: 1rem;
        }

        /* Settings */
        .settings-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .settings-col {
          flex: 1;
          min-width: 300px;
        }

        .settings-card {
          background: var(--gray-50);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .settings-card h6 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 1.5rem 0;
        }

        .form-check-group {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .form-check-input {
          width: 1.125rem;
          height: 1.125rem;
          margin-right: 0.75rem;
          cursor: pointer;
          accent-color: var(--orange-primary);
        }

        .form-check-label {
          font-size: 0.875rem;
          color: var(--gray-700);
          cursor: pointer;
        }

        /* État vide */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: var(--gray-50);
          border-radius: 0.75rem;
          border: 2px dashed var(--gray-300);
        }

        .empty-state i {
          font-size: 3rem;
          color: var(--gray-400);
          margin-bottom: 1rem;
        }

        .empty-state h5 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-900);
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          margin: 0 0 1.5rem 0;
        }

        /* Utilitaires */
        .text-muted {
          color: var(--gray-500);
        }

        .display-4 {
          font-size: 3rem;
        }

        .icon-margin-right {
          margin-right: 0.5rem;
        }

        .icon-margin-right-small {
          margin-right: 0.25rem;
        }

        .icon-margin-bottom {
          margin-bottom: 1rem;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .col-lg-3,
          .col-lg-9 {
            flex: 0 0 100%;
            max-width: 100%;
          }

          .profile-sidebar {
            position: static;
            margin-bottom: 1.5rem;
          }

          .profile-col-left,
          .profile-col-right {
            flex: 0 0 100%;
          }

          .cards-grid {
            grid-template-columns: 1fr;
          }

          .cards-grid-three {
            grid-template-columns: 1fr;
          }

          .settings-row {
            flex-direction: column;
          }

          .settings-col {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .mon-profil-section {
            padding: 1.5rem 0;
          }

          .profile-content {
            padding: 1.5rem;
          }

          .profile-sidebar {
            padding: 1rem;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }

          .header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-section .btn-orange {
            width: 100%;
          }

          .permutation-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .permutation-actions {
            flex-direction: column;
          }

          .permutation-actions .btn-sm-outline,
          .permutation-actions .btn-sm-secondary,
          .permutation-actions .btn-sm-danger {
            width: 100%;
          }

          .bourse-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .document-actions {
            flex-direction: column;
          }

          .document-actions .btn-sm-outline,
          .document-actions .btn-sm-secondary {
            width: 100%;
          }
        }
      `}</style>

      <section className="mon-profil-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              {/* Sidebar navigation */}
              <div className="profile-sidebar">
                <div className="profile-summary">
                  <div className="profile-avatar-small">
                    <img src={userData.photo} alt="Photo de profil" />
                  </div>
                  <div className="profile-info-small">
                    <h5>{userData.prenom} {userData.nom}</h5>
                    <p className="text-muted">{userData.email}</p>
                  </div>
                </div>
                <nav className="profile-nav">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={tab.icon}></i>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            <div className="col-lg-9">
              {/* Main content */}
              <div className="profile-content">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MonProfil;