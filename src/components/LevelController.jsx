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
    { id: "beginner", label: "Beginner", tag: "Full Body" },
    { id: "intermediate", label: "Intermediate", tag: "Split Presets" },
    { id: "advanced", label: "Advanced", tag: "Custom Target" }
  ];

  const intermediateDayOptions = [
    { count: 3, label: "3 Days / Wk", desc: "Full Body / PPL" },
    { count: 4, label: "4 Days / Wk", desc: "Upper / Lower" },
    { count: 5, label: "5 Days / Wk", desc: "Push / Pull / Legs" },
    { count: 6, label: "6 Days / Wk", desc: "PPL x2 Split" }
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
    <div className="space-y-5">
      {/* Level Segmented Selector Bar */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 shadow-inner">
        {levels.map((lvl) => {
          const isSelected = level === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setLevel(lvl.id)}
              className={`py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{lvl.label}</span>
              <span className={`text-[10px] font-normal tracking-wide ${
                isSelected ? "text-blue-100" : "text-slate-500"
              }`}>
                {lvl.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Render based on Experience Level */}
      <div className="space-y-4 pt-1">
        {level === "beginner" && (
          <div className="bg-blue-950/30 border border-blue-500/30 text-blue-200 p-4 rounded-xl flex items-start gap-3 backdrop-blur-md">
            <span className="text-xl shrink-0">💡</span>
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-blue-400 uppercase tracking-wide">
                Full Body Preset Selected
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Beginners get optimal progress on a <strong>4-Day Full Body</strong> split for balanced recovery and core movement adaptation.
              </p>
            </div>
          </div>
        )}

        {level === "intermediate" && (
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Training Frequency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {intermediateDayOptions.map((opt) => {
                const isSelected = days === opt.count;
                return (
                  <div
                    key={opt.count}
                    onClick={() => setDays(opt.count)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? "bg-slate-800 border-blue-500 shadow-md shadow-blue-500/15"
                        : "bg-slate-900/50 hover:bg-slate-800/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{opt.label}</span>
                      {isSelected && <span className="text-xs text-blue-400 font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{opt.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {level === "advanced" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Muscle Groups
              </label>
              <span className="text-xs text-red-400 font-bold">
                {selectedMuscles.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {muscleGroups.map((muscle) => {
                const isChecked = selectedMuscles.includes(muscle);
                return (
                  <div
                    key={muscle}
                    onClick={() => toggleMuscle(muscle)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border flex items-center justify-between gap-2 select-none ${
                      isChecked
                        ? "bg-slate-800 border-red-500 shadow-sm"
                        : "bg-slate-900/50 hover:bg-slate-800/60 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className={`text-xs font-semibold ${isChecked ? "text-white" : "text-slate-300"}`}>
                      {muscle}
                    </span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold transition-all ${
                      isChecked ? "bg-red-500 border-transparent text-white" : "border-white/20 text-transparent"
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
