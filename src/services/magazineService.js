import tokenManager from '../helper/tokenManager';

const API_BASE_URL = 'https://alloecoleapi-dev.up.railway.app/api/v1';

/**
 * Service API pour les magazines
 */
class MagazineService {
  /**
   * Lister tous les magazines publiés
   * @param {Object} params - Paramètres de pagination
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   */
  async getMagazines(params = {}) {
    const { page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/magazine?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      magazines: data?.data || [],
      pagination: data?.pagination || {}
    };
  }

  /**
   * Récupérer un magazine par son ID
   * @param {string} id - ID du magazine
   */
  async getMagazineById(id) {
    const response = await fetch(`${API_BASE_URL}/magazine/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Magazine non trouvé');
      }
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  }
}

const magazineService = new MagazineService();
export default magazineService;

