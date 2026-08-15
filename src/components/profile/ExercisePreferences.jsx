import React from "react";
import { Edit3 } from "lucide-react";

export const ExercisePreferences = ({ user, onEdit }) => {
  const goalLabels = {
    muscle_gain: "Muscle Gain",
    fat_loss: "Fat Loss",
    strength: "Raw Strength",
  };

  const levelLabels = {
    beginner: "Beginner (Full Body Focus)",
    intermediate: "Intermediate (Upper / Lower)",
    advanced: "Advanced (PPL / Custom)",
  };

  const details = [
    {
      label: "Primary Goal",
      value:
        goalLabels[user?.fitnessGoal] ||
        (user?.fitnessGoal ? user.fitnessGoal.replace("_", " ") : "Muscle Gain"),
    },
    {
      label: "Experience Level",
      value:
        levelLabels[user?.experienceLevel] || user?.experienceLevel || "Intermediate",
    },
    {
      label: "Preferred Workout Type",
      value:
        user?.fitnessGoal === "fat_loss"
          ? "HIIT & Conditioning"
          : user?.fitnessGoal === "strength"
          ? "Heavy Compound & Power"
          : "Hypertrophy & Volume",
    },
    {
      label: "Activity Level",
      value: user?.activityLevel || "Moderate (3–5 days/week)",
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6">
        <h2 className="font-medium tracking-tight text-foreground">Training Preferences</h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-0"
          >
            <Edit3 className="size-3.5" />
            <span>Edit</span>
          </button>
        )}
      </div>
      <dl className="divide-y divide-border m-0 p-0">
        {details.map((d) => (
          <div
            key={d.label}
            className="flex items-center justify-between gap-4 px-5 py-3.5 md:px-6"
          >
            <dt className="text-sm text-muted-foreground">{d.label}</dt>
            <dd className="text-sm font-medium tracking-tight text-foreground m-0">
              {d.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ExercisePreferences;
