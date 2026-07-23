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
    <div className="bg-[#0f1524]/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <span>🎖️</span> Achievements & Milestones
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className={`bg-[#161f33]/60 border p-4 rounded-2xl flex flex-col items-center text-center gap-3 transition-all ${
              badge.unlocked ? "border-[#ff4b2b]/40 shadow-md shadow-[#ff4b2b]/10" : "border-white/5 opacity-60"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-white/5">
              <span>{badge.icon}</span>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sm text-white">{badge.title}</div>
              <div className="text-xs text-gray-400">{badge.desc}</div>
            </div>
            <span
              className={`text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full ${
                badge.unlocked ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
              }`}
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
