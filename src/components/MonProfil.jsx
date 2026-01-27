import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './MonProfil.css';
import data from '../helper/data.json';
import quizService from '../services/quizService';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const MonProfil = () => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  const [activeTab, setActiveTab] = useState('informations');
  const [user, setUser] = useState(null);
  const [dossierError, setDossierError] = useState();
  const [dossier, setDossier] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [idScholarships, setIdScholarships] = useState(null);
  const [myScholarships, setMyScholarships] = useState(null);
  // etude 
  const [DossierEtudiant, setDossierEtudiant] = useState(null);
  const [foreignStudies, setForeignStudies] = useState([]);
  const [orientationRequests, setOrientationRequests] = useState([]);
  const [permutationRequests, setPermutationRequests] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);
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
    profession: '',
    interests: []
  });
  const [professionalExperiences, setProfessionalExperiences] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [academicHistory, setAcademicHistory] = useState([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [showAcademicForm, setShowAcademicForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingTraining, setEditingTraining] = useState(null);
  const [editingAcademic, setEditingAcademic] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
    current: false
  });
  const [trainingForm, setTrainingForm] = useState({
    title: '',
    institution: '',
    startDate: '',
    endDate: '',
    description: '',
    certificate: ''
  });
  const [academicForm, setAcademicForm] = useState({
    school: '',
    level: '',
    field: '',
    startDate: '',
    endDate: '',
    diploma: '',
    average: ''
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
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

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

  /** 🧩 Requête API avec gestion automatique du token et retry pour throttling **/
  const apiRequest = async (path, options = {}, retries = 3) => {
    let access = localStorage.getItem('access_token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (access) headers.Authorization = `Bearer ${access}`;

    const doFetch = async () => {
      const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
      
      // Gérer le throttling (429) avec retry et backoff
      if (response.status === 429 && retries > 0) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, 4 - retries) * 1000; // Exponential backoff
        console.warn(`⚠️ Throttling détecté, nouvelle tentative dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return apiRequest(path, options, retries - 1);
      }
      
      return response;
    };

    let response = await doFetch();

    // si token expiré → on rafraîchit
    if (response.status === 401) {
      const newAccess = await getNewAccessToken();
      headers.Authorization = `Bearer ${newAccess}`;
      response = await doFetch();
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorText;
      } catch (e) {
        // Si ce n'est pas du JSON, on garde le texte brut
      }
      throw new Error(errorMessage || `Erreur HTTP ${response.status}`);
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

  /** 🎥 Uploader une vidéo */
  const uploadVideo = async (file, category = 'videos') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    let access = localStorage.getItem('access_token');
    const headers = { 
      'Authorization': `Bearer ${access}` 
      // Note: Ne pas mettre 'Content-Type' pour FormData
    };

    const doFetch = async () =>
      fetch(`${API_BASE}/uploads/video`, {
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
      throw new Error(errorText || `Erreur upload vidéo ${response.status}`);
    }

    const json = await response.json();
    return json?.data?.url || json?.url || json;
  };

  /** 🎥 Mettre à jour la vidéo de présentation */
  const handleUpdatePresentationVideo = async (file) => {
    if (!file) return;
    
    setUploadingVideo(true);
    try {
      // Vérifier le type de fichier
      if (!file.type.startsWith('video/')) {
        alert('Veuillez sélectionner une vidéo valide');
        return;
      }
      
      // Vérifier la taille (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('La vidéo ne doit pas dépasser 100MB');
        return;
      }

      // Uploader la vidéo
      const videoUrl = await uploadVideo(file, 'presentations');
      
      // Mettre à jour le profil avec la nouvelle URL
      const payload = {
        ...form,
        presentationVideo: videoUrl
      };

      const json = await apiRequest('/profile/student', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      console.log('✅ Vidéo de présentation mise à jour:', json);
      setUser(json?.data ?? json);
      setForm(prev => ({ ...prev, presentationVideo: videoUrl }));
      
      // Réinitialiser la sélection
      setSelectedVideo(null);
      alert('Vidéo de présentation mise à jour avec succès!');
      
    } catch (err) {
      console.error('❌ Erreur upload vidéo:', err.message || err);
      alert('Erreur lors du téléchargement de la vidéo: ' + (err.message || 'Erreur inconnue'));
    } finally {
      setUploadingVideo(false);
    }
  };

  /** 📁 Gérer la sélection de vidéo de présentation */
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVideo(file);
      handleUpdatePresentationVideo(file);
    }
  };

  /** 📦 Charger le profil utilisateur **/
  useEffect(() => {
    if (!token) return;

    const loadUser = async () => {
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
          profession: u?.profession || '',
          interests: u?.interests || [],
          profileImage: u?.profileImage || '',
          coverImage: u?.coverImage || '',
          presentationVideo: u?.presentationVideo || ''
        });
        // Initialiser les listes depuis les données utilisateur
        setProfessionalExperiences(u?.professionalExperiences || []);
        setTrainings(u?.trainings || []);
        setAcademicHistory(u?.academicHistory || []);
      } catch (err) {
        console.error('❌ Erreur profil:', err);
        // Ne pas bloquer l'application si le profil ne peut pas être chargé
        // L'utilisateur verra un état de chargement ou un message d'erreur
      }
    };
    const loadFile = async () => {
      try {
        // Endpoint peut ne pas exister, on ignore l'erreur silencieusement
        const json = await apiRequest('/students/scholarships/file');
        const u = json?.data ?? json;
        setDossier(u);
        console.log('✅ Dossier chargé:', u);
      } catch (err) {
        // Endpoint peut ne pas exister, on ignore l'erreur silencieusement
        if (!err.message.includes('404') && !err.message.includes('Not Found')) {
        console.error('❌ Erreur dossier:', err);
        }
      }
    };
    
    const loadFileEtranger = async () => {
      try {
        // Endpoint peut ne pas exister, on ignore l'erreur silencieusement
        const json = await apiRequest('/students/foreign-studies/file');
        const u = json?.data ?? json;
        setDossierEtudiant(u);
        console.log('✅ Dossier étranger chargé:', u);
      } catch (err) {
        // Endpoint peut ne pas exister, on ignore l'erreur silencieusement
        const errorMessage = err.message || '';
        if (!errorMessage.includes('404') && 
            !errorMessage.includes('Not Found') && 
            !errorMessage.includes('Cannot GET')) {
          console.error('❌ Erreur dossier étranger:', err);
        }
        // Ne pas logger l'erreur si c'est un 404
      }
    };
    
    const loadscholarships = async () => {
      try {
        // Récupérer les candidatures aux bourses de l'utilisateur
        console.log('🔄 Chargement des candidatures aux bourses...');
        const json = await apiRequest('/scholarships/applications/my-applications');
        console.log('📥 Réponse brute de l\'API:', json);
        const u = json?.data ?? json;
        // S'assurer que c'est un tableau
        const applications = Array.isArray(u) ? u : (u ? [u] : []);
        setScholarships(applications);
        console.log('✅ Candidatures aux bourses chargées:', applications.length, 'demande(s)');
        console.log('📋 Détails des candidatures:', applications);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des candidatures aux bourses:', err);
        console.error('❌ Détails de l\'erreur:', err.message, err.stack);
        setScholarships([]); // Initialiser avec un tableau vide en cas d'erreur
      }
    };
    
    const loadForeignStudies = async () => {
      try {
        console.log('🔄 Chargement des candidatures d\'études à l\'étranger...');
        const json = await apiRequest('/foreign-study/applications/my-applications');
        console.log('📥 Réponse brute de l\'API:', json);
        const u = json?.data ?? json;
        // S'assurer que c'est un tableau
        const applications = Array.isArray(u) ? u : (u ? [u] : []);
        setForeignStudies(applications);
        console.log('✅ Candidatures d\'études à l\'étranger chargées:', applications.length, 'candidature(s)');
        console.log('📋 Détails des candidatures:', applications);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des candidatures d\'études à l\'étranger:', err);
        console.error('❌ Détails de l\'erreur:', err.message, err.stack);
        setForeignStudies([]); // Initialiser avec un tableau vide en cas d'erreur
      }
    };
    
    const loadMyScholarships = async () => {
      if (!idScholarships) return;
      try {
        const json = await apiRequest(`/scholarships/${idScholarships}`);
          const u = json?.data ?? json;
          setMyScholarships(u);
          console.log('✅ Ma bourse myScholarships:', u);
      } catch (err) {
        console.error('❌ Erreur ma bourse myScholarships:', err);
      }
    };
    
    const loadOrientationRequests = async () => {
      try {
        const json = await apiRequest('/orientation-request/requests/my-requests');
        const u = json?.data ?? json;
        setOrientationRequests(Array.isArray(u) ? u : []);
        console.log('✅ Demandes d\'orientation chargées:', u);
      } catch (err) {
        console.error('❌ Erreur demandes d\'orientation:', err);
        setOrientationRequests([]);
      }
    };
    
    const loadPermutationRequests = async () => {
      try {
        const json = await apiRequest('/permutation/applications/my-applications');
        const u = json?.data ?? json;
        setPermutationRequests(Array.isArray(u) ? u : []);
        console.log('✅ Demandes de permutation chargées:', u);
      } catch (err) {
        console.error('❌ Erreur demandes de permutation:', err);
        setPermutationRequests([]);
      }
    };
    
    const loadDocumentRequests = async () => {
      try {
        const json = await apiRequest('/document-request/requests/my-requests');
        const u = json?.data ?? json;
        setDocumentRequests(Array.isArray(u) ? u : []);
        console.log('✅ Demandes de documents chargées:', u);
      } catch (err) {
        console.error('❌ Erreur demandes de documents:', err);
        setDocumentRequests([]);
      }
    };

    // Charger les données avec des délais pour éviter le throttling
    const loadAllData = async () => {
      setLoading(true);
      try {
        // Charger le profil en premier
        await loadUser();
        
        // Attendre un peu avant les autres requêtes
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Charger les autres données en parallèle mais avec des délais échelonnés
        await Promise.all([
          loadFile().catch(() => {}),
          new Promise(resolve => setTimeout(() => {
            loadscholarships().catch(() => {});
            resolve();
          }, 200)),
          new Promise(resolve => setTimeout(() => {
            loadForeignStudies().catch(() => {});
            resolve();
          }, 400)),
          new Promise(resolve => setTimeout(() => {
            loadFileEtranger().catch(() => {});
            resolve();
          }, 600)),
          new Promise(resolve => setTimeout(() => {
            loadOrientationRequests().catch(() => {});
            resolve();
          }, 800)),
          new Promise(resolve => setTimeout(() => {
            loadPermutationRequests().catch(() => {});
            resolve();
          }, 1000)),
          new Promise(resolve => setTimeout(() => {
            loadDocumentRequests().catch(() => {});
            resolve();
          }, 1200))
        ]);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [token]);

  // Rafraîchir les données quand l'utilisateur revient sur la page profil
  useEffect(() => {
    if (location.pathname === '/profil' && token) {
      console.log('🔄 Rafraîchissement des données du profil...');
      const refreshData = async () => {
        try {
          // Rafraîchir les bourses
          const scholarshipsJson = await apiRequest('/scholarships/applications/my-applications');
          const scholarshipsData = scholarshipsJson?.data ?? scholarshipsJson;
          const scholarshipsApps = Array.isArray(scholarshipsData) ? scholarshipsData : (scholarshipsData ? [scholarshipsData] : []);
          setScholarships(scholarshipsApps);
          console.log('✅ Candidatures aux bourses rafraîchies:', scholarshipsApps.length, 'demande(s)');
          
          // Rafraîchir les études à l'étranger
          const foreignStudiesJson = await apiRequest('/foreign-study/applications/my-applications');
          const foreignStudiesData = foreignStudiesJson?.data ?? foreignStudiesJson;
          const foreignStudiesApps = Array.isArray(foreignStudiesData) ? foreignStudiesData : (foreignStudiesData ? [foreignStudiesData] : []);
          setForeignStudies(foreignStudiesApps);
          console.log('✅ Candidatures d\'études à l\'étranger rafraîchies:', foreignStudiesApps.length, 'candidature(s)');
        } catch (err) {
          console.error('❌ Erreur lors du rafraîchissement:', err);
        }
      };
      // Rafraîchir après un court délai pour laisser le temps à la page de se charger
      const timer = setTimeout(() => {
        refreshData();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, token]);

  // Supprimer le console.log inutile

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
      profession: form.profession,
      professionalExperiences: professionalExperiences,
      trainings: trainings,
      academicHistory: academicHistory,
      profileImage: form.profileImage,
      coverImage: form.coverImage,
      presentationVideo: form.presentationVideo
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

  // Fonctions pour gérer les expériences professionnelles
  const handleExperienceSubmit = (e) => {
    e.preventDefault();
    if (editingExperience !== null) {
      const newExps = [...professionalExperiences];
      newExps[editingExperience] = experienceForm;
      setProfessionalExperiences(newExps);
    } else {
      setProfessionalExperiences([...professionalExperiences, experienceForm]);
    }
    setShowExperienceForm(false);
    setEditingExperience(null);
    setExperienceForm({ title: '', company: '', startDate: '', endDate: '', description: '', current: false });
  };

  // Fonctions pour gérer les formations
  const handleTrainingSubmit = (e) => {
    e.preventDefault();
    if (editingTraining !== null) {
      const newTrainings = [...trainings];
      newTrainings[editingTraining] = trainingForm;
      setTrainings(newTrainings);
    } else {
      setTrainings([...trainings, trainingForm]);
    }
    setShowTrainingForm(false);
    setEditingTraining(null);
    setTrainingForm({ title: '', institution: '', startDate: '', endDate: '', description: '', certificate: '' });
  };

  // Fonctions pour gérer le cursus scolaire
  const handleAcademicSubmit = (e) => {
    e.preventDefault();
    if (editingAcademic !== null) {
      const newAcademic = [...academicHistory];
      newAcademic[editingAcademic] = academicForm;
      setAcademicHistory(newAcademic);
    } else {
      setAcademicHistory([...academicHistory, academicForm]);
    }
    setShowAcademicForm(false);
    setEditingAcademic(null);
    setAcademicForm({ school: '', level: '', field: '', startDate: '', endDate: '', diploma: '', average: '' });
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
    const isLarge = size === 'large';
    const avatarSize = isLarge ? '180px' : '80px';
    const fontSize = isLarge ? '3rem' : '1.5rem';
    
    if (uploadingImage) {
      return (
        <div 
          className={className}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <i className="ph-spinner-gap ph-spin" style={{ color: '#f97316', fontSize: '2rem' }}></i>
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
            width: avatarSize,
            height: avatarSize,
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      );
    }
    
    return (
      <div 
        className={className}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          backgroundColor: getAvatarColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: fontSize,
          fontWeight: '600',
          userSelect: 'none',
          border: '4px solid white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}
      >
        {getInitials()}
      </div>
    );
  };

  const getStatutBadge = (statut) => {
    if (!statut) return 'badge-secondary';
    const statutUpper = statut.toUpperCase();
    const badges = {
      'EN_COURS_DE_TRAITEMENT': 'badge-warning',
      'EN_COURS': 'badge-warning',
      'EN_ATTENTE': 'badge-info',
      'PENDING': 'badge-info',
      'APPROUVÉ': 'badge-success',
      'APPROUVÉE': 'badge-success',
      'APPROVED': 'badge-success',
      'REJETÉ': 'badge-danger',
      'REJECTED': 'badge-danger',
      'REFUSED': 'badge-danger',
      'En cours de traitement': 'badge-warning',
      'Approuvé': 'badge-success',
      'En attente': 'badge-info',
      'Rejeté': 'badge-danger',
      'En cours': 'badge-warning',
      'Approuvée': 'badge-success'
    };
    return badges[statutUpper] || badges[statut] || 'badge-secondary';
  };

  const getStatutIcon = (statut) => {
    if (!statut) return 'ph-question';
    const statutUpper = statut.toUpperCase();
    const icons = {
      'EN_COURS_DE_TRAITEMENT': 'ph-clock',
      'EN_COURS': 'ph-clock',
      'EN_ATTENTE': 'ph-hourglass',
      'PENDING': 'ph-hourglass',
      'APPROUVÉ': 'ph-check-circle',
      'APPROUVÉE': 'ph-check-circle',
      'APPROVED': 'ph-check-circle',
      'REJETÉ': 'ph-x-circle',
      'REJECTED': 'ph-x-circle',
      'REFUSED': 'ph-x-circle',
      'En cours de traitement': 'ph-clock',
      'Approuvé': 'ph-check-circle',
      'En attente': 'ph-hourglass',
      'Rejeté': 'ph-x-circle',
      'En cours': 'ph-clock',
      'Approuvée': 'ph-check-circle'
    };
    return icons[statutUpper] || icons[statut] || 'ph-question';
  };

  const formatStatus = (statut) => {
    if (!statut) return 'En attente';
    const statutUpper = statut.toUpperCase();
    const statusMap = {
      'EN_COURS_DE_TRAITEMENT': 'En cours de traitement',
      'EN_COURS': 'En cours',
      'EN_ATTENTE': 'En attente',
      'PENDING': 'En attente',
      'APPROUVÉ': 'Approuvé',
      'APPROUVÉE': 'Approuvée',
      'APPROVED': 'Approuvé',
      'REJETÉ': 'Rejeté',
      'REJECTED': 'Rejeté',
      'REFUSED': 'Rejeté',
    };
    return statusMap[statutUpper] || statusMap[statut] || statut;
  };

  /** 🎮 Composant pour afficher les résultats et récompenses des quiz **/
  const QuizResultsBlock = () => {
    const { data: quizStats, isLoading: statsLoading } = useQuery({
      queryKey: ['quizStats'],
      queryFn: () => quizService.getMyStats(),
      enabled: !!token,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });

    const { data: quizRewards, isLoading: rewardsLoading } = useQuery({
      queryKey: ['quizRewards'],
      queryFn: () => quizService.getMyRewards(),
      enabled: !!token,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    });

    if (!token) return null;

    const stats = quizStats || {};
    const rewards = quizRewards || [];

    return (
      <div className="quiz-results-block" style={{ marginBottom: '2rem', marginTop: '2rem' }}>
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes statCardSlide {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes iconBounce {
            0% {
              opacity: 0;
              transform: scale(0) rotate(-180deg);
            }
            60% {
              transform: scale(1.2) rotate(10deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }
          
          @keyframes rewardItemFade {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .quiz-results-block .quiz-main-card {
            background: linear-gradient(135deg, #7B2CBF 0%, #E91E63 100%);
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 12px 40px rgba(123, 44, 191, 0.3);
            animation: fadeInUp 0.6s ease-out;
          }
          
          .quiz-results-block .quiz-title {
            color: #ffffff;
            font-size: 1.75rem;
            font-weight: 800;
            margin: 0 0 2rem 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
          
          .quiz-results-block .quiz-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.25rem;
            margin-bottom: 2rem;
          }
          
          .quiz-results-block .stat-card-quiz {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 1.5rem;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            animation: statCardSlide 0.6s ease-out both;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .quiz-results-block .stat-card-quiz::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .quiz-results-block .stat-card-quiz:hover::before {
            left: 100%;
          }
          
          .quiz-results-block .stat-card-quiz:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 32px rgba(123, 44, 191, 0.4);
          }
          
          .quiz-results-block .stat-card-quiz:nth-child(1) {
            animation-delay: 0.1s;
          }
          
          .quiz-results-block .stat-card-quiz:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .quiz-results-block .stat-card-quiz:nth-child(3) {
            animation-delay: 0.3s;
          }
          
          .quiz-results-block .stat-card-quiz:nth-child(4) {
            animation-delay: 0.4s;
          }
          
          .quiz-results-block .stat-emoji {
            font-size: 3rem;
            margin-bottom: 0.5rem;
            display: block;
            text-align: center;
            animation: iconBounce 0.6s ease-out 0.3s both;
            line-height: 1;
          }
          
          .quiz-results-block .stat-value {
            font-size: 2rem;
            font-weight: 800;
            color: #ffffff;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .quiz-results-block .stat-label {
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }
          
          .quiz-results-block .rewards-section {
            margin-top: 2rem;
          }
          
          .quiz-results-block .rewards-title {
            color: #ffffff;
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .quiz-results-block .rewards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
          }
          
          .quiz-results-block .reward-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            padding: 1.25rem;
            text-align: center;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            animation: rewardItemFade 0.6s ease-out both;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .quiz-results-block .reward-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(123, 44, 191, 0.3);
            border-color: rgba(123, 44, 191, 0.3);
          }
          
          .quiz-results-block .reward-card:nth-child(1) {
            animation-delay: 0.5s;
          }
          
          .quiz-results-block .reward-card:nth-child(2) {
            animation-delay: 0.6s;
          }
          
          .quiz-results-block .reward-card:nth-child(3) {
            animation-delay: 0.7s;
          }
          
          .quiz-results-block .reward-icon-wrapper {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 0.75rem;
            box-shadow: 0 4px 12px rgba(123, 44, 191, 0.3);
            transition: all 0.3s ease;
          }
          
          .quiz-results-block .reward-card:hover .reward-icon-wrapper {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 6px 16px rgba(123, 44, 191, 0.4);
          }
          
          .quiz-results-block .reward-icon {
            font-size: 2rem;
            color: #ffffff;
          }
          
          .quiz-results-block .reward-name {
            font-size: 0.875rem;
            font-weight: 700;
            color: #7B2CBF;
            margin-bottom: 0.25rem;
          }
          
          .quiz-results-block .reward-points {
            font-size: 0.75rem;
            color: #9D4EDD;
            font-weight: 600;
          }
        `}</style>
        
        <div className="quiz-main-card">
          <h5 className="quiz-title">
            <i className="ph-trophy" style={{ fontSize: '2rem' }}></i>
            Résultats et Performances des Quiz
          </h5>
          
          {statsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="ph-spinner-gap ph-spin" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
              <p style={{ marginTop: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>Chargement des statistiques...</p>
            </div>
          ) : (
            <div className="quiz-stats-grid">
              <div className="stat-card-quiz">
                <div className="stat-emoji">🏆</div>
                <div className="stat-value">{stats.rank || 'N/A'}</div>
                <div className="stat-label">Classement</div>
              </div>

              <div className="stat-card-quiz">
                <div className="stat-emoji">⭐</div>
                <div className="stat-value">{stats.totalPoints || 0}</div>
                <div className="stat-label">Points totaux</div>
              </div>

              <div className="stat-card-quiz">
                <div className="stat-emoji">✅</div>
                <div className="stat-value">{stats.quizzesCompleted || 0}</div>
                <div className="stat-label">Quiz complétés</div>
              </div>

              <div className="stat-card-quiz">
                <div className="stat-emoji">📊</div>
                <div className="stat-value">{stats.averageScore ? `${stats.averageScore}%` : 'N/A'}</div>
                <div className="stat-label">Score moyen</div>
              </div>
            </div>
          )}

          {/* Section Récompenses */}
          <div className="rewards-section">
            <h6 className="rewards-title">
              <i className="ph-gift"></i>
              Mes Récompenses ({rewards.length})
            </h6>
            
            {rewardsLoading ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <i className="ph-spinner-gap ph-spin" style={{ fontSize: '1.5rem', color: '#ffffff' }}></i>
              </div>
            ) : rewards.length > 0 ? (
              <div className="rewards-grid">
                {rewards.map((reward, index) => {
                  const getRewardIcon = () => {
                    if (reward.type === 'BADGE') return 'ph-medal';
                    if (reward.type === 'TROPHY') return 'ph-trophy';
                    return 'ph-star';
                  };
                  
                  return (
                    <div key={index} className="reward-card" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                      <div className="reward-icon-wrapper">
                        <i className={`ph ${getRewardIcon()} reward-icon`}></i>
                      </div>
                      <div className="reward-name">
                        {reward.name || reward.title || 'Récompense'}
                      </div>
                      {reward.points && (
                        <div className="reward-points">
                          {reward.points} points
                        </div>
                      )}
                      {reward.description && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                          {reward.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                border: '2px dashed rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="ph-gift" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block', color: '#ffffff' }}></i>
                <p style={{ fontWeight: '600' }}>Aucune récompense pour le moment</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.8 }}>
                  Participez aux quiz pour gagner des récompenses !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
                  {/* Retiré: photo, nom, ville/pays (à la demande) */}
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
                      <label className="form-label">Pays de nationalité</label>
                      <input type="text" className="form-control" value={user?.nationality || 'Non renseignée'} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Niveau académique</label>
                      <input type="text" className="form-control" value={user?.academicLevel || 'Non renseigné'} readOnly />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">Profession</label>
                      <input type="text" className="form-control" value={user?.profession || 'Non renseignée'} readOnly />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <label className="form-label">Ville</label>
                      <input type="text" className="form-control" value={user?.city || 'Non renseignée'} readOnly />
                    </div>
                    <div className="form-col">
                      <label className="form-label">Pays de résidence</label>
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

            {/* Section Expériences professionnelles */}
            <div className="info-card" style={{ marginTop: '2rem', background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h5 className="card-title" style={{ margin: 0 }}>
                  <i className="ph-briefcase" style={{ marginRight: '0.5rem', color: '#ea580c' }}></i>
                  Expériences professionnelles
                </h5>
                <button 
                  className="btn-orange" 
                  onClick={() => {
                    setEditingExperience(null);
                    setExperienceForm({ title: '', company: '', startDate: '', endDate: '', description: '', current: false });
                    setShowExperienceForm(true);
                  }}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <i className="ph-plus" style={{ marginRight: '0.25rem' }}></i>
                  Ajouter
                </button>
              </div>
              {professionalExperiences.length === 0 ? (
                <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                  Aucune expérience professionnelle enregistrée
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {professionalExperiences.map((exp, index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      background: '#f8fafc', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <h6 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{exp.title}</h6>
                          <p style={{ color: '#ea580c', fontWeight: '500', marginBottom: '0.25rem' }}>{exp.company}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            {new Date(exp.startDate).toLocaleDateString('fr-FR')} - {exp.current ? 'En cours' : new Date(exp.endDate).toLocaleDateString('fr-FR')}
                          </p>
                          {exp.description && (
                            <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>{exp.description}</p>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => {
                              setEditingExperience(index);
                              setExperienceForm(exp);
                              setShowExperienceForm(true);
                            }}
                            style={{ background: 'none', border: 'none', color: '#ea580c', cursor: 'pointer' }}
                          >
                            <i className="ph-pencil"></i>
                          </button>
                          <button 
                            onClick={() => {
                              const newExps = professionalExperiences.filter((_, i) => i !== index);
                              setProfessionalExperiences(newExps);
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <i className="ph-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section Formations */}
            <div className="info-card" style={{ marginTop: '2rem', background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h5 className="card-title" style={{ margin: 0 }}>
                  <i className="ph-certificate" style={{ marginRight: '0.5rem', color: '#ea580c' }}></i>
                  Formations
                </h5>
                <button 
                  className="btn-orange" 
                  onClick={() => {
                    setEditingTraining(null);
                    setTrainingForm({ title: '', institution: '', startDate: '', endDate: '', description: '', certificate: '' });
                    setShowTrainingForm(true);
                  }}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <i className="ph-plus" style={{ marginRight: '0.25rem' }}></i>
                  Ajouter
                </button>
              </div>
              {trainings.length === 0 ? (
                <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                  Aucune formation enregistrée
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {trainings.map((training, index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      background: '#f8fafc', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <h6 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{training.title}</h6>
                          <p style={{ color: '#ea580c', fontWeight: '500', marginBottom: '0.25rem' }}>{training.institution}</p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            {new Date(training.startDate).toLocaleDateString('fr-FR')} - {new Date(training.endDate).toLocaleDateString('fr-FR')}
                          </p>
                          {training.certificate && (
                            <p style={{ fontSize: '0.875rem', color: '#059669', marginBottom: '0.5rem' }}>
                              <i className="ph-certificate" style={{ marginRight: '0.25rem' }}></i>
                              Certificat: {training.certificate}
                            </p>
                          )}
                          {training.description && (
                            <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>{training.description}</p>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => {
                              setEditingTraining(index);
                              setTrainingForm(training);
                              setShowTrainingForm(true);
                            }}
                            style={{ background: 'none', border: 'none', color: '#ea580c', cursor: 'pointer' }}
                          >
                            <i className="ph-pencil"></i>
                          </button>
                          <button 
                            onClick={() => {
                              const newTrainings = trainings.filter((_, i) => i !== index);
                              setTrainings(newTrainings);
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <i className="ph-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section Cursus scolaire */}
            <div className="info-card" style={{ marginTop: '2rem', background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h5 className="card-title" style={{ margin: 0 }}>
                  <i className="ph-graduation-cap" style={{ marginRight: '0.5rem', color: '#ea580c' }}></i>
                  Cursus scolaire
                </h5>
                <button 
                  className="btn-orange" 
                  onClick={() => {
                    setEditingAcademic(null);
                    setAcademicForm({ school: '', level: '', field: '', startDate: '', endDate: '', diploma: '', average: '' });
                    setShowAcademicForm(true);
                  }}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <i className="ph-plus" style={{ marginRight: '0.25rem' }}></i>
                  Ajouter
                </button>
              </div>
              {academicHistory.length === 0 ? (
                <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                  Aucun cursus scolaire enregistré
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {academicHistory.map((academic, index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      background: '#f8fafc', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <h6 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{academic.school}</h6>
                          <p style={{ color: '#ea580c', fontWeight: '500', marginBottom: '0.25rem' }}>
                            {academic.level} {academic.field && `- ${academic.field}`}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            {new Date(academic.startDate).toLocaleDateString('fr-FR')} - {new Date(academic.endDate).toLocaleDateString('fr-FR')}
                          </p>
                          {academic.diploma && (
                            <p style={{ fontSize: '0.875rem', color: '#059669', marginBottom: '0.25rem' }}>
                              <i className="ph-certificate" style={{ marginRight: '0.25rem' }}></i>
                              Diplôme: {academic.diploma}
                            </p>
                          )}
                          {academic.average && (
                            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                              Moyenne: {academic.average}/20
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => {
                              setEditingAcademic(index);
                              setAcademicForm(academic);
                              setShowAcademicForm(true);
                            }}
                            style={{ background: 'none', border: 'none', color: '#ea580c', cursor: 'pointer' }}
                          >
                            <i className="ph-pencil"></i>
                          </button>
                          <button 
                            onClick={() => {
                              const newAcademic = academicHistory.filter((_, i) => i !== index);
                              setAcademicHistory(newAcademic);
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <i className="ph-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Section Suivi des demandes */}
            <div style={{ marginTop: '2rem' }}>
              <h5 className="card-title" style={{ marginBottom: '1.5rem' }}>
                <i className="ph-clipboard-text" style={{ marginRight: '0.5rem', color: '#ea580c' }}></i>
                Suivi de mes demandes
              </h5>
              
              {/* Bourses d'études */}
              {scholarships && scholarships.length > 0 && (
                <div className="info-card" style={{ marginBottom: '1.5rem', background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h6 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="ph-graduation-cap" style={{ color: '#ea580c' }}></i>
                    Bourses d'études ({scholarships.length})
                  </h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {scholarships.map((demande, index) => (
                      <div key={index} style={{ 
                        padding: '1rem', 
                        background: '#f8fafc', 
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                              {demande.scholarship?.title || 'Demande de bourse libre'}
                            </div>
                            {demande.scholarship?.university ? (
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {demande.scholarship.university?.name || demande.scholarship.university}
                              </div>
                            ) : (
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {demande.currentLevel && `${demande.currentLevel} - `}
                                {demande.studyField || 'Domaine non spécifié'}
                                {demande.targetCountry && ` • ${demande.targetCountry}`}
                              </div>
                            )}
                          </div>
                          <span className={`badge ${getStatutBadge(demande.status || 'EN_ATTENTE')}`}>
                            {formatStatus(demande.status || 'EN_ATTENTE')}
                          </span>
                        </div>
                        {demande.createdAt && (
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            <i className="ph-calendar" style={{ marginRight: '0.25rem' }}></i>
                            Soumis le {new Date(demande.createdAt).toLocaleDateString('fr-FR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Études à l'étranger */}
              {foreignStudies && foreignStudies.length > 0 && (
                <div className="info-card" style={{ marginBottom: '1.5rem', background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h6 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="ph-globe" style={{ color: '#ea580c' }}></i>
                    Études à l'étranger ({foreignStudies.length})
                  </h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {foreignStudies.map((demande, index) => (
                      <div key={demande.id || index} style={{ 
                        padding: '1rem', 
                        background: '#f8fafc', 
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                              {demande.targetSchool || demande.targetCountry || `Candidature #${demande.id || index + 1}`}
                            </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {demande.targetCountry && `Pays: ${demande.targetCountry}`}
                              {demande.targetCity && ` • Ville: ${demande.targetCity}`}
                              {demande.targetLevel && ` • Niveau: ${demande.targetLevel}`}
                              {demande.studyField && ` • Domaine: ${demande.studyField}`}
                              </div>
                          </div>
                          <span className={`badge ${getStatutBadge(demande.status || 'EN_ATTENTE')}`}>
                            {formatStatus(demande.status || 'EN_ATTENTE')}
                          </span>
                        </div>
                        {demande.createdAt && (
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            <i className="ph-calendar" style={{ marginRight: '0.25rem' }}></i>
                            Soumis le {new Date(demande.createdAt).toLocaleDateString('fr-FR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Permutations */}
              {permutationRequests && permutationRequests.length > 0 && (
                <div className="info-card" style={{ marginBottom: '1.5rem', background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h6 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="ph-arrows-clockwise" style={{ color: '#ea580c' }}></i>
                    Permutations ({permutationRequests.length})
                  </h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {permutationRequests.map((demande, index) => (
                      <div key={demande.id || index} style={{ 
                        padding: '1rem', 
                        background: '#f8fafc', 
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                              Demande de permutation #{demande.id || index + 1}
                            </div>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {demande.departureSchool && `De: ${demande.departureSchool}`}
                              {demande.desiredInstitution && ` → Vers: ${demande.desiredInstitution}`}
                              {demande.desiredGeographicZone && ` • Zone: ${demande.desiredGeographicZone}`}
                              </div>
                          </div>
                          <span className={`badge ${getStatutBadge(demande.status || 'EN_ATTENTE')}`}>
                            {formatStatus(demande.status || 'EN_ATTENTE')}
                          </span>
                        </div>
                        {demande.createdAt && (
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            <i className="ph-calendar" style={{ marginRight: '0.25rem' }}></i>
                            Soumis le {new Date(demande.createdAt).toLocaleDateString('fr-FR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Demandes d'orientation */}
              {orientationRequests && orientationRequests.length > 0 && (
                <div className="info-card" style={{ marginBottom: '1.5rem', background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h6 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="ph-compass" style={{ color: '#ea580c' }}></i>
                    Demandes d'orientation ({orientationRequests.length})
                  </h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {orientationRequests.map((demande, index) => (
                      <div key={index} style={{ 
                        padding: '1rem', 
                        background: '#f8fafc', 
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                              Demande d'orientation #{demande.id || index + 1}
                            </div>
                            {demande.interests && demande.interests.length > 0 && (
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Centres d'intérêt: {demande.interests.join(', ')}
                              </div>
                            )}
                          </div>
                          <span className={`badge ${getStatutBadge(demande.status || 'EN_ATTENTE')}`}>
                            {demande.status || 'EN_ATTENTE'}
                          </span>
                        </div>
                        {demande.createdAt && (
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            <i className="ph-calendar" style={{ marginRight: '0.25rem' }}></i>
                            Soumis le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              
              {/* Demandes de documents */}
              {documentRequests && documentRequests.length > 0 && (
                <div className="info-card" style={{ marginBottom: '1.5rem', background: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h6 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="ph-file-text" style={{ color: '#ea580c' }}></i>
                    Demandes de documents ({documentRequests.length})
                  </h6>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {documentRequests.map((demande, index) => (
                      <div key={index} style={{ 
                        padding: '1rem', 
                        background: '#f8fafc', 
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                              {demande.documentType || `Document #${demande.id || index + 1}`}
                            </div>
                            {demande.city && (
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Ville: {demande.city}
                              </div>
                            )}
                            {demande.receptionMethod && (
                              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Méthode: {demande.receptionMethod}
                              </div>
                            )}
                          </div>
                          <span className={`badge ${getStatutBadge(demande.status || 'EN_ATTENTE')}`}>
                            {demande.status || 'EN_ATTENTE'}
                          </span>
                        </div>
                        {demande.createdAt && (
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                            <i className="ph-calendar" style={{ marginRight: '0.25rem' }}></i>
                            Soumis le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Message si aucune demande */}
              {(!scholarships || scholarships.length === 0) && 
               (!foreignStudies || foreignStudies.length === 0) &&
               (!permutationRequests || permutationRequests.length === 0) &&
               (!orientationRequests || orientationRequests.length === 0) && 
               (!documentRequests || documentRequests.length === 0) && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem', 
                  background: '#f8fafc', 
                  borderRadius: '0.75rem',
                  border: '1px dashed #e5e7eb'
                }}>
                  <i className="ph-clipboard-text" style={{ fontSize: '2rem', color: '#9ca3af', marginBottom: '0.5rem', display: 'block' }}></i>
                  <p style={{ color: '#6b7280', margin: 0 }}>Aucune demande pour le moment</p>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                    Vos demandes d'assistance apparaîtront ici une fois soumises.
                  </p>
                </div>
              )}
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-secondary" 
            onClick={async () => {
              try {
                console.log('🔄 Rafraîchissement manuel...');
                const json = await apiRequest('/scholarships/applications/my-applications');
                const u = json?.data ?? json;
                const applications = Array.isArray(u) ? u : (u ? [u] : []);
                setScholarships(applications);
                console.log('✅ Données rafraîchies:', applications.length, 'demande(s)');
                alert(`Données rafraîchies ! ${applications.length} demande(s) trouvée(s).`);
              } catch (err) {
                console.error('❌ Erreur:', err);
                alert('Erreur lors du rafraîchissement');
              }
            }}
            style={{ marginRight: '0.5rem' }}
          >
            <i className="ph-arrow-clockwise icon-margin-right"></i>
            Actualiser
          </button>
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
      </div>

      {/* Afficher les demandes de bourses même sans dossier */}
      {scholarships && scholarships.length > 0 ? (
          <div className="cards-grid">
            {scholarships.map(demande => (
              <div key={demande.id || demande.scholarshipId} className="grid-col">
                <div className="bourse-card">
                  <div className="bourse-header">
                    <div className="bourse-title">
                      <h6 className="bourse-title-text">
                        {demande.scholarship?.title || 'Demande de bourse libre'}
                      </h6>
                    </div>
                    <div className="bourse-montant">
                      <span className="montant">
                        {demande.scholarship?.amount || 'À déterminer'}
                      </span>
                    </div>
                  </div>
                  <div className="bourse-content">
                    <div className="bourse-meta">
                      {demande.scholarship ? (
                        <>
                      <div className="meta-item">
                            <i className="ph-globe icon-margin-right"></i>
                        <span className="bourse-universite">
                              Pays: {demande.scholarship?.country?.name || demande.scholarship?.country || demande.targetCountry || 'Non spécifié'} 
                        </span>
                      </div>
                      <div className="meta-item">
                            <i className="ph-building icon-margin-right"></i>
                        <span className="bourse-universite">
                              Université: {demande.scholarship?.university?.name || demande.scholarship?.university || demande.targetSchool || 'Non précisée'}
                        </span>
                      </div>
                        </>
                      ) : (
                        <>
                          <div className="meta-item">
                            <i className="ph-graduation-cap icon-margin-right"></i>
                            <span className="bourse-universite">
                              Niveau: {demande.currentLevel || 'Non spécifié'}
                            </span>
                    </div>
                          <div className="meta-item">
                            <i className="ph-book icon-margin-right"></i>
                            <span className="bourse-universite">
                              Domaine: {demande.studyField || 'Non spécifié'}
                            </span>
                          </div>
                          {demande.targetCountry && (
                            <div className="meta-item">
                              <i className="ph-globe icon-margin-right"></i>
                              <span className="bourse-universite">
                                Pays cible: {demande.targetCountry}
                              </span>
                            </div>
                          )}
                          {demande.targetSchool && (
                            <div className="meta-item">
                              <i className="ph-building icon-margin-right"></i>
                              <span className="bourse-universite">
                                École cible: {demande.targetSchool}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      {demande.createdAt && (
                        <div className="meta-item">
                          <i className="ph-calendar icon-margin-right"></i>
                          <span className="bourse-universite">
                            Soumis le {new Date(demande.createdAt).toLocaleDateString('fr-FR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    {demande.objective && (
                      <div className="bourse-description" style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                          <strong>Objectif:</strong> {demande.objective}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bourse-footer">
                    <div className="bourse-status">
                      <span className={`badge ${getStatutBadge(demande.status || 'EN_ATTENTE')}`}>
                        <i className={`${getStatutIcon(demande.status || 'EN_ATTENTE')} icon-margin-right-small`}></i>
                        {formatStatus(demande.status || 'EN_ATTENTE')}
                      </span>
                    </div>
                    <div className="bourse-actions">
                      <button className="btn-sm-outline" onClick={() => {
                        // Afficher les détails de la candidature
                        console.log('Détails de la candidature:', demande);
                        alert(`Détails de la candidature:\n\nStatut: ${formatStatus(demande.status)}\nNiveau: ${demande.currentLevel || 'N/A'}\nDomaine: ${demande.studyField || 'N/A'}\nPays cible: ${demande.targetCountry || 'N/A'}`);
                      }}>
                        <i className="ph-eye icon-margin-right-small"></i>
                        Voir
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
            <Link to="/assistance-demande" className="btn-orange">
              <i className="ph-plus icon-margin-right"></i>
              Faire une demande
            </Link>
          </div>
        )}
    </div>
  );

      case 'etudes-etranger':
        return (
          <div className="tab-content-wrapper">
            <div className="header-section">
              <h5>Mes candidatures d'études à l'étranger</h5>
              <button 
                className="btn-secondary" 
                onClick={async () => {
                  try {
                    console.log('🔄 Rafraîchissement manuel des études à l\'étranger...');
                    const json = await apiRequest('/foreign-study/applications/my-applications');
                    const u = json?.data ?? json;
                    const applications = Array.isArray(u) ? u : (u ? [u] : []);
                    setForeignStudies(applications);
                    console.log('✅ Données rafraîchies:', applications.length, 'candidature(s)');
                    alert(`Données rafraîchies ! ${applications.length} candidature(s) trouvée(s).`);
                  } catch (err) {
                    console.error('❌ Erreur:', err);
                    alert('Erreur lors du rafraîchissement');
                  }
                }}
                style={{ marginRight: '0.5rem' }}
              >
                <i className="ph-arrow-clockwise icon-margin-right"></i>
                Actualiser
              </button>
              <Link to="/etudes-etranger" className="btn-orange">
                <i className="ph-plus icon-margin-right"></i>
                Nouvelle candidature
              </Link>
            </div>

            {foreignStudies && foreignStudies.length > 0 ? (
              <div className="cards-grid">
                {foreignStudies.map(demande => (
                  <div key={demande.id} className="grid-col">
                    <div className="bourse-card">
                      <div className="bourse-header">
                        <div className="bourse-title">
                          <h6 className="bourse-title-text">
                            {demande.targetSchool || demande.targetCountry || 'Candidature d\'études à l\'étranger'}
                          </h6>
                        </div>
                        <div className="bourse-montant">
                          <span className="montant">
                            {demande.budgetEstimate ? `${demande.budgetEstimate} €` : 'Budget non spécifié'}
                          </span>
                        </div>
                      </div>
                      <div className="bourse-content">
                        <div className="bourse-meta">
                          <div className="meta-item">
                            <i className="ph-globe icon-margin-right"></i>
                            <span className="bourse-universite">
                              Pays: {demande.targetCountry || 'Non spécifié'}
                            </span>
                          </div>
                          {demande.targetCity && (
                            <div className="meta-item">
                              <i className="ph-map-pin icon-margin-right"></i>
                              <span className="bourse-universite">
                                Ville: {demande.targetCity}
                              </span>
                            </div>
                          )}
                          {demande.targetSchool && (
                            <div className="meta-item">
                              <i className="ph-building icon-margin-right"></i>
                              <span className="bourse-universite">
                                École: {demande.targetSchool}
                              </span>
                            </div>
                          )}
                          {demande.targetLevel && (
                            <div className="meta-item">
                              <i className="ph-graduation-cap icon-margin-right"></i>
                              <span className="bourse-universite">
                                Niveau: {demande.targetLevel}
                              </span>
                            </div>
                          )}
                          {demande.studyField && (
                            <div className="meta-item">
                              <i className="ph-book icon-margin-right"></i>
                              <span className="bourse-universite">
                                Domaine: {demande.studyField}
                              </span>
                            </div>
                          )}
                          {demande.createdAt && (
                            <div className="meta-item">
                              <i className="ph-calendar icon-margin-right"></i>
                              <span className="bourse-universite">
                                Soumis le {new Date(demande.createdAt).toLocaleDateString('fr-FR', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        {(demande.assistanceHousing || demande.assistanceEnrollment) && (
                          <div className="bourse-description" style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                              <strong>Assistance demandée:</strong>
                              {demande.assistanceHousing && ' Logement'}
                              {demande.assistanceHousing && demande.assistanceEnrollment && ' •'}
                              {demande.assistanceEnrollment && ' Inscription'}
                            </p>
                          </div>
                        )}
                        {demande.complementaryInfo && (
                          <div className="bourse-description" style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                              <strong>Personne concernée:</strong> {demande.complementaryInfo.firstName} {demande.complementaryInfo.lastName}
                              {demande.complementaryInfo.email && ` (${demande.complementaryInfo.email})`}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="bourse-footer">
                        <div className="bourse-status">
                          <span className={`badge ${getStatutBadge(demande.status || 'EN_ATTENTE')}`}>
                            <i className={`${getStatutIcon(demande.status || 'EN_ATTENTE')} icon-margin-right-small`}></i>
                            {formatStatus(demande.status || 'EN_ATTENTE')}
                          </span>
                        </div>
                        <div className="bourse-actions">
                          <button className="btn-sm-outline" onClick={() => {
                            console.log('Détails de la candidature:', demande);
                            alert(`Détails de la candidature:\n\nStatut: ${formatStatus(demande.status)}\nPays: ${demande.targetCountry || 'N/A'}\nVille: ${demande.targetCity || 'N/A'}\nÉcole: ${demande.targetSchool || 'N/A'}\nNiveau: ${demande.targetLevel || 'N/A'}\nDomaine: ${demande.studyField || 'N/A'}\nBudget: ${demande.budgetEstimate || 'N/A'}`);
                          }}>
                            <i className="ph-eye icon-margin-right-small"></i>
                            Voir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
        <div className="empty-state">
                <i className="ph-globe display-4 text-muted icon-margin-bottom"></i>
                <h5>Aucune candidature d'études à l'étranger</h5>
          <p className="text-muted">
                  Vous n'avez pas encore créé de candidature pour des études à l'étranger.
          </p>
                <Link to="/etudes-etranger" className="btn-orange">
            <i className="ph-plus icon-margin-right"></i>
                  Créer une candidature
                </Link>
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

  if (loading) {
    return (
      <div className="school-detail-loading">
        <div className="loading-spinner">
          <div className="spinner-container">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <div className="loading-text">Chargement du profil...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="school-not-found">
        <div className="not-found-content">
          <i className="ph-user"></i>
          <h2>Profil non trouvé</h2>
          <p>Impossible de charger votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="school-detail-page">
        <div className="school-detail-container">
          <div className="school-header">
            <div className="school-banner" style={{ position: 'relative' }}>
              <video controls autoPlay muted loop poster={user.coverImage || "/images/poster/poster.jpg"}>
                <source src={user?.presentationVideo || "/video/video.mp4"} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                zIndex: 10
              }}>
                <input
                  type="file"
                  id="presentation-video-input"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  style={{ display: 'none' }}
                  disabled={uploadingVideo}
                />
                <label 
                  htmlFor="presentation-video-input" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    background: uploadingVideo ? '#9ca3af' : '#ea580c',
                    color: 'white',
                    borderRadius: '50%',
                    cursor: uploadingVideo ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    pointerEvents: uploadingVideo ? 'none' : 'auto',
                    border: '2px solid white'
                  }}
                  onMouseEnter={(e) => {
                    if (!uploadingVideo) {
                      e.target.style.background = '#f97316';
                      e.target.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!uploadingVideo) {
                      e.target.style.background = '#ea580c';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                  title={uploadingVideo ? 'Téléchargement en cours...' : 'Mettre à jour la vidéo'}
                >
                  {uploadingVideo ? (
                    <i className="ph-spinner-gap ph-spin" style={{ fontSize: '20px' }}></i>
                  ) : (
                    <i className="ph-video" style={{ fontSize: '20px' }}></i>
                  )}
                </label>
              </div>
                  </div>
            <div className="school-info">
              <div className="school-header-content">
                <div className="school-main-info">
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    paddingTop: '10px'
                  }}>
                    <div className="school-logo" style={{ 
                      marginTop: '-90px', 
                      marginBottom: '1rem',
                      width: '200px',
                      height: '180px',
                      position: 'relative',
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none'
                    }}>
                      <Avatar size="large" className="" />
                      <input
                        type="file"
                        id="profile-image-input"
                        accept="image/*"
                        onChange={handleProfileImageSelect}
                        style={{ display: 'none' }}
                      />
                      <label 
                        htmlFor="profile-image-input" 
                        style={{
                          position: 'absolute',
                          bottom: '5px',
                          right: '5px',
                          background: '#ea580c',
                          color: 'white',
                          border: '2px solid white',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          zIndex: 10
                        }}
                      >
                        <i className="ph-camera"></i>
                      </label>
                  </div>
                    <div className="school-title-row" style={{ flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                      <div className="school-name-container" style={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <h1 className="school-name" style={{ textAlign: 'center', marginTop: 0, marginBottom: 0 }}>{user?.firstName || 'Prénom'} {user?.lastName || 'Nom'}</h1>
                </div>
                      <div className="school-badges">
                        {user?.academicLevel && (
                          <span className="school-level">
                            {user.academicLevel}
                          </span>
                        )}
                        {/* <span className="school-verified">
                          <i className="ph-check-circle-fill"></i>
                          Vérifié
                        </span> */}
                      </div>
                    </div>
                  </div>
                  
                  {user?.bio && (
                    <p className="school-description">{user.bio}</p>
                  )}
                  
                  <div className="school-quick-info">
                    {user?.city && (
                      <div className="quick-info-item">
                        <i className="ph-map-pin"></i>
                        <span>{user.city}{user.country ? `, ${user.country}` : ''}</span>
                      </div>
                    )}
                    {user?.email && (
                      <div className="quick-info-item">
                        <i className="ph-envelope"></i>
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user?.dateOfBirth && (
                      <div className="quick-info-item">
                        <i className="ph-calendar"></i>
                        <span>Né(e) le {new Date(user.dateOfBirth).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    {user?.nationality && (
                      <div className="quick-info-item">
                        <i className="ph-flag"></i>
                        <span>{user.nationality}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="school-actions">
                <button 
                  className="action-btn primary"
                  onClick={handleUpdateProfile}
                >
                  <i className="ph-pencil"></i>
                  Modifier mon profil
                </button>
                <button className="action-btn outline">
                  <i className="ph-share-network"></i>
                  Partager
                </button>
                {/* <div className="school-stats">
                  <div className="stat-item">
                    <div className="stat-number">{(data?.dossiers || []).length}</div>
                    <div className="stat-label">Dossiers</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{(data?.demandesBourses || scholarships || []).length}</div>
                    <div className="stat-label">Bourses</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{(data?.demandesPermutation || []).length}</div>
                    <div className="stat-label">Permutations</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{(data?.demandesDocuments || []).length}</div>
                    <div className="stat-label">Documents</div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Bloc Quiz - Résultats, Performances et Récompenses */}
          {token && (
            <QuizResultsBlock />
          )}

          <div className="school-content">
            <div className="content-sidebar">
              {user?.interests && user.interests.length > 0 && (
                <div className="details-section">
                  <h3 className="section-title">
                    <i className="ph-heart"></i>
                    Centres d'intérêt
                  </h3>
                  <div className="activities-grid">
                    {user.interests.map((interest, index) => (
                      <div key={index} className="activity-item">
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="content-main">
              <div className="content-tabs">
                  {data.tabs.map(tab => (
                    <button
                      key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={tab.icon}></i>
                    {tab.label}
                    </button>
                  ))}
              </div>

              <div className="tab-content">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  }}>Pays de nationalité</label>
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

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Profession</label>
                <input 
                  type="text" 
                  name="profession"
                  className="form-control" 
                  value={form.profession}
                  onChange={handleChange}
                  placeholder="Ex: Enseignant, Ingénieur, Médecin..."
                  style={{ width: '100%' }}
                />
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
                  }}>Pays de résidence</label>
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

      {/* Modal Expérience professionnelle */}
      {showExperienceForm && (
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
            maxWidth: '600px',
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
              <h3 style={{ margin: 0, color: '#1f2937' }}>
                {editingExperience !== null ? 'Modifier l\'expérience' : 'Ajouter une expérience professionnelle'}
              </h3>
              <button 
                onClick={() => {
                  setShowExperienceForm(false);
                  setEditingExperience(null);
                  setExperienceForm({ title: '', company: '', startDate: '', endDate: '', description: '', current: false });
                }}
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

            <form onSubmit={handleExperienceSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Poste *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={experienceForm.title}
                  onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Entreprise *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={experienceForm.company}
                  onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Date de début *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={experienceForm.startDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Date de fin</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={experienceForm.endDate}
                    onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                    disabled={experienceForm.current}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '500',
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="checkbox" 
                    checked={experienceForm.current}
                    onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked, endDate: e.target.checked ? '' : experienceForm.endDate })}
                  />
                  Poste actuel
                </label>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Description</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowExperienceForm(false);
                    setEditingExperience(null);
                    setExperienceForm({ title: '', company: '', startDate: '', endDate: '', description: '', current: false });
                  }}
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
                >
                  {editingExperience !== null ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Formation */}
      {showTrainingForm && (
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
            maxWidth: '600px',
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
              <h3 style={{ margin: 0, color: '#1f2937' }}>
                {editingTraining !== null ? 'Modifier la formation' : 'Ajouter une formation'}
              </h3>
              <button 
                onClick={() => {
                  setShowTrainingForm(false);
                  setEditingTraining(null);
                  setTrainingForm({ title: '', institution: '', startDate: '', endDate: '', description: '', certificate: '' });
                }}
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

            <form onSubmit={handleTrainingSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Titre de la formation *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={trainingForm.title}
                  onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Institution *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={trainingForm.institution}
                  onChange={(e) => setTrainingForm({ ...trainingForm, institution: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Date de début *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={trainingForm.startDate}
                    onChange={(e) => setTrainingForm({ ...trainingForm, startDate: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Date de fin *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={trainingForm.endDate}
                    onChange={(e) => setTrainingForm({ ...trainingForm, endDate: e.target.value })}
                    required
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
                }}>Certificat obtenu</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={trainingForm.certificate}
                  onChange={(e) => setTrainingForm({ ...trainingForm, certificate: e.target.value })}
                  placeholder="Ex: Certificat de formation..."
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>Description</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={trainingForm.description}
                  onChange={(e) => setTrainingForm({ ...trainingForm, description: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowTrainingForm(false);
                    setEditingTraining(null);
                    setTrainingForm({ title: '', institution: '', startDate: '', endDate: '', description: '', certificate: '' });
                  }}
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
                >
                  {editingTraining !== null ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cursus scolaire */}
      {showAcademicForm && (
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
            maxWidth: '600px',
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
              <h3 style={{ margin: 0, color: '#1f2937' }}>
                {editingAcademic !== null ? 'Modifier le cursus' : 'Ajouter un cursus scolaire'}
              </h3>
              <button 
                onClick={() => {
                  setShowAcademicForm(false);
                  setEditingAcademic(null);
                  setAcademicForm({ school: '', level: '', field: '', startDate: '', endDate: '', diploma: '', average: '' });
                }}
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

            <form onSubmit={handleAcademicSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151'
                }}>École/Établissement *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={academicForm.school}
                  onChange={(e) => setAcademicForm({ ...academicForm, school: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Niveau *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={academicForm.level}
                    onChange={(e) => setAcademicForm({ ...academicForm, level: e.target.value })}
                    placeholder="Ex: Terminale, Licence 3..."
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Domaine</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={academicForm.field}
                    onChange={(e) => setAcademicForm({ ...academicForm, field: e.target.value })}
                    placeholder="Ex: Sciences, Littérature..."
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
                  }}>Date de début *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={academicForm.startDate}
                    onChange={(e) => setAcademicForm({ ...academicForm, startDate: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Date de fin *</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={academicForm.endDate}
                    onChange={(e) => setAcademicForm({ ...academicForm, endDate: e.target.value })}
                    required
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
                  }}>Diplôme obtenu</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={academicForm.diploma}
                    onChange={(e) => setAcademicForm({ ...academicForm, diploma: e.target.value })}
                    placeholder="Ex: Baccalauréat, Licence..."
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151'
                  }}>Moyenne</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={academicForm.average}
                    onChange={(e) => setAcademicForm({ ...academicForm, average: e.target.value })}
                    placeholder="Ex: 15.5"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAcademicForm(false);
                    setEditingAcademic(null);
                    setAcademicForm({ school: '', level: '', field: '', startDate: '', endDate: '', diploma: '', average: '' });
                  }}
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
                >
                  {editingAcademic !== null ? 'Modifier' : 'Ajouter'}
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