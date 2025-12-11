import React from 'react';
import { useNavigate } from 'react-router-dom';
import { revisionExercises } from '../data/revisionData';
import './Revision.css';

const Revision = () => {
  const navigate = useNavigate();

  const handlePublish = () => {
    navigate('/revision/publier');
  };

  const handleOpen = (exercise) => {
    navigate(`/revision/${exercise.id}`, { state: { exercise } });
  };

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

        <div className="revision-grid">
          {revisionExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="exercise-card"
              onClick={() => handleOpen(exercise)}
            >
              <img src={exercise.thumbnail} alt={exercise.title} className="exercise-thumb" />
              <div className="exercise-body">
                <h3 className="exercise-title">{exercise.title}</h3>
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

