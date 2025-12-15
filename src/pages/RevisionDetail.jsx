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
  const [submittedSubjects, setSubmittedSubjects] = useState(new Set());
  const [subjectScores, setSubjectScores] = useState({});
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

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

  const subjects = useMemo(() => {
    if (!exercise.questions?.length) return ['Exercice'];
    const seen = new Set();
    const order = [];
    exercise.questions.forEach((q) => {
      const s = q.subject || 'Exercice';
      if (!seen.has(s)) {
        seen.add(s);
        order.push(s);
      }
    });
    return order.length ? order : ['Exercice'];
  }, [exercise.questions]);

  const currentSubject = subjects[currentSubjectIndex] || subjects[0];
  const isLastSubject = currentSubjectIndex === subjects.length - 1;

  const subjectQuestions = useMemo(() => {
    const label = currentSubject || 'Exercice';
    return exercise.questions?.filter((q) => (q.subject || 'Exercice') === label) || [];
  }, [exercise.questions, currentSubject]);

  const handleSelect = (question, optionId) => {
    if (submittedSubjects.has(currentSubject)) return;
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
    if (submittedSubjects.has(currentSubject)) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const evaluateQuestions = (questions) => {
    const total = questions.length;
    let good = 0;
    const details = questions.map((q) => {
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
  };

  const evaluation = useMemo(() => {
    // For rendering per question, rely on subjectScores to know if subject validated
    const map = {};
    Object.entries(subjectScores).forEach(([subj, val]) => {
      val.details.forEach((d) => {
        map[d.id] = d.isCorrect;
      });
    });
    return map;
  }, [subjectScores]);

  const handleValidateSubject = () => {
    if (!hasAccess) return;
    const result = evaluateQuestions(subjectQuestions);
    setSubjectScores((prev) => ({ ...prev, [currentSubject]: result }));
    setSubmittedSubjects((prev) => new Set([...prev, currentSubject]));
    if (!isLastSubject) {
      setCurrentSubjectIndex((idx) => idx + 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmittedSubjects(new Set());
    setSubjectScores({});
    setCurrentSubjectIndex(0);
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
              {exercise.category === 'examen' && (
                <>
                  {exercise.level && <span className="exam-pill">{exercise.level}</span>}
                  {exercise.series && <span className="exam-pill light">Série {exercise.series}</span>}
                </>
              )}
            </div>
            <p className="exercise-teacher detail-teacher-line">
              Professeur : <strong>{exercise.teacher.name}</strong>
            </p>
          </div>
          {exercise.category === 'examen' && (
            <button className="btn-secondary" onClick={() => navigate('/revision')}>
              Retour aux examens
            </button>
          )}
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
              {subjectQuestions?.map((q) => {
                const selected = new Set(answers[q.id] || []);
                const isSubjectSubmitted = submittedSubjects.has(currentSubject);
                const isCorrect = evaluation[q.id];
                return (
                  <div key={q.id} className="question-card">
                    <div className="question-head">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {q.subject && <span className="subject-pill">{q.subject}</span>}
                        <div className="question-type">
                          {q.type === 'qcm' ? 'QCM' : q.type === 'qcu' ? 'QCU' : 'Réponse libre'}
                        </div>
                      </div>
                      {isSubjectSubmitted && (
                        <div className={`question-result ${isCorrect ? 'ok' : 'ko'}`}>
                          {isCorrect ? 'Bonne réponse' : 'À revoir'}
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
                        disabled={isSubjectSubmitted}
                      />
                    ) : (
                      <div className="options">
                        {q.options?.map((opt) => {
                          const isSelected = selected.has(opt.id);
                          const isOptionCorrect = isSubjectSubmitted && q.correct.includes(opt.id);
                          const showState = isSubjectSubmitted
                            ? isOptionCorrect
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
                              disabled={isSubjectSubmitted}
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
              onClick={handleValidateSubject}
              disabled={!hasAccess}
            >
              {!hasAccess
                ? 'Payer pour commencer'
                : isLastSubject
                ? 'Valider'
                : 'Valider et passer au sujet suivant'}
            </button>
          </div>
          {Object.keys(subjectScores).length > 0 && (
            <div className="score-banner">
              {subjects.map((subj) => {
                const res = subjectScores[subj];
                return (
                  <div key={subj} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span className="subject-pill">{subj}</span>
                    {res ? (
                      <span>
                        Score : {res.good} / {res.total}
                      </span>
                    ) : (
                      <span>En cours...</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionDetail;

