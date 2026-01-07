import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  ArrowBack, 
  Timer, 
  CheckCircle,
  Cancel,
  EmojiEvents,
  PlayArrow,
  Pause,
  VolumeUp,
  Image as ImageIcon,
  Videocam,
  Fullscreen,
  ZoomIn,
  ErrorOutline,
  Star,
  TrendingUp,
  LocalFireDepartment,
  WorkspacePremium
} from '@mui/icons-material';
import { Alert, CircularProgress } from '@mui/material';
import quizService from '../services/quizService';
import './QuizPlay.css';

const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quizDataFromState = location.state?.quizData;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Pour les QCM multiples
  const [textAnswers, setTextAnswers] = useState({}); // Pour les questions SAISIE
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Récupérer le quiz avec ses questions depuis l'API (avec les réponses pour afficher les propositions)
  const { data: quizData, isLoading: isLoadingQuiz, error: quizError } = useQuery({
    queryKey: ['quizWithQuestions', id],
    queryFn: () => quizService.getQuizWithQuestions(id, true), // includeAnswers = true pour afficher les propositions
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation pour soumettre le quiz
  const submitMutation = useMutation({
    mutationFn: (submissionData) => quizService.submitQuiz(id, submissionData),
    onSuccess: (data) => {
      setSubmissionResult(data);
      setShowResult(true);
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la soumission:', error);
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      
      const errorMessage = error.message || 'Erreur lors de la soumission du quiz';
      
      // Si l'erreur indique que la session a expiré, afficher un message mais ne pas rediriger automatiquement
      if (errorMessage.includes('session') || 
          errorMessage.includes('connecté') || 
          errorMessage.includes('expiré') || 
          errorMessage.includes('Token') ||
          errorMessage.includes('refresh')) {
        // Afficher un message d'erreur mais laisser l'utilisateur sur la page
        alert(`Erreur d'authentification: ${errorMessage}\n\nVous pouvez continuer à naviguer sur le site. Si vous souhaitez soumettre un quiz, veuillez vous reconnecter.`);
      } else {
        alert(`Erreur: ${errorMessage}`);
      }
    },
  });

  // Utiliser les données de l'API ou du state
  const quizDataToUse = quizData || quizDataFromState;

  // Transformer les questions depuis l'API
  const questions = useMemo(() => {
    if (quizDataToUse?.questions && Array.isArray(quizDataToUse.questions)) {
      return quizDataToUse.questions
        .sort((a, b) => (a.order || 0) - (b.order || 0)) // Trier les questions par ordre
        .map((q) => {
          // Déterminer le type de média basé sur contentType
          let mediaType = 'text';
          if (q.contentType === 'IMAGE') mediaType = 'image';
          else if (q.contentType === 'VIDEO') mediaType = 'video';
          else if (q.contentType === 'AUDIO') mediaType = 'audio';

          // Déterminer si c'est une question multiple
          const isMultiple = q.type === 'QCM';
          const isTextInput = q.type === 'SAISIE';

          // Transformer les réponses (answers) en options - trier par order
          const answers = (q.answers || []).sort((a, b) => (a.order || 0) - (b.order || 0));
          const options = answers.map((answer) => ({
            id: answer.id,
            text: answer.label || answer.text || '',
            isCorrect: answer.isCorrect || false,
            order: answer.order || 0,
          }));

          // Pour les questions SAISIE, stocker toutes les réponses correctes possibles
          const correctTextAnswers = isTextInput 
            ? options.filter(opt => opt.isCorrect).map(opt => opt.text.toLowerCase().trim())
            : [];

          return {
            id: q.id,
            questionId: q.id,
            question: q.question || q.title || '',
            type: mediaType, // 'text', 'image', 'video', 'audio'
            media: q.contentUrl ? {
              url: q.contentUrl,
              thumbnail: q.contentUrl, // Utiliser la même URL comme thumbnail par défaut
            } : null,
            options: options.map(opt => opt.text),
            optionData: options, // Garder les données complètes des options avec IDs
            correctAnswer: isMultiple || isTextInput ? null : options.findIndex(opt => opt.isCorrect),
            correctAnswers: isMultiple ? options.filter(opt => opt.isCorrect).map(opt => opt.id) : [],
            correctTextAnswers: correctTextAnswers, // Pour validation des réponses SAISIE
            isMultiple: isMultiple,
            isTextInput: isTextInput,
            points: q.points || 10,
            order: q.order || 0,
          };
        });
    }
    // Fallback: données mockées si l'API ne retourne pas de questions
    return [
    {
      id: 1,
      question: "Quelle est la capitale de la France ?",
      type: 'video', // 'text', 'image', 'video', 'audio'
      media: {
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
      },
      options: ["Paris", "Londres", "Berlin", "Madrid"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Quel est le symbole chimique de l'eau ?",
      type: 'image',
      media: {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
        alt: 'Symbole chimique'
      },
      options: ["H2O", "CO2", "O2", "NaCl"],
      correctAnswer: 0
    },
    {
      id: 3,
      question: "En quelle année a eu lieu la Révolution française ?",
      type: 'audio',
      media: {
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 100
      },
      options: ["1789", "1799", "1779", "1809"],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "Quel est le plus grand océan du monde ?",
      type: 'text',
      options: ["Atlantique", "Indien", "Arctique", "Pacifique"],
      correctAnswer: 3
    },
    {
      id: 5,
      question: "Combien font 2 + 2 ?",
      type: 'text',
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    }
    ];
  }, [quizDataToUse]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Timer
  useEffect(() => {
    if (showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto next question when time runs out
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.pause();
            if (videoRef.current) videoRef.current.pause();
            return 30;
          } else {
            setShowResult(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showResult, questions.length]);

  // Reset media when question changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioProgress(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [currentQuestion]);

  const handlePlayPause = () => {
    const question = questions[currentQuestion];
    if (question.type === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (question.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioTimeUpdate = (e) => {
    const audio = e.target;
    const progress = (audio.currentTime / audio.duration) * 100;
    setAudioProgress(progress);
    setCurrentTime(audio.currentTime);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (audio) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      audio.currentTime = percent * audio.duration;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMedia = () => {
    const question = questions[currentQuestion];
    if (!question.type || question.type === 'text') return null;

    if (question.type === 'image' && question.media) {
      return (
        <div className="quiz-media-container image-container">
          <img 
            src={question.media.url} 
            alt={question.media.alt || question.question}
            className="quiz-image"
          />
          <div className="media-badge image-badge">
            <ImageIcon />
            <span>Image</span>
          </div>
          <button className="media-zoom-btn">
            <ZoomIn />
          </button>
        </div>
      );
    }

    if (question.type === 'video' && question.media) {
      return (
        <div className="quiz-media-container video-container">
          <video
            ref={videoRef}
            src={question.media.url}
            poster={question.media.thumbnail}
            className="quiz-video"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div className="media-badge video-badge">
            <Videocam />
            <span>Vidéo</span>
          </div>
          <button className="media-fullscreen-btn" onClick={() => {
            if (videoRef.current) {
              if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
              }
            }
          }}>
            <Fullscreen />
          </button>
          {!isPlaying && (
            <button className="media-play-btn" onClick={handlePlayPause}>
              <PlayArrow />
            </button>
          )}
        </div>
      );
    }

    if (question.type === 'audio' && question.media) {
      return (
        <div className="quiz-media-container audio-container">
          <div className="audio-player">
            <button className="audio-play-btn" onClick={handlePlayPause}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </button>
            <div className="audio-controls">
              <div className="audio-progress-bar" onClick={handleSeek}>
                <div 
                  className="audio-progress-fill" 
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <div className="audio-time">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(question.media.duration || 0)}</span>
              </div>
            </div>
          </div>
          <div className="media-badge audio-badge">
            <VolumeUp />
            <span>Audio</span>
          </div>
          <audio
            ref={audioRef}
            src={question.media.url}
            onTimeUpdate={handleAudioTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={(e) => {
              if (question.media.duration) {
                e.target.duration = question.media.duration;
              }
            }}
          />
        </div>
      );
    }

    return null;
  };

  const handleAnswerSelect = (index) => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return;

    // Pour les QCM multiples
    if (currentQ.isMultiple) {
      const currentSelected = selectedAnswers[currentQ.id] || [];
      const newSelected = currentSelected.includes(index)
        ? currentSelected.filter(i => i !== index)
        : [...currentSelected, index];
      
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQ.id]: newSelected,
      });
      return; // Ne pas passer à la question suivante automatiquement pour les QCM
    }

    // Pour les QCU (une seule réponse)
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    
    const isCorrect = index === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionId: currentQ.questionId || currentQ.id,
        question: currentQ.question,
        selected: index,
        correct: currentQ.correctAnswer,
        isCorrect
      }
    ]);

    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return;

    // Enregistrer la réponse pour les questions SAISIE
    if (currentQ.isTextInput) {
      const textAnswer = textAnswers[currentQ.id];
      if (textAnswer?.trim()) {
        setAnsweredQuestions([
          ...answeredQuestions,
          {
            questionId: currentQ.questionId || currentQ.id,
            question: currentQ.question,
            textAnswer: textAnswer.trim(),
            isTextInput: true,
          }
        ]);
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      // Soumettre le quiz quand toutes les questions sont répondues
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    // Préparer les réponses au format API
    const answers = questions.map((q) => {
      const questionId = q.questionId || q.id;
      const answerData = {
        questionId: questionId,
      };

      if (q.isTextInput) {
        // SAISIE: réponse texte libre - seulement textAnswer
        const textAnswer = textAnswers[q.id] || '';
        if (textAnswer.trim()) {
          answerData.textAnswer = textAnswer.trim();
          return answerData; // Retourner uniquement avec textAnswer
        }
        return null; // Pas de réponse texte
      } else if (q.isMultiple) {
        // QCM: plusieurs réponses - seulement answerIds
        const selected = selectedAnswers[q.id] || [];
        if (selected.length > 0 && q.optionData) {
          const answerIds = selected.map(idx => {
            // Utiliser l'ID de l'option depuis optionData
            return q.optionData[idx]?.id;
          }).filter(id => id); // Filtrer les IDs null/undefined
          
          if (answerIds.length > 0) {
            answerData.answerIds = answerIds;
            return answerData; // Retourner uniquement avec answerIds
          }
        }
        return null; // Pas de réponses sélectionnées
      } else {
        // QCU: une seule réponse - seulement answerId
        const selectedIdx = answeredQuestions.find(aq => aq.questionId === questionId)?.selected;
        if (selectedIdx !== undefined && selectedIdx !== null && q.optionData) {
          const selectedOption = q.optionData[selectedIdx];
          if (selectedOption?.id) {
            answerData.answerId = selectedOption.id;
            return answerData; // Retourner uniquement avec answerId
          }
        }
        return null; // Pas de réponse sélectionnée
      }
    }).filter(a => a !== null); // Filtrer les null

    // Vérifier qu'on a au moins une réponse
    if (answers.length === 0) {
      alert('Veuillez répondre à au moins une question avant de soumettre.');
      return;
    }

    console.log('📤 Soumission du quiz avec les réponses:', { 
      quizId: id, 
      answers,
      answersCount: answers.length,
      answersDetails: answers.map(a => ({
        questionId: a.questionId,
        hasAnswerId: !!a.answerId,
        hasAnswerIds: !!(a.answerIds && a.answerIds.length > 0),
        hasTextAnswer: !!a.textAnswer,
      }))
    });

    // Soumettre via l'API (format attendu: { quizId, answers })
    submitMutation.mutate({
      quizId: id,
      answers,
    });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setAnsweredQuestions([]);
  };

  const handleBackToQuiz = () => {
    navigate('/quiz');
  };

  const getAnswerClass = (index) => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return '';

    if (currentQ.isMultiple) {
      const selected = selectedAnswers[currentQ.id] || [];
      if (selected.includes(index)) {
        // Vérifier si c'est une bonne réponse (pour l'affichage après soumission)
        const correctAnswers = currentQ.correctAnswers || [];
        return correctAnswers.includes(index) ? 'correct' : 'incorrect';
      }
      return '';
    }

    if (selectedAnswer === null) return '';
    if (index === currentQ.correctAnswer) return 'correct';
    if (index === selectedAnswer) return 'incorrect';
    return 'disabled';
  };

  if (isLoadingQuiz) {
    return (
      <div className="quiz-play-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (quizError || !quizDataToUse) {
    return (
      <div className="quiz-play-page">
        <div className="quiz-error">
          <Alert severity="error" />
          <h2>Quiz non trouvé</h2>
          <p>{quizError?.message || 'Le quiz demandé n\'existe pas ou n\'est plus disponible.'}</p>
          <button onClick={handleBackToQuiz} className="back-button">
            Retour aux quiz
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-play-page">
        <div className="quiz-error">
          <h2>Aucune question disponible</h2>
          <p>Ce quiz ne contient pas de questions pour le moment.</p>
          <button onClick={handleBackToQuiz} className="back-button">
            Retour aux quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const resultData = submissionResult || {
      score: score,
      totalPoints: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      pointsEarned: 0,
      newTotalPoints: 0,
      newRank: null,
      rewardsUnlocked: [],
    };
    
    const percentage = resultData.percentage || Math.round((score / questions.length) * 100);
    const passed = percentage >= 50;

    return (
      <div className="quiz-play-page">
        <div className="quiz-result">
          <div className="result-header">
            <div className="trophy-container">
              <EmojiEvents className={`result-trophy ${passed ? 'passed' : 'failed'}`} />
              {passed && <div className="trophy-glow"></div>}
            </div>
            <h2 className="result-title">{passed ? 'Félicitations !' : 'Presque !'}</h2>
            <p className="result-message">
              {passed 
                ? 'Vous avez réussi ce quiz !' 
                : 'Continuez à vous entraîner !'}
            </p>
          </div>

          <div className="result-stats">
            <div className="stat-card stat-card-1">
              <div className="stat-icon-wrapper">
                <CheckCircle className="stat-icon" />
              </div>
              <span className="stat-value">{resultData.score || score}/{resultData.totalPoints || questions.length}</span>
              <span className="stat-label">Bonnes réponses</span>
            </div>
            <div className="stat-card stat-card-2">
              <div className="stat-icon-wrapper">
                <Star className="stat-icon" />
              </div>
              <span className="stat-value">{percentage}%</span>
              <span className="stat-label">Score</span>
            </div>
            {resultData.pointsEarned > 0 && (
              <div className="stat-card stat-card-3">
                <div className="stat-icon-wrapper">
                  <LocalFireDepartment className="stat-icon" />
                </div>
                <span className="stat-value">+{resultData.pointsEarned}</span>
                <span className="stat-label">Points gagnés</span>
              </div>
            )}
            {resultData.newRank && (
              <div className="stat-card stat-card-4">
                <div className="stat-icon-wrapper">
                  <TrendingUp className="stat-icon" />
                </div>
                <span className="stat-value">#{resultData.newRank}</span>
                <span className="stat-label">Nouveau rang</span>
              </div>
            )}
          </div>

          {resultData.rewardsUnlocked && resultData.rewardsUnlocked.length > 0 && (
            <div className="rewards-unlocked">
              <div className="rewards-header">
                <WorkspacePremium className="rewards-icon" />
                <h3>Récompenses débloquées !</h3>
              </div>
              <div className="rewards-list">
                {resultData.rewardsUnlocked.map((userReward, idx) => (
                  <div key={idx} className="reward-item">
                    {userReward.reward?.iconUrl ? (
                      <img src={userReward.reward.iconUrl} alt={userReward.reward.title} className="reward-image" />
                    ) : (
                      <div className="reward-icon-placeholder">
                        <EmojiEvents />
                      </div>
                    )}
                    <div className="reward-content">
                      <strong className="reward-title">{userReward.reward?.title}</strong>
                      <p className="reward-description">{userReward.reward?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="result-actions">
            <button onClick={handleRestart} className="restart-button">
              <PlayArrow className="button-icon" />
              Recommencer
            </button>
            <button onClick={handleBackToQuiz} className="back-button">
              <ArrowBack className="button-icon" />
              Retour aux quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-play-page">
      <div className="quiz-play-container">
        {/* Header */}
        <div className="quiz-play-header">
          <button onClick={handleBackToQuiz} className="back-icon-button">
            <ArrowBack />
          </button>
          <h2 className="quiz-play-title">{quizDataToUse.title || 'Quiz'}</h2>
          <div className="quiz-timer">
            <Timer />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Progress */}
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            Question {currentQuestion + 1}/{questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="quiz-question-container">
          {renderMedia()}
          <h3 className="quiz-question">{questions[currentQuestion]?.question}</h3>

          {questions[currentQuestion]?.isTextInput ? (
            // Question de type SAISIE (réponse libre)
            <div className="quiz-text-input-container">
              <textarea
                className="quiz-text-input"
                placeholder="Tapez votre réponse ici..."
                value={textAnswers[questions[currentQuestion].id] || ''}
                onChange={(e) => {
                  setTextAnswers({
                    ...textAnswers,
                    [questions[currentQuestion].id]: e.target.value,
                  });
                }}
                rows={4}
              />
              <button 
              className="submit-text-btn"
              onClick={handleNextQuestion}
              disabled={!textAnswers[questions[currentQuestion].id]?.trim()}
            >
              Valider et continuer
            </button>
            </div>
          ) : (
            // Questions à choix multiples ou uniques
            <>
              <div className="quiz-options">
                {questions[currentQuestion]?.options.map((option, index) => {
                  const currentQ = questions[currentQuestion];
                  const isSelected = currentQ.isMultiple 
                    ? (selectedAnswers[currentQ.id] || []).includes(index)
                    : selectedAnswer === index;
                  
                  return (
                    <button
                      key={index}
                      className={`quiz-option ${getAnswerClass(index)} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={!currentQ.isMultiple && selectedAnswer !== null}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="option-text">{typeof option === 'string' ? option : (option.text || option.label || option)}</span>
                      {!currentQ.isMultiple && selectedAnswer !== null && index === currentQ.correctAnswer && (
                        <CheckCircle className="option-icon correct-icon" />
                      )}
                      {!currentQ.isMultiple && selectedAnswer === index && index !== currentQ.correctAnswer && (
                        <Cancel className="option-icon incorrect-icon" />
                      )}
                      {currentQ.isMultiple && isSelected && (
                        <CheckCircle className="option-icon" />
                      )}
                    </button>
                  );
                })}
              </div>
              {questions[currentQuestion]?.isMultiple && (
                <button 
                  className="submit-multiple-btn"
                  onClick={handleNextQuestion}
                  disabled={(selectedAnswers[questions[currentQuestion].id] || []).length === 0}
                >
                  Valider et continuer
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlay;

