import React from "react";
import { Check, Info } from "lucide-react";
import { cn } from "../lib/utils";

const ADVANCED_MUSCLES = [
  { id: "Chest", label: "Chest", desc: "Pectorals & pushing power" },
  { id: "Back", label: "Back", desc: "Lats, rhomboids & traps" },
  { id: "Shoulders", label: "Shoulders", desc: "Deltoids & overhead drive" },
  { id: "Legs", label: "Legs", desc: "Quads, hamstrings & calves" },
  { id: "Arms", label: "Arms", desc: "Biceps & triceps isolation" },
  { id: "Core", label: "Core", desc: "Abs, obliques & lower back" },
];

const SPLIT_OPTIONS = [
  { id: "3", label: "3 Day Split", desc: "Push / Pull / Legs (PPL)" },
  { id: "4", label: "4 Day Split", desc: "Upper / Lower Routine" },
  { id: "5", label: "5 Day Split", desc: "PPL + Upper/Lower Hybrid" },
  { id: "6", label: "6 Day Split", desc: "High Volume PPL x2" },
];

function StepBadge({ n }) {
  return (
    <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
      {n}
    </span>
  );
}

export const LevelController = ({
  level,
  days,
  setDays,
  selectedMuscles,
  setSelectedMuscles,
}) => {
  // Beginner view is self-contained with info tip in step 2
  if (level === "beginner") {
    return null;
  }

  // Intermediate view: Frequency selection
  if (level === "intermediate") {
    return (
      <section className="rounded-xl border border-border bg-card p-5 md:p-6 lg:p-7 transition-all animate-in fade-in duration-200 shadow-xs">
        <div className="mb-4 flex items-center gap-2.5">
          <StepBadge n={3} />
          <h2 className="text-base font-medium tracking-tight text-foreground">
            Choose Weekly Frequency
          </h2>
        </div>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SPLIT_OPTIONS.map((opt) => {
            const isSelected = days === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDays(opt.id)}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border p-4 lg:p-5 text-left transition-colors cursor-pointer",
                  isSelected
                    ? "border-foreground bg-secondary/70 shadow-xs"
                    : "border-border bg-background hover:border-foreground/30 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-sm tracking-tight text-foreground">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  // Advanced view: Target muscle groups selection
  if (level === "advanced") {
    const handleToggleMuscle = (muscleId) => {
      const currentSelected = selectedMuscles || [];
      if (currentSelected.includes(muscleId)) {
        setSelectedMuscles(currentSelected.filter((m) => m !== muscleId));
      } else {
        setSelectedMuscles([...currentSelected, muscleId]);
      }
    };

    return (
      <section className="rounded-xl border border-border bg-card p-5 md:p-6 lg:p-7 transition-all animate-in fade-in duration-200 shadow-xs">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <StepBadge n={3} />
            <h2 className="text-base font-medium tracking-tight text-foreground">
              Select Target Muscle Groups
            </h2>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {selectedMuscles?.length || 0} selected
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Select target muscle groups to custom-tailor your hypertrophic splits.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6">
          {ADVANCED_MUSCLES.map((muscle) => {
            const isSelected = (selectedMuscles || []).includes(muscle.id);
            return (
              <button
                key={muscle.id}
                type="button"
                onClick={() => handleToggleMuscle(muscle.id)}
                aria-pressed={isSelected}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3.5 lg:p-4 text-left transition-colors cursor-pointer",
                  isSelected
                    ? "border-foreground bg-secondary/70 shadow-xs"
                    : "border-border bg-background hover:border-foreground/30 hover:bg-secondary/30"
                )}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-semibold text-sm tracking-tight text-foreground">
                    {muscle.label}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {muscle.desc}
                  </span>
                </div>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-secondary/50 text-transparent"
                  )}
                >
                  <Check className="size-3 stroke-[3]" />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return null;
};

export default LevelController;
