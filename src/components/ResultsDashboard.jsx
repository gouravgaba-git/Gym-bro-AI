import React, { useState, useRef, useEffect } from 'react';
import InfoTemplate from "./infopage.jsx";

/**
 * ResultsDashboard displays the generated workout plan with detail cards and exercises.
 */
const ResultsDashboard = ({ plan }) => {
  const containerRef = useRef(null);
  const [selectedexercise, setselectedexercise] = useState(null);
  // Scroll to results when plan is loaded
  useEffect(() => {
    if (plan && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [plan]);

  if (!plan) return null;

  const { splitName, goalLabel, levelLabel, days } = plan;

  return (
    <div className="card results-container" ref={containerRef} id="workout-results-dashboard">
      {selectedexercise && (
        <InfoTemplate exercise={selectedexercise} onClose={() => setselectedexercise(null)} />
      )}
      {/* Dashboard Top Header */}
      <div className="results-header">
        <div className="results-title-group">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className="badge badge-split" id="badge-split-type">{splitName}</span>
            <span className="badge badge-goal" id="badge-goal-type">{goalLabel}</span>
            <span className="badge badge-level" id="badge-level-type">{levelLabel}</span>
          </div>
          <h2 className="results-title">Your Custom Training Routine</h2>
          <p className="results-subtitle">Follow this structure for the next 6-8 weeks for optimal adaptations.</p>
        </div>
      </div>

      {/* Days list */}
      <div className="days-container">
        {days.map((day, idx) => (
          <div key={idx} className="day-card" id={`workout-day-${idx + 1}`}>
            {/* Day Header */}
            <div className="day-header">
              <span className="day-name">
                <span style={{ color: '#ff4b2b' }}>➔</span> {day.name}
              </span>
              <span className="day-target-summary">{day.focus}</span>
            </div>

            {/* Exercise Details Table */}
            <div className="exercise-table-wrapper">
              <table className="exercise-table">
                <thead>
                  <tr>
                    <th>Exercise Name</th>
                    <th>Targets</th>
                    <th>Sets x Reps</th>
                    <th style={{ textAlign: 'right' }}>Form Guide</th>
                  </tr>
                </thead>
                <tbody>
                  {day.exercises.map((ex, exIdx) => (
                    <tr key={exIdx}>
                      <td>
                        <div className="exercise-name">{ex.name}</div>
                      </td>
                      <td>
                        <span className="target-badge">{ex.target}</span>
                      </td>
                      <td>
                        <span className="sets-reps-text">{ex.setsReps}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          href={ex.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="watch-btn"
                          aria-label={`Watch tutorial video for ${ex.name}`}
                          onClick={() => setselectedexercise(ex)}
                        >
                          <svg className="watch-btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span>get info</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDashboard;
