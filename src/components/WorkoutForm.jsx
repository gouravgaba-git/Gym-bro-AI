import React from "react";
import {
  ArrowRight,
  Dumbbell,
  Flame,
  Info,
  RotateCcw,
  Sparkles,
  Zap,
  Loader2,
} from "lucide-react";
import LevelController from "./LevelController";
import { cn } from "../lib/utils";

const goals = [
  {
    id: "muscle_gain",
    stitchId: "muscle",
    label: "Muscle Gain",
    icon: Dumbbell,
    description: "Optimize for hypertrophy, volume, and clean muscle mass retention.",
  },
  {
    id: "fat_loss",
    stitchId: "fatloss",
    label: "Fat Loss",
    icon: Flame,
    description: "High energy output, circuit sets, and metabolic conditioning.",
  },
  {
    id: "strength",
    stitchId: "strength",
    label: "Strength",
    icon: Zap,
    description: "Focus on low reps, heavy compound movements, and neural drive.",
  },
];

const levels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const tips = {
  beginner:
    "Full Body Locked: Beginners excel on 3–4 day full-body splits for maximum recovery, neural adaptation, and consistent progress.",
  intermediate:
    "Upper/Lower Recommended: You are ready for a 4-day upper/lower split to push frequency while keeping recovery in check.",
  advanced:
    "Push/Pull/Legs Unlocked: Advanced lifters thrive on a 5–6 day PPL split with targeted volume per muscle group.",
};

function StepBadge({ n }) {
  return (
    <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
      {n}
    </span>
  );
}

export function WorkoutForm({
  goal,
  setGoal,
  level,
  setLevel,
  days,
  setDays,
  selectedMuscles,
  setSelectedMuscles,
  onSubmit,
  isGenerating,
}) {
  // Normalize goal identifier (handle both 'muscle_gain' and 'muscle', etc.)
  const normalizedGoal =
    goal === "muscle" ? "muscle_gain" : goal === "fatloss" ? "fat_loss" : goal;

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    if (newLevel === "beginner") {
      setDays(null);
      setSelectedMuscles([]);
    } else if (newLevel === "intermediate") {
      setDays("4"); // default 4-day
      setSelectedMuscles([]);
    } else if (newLevel === "advanced") {
      setDays(null);
      setSelectedMuscles(["Chest", "Back", "Legs"]); // default suggested
    }
  };

  const handleReset = () => {
    setGoal("muscle_gain");
    setLevel("beginner");
    setDays(null);
    setSelectedMuscles([]);
  };

  const isFormValid = () => {
    if (!normalizedGoal) return false;
    if (level === "intermediate" && !days) return false;
    if (level === "advanced" && (!selectedMuscles || selectedMuscles.length === 0))
      return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid() && !isGenerating) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* Step 1: Choose Fitness Goal */}
      <section className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs">
        <div className="mb-4 flex items-center gap-2.5">
          <StepBadge n={1} />
          <h2 className="text-base font-medium tracking-tight text-foreground">
            Choose Fitness Goal
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {goals.map((g) => {
            const Icon = g.icon;
            const selected =
              normalizedGoal === g.id || normalizedGoal === g.stitchId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id)}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-5 text-center transition-all cursor-pointer",
                  selected
                    ? "border-foreground bg-secondary/70 shadow-xs ring-1 ring-foreground/10"
                    : "border-border bg-background hover:border-foreground/30 hover:bg-secondary/30"
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg transition-colors",
                    selected
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground"
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="font-semibold text-sm tracking-tight text-foreground">
                  {g.label}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                  {g.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Choose Experience Level */}
      <section className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-xs">
        <div className="mb-4 flex items-center gap-2.5">
          <StepBadge n={2} />
          <h2 className="text-base font-medium tracking-tight text-foreground">
            Choose Experience Level
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-1 rounded-lg border border-border bg-secondary/40 p-1 sm:grid-cols-3">
          {levels.map((l) => {
            const selected = level === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => handleLevelChange(l.id)}
                aria-pressed={selected}
                className={cn(
                  "rounded-md px-4 py-2.5 text-sm font-semibold tracking-tight transition-all cursor-pointer border-0",
                  selected
                    ? "bg-background text-foreground shadow-xs"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-secondary/30 px-4 py-3">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty m-0">
            {tips[level] || tips.beginner}
          </p>
        </div>
      </section>

      {/* Step 3: LevelController (for Intermediate / Advanced) */}
      <LevelController
        level={level}
        days={days}
        setDays={setDays}
        selectedMuscles={selectedMuscles}
        setSelectedMuscles={setSelectedMuscles}
      />

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row pt-1">
        <button
          type="submit"
          disabled={isGenerating}
          className={cn(
            "group flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-3 text-sm font-semibold tracking-tight text-background transition-all hover:opacity-90 cursor-pointer border-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Generating Custom Workout Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>Generate Workout Plan</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isGenerating}
          className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium tracking-tight text-foreground transition-colors hover:bg-secondary cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="size-4" />
          <span>Reset</span>
        </button>
      </div>
    </form>
  );
}

export default WorkoutForm;
