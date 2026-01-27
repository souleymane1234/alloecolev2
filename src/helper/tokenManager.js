const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

class TokenManager {
  constructor() {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
    // 💾 Stockage en mémoire ET localStorage pour la persistance
    this.tokens = {
      accessToken: null,
      refreshToken: null,
      userData: null
    };
    
    // 🔄 Charger les tokens depuis localStorage au démarrage
    this.loadTokensFromStorage();
  }

  /**
   * 📥 Charger les tokens depuis localStorage
   */
  loadTokensFromStorage() {
    try {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const userDataStr = localStorage.getItem('user_data');
      
      if (accessToken) {
        this.tokens.accessToken = accessToken;
        console.log('✅ Access token chargé depuis localStorage');
      }
      
      if (refreshToken) {
        this.tokens.refreshToken = refreshToken;
        console.log('✅ Refresh token chargé depuis localStorage');
      }
      
      if (userDataStr) {
        try {
          this.tokens.userData = JSON.parse(userDataStr);
          console.log('✅ User data chargé depuis localStorage');
        } catch (e) {
          console.warn('⚠️ Erreur parsing user_data:', e);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des tokens depuis localStorage:', error);
    }
  }

  /**
   * 🔍 Décoder un JWT pour voir son contenu
   */
  decodeJWT(token) {
    try {
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('⚠️ Token JWT invalide (format incorrect)');
        return null;
      }
      
      // Décoder le payload (partie 2)
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      
      return decoded;
    } catch (error) {
      console.error('❌ Erreur lors du décodage du JWT:', error);
      return null;
    }
  }

  /**
   * 📅 Afficher les informations du token (expiration, etc.)
   */
  logTokenInfo(token, tokenType = 'Access Token') {
    if (!token) {
      console.log(`❌ ${tokenType}: Aucun token disponible`);
      return;
    }
    
    const decoded = this.decodeJWT(token);
    
    if (!decoded) {
      console.log(`⚠️ ${tokenType}: Impossible de décoder le token`);
      console.log(`Token brut (premiers 50 caractères):`, token.substring(0, 50) + '...');
      return;
    }
    
    const now = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
    const exp = decoded.exp; // Date d'expiration
    const iat = decoded.iat; // Date de création
    
    if (exp) {
      const expirationDate = new Date(exp * 1000);
      const creationDate = iat ? new Date(iat * 1000) : null;
      const timeRemaining = exp - now; // Temps restant en secondes
      const hoursRemaining = Math.floor(timeRemaining / 3600);
      const minutesRemaining = Math.floor((timeRemaining % 3600) / 60);
      const isExpired = timeRemaining <= 0;
      
      console.log(`\n🔐 ${tokenType} - Informations:`, {
        'Token complet': token,
        'Token (premiers 50 caractères)': token.substring(0, 50) + '...',
        'Longueur': token.length,
        'Date de création': creationDate ? creationDate.toLocaleString('fr-FR') : 'Non disponible',
        'Date d\'expiration': expirationDate.toLocaleString('fr-FR'),
        'Temps restant': isExpired 
          ? '❌ EXPIRÉ' 
          : `${hoursRemaining}h ${minutesRemaining}min`,
        'Secondes restantes': timeRemaining,
        'Statut': isExpired ? '❌ EXPIRÉ' : '✅ VALIDE',
        'Payload décodé': decoded
      });
      
      if (isExpired) {
        console.warn(`⚠️ ${tokenType} est EXPIRÉ depuis ${Math.abs(hoursRemaining)}h ${Math.abs(minutesRemaining)}min`);
      }
    } else {
      console.log(`⚠️ ${tokenType}: Pas de date d'expiration trouvée dans le token`);
      console.log('Payload décodé:', decoded);
    }
  }

  /**
   * 💾 Getters et Setters pour les tokens
   */
  getAccessToken() {
    return this.tokens.accessToken;
  }

  getRefreshToken() {
    return this.tokens.refreshToken;
  }

  getUserData() {
    return this.tokens.userData;
  }

  setTokens(accessToken, refreshToken, userData = null) {
    // 💾 Sauvegarder en mémoire
    this.tokens.accessToken = accessToken;
    if (refreshToken) {
      this.tokens.refreshToken = refreshToken;
    }
    if (userData) {
      this.tokens.userData = userData;
    }
    
    // 🔍 Afficher les informations des tokens
    console.log('\n' + '='.repeat(80));
    console.log('🔐 CONNEXION RÉUSSIE - Informations des tokens');
    console.log('='.repeat(80));
    
    if (accessToken) {
      this.logTokenInfo(accessToken, 'Access Token');
    }
    
    if (refreshToken) {
      this.logTokenInfo(refreshToken, 'Refresh Token');
    }
    
    console.log('='.repeat(80) + '\n');
    
    // 💾 Sauvegarder aussi dans localStorage pour la persistance
    try {
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      if (userData) {
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
      
      console.log('✅ Tokens sauvegardés en mémoire ET localStorage', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userData
      });
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }

  /**
   * 🔄 Rafraîchir le token d'accès
   */
  async refreshAccessToken() {
    // Essayer d'abord depuis la mémoire, puis depuis localStorage
    let refreshToken = this.tokens.refreshToken;
    
    if (!refreshToken) {
      refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        this.tokens.refreshToken = refreshToken;
        console.log('✅ Refresh token récupéré depuis localStorage');
      }
    }
    
    if (!refreshToken) {
      console.error('❌ Aucun refresh token disponible');
      throw new Error('Aucun refresh token disponible');
    }

    console.log('🔄 Tentative de rafraîchissement du token...', { 
      hasRefreshToken: !!refreshToken,
      refreshTokenLength: refreshToken.length,
      refreshTokenPreview: refreshToken.substring(0, 50) + '...',
      currentAccessToken: this.tokens.accessToken ? this.tokens.accessToken.substring(0, 50) + '...' : 'none'
    });

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

      console.log('📥 Réponse refresh:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let errorData = {};
        try {
          if (errorText) errorData = JSON.parse(errorText);
        } catch (e) {}
        
        console.error('❌ Erreur lors du refresh:', { 
          status: response.status, 
          errorText,
          errorData 
        });
        
        // Si le refresh token est invalide ou expiré, ne pas déconnecter automatiquement
        if (response.status === 401 || response.status === 403) {
          console.error('❌ Refresh token invalide ou expiré');
          // Ne pas déconnecter, laisser l'utilisateur sur la page
          throw new Error('Votre session a expiré. Vous pouvez continuer à naviguer, mais certaines fonctionnalités nécessiteront une reconnexion.');
        }
        
        throw new Error(errorData.message || 'Échec du rafraîchissement du token');
      }

      const data = await response.json();
      
      console.log('✅ Réponse refresh token:', {
        hasData: !!data,
        dataKeys: Object.keys(data || {}),
        fullData: data
      });
      
      // ✅ Gérer différents formats de réponse
      // Format doc API: { "accessToken": "string" }
      // Format possible avec wrapper: { "success": true, "data": { "accessToken": "..." } }
      const newAccessToken = 
        data?.accessToken ||           // Format direct (selon doc API)
        data?.data?.accessToken;       // Format avec wrapper (fallback)

      if (!newAccessToken) {
        console.error('❌ accessToken manquant dans la réponse:', {
          data,
          accessToken: data?.accessToken,
          dataAccessToken: data?.data?.accessToken
        });
        throw new Error('Token invalide dans la réponse');
      }

      console.log('✅ Nouveau token extrait:', {
        length: newAccessToken.length,
        preview: newAccessToken.substring(0, 50) + '...',
        startsWith: newAccessToken.substring(0, 20)
      });

      // 💾 Sauvegarder le nouveau token en mémoire ET localStorage
      const oldToken = this.tokens.accessToken;
      this.tokens.accessToken = newAccessToken;
      
      // Sauvegarder aussi dans localStorage
      try {
      localStorage.setItem('access_token', newAccessToken);
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde du nouveau token:', error);
      }
      
      console.log('✅ Token rafraîchi avec succès', {
        oldTokenLength: oldToken?.length,
        oldTokenStart: oldToken?.substring(0, 30) + '...',
        newTokenLength: newAccessToken.length,
        newTokenStart: newAccessToken.substring(0, 30) + '...',
        tokensAreDifferent: oldToken !== newAccessToken
      });
      
      return newAccessToken;

    } catch (error) {
      console.error('❌ Erreur refresh token:', error);
      
      // Ne pas déconnecter automatiquement, laisser l'utilisateur sur la page
      // L'application gérera l'affichage des erreurs si nécessaire
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
    // Essayer d'abord depuis la mémoire, puis depuis localStorage
    let accessToken = this.tokens.accessToken;
    
    if (!accessToken) {
      accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        this.tokens.accessToken = accessToken;
        console.log('✅ Access token récupéré depuis localStorage');
      }
    }
    
    // 📝 Ajouter le token aux headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn('⚠️ Aucun access token disponible pour la requête:', url);
    }

