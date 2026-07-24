import React from "react";

const LevelController = ({
  level,
  setLevel,
  days,
  setDays,
  selectedMuscles,
  setSelectedMuscles
}) => {
  const levels = [
    { id: "beginner", label: "Beginner 🟢", tag: "Full Body Focus" },
    { id: "intermediate", label: "Intermediate 🟡", tag: "Split Presets" },
    { id: "advanced", label: "Advanced 🔴", tag: "Custom Target" }
  ];

  const intermediateDayOptions = [
    { count: 3, label: "3 Days / Week", desc: "Full Body / PPL Hybrid" },
    { count: 4, label: "4 Days / Week", desc: "Upper / Lower Split" },
    { count: 5, label: "5 Days / Week", desc: "Push / Pull / Legs + Upper" },
    { count: 6, label: "6 Days / Week", desc: "Push / Pull / Legs x2" }
  ];

  const muscleGroups = [
    "Chest",
    "Back",
    "Shoulders",
    "Legs",
    "Arms",
    "Core",
    "Triceps",
    "Forearms"
  ];

  const toggleMuscle = (muscle) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter((m) => m !== muscle));
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Segmented Selector Bar */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#0a0e19] border border-white/10 shadow-inner">
        {levels.map((lvl) => {
          const isSelected = level === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setLevel(lvl.id)}
              className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white shadow-lg shadow-[#ff4b2b]/30 scale-[1.02]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{lvl.label}</span>
              <span className={`text-[9px] font-medium tracking-wider uppercase ${
                isSelected ? "text-white/80" : "text-gray-500"
              }`}>
                {lvl.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Render based on Experience Level */}
      <div className="space-y-4 pt-2">
        {level === "beginner" && (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-200 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 backdrop-blur-md shadow-md">
            <span className="text-2xl shrink-0">💡</span>
            <div className="space-y-1">
              <div className="font-extrabold text-sm text-blue-400 uppercase tracking-wide">
                Full Body Progression Preset Locked
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Beginners excel best on <strong>4-Day Full Body</strong> splits for maximum movement pattern frequency, rapid neural adaptations, and optimal muscle protein synthesis recovery windows.
              </p>
            </div>
          </div>
        )}

        {level === "intermediate" && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
              Select Weekly Training Frequency
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {intermediateDayOptions.map((opt) => {
                const isSelected = days === opt.count;
                return (
                  <div
                    key={opt.count}
                    onClick={() => setDays(opt.count)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "bg-[#162035] border-[#ff4b2b] shadow-[0_0_20px_rgba(255,75,43,0.2)] scale-[1.02]"
                        : "bg-[#121929]/70 hover:bg-[#162035] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-white">{opt.label}</span>
                      {isSelected && <span className="text-xs text-[#ff4b2b] font-bold">✓</span>}
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">{opt.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {level === "advanced" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                Select Target Muscle Groups
              </label>
              <span className="text-xs text-[#ff4b2b] font-extrabold">
                {selectedMuscles.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {muscleGroups.map((muscle) => {
                const isChecked = selectedMuscles.includes(muscle);
                return (
                  <div
                    key={muscle}
                    onClick={() => toggleMuscle(muscle)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center justify-between gap-2 select-none ${
                      isChecked
                        ? "bg-[#162035] border-[#ff4b2b] shadow-[0_0_15px_rgba(255,75,43,0.2)]"
                        : "bg-[#121929]/70 hover:bg-[#162035] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className={`text-xs font-bold ${isChecked ? "text-white" : "text-gray-300"}`}>
                      {muscle}
                    </span>
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-black transition-all ${
                      isChecked ? "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] border-transparent text-white shadow-sm" : "border-white/20 text-transparent"
                    }`}>
                      ✓
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelController;
