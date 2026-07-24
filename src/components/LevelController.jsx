import React from 'react';

const ADVANCED_MUSCLES = ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core', 'Triceps', 'Forearms'];

const LevelController = ({
  level,
  days,
  setDays,
  selectedMuscles,
  setSelectedMuscles
}) => {
  // Beginner view: Soft contextual recommendation card
  if (level === 'beginner') {
    return (
      <div className="conditional-container" id="beginner-settings" style={{ margin: 0 }}>
        <div className="recommendation-card-context">
          <span className="recommendation-icon" role="img" aria-label="Recommendation Icon">💡</span>
          <div>
            <div className="recommendation-title">Smart Training Recommendation</div>
            <div className="recommendation-body">
              For beginner athletes, a 4-Day Full Body routine yields the fastest strength gains and neural recovery.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Intermediate view: Select 3, 4, 5, or 6 Day Split
  if (level === 'intermediate') {
    return (
      <div className="conditional-container" id="intermediate-settings" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="step-label-aligned" style={{ marginBottom: "2px" }}>
          <span className="step-number-indicator">3</span>
          <span>Choose Weekly Frequency</span>
        </div>
        <div className="days-grid" id="day-selection" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
          <div
            id="day-split-3"
            className={`day-option ${days === '3' || days === 3 ? 'selected' : ''}`}
            onClick={() => setDays('3')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDays('3'); }}
            style={{ borderRadius: "16px", padding: "12px 16px", cursor: "pointer" }}
          >
            <div className="day-option-title" style={{ fontSize: "14px", fontWeight: "800" }}>3 Day Split</div>
            <div className="day-option-desc" style={{ fontSize: "12px" }}>Ideal for Push / Pull / Legs (PPL) routines</div>
          </div>
          <div
            id="day-split-4"
            className={`day-option ${days === '4' || days === 4 ? 'selected' : ''}`}
            onClick={() => setDays('4')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDays('4'); }}
            style={{ borderRadius: "16px", padding: "12px 16px", cursor: "pointer" }}
          >
            <div className="day-option-title" style={{ fontSize: "14px", fontWeight: "800" }}>4 Day Split</div>
            <div className="day-option-desc" style={{ fontSize: "12px" }}>Ideal for Upper / Lower or Torso / Limbs splits</div>
          </div>
          <div
            id="day-split-5"
            className={`day-option ${days === '5' || days === 5 ? 'selected' : ''}`}
            onClick={() => setDays('5')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDays('5'); }}
            style={{ borderRadius: "16px", padding: "12px 16px", cursor: "pointer" }}
          >
            <div className="day-option-title" style={{ fontSize: "14px", fontWeight: "800" }}>5 Day Split</div>
            <div className="day-option-desc" style={{ fontSize: "12px" }}>Ideal for Push / Pull / Legs + Upper routines</div>
          </div>
          <div
            id="day-split-6"
            className={`day-option ${days === '6' || days === 6 ? 'selected' : ''}`}
            onClick={() => setDays('6')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setDays('6'); }}
            style={{ borderRadius: "16px", padding: "12px 16px", cursor: "pointer" }}
          >
            <div className="day-option-title" style={{ fontSize: "14px", fontWeight: "800" }}>6 Day Split</div>
            <div className="day-option-desc" style={{ fontSize: "12px" }}>High volume PPL x2 routines</div>
          </div>
        </div>
      </div>
    );
  }

  // Advanced view: Multi-select muscle group checkboxes
  if (level === 'advanced') {
    const handleToggleMuscle = (muscle) => {
      const currentSelected = selectedMuscles || [];
      if (currentSelected.includes(muscle)) {
        setSelectedMuscles(currentSelected.filter(m => m !== muscle));
      } else {
        setSelectedMuscles([...currentSelected, muscle]);
      }
    };

    return (
      <div className="conditional-container" id="advanced-settings" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="step-label-aligned" style={{ marginBottom: "2px" }}>
          <span className="step-number-indicator">3</span>
          <span>Select Target Muscle Groups</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', marginLeft: "4px" }}>
          Select target muscle groups to custom-tailor your hypertrophic splits.
        </p>
        <div className="muscle-grid" role="group" aria-label="Select target muscle groups" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
          {ADVANCED_MUSCLES.map((muscle) => {
            const isSelected = (selectedMuscles || []).includes(muscle);
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
                style={{ borderRadius: "14px", padding: "10px 14px", cursor: "pointer" }}
              >
                <div className="custom-checkbox" aria-hidden="true" style={{ width: "18px", height: "18px", borderRadius: "6px" }}>
                  {isSelected && '✓'}
                </div>
                <span className="muscle-name" style={{ fontSize: "13px", fontWeight: "700" }}>{muscle}</span>
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
