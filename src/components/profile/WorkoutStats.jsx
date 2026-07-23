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
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <span>📊</span> Workout Statistics
        </h3>
        <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full" title="Automatically calculated from MongoDB session logs">
          ⚡ Real-time MongoDB Calculated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#0f1524]/90 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-xl flex flex-col gap-3 transition-all hover:border-white/20">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${stat.accent}15`, color: stat.accent }}>
                {stat.icon}
              </span>
              <span className="text-2xl font-black text-white">{stat.value}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-200">{stat.title}</span>
              <span className="text-xs text-gray-400">{stat.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutStats;
