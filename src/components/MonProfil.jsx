import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MonProfil.css';
import data from '../helper/data.json';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const MonProfil = () => {
  const token = localStorage.getItem("access_token");
  const [activeTab, setActiveTab] = useState('informations');
  const [user, setUser] = useState(null);
  const [dossierError, setDossierError] = useState();
  const [dossier, setDossier] = useState();
  const [scholarships, setScholarships] = useState();
  const [idScholarships, setIdScholarships] = useState();
  const [myScholarships, setMyScholarships] = useState();
  // etude 
  const [DossierEtudiant, setDossierEtudiant] = useState();
  const [foreignStudies, setForeignStudies] = useState();
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    country: '',
    academicLevel: '',
    interests: []
  });
  const [showCreateDossier, setShowCreateDossier] = useState(false);
  const [creatingDossier, setCreatingDossier] = useState(false);
  const [dossierForm, setDossierForm] = useState({
    currentLevel: '',
    cvUrl: '',
    // Vous pouvez ajouter d'autres champs si nécessaire
  });

  // États pour la gestion des images
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);

  /** 🔄 Rafraîchir le token d'accès **/
  const getNewAccessToken = async () => {
    const storedRefresh = localStorage.getItem('refresh_token');
    if (!storedRefresh) throw new Error('Aucun refresh token');

    const resp = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefresh })
    });

    if (!resp.ok) throw new Error('Échec du refresh token');
    const data = await resp.json();
    const newAccess = data?.accessToken || data?.data?.accessToken || data?.token;
    if (!newAccess) throw new Error('Réponse refresh invalide');
    localStorage.setItem('access_token', newAccess);
    return newAccess;
  };

  /** 🧩 Requête API avec gestion automatique du token **/
  const apiRequest = async (path, options = {}) => {
    let access = localStorage.getItem('access_token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (access) headers.Authorization = `Bearer ${access}`;

    const doFetch = async () =>
      fetch(`${API_BASE}${path}`, { ...options, headers });

    let response = await doFetch();

    // si token expiré → on rafraîchit
    if (response.status === 401) {
      const newAccess = await getNewAccessToken();
      headers.Authorization = `Bearer ${newAccess}`;
      response = await doFetch();
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erreur HTTP ${response.status}`);
    }

    return response.json();
  };

  /** 📤 Uploader une image */
  const uploadImage = async (file, category = 'profiles') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    let access = localStorage.getItem('access_token');
    const headers = { 
      'Authorization': `Bearer ${access}` 
      // Note: Ne pas mettre 'Content-Type' pour FormData
    };

    const doFetch = async () =>
      fetch(`${API_BASE}/uploads/image`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

    let response = await doFetch();

    // Si token expiré → on rafraîchit
    if (response.status === 401) {
      const newAccess = await getNewAccessToken();
      headers.Authorization = `Bearer ${newAccess}`;
      response = await doFetch();
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erreur upload ${response.status}`);
    }

    const json = await response.json();
    return json?.data?.url || json?.url || json;
  };

  /** 🖼️ Mettre à jour la photo de profil */
  const handleUpdateProfileImage = async (file) => {
    if (!file) return;
    
    setUploadingImage(true);
    try {
      // Uploader l'image
      const imageUrl = await uploadImage(file, 'profiles');
      
      // Mettre à jour le profil avec la nouvelle URL
      const payload = {
        ...form,
        profileImage: imageUrl
      };

      const json = await apiRequest('/profile/student', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      console.log('✅ Photo de profil mise à jour:', json);
      setUser(json?.data ?? json);
      setForm(prev => ({ ...prev, profileImage: imageUrl }));
      
      // Réinitialiser la sélection
      setSelectedProfileImage(null);
      
    } catch (err) {
      console.error('❌ Erreur upload photo:', err.message || err);
      alert('Erreur lors du téléchargement de la photo');
    } finally {
      setUploadingImage(false);
    }
  };

  /** 🖼️ Mettre à jour l'image de couverture */
  const handleUpdateCoverImage = async (file) => {
    if (!file) return;
    
    setUploadingImage(true);
    try {
      // Uploader l'image
      const imageUrl = await uploadImage(file, 'covers');
      
      // Mettre à jour le profil avec la nouvelle URL
      const payload = {
        ...form,
        coverImage: imageUrl
      };

      const json = await apiRequest('/profile/student', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      console.log('✅ Image de couverture mise à jour:', json);
      setUser(json?.data ?? json);
      setForm(prev => ({ ...prev, coverImage: imageUrl }));
      
      // Réinitialiser la sélection
      setSelectedCoverImage(null);
      
    } catch (err) {
      console.error('❌ Erreur upload couverture:', err.message || err);
      alert('Erreur lors du téléchargement de l\'image de couverture');
    } finally {
      setUploadingImage(false);
    }
  };

  /** 📁 Gérer la sélection de photo de profil */
  const handleProfileImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setSelectedProfileImage(file);
      handleUpdateProfileImage(file);
    }
  };

  /** 📁 Gérer la sélection d'image de couverture */
  const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setSelectedCoverImage(file);
      handleUpdateCoverImage(file);
    }
  };

  /** 📦 Charger le profil utilisateur **/
  useEffect(() => {
    if (!token) return;

    const loadUser = async () => {
      setLoading(true);
      try {
        const json = await apiRequest('/profile/student');
        const u = json?.data ?? json;
        setUser(u);
        setForm({
          firstName: u?.firstName || '',
          lastName: u?.lastName || '',
          bio: u?.bio || '',
          dateOfBirth: (u?.dateOfBirth || '').slice(0, 10),
          gender: u?.gender || '',
          nationality: u?.nationality || '',
          address: u?.address || '',
          city: u?.city || '',
          country: u?.country || '',
          academicLevel: u?.academicLevel || '',
          interests: u?.interests || [],
          profileImage: u?.profileImage || '',
          coverImage: u?.coverImage || ''
        });
      } catch (err) {
        console.error('❌ Erreur profil:', err);
      } finally {
        setLoading(false);
      }
    };
    const loadFile = async () => {
      setLoading(true);
      try {
        const json = await apiRequest('/students/scholarships/file');
        const u = json?.data ?? json;
        setDossier(u);
        console.log('✅ Dossier chargé:', u);
      } catch (err) {
        console.error('❌ Erreur dossier:', err);
      } finally {
        setLoading(false);
      }
    };
    const loadFileEtranger = async () => {
      setLoading(true);
      try {
        const json = await apiRequest('/students/foreign-studies/file');
        const u = json?.data ?? json;
        setDossierEtudiant(u);
        console.log('✅ Dossier chargé:', u);
      } catch (err) {
        console.error('❌ Erreur dossier:', err);
      } finally {
        setLoading(false);
      }
    };
    const loadscholarships = async () => {
      setLoading(true);
      try {
        const json = await apiRequest('/students/scholarships/applications/me');
        const u = json?.data ?? json;
        setScholarships(u);
      } catch (err) {
        console.error('❌ Erreur bourse:', err);
      } finally {
        setLoading(false);
      }
    };
    const loadForeignStudies = async () => {
      setLoading(true);
      try {
        const json = await apiRequest('/students/foreign-studies/applications/me');
        const u = json?.data ?? json;
        setForeignStudies(u);
      } catch (err) {
        console.error('❌ Erreur bourse:', err);
      } finally {
        setLoading(false);
      }
    };
    const loadMyScholarships = async () => {
      setLoading(true);
      try {
          const json = await apiRequest('/students/scholarships/' + scholarshipId);
          const u = json?.data ?? json;
          setMyScholarships(u);
          console.log('✅ Ma bourse myScholarships:', u);
      } catch (err) {
        console.error('❌ Erreur ma bourse myScholarships:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    loadFile();
    loadscholarships();
  }, [token]);

  console.log('✅ Bourse chargéeeee:', scholarships);

  /** ✏️ Gestion du formulaire **/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Soumettre la mise à jour **/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      nationality: form.nationality,
      address: form.address,
      city: form.city,
      country: form.country,
      academicLevel: form.academicLevel,
      profileImage: form.profileImage,
      coverImage: form.coverImage
    };

    try {
      const json = await apiRequest('/profile/student', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      console.log('✅ Profil mis à jour:', json);
      setUser(json?.data ?? json);
      setShowUpdateForm(false);
    } catch (err) {
      console.error('❌ Erreur update profil:', err.message || err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction pour gérer la création du dossier
  const handleCreateDossier = async (e) => {
    e.preventDefault();
    setCreatingDossier(true);
    setDossierError('');

    try {
      // Validation des champs requis
      if (!dossierForm.currentLevel || !dossierForm.cvUrl) {
        throw new Error('Tous les champs sont obligatoires');
      }

      const payload = {
        currentLevel: dossierForm.currentLevel,
        cvUrl: dossierForm.cvUrl,
        // Ajoutez les autres champs requis par votre API
      };

      console.log('📤 Envoi du dossier:', payload);

      const json = await apiRequest('/students/scholarships/file', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      console.log('✅ Dossier créé:', json);
      
      // Afficher un message de succès
      alert('Dossier créé avec succès!');
      
      setShowCreateDossier(false);
      setDossierForm({ currentLevel: '', cvUrl: '' });
      
      // Optionnel: Recharger les données utilisateur si nécessaire
      // await loadUserData();
      
    } catch (err) {
      console.error('❌ Erreur création dossier:', err);
      const errorMessage = err.message || 'Erreur lors de la création du dossier';
      setDossierError(errorMessage);
      alert('Erreur: ' + errorMessage);
    } finally {
      setCreatingDossier(false);
    }
  };

  // Fonction pour gérer les changements dans le formulaire de dossier
  const handleDossierChange = (e) => {
    const { name, value } = e.target;
    setDossierForm(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (dossierError) setDossierError('');
  };

  // Fonction pour réinitialiser le formulaire de dossier
  const handleCancelDossier = () => {
    setDossierForm({ currentLevel: '', cvUrl: '' });
    setDossierError('');
    setShowCreateDossier(false);
  };

  const handleUpdateProfile = async () => {
    setShowUpdateForm(true);
  };

  /** 🎨 Générer les initiales pour l'avatar **/
  const getInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  /** 🎨 Générer une couleur basée sur le nom **/
  const getAvatarColor = () => {
    const name = `${user?.firstName || ''}${user?.lastName || ''}`;
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#F8B739', '#52B788', '#E07A5F', '#81B29A'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  /** 🖼️ Component Avatar **/
  const Avatar = ({ size = 'large', className = '' }) => {
    const hasImage = user?.profileImage;
    
    if (uploadingImage) {
      return (
        <div 
          className={className}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className="ph-spinner-gap ph-spin" style={{ color: '#f97316' }}></i>
        </div>
      );
    }
    
    if (hasImage) {
      return (
        <img 
          src={user.profileImage} 
          alt="Photo de profil"
          className={className}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      );
    }
    
    const isLarge = size === 'large';
    const fontSize = isLarge ? '3rem' : '1.5rem';
    
    return (
      <div 
        className={className}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: getAvatarColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: fontSize,
          fontWeight: '600',
          userSelect: 'none'
        }}
      >
        {getInitials()}
      </div>
    );
  };

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
            {/* Section image de couverture */}
            {/* <div className="profile-cover-section">
              {user?.coverImage ? (
                <div className="profile-cover">
                  <img src={user.coverImage} alt="Cover" className="cover-image" />
                  <input
                    type="file"
                    id="cover-image-input"
                    accept="image/*"
                    onChange={handleCoverImageSelect}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="cover-image-input" 
                    className="btn-cover-edit"
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="ph-camera icon-margin-right"></i>
                    Modifier la couverture
                  </label>
                </div>
              ) : (
                <div className="cover-placeholder">
                  <input
                    type="file"
                    id="cover-image-input"
                    accept="image/*"
                    onChange={handleCoverImageSelect}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="cover-image-input" 
                    className="btn-cover-add"
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="ph-plus icon-margin-right"></i>
                    Ajouter une image de couverture
                  </label>
                </div>
              )}
            </div> */}

            <div className="profile-row">
              <div className="profile-col-left">
                <div className="profile-card">
                  <div className="profile-avatar">
                    {uploadingImage ? (
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f3f4f6'
                      }}>
                        <i className="ph-spinner-gap ph-spin" style={{ fontSize: '2rem', color: '#f97316' }}></i>
                      </div>
                    ) : (
                      <>
                        <Avatar size="large" className="profile-avatar-img" />
                        <input
                          type="file"
                          id="profile-image-input"
                          accept="image/*"
                          onChange={handleProfileImageSelect}
                          style={{ display: 'none' }}
                        />
                        <label 
                          htmlFor="profile-image-input" 
                          className="btn-avatar-edit"
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="ph-camera icon-margin-right"></i>
                        </label>
                      </>
                    )}
                  </div>
                  <div className="profile-info">
                    <h4>{user?.firstName || 'Prénom'} {user?.lastName || 'Nom'}</h4>
                    <p className="text-muted">{user?.city ? `${user.city}${user.country ? ', ' + user.country : ''}` : user?.address || 'Ville non renseignée'}</p>
                    <div className="profile-stats">
                      <div className="stat-item">
                        <span className="stat-number">{data.dossiers.length}</span>
                        <span className="stat-label">Dossiers</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{data.demandesBourses.length}</span>
                        <span className="stat-label">Bourses</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-number">{data.demandesPermutation.length}</span>
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
                      <input type="text" className="form-control" value={user?.lastName || ''} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Prénom</label>
                      <input type="text" className="form-control" value={user?.firstName || ''} readOnly />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">Genre</label>
                      <input type="text" className="form-control" value={user?.gender || 'Non renseigné'} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Date de naissance</label>
                      <input type="date" className="form-control" value={(user?.dateOfBirth || '').slice(0,10)} readOnly />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">Nationalité</label>
                      <input type="text" className="form-control" value={user?.nationality || 'Non renseignée'} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Niveau académique</label>
                      <input type="text" className="form-control" value={user?.academicLevel || 'Non renseigné'} readOnly />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">Ville</label>
                      <input type="text" className="form-control" value={user?.city || 'Non renseignée'} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Pays</label>
                      <input type="text" className="form-control" value={user?.country || 'Non renseigné'} readOnly />
                    </div>
                  </div>
                  <div className="form-group-full">
                    <label className="form-label">Adresse</label>
                    <textarea className="form-control" rows="2" value={user?.address || 'Non renseignée'} readOnly />
                  </div>
                  {user?.bio && (
                    <div className="form-group-full">
                      <label className="form-label">Biographie</label>
                      <textarea className="form-control" rows="3" value={user?.bio || ''} readOnly />
                    </div>
                  )}
                  <button className="btn-orange" onClick={handleUpdateProfile}>
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
              <button 
                className="btn-orange" 
                onClick={() => setShowCreateDossier(true)}
              >
                <i className="ph-plus icon-margin-right"></i>
                Nouveau dossier
              </button>
            </div>
            <div className="cards-grid">
              {data.dossiers.map(dossier => (
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
        {dossier && Object.keys(dossier).length > 0 ? (
          <Link to={`/dossier/${dossier.id}`} className="btn-orange">
            <i className="ph-eye icon-margin-right"></i>
            Voir mon dossier
          </Link>
        ) : (
          <button 
            className="btn-orange" 
            onClick={() => setShowCreateDossier(true)}
          >
            <i className="ph-plus icon-margin-right"></i>
            Créer un dossier
          </button>
        )}
      </div>

      {dossier && Object.keys(dossier).length > 0 ? (
        // Si le dossier existe, afficher les demandes de bourses
        scholarships && scholarships.length > 0 ? (
          <div className="cards-grid">
            {scholarships.map(demande => (
              <div key={demande.id} className="grid-col">
                <div className="bourse-card">
                  <div className="bourse-header">
                    <div className="bourse-title">
                      <h6 className="bourse-title-text">{demande.scholarship?.title || 'Titre non disponible'}</h6>
                    </div>
                    <div className="bourse-montant">
                      <span className="montant">
                        {demande.scholarship?.amount || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="bourse-content">
                    <div className="bourse-meta">
                      <div className="meta-item">
                        <i className="ph-calendar icon-margin-right"></i>
                        <span className="bourse-universite">
                          Pays: {demande.scholarship?.country || 'Non spécifié'} 
                        </span>
                      </div>
                      <div className="meta-item">
                        <i className="ph-clock icon-margin-right"></i>
                        <span className="bourse-universite">
                          Université: {demande.scholarship?.university || 'Non précisée'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bourse-footer">
                    <div className="bourse-status">
                      <span className={`badge ${getStatutBadge(demande.status || 'En attente')}`}>
                        <i className={`${getStatutIcon(demande.status || 'En attente')} icon-margin-right-small`}></i>
                        {demande.status || 'En attente'}
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
        ) : (
          <div className="empty-state">
            <i className="ph-wallet display-4 text-muted icon-margin-bottom"></i>
            <h5>Aucune demande de bourse</h5>
            <p className="text-muted">
              Vous n'avez pas encore fait de demande de bourse.
            </p>
            <Link to="/course" className="btn-orange">
              <i className="ph-plus icon-margin-right"></i>
              Faire une demande
            </Link>
          </div>
        )
      ) : (
        // Si le dossier n'existe pas, afficher le message explicatif
        <div className="empty-state">
          <i className="ph-folder-notch-open display-4 text-muted icon-margin-bottom"></i>
          <h5>Créez d'abord votre dossier</h5>
          <p className="text-muted">
            C'est ici que vos demandes de bourses seront affichées. 
            Pour commencer, vous devez d'abord créer votre dossier d'étudiant.
          </p>
          <button 
            className="btn-orange" 
            onClick={() => setShowCreateDossier(true)}
          >
            <i className="ph-plus icon-margin-right"></i>
            Créer mon dossier
          </button>
        </div>
      )}
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
              {data.demandesPermutation.map(demande => (
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
            {data.demandesPermutation.length === 0 && (
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
      <section className="mon-profil-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              {/* Sidebar navigation */}
              <div className="profile-sidebar">
                <div className="profile-summary">
                  <div className="profile-avatar-small">
                    <Avatar size="small" />
                  </div>
                  <div className="profile-info-small">
                    <h5>{user?.firstName || 'Prénom'} {user?.lastName || 'Nom'}</h5>
                    <p className="text-muted">{user?.city || 'Ville'}</p>
                  </div>
                </div>
                <nav className="profile-nav">
                  {data.tabs.map(tab => (
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

      {/* Modal de mise à jour du profil */}
      {showUpdateForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Mettre à jour mon profil</h3>
              <button 
                onClick={() => setShowUpdateForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <i className="ph-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Photo de profil
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleProfileImageSelect}
                  className="form-control"
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <small style={{ color: '#f97316' }}>
                    <i className="ph-spinner-gap ph-spin icon-margin-right"></i>
                    Téléchargement en cours...
                  </small>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Image de couverture
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleCoverImageSelect}
                  className="form-control"
                  disabled={uploadingImage}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Nom</label>
                  <input 
                    type="text" 
                    name="lastName"
                    className="form-control" 
                    value={form.lastName}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Prénom</label>
                  <input 
                    type="text" 
                    name="firstName"
                    className="form-control" 
                    value={form.firstName}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Genre</label>
                  <select 
                    name="gender"
                    className="form-control" 
                    value={form.gender}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  >
                    <option value="">Sélectionner</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Date de naissance</label>
                  <input 
                    type="date" 
                    name="dateOfBirth"
                    className="form-control" 
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Nationalité</label>
                  <input 
                    type="text" 
                    name="nationality"
                    className="form-control" 
                    value={form.nationality}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Niveau académique</label>
                  <input 
                    type="text" 
                    name="academicLevel"
                    className="form-control" 
                    value={form.academicLevel}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Ville</label>
                  <input 
                    type="text" 
                    name="city"
                    className="form-control" 
                    value={form.city}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Pays</label>
                  <input 
                    type="text" 
                    name="country"
                    className="form-control" 
                    value={form.country}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Adresse</label>
                <textarea 
                  className="form-control" 
                  name="address"
                  rows="2"
                  value={form.address}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Biographie</label>
                <textarea 
                  className="form-control" 
                  name="bio"
                  rows="3"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Parlez-nous de vous..."
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
                  className="btn-orange"
                  style={{
                    flex: 1,
                    backgroundColor: '#e5e7eb',
                    color: '#374151'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-orange"
                  style={{ flex: 1 }}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showCreateDossier && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ margin: 0, color: '#1f2937' }}>Créer un nouveau dossier</h3>
        <button 
          onClick={() => setShowCreateDossier(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          <i className="ph-x"></i>
        </button>
      </div>

      <form onSubmit={handleCreateDossier}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            Niveau actuel
          </label>
          <select 
            name="currentLevel"
            className="form-control" 
            value={dossierForm.currentLevel}
            onChange={handleDossierChange}
            style={{ width: '100%' }}
            required
          >
            <option value="">Sélectionnez votre niveau</option>
            <option value="Licence 1">Licence 1</option>
            <option value="Licence 2">Licence 2</option>
            <option value="Licence 3">Licence 3</option>
            <option value="Master 1">Master 1</option>
            <option value="Master 2">Master 2</option>
            <option value="Doctorat">Doctorat</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            URL du CV
          </label>
          <input 
            type="url" 
            name="cvUrl"
            className="form-control" 
            value={dossierForm.cvUrl}
            onChange={handleDossierChange}
            placeholder="https://example.com/cv.pdf"
            style={{ width: '100%' }}
            required
          />
          <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Lien vers votre CV (Google Drive, Dropbox, etc.)
          </small>
        </div>

        {/* Vous pouvez ajouter d'autres champs ici selon les besoins de votre API */}

        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            type="button"
            onClick={() => setShowCreateDossier(false)}
            className="btn-orange"
            style={{
              flex: 1,
              backgroundColor: '#e5e7eb',
              color: '#374151'
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-orange"
            style={{ flex: 1 }}
            disabled={creatingDossier}
          >
            {creatingDossier ? 'Création...' : 'Créer le dossier'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </>
  );
};

export default MonProfil;