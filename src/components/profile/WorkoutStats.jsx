import React from "react";
import { Flame, Trophy, Dumbbell, Target, BarChart2 } from "lucide-react";

const WorkoutStats = ({ user }) => {
  const stats = [
    {
      title: "Current Streak",
      value: `${user?.currentStreak || 0} ${user?.currentStreak === 1 ? "Day" : "Days"}`,
      icon: <Flame size={22} />,
      accentColor: "#ff4b2b",
      bgColor: "rgba(255, 75, 43, 0.12)",
      description: "Consecutive active days"
    },
    {
      title: "Longest Streak",
      value: `${user?.longestStreak || user?.currentStreak || 0} ${user?.longestStreak === 1 ? "Day" : "Days"}`,
      icon: <Trophy size={22} />,
      accentColor: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.12)",
      description: "Personal best record"
    },
    {
      title: "Workouts Completed",
      value: user?.workoutsCompleted || 0,
      icon: <Dumbbell size={22} />,
      accentColor: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.12)",
      description: "Finished AI sessions"
    },
    {
      title: "Current Goal",
      value: (user?.fitnessGoal || "muscle_gain").replace("_", " "),
      icon: <Target size={22} />,
      accentColor: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.12)",
      description: "Active workout program",
      isText: true
    }
  ];

  return (
    <div className="workout-stats-section">
      <div className="section-header-row">
        <div className="section-title-group">
          <BarChart2 className="section-title-icon text-orange" size={20} />
          <h3 className="section-heading-title">Workout Statistics</h3>
        </div>
        <span className="live-sync-pill">
          ⚡ Real-time Session Logs
        </span>
      </div>

      <div className="stats-4col-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="card stat-card-compact">
            <div className="stat-card-header">
              <div className="stat-icon-bubble" style={{ background: stat.bgColor, color: stat.accentColor }}>
                {stat.icon}
              </div>
              <span className="stat-card-title">{stat.title}</span>
            </div>

            <div className="stat-card-body">
              <div
                className={`stat-card-value ${stat.isText ? "text-value" : ""}`}
                style={{ color: stat.isText ? "#ffffff" : stat.accentColor }}
              >
                {stat.value}
              </div>
              <span className="stat-card-subtext">{stat.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutStats;
