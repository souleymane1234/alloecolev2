// src/utils/auth.js

// 🔒 Vérifie si un token JWT est expiré
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp && payload.exp < now;
  } catch (e) {
    return true;
  }
};

// 🔁 Rafraîchit le token d’accès (désactivé : tokens valables 7 jours)
export const refreshAccessToken = async () => {
  console.warn('Refresh token non utilisé (validité 7 jours).');
  return null;
};

// 🧠 Vérifie l’état d’authentification (et tente un refresh si besoin)
export const checkAuthStatus = async () => {
  let accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // Pas de token du tout → non connecté
  if (!accessToken && !refreshToken) return false;

  // Si access_token expiré → considérer l'utilisateur non connecté
  if (isTokenExpired(accessToken)) {
    console.log('🔁 Token expiré (pas de refresh automatique).');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return false;
  }

  // Token encore valide ou bien rafraîchi → utilisateur connecté
  return true;
};

// 🚪 Déconnexion propre
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/';
};
