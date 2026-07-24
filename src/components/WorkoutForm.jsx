import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LevelController from "./LevelController";

const WorkoutForm = ({
  goal,
  setGoal,
  level,
  setLevel,
  days,
  setDays,
  selectedMuscles,
  setSelectedMuscles,
  onSubmit,
  isGenerating
}) => {
  const navigate = useNavigate();
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  const goalDetails = {
    muscle_gain: {
      title: "Muscle Gain",
      icon: "💪",
      badge: "Hypertrophy",
      desc: "Progressive overload focused on clean muscle growth & volume."
    },
    fat_loss: {
      title: "Fat Loss",
      icon: "🔥",
      badge: "Metabolic",
      desc: "High pace circuit sets and elevated calorie conditioning."
    },
    strength: {
      title: "Raw Strength",
      icon: "⚡",
      badge: "Neural Drive",
      desc: "Focus on heavy compound lifts, low reps, and maximum power."
    }
  };

  const activeGoal = goalDetails[goal] || goalDetails.muscle_gain;

  const goalsList = [
    { id: "muscle_gain", ...goalDetails.muscle_gain },
    { id: "fat_loss", ...goalDetails.fat_loss },
    { id: "strength", ...goalDetails.strength }
  ];

  return (
    <div className="bg-[#141c27] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-xl backdrop-blur-xl space-y-6 relative overflow-hidden">
      {/* Top Cyber Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#bbf246] via-cyan-400 to-purple-500" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6"
      >
        {/* Saved Goal Banner Section */}
        <div className="bg-[#0b1017] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#bbf246] text-[#0b1017] flex items-center justify-center text-xl font-black shrink-0 shadow-md shadow-[#bbf246]/20">
                {activeGoal.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Primary Fitness Goal
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#bbf246]/20 text-[#bbf246] border border-[#bbf246]/30">
                    Saved in Profile
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {activeGoal.title} <span className="text-xs font-normal text-slate-400">({activeGoal.badge})</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowGoalSelector(!showGoalSelector)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                {showGoalSelector ? "Hide Goal Options" : "Switch Goal"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-3 py-1.5 rounded-xl bg-[#bbf246]/10 hover:bg-[#bbf246]/20 border border-[#bbf246]/30 text-[#bbf246] font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <span>✏️</span> Edit in Profile
              </button>
            </div>
          </div>

          {/* Quick Toggle Dropdown if user clicks Switch Goal */}
          {showGoalSelector && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 animate-in fade-in duration-200">
              {goalsList.map((g) => (
                <div
                  key={g.id}
                  onClick={() => {
                    setGoal(g.id);
                    setShowGoalSelector(false);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center gap-2.5 ${
                    goal === g.id
                      ? "bg-[#1c2635] border-[#bbf246]"
                      : "bg-[#141c27]/60 hover:bg-[#1c2635] border-white/10 text-slate-400"
                  }`}
                >
                  <span className="text-lg">{g.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{g.title}</div>
                    <div className="text-[10px] text-slate-400">{g.badge}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Choose Experience Level & Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-[#bbf246] text-[#0b1017] font-black text-xs flex items-center justify-center shadow-md shadow-[#bbf246]/20">
              01
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Experience Level & Frequency</h2>
              <p className="text-xs text-slate-400">Configure your training frequency and target muscle focus.</p>
            </div>
          </div>

          <LevelController
            level={level}
            setLevel={setLevel}
            days={days}
            setDays={setDays}
            selectedMuscles={selectedMuscles}
            setSelectedMuscles={setSelectedMuscles}
          />
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 sm:py-4.5 px-6 rounded-2xl bg-[#bbf246] hover:bg-[#d9f99d] text-[#0b1017] font-black text-sm sm:text-base tracking-wider uppercase shadow-xl shadow-[#bbf246]/25 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            <span>⚡</span>
            <span>{isGenerating ? "GENERATING WORKOUT PLAN..." : "LET'S BUILD WORKOUT PLAN"}</span>
            <span className="text-lg">➔</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
