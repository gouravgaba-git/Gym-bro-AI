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
      accent: "from-blue-600 to-blue-400",
      description: "Progressive overload focused on muscle growth & balanced volume."
    },
    {
      id: "fat_loss",
      title: "Fat Loss",
      icon: "🔥",
      badge: "Conditioning",
      accent: "from-red-600 to-red-400",
      description: "Higher pace, circuit sets, and elevated calorie burn."
    },
    {
      id: "strength",
      title: "Raw Strength",
      icon: "⚡",
      badge: "Heavy Power",
      accent: "from-blue-600 to-red-500",
      description: "Focus on compound lifts, heavy loading, and max power output."
    }
  ];

  return (
    <div className="bg-[#0f172a]/90 border border-white/10 rounded-2xl p-5 sm:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-red-500" />

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
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
              01
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Choose Primary Goal</h2>
              <p className="text-xs text-slate-400">Select your target outcome for this routine.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {goals.map((g) => {
              const isSelected = goal === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 border ${
                    isSelected
                      ? "bg-slate-800/90 border-blue-500 shadow-md shadow-blue-500/15"
                      : "bg-slate-900/50 hover:bg-slate-800/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Selected Checkmark */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      ✓
                    </span>
                  )}

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                        isSelected ? `bg-gradient-to-tr ${g.accent} text-white` : "bg-white/5 text-slate-300"
                      }`}>
                        {g.icon}
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                        isSelected ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/5 text-slate-400 border border-white/10"
                      }`}>
                        {g.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{g.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{g.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/10" />

        {/* Step 2: Choose Experience Level & Frequency */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-red-500/20">
              02
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Experience & Schedule</h2>
              <p className="text-xs text-slate-400">Configure your training frequency and intensity.</p>
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
            className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-red-600 hover:from-blue-500 hover:to-red-500 text-white font-bold text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-blue-600/20 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>{isGenerating ? "Generating Plan..." : "Generate Workout Plan"}</span>
            <span className="text-base">➔</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
