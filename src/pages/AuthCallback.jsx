import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConsumApi from "../services_workers/consum_api";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Connexion avec Google en cours...");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        console.log("Début de la gestion du callback Google...");
        console.log("Paramètres URL:", Object.fromEntries(searchParams));
        
        // Étape 1: Récupérer les tokens depuis l'URL de callback
        const result = await ConsumApi.handleGoogleCallback(searchParams);
        console.log("🔑 Résultat de handleGoogleCallback:", result);

        if (result.success) {
          console.log("✅ Connexion Google réussie! Redirection vers l'accueil");
          setStatus("Redirection...");
          // Rediriger vers la page d'accueil
          // Les tokens sont déjà sauvegardés dans tokenManager via handleGoogleCallback
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 500);
        } else {
          console.error("❌ Échec de handleGoogleCallback:", result.error);
          setStatus("Échec de la connexion: " + (result.error || "Erreur inconnue"));
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error("❌ Erreur dans AuthCallback:", error);
        setStatus("Une erreur est survenue: " + error.message);
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#374151"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "4px solid rgba(234,88,12,0.3)",
        borderTop: "4px solid #ea580c",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "1rem"
      }}></div>
      <p>{status}</p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;
