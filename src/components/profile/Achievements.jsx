import React from "react";
import { Trophy, Zap, Flame, Dumbbell, CheckCircle2, Lock, Award } from "lucide-react";

const Achievements = ({ user }) => {
  const workoutsCount = user?.workoutsCompleted || 0;
  const longestStreak = user?.longestStreak || user?.currentStreak || 0;

  const badges = [
    {
      title: "Pioneer Bro",
      icon: <Trophy size={22} />,
      desc: "Created & verified athletic profile",
      unlocked: true,
      accent: "#f59e0b"
    },
    {
      title: "First Workout",
      icon: <Zap size={22} />,
      desc: "Completed 1st workout session",
      unlocked: workoutsCount >= 1,
      accent: "#3b82f6"
    },
    {
      title: "Streak Master",
      icon: <Flame size={22} />,
      desc: "Achieved a 3+ day workout streak",
      unlocked: longestStreak >= 3,
      accent: "#ff4b2b"
    },
    {
      title: "Iron Lifter",
      icon: <Dumbbell size={22} />,
      desc: "Completed 10+ workout sessions",
      unlocked: workoutsCount >= 10,
      accent: "#10b981"
    }
  ];

  return (
    <div className="achievements-section">
      <div className="section-header-row">
        <div className="section-title-group">
          <Award className="section-title-icon text-orange" size={20} />
          <h3 className="section-heading-title">Achievements & Milestones</h3>
        </div>
        <span className="unlocked-count-pill">
          {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
        </span>
      </div>

      <div className="achievements-grid">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className={`card achievement-card ${badge.unlocked ? "unlocked" : "locked"}`}
          >
            <div className="achievement-card-top">
              <div
                className="achievement-icon-box"
                style={{
                  background: badge.unlocked ? `${badge.accent}18` : "rgba(255, 255, 255, 0.04)",
                  color: badge.unlocked ? badge.accent : "var(--text-muted)",
                  borderColor: badge.unlocked ? `${badge.accent}40` : "rgba(255, 255, 255, 0.08)"
                }}
              >
                {badge.icon}
              </div>
              <span className={`achievement-badge-pill ${badge.unlocked ? "status-unlocked" : "status-locked"}`}>
                {badge.unlocked ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>Unlocked</span>
                  </>
                ) : (
                  <>
                    <Lock size={12} />
                    <span>Locked</span>
                  </>
                )}
              </span>
            </div>

            <div className="achievement-card-body">
              <h4 className="achievement-name">{badge.title}</h4>
              <p className="achievement-desc">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
