import React from "react";
import { Trophy, Zap, Flame, Dumbbell, CheckCircle2, Lock, Award } from "lucide-react";
import { cn } from "../../lib/utils";

export const Achievements = ({ user }) => {
  const workoutsCount = user?.workoutsCompleted || 0;
  const longestStreak = user?.longestStreak || user?.currentStreak || 0;

  const badges = [
    {
      title: "Pioneer Bro",
      icon: Trophy,
      desc: "Created & verified athlete profile",
      unlocked: true,
    },
    {
      title: "First Workout",
      icon: Zap,
      desc: "Completed 1st workout session",
      unlocked: workoutsCount >= 1,
    },
    {
      title: "Streak Master",
      icon: Flame,
      desc: "Achieved a 3+ day workout streak",
      unlocked: longestStreak >= 3,
    },
    {
      title: "Iron Lifter",
      icon: Dumbbell,
      desc: "Completed 10+ workout sessions",
      unlocked: workoutsCount >= 10,
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <section className="rounded-xl border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <Award className="size-4.5 text-muted-foreground" />
          <h2 className="font-medium tracking-tight text-foreground">
            Achievements & Milestones
          </h2>
        </div>
        <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          {unlockedCount} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 md:p-6">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={cn(
                "flex flex-col justify-between gap-3 rounded-lg border p-4 transition-colors",
                badge.unlocked
                  ? "border-border bg-secondary/30"
                  : "border-border/40 bg-background/50 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    badge.unlocked
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Icon className="size-4.5" />
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold",
                    badge.unlocked
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {badge.unlocked ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      <span>Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-3" />
                      <span>Locked</span>
                    </>
                  )}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  {badge.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {badge.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Achievements;
