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
      openAuthModal("Please sign in with Google to log completed workout sessions and track your athletic streak! 🔥");
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
    if (t.includes("chest")) return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    if (t.includes("back") || t.includes("lat")) return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    if (t.includes("leg") || t.includes("quad") || t.includes("hamstring")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (t.includes("shoulder") || t.includes("delt")) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    if (t.includes("arm") || t.includes("bicep") || t.includes("tricep")) return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    return "bg-gray-500/10 text-gray-300 border-gray-500/30";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dashboard Top Header & Badges */}
      <div className="bg-[#0d1322]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white shadow-md shadow-[#ff4b2b]/20">
              {plan.splitName || plan.splitType || "HYPERTROPHY SPLIT"}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
              GOAL: {plan.goalLabel || plan.goal?.replace("_", " ") || "MUSCLE GAIN"}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              LEVEL: {plan.levelLabel || plan.level || "BEGINNER"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Your Custom AI Athletic Routine
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Follow this progressive overload structure for the next 6–8 weeks for optimal hypertrophic gains.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
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
              className={`bg-[#0d1322]/90 border rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
                isCompleted ? "border-emerald-500/40 opacity-90" : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Day Header */}
              <div className="bg-[#121929] border-b border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                    isCompleted ? "bg-emerald-500 text-white" : "bg-gradient-to-tr from-[#ff416c] to-[#ff4b2b] text-white shadow-md shadow-[#ff4b2b]/20"
                  }`}>
                    {isCompleted ? "✓" : dIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      {day.dayName}
                    </h3>
                    <span className="text-xs font-semibold text-gray-400">
                      Focus: {day.targetSummary || "Compound Overload"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleDayComplete(dIdx, day.dayName)}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer shrink-0 border flex items-center gap-2 ${
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{isCompleted ? "✓ Completed" : "Mark Day Complete"}</span>
                </button>
              </div>

              {/* Exercise Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="px-6 py-4 text-[11px] font-black tracking-widest text-gray-400 uppercase">
                        EXERCISE MOVEMENT
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black tracking-widest text-gray-400 uppercase">
                        TARGET MUSCLE
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black tracking-widest text-gray-400 uppercase">
                        SETS & REPS
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black tracking-widest text-gray-400 uppercase text-right">
                        FORM GUIDE & COACH
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-medium text-gray-200">
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
                          <span className="font-extrabold text-[#ff4b2b] text-sm">
                            {ex.setsReps ? ex.setsReps : `${ex.sets || 3} sets × ${ex.reps || 10}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedExercise(ex)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#162035] hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b] border border-white/10 hover:border-transparent text-gray-200 hover:text-white font-bold text-xs transition-all duration-300 cursor-pointer shadow-sm inline-flex items-center gap-1.5"
                          >
                            <span>⚡</span>
                            <span>Guide & AI Coach</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
