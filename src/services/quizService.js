import tokenManager from '../helper/tokenManager';

const API_BASE_URL = 'https://alloecoleapi-dev.up.railway.app/api/v1';

/**
 * Service API pour les quiz Play
 */
class QuizService {
  /**
   * Lister tous les quiz Play actifs
   * @param {Object} params - Paramètres de pagination
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   */
  async getQuizzes(params = {}) {
    const { page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await tokenManager.fetchWithAuth(
      `${API_BASE_URL}/play/quizzes?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    // L'API retourne { success, message, data, pagination }
    // On retourne directement le tableau de quiz
    return data?.data || [];
  }

  /**
   * Récupérer un quiz Play par son ID (sans les questions)
   * @param {string} quizId - ID du quiz
   */
  async getQuizById(quizId) {
    const response = await tokenManager.fetchWithAuth(
      `${API_BASE_URL}/play/quizzes/${quizId}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Quiz non trouvé');
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Récupérer un quiz avec ses questions par son ID
   * @param {string} quizId - ID du quiz
   * @param {boolean} includeAnswers - Inclure les réponses correctes
   */
  async getQuizWithQuestions(quizId, includeAnswers = false) {
    const queryParams = new URLSearchParams();
    if (includeAnswers) {
      queryParams.append('includeAnswers', 'true');
    }
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/quiz/${quizId}${queryString ? `?${queryString}` : ''}`;

    const response = await tokenManager.fetchWithAuth(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Quiz non trouvé');
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Soumettre un quiz Play
   * @param {string} quizId - ID du quiz
   * @param {Object} submissionData - Données de soumission
   * @param {Array} submissionData.answers - Réponses aux questions
   */
  async submitQuiz(quizId, submissionData) {
    // Vérifier que l'utilisateur est authentifié
    if (!tokenManager.isAuthenticated()) {
      throw new Error('Vous devez être connecté pour soumettre un quiz');
    }

    try {
      const token = tokenManager.getAccessToken();
      console.log('📤 Soumission du quiz:', { quizId, submissionData });
      console.log('📤 Body JSON:', JSON.stringify(submissionData, null, 2));
      tokenManager.logTokenInfo(token, 'Access Token (soumission quiz)');
      
      const response = await tokenManager.fetchWithAuth(
        `${API_BASE_URL}/play/quizzes/${quizId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        }
      );

      console.log('📥 Réponse du serveur:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        // Lire le body de la réponse pour obtenir le message d'erreur
        let errorData = {};
        try {
          const text = await response.text();
          console.error('❌ Erreur API (texte brut):', text);
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (parseError) {
          console.error('❌ Erreur lors du parsing de la réponse:', parseError);
        }

        const errorMessage = 
          errorData.message || 
          errorData.error || 
          errorData.error?.message ||
          `Erreur HTTP ${response.status}: ${response.statusText}`;
        
        // Si le backend indique un token invalide/expiré, inviter à se reconnecter
        if (response.status === 401) {
          throw new Error('Token invalide ou expiré. Veuillez vous reconnecter puis réessayer.');
        }
        
        console.error('❌ Erreur complète:', { status: response.status, errorData, errorMessage });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Quiz soumis avec succès:', data);
      return data?.data || null;
    } catch (error) {
      console.error('❌ Erreur dans submitQuiz:', error);
      // Si l'erreur contient déjà un message, la propager
      if (error.message) {
        throw error;
      }
      // Sinon, créer une erreur générique
      throw new Error('Erreur lors de la soumission du quiz. Veuillez réessayer.');
    }
  }

  /**
   * Récupérer mes statistiques Play
   */
  async getMyStats() {
    const response = await tokenManager.fetchWithAuth(
      `${API_BASE_URL}/play/stats/my-stats`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Récupérer le classement général
   * @param {Object} params - Paramètres de filtrage
   * @param {string} params.period - Période (ALL_TIME, MONTHLY, WEEKLY)
   * @param {number} params.limit - Nombre de résultats
   * @param {number} params.offset - Décalage pour la pagination
   */
  async getLeaderboard(params = {}) {
    const { period = 'ALL_TIME', limit = 50, offset = 0 } = params;
    const queryParams = new URLSearchParams({
      period,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await tokenManager.fetchWithAuth(
      `${API_BASE_URL}/play/leaderboard?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }

  /**
   * Récupérer mes récompenses
   */
  async getMyRewards() {
    const response = await tokenManager.fetchWithAuth(
      `${API_BASE_URL}/play/rewards/my-rewards`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || [];
  }
}

// Instance unique (Singleton)
const quizService = new QuizService();

export default quizService;
