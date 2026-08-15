import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Dumbbell,
  Info,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  ChevronRight
} from "lucide-react";
import { useWorkout } from "../context/WorkoutContext";
import InfoTemplate from "../components/infopage";
import { PageHeader } from "../components/common/PageHeader";
import { cn } from "../lib/utils";

const WorkoutPlanPage = () => {
  const { workoutPlan } = useWorkout();
  const navigate = useNavigate();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const tabsContainerRef = useRef(null);

  // Default to Day 1 whenever a new workout plan is loaded
  useEffect(() => {
    setSelectedDayIndex(0);
  }, [workoutPlan]);

  // If no plan is available, show a helpful empty state matching Stitch
  if (!workoutPlan || !workoutPlan.days || workoutPlan.days.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 animate-in fade-in duration-200">
        <PageHeader
          title="Workout Plan"
          description="Your personalized AI training routine and movement protocols."
        />

        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center shadow-xs md:p-14">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground mb-4">
            <Dumbbell className="size-7" />
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">
            No Workout Plan Generated Yet
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
            You haven't generated a routine yet. Select your fitness goal and experience level to generate an AI-customized split.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold tracking-tight text-background transition-opacity hover:opacity-90 cursor-pointer border-0 shadow-sm"
          >
            <Sparkles className="size-4" />
            <span>Generate Plan on Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const { splitName, goalLabel, levelLabel, days } = workoutPlan;
  const safeDayIndex = Math.min(selectedDayIndex, days.length - 1);
  const activeDay = days[safeDayIndex] || days[0];

  return (
    <div className="mx-auto flex w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 animate-in fade-in duration-200">
      {/* Exercise Details & AI Coach Modal */}
      {selectedExercise && (
        <InfoTemplate
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Hero Header & Plan Metadata */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-md bg-foreground px-2.5 py-0.5 text-xs font-semibold text-background">
                {splitName || "Custom Split"}
              </span>
              <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {goalLabel || "Hypertrophy"}
              </span>
              <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                {levelLabel || "All Levels"}
              </span>
              <span className="rounded-md bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {days.length} Days Split
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mt-1">
              Your Custom Training Routine
            </h1>
            <p className="text-sm text-muted-foreground">
              Follow this structure for the next 6–8 weeks for optimal muscular adaptations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium tracking-tight text-foreground transition-colors hover:bg-secondary cursor-pointer shrink-0 w-fit"
            title="Modify goals and regenerate plan"
          >
            <ArrowLeft className="size-4" />
            <span>Modify Plan</span>
          </button>
        </div>
      </div>

      {/* Dynamic Day Selector Tabs Bar */}
      <div className="w-full overflow-x-auto pb-1 no-scrollbar">
        <div
          ref={tabsContainerRef}
          role="tablist"
          aria-label="Workout Days"
          className="flex gap-2 min-w-max p-1 rounded-xl border border-border bg-secondary/30"
        >
          {days.map((day, idx) => {
            const isSelected = safeDayIndex === idx;
            const cleanFocus = day.name
              ? day.name.replace(/^Day\s*\d+\s*\(?/i, "").replace(/\)$/, "").trim() || `Session ${idx + 1}`
              : `Session ${idx + 1}`;

            return (
              <button
                key={idx}
                id={`day-tab-${idx + 1}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`workout-day-panel-${idx + 1}`}
                onClick={() => setSelectedDayIndex(idx)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-all cursor-pointer border-0",
                  isSelected
                    ? "bg-background text-foreground font-semibold shadow-xs ring-1 ring-border"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-foreground">
                  {idx + 1}
                </span>
                <span className="tracking-tight">{cleanFocus}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day's Workout Details */}
      <section
        id={`workout-day-panel-${safeDayIndex + 1}`}
        role="tabpanel"
        aria-labelledby={`day-tab-${safeDayIndex + 1}`}
        className="rounded-xl border border-border bg-card shadow-xs overflow-hidden"
      >
        {/* Day Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-border px-5 py-4 md:px-6">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
              <span>{activeDay.name || `Day ${safeDayIndex + 1}`}</span>
              {activeDay.focus && (
                <span className="text-xs font-normal text-muted-foreground hidden sm:inline">
                  · {activeDay.focus}
                </span>
              )}
            </h2>
            {activeDay.focus && (
              <p className="text-xs text-muted-foreground sm:hidden mt-0.5">
                {activeDay.focus}
              </p>
            )}
          </div>
          <span className="w-fit rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {activeDay.exercises?.length || 0} Exercises Scheduled
          </span>
        </div>

        {/* Desktop / Tablet Exercise Table (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Exercise</th>
                <th className="px-6 py-3.5">Target Muscle</th>
                <th className="px-6 py-3.5">Sets × Reps</th>
                <th className="px-6 py-3.5 text-right">Movement & AI HUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeDay.exercises &&
                activeDay.exercises.map((ex, exIdx) => (
                  <tr
                    key={exIdx}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold tracking-tight text-foreground">
                      {ex.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                        <Target className="size-3 text-muted-foreground" />
                        {ex.target}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {ex.setsReps}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedExercise(ex)}
                        aria-label={`Open Movement Guide and AI Coach for ${ex.name}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer border-0 shadow-2xs"
                      >
                        <Sparkles className="size-3.5" />
                        <span>Get Info & AI Form</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Exercise Cards (< 768px) */}
        <div className="flex flex-col divide-y divide-border md:hidden">
          {activeDay.exercises &&
            activeDay.exercises.map((ex, exIdx) => (
              <div key={exIdx} className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm tracking-tight text-foreground">
                      {ex.name}
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {ex.target}
                    </span>
                  </div>
                  <span className="rounded-md bg-secondary/80 px-2.5 py-1 text-xs font-semibold text-foreground">
                    {ex.setsReps}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedExercise(ex)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-xs font-semibold text-background transition-opacity hover:opacity-90 cursor-pointer border-0 shadow-xs mt-1"
                >
                  <Sparkles className="size-3.5" />
                  <span>View Guide & Launch AI Form Check</span>
                </button>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default WorkoutPlanPage;
