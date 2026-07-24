import React from "react";
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
  const goals = [
    {
      id: "muscle_gain",
      title: "Muscle Gain",
      icon: "💪",
      badge: "Hypertrophy",
      description: "Progressive overload focused on clean muscle growth & volume."
    },
    {
      id: "fat_loss",
      title: "Fat Loss",
      icon: "🔥",
      badge: "Metabolic",
      description: "High pace circuit sets and elevated calorie conditioning."
    },
    {
      id: "strength",
      title: "Raw Strength",
      icon: "⚡",
      badge: "Neural Drive",
      description: "Focus on heavy compound lifts, low reps, and maximum power."
    }
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
        {/* Step 1: Choose Fitness Goal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-[#bbf246] text-[#0b1017] font-black text-xs flex items-center justify-center shadow-md shadow-[#bbf246]/20">
              01
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Choose Primary Goal</h2>
              <p className="text-xs text-slate-400">Select the target adaptation for your custom workout split.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {goals.map((g) => {
              const isSelected = goal === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 border ${
                    isSelected
                      ? "bg-[#1c2635] border-[#bbf246] shadow-lg shadow-[#bbf246]/10 scale-[1.01]"
                      : "bg-[#0b1017]/60 hover:bg-[#1c2635]/80 border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Selected Checkmark Indicator */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#bbf246] text-[#0b1017] text-xs font-black flex items-center justify-center shadow-sm">
                      ✓
                    </span>
                  )}

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${
                        isSelected ? "bg-[#bbf246] text-[#0b1017] shadow-md shadow-[#bbf246]/30" : "bg-white/5 text-slate-300"
                      }`}>
                        {g.icon}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        isSelected ? "bg-[#bbf246]/20 text-[#bbf246] border border-[#bbf246]/30" : "bg-white/5 text-slate-400 border border-white/10"
                      }`}>
                        {g.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-white">{g.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{g.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/10" />

        {/* Step 2: Choose Experience Level & Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-cyan-400 text-[#0b1017] font-black text-xs flex items-center justify-center shadow-md shadow-cyan-400/20">
              02
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
