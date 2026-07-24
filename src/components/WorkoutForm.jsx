import React from 'react';
import LevelController from './LevelController';

const GOALS = [
  {
    id: 'muscle_gain',
    title: 'Muscle Gain',
    description: 'Optimize for hypertrophy, volume, and clean muscle mass retention.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h12M12 2v20M2 12h20M17 7l5 5-5 5M7 7l-5 5 5 5" />
      </svg>
    )
  },
  {
    id: 'fat_loss',
    title: 'Fat Loss',
    description: 'High energy output, circuit sets, and metabolic conditioning.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    )
  },
  {
    id: 'strength',
    title: 'Raw Strength',
    description: 'Focus on low reps, heavy compound movements, and neural drive.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    )
  }
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];

const WorkoutForm = ({
  goal,
  setGoal,
  level,
  setLevel,
  days,
  setDays,
  selectedMuscles,
  setSelectedMuscles,
  onSubmit,
  isGenerating
}) => {
  const isFormValid = () => {
    if (!goal) return false;
    if (level === 'intermediate' && !days) return false;
    if (level === 'advanced' && (!selectedMuscles || selectedMuscles.length === 0)) return false;
    return true;
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    if (newLevel === 'beginner') {
      setDays(null);
      setSelectedMuscles([]);
    } else if (newLevel === 'intermediate') {
      setDays('3');
      setSelectedMuscles([]);
    } else if (newLevel === 'advanced') {
      setDays(null);
      setSelectedMuscles([]);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <form className="form-section workflow-step-wrapper" onSubmit={handleSubmitForm} id="workout-generator-form" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Subtle Vertical Workflow Line Connector */}
      <div className="workflow-progress-line" />

      {/* 1. Goal Selection (Compact Modern Cards) */}
      <div>
        <div className="step-label-aligned">
          <span className="step-number-indicator">1</span>
          <span>Target Fitness Goal</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }} role="radiogroup" aria-label="Fitness Goal">
          {GOALS.map((g) => {
            const isSelected = goal === g.id;
            return (
              <div
                key={g.id}
                id={`goal-card-${g.id}`}
                className={`goal-card-compact ${isSelected ? 'selected' : ''}`}
                onClick={() => setGoal(g.id)}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setGoal(g.id); }}
              >
                <div className="card-icon-box">
                  {g.icon}
                </div>
                <div className="card-text-wrapper">
                  <div className="card-title-text">{g.title}</div>
                  <div className="card-desc-text">{g.description}</div>
                </div>
                <div className="chevron-arrow">
                  ➔
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Level Selection Segmented Bar */}
      <div>
        <div className="step-label-aligned">
          <span className="step-number-indicator">2</span>
          <span>Training Experience</span>
        </div>
        <div
          id="level-selector"
          role="group"
          aria-label="Experience Level"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "4px",
            background: "rgba(15, 21, 36, 0.75)",
            padding: "4px",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)"
          }}
        >
          {LEVELS.map((l) => {
            const isSelected = level === l.id;
            return (
              <button
                key={l.id}
                type="button"
                id={`level-btn-${l.id}`}
                className={`level-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleLevelChange(l.id)}
                aria-pressed={isSelected}
                style={{
                  height: "36px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  border: "none",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isSelected ? "0 2px 10px rgba(255, 75, 43, 0.25)" : "none"
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Conditional Options based on Level */}
      <LevelController
        level={level}
        days={days}
        setDays={setDays}
        selectedMuscles={selectedMuscles}
        setSelectedMuscles={setSelectedMuscles}
      />

      {/* Premium Primary Action CTA Button */}
      <button
        type="submit"
        id="generate-plan-button"
        className="generate-btn"
        disabled={isGenerating || !isFormValid()}
      >
        {isGenerating ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            <span>Generating Plan...</span>
          </span>
        ) : (
          <>
            <span>Generate Workout Plan</span>
            <span className="cta-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </>
        )}
      </button>
    </form>
  );
};

export default WorkoutForm;
