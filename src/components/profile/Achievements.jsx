import React from "react";

const Achievements = ({ user }) => {
  const workoutsCount = user?.workoutsCompleted || 0;
  const longestStreak = user?.longestStreak || user?.currentStreak || 0;

  const badges = [
    {
      title: "Pioneer Bro",
      icon: "🏆",
      desc: "Created & verified athletic profile",
      unlocked: !!user?.isProfileComplete
    },
    {
      title: "First Step",
      icon: "🚀",
      desc: "Completed 1st workout session",
      unlocked: workoutsCount >= 1
    },
    {
      title: "Streak Master",
      icon: "🔥",
      desc: "Achieved a 3+ day workout streak",
      unlocked: longestStreak >= 3
    },
    {
      title: "Iron Lifter",
      icon: "🏋️‍♂️",
      desc: "Completed 10+ workout sessions",
      unlocked: workoutsCount >= 10
    }
  ];

  return (
    <div className="card info-card">
      <div className="info-card-header">
        <h3 className="section-title">
          <span>🎖️</span> Achievements & Milestones
        </h3>
      </div>

      <div className="badges-grid">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className={`badge-card ${badge.unlocked ? "unlocked" : "locked"}`}
          >
            <div className="badge-icon-wrapper">
              <span>{badge.icon}</span>
            </div>
            <div className="badge-title">{badge.title}</div>
            <div className="badge-desc">{badge.desc}</div>
            <span
              className={badge.unlocked ? "badge-status-unlocked" : "badge-status-locked"}
            >
              {badge.unlocked ? "UNLOCKED" : "LOCKED"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
