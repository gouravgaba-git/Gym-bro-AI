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
    <div className="bg-[#0f1524]/90 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <span>🎯</span> Fitness & Nutrition Goals
        </h3>
        <button className="px-3 py-1.5 text-xs font-bold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer" onClick={onEdit}>
          ✏️ Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Primary Goal</span>
          <span className="text-sm font-bold text-[#ff4b2b] block">
            {goalLabels[user?.fitnessGoal] || user?.fitnessGoal || "Not specified"}
          </span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Experience Level</span>
          <span className="text-sm font-bold text-white block">
            {levelLabels[user?.experienceLevel] || user?.experienceLevel || "Not specified"}
          </span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Target Weight</span>
          <span className="text-sm font-bold text-white block">{user?.targetWeight ? `${user.targetWeight} kg` : "Not specified"}</span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Activity Level</span>
          <span className="text-sm font-bold text-white block">{user?.activityLevel || "Not specified"}</span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Daily Calorie Target</span>
          <span className="text-sm font-bold text-white block">{user?.dailyCalories ? `${user.dailyCalories} kcal` : "Not specified"}</span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Daily Protein Goal</span>
          <span className="text-sm font-bold text-white block">{user?.proteinGoal ? `${user.proteinGoal} g` : "Not specified"}</span>
        </div>

        <div className="bg-[#161f33]/60 p-3.5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400 block">Daily Water Goal</span>
          <span className="text-sm font-bold text-white block">{user?.waterGoal ? `${user.waterGoal} L` : "Not specified"}</span>
        </div>
      </div>
    </div>
  );
};

export default FitnessInformation;
