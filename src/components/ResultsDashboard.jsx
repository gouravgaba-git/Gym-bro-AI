import React, { useState } from "react";
import InfoTemplate from "./infopage";
import { useAuth } from "../context/AuthContext";

const ResultsDashboard = ({ plan }) => {
  const { isAuthenticated, openAuthModal, logWorkoutSession } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);

  if (!plan) return null;

  const toggleDayComplete = async (dayIndex, dayName) => {
    if (!isAuthenticated) {
      openAuthModal("Please sign in to log completed workout sessions.");
      return;
    }

    if (completedDays.includes(dayIndex)) {
      setCompletedDays(completedDays.filter((i) => i !== dayIndex));
    } else {
      setCompletedDays([...completedDays, dayIndex]);
      try {
        await logWorkoutSession({ dayName, date: new Date().toISOString() });
      } catch (err) {
        console.warn("Log workout session error:", err.message);
      }
    }
  };

  const getTargetBadgeColor = (target) => {
    const t = target?.toLowerCase() || "";
    if (t.includes("chest")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (t.includes("back") || t.includes("lat")) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    if (t.includes("leg") || t.includes("quad") || t.includes("hamstring")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (t.includes("shoulder") || t.includes("delt")) return "bg-red-500/10 text-red-400 border-red-500/20";
    if (t.includes("arm") || t.includes("bicep") || t.includes("tricep")) return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    return "bg-slate-800 text-slate-300 border-slate-700";
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header & Badges */}
      <div className="bg-[#0f172a]/90 border border-white/10 rounded-2xl p-5 sm:p-7 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white">
              {plan.splitName || plan.splitType || "WORKOUT PLAN"}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/10">
              GOAL: {plan.goalLabel || plan.goal?.replace("_", " ") || "MUSCLE GAIN"}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/10">
              LEVEL: {plan.levelLabel || plan.level || "BEGINNER"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Your Training Split
          </h2>
          <p className="text-xs text-slate-400">
            Follow this progressive routine over your training cycle for consistent results.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 font-medium text-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🖨️</span>
            <span>Print Routine</span>
          </button>
        </div>
      </div>

      {/* Routine Days List */}
      <div className="space-y-5">
        {plan.days?.map((day, dIdx) => {
          const isCompleted = completedDays.includes(dIdx);
          return (
            <div
              key={dIdx}
              className={`bg-[#0f172a]/90 border rounded-2xl overflow-hidden shadow-lg backdrop-blur-xl transition-all duration-200 ${
                isCompleted ? "border-emerald-500/40 opacity-90" : "border-white/10"
              }`}
            >
              {/* Day Header */}
              <div className="bg-slate-900/80 border-b border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCompleted ? "bg-emerald-500 text-white" : "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  }`}>
                    {isCompleted ? "✓" : dIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {day.dayName}
                    </h3>
                    <span className="text-xs font-normal text-slate-400">
                      Focus: {day.targetSummary || "Compound Training"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleDayComplete(dIdx, day.dayName)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 border flex items-center gap-1.5 self-start sm:self-auto ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{isCompleted ? "✓ Completed" : "Mark Complete"}</span>
                </button>
              </div>

              {/* Responsive Exercises Container */}
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/40">
                      <th className="px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Exercise
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Target
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Sets & Reps
                      </th>
                      <th className="px-5 py-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase text-right">
                        Form Guide
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                    {day.exercises?.map((ex, eIdx) => (
                      <tr key={eIdx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-white text-sm block">
                            {ex.name}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border inline-block ${getTargetBadgeColor(ex.target)}`}>
                            {ex.target}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-blue-400 text-xs">
                            {ex.setsReps ? ex.setsReps : `${ex.sets || 3} sets × ${ex.reps || 10}`}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedExercise(ex)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 border border-white/10 hover:border-transparent text-slate-200 hover:text-white font-medium text-xs transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>📹</span>
                            <span>View Guide</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="sm:hidden divide-y divide-white/5">
                {day.exercises?.map((ex, eIdx) => (
                  <div key={eIdx} className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-white text-sm block">
                          {ex.name}
                        </span>
                        <span className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border inline-block ${getTargetBadgeColor(ex.target)}`}>
                          {ex.target}
                        </span>
                      </div>
                      <span className="font-bold text-blue-400 text-xs bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                        {ex.setsReps ? ex.setsReps : `${ex.sets || 3} sets × ${ex.reps || 10}`}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedExercise(ex)}
                      className="w-full py-2 rounded-lg bg-slate-800 hover:bg-blue-600 border border-white/10 text-slate-200 hover:text-white font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>📹</span>
                      <span>View Form Guide & Video</span>
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
