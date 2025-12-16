import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  ZoomIn
} from '@mui/icons-material';
import './QuizPlay.css';

const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quizData = location.state?.quizData;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // Questions d'exemple avec support médias (à remplacer par des données de l'API)
  const questions = [
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
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([
      ...answeredQuestions,
      {
        question: questions[currentQuestion].question,
        selected: index,
        correct: questions[currentQuestion].correctAnswer,
        isCorrect
      }
    ]);

    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
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
    if (selectedAnswer === null) return '';
    if (index === questions[currentQuestion].correctAnswer) return 'correct';
    if (index === selectedAnswer) return 'incorrect';
    return 'disabled';
  };

  if (!quizData) {
    return (
      <div className="quiz-play-page">
        <div className="quiz-error">
          <h2>Quiz non trouvé</h2>
          <button onClick={handleBackToQuiz} className="back-button">
            Retour aux quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 50;

    return (
      <div className="quiz-play-page">
        <div className="quiz-result">
          <div className="result-header">
            <EmojiEvents className={`result-trophy ${passed ? 'passed' : 'failed'}`} />
            <h2>{passed ? 'Félicitations !' : 'Presque !'}</h2>
            <p className="result-message">
              {passed 
                ? 'Vous avez réussi ce quiz !' 
                : 'Continuez à vous entraîner !'}
            </p>
          </div>

          <div className="result-stats">
            <div className="stat-card">
              <span className="stat-value">{score}/{questions.length}</span>
              <span className="stat-label">Bonnes réponses</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{percentage}%</span>
              <span className="stat-label">Score</span>
            </div>
          </div>

          <div className="result-actions">
            <button onClick={handleRestart} className="restart-button">
              Recommencer
            </button>
            <button onClick={handleBackToQuiz} className="back-button">
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
          <h2 className="quiz-play-title">{quizData.title}</h2>
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
          <h3 className="quiz-question">{questions[currentQuestion].question}</h3>

          <div className="quiz-options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`quiz-option ${getAnswerClass(index)}`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {selectedAnswer !== null && index === questions[currentQuestion].correctAnswer && (
                  <CheckCircle className="option-icon correct-icon" />
                )}
                {selectedAnswer === index && index !== questions[currentQuestion].correctAnswer && (
                  <Cancel className="option-icon incorrect-icon" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPlay;

