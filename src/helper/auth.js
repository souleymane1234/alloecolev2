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

// 🔁 Rafraîchit le token d’accès avec ton endpoint
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    const res = await fetch('https://alloecoleapi-dev.up.railway.app/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (res.status === 401 || res.status === 422) {
      console.warn('Refresh token invalide ou expiré.');
      return null;
    }

    if (!res.ok) {
      console.error('Erreur serveur lors du refresh token:', res.status);
      return null;
    }

    const data = await res.json();

    if (data.accessToken) {
      localStorage.setItem('access_token', data.accessToken);
      console.log('✅ Nouveau accessToken reçu.');
      return data.accessToken;
    }

    console.warn('⚠️ Aucun accessToken dans la réponse du refresh.');
    return null;
  } catch (err) {
    console.error('Erreur réseau lors du refresh token:', err);
    return null;
  }
};

// 🧠 Vérifie l’état d’authentification (et tente un refresh si besoin)
export const checkAuthStatus = async () => {
  let accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // Pas de token du tout → non connecté
  if (!accessToken && !refreshToken) return false;

  // Si access_token expiré → essayer de le rafraîchir
  if (isTokenExpired(accessToken)) {
    console.log('🔁 Token expiré, tentative de refresh...');
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // refresh a échoué
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return false;
    }
    accessToken = newToken;
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
