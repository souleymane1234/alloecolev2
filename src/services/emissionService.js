import tokenManager from '../helper/tokenManager';

const API_BASE_URL = 'https://alloecoleapi-dev.up.railway.app/api/v1';

/**
 * Service API pour les émissions télé-réalité
 */
class EmissionService {
  /**
   * Lister toutes les émissions
   * @param {Object} params - Paramètres de filtrage et pagination
   * @param {boolean} params.isActive - Filtrer par statut actif
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   */
  async getEmissions(params = {}) {
    const { isActive, page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (isActive !== undefined) {
      queryParams.append('isActive', isActive.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/emission?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('📺 Réponse API émissions:', data);
    
    // Gérer différentes structures de réponse
    let rawEmissions = [];
    if (data?.emissions) {
      rawEmissions = Array.isArray(data.emissions) ? data.emissions : [];
    } else if (data?.data) {
      rawEmissions = Array.isArray(data.data) ? data.data : [];
    } else if (Array.isArray(data)) {
      rawEmissions = data;
    }
    
    // Normaliser les champs pour correspondre à la structure attendue
    const emissions = rawEmissions.map(emission => ({
      id: emission.id || emission.code_emission || emission._id,
      code_emission: emission.code_emission || emission.id || emission._id,
      title: emission.title || emission.titre_emission || emission.name,
      titre_emission: emission.titre_emission || emission.title || emission.name,
      description: emission.description || emission.description_emission || '',
      description_emission: emission.description_emission || emission.description || '',
      url_video_emission: emission.url_video_emission || emission.videoUrl || emission.video_url,
      url_photo_emission: emission.url_photo_emission || emission.imageUrl || emission.image_url || emission.coverImage,
      isActive: emission.isActive !== undefined ? emission.isActive : emission.is_active !== undefined ? emission.is_active : true,
      ...emission // Conserver les autres champs
    }));
    
    console.log('📺 Émissions normalisées:', emissions);
    
    return {
      emissions: emissions,
      pagination: data?.pagination || {}
    };
  }

  /**
   * Récupérer les détails d'une émission
   * @param {string} id - ID de l'émission
   */
  async getEmissionById(id) {
    const response = await fetch(`${API_BASE_URL}/emission/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Émission non trouvée');
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Lister les éditions d'une émission
   * @param {string} emissionId - ID de l'émission
   * @param {Object} params - Paramètres de filtrage et pagination
   * @param {string} params.status - Filtrer par statut
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   */
  async getEditions(emissionId, params = {}) {
    const { status, page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      queryParams.append('status', status);
    }

    const response = await fetch(
      `${API_BASE_URL}/emission/${emissionId}/editions?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      editions: data?.data || [],
      pagination: data?.pagination || {}
    };
  }

  /**
   * Récupérer l'édition active d'une émission
   * @param {string} emissionId - ID de l'émission
   */
  async getActiveEdition(emissionId) {
    const response = await fetch(
      `${API_BASE_URL}/emission/${emissionId}/active-edition`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Récupérer les détails d'une édition
   * @param {string} editionId - ID de l'édition
   */
  async getEditionById(editionId) {
    const response = await fetch(
      `${API_BASE_URL}/emission/editions/${editionId}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Édition non trouvée');
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Lister les candidats d'une édition
   * @param {string} editionId - ID de l'édition
   * @param {Object} params - Paramètres de filtrage et pagination
   * @param {string} params.status - Filtrer par statut
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   */
  async getCandidates(editionId, params = {}) {
    const { status, page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      queryParams.append('status', status);
    }

    const response = await fetch(
      `${API_BASE_URL}/emission/editions/${editionId}/candidates?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      candidates: data?.data || [],
      pagination: data?.pagination || {}
    };
  }

  /**
   * Récupérer le classement des candidats d'une édition
   * @param {string} editionId - ID de l'édition
   * @param {Object} params - Paramètres de pagination
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   */
  async getRanking(editionId, params = {}) {
    const { page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/emission/editions/${editionId}/ranking?${queryParams}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Édition non trouvée');
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      ranking: data?.data || [],
      pagination: data?.pagination || {}
    };
  }

  /**
   * Récupérer les détails d'un candidat
   * @param {string} candidateId - ID du candidat
   */
  async getCandidateById(candidateId) {
    const response = await fetch(
      `${API_BASE_URL}/emission/candidates/${candidateId}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Candidat non trouvé');
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Postuler comme candidat pour une édition
   * @param {string} editionId - ID de l'édition
   */
  async applyAsCandidate(editionId) {
    if (!tokenManager.isAuthenticated()) {
      throw new Error('Vous devez être connecté pour postuler');
    }

    const response = await tokenManager.fetchWithAuth(
      `${API_BASE_URL}/emission/editions/${editionId}/apply`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Erreur HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Initier un paiement pour voter
   * @param {string} candidateId - ID du candidat
   * @param {Object} voteData - Données du vote
   * @param {number} voteData.voteCount - Nombre de votes
   * @param {string} voteData.provider - Fournisseur (MTN, Orange, Moov)
   * @param {number} voteData.amountPerVote - Montant par vote
   * @param {string} voteData.phoneNumber - Numéro de téléphone
   * @param {string} voteData.otp - Code OTP
   * @param {string} voteData.returnUrl - URL de retour en cas de succès
   * @param {string} voteData.cancelUrl - URL de retour en cas d'annulation
   */
  async initiateVote(candidateId, voteData) {
    if (!tokenManager.isAuthenticated()) {
      throw new Error('Vous devez être connecté pour voter');
    }

    const response = await tokenManager.fetchWithAuth(
      `${API_BASE_URL}/emission/candidates/${candidateId}/vote/initiate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Erreur HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Enregistrer les votes après paiement réussi
   * @param {string} candidateId - ID du candidat
   * @param {string} transactionId - ID de la transaction
   */
  async recordVotes(candidateId, transactionId) {
    if (!tokenManager.isAuthenticated()) {
      throw new Error('Vous devez être connecté pour voter');
    }

    const response = await tokenManager.fetchWithAuth(
      `${API_BASE_URL}/emission/candidates/${candidateId}/vote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Erreur HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data?.data || null;
  }
}

const emissionService = new EmissionService();
export default emissionService;
