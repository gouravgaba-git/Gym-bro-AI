import React from "react";

const WorkoutStats = ({ user }) => {
  const stats = [
    {
      title: "Current Streak",
      value: `${user?.currentStreak || 0} Days`,
      icon: "🔥",
      accent: "#ff4b2b",
      description: "Consecutive active days"
    },
    {
      title: "Longest Streak",
      value: `${user?.longestStreak || 0} Days`,
      icon: "🏅",
      accent: "#8b5cf6",
      description: "Personal best streak"
    },
    {
      title: "Total Workouts",
      value: user?.workoutsCompleted || 0,
      icon: "🏋️",
      accent: "#3b82f6",
      description: "Completed sessions"
    },
    {
      title: "Calories Burned",
      value: `${user?.caloriesBurned || 0} kcal`,
      icon: "⚡",
      accent: "#f59e0b",
      description: "Total energy expended"
    },
    {
      title: "Workout Time",
      value: `${user?.totalWorkoutMinutes || 0} mins`,
      icon: "⏱️",
      accent: "#10b981",
      description: "Total training time"
    },
    {
      title: "Exercises Done",
      value: user?.exercisesCompleted || 0,
      icon: "🎯",
      accent: "#ec4899",
      description: "Completed exercise count"
    }
  ];

  return (
    <div className="section-container">
      <div className="section-header-flex">
        <h3 className="section-title">
          <span className="section-icon">📊</span> Workout Statistics
        </h3>
        <span className="auto-calc-badge" title="Automatically calculated from MongoDB session logs">
          ⚡ Real-time MongoDB Calculated
        </span>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="card stat-card">
            <div className="stat-card-top">
              <span className="stat-icon" style={{ background: `${stat.accent}15`, color: stat.accent }}>
                {stat.icon}
              </span>
              <span className="stat-value">{stat.value}</span>
            </div>
            <div className="stat-card-bottom">
              <span className="stat-title">{stat.title}</span>
              <span className="stat-desc">{stat.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutStats;
