import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import InitialAssistanceForm from './assistance/InitialAssistanceForm';
import BourseForm from './assistance/BourseForm';
import EtudesEtrangerForm from './assistance/EtudesEtrangerForm';
import PermutationForm from './assistance/PermutationForm';
import OrientationForm from './assistance/OrientationForm';
import DocumentForm from './assistance/DocumentForm';
import LoginRequiredModal from './assistance/LoginRequiredModal';
import SuccessModal from './assistance/SuccessModal';
import tokenManager from '../helper/tokenManager';

const API_BASE_URL = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const fallbackDocTypes = [
  { id: 'bulletin', title: 'Bulletin scolaire', price: 1500, avgDelay: '3-5 jours' },
  { id: 'certificat-sco', title: 'Certificat de scolarité', price: 1200, avgDelay: '2-4 jours' },
  { id: 'certification', title: 'Certification', price: 2000, avgDelay: '5-7 jours' },
  { id: 'dup-diplome', title: 'Duplication de diplôme', price: 3000, avgDelay: '7-10 jours' },
  { id: 'attestation-reussite', title: 'Attestation de réussite', price: 1000, avgDelay: '2-3 jours' },
];

// Tarifs mockés pour les options
const mockTariffs = {
  legalisation: 500, // par copie
  traduction: 2000, // par langue et copie
  certificationMinisterielle: 3500, // tarif unique ou par copie
  email: 0,
  agence: 0,
};

const mockCities = [
  { id: 'abj', name: 'Abidjan', deliveryCost: 2000 },
  { id: 'yop', name: 'Yopougon', deliveryCost: 1500 },
  { id: 'coc', name: 'Cocody', deliveryCost: 1800 },
  { id: 'bou', name: 'Bouaké', deliveryCost: 2500 },
  { id: 'yak', name: 'Yamoussoukro', deliveryCost: 2200 },
];

const mockSchools = [
  { id: 'lycee1', cityId: 'abj', name: 'Lycée Classique d\'Abidjan' },
  { id: 'lycee2', cityId: 'abj', name: 'Lycée Technique d\'Abidjan' },
  { id: 'lycee3', cityId: 'yop', name: 'Lycée Municipal de Yopougon' },
  { id: 'lycee4', cityId: 'coc', name: 'Lycée Sainte-Marie de Cocody' },
  { id: 'lycee5', cityId: 'bou', name: 'Lycée Municipal de Bouaké' },
  { id: 'lycee6', cityId: 'yak', name: 'Lycée Scientifique de Yamoussoukro' },
];

const mockZones = [
  { id: 'cedeao', name: 'CEDEAO', cost: 3000 },
  { id: 'hors-cedeao', name: 'Hors CEDEAO', cost: 5000 },
  { id: 'asie', name: 'Asie', cost: 7000 },
  { id: 'europe', name: 'Europe', cost: 6000 },
];

