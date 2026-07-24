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
      title: "Target Fitness Goal",
      value: (user?.fitnessGoal || "muscle_gain").replace("_", " "),
      icon: "🎯",
      accent: "#10b981",
      description: "Saved target program"
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <h3 className="section-title">
          <span>📊</span> Workout Statistics
        </h3>
        <span className="auto-calc-badge" title="Automatically calculated from MongoDB session logs">
          ⚡ Real-time MongoDB Synchronized
        </span>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="card stat-card">
            <div className="stat-card-top">
              <span className="stat-icon" style={{ background: `${stat.accent}15`, color: stat.accent }}>
                {stat.icon}
              </span>
              <span className="stat-value" style={{ textTransform: "capitalize" }}>{stat.value}</span>
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
