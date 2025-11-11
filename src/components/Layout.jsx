import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import HeaderOne from './HeaderOne';
import tokenManager from '../helper/tokenManager';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const isLoginPage = location.pathname === "/login"; 
  const isRegisterPage = location.pathname === "/register";

  /**
   * ✅ Vérifier l'authentification au chargement
   */
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = tokenManager.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        console.log("✅ Utilisateur connecté détecté");
        console.log("Token:", tokenManager.getAccessToken());
      }
    };

    checkAuth();

    // 🔄 Écouter les changements dans localStorage (multi-onglets)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };

    // 🚪 Écouter les déconnexions
    const handleLogout = () => {
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleLogout);
    };
  }, [navigate]);

  /**
   * 🔐 Gérer les tokens OAuth depuis les paramètres d'URL
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const success = params.get("success");
    const redirect = params.get("redirect");

    if (success === "true" && accessToken) {
      try {
        // ✅ Utiliser TokenManager pour sauvegarder
        tokenManager.setTokens(accessToken, refreshToken);
        
        console.log("✅ Tokens OAuth enregistrés via TokenManager");
        console.log("Access Token:", accessToken);
        if (refreshToken) console.log("Refresh Token:", refreshToken);
        
        setIsAuthenticated(true);

        // 🔄 Nettoyer l'URL et rediriger
        const cleanPath = redirect 
          ? decodeURIComponent(redirect) 
          : location.pathname;
        
        navigate(cleanPath, { replace: true });
        
      } catch (e) {
        console.error("❌ Erreur lors de l'enregistrement des tokens OAuth:", e);
      }
    }
  }, [location.search, location.pathname, navigate]);

  /**
   * 🔄 Mettre à jour l'état quand la route change
   */
  useEffect(() => {
    const authenticated = tokenManager.isAuthenticated();
    if (authenticated !== isAuthenticated) {
      setIsAuthenticated(authenticated);
    }
  }, [location.pathname]);

  return (
    <div className="app">
      <div className="main-content">
        {/* 🎯 Afficher le header sauf sur login/register */}
        {!isLoginPage && !isRegisterPage && (
          <HeaderOne isAuthenticated={isAuthenticated} />
        )}
        
        <div className="content">
          {/* 📤 Passer l'état d'authentification aux composants enfants */}
          <Outlet context={{ isAuthenticated }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;