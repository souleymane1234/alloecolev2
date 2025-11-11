import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogIn, LogOut } from 'lucide-react';
import tokenManager from '../../helper/tokenManager';
import './UserProfileSidebar.css';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const UserProfileSidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 📦 Charger le profil utilisateur avec auto-refresh
   */
  const loadUser = async () => {
    if (!tokenManager.isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🌐 Utiliser fetchWithAuth pour gérer automatiquement le refresh
      const response = await tokenManager.fetchWithAuth(`${API_BASE}/profile/student`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const json = await response.json();
      const userData = json?.data ?? json;
      
      console.log('✅ Profil chargé:', userData);
      setUser(userData);
      
    } catch (err) {
      console.error('❌ Erreur profil sidebar:', err);
      setError(err.message);
      
      // Si l'erreur vient du token, l'utilisateur sera déconnecté automatiquement
      if (err.message.includes('token') || !tokenManager.isAuthenticated()) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 👂 Écouter les changements d'authentification
   */
  useEffect(() => {
    loadUser(); // Chargement initial

    // 🔄 Écouter les changements de token
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        if (e.newValue) {
          loadUser();
        } else {
          setUser(null);
        }
      }
    };

    // 🚪 Écouter les déconnexions
    const handleLogout = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  /**
   * 🎨 Générer les initiales
   */
  const getInitials = () => {
    if (!user) return '?';
    const firstName = user?.firstName || user?.prenom || 'P';
    const lastName = user?.lastName || user?.nom || 'N';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  /**
   * 🎨 Couleur aléatoire pour l'avatar
   */
  const getAvatarColor = () => {
    if (!user) return '#6b7280';
    const name = `${user?.firstName || user?.prenom || ''}${user?.lastName || user?.nom || ''}`;
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#F8B739', '#52B788', '#E07A5F', '#81B29A'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  /**
   * 🔓 Déconnexion via TokenManager
   */
  const handleLogout = () => {
    tokenManager.logout();
    setUser(null);
  };

  // 🔄 Affichage pendant le chargement
  if (loading) {
    return (
      <div className="profile-sidebar">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // ✅ Si utilisateur connecté
  if (user) {
    const hasImage = user?.profileImage || user?.photo || user?.avatar;

    return (
      <div className="profile-sidebar">
        <div className="profile-header">
          <div className="profile-avatar">
            {hasImage ? (
              <>
                <img 
                  src={user.profileImage || user.photo || user.avatar}
                  alt="Profil"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-placeholder" style={{ display: 'none', backgroundColor: getAvatarColor() }}>
                  {getInitials()}
                </div>
              </>
            ) : (
              <div className="avatar-placeholder" style={{ backgroundColor: getAvatarColor() }}>
                {getInitials()}
              </div>
            )}
            <div className="online-indicator"></div>
          </div>
          <div className="profile-info">
            <h4>{user.firstName || user.prenom || 'Prénom'} {user.lastName || user.nom || 'Nom'}</h4>
            <p>{user.email || 'Email non disponible'}</p>
            {(user.city || user.ville) && (
              <p>📍 {user.city || user.ville}{(user.country || user.pays) ? `, ${user.country || user.pays}` : ''}</p>
            )}
          </div>
        </div>

        <div className="profile-quick-actions">
          <Link to="/profil" className="quick-action-btn">
            <User /> Mon Profil
          </Link>
          <Link to="/profil?tab=parametres" className="quick-action-btn">
            <Settings /> Paramètres
          </Link>
          <button onClick={handleLogout} className="quick-action-btn logout-btn">
            <LogOut /> Déconnexion
          </button>
        </div>

        {error && (
          <div className="error-message">
            <small>⚠️ {error}</small>
          </div>
        )}
      </div>
    );
  }

  // 👤 Si utilisateur non connecté
  return (
    <div className="profile-sidebar">
      <div className="guest-profile">
        <div className="guest-header">
          <User className="icon-lg" />
          <h4>Rejoignez-nous</h4>
          <p>Connectez-vous pour accéder à toutes les fonctionnalités</p>
        </div>
        <div className="guest-actions">
          <Link to="/login" className="btn-primary full-width">
            <LogIn /> S'authentifier
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSidebar;