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
    { count: 3, label: "3 Days / Wk", desc: "Full Body / PPL Hybrid" },
    { count: 4, label: "4 Days / Wk", desc: "Upper / Lower Split" },
    { count: 5, label: "5 Days / Wk", desc: "Push / Pull / Legs + Upper" },
    { count: 6, label: "6 Days / Wk", desc: "Push / Pull / Legs x2" }
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
      <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-[#0b1017] border border-white/10 shadow-inner">
        {levels.map((lvl) => {
          const isSelected = level === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setLevel(lvl.id)}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                isSelected
                  ? "bg-[#bbf246] text-[#0b1017] shadow-md shadow-[#bbf246]/20 scale-[1.02]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{lvl.label}</span>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${
                isSelected ? "text-[#0b1017]/80" : "text-slate-500"
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
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 backdrop-blur-md shadow-md">
            <span className="text-xl shrink-0">💡</span>
            <div className="space-y-1">
              <div className="font-bold text-xs text-cyan-400 uppercase tracking-wide">
                Full Body Preset Locked
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Beginners excel best on <strong>4-Day Full Body</strong> splits for balanced recovery and core movement adaptation.
              </p>
            </div>
          </div>
        )}

        {level === "intermediate" && (
          <div className="space-y-3">
            <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              Select Weekly Training Frequency
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {intermediateDayOptions.map((opt) => {
                const isSelected = days === opt.count;
                return (
                  <div
                    key={opt.count}
                    onClick={() => setDays(opt.count)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between gap-2 ${
                      isSelected
                        ? "bg-[#1c2635] border-[#bbf246] shadow-md shadow-[#bbf246]/10 scale-[1.02]"
                        : "bg-[#0b1017]/60 hover:bg-[#1c2635]/80 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">{opt.label}</span>
                      {isSelected && <span className="text-xs text-[#bbf246] font-bold">✓</span>}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{opt.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {level === "advanced" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Select Target Muscle Groups
              </label>
              <span className="text-xs text-[#bbf246] font-extrabold">
                {selectedMuscles.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {muscleGroups.map((muscle) => {
                const isChecked = selectedMuscles.includes(muscle);
                return (
                  <div
                    key={muscle}
                    onClick={() => toggleMuscle(muscle)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center justify-between gap-2 select-none ${
                      isChecked
                        ? "bg-[#1c2635] border-[#bbf246] shadow-sm"
                        : "bg-[#0b1017]/60 hover:bg-[#1c2635]/80 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className={`text-xs font-bold ${isChecked ? "text-white" : "text-slate-300"}`}>
                      {muscle}
                    </span>
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-black transition-all ${
                      isChecked ? "bg-[#bbf246] border-transparent text-[#0b1017] shadow-sm" : "border-white/20 text-transparent"
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
