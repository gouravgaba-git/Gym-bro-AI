import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import InfoTemplate from "../components/infopage";

const WorkoutPlanPage = () => {
  const { workoutPlan } = useWorkout();
  const navigate = useNavigate();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const tabsContainerRef = useRef(null);

  // Default to Day 1 whenever a new workout plan is loaded
  useEffect(() => {
    setSelectedDayIndex(0);
  }, [workoutPlan]);

  // If no plan is available, show a helpful empty state
  if (!workoutPlan || !workoutPlan.days || workoutPlan.days.length === 0) {
    return (
      <div className="page-fade-in" style={{ width: "100%", maxWidth: "900px", margin: "40px auto 0" }}>
        <div className="card empty-plan-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "12px", color: "var(--text-primary)" }}>
            No Workout Plan Found
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "480px", margin: "0 auto 24px", lineHeight: "1.6" }}>
            You haven't generated a training routine yet. Select your primary fitness goal and experience level on the dashboard to build your custom plan.
          </p>
          <button
            type="button"
            className="generate-btn"
            style={{ maxWidth: "260px", margin: "0 auto" }}
            onClick={() => navigate("/dashboard")}
          >
            <span>Go to Dashboard</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const { splitName, goalLabel, levelLabel, days } = workoutPlan;
  const safeDayIndex = Math.min(selectedDayIndex, days.length - 1);
  const activeDay = days[safeDayIndex] || days[0];

  return (
    <div className="page-fade-in workout-plan-page-container" style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
      {/* Exercise Details & AI Coach Modal */}
      {selectedExercise && (
        <InfoTemplate
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Hero Header & Plan Metadata */}
      <header className="compact-hero-header" style={{ marginBottom: "0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", width: "100%" }}>
          <div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
              <span className="badge badge-split" id="badge-split-type">{splitName}</span>
              <span className="badge badge-goal" id="badge-goal-type">{goalLabel}</span>
              <span className="badge badge-level" id="badge-level-type">{levelLabel}</span>
              <span className="badge" style={{ color: "#ff4b2b", borderColor: "rgba(255, 75, 43, 0.3)" }}>
                {days.length} Days Split
              </span>
            </div>
            <h1 className="compact-hero-title" style={{ fontSize: "32px", textAlign: "left" }}>
              Your Custom Training Routine
            </h1>
            <p className="compact-hero-subtitle" style={{ fontSize: "14px", textAlign: "left", marginTop: "4px" }}>
              Follow this structure for the next 6-8 weeks for optimal adaptations.
            </p>
          </div>

          <button
            type="button"
            className="modify-plan-btn"
            onClick={() => navigate("/dashboard")}
            title="Modify goals and regenerate plan"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Modify Plan</span>
          </button>
        </div>
      </header>

      {/* Dynamic Day Selector Tabs Bar */}
      <div className="day-tabs-wrapper">
        <div
          className="day-tabs-container"
          ref={tabsContainerRef}
          role="tablist"
          aria-label="Workout Days"
        >
          {days.map((day, idx) => {
            const isSelected = safeDayIndex === idx;
            return (
              <button
                key={idx}
                id={`day-tab-${idx + 1}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`workout-day-panel-${idx + 1}`}
                className={`day-tab-btn ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedDayIndex(idx)}
              >
                <span className="day-tab-indicator">Day {idx + 1}</span>
                <span className="day-tab-focus-text">
                  {day.name ? day.name.replace(/^Day\s*\d+\s*\(?/i, "").replace(/\)$/, "").trim() || `Session ${idx + 1}` : `Session ${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single Day View: Selected Day's Workout Details & Exercises */}
      <div
        className="card day-card active-day-panel"
        id={`workout-day-panel-${safeDayIndex + 1}`}
        role="tabpanel"
        aria-labelledby={`day-tab-${safeDayIndex + 1}`}
      >
        {/* Day Header */}
        <div className="day-header">
          <div className="day-header-left">
            <span className="day-name">
              <span style={{ color: "#ff4b2b" }}>➔</span> {activeDay.name || `Day ${safeDayIndex + 1}`}
            </span>
            {activeDay.focus && (
              <span className="day-target-summary">{activeDay.focus}</span>
            )}
          </div>
          <div className="day-header-right">
            <span className="badge" style={{ fontSize: "12px" }}>
              {activeDay.exercises?.length || 0} Exercises
            </span>
          </div>
        </div>

        {/* Desktop / Tablet Exercise Table (>=768px) */}
        <div className="exercise-table-wrapper desktop-table-only">
          <table className="exercise-table">
            <thead>
              <tr>
                <th>Exercise Name</th>
                <th>Targets</th>
                <th>Sets x Reps</th>
                <th style={{ textAlign: "right" }}>Form Guide</th>
              </tr>
            </thead>
            <tbody>
              {activeDay.exercises && activeDay.exercises.map((ex, exIdx) => (
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
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="watch-btn"
                      aria-label={`Watch tutorial and form guide for ${ex.name}`}
                      onClick={() => setSelectedExercise(ex)}
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

        {/* Mobile Stacked Exercise Cards (<768px) */}
        <div className="exercise-mobile-cards mobile-cards-only">
          {activeDay.exercises && activeDay.exercises.map((ex, exIdx) => (
            <div key={exIdx} className="exercise-mobile-card">
              <div className="exercise-mobile-header">
                <h4 className="exercise-mobile-title">{ex.name}</h4>
                <span className="target-badge">{ex.target}</span>
              </div>

              <div className="exercise-mobile-stat-row">
                <span className="stat-label">Sets × Reps</span>
                <span className="sets-reps-highlight">{ex.setsReps}</span>
              </div>

              <button
                type="button"
                className="watch-btn watch-btn-full"
                aria-label={`Watch tutorial and form guide for ${ex.name}`}
                onClick={() => setSelectedExercise(ex)}
              >
                <svg className="watch-btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Get Info</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanPage;
