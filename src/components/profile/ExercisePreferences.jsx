import React from "react";
import { Target, Award, Dumbbell, Activity, Edit3 } from "lucide-react";

const ExercisePreferences = ({ user, onEdit }) => {
  const goalLabels = {
    muscle_gain: "Muscle Gain",
    fat_loss: "Fat Loss",
    strength: "Raw Strength"
  };

  const levelLabels = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };

  const preferenceItems = [
    {
      label: "Primary Goal",
      value: goalLabels[user?.fitnessGoal] || (user?.fitnessGoal ? user.fitnessGoal.replace("_", " ") : "Muscle Gain"),
      icon: <Target className="pref-icon text-orange" size={18} />,
      highlight: true
    },
    {
      label: "Experience Level",
      value: levelLabels[user?.experienceLevel] || user?.experienceLevel || "Intermediate",
      icon: <Award className="pref-icon text-purple" size={18} />
    },
    {
      label: "Preferred Workout Type",
      value: user?.fitnessGoal === "fat_loss" ? "HIIT & Conditioning" : user?.fitnessGoal === "strength" ? "Heavy Strength & Power" : "Hypertrophy & Muscle Building",
      icon: <Dumbbell className="pref-icon text-blue" size={18} />
    },
    {
      label: "Activity Level",
      value: user?.activityLevel || "Moderate (3-5 days/week)",
      icon: <Activity className="pref-icon text-emerald" size={18} />
    }
  ];

  return (
    <div className="card profile-info-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <Target className="section-title-icon text-orange" size={20} />
          <h3 className="card-heading-title">Exercise Preferences</h3>
        </div>
        {onEdit && (
          <button className="edit-icon-btn" onClick={onEdit} title="Edit preferences">
            <Edit3 size={15} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="key-value-list">
        {preferenceItems.map((item, idx) => (
          <div key={idx} className="kv-row">
            <div className="kv-label-group">
              {item.icon}
              <span className="kv-label-text">{item.label}</span>
            </div>
            <span className={`kv-value-text ${item.highlight ? "highlight-pill" : ""}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisePreferences;
