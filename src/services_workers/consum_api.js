import axios from 'axios';
import tokenManager from '../helper/tokenManager';

export default class ConsumApi {
  static api = axios.create({
    baseURL: 'https://alloecoleapi-dev.up.railway.app/api/v1',
    headers: { 'Access-Control-Allow-Origin': '*' }
  });

  static isRefreshing = false;
  static pendingRequestsQueue = [];

  /**
   * 🔧 Configuration des intercepteurs Axios avec TokenManager
   */
  static setupInterceptors() {
    if (this._interceptorsSetup) return;
    this._interceptorsSetup = true;

    // 📤 Intercepteur de requête - Ajouter le token
    this.api.interceptors.request.use(
      (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 📥 Intercepteur de réponse - Gérer l'expiration
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 🔴 Erreur 401 = Token expiré
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // ⏳ Si refresh en cours, mettre en file d'attente
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.pendingRequestsQueue.push({ resolve, reject, config: originalRequest });
            });
          }

          this.isRefreshing = true;

          try {
            // 🔄 Utiliser le TokenManager pour refresh
            const newToken = await tokenManager.refreshAccessToken();
            
            // ✅ Relancer toutes les requêtes en attente
            this.pendingRequestsQueue.forEach(({ resolve, config }) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(this.api(config));
            });
            this.pendingRequestsQueue = [];

            // ✅ Relancer la requête originale
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);

          } catch (refreshError) {
            // ❌ Échec du refresh - Rejeter toutes les requêtes
            this.pendingRequestsQueue.forEach(({ reject }) => reject(refreshError));
            this.pendingRequestsQueue = [];
            
            tokenManager.logout();
            return Promise.reject(refreshError);
            
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * 📱 Envoi OTP par SMS
   */
  static async sendOTP(phoneNumber) {
    try {
      const response = await fetch('https://alloecoleapi-dev.up.railway.app/api/v1/auth/sms/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMessage = responseData.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.responseData = responseData;
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  /**
   * ✅ Vérification OTP
   */
  static async verifyOTP(phoneNumber, code) {
    try {
      const response = await fetch('https://alloecoleapi-dev.up.railway.app/api/v1/auth/sms/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMessage = responseData.message || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.responseData = responseData;
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * 🔐 Connexion Google OAuth
   */
  static async loginWithGoogle() {
    try {
      const callbackUrl = `${window.location.origin}/auth/callback`;
      const redirectUrl = `https://alloecoleapi-dev.up.railway.app/api/v1/auth/google?redirect_uri=${callbackUrl}`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Erreur lors de la redirection vers Google:", error);
      return { success: false, error: "Impossible de lancer la connexion Google" };
    }
  }

  /**
   * 🔁 Traitement du callback Google OAuth
   */
  static async handleGoogleCallback(searchParams) {
    try {
      const success = searchParams.get("success");
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      console.log("🔍 Params reçus:", { success, accessToken, refreshToken });

      if (success === "true" && accessToken) {
        // ✅ Utiliser TokenManager pour sauvegarder
        tokenManager.setTokens(accessToken, refreshToken);
        
        console.log("✅ Tokens enregistrés via TokenManager!");
        return { success: true, accessToken, refreshToken };
      } else {
        console.warn("⚠️ Paramètres invalides dans le callback.");
        return { success: false, error: "Paramètres invalides dans le callback" };
      }
    } catch (error) {
      console.error("❌ Erreur dans handleGoogleCallback:", error);
      return { success: false, error: "Erreur pendant le traitement du callback" };
    }
  }

  /**
   * 👤 Récupérer le profil utilisateur
   */
  static async getUser() {
    try {
      this.setupInterceptors();
      const response = await this.api.get('/profile/student');
      const user = response.data?.data ?? response.data;
      return { success: true, user };
    } catch (error) {
      console.error("Erreur lors de getUser:", error);
      return { success: false, message: "Erreur interne" };
    }
  }

  /**
   * ✏️ Mettre à jour le profil utilisateur
   */
  static async updateUserProfile(payload) {
    try {
      this.setupInterceptors();
      const response = await this.api.put('/profile/student', payload);
      const user = response.data?.data ?? response.data;
      return { success: true, user };
    } catch (error) {
      console.error('Erreur updateUserProfile:', error);
      const message = error.response?.data?.message || 'Échec de la mise à jour du profil';
      return { success: false, message };
    }
  }

  /**
   * 🔄 Rafraîchir le token (legacy - utilise TokenManager)
   */
  static async refreshAccessToken() {
    return tokenManager.refreshAccessToken();
  }

  /**
   * 📦 Obtenir l'utilisateur stocké
   */
  static getStoredUser() {
    try {
      const userData = localStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erreur lecture user_data:', error);
      return null;
    }
  }

  /**
   * ✅ Vérifier l'authentification
   */
  static isAuthenticated() {
    return tokenManager.isAuthenticated();
  }

  /**
   * 🚪 Déconnexion
   */
  static logout() {
    tokenManager.logout();
  }

  /**
   * 🔐 Connexion standard (email/mot de passe)
   */
  static async login({ email, password }) {
    try {
      const response = await this.api.post('/auth/login', { email, password });

      if (response.status >= 200 && response.status < 400) {
        const { data } = response;
        
        // 💾 Sauvegarder les tokens via TokenManager
        const accessToken = data?.access_token || data?.accessToken || data?.data?.access_token;
        const refreshToken = data?.refresh_token || data?.refreshToken || data?.data?.refresh_token;
        
        if (accessToken) {
          tokenManager.setTokens(accessToken, refreshToken);
          
          // 💾 Sauvegarder les données utilisateur si présentes
          if (data?.user || data?.data?.user) {
            const user = data?.user || data?.data?.user;
            localStorage.setItem('user_data', JSON.stringify(user));
          }
          
          return { success: true, data };
        }

        return { success: false, error: 'Réponse invalide du serveur' };
      }

      const errorMessage = response.data?.message || 'Erreur de connexion';
      return {
        success: false,
        error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      const errorMessage = error.response?.data?.message || 'Erreur de connexion';
      return {
        success: false,
        error: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
      };
    }
  }
}

// 🚀 Initialiser les intercepteurs au chargement
ConsumApi.setupInterceptors();