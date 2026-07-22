import React, { useState, useRef, useEffect } from 'react';
import InfoTemplate from "./infopage.jsx";
import { useAuth } from "../context/AuthContext";

/**
 * ResultsDashboard displays the generated workout plan with detail cards and exercises.
 * Includes interactive workout logging to update user statistics & streaks in MongoDB.
 */
const ResultsDashboard = ({ plan }) => {
  const containerRef = useRef(null);
  const [selectedexercise, setselectedexercise] = useState(null);
  const [loggingDay, setLoggingDay] = useState(null);
  const { logWorkoutSession, isAuthenticated } = useAuth();

  // Scroll to results when plan is loaded
  useEffect(() => {
    if (plan && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [plan]);

  if (!plan) return null;

  const { splitName, goalLabel, levelLabel, days } = plan;

  const handleCompleteDay = async (day, idx) => {
    try {
      setLoggingDay(idx);
      const exercisesCount = day.exercises ? day.exercises.length : 4;
      await logWorkoutSession({
        workoutName: `${day.name} - ${day.focus}`,
        durationMinutes: 45,
        exercisesCount,
        setsCount: exercisesCount * 3
      });
    } catch (err) {
      console.error("Complete day error:", err);
    } finally {
      setLoggingDay(null);
    }
  };

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
            <div className="day-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="day-name">
                  <span style={{ color: '#ff4b2b' }}>➔</span> {day.name}
                </span>
                <span className="day-target-summary" style={{ marginLeft: '12px' }}>{day.focus}</span>
              </div>

              {isAuthenticated && (
                <button
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => handleCompleteDay(day, idx)}
                  disabled={loggingDay === idx}
                >
                  {loggingDay === idx ? "Saving..." : "✓ Complete Workout Session"}
                </button>
              )}
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
