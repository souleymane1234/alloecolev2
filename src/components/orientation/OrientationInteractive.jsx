import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import tokenManager from '../../helper/tokenManager';
import './OrientationInteractive.css';

const API_BASE = 'https://alloecoleapi-dev.up.railway.app/api/v1';

const OrientationInteractive = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(tokenManager.isAuthenticated());
  const [questionnaires, setQuestionnaires] = useState([]);
  const [questionnairesLoading, setQuestionnairesLoading] = useState(false);
  const [questionnairesError, setQuestionnairesError] = useState('');

  const [sessionLoading, setSessionLoading] = useState(null);
  const [sessionState, setSessionState] = useState(null);
  const [answers, setAnswers] = useState({});

  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);

  const profile = sessionState?.profile || null;
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
      const list = json?.data?.data || json?.data || [];
      setQuestionnaires(list);
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

  useEffect(() => {
    fetchQuestionnaires();
  }, [fetchQuestionnaires]);

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
    
    setSessionLoading(questionnaireId);
    setActionError('');
    setActionMessage('');
    try {
      const json = await apiCall('/students/orientation/start-session', {
        method: 'POST',
        body: JSON.stringify({ questionnaireId, resumeLast }),
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
      setSessionState((prev) => ({
        ...prev,
        progress: data.progress || prev?.progress,
        profile: data.profile || prev?.profile || null,
      }));
      if (data.profileGenerated || data.profile) {
        setActionMessage('Profil généré avec succès !');
      } else {
        setActionMessage(finalize ? 'Questionnaire finalisé.' : 'Progression sauvegardée.');
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
    setSessionState(null);
    setAnswers({});
    setActionError('');
    setActionMessage('');
    setActiveBlockIndex(0);
    setIsSubmitting(false);
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

  if (!isAuthenticated) {
    return (
      <section className="orientation-module">
        {heroSection}
        <div className="orientation-content container">
          <div className="orientation-section auth-required">
            <i className="ph-lock key-icon"></i>
            <h2>Connexion requise</h2>
            <p>
              Vous devez être connecté pour accéder au questionnaire interactif
              d’orientation et sauvegarder vos réponses.
            </p>
            <a className="btn-orange" href="/login">
              Me connecter
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="orientation-module">
      {heroSection}

      <div className="orientation-content container">
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
            <div className="session-layout">
              <div className="session-main">
                <div className="session-progress">
                  <div>
                    <p className="label">Session</p>
                    <h4>{sessionState.questionnaire.title}</h4>
                    {sessionState.resumed && (
                      <span className="resume-badge">Session reprise automatiquement</span>
                    )}
                  </div>
                  <div className="progress-info">
                    <div className="progress-bar">
                      <span
                        style={{
                          width: `${sessionState?.progress?.completionRate || 0}%`,
                        }}
                      ></span>
                    </div>
                    <p>
                      {sessionState?.progress?.answeredQuestions || 0}/
                      {sessionState?.progress?.totalQuestions || 0} questions répondues
                    </p>
                  </div>
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

                {activeBlock ? (
                  <div className="block-content">
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
                ) : (
                  <div className="orientation-empty">
                    <p>Sélectionnez un bloc pour afficher les questions.</p>
                  </div>
                )}

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
                  <button
                    className="btn-orange"
                    onClick={() => handleSubmitResponses(true)}
                    disabled={finalizing || saving || isSubmitting}
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
                </div>
              </div>

              <aside className="session-side">
                <div className="side-card">
                  <h4>Résumé</h4>
                  <ul>
                    {sessionState.sessionId && (
                      <li>
                        <span>Session ID</span>
                        <strong>{sessionState.sessionId.slice(0, 8)}...</strong>
                      </li>
                    )}
                    <li>
                      <span>Questions répondues</span>
                      <strong>
                        {sessionState?.progress?.answeredQuestions || answeredCount} /
                        {sessionState?.progress?.totalQuestions || currentBlocks.reduce(
                          (total, block) => total + (block.questions?.length || 0),
                          0
                        )}
                      </strong>
                    </li>
                    <li>
                      <span>Complétion</span>
                      <strong>{sessionState?.progress?.completionRate || 0}%</strong>
                    </li>
                  </ul>
                </div>

                {profile ? (
                  <div className="side-card">
                    <h4>Profil généré</h4>
                    <p>Total score: {profile?.summary?.totalScore}</p>
                    <p>Métiers recommandés: {profile?.aiAnalysis?.recommendedCareers?.length || 0}</p>
                    <a href="#orientation-profile" className="btn-sm-secondary">
                      Voir les détails
                    </a>
                  </div>
                ) : (
                  <div className="side-card muted">
                    <h4>Analyse IA</h4>
                    <p>
                      Finalisez le questionnaire pour générer votre profil avec les métiers
                      recommandés.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>

        {profile && (
          <div className="orientation-section" id="orientation-profile">
            <div className="section-header">
              <div>
                <h2>Analyse personnalisée</h2>
                <p>Basée sur vos réponses et générée automatiquement.</p>
              </div>
            </div>
            <div className="profile-grid">
              <div className="profile-card">
                <h4>Résumé</h4>
                <ul>
                  <li>
                    <span>Score total</span>
                    <strong>{profile.summary?.totalScore}</strong>
                  </li>
                  <li>
                    <span>Questions complétées</span>
                    <strong>{profile.summary?.answeredQuestions}</strong>
                  </li>
                </ul>
              </div>
              <div className="profile-card">
                <h4>Points forts</h4>
                <ul>
                  {profile.aiAnalysis?.strengths?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="profile-card">
                <h4>Axes d'amélioration</h4>
                <ul>
                  {profile.aiAnalysis?.weaknesses?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="profile-block-scores">
              {profile.blockScores?.map((block) => (
                <div key={block.blockId} className="block-score-card">
                  <h5>{block.title}</h5>
                  <div className="score-bar">
                    <span style={{ width: `${Math.min(100, (block.score / (block.maxScore || 1)) * 100)}%` }}></span>
                  </div>
                  <p>
                    {block.score} / {block.maxScore}
                  </p>
                </div>
              ))}
            </div>

            <div className="recommended-careers">
              <h3>Métiers recommandés</h3>
              <div className="careers-grid">
                {profile.aiAnalysis?.recommendedCareers?.map((career) => (
                  <div key={career.metier} className="career-card">
                    <div className="career-header">
                      <h4>{career.metier}</h4>
                      <span>{career.successPercentage}%</span>
                    </div>
                    <p>{career.description}</p>
                    <ul>
                      {career.reasons?.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {profile.aiAnalysis?.generalRecommendations?.length > 0 && (
              <div className="profile-card">
                <h4>Recommandations générales</h4>
                <ul>
                  {profile.aiAnalysis.generalRecommendations.map((item) => (
                    <li key={item}>{item}</li>
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