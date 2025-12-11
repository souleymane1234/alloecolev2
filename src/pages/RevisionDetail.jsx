import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { revisionExercises, getRevisionExerciseById } from '../data/revisionData';
import './Revision.css';

const RevisionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const exerciseFromState = location.state?.exercise;
  const exercise = exerciseFromState || getRevisionExerciseById(id);
  const [hasAccess, setHasAccess] = useState(exercise?.isFree ?? false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  if (!exercise) {
    return (
      <div className="revision-page">
        <div className="revision-container">
          <p>Exercice introuvable.</p>
          <button className="btn-secondary" onClick={() => navigate('/revision')}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (question, optionId) => {
    if (submitted) return;
    if (question.type === 'qcu') {
      setAnswers((prev) => ({ ...prev, [question.id]: [optionId] }));
    } else {
      setAnswers((prev) => {
        const current = new Set(prev[question.id] || []);
        if (current.has(optionId)) {
          current.delete(optionId);
        } else {
          current.add(optionId);
        }
        return { ...prev, [question.id]: Array.from(current) };
      });
    }
  };

  const handleInput = (question, value) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const evaluation = useMemo(() => {
    if (!submitted) return null;
    const total = exercise.questions.length;
    let good = 0;
    const details = exercise.questions.map((q) => {
      let isCorrect = false;
      if (q.type === 'input') {
        const givenVal = (answers[q.id] || '').toString().trim().toLowerCase();
        const correctVals = (q.correct || []).map((c) => c.toString().trim().toLowerCase());
        isCorrect = correctVals.includes(givenVal);
      } else {
        const correctSet = new Set(q.correct);
        const given = new Set(answers[q.id] || []);
        isCorrect =
          correctSet.size === given.size &&
          [...correctSet].every((x) => given.has(x));
      }
      if (isCorrect) good += 1;
      return { id: q.id, isCorrect };
    });
    return { total, good, details };
  }, [submitted, exercise.questions, answers]);

  const handleSubmit = () => {
    if (!hasAccess) return;
    setSubmitted(true);
    if (!exercise.questions?.length) return;
    const total = exercise.questions.length;
    let good = 0;
    exercise.questions.forEach((q) => {
      let isCorrect = false;
      if (q.type === 'input') {
        const givenVal = (answers[q.id] || '').toString().trim().toLowerCase();
        const correctVals = (q.correct || []).map((c) => c.toString().trim().toLowerCase());
        isCorrect = correctVals.includes(givenVal);
      } else {
        const correctSet = new Set(q.correct);
        const given = new Set(answers[q.id] || []);
        isCorrect =
          correctSet.size === given.size &&
          [...correctSet].every((x) => given.has(x));
      }
      if (isCorrect) good += 1;
    });
    setScore({ total, good });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="revision-page">
      <div className="revision-container">
        <div className="detail-header">
          <div>
            <h1 className="revision-title">{exercise.title}</h1>
            <p className="revision-subtitle">{exercise.description}</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
              <span className={`cert-badge ${exercise.certified ? 'ok' : 'no'}`}>
                {exercise.certified ? 'Certifié' : 'Non certifié'}
              </span>
              <span className="price-chip">{exercise.price}</span>
            </div>
            <p className="exercise-teacher detail-teacher-line">
              Professeur : <strong>{exercise.teacher.name}</strong>
            </p>
          </div>
        </div>

        <div className="revision-detail">
          <div className="detail-teacher">
            <span>{exercise.teacher.name}</span>
            <span className={`cert-badge ${exercise.teacher.certified ? 'ok' : 'no'}`}>
              {exercise.teacher.certified ? 'Certifié' : 'Non certifié'}
            </span>
          </div>

          {!hasAccess && (
            <div className="paywall">
              <div className="paywall-info">
                <p className="paywall-title">Paiement requis</p>
                <p className="paywall-text">
                  Cet exercice est payant. Réglez le montant pour accéder au QCM/QCU interactif.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="price-chip">{exercise.price}</span>
                <button className="btn-primary" onClick={() => setHasAccess(true)}>
                  Payer et commencer
                </button>
              </div>
            </div>
          )}

          {hasAccess && (
            <div className="question-list">
              {exercise.questions?.map((q) => {
                const selected = new Set(answers[q.id] || []);
                const evalForQ = evaluation?.details.find((d) => d.id === q.id);
                return (
                  <div key={q.id} className="question-card">
                    <div className="question-head">
                      <div className="question-type">
                        {q.type === 'qcm' ? 'QCM' : q.type === 'qcu' ? 'QCU' : 'Réponse libre'}
                      </div>
                      {submitted && (
                        <div className={`question-result ${evalForQ?.isCorrect ? 'ok' : 'ko'}`}>
                          {evalForQ?.isCorrect ? 'Bonne réponse' : 'À revoir'}
                        </div>
                      )}
                    </div>
                    <p className="question-title">{q.question}</p>
                    {q.type === 'input' ? (
                      <input
                        type="text"
                        className="input-answer"
                        placeholder={q.placeholder || 'Votre réponse'}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleInput(q, e.target.value)}
                        disabled={submitted}
                      />
                    ) : (
                      <div className="options">
                        {q.options?.map((opt) => {
                          const isSelected = selected.has(opt.id);
                          const isCorrect = submitted && q.correct.includes(opt.id);
                          const showState = submitted
                            ? isCorrect
                              ? 'correct'
                              : isSelected
                              ? 'wrong'
                              : ''
                            : isSelected
                            ? 'selected'
                            : '';
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              className={`option ${showState}`}
                              onClick={() => handleSelect(q, opt.id)}
                              disabled={submitted}
                            >
                              <span className="option-check">
                                {q.type === 'qcm' ? '□' : '○'}
                              </span>
                              <span>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="detail-actions">
            <button className="btn-secondary" onClick={() => navigate('/revision')}>
              Retour à la liste
            </button>
            <div style={{ flex: 1 }} />
            <button className="btn-secondary" onClick={handleReset}>
              Recommencer
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={(submitted && !!score) || !hasAccess}
            >
              {!hasAccess ? 'Payer pour commencer' : submitted ? 'Corrigé envoyé' : 'Envoyer mes réponses'}
            </button>
          </div>
          {score && (
            <div className="score-banner">
              Score : {score.good} / {score.total}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionDetail;

