import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenManager from '../../helper/tokenManager';
import './OrientationInteractive.css';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const OrientationInteractive = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(tokenManager.isAuthenticated());
  const [questionnaires, setQuestionnaires] = useState([]);
  const [questionnairesLoading, setQuestionnairesLoading] = useState(false);
  const [questionnairesError, setQuestionnairesError] = useState('');

  const [sessionLoading, setSessionLoading] = useState(null);
  const [sessionState, setSessionState] = useState(null);
  const [answers, setAnswers] = useState({});
  const [latestProfile, setLatestProfile] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [userOpenedQuestionnaire, setUserOpenedQuestionnaire] = useState(false);

  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);

  const profile = sessionState?.profile || latestProfile || null;
  const recommendedCareers = profile?.aiAnalysis?.recommendedCareers || [];
  const topCareer = recommendedCareers[0] || null;
  const strengths = profile?.aiAnalysis?.strengths || [];
  const weaknesses = profile?.aiAnalysis?.weaknesses || [];
  const generalRecommendations = profile?.aiAnalysis?.generalRecommendations || [];
  const saveTimeoutRef = useRef(null);

  const notifyAuthChanges = useCallback(() => {
    setIsAuthenticated(tokenManager.isAuthenticated());
  }, []);

  useEffect(() => {
    window.addEventListener('storage', notifyAuthChanges);
    window.addEventListener('logout', notifyAuthChanges);
    return () => {
      window.removeEventListener('storage', notifyAuthChanges);
      window.removeEventListener('logout', notifyAuthChanges);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notifyAuthChanges]);

  const apiCall = useCallback(async (path, options = {}, retries = 3) => {
    try {
      const response = await tokenManager.fetchWithAuth(`${API_BASE}${path}`, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        
        // Gestion spécifique du rate limiting
        if (response.status === 429 && retries > 0) {
          const retryAfter = response.headers.get('Retry-After') || 3;
          console.log(`Rate limit atteint. Nouvelle tentative dans ${retryAfter}s...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          return apiCall(path, options, retries - 1);
        }
        
        throw new Error(errorText || `Erreur API (${response.status})`);
      }
      return response.json();
    } catch (error) {
      // Retry pour les erreurs de throttling
      if (retries > 0 && (error.message.includes('Too Many Requests') || error.message.includes('ThrottlerException'))) {
        console.log(`Erreur de rate limiting. Nouvelle tentative dans 3s...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return apiCall(path, options, retries - 1);
      }
      throw error;
    }
  }, []);

  const fetchQuestionnaires = useCallback(async () => {
    if (!isAuthenticated) {
      setQuestionnaires([]);
      return;
    }

    setQuestionnairesLoading(true);
    setQuestionnairesError('');
    try {
      const json = await apiCall('/students/orientation/questionnaires');
      // Nouvelle structure API : { success: true, data: { data: [...], total: 1 } }
      const list = json?.data?.data || json?.data || [];
      setQuestionnaires(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Erreur chargement questionnaires:', error);
      setQuestionnairesError(
        error?.message?.includes('Too Many Requests') || error?.message?.includes('ThrottlerException')
          ? "Trop de requêtes. Veuillez patienter quelques instants avant de réessayer."
          : error?.message || "Impossible de charger les questionnaires pour le moment."
      );
    } finally {
      setQuestionnairesLoading(false);
    }
  }, [apiCall, isAuthenticated]);

  const fetchLatestProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setLatestProfile(null);
      return;
    }

    try {
      // Ajouter le paramètre profileType=ETUDIANT
      const json = await apiCall('/students/orientation/profile?profileType=ETUDIANT');
      const data = json?.data ?? json;
      setLatestProfile(data || null);
    } catch (error) {
      console.error('Erreur chargement profil orientation:', error);
    }
  }, [apiCall, isAuthenticated]);

  useEffect(() => {
    fetchQuestionnaires();
  }, [fetchQuestionnaires]);

  useEffect(() => {
    fetchLatestProfile();
  }, [fetchLatestProfile]);

  const normalizeResponses = (payload) => {
    if (!payload) return {};
    const base = Array.isArray(payload)
      ? payload
      : payload.responses || payload.data || [];
    if (!Array.isArray(base)) return {};
    return base.reduce((acc, item) => {
      if (item?.questionId && Array.isArray(item?.optionIds)) {
        acc[item.questionId] = item.optionIds;
      }
      return acc;
    }, {});
  };

  const handleStartSession = async (questionnaireId, resumeLast = true) => {
    if (!questionnaireId || sessionLoading === questionnaireId) return;

    // ✅ Vérifier l'authentification au moment de l'action
    if (!isAuthenticated) {
      setActionError('Veuillez vous connecter pour démarrer une session');
      if (window.confirm('Vous devez être connecté pour accéder au questionnaire. Souhaitez-vous vous connecter ?')) {
        navigate('/login', { state: { from: '/orientation-interactive' } });
      }
      return;
    }

    setShowQuestionnaire(true);
    setUserOpenedQuestionnaire(true);
    
    setSessionLoading(questionnaireId);
    setActionError('');
    setActionMessage('');
    try {
      const json = await apiCall('/students/orientation/start-session', {
        method: 'POST',
        body: JSON.stringify({ 
          questionnaireId, 
          resumeLast,
          profileType: 'ETUDIANT' // Ajouter le profileType requis par la nouvelle API
        }),
      });
      const data = json?.data ?? json;
      setSessionState({
        sessionId: data.sessionId,
        questionnaire: data.questionnaire,
        progress: data.progress,
        resumed: Boolean(data.resumed),
        profile: data.profile || null,
      });
      setAnswers(normalizeResponses(data.responses || data.existingResponses));
      setActiveBlockIndex(0);
      setActionMessage(data.resumed ? 'Votre session a été reprise.' : 'Nouvelle session démarrée.');
    } catch (error) {
      console.error('Erreur démarrage session:', error);
      setActionError(
        error?.message?.includes('Too Many Requests') || error?.message?.includes('ThrottlerException')
          ? "Trop de requêtes. Veuillez patienter quelques instants avant de réessayer."
          : error?.message || "Impossible de démarrer la session. Veuillez réessayer."
      );
    } finally {
      setSessionLoading(null);
    }
  };

  const handleOptionSelect = (question, optionId) => {
    setAnswers((prev) => {
      const current = prev[question.id] || [];
      if (question.type === 'MULTIPLE') {
        const exists = current.includes(optionId);
        const nextOptions = exists
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [question.id]: nextOptions };
      }
      return { ...prev, [question.id]: [optionId] };
    });
  };

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((items) => items?.length).length;
  }, [answers]);

  const buildResponsesPayload = () => {
    const entries = Object.entries(answers).filter(([, optionIds]) => optionIds?.length);
    if (!entries.length) return null;
    return entries.map(([questionId, optionIds]) => ({
      questionId,
      optionIds,
    }));
  };

  const handleSubmitResponses = async (finalize = false) => {
    // Empêcher les appels multiples simultanés
    if (isSubmitting) {
      setActionError("Une sauvegarde est déjà en cours. Veuillez patienter.");
      return;
    }

    if (!sessionState?.sessionId) {
      setActionError("Veuillez démarrer une session avant de soumettre vos réponses.");
      return;
    }
    
    const payloadResponses = buildResponsesPayload();
    if (!payloadResponses) {
      setActionError("Aucune réponse à envoyer.");
      return;
    }

    setActionError('');
    setActionMessage('');
    setIsSubmitting(true);
    finalize ? setFinalizing(true) : setSaving(true);
    
    try {
      const json = await apiCall(
        `/students/orientation/session/${sessionState.sessionId}/responses`,
        {
          method: 'POST',
          body: JSON.stringify({
            responses: payloadResponses,
            ...(finalize ? { finalize: true } : {}),
          }),
        }
      );
      const data = json?.data ?? json;
      setSessionState((prev) => {
        if (finalize) {
          return null;
        }
        return {
          ...prev,
          progress: data.progress || prev?.progress,
          profile: data.profile || prev?.profile || null,
        };
      });
      if (data.profile) {
        setLatestProfile(data.profile);
      } else if (finalize) {
        await fetchLatestProfile();
      }
      if (data.profileGenerated || data.profile) {
        setActionMessage('Profil généré avec succès !');
      } else {
        setActionMessage(finalize ? 'Questionnaire finalisé.' : 'Progression sauvegardée.');
      }
      if (finalize) {
        setAnswers({});
        setActiveBlockIndex(0);
        setUserOpenedQuestionnaire(false);
        setShowQuestionnaire(false);
      }
    } catch (error) {
      console.error('Erreur envoi réponses:', error);
      setActionError(
        error?.message?.includes('Too Many Requests') || error?.message?.includes('ThrottlerException')
          ? "Trop de requêtes envoyées. Veuillez patienter 10-15 secondes avant de réessayer."
          : error?.message || "Impossible d'envoyer les réponses. Veuillez réessayer."
      );
    } finally {
      setSaving(false);
      setFinalizing(false);
      setIsSubmitting(false);
    }
  };

  const handleResetSession = () => {
    const hadProfile = Boolean(sessionState?.profile || latestProfile);
    setSessionState(null);
    setAnswers({});
    setActionError('');
    setActionMessage('');
    setActiveBlockIndex(0);
    setIsSubmitting(false);
    setUserOpenedQuestionnaire(false);
    setShowQuestionnaire(!hadProfile);
  };

  const renderOption = (question, option) => {
    const selected = (answers[question.id] || []).includes(option.id);
    return (
      <button
        key={option.id}
        type="button"
        className={`orientation-option ${selected ? 'selected' : ''}`}
        onClick={() => handleOptionSelect(question, option.id)}
        disabled={isSubmitting}
      >
        <span>{option.label}</span>
        {selected && <i className="ph-check-circle"></i>}
      </button>
    );
  };

  const renderQuestion = (question) => (
    <div key={question.id} className="orientation-question-card">
      <div className="question-header">
        <span className="question-type">
          {question.type === 'MULTIPLE'
            ? 'Choix multiples'
            : question.type === 'SCORE'
              ? 'Évaluation'
              : 'Choix unique'}
        </span>
        <h4>{question.title}</h4>
      </div>
      <div className="question-options">
        {question.options?.map((option) => renderOption(question, option))}
      </div>
    </div>
  );

  const currentBlocks = sessionState?.questionnaire?.blocks || [];
  const activeBlock = currentBlocks[activeBlockIndex] || null;
  const canGoNextBlock = activeBlockIndex < currentBlocks.length - 1;
  const isCurrentBlockComplete = useMemo(() => {
    if (!activeBlock) return false;
    return activeBlock.questions?.every((question) => {
      const selected = answers[question.id];
      return Array.isArray(selected) && selected.length > 0;
    }) || false;
  }, [activeBlock, answers]);

  const totalQuestionsInSession = useMemo(() => {
    if (sessionState?.progress?.totalQuestions) {
      return sessionState.progress.totalQuestions;
    }
    return currentBlocks.reduce(
      (total, block) => total + (block.questions?.length || 0),
      0
    );
  }, [sessionState?.progress?.totalQuestions, currentBlocks]);

  const answeredQuestionsCount = useMemo(() => {
    if (sessionState?.progress?.answeredQuestions) {
      return sessionState.progress.answeredQuestions;
    }
    return answeredCount;
  }, [sessionState?.progress?.answeredQuestions, answeredCount]);

  const canFinalize =
    totalQuestionsInSession > 0 &&
    answeredQuestionsCount >= totalQuestionsInSession;

  useEffect(() => {
    if (sessionState) {
      setShowQuestionnaire(true);
      return;
    }

    if (!profile) {
      setShowQuestionnaire(true);
      return;
    }

    if (profile && !userOpenedQuestionnaire) {
      setShowQuestionnaire(false);
    }
  }, [sessionState, profile, userOpenedQuestionnaire]);

  const heroSection = (
    <div className="orientation-hero">
      <div className="container">
        <div className="orientation-hero-content">
          <div className="orientation-hero-text">
            <p className="hero-badge">Orientation interactive</p>
            <h1>Découvrez le parcours qui vous correspond</h1>
            <p className="hero-subtitle">
              Répondez à un questionnaire dynamique pour générer un profil personnalisé,
              mesurer votre progression et obtenir des suggestions de métiers alignées
              sur vos aspirations.
            </p>
            <div className="hero-stats">
              <div>
                <span>100%</span>
                <small>Dédié aux étudiants AlloÉcole</small>
              </div>
              <div>
                <span>{questionnaires.length || '...'}</span>
                <small>Questionnaires disponibles</small>
              </div>
              <div>
                <span>{sessionState?.progress?.completionRate ?? 0}%</span>
                <small>Taux de complétion actuel</small>
              </div>
            </div>
          </div>
          <div className="orientation-hero-panel">
            <h3>Comment ça marche ?</h3>
            <ul>
              <li>Choisissez un questionnaire d’orientation actif</li>
              <li>Commencez ou reprenez votre session à tout moment</li>
              <li>Enregistrez votre progression et finalisez pour débloquer l’analyse IA</li>
            </ul>
            <p className="panel-note">
              Connectez-vous à votre compte étudiant pour accéder au questionnaire.
            </p>
            {!isAuthenticated && (
              <a className="btn-orange" href="/login">
                Me connecter
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ L'affichage est libre - la connexion sera demandée au moment des actions
  return (
    <section className="orientation-module">
      {heroSection}

      <div className="orientation-content container">
        {!sessionState && showQuestionnaire && (
          <div className="orientation-section">
            <div className="section-header">
              <div>
                <h2>Questionnaires disponibles</h2>
                <p>Chaque parcours explore vos motivations, compétences et ambitions.</p>
              </div>
              <button 
                className="btn-sm-outline" 
                onClick={fetchQuestionnaires}
                disabled={questionnairesLoading}
              >
                <i className={`ph-arrow-clockwise ${questionnairesLoading ? 'ph-spin' : ''}`}></i>
                Actualiser
              </button>
            </div>

            {questionnairesLoading && (
              <div className="orientation-empty">
                <i className="ph-spinner-gap ph-spin"></i>
                <p>Chargement des questionnaires...</p>
              </div>
            )}

            {questionnairesError && (
              <div className="orientation-empty error">
                <i className="ph-warning-circle"></i>
                <p>{questionnairesError}</p>
              </div>
            )}

            {!questionnairesLoading && !questionnairesError && questionnaires.length === 0 && (
              <div className="orientation-empty">
                <i className="ph-list"></i>
                <p>Aucun questionnaire n'est disponible pour le moment.</p>
              </div>
            )}

            <div className="questionnaire-grid">
              {questionnaires.map((item) => (
                <div key={item.id} className="questionnaire-card">
                  <div className="card-header">
                    <div>
                      <p className="card-badge">Parcours {item.totalBlocks || 0} blocs</p>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <div className="card-metrics">
                    <div>
                      <span>{item.totalQuestions}</span>
                      <small>Questions</small>
                    </div>
                    <div>
                      <span>{item.totalBlocks}</span>
                      <small>Thématiques</small>
                    </div>
                    <div>
                      <span>{item.active ? 'Actif' : 'Inactif'}</span>
                      <small>Statut</small>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-orange"
                      disabled={!item.active || sessionLoading === item.id}
                      onClick={() => handleStartSession(item.id, true)}
                    >
                      {sessionLoading === item.id ? (
                        <>
                          <i className="ph-spinner-gap ph-spin"></i>
                          Chargement...
                        </>
                      ) : (
                        <>
                          <i className="ph-play"></i>
                          {sessionState?.questionnaire?.id === item.id ? 'Reprendre' : 'Commencer'}
                        </>
                      )}
                    </button>
                    <button
                      className="btn-sm-secondary"
                      disabled={sessionLoading === item.id}
                      onClick={() => handleStartSession(item.id, false)}
                    >
                      <i className="ph-arrows-counter-clockwise"></i>
                      Recommencer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(showQuestionnaire || sessionState) && (
        <div className="orientation-section">
          <div className="section-header">
            <div>
              <h2>Votre session</h2>
              <p>
                Répondez aux questions bloc par bloc. Sauvegardez vos réponses et finalisez
                lorsque vous aurez complété toutes les sections.
              </p>
            </div>
            {sessionState && (
              <button className="btn-sm-danger" onClick={handleResetSession}>
                <i className="ph-x-circle"></i>
                Quitter la session
              </button>
            )}
          </div>

          {!sessionState && (
            <div className="orientation-empty">
              <i className="ph-notebook"></i>
              <p>Sélectionnez un questionnaire pour démarrer votre session.</p>
            </div>
          )}

          {sessionState && (
            <div className="session-dashboard">
              <div className="session-header-grid">
                <article className="session-card session-progress-card">
                  <div className="session-card-header">
                    <div>
                      <p className="label">Session active</p>
                      <h4>{sessionState.questionnaire.title}</h4>
                      {sessionState.resumed && (
                        <span className="resume-badge">Session reprise automatiquement</span>
                      )}
                    </div>
                  </div>
                  <div className="progress-info">
                    <div className="progress-bar">
                      <span
                        style={{
                          width: `${sessionState?.progress?.completionRate || 0}%`,
                        }}
                      ></span>
                    </div>
                    <div className="progress-stats">
                      <div>
                        <strong>{sessionState?.progress?.completionRate || 0}%</strong>
                        <small>Taux de complétion</small>
                      </div>
                      <div>
                        <strong>
                          {sessionState?.progress?.answeredQuestions || 0}/
                          {sessionState?.progress?.totalQuestions || 0}
                        </strong>
                        <small>Questions répondues</small>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="session-card session-summary-card">
                  <div className="session-card-header">
                    <div>
                      <p className="label">Résumé</p>
                      <h4>Informations clés</h4>
                    </div>
                  </div>
                  <ul className="session-summary-list">
                    {sessionState.sessionId && (
                      <li>
                        <span>ID session</span>
                        <strong>{sessionState.sessionId.slice(0, 8)}...</strong>
                      </li>
                    )}
                    <li>
                      <span>Blocs restants</span>
                      <strong>
                        {currentBlocks.length - activeBlockIndex - (isCurrentBlockComplete ? 0 : 1)}
                      </strong>
                    </li>
                    <li>
                      <span>Dernière sauvegarde</span>
                      <strong>
                        {sessionState.progress?.updatedAt
                          ? new Date(sessionState.progress.updatedAt).toLocaleString()
                          : '—'}
                      </strong>
                    </li>
                  </ul>
                </article>

                <article className="session-card session-analysis-card">
                  <div className="session-card-header">
                    <div>
                      <p className="label">Analyse IA</p>
                      <h4>{profile ? 'Profil généré' : 'En attente de finalisation'}</h4>
                    </div>
                    {profile && (
                      <a href="#orientation-profile" className="btn-sm-secondary">
                        Voir le détail
                      </a>
                    )}
                  </div>
                  {profile ? (
                    <div className="analysis-content">
                      <p>Total score&nbsp;: <strong>{profile?.summary?.totalScore}</strong></p>
                      <p>Métiers recommandés&nbsp;: <strong>{profile?.aiAnalysis?.recommendedCareers?.length || 0}</strong></p>
                      <p className="analysis-note">Analyse basée sur vos réponses complètes.</p>
                    </div>
                  ) : (
                    <div className="analysis-placeholder">
                      <p>Finalisez le questionnaire pour débloquer les insights personnalisés.</p>
                      <small>Vos réponses doivent être envoyées dans chaque bloc.</small>
                    </div>
                  )}
                </article>
              </div>

              <div className="session-body">
                <div className="session-block-row">
                  <div className="session-block-info">
                    <span>Blocs du parcours</span>
                    <small>{currentBlocks.length} thématiques</small>
                  </div>
                  <div className="block-tabs">
                    {currentBlocks.map((block, index) => (
                      <button
                        key={block.id}
                        className={`block-tab ${activeBlockIndex === index ? 'active' : ''}`}
                        onClick={() => setActiveBlockIndex(index)}
                      >
                        <small>Bloc {block.order}</small>
                        <strong>{block.title}</strong>
                      </button>
                    ))}
                  </div>
                </div>

                {activeBlock ? (
                  <>
                    <div className="session-questions">
                      <div className="block-content block-content-full">
                        <div className="block-header">
                          <div>
                            <p className="label">Bloc {activeBlock.order}</p>
                            <h3>{activeBlock.title}</h3>
                            <p>{activeBlock.description}</p>
                          </div>
                          <div className="block-meta">
                            <span>{activeBlock.questions?.length || 0} questions</span>
                          </div>
                        </div>
                        <div className="block-questions">
                          {activeBlock.questions?.map((question) => renderQuestion(question))}
                        </div>
                        {canGoNextBlock && (
                          <div className="block-navigation">
                            <button
                              type="button"
                              className="btn-orange"
                              onClick={() => setActiveBlockIndex((prev) => Math.min(prev + 1, currentBlocks.length - 1))}
                              disabled={!isCurrentBlockComplete}
                            >
                              Page suivante
                              <i className="ph-arrow-right"></i>
                            </button>
                            {!isCurrentBlockComplete && (
                              <small>Répondez à toutes les questions de ce bloc pour continuer.</small>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {(actionError || actionMessage) && (
                      <div className={`session-alert ${actionError ? 'error' : 'success'}`}>
                        <i className={actionError ? 'ph-warning-circle' : 'ph-check-circle'}></i>
                        <span>{actionError || actionMessage}</span>
                      </div>
                    )}

                    <div className="session-actions">
                      <button
                        className="btn-sm-outline"
                        onClick={() => handleSubmitResponses(false)}
                        disabled={saving || finalizing || isSubmitting}
                      >
                        {saving ? (
                          <>
                            <i className="ph-spinner-gap ph-spin"></i>
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <i className="ph-floppy-disk"></i>
                            Sauvegarder la progression
                          </>
                        )}
                      </button>
                      <div className="finalize-wrapper">
                        <button
                          className={`btn-orange ${!canFinalize ? 'btn-disabled' : ''}`}
                          onClick={() => handleSubmitResponses(true)}
                          disabled={!canFinalize || finalizing || saving || isSubmitting}
                        >
                          {finalizing ? (
                            <>
                              <i className="ph-spinner-gap ph-spin"></i>
                              Finalisation...
                            </>
                          ) : (
                            <>
                              <i className="ph-check-circle"></i>
                              Finaliser et générer mon profil
                            </>
                          )}
                        </button>
                        {!canFinalize && (
                          <small className="finalize-hint">
                            Complétez toutes les questions pour activer ce bouton.
                          </small>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="orientation-empty">
                    <p>Sélectionnez un bloc pour afficher les questions.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        )}

        {profile && !showQuestionnaire && (
          <div className="orientation-section orientation-profile-showcase" id="orientation-profile">
            <div className="section-header profile-main-header">
              <div>
                <h2>Mon profil d'orientation</h2>
                <p>Analyse générée par Allo École à partir de vos réponses.</p>
              </div>
              <button
                className="btn-sm-outline"
                onClick={() => {
                  setShowQuestionnaire(true);
                  setUserOpenedQuestionnaire(true);
                }}
              >
                <i className="ph-repeat"></i>
                Reprendre le questionnaire
              </button>
            </div>

            <div className="profile-hero">
              <div className="profile-hero-main">
                <span className="profile-pill">
                  <i className="ph-sparkle"></i>
                  Profil Allo École mis à jour
                </span>
                <h3>{profile.aiAnalysis?.profileSummary || 'Vos talents prennent forme'}</h3>
                <p>
                  {recommendedCareers.length
                    ? `Nous avons identifié ${recommendedCareers.length} métier${recommendedCareers.length > 1 ? 's' : ''} aligné${recommendedCareers.length > 1 ? 's' : ''} avec vos forces.`
                    : 'Complétez davantage de blocs pour obtenir des propositions personnalisées.'}
                </p>
                <div className="profile-hero-stats">
                  <div className="profile-stat-card">
                    <span>Score global</span>
                    <strong>{profile.summary?.totalScore ?? 0}</strong>
                    <small>{profile.summary?.completionRate ?? 0}% de complétion</small>
                  </div>
                  <div className="profile-stat-card">
                    <span>Métiers proposés</span>
                    <strong>{recommendedCareers.length}</strong>
                    <small>Basés sur votre potentiel</small>
                  </div>
                  <div className="profile-stat-card">
                    <span>Questions répondues</span>
                    <strong>{profile.summary?.answeredQuestions ?? 0}</strong>
                    <small>sur {profile.summary?.totalQuestions ?? 0}</small>
                  </div>
                </div>
              </div>

              {topCareer && (
                <div className="profile-hero-side">
                  <div className="profile-spotlight">
                    <div className="spotlight-header">
                      <span>Focus métier</span>
                      <span className="spotlight-score">{topCareer.successPercentage}% de réussite</span>
                    </div>
                    <h4>{topCareer.metier}</h4>
                    <p>{topCareer.description}</p>
                    <div className="spotlight-progress">
                      <span style={{ width: `${Math.min(topCareer.successPercentage, 100)}%` }}></span>
                    </div>
                    <ul>
                      {(topCareer.reasons || []).slice(0, 3).map((reason) => (
                        <li key={reason}>
                          <i className="ph-check-circle"></i>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-section">
              <div className="profile-section-title">
                <i className="ph-briefcase"></i>
                <div>
                  <h4>Métiers recommandés</h4>
                <span>Allo École met en avant les pistes qui vous correspondent le mieux.</span>
                </div>
              </div>
              {recommendedCareers.length ? (
                <div className="profile-careers-grid">
                  {recommendedCareers.map((career) => (
                    <article key={career.metier} className="career-card">
                      <div className="career-card-top">
                        <div>
                          <p className="career-label">Proposition</p>
                          <h5>{career.metier}</h5>
                        </div>
                        <span className="career-score">{career.successPercentage}%</span>
                      </div>
                      <p className="career-description">{career.description}</p>
                      <ul className="career-reasons">
                        {(career.reasons || []).map((reason) => (
                          <li key={reason}>
                            <i className="ph-star-four"></i>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="orientation-empty">
                  <i className="ph-briefcase"></i>
                  <p>Aucun métier n'a encore été suggéré. Finalisez un questionnaire pour lancer l’analyse.</p>
                </div>
              )}
            </div>

            <div className="profile-dual-grid">
              <div className="profile-card profile-list-card">
                <h4>
                  <i className="ph-thumbs-up"></i>
                  Points forts
                </h4>
                {strengths.length ? (
                  <ul className="profile-chip-list">
                    {strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                    <p className="profile-placeholder">Aucun point fort évalué pour le moment.</p>
                )}
              </div>
              <div className="profile-card profile-list-card">
                <h4>
                  <i className="ph-warning-circle"></i>
                  Axes d'amélioration
                </h4>
                {weaknesses.length ? (
                  <ul className="profile-chip-list profile-chip-list--warning">
                    {weaknesses.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                    <p className="profile-placeholder">Aucun axe identifié pour le moment.</p>
                )}
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">
                <i className="ph-graph"></i>
                <div>
                  <h4>Scores par bloc</h4>
                  <span>Comparatif de vos performances thématiques.</span>
                </div>
              </div>
              <div className="profile-block-scores">
                {profile.blockScores?.map((block) => (
                  <div key={block.blockId} className="block-score-card">
                    <div className="block-score-header">
                      <h5>{block.title}</h5>
                      <span>{block.score} / {block.maxScore}</span>
                    </div>
                    <div className="score-bar score-bar-accent">
                      <span style={{ width: `${Math.min(100, (block.score / (block.maxScore || 1)) * 100)}%` }}></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {generalRecommendations.length > 0 && (
              <div className="profile-section">
                <div className="profile-section-title">
                  <i className="ph-note"></i>
                  <div>
                    <h4>Recommandations d’Allo École</h4>
                    <span>Idées pour aller plus loin.</span>
                  </div>
                </div>
                <ul className="profile-recommendations">
                  {generalRecommendations.map((item) => (
                    <li key={item}>
                      <i className="ph-arrow-right"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrientationInteractive;