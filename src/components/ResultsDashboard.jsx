import React, { useState } from "react";
import InfoTemplate from "./infopage";
import { useAuth } from "../context/AuthContext";

const ResultsDashboard = ({ plan }) => {
  const { isAuthenticated, openAuthModal, logWorkoutSession } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);

  if (!plan) return null;

  const toggleDayComplete = async (dayIndex, dayName, dayExercises) => {
    if (!isAuthenticated) {
      openAuthModal("Please sign in with Google to log completed workout sessions and track your streak! 🔥");
      return;
    }

    if (completedDays.includes(dayIndex)) {
      setCompletedDays(completedDays.filter((i) => i !== dayIndex));
    } else {
      setCompletedDays([...completedDays, dayIndex]);
      try {
        await logWorkoutSession({
          workoutName: dayName || `Day ${dayIndex + 1} Workout`,
          durationMinutes: 45,
          exercisesCount: dayExercises?.length || 4,
          setsCount: (dayExercises?.length || 4) * 3
        });
      } catch (err) {
        console.warn("Log workout session error:", err.message);
      }
    }
  };

  const getTargetBadgeColor = (target) => {
    const t = target?.toLowerCase() || "";
    if (t.includes("chest")) return "bg-red-500/10 text-red-400 border-red-500/30";
    if (t.includes("back") || t.includes("lat")) return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    if (t.includes("leg") || t.includes("quad") || t.includes("hamstring")) return "bg-[#bbf246]/10 text-[#bbf246] border-[#bbf246]/30";
    if (t.includes("shoulder") || t.includes("delt")) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    if (t.includes("arm") || t.includes("bicep") || t.includes("tricep")) return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dashboard Top Header & Badges */}
      <div className="bg-[#141c27] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#bbf246] text-[#0b1017] shadow-md shadow-[#bbf246]/20">
              {plan.splitName || plan.splitType || "WORKOUT PLAN"}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              GOAL: {plan.goalLabel || plan.goal?.replace("_", " ") || "MUSCLE GAIN"}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#bbf246]/20 text-[#bbf246] border border-[#bbf246]/30">
              LEVEL: {plan.levelLabel || plan.level || "BEGINNER"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Your Training Program
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Follow this progressive routine over your 6–8 week training cycle for consistent results.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-[#0b1017] hover:bg-[#1c2635] border border-white/10 text-slate-200 font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <span>🖨️</span>
            <span>Print Routine</span>
          </button>
        </div>
      </div>

      {/* Routine Days List */}
      <div className="space-y-6">
        {plan.days?.map((day, dIdx) => {
          const isCompleted = completedDays.includes(dIdx);
          return (
            <div
              key={dIdx}
              className={`bg-[#141c27] border rounded-3xl overflow-hidden shadow-xl backdrop-blur-xl transition-all duration-200 ${
                isCompleted ? "border-emerald-500/40 opacity-90" : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Day Header */}
              <div className="bg-[#0b1017] border-b border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                    isCompleted ? "bg-emerald-500 text-white" : "bg-[#bbf246] text-[#0b1017] shadow-md shadow-[#bbf246]/20"
                  }`}>
                    {isCompleted ? "✓" : dIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                      {day.dayName}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      Focus: {day.targetSummary || "Compound Training"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleDayComplete(dIdx, day.dayName, day.exercises)}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer shrink-0 border flex items-center gap-2 self-start sm:self-auto ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-[#bbf246] hover:text-[#0b1017] hover:border-transparent"
                  }`}
                >
                  <span>{isCompleted ? "✓ Completed" : "Mark Day Complete"}</span>
                </button>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#0b1017]/40">
                      <th className="px-6 py-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                        EXERCISE MOVEMENT
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                        TARGET MUSCLE
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                        SETS & REPS
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black tracking-widest text-slate-400 uppercase text-right">
                        FORM GUIDE & COACH
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-medium text-slate-200">
                    {day.exercises?.map((ex, eIdx) => (
                      <tr key={eIdx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-white text-sm block">
                            {ex.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${getTargetBadgeColor(ex.target)}`}>
                            {ex.target}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-black text-[#bbf246] text-sm">
                            {ex.setsReps ? ex.setsReps : `${ex.sets || 3} sets × ${ex.reps || 10}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedExercise(ex)}
                            className="px-4 py-2 rounded-xl bg-[#0b1017] hover:bg-[#bbf246] hover:text-[#0b1017] border border-white/10 hover:border-transparent text-slate-200 font-extrabold text-xs transition-all duration-200 cursor-pointer shadow-sm inline-flex items-center gap-2"
                          >
                            <span>⚡</span>
                            <span>LET'S WORKOUT</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View (100% Mobile Responsive) */}
              <div className="sm:hidden divide-y divide-white/5">
                {day.exercises?.map((ex, eIdx) => (
                  <div key={eIdx} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-black text-white text-sm block">
                          {ex.name}
                        </span>
                        <span className={`mt-1.5 px-3 py-1 rounded-full text-[10px] font-bold border inline-block ${getTargetBadgeColor(ex.target)}`}>
                          {ex.target}
                        </span>
                      </div>
                      <span className="font-black text-[#bbf246] text-xs bg-[#bbf246]/10 px-2.5 py-1 rounded-xl border border-[#bbf246]/20">
                        {ex.setsReps ? ex.setsReps : `${ex.sets || 3} sets × ${ex.reps || 10}`}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedExercise(ex)}
                      className="w-full py-2.5 rounded-xl bg-[#0b1017] hover:bg-[#bbf246] hover:text-[#0b1017] border border-white/10 text-slate-200 font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>⚡</span>
                      <span>LET'S WORKOUT & VIEW GUIDE</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Modal Portal */}
      {selectedExercise && (
        <InfoTemplate
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
};

export default ResultsDashboard;