    // Sauvegarder le body si présent
    const body = options.body;
    
    console.log('🌐 Requête avec token:', { 
      url, 
      hasToken: !!accessToken,
      tokenLength: accessToken?.length,
      tokenPreview: accessToken ? accessToken.substring(0, 50) + '...' : 'none',
      hasBody: !!body,
      method: options.method || 'GET',
      authorizationHeader: headers.Authorization ? 'Bearer ***' : 'none'
    });
    
    const response = await fetch(url, { ...options, headers });
    
    console.log('📥 Réponse initiale:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      url: response.url
    });

    // 🔴 Si 401, ne pas utiliser de refresh (tokens valides 7 jours)
    if (response.status === 401 && !response.ok) {
      console.warn('⚠️ 401 reçu. Aucun refresh token utilisé (validité 7 jours).');
    }

    return response;
  }

  /**
   * 🚪 Déconnexion complète
   */
  logout() {
    // Nettoyer la mémoire
    this.tokens = {
      accessToken: null,
      refreshToken: null,
      userData: null
    };
    
    // Nettoyer localStorage
    try {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage de localStorage:', error);
    }
    
    console.log('🚪 Utilisateur déconnecté');
    
    // 📢 Déclencher un événement pour informer les composants
    if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('logout'));
    }
    
    // Note: La redirection doit être gérée par l'application
    // car ce code peut être utilisé côté serveur
  }

  /**
   * ✅ Vérifier si l'utilisateur est authentifié
   * Retourne true si un access token existe, même si le refresh token a un problème
   * Cela permet à l'utilisateur de rester sur la page même si le refresh échoue
   */
  isAuthenticated() {
    // Vérifier d'abord en mémoire
    if (this.tokens.accessToken) {
      return true;
  }

    // Si pas en mémoire, vérifier localStorage (au cas où la page a été rechargée)
    try {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        // Recharger depuis localStorage dans la mémoire
        this.tokens.accessToken = accessToken;
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          this.tokens.refreshToken = refreshToken;
        }
        return true;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification dans localStorage:', error);
    }
    
    return false;
  }

  /**
   * 🔍 Obtenir les informations utilisateur
   */
  getUser() {
    return this.tokens.userData;
    }
    
  /**
   * 💾 Sauvegarder les données utilisateur
   */
  setUserData(userData) {
    this.tokens.userData = userData;
    
    // Sauvegarder aussi dans localStorage
    try {
      if (userData) {
        localStorage.setItem('user_data', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user_data');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de user_data:', error);
    }
  }

  /**
   * 🧹 Réinitialiser complètement le manager
   */
  reset() {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
    this.tokens = {
      accessToken: null,
      refreshToken: null,
      userData: null
    };
    
    // Nettoyer localStorage aussi
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('❌ Erreur lors du reset de localStorage:', error);
    }
  }
}

// 🌍 Instance unique (Singleton)
const tokenManager = new TokenManager();

export default tokenManager;