const AssistanceDemandeComponent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('access_token'));
  const [initialFormCompleted, setInitialFormCompleted] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [assistanceType, setAssistanceType] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState({ title: '', message: '' });
  
  const [formData, setFormData] = useState({
    // Données du formulaire initial
    ...initialFormData,
    
    // Étape 1: Localisation (selon doc: Ville + Établissement) - pour documents uniquement
    city: '',
    school: '',
    
    // Étape 2: Méthode de réception - pour documents uniquement
    receptionMode: '', // 'email', 'agence', 'expedition'
    shippingZone: '', // Si expédition: 'CEDEAO', 'Hors CEDEAO', 'Asie', 'Europe'
    
    // Étape 3: Type de document - pour documents uniquement
    documentType: '', // Bulletin scolaire, Certificat de scolarité, Certification, Duplication de diplôme, Attestation de réussite
    
    // Étape 4: Informations additionnelles - pour documents uniquement
    classLevel: '',
    copies: 1,
    legalisation: false,
    translation: false,
    translationLanguages: [],
    translationCopies: 1,
    certificationMinisterielle: false,
  });

  const [pricing, setPricing] = useState({
    deplacement: 0,
    document: 0,
    legalisation: 0,
    traduction: 0,
    certification: 0,
    expedition: 0,
    total: 0,
  });

  const [errors, setErrors] = useState({});

  // Fonction pour mapper le statut du formulaire vers l'API
  // Note: L'API n'accepte que ELEVE, PARENT, ENSEIGNANT, AUTRE (pas ETUDIANT)
  const mapApplicantStatus = (statut) => {
    const mapping = {
      'Élève': 'ELEVE',
      'Étudiant': 'ELEVE', // Étudiant est mappé vers ELEVE car l'API n'a pas de valeur ETUDIANT
      'Parent': 'PARENT',
      'Enseignant': 'ENSEIGNANT',
      'Autre': 'AUTRE'
    };
    return mapping[statut] || 'ELEVE'; // Par défaut ELEVE au lieu de ETUDIANT
  };

  // Fonction pour mapper le type d'assistance (location) vers l'API
  const mapAssistanceType = (location) => {
    const mapping = {
      'CI': 'EN_CIV',
      'Hors CI': 'HORS_CIV'
    };
    return mapping[location] || 'EN_CIV';
  };

  // Fonction pour formater le numéro de téléphone au format attendu par l'API
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.trim().replace(/\s+/g, '');
    // Si le numéro commence par 0, le remplacer par +225
    if (cleaned.startsWith('0')) {
      return '+225 ' + cleaned.substring(1).replace(/(\d{2})(?=\d)/g, '$1 ');
    }
    // Si le numéro commence déjà par +225, le formater
    if (cleaned.startsWith('+225')) {
      const rest = cleaned.substring(4).trim();
      return '+225 ' + rest.replace(/(\d{2})(?=\d)/g, '$1 ');
    }
    // Si le numéro commence par 225, ajouter le +
    if (cleaned.startsWith('225')) {
      const rest = cleaned.substring(3).trim();
      return '+225 ' + rest.replace(/(\d{2})(?=\d)/g, '$1 ');
    }
    return phone.trim();
  };

  // Mutation pour soumettre une demande d'études à l'étranger
  const applyForeignStudyMutation = useMutation({
    mutationFn: async (applicationData) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Vous devez être connecté pour soumettre une demande d\'études à l\'étranger');
      }

      const response = await fetch(`${API_BASE_URL}/foreign-study/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `Erreur ${response.status}` }));
        console.error('❌ Erreur API Foreign Study:', {
          status: response.status,
          statusText: response.statusText,
          error: error,
          errorDetails: error.errors || error.message,
          fullError: JSON.stringify(error, null, 2),
        });
        // Afficher les détails des erreurs de validation si disponibles
        let errorMessage = error.message || 'Erreur lors de la soumission de la demande';
        if (error.errors) {
          if (Array.isArray(error.errors)) {
            errorMessage = error.errors.map(e => typeof e === 'string' ? e : e.message || JSON.stringify(e)).join(', ');
          } else if (typeof error.errors === 'object') {
            errorMessage = Object.entries(error.errors)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('✅ Demande d\'études à l\'étranger soumise avec succès:', data);
      setSuccessModalData({
        title: 'Demande soumise avec succès !',
        message: 'Votre demande d\'études à l\'étranger a été enregistrée et sera traitée dans les plus brefs délais.'
      });
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la demande d\'études à l\'étranger:', error);
      alert(`Erreur: ${error.message}`);
    },
  });

  // Mutation pour soumettre une demande de permutation
  const applyPermutationMutation = useMutation({
    mutationFn: async (applicationData) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Vous devez être connecté pour soumettre une demande de permutation');
      }

      const response = await fetch(`${API_BASE_URL}/permutation/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `Erreur ${response.status}` }));
        console.error('❌ Erreur API Permutation:', {
          status: response.status,
          statusText: response.statusText,
          error: error,
          fullError: JSON.stringify(error, null, 2),
        });
        let errorMessage = error.message || 'Erreur lors de la soumission de la demande';
        if (error.errors) {
          if (Array.isArray(error.errors)) {
            errorMessage = error.errors.map(e => typeof e === 'string' ? e : e.message || JSON.stringify(e)).join(', ');
          } else if (typeof error.errors === 'object') {
            errorMessage = Object.entries(error.errors)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('✅ Demande de permutation soumise avec succès:', data);
      setSuccessModalData({
        title: 'Demande soumise avec succès !',
        message: 'Votre demande de permutation a été enregistrée et sera traitée dans les plus brefs délais.'
      });
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la demande de permutation:', error);
      alert(`Erreur: ${error.message}`);
    },
  });

  // Mutation pour soumettre une demande d'orientation scolaire
  const applyOrientationMutation = useMutation({
    mutationFn: async (applicationData) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Vous devez être connecté pour soumettre une demande d\'orientation');
      }

      const response = await fetch(`${API_BASE_URL}/orientation-request/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `Erreur ${response.status}` }));
        console.error('❌ Erreur API Orientation:', {
          status: response.status,
          statusText: response.statusText,
          error: error,
          fullError: JSON.stringify(error, null, 2),
        });
        let errorMessage = error.message || 'Erreur lors de la soumission de la demande';
        if (error.errors) {
          if (Array.isArray(error.errors)) {
            errorMessage = error.errors.map(e => typeof e === 'string' ? e : e.message || JSON.stringify(e)).join(', ');
          } else if (typeof error.errors === 'object') {
            errorMessage = Object.entries(error.errors)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('✅ Demande d\'orientation soumise avec succès:', data);
      setSuccessModalData({
        title: 'Demande soumise avec succès !',
        message: 'Votre demande d\'orientation scolaire a été enregistrée et sera traitée dans les plus brefs délais.'
      });
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la demande d\'orientation:', error);
      alert(`Erreur: ${error.message}`);
    },
  });

  // Mutation pour soumettre une demande de document
  const applyDocumentMutation = useMutation({
    mutationFn: async (applicationData) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Vous devez être connecté pour soumettre une demande de document');
      }

      const response = await fetch(`${API_BASE_URL}/document-request/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `Erreur ${response.status}` }));
        console.error('❌ Erreur API Document:', {
          status: response.status,
          statusText: response.statusText,
          error: error,
          fullError: JSON.stringify(error, null, 2),
        });
        let errorMessage = error.message || 'Erreur lors de la soumission de la demande';
        if (error.errors) {
          if (Array.isArray(error.errors)) {
            errorMessage = error.errors.map(e => typeof e === 'string' ? e : e.message || JSON.stringify(e)).join(', ');
          } else if (typeof error.errors === 'object') {
            errorMessage = Object.entries(error.errors)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('✅ Demande de document soumise avec succès:', data);
      setSuccessModalData({
        title: 'Demande soumise avec succès !',
        message: 'Votre demande de document a été enregistrée et sera traitée dans les plus brefs délais.'
      });
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la demande de document:', error);
      alert(`Erreur: ${error.message}`);
    },
  });

  // Mutation pour soumettre une demande d'assistance de bourse
  const applyScholarshipAssistanceMutation = useMutation({
    mutationFn: async (applicationData) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Vous devez être connecté pour soumettre une demande d\'assistance de bourse');
      }

      // Utiliser l'endpoint pour postuler à une bourse libre (sans bourse spécifique)
      const response = await fetch(`${API_BASE_URL}/scholarships/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `Erreur ${response.status}` }));
        console.error('❌ Erreur API Assistance Bourse:', {
          status: response.status,
          statusText: response.statusText,
          error: error,
          endpoint: `${API_BASE_URL}/scholarships/apply`,
        });
        let errorMessage = error.message || 'Erreur lors de la soumission de la demande';
        if (error.errors) {
          if (Array.isArray(error.errors)) {
            errorMessage = error.errors.map(e => typeof e === 'string' ? e : e.message || JSON.stringify(e)).join(', ');
          } else if (typeof error.errors === 'object') {
            errorMessage = Object.entries(error.errors)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data) => {
      console.log('✅ Demande d\'assistance de bourse soumise avec succès:', data);
      setSuccessModalData({
        title: 'Demande soumise avec succès !',
        message: 'Votre demande d\'assistance de bourse a été enregistrée et sera traitée dans les plus brefs délais.'
      });
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la demande d\'assistance de bourse:', error);
      alert(`Erreur: ${error.message}`);
    },
  });

  // Vérifier l'authentification et charger le profil
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const token = localStorage.getItem('access_token');
      const authenticated = !!token;
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        setLoadingProfile(false);
        // ✅ Afficher le modal de connexion à l'arrivée sur la page
        setShowLoginModal(true);
        return;
      }

      // Charger le profil utilisateur seulement si authentifié
      try {
        setLoadingProfile(true);
        const response = await tokenManager.fetchWithAuth(`${API_BASE_URL}/profile/student`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const json = await response.json();
        const userData = json?.data ?? json;
        setUserProfile(userData);
        
        // Log pour déboguer les données reçues
        console.log('📋 Données utilisateur reçues:', userData);
        
        // Pré-remplir les données du formulaire initial avec tous les champs possibles
        const prefillData = {
          demandeurNom: userData.lastName || userData.nom || '',
          demandeurPrenoms: userData.firstName || userData.prenom || '',
          demandeurTelephone: userData.phone || userData.telephone || userData.mobile || userData.phoneNumber || '',
          demandeurEmail: userData.email || '',
          demandeurPays: userData.country || userData.pays || userData.residenceCountry || '',
          demandeurStatut: userData.status || userData.statut || userData.applicantStatus || '',
        };
        
        console.log('📝 Données pré-remplies:', prefillData);
        setInitialFormData(prefillData);
      } catch (err) {
        console.error('❌ Erreur chargement profil:', err);
        // Si erreur 401, simplement mettre à jour l'état d'authentification
        if (err.message.includes('401') || err.message.includes('token')) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsAuthenticated(false);
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    checkAuthAndLoadProfile();

    const handleStorageChange = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
      // ✅ Pas de redirection - mettre à jour seulement l'état
      if (token) {
        checkAuthAndLoadProfile();
      } else {
        setUserProfile(null);
        setInitialFormData({});
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // Handler pour le formulaire initial
  const handleInitialFormComplete = (data) => {
    setInitialFormData(data);
    setAssistanceType(data.assistanceType);
    setInitialFormCompleted(true);
    setFormData(prev => ({ ...prev, ...data }));
    
    // Si c'est "Demande de documents", on garde le flow actuel
    // Sinon, on réinitialise les steps pour le nouveau formulaire
    if (data.assistanceType !== 'Demande de documents') {
      setCurrentStep(1);
    }
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll vers le haut lors des changements d'étape
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Scroll vers le haut lors des changements de formulaire
  useEffect(() => {
    if (initialFormCompleted || assistanceType) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialFormCompleted, assistanceType]);

  // Récupérer les villes disponibles (selon doc: liste dynamique)
  const { data: cities } = useQuery({
    queryKey: ['assistance-cities'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/assistance/cities`);
        if (!response.ok) throw new Error('api cities');
        const result = await response.json();
        const list = result.data || [];
        return list.length ? list : mockCities;
      } catch (e) {
        return mockCities;
      }
    },
  });

  // Récupérer les établissements selon la ville
  const { data: schools } = useQuery({
    queryKey: ['assistance-schools', formData.city],
    queryFn: async () => {
      if (!formData.city) return [];
      try {
        const response = await fetch(`${API_BASE_URL}/assistance/schools?cityId=${formData.city}`);
        if (!response.ok) throw new Error('api schools');
        const result = await response.json();
        const list = result.data || [];
        if (list.length) return list;
      } catch (e) {
        /* fall back */
      }
      return mockSchools.filter((s) => s.cityId === formData.city);
    },
    enabled: !!formData.city,
  });

  // Récupérer les types de documents (selon doc: Bulletin scolaire, Certificat de scolarité, Certification, Duplication de diplôme, Attestation de réussite)
  const { data: documentTypes } = useQuery({
    queryKey: ['assistance-document-types'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/assistance/document-types`);
        if (!response.ok) throw new Error('api docs');
        const result = await response.json();
        const list = result.data || [];
        return list.length ? list : fallbackDocTypes;
      } catch (e) {
        return fallbackDocTypes;
      }
    },
  });

  // Récupérer les zones d'expédition (selon doc: CEDEAO, Hors CEDEAO, Asie, Europe)
  const { data: shippingZones } = useQuery({
    queryKey: ['assistance-shipping-zones'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/assistance/shipping-zones`);
        if (!response.ok) throw new Error('api zones');
        const result = await response.json();
        const list = result.data || [];
        return list.length ? list : mockZones;
      } catch (e) {
        return mockZones;
      }
    },
  });

  // Calculer le devis
  const calculateQuote = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/assistance/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors du calcul du devis');
      }
      return response.json();
    },
    onSuccess: (data) => {
      const pricingData = data.data || data;
      // Si l'API retourne un total de 0 ou des données vides, utiliser le calcul local
      if (!pricingData || pricingData.total === 0 || pricingData.total === undefined) {
        // Le calcul local sera déclenché dans le useEffect
        return;
      }
      setPricing(pricingData);
    },
  });

  // Créer la demande - Utilise l'endpoint document-request pour les demandes de documents
  const createRequest = useMutation({
    mutationFn: async (data) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Vous devez être connecté pour créer une demande');
      }
      
      // Mapper les données du formulaire multi-étapes vers le format de l'API document-request
      const cityName = cities?.find(c => c.id === data.city)?.name || data.city || '';
      const schoolName = schools?.find(s => s.id === data.school)?.name || data.school || '';
      
      // Mapper receptionMode vers receptionMethod
      let receptionMethod = 'EMAIL';
      if (data.receptionMode === 'email') {
        receptionMethod = 'EMAIL';
      } else if (data.receptionMode === 'agence') {
        receptionMethod = 'RETRAIT';
      } else if (data.receptionMode === 'expedition') {
        receptionMethod = 'COURRIER';
      }
      
      // Mapper documentType vers le format de l'API
      const documentTypeMap = {
        'bulletin': 'BULLETIN_SCOLAIRE',
        'certificat-sco': 'CERTIFICAT_SCOLARITE',
        'dup-diplome': 'DIPLOME',
        'attestation-reussite': 'RELEVE_NOTE',
        'certification': 'ATTESTATION',
      };
      const documentType = documentTypeMap[data.documentType] || 'BULLETIN_SCOLAIRE';
      
      // Mapper classLevel vers classe
      const classeMap = {
        '6ème': 'SIXIEME',
        '5ème': 'CINQUIEME',
        '4ème': 'QUATRIEME',
        '3ème': 'TROISIEME',
        '2nde': 'SECONDE',
        '1ère': 'PREMIERE',
        'Terminale': 'TERMINALE',
      };
      const classe = classeMap[data.classLevel] || data.classLevel?.toUpperCase() || 'SIXIEME';
      
      const applicationData = {
        city: cityName,
        receptionMethod: receptionMethod,
        desiredSchool: schoolName,
        desiredField: documentTypes?.find(d => d.id === data.documentType)?.title || 'Document scolaire',
        lastAverage: data.lastAverage || '',
        strengths: data.strengths || '',
        motivations: data.motivations || 'Demande de document scolaire',
        documentType: documentType,
        classe: classe,
      };
      
      // Ajouter les champs optionnels
      if (data.shippingZone) {
        applicationData.expeditionRegion = data.shippingZone;
      }
      // Ne pas envoyer schoolInstitutionId si ce n'est pas un UUID valide
      // L'API le requiert en UUID, donc on le retire si ce n'est pas le cas
      // if (data.school && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.school)) {
      //   applicationData.schoolInstitutionId = data.school;
      // }
      
      console.log('📤 Envoi de la demande à l\'API:', { url: `${API_BASE_URL}/document-request/apply`, applicationData });
      
      const response = await fetch(`${API_BASE_URL}/document-request/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });
      
      console.log('📥 Réponse de l\'API:', { status: response.status, statusText: response.statusText });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `Erreur ${response.status}` }));
        console.error('❌ Erreur API:', error);
        let errorMessage = error.message || 'Erreur lors de la création de la demande';
        if (error.errors) {
          if (Array.isArray(error.errors)) {
            errorMessage = error.errors.map(e => typeof e === 'string' ? e : e.message || JSON.stringify(e)).join(', ');
          } else if (typeof error.errors === 'object') {
            errorMessage = Object.entries(error.errors)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          }
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('✅ Réponse complète:', result);
      return result;
    },
    onSuccess: (data) => {
      // Selon doc: Après enregistrement, statut "En attente de paiement"
      // Redirection vers la page de paiement
      // TODO: Décommenter pour activer le paiement
      /*
      const requestId = data.data?.id || data.id;
      const requestNumber = data.data?.requestNumber || data.requestNumber;
      navigate(`/assistance-demande/${requestId}/paiement`, { 
        state: { 
          requestNumber,
          total: pricing.total,
          status: 'En attente de paiement'
        } 
      });
      */
      // Pour le test : afficher un message de succès
      console.log('✅ Demande créée avec succès:', data);
      setSuccessModalData({
        title: 'Demande enregistrée avec succès !',
        message: `Votre demande a été enregistrée avec succès. ${data.data?.requestNumber ? `Numéro de demande: ${data.data.requestNumber}` : ''}`
      });
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la création de la demande:', error);
      alert(`Erreur: ${error.message || 'Une erreur est survenue lors de l\'enregistrement de la demande'}`);
    },
  });

  // Fonction de calcul local des tarifs
  const calculateLocalPricing = () => {
    if (!formData.city || !formData.documentType || !formData.receptionMode) {
      return;
    }

    // A - Coût déplacement
    const cityData = cities?.find(c => c.id === formData.city) || mockCities.find(c => c.id === formData.city);
    const C_deplacement = cityData?.deliveryCost || 0;

    // B - Coût du document
    const docData = documentTypes?.find(d => d.id === formData.documentType) || fallbackDocTypes.find(d => d.id === formData.documentType);
    const docPrice = docData?.price || 0;
    const C_document = docPrice * formData.copies;

    // C - Légalisation
    const C_legalisation = formData.legalisation ? mockTariffs.legalisation * formData.copies : 0;

    // D - Traduction
    const C_traduction = formData.translation && formData.translationLanguages.length > 0
      ? mockTariffs.traduction * formData.translationLanguages.length * formData.translationCopies
      : 0;

    // E - Certification ministérielle
    const C_certif_ministerielle = formData.certificationMinisterielle ? mockTariffs.certificationMinisterielle : 0;

    // F - Expédition
    let C_expedition = 0;
    if (formData.receptionMode === 'expedition' && formData.shippingZone) {
      const zoneData = shippingZones?.find(z => z.id === formData.shippingZone) || mockZones.find(z => z.id === formData.shippingZone);
      C_expedition = zoneData?.cost || 0;
    }

    // Total général
    const TOTAL = C_deplacement + C_document + C_legalisation + C_traduction + C_certif_ministerielle + C_expedition;

    setPricing({
      deplacement: C_deplacement,
      document: C_document,
      legalisation: C_legalisation,
      traduction: C_traduction,
      certification: C_certif_ministerielle,
      expedition: C_expedition,
      total: TOTAL,
    });
  };

  useEffect(() => {
    // Recalculer le devis quand les données changent
    if (currentStep >= 2 && formData.city && formData.documentType && formData.receptionMode) {
      const quoteData = {
        city: formData.city,
        school: formData.school,
        receptionMode: formData.receptionMode,
        shippingZone: formData.shippingZone,
        documentTypeId: formData.documentType,
        copies: formData.copies,
        legalisation: formData.legalisation,
        translation: formData.translation,
        translationLanguages: formData.translationLanguages,
        translationCopies: formData.translationCopies,
        certificationMinisterielle: formData.certificationMinisterielle,
      };
      
      // Essayer d'abord l'API, sinon calculer localement
      calculateQuote.mutate(quoteData, {
        onError: () => {
          // Si l'API échoue, calculer localement
          calculateLocalPricing();
        },
      });
    } else {
      // Calculer localement si les conditions ne sont pas remplies pour l'API
      calculateLocalPricing();
    }
  }, [formData, currentStep, cities, documentTypes, shippingZones]);

  const steps = [
    { id: 1, title: 'Localisation', icon: 'ph-map-pin' },
    { id: 2, title: 'Réception', icon: 'ph-envelope' },
    { id: 3, title: 'Document', icon: 'ph-file-text' },
    { id: 4, title: 'Informations', icon: 'ph-info' },
    { id: 5, title: 'Récapitulatif', icon: 'ph-check-circle' },
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.city) newErrors.city = 'Veuillez sélectionner une ville';
      if (!formData.school) newErrors.school = 'Veuillez sélectionner un établissement';
    }
    
    if (step === 2) {
      if (!formData.receptionMode) newErrors.receptionMode = 'Veuillez sélectionner une méthode de réception';
      if (formData.receptionMode === 'expedition' && !formData.shippingZone) {
        newErrors.shippingZone = 'Veuillez sélectionner une zone d\'expédition';
      }
    }
    
    if (step === 3) {
      if (!formData.documentType) newErrors.documentType = 'Veuillez sélectionner un type de document';
    }
    
    if (step === 4) {
      if (!formData.classLevel) newErrors.classLevel = 'Veuillez renseigner la classe/niveau';
      if (formData.copies < 1) newErrors.copies = 'Le nombre de copies doit être au moins 1';
      if (formData.translation && formData.translationLanguages.length === 0) {
        newErrors.translationLanguages = 'Veuillez sélectionner au moins une langue';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll vers le haut
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔵 handleSubmit appelé');
    
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour créer une demande');
      navigate('/login');
      return;
    }
    
    console.log('🔵 Validation du step 5...');
    const isValid = validateStep(5);
    console.log('🔵 Résultat validation:', isValid);
    
    if (!isValid) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    console.log('🔵 Préparation des données à envoyer:', { formData, pricing });
    
      // Selon doc: Enregistrer la demande avec statut "En attente de paiement"
      // Le numéro unique sera généré côté backend (format: AEDOC-YYYYMMDD-HHMM-XXXX)
    // TODO: Remettre le statut "En attente de paiement" quand le paiement sera activé
    try {
      createRequest.mutate({
        ...formData,
        pricing: pricing,
        // status: 'En attente de paiement', // Commenté pour test
      });
      console.log('🔵 Mutation déclenchée');
    } catch (error) {
      console.error('❌ Erreur lors de la mutation:', error);
      alert(`Erreur: ${error.message || 'Une erreur est survenue'}`);
    }
  };

  const handleSubmitBourse = async (data) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour créer une demande');
      navigate('/login');
      return;
    }

    // Mapper les données du formulaire vers le format de l'API
    const residenceCountry = initialFormData.demandeurPays || (data.location === 'CI' ? 'Côte d\'Ivoire' : '');
    
    const applicationData = {
      residenceCountry: residenceCountry,
      applicantStatus: mapApplicantStatus(initialFormData.demandeurStatut || 'Étudiant'),
      assistanceType: mapAssistanceType(data.location || 'CI'),
      currentLevel: data.niveauEtude || '',
      studyField: data.domaineEtude || '',
      targetCountry: data.paysCible || '',
      targetSchool: data.ecoleCible || '',
      objective: data.objectif || '',
      documents: Array.isArray(data.documents) ? data.documents : [], // Les documents doivent être des URLs
      complementaryInfo: {
        lastName: initialFormData.demandeurNom || userProfile?.lastName || userProfile?.nom || '',
        firstName: initialFormData.demandeurPrenoms || userProfile?.firstName || userProfile?.prenom || '',
        phone: formatPhoneNumber(initialFormData.demandeurTelephone || userProfile?.phone || userProfile?.telephone || userProfile?.mobile || ''),
        email: initialFormData.demandeurEmail || userProfile?.email || '',
        residenceCountry: residenceCountry,
      },
    };

    // Log pour debug
    console.log('📤 Données envoyées à l\'API Assistance Bourse:', {
      url: `${API_BASE_URL}/scholarships/apply`,
      applicationData,
      rawData: data,
      initialFormData,
    });

    // Soumettre la demande via l'API d'assistance
    applyScholarshipAssistanceMutation.mutate(applicationData);
  };

  const handleSubmitEtudesEtranger = async (data) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour créer une demande');
      navigate('/login');
      return;
    }

    // Mapper les données du formulaire vers le format de l'API
    const residenceCountry = initialFormData.demandeurPays || 'Côte d\'Ivoire';
    
    // Vérifier que les champs requis ne sont pas vides
    if (!data.targetCountry || !data.targetCity || !data.targetSchool || !data.targetLevel || !data.studyField) {
      alert('Veuillez remplir tous les champs obligatoires (Pays, Ville, École, Niveau, Domaine d\'étude)');
      return;
    }
    
    // Construire l'objet applicationData en n'incluant que les champs non vides
    const applicationData = {
      residenceCountry: residenceCountry,
      applicantStatus: mapApplicantStatus(initialFormData.demandeurStatut || 'Étudiant'),
      assistanceType: mapAssistanceType(data.location || 'CI'),
      targetCountry: data.targetCountry.trim(),
      targetCity: data.targetCity.trim(),
      targetSchool: data.targetSchool.trim(),
      targetLevel: data.targetLevel.trim(),
      studyField: data.studyField.trim(),
      assistanceHousing: Boolean(data.assistanceHousing),
      assistanceEnrollment: Boolean(data.assistanceEnrollment),
      documents: Array.isArray(data.documents) ? data.documents : [],
      complementaryInfo: {
        lastName: (initialFormData.demandeurNom || userProfile?.lastName || userProfile?.nom || '').trim(),
        firstName: (initialFormData.demandeurPrenoms || userProfile?.firstName || userProfile?.prenom || '').trim(),
        phone: formatPhoneNumber(initialFormData.demandeurTelephone || userProfile?.phone || userProfile?.telephone || userProfile?.mobile || ''),
        email: (initialFormData.demandeurEmail || userProfile?.email || '').trim(),
        residenceCountry: residenceCountry,
      },
    };

    // Ajouter budgetEstimate seulement s'il n'est pas vide
    if (data.budgetEstimate && data.budgetEstimate.trim()) {
      applicationData.budgetEstimate = data.budgetEstimate.trim();
    }

    // Log pour debug
    console.log('📤 Données envoyées à l\'API Foreign Study:', {
      applicationData: JSON.stringify(applicationData, null, 2),
      rawData: data,
      initialFormData,
    });

    // Soumettre la demande via l'API
    applyForeignStudyMutation.mutate(applicationData);
  };

  const handleSubmitPermutation = async (data) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour créer une demande');
      navigate('/login');
      return;
    }

    // Mapper les données du formulaire vers le format de l'API
    const residenceCountry = initialFormData.demandeurPays || 'Côte d\'Ivoire';
    
    // Vérifier que les champs requis ne sont pas vides
    if (!data.departureSchool || !data.desiredInstitution || !data.desiredGeographicZone || !data.reason || !data.permutationRole) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const applicationData = {
      residenceCountry: residenceCountry,
      applicantStatus: mapApplicantStatus(initialFormData.demandeurStatut || 'Élève'),
      departureSchool: data.departureSchool.trim(),
      desiredInstitution: data.desiredInstitution.trim(),
      desiredGeographicZone: data.desiredGeographicZone.trim(),
      reason: data.reason.trim(),
      permutationRole: data.permutationRole,
      documents: Array.isArray(data.documents) ? data.documents : [],
      complementaryInfo: {
        lastName: (initialFormData.demandeurNom || userProfile?.lastName || userProfile?.nom || '').trim(),
        firstName: (initialFormData.demandeurPrenoms || userProfile?.firstName || userProfile?.prenom || '').trim(),
        phone: formatPhoneNumber(initialFormData.demandeurTelephone || userProfile?.phone || userProfile?.telephone || userProfile?.mobile || ''),
        email: (initialFormData.demandeurEmail || userProfile?.email || '').trim(),
        residenceCountry: residenceCountry,
      },
    };

    // Log pour debug
    console.log('📤 Données envoyées à l\'API Permutation:', {
      applicationData: JSON.stringify(applicationData, null, 2),
      rawData: data,
      initialFormData,
    });

    // Soumettre la demande via l'API
    applyPermutationMutation.mutate(applicationData);
  };

  const handleSubmitOrientation = async (data) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour créer une demande');
      navigate('/login');
      return;
    }

    // Mapper les données du formulaire vers le format de l'API
    const residenceCountry = initialFormData.demandeurPays || 'Côte d\'Ivoire';
    
    // Vérifier que les champs requis ne sont pas vides
    if (!data.orientationLevel || !data.desiredSchool || !data.desiredField || !data.lastAverage || !data.strengths || !data.motivations || !data.offerType) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const applicationData = {
      residenceCountry: residenceCountry,
      applicantStatus: mapApplicantStatus(initialFormData.demandeurStatut || 'Élève'),
      orientationLevel: data.orientationLevel,
      desiredSchool: data.desiredSchool.trim(),
      desiredField: data.desiredField.trim(),
      lastAverage: data.lastAverage.trim(),
      strengths: data.strengths.trim(),
      motivations: data.motivations.trim(),
      offerType: data.offerType,
      complementaryInfo: {
        lastName: (initialFormData.demandeurNom || userProfile?.lastName || userProfile?.nom || '').trim(),
        firstName: (initialFormData.demandeurPrenoms || userProfile?.firstName || userProfile?.prenom || '').trim(),
        phone: formatPhoneNumber(initialFormData.demandeurTelephone || userProfile?.phone || userProfile?.telephone || userProfile?.mobile || ''),
        email: (initialFormData.demandeurEmail || userProfile?.email || '').trim(),
        residenceCountry: residenceCountry,
      },
    };

    // Log pour debug
    console.log('📤 Données envoyées à l\'API Orientation:', {
      applicationData: JSON.stringify(applicationData, null, 2),
      rawData: data,
      initialFormData,
    });

    // Soumettre la demande via l'API
    applyOrientationMutation.mutate(applicationData);
  };

  const handleSubmitDocument = async (data) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour créer une demande');
      navigate('/login');
      return;
    }

    // Vérifier que les champs requis ne sont pas vides
    if (!data.city || !data.receptionMethod || !data.desiredSchool || !data.desiredField || 
        !data.lastAverage || !data.strengths || !data.motivations || !data.documentType || !data.classe) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const applicationData = {
      city: data.city.trim(),
      receptionMethod: data.receptionMethod,
      desiredSchool: data.desiredSchool.trim(),
      desiredField: data.desiredField.trim(),
      lastAverage: data.lastAverage.trim(),
      strengths: data.strengths.trim(),
      motivations: data.motivations.trim(),
      documentType: data.documentType,
      classe: data.classe,
    };

    // Ajouter les champs optionnels seulement s'ils sont remplis et valides
    // schoolInstitutionId doit être un UUID valide
    if (data.schoolInstitutionId && data.schoolInstitutionId.trim()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(data.schoolInstitutionId.trim())) {
        applicationData.schoolInstitutionId = data.schoolInstitutionId.trim();
      } else {
        console.warn('⚠️ schoolInstitutionId n\'est pas un UUID valide, champ ignoré:', data.schoolInstitutionId);
      }
    }
    if (data.expeditionRegion && data.expeditionRegion.trim()) {
      applicationData.expeditionRegion = data.expeditionRegion;
    }

    // Log pour debug
    console.log('📤 Données envoyées à l\'API Document:', {
      applicationData: JSON.stringify(applicationData, null, 2),
      rawData: data,
      initialFormData,
    });

    // Soumettre la demande via l'API
    applyDocumentMutation.mutate(applicationData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2 className="step-title">Choix de la localisation</h2>
            <p className="step-description">Sélectionnez votre ville et établissement scolaire. Le coût du déplacement sera calculé automatiquement.</p>
            
            <div className="form-group">
              <label>Ville *</label>
              <select
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value, school: '' });
                  setErrors({ ...errors, city: '' });
                }}
                className={errors.city ? 'error' : ''}
              >
                <option value="">Sélectionnez une ville</option>
                {cities?.length
                  ? cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name} {city.deliveryCost && `(${city.deliveryCost} FCFA)`}
                      </option>
                    ))
                  : <option value="">Aucune ville disponible pour le moment</option>}
              </select>
              {errors.city && <span className="error-message">{errors.city}</span>}
              {formData.city && cities?.find(c => c.id === formData.city)?.deliveryCost && (
                <p className="info-text">
                  Coût de déplacement : <strong>{cities.find(c => c.id === formData.city).deliveryCost} FCFA</strong>
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Établissement scolaire *</label>
              <select
                value={formData.school}
                onChange={(e) => {
                  setFormData({ ...formData, school: e.target.value });
                  setErrors({ ...errors, school: '' });
                }}
                disabled={!formData.city}
                className={errors.school ? 'error' : ''}
              >
                <option value="">Sélectionnez un établissement</option>
                {schools?.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              {errors.school && <span className="error-message">{errors.school}</span>}
            </div>
            
            {pricing.total > 0 && (
              <div className="total-preview">
                <span className="total-label">Total estimé :</span>
                <span className="total-amount">{pricing.total} FCFA</span>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2 className="step-title">Méthode de réception</h2>
            <p className="step-description">Choisissez comment vous souhaitez recevoir votre document</p>
            
            <div className="form-group">
              <label>Méthode de réception *</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="receptionMode"
                    value="email"
                    checked={formData.receptionMode === 'email'}
                    onChange={(e) => {
                      setFormData({ ...formData, receptionMode: e.target.value, shippingZone: '' });
                      setErrors({ ...errors, receptionMode: '' });
                    }}
                  />
                  <span>Email (tarif à définir)</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="receptionMode"
                    value="agence"
                    checked={formData.receptionMode === 'agence'}
                    onChange={(e) => {
                      setFormData({ ...formData, receptionMode: e.target.value, shippingZone: '' });
                      setErrors({ ...errors, receptionMode: '' });
                    }}
                  />
                  <span>Agence AlloEcole (tarif à définir)</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="receptionMode"
                    value="expedition"
                    checked={formData.receptionMode === 'expedition'}
                    onChange={(e) => {
                      setFormData({ ...formData, receptionMode: e.target.value });
                      setErrors({ ...errors, receptionMode: '' });
                    }}
                  />
                  <span>Expédition (tarif selon zone)</span>
                </label>
              </div>
              {errors.receptionMode && <span className="error-message">{errors.receptionMode}</span>}
            </div>

            {formData.receptionMode === 'expedition' && (
              <div className="form-group">
                <label>Zone d'expédition *</label>
                <p className="step-description" style={{ fontSize: '12px', marginBottom: '8px' }}>
                  Sélectionnez ou tapez la zone d'expédition. Le coût sera calculé automatiquement.
                </p>
                <select
                  value={formData.shippingZone}
                  onChange={(e) => {
                    setFormData({ ...formData, shippingZone: e.target.value });
                    setErrors({ ...errors, shippingZone: '' });
                  }}
                  className={errors.shippingZone ? 'error' : ''}
                >
                  <option value="">Sélectionnez une zone</option>
                  {shippingZones?.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} {zone.cost && `(${zone.cost} FCFA)`}
                    </option>
                  ))}
                </select>
                {errors.shippingZone && <span className="error-message">{errors.shippingZone}</span>}
                {formData.shippingZone && shippingZones?.find(z => z.id === formData.shippingZone)?.cost && (
                  <p className="info-text">
                    Coût d'expédition : <strong>{shippingZones.find(z => z.id === formData.shippingZone).cost} FCFA</strong>
                  </p>
                )}
              </div>
            )}
            
            {pricing.total > 0 && (
              <div className="total-preview">
                <span className="total-label">Total estimé :</span>
                <span className="total-amount">{pricing.total} FCFA</span>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2 className="step-title">Choix du type de document</h2>
            <p className="step-description">Sélectionnez le type de document dont vous avez besoin. Le tarif unitaire sera récupéré automatiquement.</p>
            
            <div className="form-group">
              <label>Type de document *</label>
              <select
                value={formData.documentType}
                onChange={(e) => {
                  setFormData({ ...formData, documentType: e.target.value });
                  setErrors({ ...errors, documentType: '' });
                }}
                className={errors.documentType ? 'error' : ''}
              >
                <option value="">Sélectionnez un type de document</option>
                {(documentTypes?.length ? documentTypes : fallbackDocTypes).map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title} {doc.price ? `(${doc.price} FCFA)` : ''} {doc.avgDelay ? `- Délai moyen: ${doc.avgDelay}` : ''}
                  </option>
                ))}
              </select>
              {errors.documentType && <span className="error-message">{errors.documentType}</span>}
              {formData.documentType && documentTypes?.find(d => d.id === formData.documentType) && (
                <div className="info-box">
                  <p><strong>Tarif unitaire :</strong> {documentTypes.find(d => d.id === formData.documentType).price || 'N/A'} FCFA</p>
                  {documentTypes.find(d => d.id === formData.documentType).avgDelay && (
                    <p><strong>Délai moyen :</strong> {documentTypes.find(d => d.id === formData.documentType).avgDelay}</p>
                  )}
                </div>
              )}
              
              {pricing.total > 0 && (
                <div className="total-preview">
                  <span className="total-label">Total estimé :</span>
                  <span className="total-amount">{pricing.total} FCFA</span>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2 className="step-title">Informations additionnelles</h2>
            <p className="step-description">Complétez les informations nécessaires et sélectionnez les options payantes si besoin</p>
            
            <div className="form-group">
              <label>Classe/Niveau *</label>
              <input
                type="text"
                value={formData.classLevel}
                onChange={(e) => {
                  setFormData({ ...formData, classLevel: e.target.value });
                  setErrors({ ...errors, classLevel: '' });
                }}
                placeholder="Ex: 3e, Terminale A, 1ère D, etc."
                className={errors.classLevel ? 'error' : ''}
              />
              {errors.classLevel && <span className="error-message">{errors.classLevel}</span>}
            </div>

            <div className="form-group">
              <label>Nombre de copies *</label>
              <input
                type="number"
                min="1"
                value={formData.copies}
                onChange={(e) => {
                  setFormData({ ...formData, copies: parseInt(e.target.value) || 1 });
                  setErrors({ ...errors, copies: '' });
                }}
                className={errors.copies ? 'error' : ''}
              />
              {errors.copies && <span className="error-message">{errors.copies}</span>}
            </div>

            <div className="options-section">
              <h3 className="options-title">Options payantes</h3>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.legalisation}
                    onChange={(e) => setFormData({ ...formData, legalisation: e.target.checked })}
                  />
                  <span>✔ Légalisation (tarif par copie)</span>
                </label>
                {formData.legalisation && (
                  <p className="info-text-small">Coût : Tarif légalisation × {formData.copies} copie(s)</p>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.translation}
                    onChange={(e) => setFormData({ ...formData, translation: e.target.checked, translationLanguages: e.target.checked ? formData.translationLanguages : [] })}
                  />
                  <span>✔ Traduction (tarif par langue et copie)</span>
                </label>
                
                {formData.translation && (
                  <>
                    <div className="form-group" style={{ marginTop: '12px' }}>
                      <label>Langue(s) de traduction * (sélection multiple)</label>
                      <select
                        multiple
                        value={formData.translationLanguages}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          setFormData({ ...formData, translationLanguages: selected });
                          setErrors({ ...errors, translationLanguages: '' });
                        }}
                        className={errors.translationLanguages ? 'error' : ''}
                        style={{ minHeight: '120px' }}
                      >
                        <option value="en">Anglais</option>
                        <option value="es">Espagnol</option>
                        <option value="de">Allemand</option>
                        <option value="pt">Portugais</option>
                        <option value="ar">Arabe</option>
                        <option value="zh">Chinois</option>
                        <option value="it">Italien</option>
                      </select>
                      <p className="hint-text">Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs langues</p>
                      {errors.translationLanguages && <span className="error-message">{errors.translationLanguages}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Nombre de copies traduites</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.translationCopies}
                        onChange={(e) => setFormData({ ...formData, translationCopies: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.certificationMinisterielle}
                    onChange={(e) => setFormData({ ...formData, certificationMinisterielle: e.target.checked })}
                  />
                  <span>✔ Certification ministérielle (tarif unique ou par copie)</span>
                </label>
                {formData.certificationMinisterielle && (
                  <p className="info-text-small">Coût : Tarif certification ministérielle</p>
                )}
              </div>
            </div>
            
            {pricing.total > 0 && (
              <div className="total-preview">
                <span className="total-label">Total estimé :</span>
                <span className="total-amount">{pricing.total} FCFA</span>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h2 className="step-title">Récapitulatif & Paiement</h2>
            <p className="step-description">Vérifiez les informations et le détail des tarifs avant de procéder au paiement</p>
            
            <div className="summary-section">
              <h3>Informations de la demande</h3>
              <div className="summary-item">
                <strong>Ville:</strong> {cities?.find(c => c.id === formData.city)?.name || formData.city}
              </div>
              <div className="summary-item">
                <strong>Établissement:</strong> {schools?.find(s => s.id === formData.school)?.name || formData.school}
              </div>
              <div className="summary-item">
                <strong>Méthode de réception:</strong> {
                  formData.receptionMode === 'email' ? 'Email' :
                  formData.receptionMode === 'agence' ? 'Agence AlloEcole' :
                  formData.receptionMode === 'expedition' ? 'Expédition' : ''
                }
              </div>
              {formData.receptionMode === 'expedition' && (
                <div className="summary-item">
                  <strong>Zone d'expédition:</strong> {shippingZones?.find(z => z.id === formData.shippingZone)?.name || formData.shippingZone}
                </div>
              )}
              <div className="summary-item">
                <strong>Type de document:</strong> {documentTypes?.find(d => d.id === formData.documentType)?.title || formData.documentType}
              </div>
              <div className="summary-item">
                <strong>Classe/Niveau:</strong> {formData.classLevel}
              </div>
              <div className="summary-item">
                <strong>Nombre de copies:</strong> {formData.copies}
              </div>
              {(formData.legalisation || formData.translation || formData.certificationMinisterielle) && (
                <div className="summary-item">
                  <strong>Options sélectionnées:</strong>
                  <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                    {formData.legalisation && <li>Légalisation</li>}
                    {formData.translation && (
                      <li>Traduction ({formData.translationLanguages.length} langue(s), {formData.translationCopies} copie(s))</li>
                    )}
                    {formData.certificationMinisterielle && <li>Certification ministérielle</li>}
                  </ul>
                </div>
              )}
            </div>

            <div className="summary-section">
              <h3>Détail des tarifs (selon grille tarifaire)</h3>
              <div className="pricing-breakdown">
                <div className="pricing-item">
                  <span>A - Coût déplacement (TarifVille):</span>
                  <span>{pricing.deplacement || 0} FCFA</span>
                </div>
                <div className="pricing-item">
                  <span>B - Coût du document (TarifTypeDocument × {formData.copies} copie{formData.copies > 1 ? 's' : ''}):</span>
                  <span>{pricing.document || 0} FCFA</span>
                </div>
                {formData.legalisation && (
                  <div className="pricing-item">
                    <span>C - Légalisation (TarifLegalisation × {formData.copies} copie{formData.copies > 1 ? 's' : ''}):</span>
                    <span>{pricing.legalisation || 0} FCFA</span>
                  </div>
                )}
                {formData.translation && (
                  <div className="pricing-item">
                    <span>D - Traduction (TarifTraduction × {formData.translationLanguages.length} langue(s) × {formData.translationCopies} copie(s)):</span>
                    <span>{pricing.traduction || 0} FCFA</span>
                  </div>
                )}
                {formData.certificationMinisterielle && (
                  <div className="pricing-item">
                    <span>E - Certification ministérielle (TarifCertificationMinisterielle):</span>
                    <span>{pricing.certification || 0} FCFA</span>
                  </div>
                )}
                {formData.receptionMode === 'expedition' && (
                  <div className="pricing-item">
                    <span>F - Expédition (TarifExpedition(zone)):</span>
                    <span>{pricing.expedition || 0} FCFA</span>
                  </div>
                )}
                <div className="pricing-total">
                  <span><strong>TOTAL GÉNÉRAL:</strong></span>
                  <span><strong>{pricing.total || 0} FCFA</strong></span>
                </div>
              </div>
              <p className="info-text" style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                Après enregistrement, votre demande recevra un numéro unique (format: AEDOC-YYYYMMDD-HHMM-XXXX) 
                et sera en statut "En attente de paiement". Après paiement, vous recevrez une confirmation par SMS et Email.
              </p>
            </div>

            {/* TODO: Décommenter pour activer le paiement */}
            {/*
            <div className="payment-section">
              <button
                type="button"
                className="btn-payment"
                onClick={handleSubmit}
                disabled={createRequest.isLoading || pricing.total === 0}
              >
                <i className="ph-credit-card" style={{ marginRight: '8px', fontSize: '20px' }}></i>
                {createRequest.isLoading ? 'Enregistrement...' : `Procéder au paiement - ${pricing.total || 0} FCFA`}
              </button>
              <p className="payment-hint">
                Vous serez redirigé vers la page de paiement après l'enregistrement de votre demande
              </p>
            </div>
            */}
            <div className="payment-section">
              <button
                type="button"
                className="btn-payment"
                onClick={handleSubmit}
                disabled={createRequest.isLoading}
              >
                {createRequest.isLoading ? 'Enregistrement...' : 'Enregistrer la demande'}
              </button>
              <p className="payment-hint">
                La demande sera enregistrée pour test (paiement désactivé temporairement)
              </p>
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
        @import url('https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css');
        
        .assistance-demande-section {
          min-height: 100vh;
          background: #f8fafc;
          padding: 40px 20px;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 32px;
        }

        .progress-container {
          margin-bottom: 32px;
        }

        .progress {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%);
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .steps-navigation {
          margin-bottom: 24px;
          background: white;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .form-row {
          display: flex;
          gap: 6px;
          justify-content: space-between;
          align-items: center;
        }

        .step-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 8px;
          border-radius: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          min-height: 42px;
          max-height: 42px;
        }

        .step-item:hover {
          border-color: #f05623;
          background: #fff7ed;
        }

        .step-item.current {
          border-color: #f05623;
          background: #fff7ed;
          box-shadow: 0 0 0 2px rgba(240, 86, 35, 0.1);
        }

        .step-item.active {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .step-item.active .step-icon {
          color: #10b981;
        }

        .step-item.current .step-icon {
          color: #f05623;
        }

        .step-icon {
          font-size: 14px;
          color: #64748b;
          flex-shrink: 0;
        }

        .step-title {
          font-size: 10px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.2;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 6px;
          }

          .step-item {
            width: 100%;
            padding: 8px 10px;
          }

          .step-title {
            font-size: 10px;
          }

          .step-icon {
            font-size: 14px;
          }
        }

        .form-container {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .step-content {
          min-height: 400px;
        }

        .step-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .step-description {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .info-text {
          font-size: 13px;
          color: #059669;
          margin-top: 6px;
          font-weight: 500;
        }

        .info-text-small {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
          margin-left: 24px;
        }

        .hint-text {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
          font-style: italic;
        }

        .info-box {
          margin-top: 12px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          font-size: 13px;
        }

        .info-box p {
          margin: 4px 0;
        }

        .options-section {
          margin-top: 24px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .options-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #f05623;
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #ef4444;
        }

        .error-message {
          display: block;
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 10px;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .radio-option:hover {
          border-color: #f05623;
          background: #fff7ed;
        }

        .radio-option input[type="radio"] {
          margin: 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .summary-section {
          margin-bottom: 24px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .summary-section h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .summary-item {
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .pricing-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pricing-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }

        .pricing-total {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-top: 2px solid #e2e8f0;
          margin-top: 8px;
          font-size: 18px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(240, 86, 35, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .payment-section {
          margin-top: 32px;
          padding: 24px;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          border-radius: 12px;
          border: 2px solid #fbbf24;
          text-align: center;
        }

        .btn-payment {
          width: 100%;
          padding: 16px 24px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: linear-gradient(135deg, #f05623 0%, #f78c45 50%, #f9a05f 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(240, 86, 35, 0.3);
        }

        .btn-payment:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(240, 86, 35, 0.4);
        }

        .btn-payment:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .payment-hint {
          margin-top: 12px;
          font-size: 12px;
          color: #64748b;
          font-style: italic;
        }

        .total-preview {
          margin-top: 24px;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .total-amount {
          font-size: 14px;
          color: #0f172a;
          font-weight: 700;
        }
      `}</style>

      <div className="assistance-demande-section">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="section-title">Demande d'assistance</h1>
            <p className="section-subtitle">
              {!initialFormCompleted 
                ? 'Remplissez le formulaire initial pour commencer votre demande d\'assistance.'
                : assistanceType === 'Demande de documents'
                  ? 'Créez votre demande d\'assistance pour obtenir vos documents scolaires.'
                  : `Formulaire pour : ${assistanceType}`
              }
            </p>
          </div>

          {loadingProfile && isAuthenticated ? (
            <div className="form-container" style={{ padding: '3rem', textAlign: 'center' }}>
              <div className="loading-spinner">
                <div className="spinner-container">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                </div>
                <div className="loading-text">Chargement de vos informations...</div>
              </div>
            </div>
          ) : !initialFormCompleted ? (
            <div className="form-container">
              <InitialAssistanceForm 
                onComplete={handleInitialFormComplete}
                initialData={initialFormData}
                userProfile={userProfile}
              />
            </div>
          ) : assistanceType === 'Demande de documents' ? (
            <>
              <div className="progress-container">
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  Étape {currentStep} sur {steps.length}
                </div>
              </div>

              <div className="steps-navigation">
                <div className="form-row">
                  {steps.map(step => (
                    <div 
                      key={step.id}
                      className={`step-item ${currentStep === step.id ? 'current' : currentStep > step.id ? 'active' : ''}`}
                      onClick={() => {
                        if (step.id < currentStep) {
                          setCurrentStep(step.id);
                        }
                      }}
                    >
                      <div className="step-icon">
                        <i className={step.icon}></i>
                      </div>
                      <div className="step-title">{step.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-container">
                <form onSubmit={handleSubmit}>
                  {renderStepContent()}

                  <div className="form-actions">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handlePrevious}
                      >
                        Précédent
                      </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {currentStep < steps.length ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                      >
                        Suivant
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={createRequest.isLoading}
                      >
                        {createRequest.isLoading ? 'Enregistrement...' : 'Enregistrer la demande'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          ) : assistanceType === 'Bourse d\'études' ? (
            <div className="form-container">
              <BourseForm
                initialData={formData}
                onComplete={(bourseData) => {
                  // Fusionner les données et soumettre
                  const finalData = {
                    ...initialFormData,
                    ...bourseData,
                    assistanceType: 'Bourse d\'études',
                  };
                  handleSubmitBourse(finalData);
                }}
                onBack={() => {
                  setInitialFormCompleted(false);
                  setInitialFormData({});
                  setAssistanceType(null);
                }}
              />
            </div>
          ) : assistanceType === 'Etudes à l\'Étranger' ? (
            <div className="form-container">
              <EtudesEtrangerForm
                initialData={formData}
                userProfile={userProfile}
                onComplete={(etudesData) => {
                  // Fusionner les données et soumettre
                  const finalData = {
                    ...initialFormData,
                    ...etudesData,
                    assistanceType: 'Etudes à l\'Étranger',
                  };
                  handleSubmitEtudesEtranger(finalData);
                }}
                onBack={() => {
                  setInitialFormCompleted(false);
                  setInitialFormData({});
                  setAssistanceType(null);
                }}
              />
            </div>
          ) : assistanceType === 'Permutation' ? (
            <div className="form-container">
              <PermutationForm
                initialData={formData}
                userProfile={userProfile}
                onComplete={(permutationData) => {
                  // Fusionner les données et soumettre
                  const finalData = {
                    ...initialFormData,
                    ...permutationData,
                    assistanceType: 'Permutation',
                  };
                  handleSubmitPermutation(finalData);
                }}
                onBack={() => {
                  setInitialFormCompleted(false);
                  setInitialFormData({});
                  setAssistanceType(null);
                }}
              />
            </div>
          ) : assistanceType === 'Orientation scolaire' ? (
            <div className="form-container">
              <OrientationForm
                initialData={formData}
                userProfile={userProfile}
                onComplete={(orientationData) => {
                  // Fusionner les données et soumettre
                  const finalData = {
                    ...initialFormData,
                    ...orientationData,
                    assistanceType: 'Orientation scolaire',
                  };
                  handleSubmitOrientation(finalData);
                }}
                onBack={() => {
                  setInitialFormCompleted(false);
                  setInitialFormData({});
                  setAssistanceType(null);
                }}
              />
            </div>
          ) : assistanceType === 'Documents' ? (
            <div className="form-container">
              <DocumentForm
                initialData={formData}
                userProfile={userProfile}
                onComplete={(documentData) => {
                  // Fusionner les données et soumettre
                  const finalData = {
                    ...initialFormData,
                    ...documentData,
                    assistanceType: 'Documents',
                  };
                  handleSubmitDocument(finalData);
                }}
                onBack={() => {
                  setInitialFormCompleted(false);
                  setInitialFormData({});
                  setAssistanceType(null);
                }}
              />
            </div>
          ) : (
            <div className="form-container">
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Formulaire pour "{assistanceType}" en cours de développement...</p>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setInitialFormCompleted(false);
                    setInitialFormData({});
                    setAssistanceType(null);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Retour au formulaire initial
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
      {showSuccessModal && (
        <SuccessModal
          onClose={() => {
            setShowSuccessModal(false);
            // Réinitialiser le formulaire après fermeture du modal
            setInitialFormCompleted(false);
            setInitialFormData({});
            setAssistanceType(null);
          }}
          title={successModalData.title}
          message={successModalData.message}
          actionLabel="Fermer"
        />
      )}
    </>
  );
};

export default AssistanceDemandeComponent;
