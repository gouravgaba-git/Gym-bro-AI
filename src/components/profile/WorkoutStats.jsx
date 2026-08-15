import React from "react";
import { Dumbbell, Flame, Trophy, Target } from "lucide-react";

export const WorkoutStats = ({ user }) => {
  const goalText = (user?.fitnessGoal || "muscle_gain").replace("_", " ");

  const stats = [
    {
      label: "Workouts logged",
      value: String(user?.workoutsCompleted || 0),
      icon: Dumbbell,
    },
    {
      label: "Current streak",
      value: `${user?.currentStreak || 0} ${user?.currentStreak === 1 ? "day" : "days"}`,
      icon: Flame,
    },
    {
      label: "Personal record streak",
      value: `${user?.longestStreak || user?.currentStreak || 0} ${user?.longestStreak === 1 ? "day" : "days"}`,
      icon: Trophy,
    },
    {
      label: "Primary fitness goal",
      value: goalText,
      icon: Target,
      isCapitalize: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <p
                className={`text-2xl font-semibold tracking-tight text-foreground ${
                  s.isCapitalize ? "capitalize text-lg" : ""
                }`}
              >
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkoutStats;
