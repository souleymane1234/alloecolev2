import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowBack, 
  Timer, 
  CheckCircle,
  Cancel,
  EmojiEvents
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

  // Questions d'exemple (à remplacer par des données de l'API)
  const questions = [
    {
      id: 1,
      question: "Quelle est la capitale de la France ?",
      options: ["Paris", "Londres", "Berlin", "Madrid"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Combien font 2 + 2 ?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Quelle est la couleur du ciel ?",
      options: ["Rouge", "Vert", "Bleu", "Jaune"],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "Quel est le plus grand océan du monde ?",
      options: ["Atlantique", "Indien", "Arctique", "Pacifique"],
      correctAnswer: 3
    },
    {
      id: 5,
      question: "En quelle année l'homme a-t-il marché sur la Lune ?",
      options: ["1969", "1971", "1965", "1973"],
      correctAnswer: 0
    }
  ];

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

