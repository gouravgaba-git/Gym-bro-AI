import React from 'react';

const ADVANCED_MUSCLES = ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core'];

/**
 * LevelController renders different selection elements conditionally based on the user's selected level.
 */
const LevelController = ({
  level,
  days,
  setDays,
  selectedMuscles,
  setSelectedMuscles
}) => {
  // Beginner view: Lock to Full Body, display tips badge
  if (level === 'beginner') {
    return (
      <div className="conditional-container" id="beginner-settings">
        <div className="tip-badge">
          <span className="tip-badge-icon" role="img" aria-label="Tip Icon">💡</span>
          <div>
            <strong>Full Body Locked:</strong> Beginners excel best on 4-Day Full Body splits for maximum recovery, neural adaptations, and consistent progress.
          </div>
        </div>
      </div>
    );
  }

  // Intermediate view: Select 3 Day or 4 Day Split
  if (level === 'intermediate') {
    return (
      <div className="conditional-container" id="intermediate-settings">
        <label className="section-label" htmlFor="day-selection">
          <span className="label-number">3</span> Choose Weekly Frequency
        </label>
        <div className="days-grid" id="day-selection">
          <div
            id="day-split-3"
            className={`day-option ${days === '3' ? 'selected' : ''}`}
            onClick={() => setDays('3')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDays('3'); }}
          >
            <div className="day-option-title">3 Day Split</div>
            <div className="day-option-desc">Ideal for Push / Pull / Legs (PPL) routines</div>
          </div>
          <div
            id="day-split-4"
            className={`day-option ${days === '4' ? 'selected' : ''}`}
            onClick={() => setDays('4')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDays('4'); }}
          >
            <div className="day-option-title">4 Day Split</div>
            <div className="day-option-desc">Ideal for Upper / Lower or Torso / Limbs splits</div>
          </div>
        </div>
      </div>
    );
  }

  // Advanced view: Multi-select muscle group checkboxes
  if (level === 'advanced') {
    const handleToggleMuscle = (muscle) => {
      if (selectedMuscles.includes(muscle)) {
        setSelectedMuscles(selectedMuscles.filter(m => m !== muscle));
      } else {
        setSelectedMuscles([...selectedMuscles, muscle]);
      }
    };

    return (
      <div className="conditional-container" id="advanced-settings">
        <label className="section-label">
          <span className="label-number">3</span> Select Target Muscle Groups
        </label>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          Select at least one muscle group to custom-tailor your hypertrophic splits.
        </p>
        <div className="muscle-grid" role="group" aria-label="Select target muscle groups">
          {ADVANCED_MUSCLES.map((muscle) => {
            const isSelected = selectedMuscles.includes(muscle);
            return (
              <div
                key={muscle}
                id={`muscle-card-${muscle.toLowerCase()}`}
                className={`muscle-checkbox-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleToggleMuscle(muscle)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggleMuscle(muscle); }}
              >
                <div className="custom-checkbox" aria-hidden="true">
                  {isSelected && '✓'}
                </div>
                <span className="muscle-name">{muscle}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default LevelController;
