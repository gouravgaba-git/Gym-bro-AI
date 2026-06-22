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
    title: 'Strength',
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

/**
 * WorkoutForm captures training goals, level, and conditional options.
 */
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
    if (level === 'advanced' && selectedMuscles.length === 0) return false;
    return true;
  };

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    // Reset secondary states to avoid edge cases when toggling between levels
    if (newLevel === 'beginner') {
      setDays(null);
      setSelectedMuscles([]);
    } else if (newLevel === 'intermediate') {
      setDays('3'); // Default to 3 days split
      setSelectedMuscles([]);
    } else if (newLevel === 'advanced') {
      setDays(null);
      setSelectedMuscles(['Chest', 'Back', 'Legs']); // Default selections
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit();
    }
  };

  return (
    <form className="card form-section" onSubmit={handleSubmitForm} id="workout-generator-form">
      {/* 1. Goal Selection */}
      <div>
        <label className="section-label">
          <span className="label-number">1</span> Choose Fitness Goal
        </label>
        <div className="goal-grid" role="radiogroup" aria-label="Fitness Goal">
          {GOALS.map((g) => {
            const isSelected = goal === g.id;
            return (
              <div
                key={g.id}
                id={`goal-card-${g.id}`}
                className={`goal-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setGoal(g.id)}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setGoal(g.id); }}
              >
                <div className="goal-icon-wrapper">
                  {g.icon}
                </div>
                <div className="goal-title">{g.title}</div>
                <div className="goal-desc">{g.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Level Selection */}
      <div>
        <label className="section-label" htmlFor="level-selector">
          <span className="label-number">2</span> Choose Experience Level
        </label>
        <div className="level-group" id="level-selector" role="group" aria-label="Experience Level">
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

      {/* 4. Action Submit Button */}
      <button
        type="submit"
        id="generate-plan-button"
        className="generate-btn"
        disabled={isGenerating || !isFormValid()}
      >
        <span>{isGenerating ? 'Generating Plan...' : 'Generate Workout Plan'}</span>
        {!isGenerating && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default WorkoutForm;
