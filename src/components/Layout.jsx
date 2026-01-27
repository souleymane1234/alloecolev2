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
        const token = tokenManager.getAccessToken();
        const refreshToken = tokenManager.getRefreshToken();
        
        console.log("✅ Utilisateur connecté détecté");
        console.log("Access Token:", token?.substring(0, 50) + '...');
        console.log("Refresh Token:", refreshToken?.substring(0, 50) + '...');
        console.log("Token complet stocké:", !!token);
      } else {
        console.log("❌ Aucun utilisateur connecté");
      }
    };

    checkAuth();

    // 🚪 Écouter les déconnexions depuis le TokenManager
    const handleLogout = () => {
      console.log("🚪 Déconnexion détectée dans Layout");
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    };

    window.addEventListener('logout', handleLogout);

    return () => {
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
        console.log("📥 Réception tokens OAuth depuis URL");
        console.log("Access Token reçu:", accessToken.substring(0, 50) + '...');
        console.log("Refresh Token reçu:", refreshToken?.substring(0, 50) + '...');
        
        // ✅ Sauvegarder dans TokenManager (en mémoire)
        tokenManager.setTokens(accessToken, refreshToken);
        
        // ✅ Vérifier que les tokens sont bien sauvegardés
        const savedAccessToken = tokenManager.getAccessToken();
        const savedRefreshToken = tokenManager.getRefreshToken();
        
        console.log("✅ Tokens sauvegardés dans TokenManager");
        console.log("Vérification Access Token:", savedAccessToken === accessToken ? "✅ OK" : "❌ ERREUR");
        console.log("Vérification Refresh Token:", savedRefreshToken === refreshToken ? "✅ OK" : "❌ ERREUR");
        
        setIsAuthenticated(true);

        // 🔄 Nettoyer l'URL et rediriger
        const cleanPath = redirect 
          ? decodeURIComponent(redirect) 
          : location.pathname;
        
        console.log("🔄 Redirection vers:", cleanPath);
        navigate(cleanPath, { replace: true });
        
      } catch (e) {
        console.error("❌ Erreur lors de l'enregistrement des tokens OAuth:", e);
      }
    }
  }, [location.search, location.pathname, navigate]);

  /**
   * 🔄 Vérifier l'authentification quand la route change
   */
  useEffect(() => {
    const authenticated = tokenManager.isAuthenticated();
    
    if (authenticated !== isAuthenticated) {
      console.log("🔄 Changement d'état d'authentification:", authenticated);
      setIsAuthenticated(authenticated);
    }
    
    // ✅ La navigation est libre - on ne bloque plus l'accès aux pages
    // La connexion sera demandée uniquement au moment d'exécuter une action qui en nécessite une
  }, [location.pathname, isAuthenticated, isLoginPage, isRegisterPage, navigate]);

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