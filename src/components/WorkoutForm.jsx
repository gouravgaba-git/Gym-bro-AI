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
      accent: "from-[#ff416c] to-[#ff4b2b]",
      description: "Maximize volume, hypertrophy sets, and clean muscle tissue retention."
    },
    {
      id: "fat_loss",
      title: "Fat Loss",
      icon: "🔥",
      badge: "Metabolic",
      accent: "from-[#f59e0b] to-[#ff4b2b]",
      description: "High energy output, circuit sets, and elevated cardiovascular conditioning."
    },
    {
      id: "strength",
      title: "Raw Strength",
      icon: "⚡",
      badge: "Neural Drive",
      accent: "from-[#3b82f6] to-[#8b5cf6]",
      description: "Focus on heavy compound lifts, low reps, and maximum force output."
    }
  ];

  return (
    <div className="bg-[#0d1322]/90 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-8">
      {/* Metallic Top Edge Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff416c] via-[#ff4b2b] to-[#3b82f6]" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-8"
      >
        {/* Step 1: Choose Fitness Goal */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white font-black text-xs flex items-center justify-center shadow-md shadow-[#ff4b2b]/30">
              01
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Choose Primary Fitness Goal</h2>
              <p className="text-xs text-gray-400">Select the primary physiological adaptation target for your program.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {goals.map((g) => {
              const isSelected = goal === g.id;
              return (
                <div
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4 border ${
                    isSelected
                      ? "bg-[#162035] border-[#ff4b2b] shadow-[0_0_30px_rgba(255,75,43,0.25)] scale-[1.02]"
                      : "bg-[#121929]/70 hover:bg-[#162035] border-white/10 hover:border-white/20 hover:scale-[1.01]"
                  }`}
                >
                  {/* Selected Indicator Checkmark */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white text-xs font-black flex items-center justify-center shadow-sm">
                      ✓
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                        isSelected ? `bg-gradient-to-tr ${g.accent} text-white shadow-lg` : "bg-white/5 text-gray-300"
                      }`}>
                        {g.icon}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isSelected ? "bg-[#ff4b2b]/20 text-[#ff4b2b] border border-[#ff4b2b]/30" : "bg-white/5 text-gray-400 border border-white/10"
                      }`}>
                        {g.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white">{g.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{g.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/10" />

        {/* Step 2: Choose Experience Level & Metrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white font-black text-xs flex items-center justify-center shadow-md shadow-[#ff4b2b]/30">
              02
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Select Experience Level & Frequency</h2>
              <p className="text-xs text-gray-400">Tailor training volume and muscle group focus according to your adaptation tier.</p>
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
        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-[#ff416c] via-[#ff4b2b] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#ff416c] text-white font-black text-base sm:text-lg tracking-wide uppercase shadow-[0_0_35px_rgba(255,75,43,0.35)] hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <span>🚀</span>
            <span>{isGenerating ? "Synthesizing AI Plan..." : "Generate Custom Workout Plan"}</span>
            <span className="text-xl">➔</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
