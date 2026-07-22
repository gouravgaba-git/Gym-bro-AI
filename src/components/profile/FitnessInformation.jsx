import React from "react";

const FitnessInformation = ({ user, onEdit }) => {
  const goalLabels = {
    muscle_gain: "Muscle Gain 💪",
    fat_loss: "Fat Loss 🔥",
    strength: "Raw Strength ⚡"
  };

  const levelLabels = {
    beginner: "Beginner 🟢",
    intermediate: "Intermediate 🟡",
    advanced: "Advanced 🔴"
  };

  return (
    <div className="card info-card">
      <div className="info-card-header">
        <h3 className="section-title">
          <span className="section-icon">🎯</span> Fitness & Nutrition Goals
        </h3>
        <button className="edit-section-btn" onClick={onEdit}>
          ✏️ Edit Profile
        </button>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Primary Goal</span>
          <span className="info-value highlight">
            {goalLabels[user?.fitnessGoal] || user?.fitnessGoal || "Not specified"}
          </span>
        </div>

        <div className="info-item">
          <span className="info-label">Experience Level</span>
          <span className="info-value">
            {levelLabels[user?.experienceLevel] || user?.experienceLevel || "Not specified"}
          </span>
        </div>

        <div className="info-item">
          <span className="info-label">Target Weight</span>
          <span className="info-value">{user?.targetWeight ? `${user.targetWeight} kg` : "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Activity Level</span>
          <span className="info-value">{user?.activityLevel || "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Daily Calorie Target</span>
          <span className="info-value">{user?.dailyCalories ? `${user.dailyCalories} kcal` : "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Daily Protein Goal</span>
          <span className="info-value">{user?.proteinGoal ? `${user.proteinGoal} g` : "Not specified"}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Daily Water Goal</span>
          <span className="info-value">{user?.waterGoal ? `${user.waterGoal} L` : "Not specified"}</span>
        </div>
      </div>
    </div>
  );
};

export default FitnessInformation;
