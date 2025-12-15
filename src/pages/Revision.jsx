import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { revisionExercises } from '../data/revisionData';
import './Revision.css';

const LEVELS = [
  '6e',
  '5e',
  '4e',
  '3e',
  '2nde A',
  '2nde C',
  '1ère A',
  '1ère D',
  '1ère C',
  'Tle A',
  'Tle D',
  'Tle C',
];

const Revision = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const handlePublish = () => {
    navigate('/revision/publier');
  };

  const handleOpen = (exercise) => {
    navigate(`/revision/${exercise.id}`, { state: { exercise } });
  };

  const counters = useMemo(() => {
    return revisionExercises.reduce(
      (acc, ex) => {
        if (ex.category === 'interrogation') acc.interrogation += 1;
        if (ex.category === 'devoir') acc.devoir += 1;
        if (ex.category === 'examen') acc.examen += 1;
        acc.all += 1;
        return acc;
      },
      { all: 0, interrogation: 0, devoir: 0, examen: 0 }
    );
  }, []);

  useEffect(() => {
    if (filter === 'examen' || filter === 'all') {
      setLevelFilter('all');
    }
  }, [filter]);

  const filtered = useMemo(() => {
    return revisionExercises.filter((ex) => {
      const matchCategory = filter === 'all' ? true : ex.category === filter;
      if (!matchCategory) return false;

      const applyLevel = filter === 'interrogation' || filter === 'devoir';
      if (!applyLevel || levelFilter === 'all') return true;

      return ex.level === levelFilter;
    });
  }, [filter, levelFilter]);

  const showLevelFilter = filter === 'interrogation' || filter === 'devoir';

  return (
    <div className="revision-page">
      <div className="revision-container">
        <div className="revision-header">
          <div>
            <h1 className="revision-title">Révision</h1>
            <p className="revision-subtitle">
              Retrouvez tous les exercices disponibles pour vous entraîner. Choisissez, consultez le détail
              puis lancez-vous.
            </p>
          </div>
          <button className="publish-button" onClick={handlePublish}>
            Je veux publier
          </button>
        </div>

        <div className="filter-bar">
          {[
            { key: 'all', label: 'Tous', count: counters.all },
            { key: 'interrogation', label: 'Interrogations', count: counters.interrogation },
            { key: 'devoir', label: 'Devoirs', count: counters.devoir },
            { key: 'examen', label: 'Examens', count: counters.examen },
          ].map((item) => (
            <button
              key={item.key}
              className={`filter-chip ${filter === item.key ? 'active' : ''}`}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
              <span className="filter-count">{item.count}</span>
            </button>
          ))}
        </div>

        {showLevelFilter && (
          <div className="level-filter">
            <span className="level-label">Niveau</span>
            <div className="level-chips">
              <button
                className={`level-chip ${levelFilter === 'all' ? 'active' : ''}`}
                onClick={() => setLevelFilter('all')}
              >
                Tous
              </button>
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  className={`level-chip ${levelFilter === lvl ? 'active' : ''}`}
                  onClick={() => setLevelFilter(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="revision-grid">
          {filtered.map((exercise) => (
            <div
              key={exercise.id}
              className="exercise-card"
              onClick={() => handleOpen(exercise)}
            >
              <img src={exercise.thumbnail} alt={exercise.title} className="exercise-thumb" />
              <div className="exercise-body">
                <h3 className="exercise-title">{exercise.title}</h3>
                <div className="exercise-category">
                  <span className={`category-pill ${exercise.category}`}>
                    {exercise.category === 'interrogation'
                      ? 'Interrogation'
                      : exercise.category === 'devoir'
                      ? 'Devoir'
                      : 'Examen'}
                  </span>
                  {exercise.level && exercise.category !== 'examen' && (
                    <span className="level-pill">{exercise.level}</span>
                  )}
                  {exercise.category === 'examen' && (
                    <div className="exam-meta">
                      {exercise.level && <span className="exam-pill">{exercise.level}</span>}
                      {exercise.series && <span className="exam-pill light">Série {exercise.series}</span>}
                    </div>
                  )}
                </div>
                <p className="exercise-teacher">
                  Professeur : <strong>{exercise.teacher.name}</strong>
                </p>
                <p className="exercise-desc">{exercise.shortDescription}</p>
                <div className="exercise-meta">
                  <span className={`cert-badge ${exercise.certified ? 'ok' : 'no'}`}>
                    {exercise.certified ? 'Certifié' : 'Non certifié'}
                  </span>
                  <span className={`price-chip ${exercise.isFree ? 'free' : ''}`}>
                    {exercise.isFree ? 'Gratuit' : exercise.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Revision;

