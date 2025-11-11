const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

class TokenManager {
  constructor() {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  /**
   * 🔄 Rafraîchir le token d'accès
   */
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refreshToken
        })
      });

      if (!response.ok) {
        throw new Error('Échec du rafraîchissement du token');
      }

      const data = await response.json();
      
      // ✅ Gérer différents formats de réponse
      const newAccessToken = 
        data?.accessToken || 
        data?.access_token || 
        data?.data?.accessToken || 
        data?.data?.access_token;

      if (!newAccessToken) {
        throw new Error('Token invalide dans la réponse');
      }

      // 💾 Sauvegarder le nouveau token
      localStorage.setItem('access_token', newAccessToken);
      
      console.log('✅ Token rafraîchi avec succès');
      return newAccessToken;

    } catch (error) {
      console.error('❌ Erreur refresh token:', error);
      
      // 🚪 Déconnecter l'utilisateur si le refresh échoue
      this.logout();
      throw error;
    }
  }

  /**
   * 🔁 Ajouter une requête en attente pendant le refresh
   */
  subscribeTokenRefresh(callback) {
    this.refreshSubscribers.push(callback);
  }

  /**
   * 📢 Notifier toutes les requêtes en attente
   */
  onTokenRefreshed(token) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * 🌐 Fonction fetch avec gestion automatique du refresh
   */
  async fetchWithAuth(url, options = {}) {
    const accessToken = localStorage.getItem('access_token');
    
    // 📝 Ajouter le token aux headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // 🔴 Si erreur 401, tenter de rafraîchir le token
    if (response.status === 401) {
      
      // ⏳ Si un refresh est déjà en cours, attendre
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.subscribeTokenRefresh((newToken) => {
            headers.Authorization = `Bearer ${newToken}`;
            fetch(url, { ...options, headers })
              .then(resolve)
              .catch(reject);
          });
        });
      }

      // 🔄 Lancer le refresh
      this.isRefreshing = true;

      try {
        const newToken = await this.refreshAccessToken();
        this.isRefreshing = false;
        this.onTokenRefreshed(newToken);

        // ✅ Relancer la requête avec le nouveau token
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });

      } catch (error) {
        this.isRefreshing = false;
        throw error;
      }
    }

    return response;
  }

  /**
   * 🚪 Déconnexion complète
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    // 📢 Déclencher un événement pour informer les autres composants
    window.dispatchEvent(new Event('logout'));
    
    // 🔄 Rediriger vers la page de connexion
    window.location.href = '/login';
  }

  /**
   * ✅ Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  /**
   * 📦 Obtenir le token actuel
   */
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  /**
   * 💾 Sauvegarder les tokens après connexion
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    
    // 📢 Informer les autres onglets
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'access_token',
      newValue: accessToken
    }));
  }
}

// 🌍 Instance unique (Singleton)
const tokenManager = new TokenManager();

export default tokenManager;